"""
validate-carruaje.py — validación del asset JIA carruaje (Blender 5.2, modo background).

    blender --background --python validate-carruaje.py -- [--dir <carpeta del asset>] [--no-render]

Abre el .blend generado SIN guardarlo (comprobaciones de jerarquía, pivotes, apoyo, giro de ruedas,
rango de dirección por solapamiento de mallas, normales/manifold, materiales), renderiza evidencias
de las pruebas en previews/validation/, y después reimporta el GLB en una escena vacía independiente
para comparar estructura y contar nodos/mallas/primitivas/materiales leyendo también el JSON del GLB.

Escribe únicamente previews/validation-data.json y previews/validation/*.png. Nunca modifica el
.blend ni el .glb.
"""

import json
import math
import os
import struct
import sys
import traceback

import bpy
from mathutils import Vector, Matrix
from mathutils.bvhtree import BVHTree

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
EXPECTED = {
    "JIA_Wagon_ROOT": None,
    "JIA_Chassis": "JIA_Wagon_ROOT",
    "JIA_BodyMotion": "JIA_Wagon_ROOT",
    "JIA_Body": "JIA_BodyMotion",
    "JIA_Canvas": "JIA_BodyMotion",
    "JIA_DriverSeat": "JIA_BodyMotion",
    "JIA_Details": "JIA_BodyMotion",
    "JIA_FrontSteer": "JIA_Wagon_ROOT",
    "JIA_FrontAxle": "JIA_FrontSteer",
    "JIA_Wheel_FL": "JIA_FrontSteer",
    "JIA_Wheel_FR": "JIA_FrontSteer",
    "JIA_Wheel_RL": "JIA_Wagon_ROOT",
    "JIA_Wheel_RR": "JIA_Wagon_ROOT",
}
WHEELS = ["JIA_Wheel_FL", "JIA_Wheel_FR", "JIA_Wheel_RL", "JIA_Wheel_RR"]


def parse_args():
    argv = sys.argv
    args = argv[argv.index("--") + 1:] if "--" in argv else []
    opts = {"dir": SCRIPT_DIR, "no_render": False}
    i = 0
    while i < len(args):
        if args[i] == "--dir":
            opts["dir"] = os.path.abspath(args[i + 1]); i += 2
        elif args[i] == "--no-render":
            opts["no_render"] = True; i += 1
        else:
            raise SystemExit(f"Argumento desconocido: {args[i]}")
    return opts


def world_mesh(ob, deps):
    """Vértices en espacio mundo + triángulos (malla evaluada, con modificadores)."""
    ev = ob.evaluated_get(deps)
    me = ev.to_mesh()
    me.calc_loop_triangles()
    mw = ev.matrix_world
    verts = [mw @ v.co for v in me.vertices]
    tris = [tuple(t.vertices) for t in me.loop_triangles]
    ev.to_mesh_clear()
    return verts, tris


def bvh_of(ob, deps):
    verts, tris = world_mesh(ob, deps)
    return BVHTree.FromPolygons(verts, tris, all_triangles=True), verts


def bounds(verts):
    mn = Vector((min(v.x for v in verts), min(v.y for v in verts), min(v.z for v in verts)))
    mx = Vector((max(v.x for v in verts), max(v.y for v in verts), max(v.z for v in verts)))
    return mn, mx


def mesh_topology(ob):
    me = ob.data
    import bmesh
    bm = bmesh.new(); bm.from_mesh(me)
    non_manifold = sum(1 for e in bm.edges if not e.is_manifold)
    boundary = sum(1 for e in bm.edges if e.is_boundary)
    loose = sum(1 for v in bm.verts if not v.link_edges)
    bm.free()
    no_mat = sum(1 for p in me.polygons if p.material_index >= len(me.materials) or me.materials[p.material_index] is None)
    return {"non_manifold_edges": non_manifold, "boundary_edges": boundary, "loose_verts": loose,
            "faces_without_material": no_mat, "material_slots": [m.name if m else None for m in me.materials]}


