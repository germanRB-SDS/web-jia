"""
The horse that pulls the Jornadas wagon along the «Programa» road ([69-0]). Runs in Blender 5.2 LTS without the UI:

    /Applications/Blender.app/Contents/MacOS/Blender -b --python assets/3d/caballo/make-caballo.py [-- --preview]

Writes caballo.blend and caballo.glb next to this file (build-assets.sh copies the GLB to public/programa/). With
--preview it also renders previews/ (top and three-quarter views beside the wagon, ../carruaje/jia-carruaje.glb).

Model space, the same as the wagon's (assets/3d/carruaje): metres, +Y forward, +X right, +Z up, ground at Z = 0; the
glTF export turns +Y forward into -Z. The origin is the middle of the horse's body on the ground: the point that runs
on the road. The two shafts belong to the horse and reach back to the wagon's front axle, REACH metres behind the
origin, where they meet the front bolster (the wagon steers so that its front axle points at the horse).

Articulated nodes (the page animates them; no baked animation):
  JIA_Horse_ROOT
    JIA_Horse_Shafts                       the two wooden shafts (do not bob)
    JIA_Horse_BodyMotion                   pivot in the middle of the barrel: bob, pitch and roll
      JIA_Horse_Body                       barrel, chest, rump, collar and back band
      JIA_Horse_Neck → JIA_Horse_Head      pivots at the withers and at the poll
      JIA_Horse_Tail                       pivot at the dock
      JIA_Horse_Leg_{FL,FR,HL,HR}          pivot at the shoulder / hip, swing about X
        JIA_Horse_Shin_{..}                pivot at the knee / hock, bend about X (hoof included)
"""
import math
import os
import sys
import bpy
import bmesh
from mathutils import Matrix, Vector

HERE = os.path.dirname(os.path.abspath(__file__))
PREVIEW = "--preview" in sys.argv

REACH = 2.1           # horse origin → wagon front axle (m); the page reads it from config.ts, keep both equal
SHAFT_GAUGE = 0.5     # half the distance between the shafts at the axle
COLOURS = {           # sRGB; the wagon's woods and iron (carruaje-config.json) plus the coat
    "JIA_Horse_Coat": ("#9A6238", 0.78),
    "JIA_Horse_Dark": ("#2F1F14", 0.7),
    "JIA_Horse_Blaze": ("#F7EDDB", 0.85),
    "JIA_Leather": ("#4A2E1A", 0.6),
    "JIA_Wood_Honey": ("#C48B4F", 0.72),
}


def linear(hexcode):
    c = [int(hexcode[i:i + 2], 16) / 255 for i in (1, 3, 5)]
    return [v / 12.92 if v <= 0.04045 else ((v + 0.055) / 1.055) ** 2.4 for v in c] + [1.0]


def material(name):
    if name in bpy.data.materials:
        return bpy.data.materials[name]
    hexcode, rough = COLOURS[name]
    m = bpy.data.materials.new(name)
    bsdf = m.node_tree.nodes.get("Principled BSDF")
    bsdf.inputs["Base Color"].default_value = linear(hexcode)
    bsdf.inputs["Roughness"].default_value = rough
    bsdf.inputs["Metallic"].default_value = 0.0
    m.diffuse_color = linear(hexcode)
    return m


# ---------------------------------------------------------------- shapes (world space, into a bmesh)

def ellipsoid(bm, centre, radii, segs=20, rings=12):
    geom = bmesh.ops.create_uvsphere(bm, u_segments=segs, v_segments=rings, radius=1.0)
    vs = geom["verts"]
    bmesh.ops.scale(bm, vec=Vector(radii), verts=vs)
    bmesh.ops.translate(bm, vec=Vector(centre), verts=vs)
    return vs


