"""
Worn horseshoe for the footer (JIA-2026-09-19-27, point 8). Runs in Blender 5.2 LTS without the UI:

    /Applications/Blender.app/Contents/MacOS/Blender -b --python assets/3d/herradura/make-herradura.py

Writes herradura.blend and herradura.glb next to this file (build-assets.sh copies the GLB to public/footer/).

Model space (Blender: X right, Z up, Y depth): the shoe stands in the XZ plane, heels up (a U), toe down;
its thickness runs along Y. The mesh origin is the centre of the topmost nail hole of the LEFT heel: the
nail it hangs from, so a rotation about the origin is a swing on that nail. Real size (metres).
"""
import math
import os
import bpy
import bmesh
from mathutils import Vector, noise

HERE = os.path.dirname(os.path.abspath(__file__))

# ---- proportions (metres) ----
A, B = 0.052, 0.058          # half-axes of the centreline ellipse (width, height)
BAR_W, BAR_T = 0.024, 0.0075  # bar: radial width, thickness
SWEEP = math.radians(128)     # half-angle of the U: from toe (bottom) up to each heel
HEEL_PINCH = 0.10             # heels drawn slightly inward, like a shod shoe
SEGMENTS = 96
HOLE_R = 0.0032
HOLES_LEFT = (0.055, 0.15, 0.245, 0.34)   # 4 on the left branch (the top one hangs the shoe)
HOLES_RIGHT = (0.66, 0.755, 0.85)         # 3 on the right: seven, the odd one long gone
HANG_HOLE = HOLES_LEFT[0]


def centre(t):
    """Point (x, z) of the centreline at t ∈ [0, 1]: t=0 left heel tip, t=0.5 toe, t=1 right heel tip."""
    phi = -math.pi / 2 - SWEEP + 2 * SWEEP * t   # -90° at the toe (bottom)
    x = A * math.cos(phi)
    z = B * math.sin(phi)
    pinch = 1 - HEEL_PINCH * max(0.0, math.sin(phi))
    return Vector((x * pinch, 0.0, z))


def build_shoe():
    bm = bmesh.new()
    rings = []
    for i in range(SEGMENTS + 1):
        t = i / SEGMENTS
        p = centre(t)
        tangent = (centre(min(1, t + 1e-3)) - centre(max(0, t - 1e-3))).normalized()
        normal = Vector((-tangent.z, 0.0, tangent.x))  # in-plane, pointing outwards
        # A little wider at the toe, thinner and narrower at the heel tips: a used shoe.
        w = BAR_W * (1 + 0.12 * math.cos((t - 0.5) * math.pi)) * (0.82 + 0.18 * math.sin(min(1, t * 6) * math.pi / 2) * math.sin(min(1, (1 - t) * 6) * math.pi / 2))
        th = BAR_T * (0.9 + 0.1 * math.cos((t - 0.5) * math.pi))
        ring = []
        for s_n, s_y in ((1, 1), (-1, 1), (-1, -1), (1, -1)):
            v = p + normal * (s_n * w / 2) + Vector((0, s_y * th / 2, 0))
            ring.append(bm.verts.new(v))
        rings.append(ring)
    for r0, r1 in zip(rings, rings[1:]):
        for k in range(4):
            bm.faces.new((r0[k], r1[k], r1[(k + 1) % 4], r0[(k + 1) % 4]))
    bm.faces.new(reversed(rings[0]))
    bm.faces.new(rings[-1])
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    me = bpy.data.meshes.new("Herradura")
    bm.to_mesh(me)
    bm.free()
    ob = bpy.data.objects.new("Herradura", me)
    bpy.context.collection.objects.link(ob)
    return ob


def nail_holes():
    """One cylinder per nail hole, joined, for the boolean."""
    cutters = []
    for t in HOLES_LEFT + HOLES_RIGHT:
        p = centre(t)
        bpy.ops.mesh.primitive_cylinder_add(vertices=24, radius=HOLE_R, depth=BAR_T * 3, location=(p.x, 0, p.z), rotation=(math.pi / 2, 0, 0))
        cutters.append(bpy.context.active_object)
    for c in cutters:
        c.select_set(True)
    bpy.context.view_layer.objects.active = cutters[0]
    bpy.ops.object.join()
    return bpy.context.active_object