def overlap_pairs(movers, statics, deps):
    """Pares (mover, static) con solapamiento de mallas en espacio mundo."""
    pairs = []
    mv = {o.name: bvh_of(o, deps)[0] for o in movers}
    st = {o.name: bvh_of(o, deps)[0] for o in statics}
    for a, ta in mv.items():
        for b, tb in st.items():
            if ta.overlap(tb):
                pairs.append((a, b))
    return pairs


def render(scene, cam_name, path, res, samples=16):
    scene.camera = bpy.data.objects[cam_name]
    scene.render.resolution_x, scene.render.resolution_y = res
    if scene.render.engine.startswith("BLENDER_EEVEE"):
        scene.eevee.taa_render_samples = samples
    scene.render.filepath = path
    bpy.ops.render.render(write_still=True)


def validate_blend(opts, report):
    blend = os.path.join(opts["dir"], "jia-carruaje.blend")
    if not os.path.isfile(blend):
        raise SystemExit(f"No existe {blend}")
    bpy.ops.wm.open_mainfile(filepath=blend, load_ui=False)
    scene = bpy.context.scene
    deps = bpy.context.evaluated_depsgraph_get()
    obs = {o.name: o for o in scene.objects}
    r = report["blend"] = {}
    r["active_camera"] = scene.camera.name if scene.camera else None
    r["active_camera_is_top"] = (scene.camera is not None and scene.camera.name == "JIA_Camera_Top")
    top = obs.get("JIA_Camera_Top")
    r["top_camera_ortho_straight_down"] = bool(top and top.data.type == "ORTHO" and all(abs(a) < 1e-6 for a in top.rotation_euler))

    # Jerarquía y nombres únicos
    names = [o.name for o in scene.objects]
    r["unique_names"] = len(names) == len(set(names))
    hier = {}
    for n, parent in EXPECTED.items():
        o = obs.get(n)
        hier[n] = {"exists": o is not None, "parent_ok": (o is not None and (o.parent.name if o.parent else None) == parent),
                   "type": o.type if o else None,
                   "scale_uniform_positive": (o is not None and all(abs(s - 1.0) < 1e-6 for s in o.scale))}
    r["hierarchy"] = hier
    r["hierarchy_ok"] = all(v["exists"] and v["parent_ok"] and v["scale_uniform_positive"] for v in hier.values())
    root = obs["JIA_Wagon_ROOT"]
    r["root_at_origin"] = all(abs(v) < 1e-6 for v in root.location) and all(abs(v) < 1e-6 for v in root.rotation_euler)

    # Pivotes de rueda: origen en el centro del buje (bbox local simétrico), apoyo en Z=0
    wheels = {}
    for w in WHEELS:
        o = obs[w]
        verts, _ = world_mesh(o, deps)
        mn, mx = bounds(verts)
        loc = o.matrix_world.translation
        radius_y = (mx.y - mn.y) / 2; radius_z = (mx.z - mn.z) / 2
        wheels[w] = {
            "world_hub": [round(v, 4) for v in loc],
            "bbox_center": [round(v, 4) for v in ((mn + mx) / 2)],
            "hub_centered_yz": abs((mn.y + mx.y) / 2 - loc.y) < 1e-4 and abs((mn.z + mx.z) / 2 - loc.z) < 1e-4,
            "radius_from_mesh": round(radius_z, 4),
            "ground_contact_z": round(mn.z, 5),
            "touches_ground": abs(mn.z) < 1e-4,
        }
    r["wheels"] = wheels
    r["all_wheels_same_plane"] = all(v["touches_ground"] for v in wheels.values())

    # Giro individual 360° por pasos de 90°: el buje no se desplaza (no orbita)
    spin = {}
    for w in WHEELS:
        o = obs[w]
        drift = 0.0; zmin_dev = 0.0
        for k in range(1, 5):
            o.rotation_euler = (math.radians(90 * k), 0, 0)
            bpy.context.view_layer.update()
            deps = bpy.context.evaluated_depsgraph_get()
            verts, _ = world_mesh(o, deps)
            mn, mx = bounds(verts)
            c = (mn + mx) / 2
            drift = max(drift, (Vector((0, c.y, c.z)) - Vector((0, o.matrix_world.translation.y, o.matrix_world.translation.z))).length)
            zmin_dev = max(zmin_dev, abs(mn.z))
        o.rotation_euler = (0, 0, 0)
        spin[w] = {"max_center_drift": round(drift, 6), "max_ground_deviation": round(zmin_dev, 6), "ok": drift < 1e-4 and zmin_dev < 1e-4}
    bpy.context.view_layer.update()
    r["wheel_spin_360"] = spin

    # Dirección: solapamientos nuevos respecto a la pose de reposo
    deps = bpy.context.evaluated_depsgraph_get()
    movers = [obs["JIA_Wheel_FL"], obs["JIA_Wheel_FR"], obs["JIA_FrontAxle"]]
    statics = [obs["JIA_Body"], obs["JIA_Canvas"], obs["JIA_DriverSeat"], obs["JIA_Details"], obs["JIA_Chassis"]]
    baseline = set(overlap_pairs(movers, statics, deps))
    steer = {"baseline_overlaps_at_rest": sorted(baseline), "first_new_overlap_deg": {}}
    fs = obs["JIA_FrontSteer"]
    for sign, label in ((1, "left_positive_z"), (-1, "right_negative_z")):
        first = None
        for deg in range(1, 46):
            fs.rotation_euler = (0, 0, math.radians(sign * deg))
            bpy.context.view_layer.update()
            deps = bpy.context.evaluated_depsgraph_get()
            new = set(overlap_pairs(movers, statics, deps)) - baseline
            if new:
                first = {"deg": deg, "pairs": sorted(new)}
                break
        steer["first_new_overlap_deg"][label] = first
    fs.rotation_euler = (0, 0, 0)
    bpy.context.view_layer.update()
    lim = [v["deg"] - 1 if v else 45 for v in steer["first_new_overlap_deg"].values()]
    steer["clean_range_deg"] = min(lim)
    r["steering"] = steer

    # Balanceo de la caja: las ruedas no se mueven (no son hijas de BodyMotion)
    bm = obs["JIA_BodyMotion"]
    bm.rotation_euler = (math.radians(2.0), math.radians(1.5), 0)
    bpy.context.view_layer.update()
    deps = bpy.context.evaluated_depsgraph_get()
    r["body_roll_keeps_wheels_grounded"] = all(abs(bounds(world_mesh(obs[w], deps)[0])[0].z) < 1e-4 for w in WHEELS)
    bm.rotation_euler = (0, 0, 0)
    bpy.context.view_layer.update()

    # Giro de la raíz 360°: bbox de la anchura/longitud se intercambian a 90° (comprobación de coherencia)
    def asset_bounds():
        deps = bpy.context.evaluated_depsgraph_get()
        allv = []
        for n in EXPECTED:
            o = obs[n]
            if o.type == "MESH":
                allv += world_mesh(o, deps)[0]
        return bounds(allv)
    mn0, mx0 = asset_bounds()
    root.rotation_euler = (0, 0, math.radians(90))
    bpy.context.view_layer.update()
    mn90, mx90 = asset_bounds()
    root.rotation_euler = (0, 0, math.radians(360))
    bpy.context.view_layer.update()
    mn360, mx360 = asset_bounds()
    root.rotation_euler = (0, 0, 0)
    bpy.context.view_layer.update()
    r["root_rotation"] = {
        "dims_0": [round(v, 4) for v in (mx0 - mn0)],
        "dims_90": [round(v, 4) for v in (mx90 - mn90)],
        "dims_360": [round(v, 4) for v in (mx360 - mn360)],
        "ok": abs((mx0 - mn0).x - (mx90 - mn90).y) < 1e-3 and abs((mx0 - mn0).y - (mx90 - mn90).x) < 1e-3 and (mx360 - mn360 - (mx0 - mn0)).length < 1e-3,
        "z_min_at_rest": round(mn0.z, 5),
    }

    # Topología, normales y materiales por malla
    topo = {}
    for n in EXPECTED:
        o = obs[n]
        if o.type == "MESH":
            topo[n] = mesh_topology(o)
            topo[n]["validate_reported_issues"] = o.data.validate(verbose=False)
    r["topology"] = topo
    r["faces_without_material_total"] = sum(t["faces_without_material"] for t in topo.values())

    # Lo que NO debe exportarse existe solo fuera de la jerarquía ROOT
    outside = [o.name for o in scene.objects if o.name not in EXPECTED]
    r["objects_outside_root"] = outside

    # Evidencias de las pruebas
    if not opts["no_render"]:
        vdir = os.path.join(opts["dir"], "previews", "validation")
        os.makedirs(vdir, exist_ok=True)
        for old in os.listdir(vdir):  # solo evidencias propias de ejecuciones anteriores
            if old.startswith("steer-") or old == "underside.png":
                os.remove(os.path.join(vdir, old))
        scene.render.film_transparent = True
        deg = min(steer["clean_range_deg"], 25)
        fs.rotation_euler = (0, 0, math.radians(deg))
        bm.rotation_euler = (math.radians(2.0), math.radians(1.5), 0)
        for w in WHEELS:
            obs[w].rotation_euler = (math.radians(-40), 0, 0)
        bpy.context.view_layer.update()
        render(scene, "JIA_Camera_Review", os.path.join(vdir, f"steer-{deg}deg-roll-review.png"), (1200, 860))
        render(scene, "JIA_Camera_Top", os.path.join(vdir, f"steer-{deg}deg-roll-top.png"), (700, 980))
        fs.rotation_euler = (0, 0, math.radians(-deg))
        bpy.context.view_layer.update()
        render(scene, "JIA_Camera_Top", os.path.join(vdir, f"steer-minus{deg}deg-top.png"), (700, 980))
        # Vista inferior del tren de rodaje (cámara temporal, no se guarda)
        cam = bpy.data.cameras.new("tmp_under"); co = bpy.data.objects.new("tmp_under", cam); scene.collection.objects.link(co)
        cam.type = "ORTHO"; cam.ortho_scale = 3.4
        co.location = (0, 0, -6); co.rotation_euler = (math.radians(180), 0, 0)
        fs.rotation_euler = (0, 0, 0); bm.rotation_euler = (0, 0, 0)
        for w in WHEELS:
            obs[w].rotation_euler = (0, 0, 0)
        bpy.context.view_layer.update()
        render(scene, "tmp_under", os.path.join(vdir, "underside.png"), (700, 980))
        report["evidence"] = sorted(os.listdir(vdir))
    # No se guarda el .blend: la pose de reposo del fichero permanece intacta.