def tube(bm, p0, p1, r0, r1, segs=12, squash=1.0, roll=0.0):
    """A frustum from p0 (radius r0) to p1 (radius r1), squashed across X by `squash`, capped."""
    p0, p1 = Vector(p0), Vector(p1)
    axis = p1 - p0
    geom = bmesh.ops.create_cone(bm, cap_ends=True, cap_tris=False, segments=segs, radius1=r0, radius2=r1, depth=axis.length)
    vs = geom["verts"]
    bmesh.ops.scale(bm, vec=Vector((squash, 1.0, 1.0)), verts=vs)
    bmesh.ops.rotate(bm, cent=Vector(), matrix=Matrix.Rotation(roll, 3, "Z"), verts=vs)
    rot = Vector((0, 0, 1)).rotation_difference(axis.normalized()).to_matrix()
    bmesh.ops.rotate(bm, cent=Vector(), matrix=rot, verts=vs)
    bmesh.ops.translate(bm, vec=(p0 + p1) / 2, verts=vs)
    return vs


def torus(bm, centre, major, minor, tilt, segs=20, ring=8, squash=0.8):
    """A ring around the Y axis (a collar), leaning back by `tilt` radians."""
    verts = []
    for i in range(segs):
        a = 2 * math.pi * i / segs
        row = []
        for j in range(ring):
            b = 2 * math.pi * j / ring
            r = major + minor * math.cos(b)
            v = Vector((r * math.cos(a) * squash, minor * math.sin(b), r * math.sin(a)))
            v = Matrix.Rotation(-tilt, 3, "X") @ v
            row.append(bm.verts.new(v + Vector(centre)))
        verts.append(row)
    for i in range(segs):
        for j in range(ring):
            a, b = verts[i][j], verts[(i + 1) % segs][j]
            c, d = verts[(i + 1) % segs][(j + 1) % ring], verts[i][(j + 1) % ring]
            bm.faces.new((a, b, c, d))
    return [v for row in verts for v in row]


class Part:
    """One node: its shapes are authored in world space and stored relative to `pivot`."""

    def __init__(self, name, pivot, parent=None):
        self.name, self.pivot, self.parent = name, Vector(pivot), parent
        self.chunks = []  # (bmesh, material name)

    def add(self, mat, build):
        bm = bmesh.new()
        build(bm)
        self.chunks.append((bm, mat))
        return self

    def make(self):
        mesh = bpy.data.meshes.new(self.name)
        bm = bmesh.new()
        mats = []
        for chunk, mat in self.chunks:
            if mat not in mats:
                mats.append(mat)
            idx = mats.index(mat)
            tmp = bpy.data.meshes.new("tmp")
            chunk.to_mesh(tmp)
            offset = len(bm.verts)
            bm.from_mesh(tmp)
            bm.verts.ensure_lookup_table()
            bm.faces.ensure_lookup_table()
            for f in bm.faces:
                if f.verts[0].index >= offset:
                    f.material_index = idx
            bm.verts.index_update()
            bpy.data.meshes.remove(tmp)
        bmesh.ops.translate(bm, vec=-self.pivot, verts=bm.verts)
        bm.to_mesh(mesh)
        bm.free()
        for m in mats:
            mesh.materials.append(material(m))
        for p in mesh.polygons:
            p.use_smooth = True
        obj = bpy.data.objects.new(self.name, mesh)
        bpy.context.scene.collection.objects.link(obj)
        place(obj, self.pivot, self.parent)
        return obj


def place(obj, pivot, parent):
    if parent is not None:
        obj.parent = parent
        obj.location = Vector(pivot) - world_pivot(parent)
    else:
        obj.location = pivot


def world_pivot(obj):
    p = Vector(obj.location)
    while obj.parent is not None:
        obj = obj.parent
        p += obj.location
    return p


def empty(name, pivot, parent=None):
    obj = bpy.data.objects.new(name, None)
    obj.empty_display_size = 0.2
    bpy.context.scene.collection.objects.link(obj)
    place(obj, Vector(pivot), parent)
    return obj


# ---------------------------------------------------------------- the horse