def main():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    shoe = build_shoe()
    holes = nail_holes()

    bpy.ops.object.select_all(action="DESELECT")
    shoe.select_set(True)
    bpy.context.view_layer.objects.active = shoe

    # Holes, softened edges, then the wear: a faint displacement by a cloud texture.
    b = shoe.modifiers.new("Holes", "BOOLEAN")
    b.operation = "DIFFERENCE"
    b.object = holes
    b.solver = "EXACT"
    bev = shoe.modifiers.new("Bevel", "BEVEL")
    bev.width = 0.0012
    bev.segments = 3
    bev.limit_method = "ANGLE"
    bev.angle_limit = math.radians(40)
    tex = bpy.data.textures.new("Desgaste", "CLOUDS")
    tex.noise_scale = 0.012
    tex.noise_depth = 3
    disp = shoe.modifiers.new("Wear", "DISPLACE")
    disp.texture = tex
    disp.strength = 0.0009
    disp.mid_level = 0.5
    for m in ("Holes", "Bevel", "Wear"):
        bpy.ops.object.modifier_apply(modifier=m)
    bpy.data.objects.remove(holes, do_unlink=True)

    # Smooth shading with the bar's edges kept sharp.
    bpy.ops.object.mode_set(mode="EDIT")
    bpy.ops.mesh.select_all(action="SELECT")
    bpy.ops.mesh.faces_shade_smooth()
    bpy.ops.mesh.select_all(action="DESELECT")
    bpy.ops.mesh.edges_select_sharp(sharpness=math.radians(35))
    bpy.ops.mesh.mark_sharp()
    bpy.ops.object.mode_set(mode="OBJECT")

    # Rust in the vertex colours: dark iron, warmer and lighter where the noise says so (exported as COLOR_0).
    me = shoe.data
    col = me.color_attributes.new("Col", "FLOAT_COLOR", "POINT")
    iron = Vector((0.20, 0.17, 0.15))
    rust = Vector((0.42, 0.22, 0.10))
    for i, v in enumerate(me.vertices):
        n = 0.5 + 0.5 * noise.noise(v.co * 90.0)
        n2 = 0.5 + 0.5 * noise.noise(v.co * 260.0 + Vector((7, 3, 1)))
        k = max(0.0, min(1.0, n * 0.7 + n2 * 0.5 - 0.2))
        c = iron.lerp(rust, k)
        col.data[i].color = (c.x, c.y, c.z, 1.0)

    mat = bpy.data.materials.new("Hierro")
    mat.use_nodes = True
    nt = mat.node_tree
    bsdf = nt.nodes["Principled BSDF"]
    attr = nt.nodes.new("ShaderNodeVertexColor")
    attr.layer_name = "Col"
    nt.links.new(attr.outputs["Color"], bsdf.inputs["Base Color"])
    bsdf.inputs["Metallic"].default_value = 0.8
    bsdf.inputs["Roughness"].default_value = 0.55
    me.materials.append(mat)

    # Origin at the hanging hole (top hole of the left heel).
    hang = centre(HANG_HOLE)
    for v in me.vertices:
        v.co -= hang
    shoe.location = (0, 0, 0)

    bpy.ops.wm.save_as_mainfile(filepath=os.path.join(HERE, "herradura.blend"))
    bpy.ops.export_scene.gltf(
        filepath=os.path.join(HERE, "herradura.glb"),
        export_format="GLB",
        use_selection=True,
        export_apply=True,
        export_yup=True,
        export_vertex_color="ACTIVE",
        export_normals=True,
        export_texcoords=False,
        export_animations=False,
        export_lights=False,
        export_cameras=False,
    )
    lo = [min(v.co[i] for v in me.vertices) for i in range(3)]
    hi = [max(v.co[i] for v in me.vertices) for i in range(3)]
    print("HERRADURA verts", len(me.vertices), "faces", len(me.polygons))
    print("HERRADURA bbox min", [round(x, 4) for x in lo], "max", [round(x, 4) for x in hi])


main()