def parse_glb(path):
    with open(path, "rb") as fh:
        data = fh.read()
    magic, version, length = struct.unpack("<4sII", data[:12])
    if magic != b"glTF":
        raise SystemExit("El fichero no es un GLB válido")
    chunk_len, chunk_type = struct.unpack("<II", data[12:20])
    js = json.loads(data[20:20 + chunk_len].decode("utf-8"))
    info = {
        "bytes": len(data), "version": version,
        "nodes": len(js.get("nodes", [])), "meshes": len(js.get("meshes", [])),
        "primitives": sum(len(m.get("primitives", [])) for m in js.get("meshes", [])),
        "materials": len(js.get("materials", [])), "material_names": [m.get("name") for m in js.get("materials", [])],
        "images": len(js.get("images", [])), "textures": len(js.get("textures", [])),
        "animations": len(js.get("animations", [])), "cameras": len(js.get("cameras", [])), "skins": len(js.get("skins", [])),
        "extensionsUsed": js.get("extensionsUsed", []), "extensionsRequired": js.get("extensionsRequired", []),
        "node_names": [n.get("name") for n in js.get("nodes", [])],
        "node_translations": {n.get("name"): n.get("translation", [0, 0, 0]) for n in js.get("nodes", [])},
        "generator": js.get("asset", {}).get("generator"),
    }
    tri_total = 0
    for m in js.get("meshes", []):
        for p in m.get("primitives", []):
            if "indices" in p:
                tri_total += js["accessors"][p["indices"]]["count"] // 3
    info["triangles_from_indices"] = tri_total
    return info