def build():
    for o in list(bpy.data.objects):
        bpy.data.objects.remove(o, do_unlink=True)
    for m in list(bpy.data.meshes):
        bpy.data.meshes.remove(m)

    root = empty("JIA_Horse_ROOT", (0, 0, 0))

    def shafts(bm):
        for s in (-1, 1):
            tube(bm, (s * 0.31, 0.8, 1.08), (s * SHAFT_GAUGE, -REACH, 0.42), 0.032, 0.036, segs=8)
            # The iron tip and the loop at the back band that carries it.
            tube(bm, (s * 0.31, 0.8, 1.08), (s * 0.305, 0.86, 1.1), 0.036, 0.03, segs=8)
    Part("JIA_Horse_Shafts", (0, 0, 0), root).add("JIA_Wood_Honey", shafts).make()

    motion = empty("JIA_Horse_BodyMotion", (0, 0, 1.0), root)

    def barrel(bm):
        ellipsoid(bm, (0, 0.0, 1.0), (0.27, 0.66, 0.29))
        ellipsoid(bm, (0, 0.46, 1.04), (0.25, 0.3, 0.31))
        ellipsoid(bm, (0, -0.5, 1.06), (0.28, 0.32, 0.3))
    body = Part("JIA_Horse_Body", (0, 0, 1.0), motion).add("JIA_Horse_Coat", barrel)
    body.add("JIA_Leather", lambda bm: torus(bm, (0, 0.66, 1.2), 0.2, 0.045, math.radians(28)))
    # The back band (saddle pad and girth) that the shafts hang from.
    body.add("JIA_Leather", lambda bm: torus(bm, (0, 0.22, 1.0), 0.27, 0.035, 0.0, segs=24, ring=6, squash=1.05))
    body.make()

    neck = Part("JIA_Horse_Neck", (0, 0.58, 1.18), motion)
    neck.add("JIA_Horse_Coat", lambda bm: tube(bm, (0, 0.5, 1.12), (0, 0.95, 1.62), 0.2, 0.12, squash=0.62))
    neck.add("JIA_Horse_Dark", lambda bm: tube(bm, (0, 0.5, 1.33), (0, 0.9, 1.76), 0.06, 0.05, segs=8, squash=0.45))
    neck_obj = neck.make()

    head = Part("JIA_Horse_Head", (0, 0.93, 1.64), neck_obj)
    head.add("JIA_Horse_Coat", lambda bm: tube(bm, (0, 0.9, 1.66), (0, 1.4, 1.38), 0.12, 0.075, squash=0.78))
    head.add("JIA_Horse_Coat", lambda bm: ellipsoid(bm, (0, 0.98, 1.6), (0.1, 0.12, 0.12), 14, 8))
    head.add("JIA_Horse_Blaze", lambda bm: tube(bm, (0, 1.0, 1.7), (0, 1.36, 1.46), 0.03, 0.022, segs=8, squash=0.9))
    for s in (-1, 1):
        head.add("JIA_Horse_Dark", lambda bm, s=s: tube(bm, (s * 0.06, 0.9, 1.74), (s * 0.075, 0.88, 1.86), 0.03, 0.006, segs=6))
    head.add("JIA_Leather", lambda bm: tube(bm, (0, 1.24, 1.47), (0, 1.27, 1.45), 0.098, 0.098, segs=12, squash=0.85))
    head.make()

    tail = Part("JIA_Horse_Tail", (0, -0.78, 1.2), motion)
    tail.add("JIA_Horse_Dark", lambda bm: tube(bm, (0, -0.76, 1.22), (0, -1.02, 0.56), 0.07, 0.035, segs=10, squash=0.7))
    tail.make()

    legs = {
        # name: (x, shoulder/hip y, knee/hock y, hoof y, upper radius)
        "FL": (-0.15, 0.46, 0.48, 0.48, 0.1),
        "FR": (0.15, 0.46, 0.48, 0.48, 0.1),
        "HL": (-0.16, -0.5, -0.6, -0.54, 0.13),
        "HR": (0.16, -0.5, -0.6, -0.54, 0.13),
    }
    for key, (x, y0, y1, y2, r) in legs.items():
        upper = Part(f"JIA_Horse_Leg_{key}", (x, y0, 0.98), motion)
        upper.add("JIA_Horse_Coat", lambda bm, x=x, y0=y0, y1=y1, r=r: tube(bm, (x, y0, 1.02), (x, y1, 0.52), r, 0.055))
        upper_obj = upper.make()
        shin = Part(f"JIA_Horse_Shin_{key}", (x, y1, 0.52), upper_obj)
        shin.add("JIA_Horse_Coat", lambda bm, x=x, y1=y1: ellipsoid(bm, (x, y1, 0.52), (0.055, 0.06, 0.06), 10, 6))
        shin.add("JIA_Horse_Coat", lambda bm, x=x, y1=y1, y2=y2: tube(bm, (x, y1, 0.52), (x, y2, 0.08), 0.048, 0.04, segs=10))
        shin.add("JIA_Horse_Dark", lambda bm, x=x, y2=y2: tube(bm, (x, y2, 0.09), (x, y2 + 0.02, 0.0), 0.045, 0.058, segs=10))
        shin.make()

    return root


def export():
    blend = os.path.join(HERE, "caballo.blend")
    glb = os.path.join(HERE, "caballo.glb")
    bpy.ops.wm.save_as_mainfile(filepath=blend)
    bpy.ops.object.select_all(action="DESELECT")
    for o in bpy.data.objects:
        if o.name.startswith("JIA_Horse"):
            o.select_set(True)
    bpy.ops.export_scene.gltf(
        filepath=glb, export_format="GLB", use_selection=True, export_yup=True, export_apply=True,
        export_cameras=False, export_lights=False, export_animations=False, export_materials="EXPORT",
    )
    tris = sum(len(p.vertices) - 2 for o in bpy.data.objects if o.type == "MESH" for p in o.data.polygons)
    print(f"[caballo] {glb} · {os.path.getsize(glb)} bytes · {tris} triangles")


def preview():
    out = os.path.join(HERE, "previews")
    os.makedirs(out, exist_ok=True)
    bpy.ops.import_scene.gltf(filepath=os.path.join(HERE, "..", "carruaje", "jia-carruaje.glb"))
    wagon = bpy.data.objects.get("JIA_Wagon_ROOT")
    # The wagon's front axle is 0.85 m ahead of its origin; put it REACH behind the horse.
    wagon.location = (0, -REACH - 0.85, 0)
    scene = bpy.context.scene
    scene.render.engine = "BLENDER_EEVEE"
    scene.view_settings.view_transform = "Standard"
    scene.render.film_transparent = False
    world = bpy.data.worlds.new("paper") if not scene.world else scene.world
    scene.world = world
    world.color = linear("#F1E7D8")[:3]
    ground = bpy.data.meshes.new("ground")
    bm = bmesh.new()
    bmesh.ops.create_grid(bm, x_segments=1, y_segments=1, size=12)
    bm.to_mesh(ground)
    g = bpy.data.objects.new("Ground", ground)
    scene.collection.objects.link(g)
    gm = bpy.data.materials.new("paper")
    gm.node_tree.nodes["Principled BSDF"].inputs["Base Color"].default_value = linear("#F1E7D8")
    g.data.materials.append(gm)
    sun = bpy.data.objects.new("Sun", bpy.data.lights.new("Sun", "SUN"))
    sun.data.energy = 3.2
    sun.rotation_euler = (math.radians(40), 0, math.radians(-35))
    scene.collection.objects.link(sun)
    cam = bpy.data.objects.new("Cam", bpy.data.cameras.new("Cam"))
    scene.collection.objects.link(cam)
    scene.camera = cam
    for name, loc, rot, ortho, res in (
        ("top", (0, -1.4, 12), (0, 0, 0), 6.5, (800, 1100)),
        ("three-quarter", (5.5, 2.6, 3.4), None, None, (1400, 900)),
    ):
        cam.location = loc
        if rot is not None:
            cam.rotation_euler = rot
            cam.data.type = "ORTHO"
            cam.data.ortho_scale = ortho
        else:
            cam.data.type = "PERSP"
            cam.data.lens = 40
            d = Vector((0, -1.3, 0.9)) - Vector(loc)
            cam.rotation_euler = d.to_track_quat("-Z", "Y").to_euler()
        scene.render.resolution_x, scene.render.resolution_y = res
        scene.render.filepath = os.path.join(out, f"{name}.png")
        bpy.ops.render.render(write_still=True)


build()
export()
if PREVIEW:
    preview()