def validate_glb(opts, report):
    glb = os.path.join(opts["dir"], "jia-carruaje.glb")
    if not os.path.isfile(glb):
        raise SystemExit(f"No existe {glb}")
    g = report["glb"] = parse_glb(glb)
    expected = set(EXPECTED)
    g["node_names_match_contract"] = set(g["node_names"]) == expected
    g["unexpected_nodes"] = sorted(set(g["node_names"]) - expected)
    g["missing_nodes"] = sorted(expected - set(g["node_names"]))
    g["no_presentation_elements"] = g["cameras"] == 0 and g["animations"] == 0 and g["images"] == 0 and not g["unexpected_nodes"]

    # Reimportación en una escena vacía independiente
    bpy.ops.wm.read_factory_settings(use_empty=True)
    bpy.ops.import_scene.gltf(filepath=glb)
    scene = bpy.context.scene
    deps = bpy.context.evaluated_depsgraph_get()
    obs = {o.name: o for o in scene.objects}
    ri = report["reimport"] = {"objects": len(scene.objects), "meshes": sum(1 for o in scene.objects if o.type == "MESH"),
                               "materials": len(bpy.data.materials), "material_names": sorted(m.name for m in bpy.data.materials)}
    hier_ok = True
    for n, parent in EXPECTED.items():
        o = obs.get(n)
        ok = o is not None and (o.parent.name if o and o.parent else None) == parent
        hier_ok = hier_ok and ok
    ri["hierarchy_matches"] = hier_ok
    tris = 0
    for o in scene.objects:
        if o.type == "MESH":
            me = o.evaluated_get(deps).to_mesh(); me.calc_loop_triangles(); tris += len(me.loop_triangles); o.evaluated_get(deps).to_mesh_clear()
    ri["triangles"] = tris
    wheels = {}
    for w in WHEELS:
        o = obs.get(w)
        if o:
            verts, _ = world_mesh(o, deps)
            mn, mx = bounds(verts)
            wheels[w] = {"world_hub": [round(v, 4) for v in o.matrix_world.translation], "ground_z": round(mn.z, 5)}
    ri["wheels"] = wheels
    ri["all_wheels_on_ground"] = all(abs(v["ground_z"]) < 1e-3 for v in wheels.values())
    allv = []
    for o in scene.objects:
        if o.type == "MESH":
            allv += world_mesh(o, deps)[0]
    mn, mx = bounds(allv)
    ri["dimensions_blender_axes"] = [round(v, 4) for v in (mx - mn)]
    ri["front_is_plus_y"] = obs["JIA_DriverSeat"].matrix_world.translation.y >= 0 and bounds(world_mesh(obs["JIA_DriverSeat"], deps)[0])[1].y > bounds(world_mesh(obs["JIA_Canvas"], deps)[0])[1].y - 0.05


def main():
    opts = parse_args()
    report = {"blender": bpy.app.version_string}
    validate_blend(opts, report)
    validate_glb(opts, report)
    out = os.path.join(opts["dir"], "previews", "validation-data.json")
    with open(out, "w", encoding="utf-8") as fh:
        json.dump(report, fh, indent=2, ensure_ascii=False)
    b, g, ri = report["blend"], report["glb"], report["reimport"]
    summary = {
        "active_camera_is_top": b["active_camera_is_top"], "hierarchy_ok": b["hierarchy_ok"], "unique_names": b["unique_names"],
        "wheels_same_plane": b["all_wheels_same_plane"], "spin_ok": all(v["ok"] for v in b["wheel_spin_360"].values()),
        "steer_clean_range_deg": b["steering"]["clean_range_deg"], "roll_keeps_wheels": b["body_roll_keeps_wheels_grounded"],
        "root_rotation_ok": b["root_rotation"]["ok"], "faces_without_material": b["faces_without_material_total"],
        "glb_bytes": g["bytes"], "glb_nodes": g["nodes"], "glb_meshes": g["meshes"], "glb_primitives": g["primitives"],
        "glb_materials": g["materials"], "glb_tris": g["triangles_from_indices"], "glb_clean": g["no_presentation_elements"],
        "reimport_hierarchy": ri["hierarchy_matches"], "reimport_wheels_on_ground": ri["all_wheels_on_ground"],
    }
    print("JIA_VALIDATION_OK", json.dumps(summary))


if __name__ == "__main__":
    try:
        main()
    except Exception:
        traceback.print_exc()
        print("JIA_VALIDATION_ERROR")
        sys.exit(1)
