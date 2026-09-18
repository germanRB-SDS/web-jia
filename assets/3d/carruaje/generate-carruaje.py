"""
generate-carruaje.py — JIA · carreta western cubierta (asset 3D para el mapa de Jornadas).

Genera desde cero, en un fichero NUEVO de Blender, el modelo de la carreta, sus cámaras de revisión,
la iluminación de presentación, el .blend fuente, las previsualizaciones PNG y la exportación GLB.

Uso (Blender 5.2 LTS, modo background; nunca toca la escena abierta del usuario):

    blender --background --python generate-carruaje.py -- \
        [--config carruaje-config.json] [--out-dir .] [--overwrite] [--no-render] [--quick]

- Solo escribe dentro de --out-dir (por defecto la carpeta del propio script), que debe estar
  dentro de la raíz del proyecto web-jia. Con salidas ya existentes, se niega a sobrescribir
  salvo --overwrite.
- Sin física, sin partículas, sin subdivisión. Materiales PBR simples (Principled BSDF) sin texturas.
- Convenio de autoría: +Y avance, +X derecha del vehículo, +Z arriba, suelo Z=0, metros.

Jerarquía de control (contrato de animación):

    JIA_Wagon_ROOT                (empty, origen en el suelo, centrado, entre ejes)
    ├── JIA_Chassis               (malla estática: eje trasero, bolster trasero, varal central)
    ├── JIA_BodyMotion            (empty, pivote en el plano inferior de la caja: balanceo sutil)
    │   ├── JIA_Body              (caja de tablones, estacas, barandas, largueros)
    │   ├── JIA_Canvas            (lona arqueada, abertura delantera, fruncido trasero)
    │   ├── JIA_DriverSeat        (banco, respaldo y estribo delanteros)
    │   └── JIA_Details           (cofre lateral, herrajes de esquina, ganchos de cuerda)
    ├── JIA_FrontSteer            (empty, pivote en el centro del eje delantero: giro Z)
    │   ├── JIA_FrontAxle         (eje delantero, bolster, pivote de dirección)
    │   ├── JIA_Wheel_FL          (origen en el centro del buje; gira sobre su X local)
    │   └── JIA_Wheel_FR
    ├── JIA_Wheel_RL
    └── JIA_Wheel_RR
"""

import json
import math
import os
import sys
import traceback

try:
    import bpy
    import bmesh
    from mathutils import Vector, Matrix, Euler
except ImportError:  # pragma: no cover - solo informativo fuera de Blender
    sys.exit("Este script debe ejecutarse dentro de Blender: blender --background --python generate-carruaje.py -- ...")


# --------------------------------------------------------------------------------------------
# Argumentos y rutas
# --------------------------------------------------------------------------------------------

def parse_args():
    argv = sys.argv
    args = argv[argv.index("--") + 1:] if "--" in argv else []
    opts = {"config": None, "out_dir": None, "overwrite": False, "no_render": False, "quick": False}
    i = 0
    while i < len(args):
        a = args[i]
        if a == "--config":
            opts["config"] = args[i + 1]; i += 2
        elif a == "--out-dir":
            opts["out_dir"] = args[i + 1]; i += 2
        elif a == "--overwrite":
            opts["overwrite"] = True; i += 1
        elif a == "--no-render":
            opts["no_render"] = True; i += 1
        elif a == "--quick":
            opts["quick"] = True; i += 1
        else:
            raise SystemExit(f"Argumento desconocido: {a}")
    return opts


SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
# assets/3d/carruaje -> raíz del proyecto (tres niveles arriba)
PROJECT_ROOT = os.path.abspath(os.path.join(SCRIPT_DIR, "..", "..", ".."))


def check_paths(opts):
    cfg_path = os.path.abspath(opts["config"] or os.path.join(SCRIPT_DIR, "carruaje-config.json"))
    if not os.path.isfile(cfg_path):
        raise SystemExit(f"No existe el fichero de configuración: {cfg_path}")
    out_dir = os.path.abspath(opts["out_dir"] or SCRIPT_DIR)
    if os.path.commonpath([out_dir, PROJECT_ROOT]) != PROJECT_ROOT:
        raise SystemExit(f"--out-dir debe estar dentro de la raíz del proyecto ({PROJECT_ROOT}): {out_dir}")
    if not os.path.isfile(os.path.join(PROJECT_ROOT, "package.json")):
        raise SystemExit(f"La raíz calculada no parece web-jia (falta package.json): {PROJECT_ROOT}")
    os.makedirs(out_dir, exist_ok=True)
    os.makedirs(os.path.join(out_dir, "previews"), exist_ok=True)
    os.makedirs(os.path.join(out_dir, "previews", "legibility"), exist_ok=True)
    return cfg_path, out_dir


def guard_overwrite(path, overwrite):
    if os.path.exists(path) and not overwrite:
        raise SystemExit(f"Ya existe {path}. Usa --overwrite para regenerarlo (no se sobrescriben versiones sin permiso).")


# --------------------------------------------------------------------------------------------
# Utilidades de color y materiales
# --------------------------------------------------------------------------------------------

def srgb_to_linear(c):
    c = c / 255.0
    return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4


def hex_to_linear_rgba(h):
    h = h.lstrip("#")
    return tuple(srgb_to_linear(int(h[i:i + 2], 16)) for i in (0, 2, 4)) + (1.0,)


def make_material(name, spec):
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    bsdf = nodes.get("Principled BSDF")
    bsdf.inputs["Base Color"].default_value = hex_to_linear_rgba(spec["color"])
    bsdf.inputs["Roughness"].default_value = spec["roughness"]
    bsdf.inputs["Metallic"].default_value = spec["metallic"]
    # Specular por defecto (0.5): así el exportador no añade KHR_materials_specular y el GLB queda sin extensiones.
    mat.diffuse_color = hex_to_linear_rgba(spec["color"])  # vista sólida
    return mat


# --------------------------------------------------------------------------------------------
# Utilidades bmesh
# --------------------------------------------------------------------------------------------

def bm_box(bm, x0, x1, y0, y1, z0, z1, mat=0):
    """Caja alineada a ejes por extremos min/max; devuelve las caras creadas."""
    v = [bm.verts.new((x, y, z)) for z in (z0, z1) for y in (y0, y1) for x in (x0, x1)]
    # índices: x + 2*y + 4*z
    quads = [(0, 2, 3, 1), (4, 5, 7, 6), (0, 1, 5, 4), (2, 6, 7, 3), (0, 4, 6, 2), (1, 3, 7, 5)]
    faces = []
    for q in quads:
        f = bm.faces.new([v[i] for i in q])
        f.material_index = mat
        faces.append(f)
    return faces


def bm_box_c(bm, center, size, mat=0):
    cx, cy, cz = center
    sx, sy, sz = size
    return bm_box(bm, cx - sx / 2, cx + sx / 2, cy - sy / 2, cy + sy / 2, cz - sz / 2, cz + sz / 2, mat)


def bm_cylinder(bm, axis, c, radius, length, segs, mat=0, caps=True, smooth=True):
    """Cilindro con eje 'x', 'y' o 'z' centrado en c. Devuelve las caras."""
    cx, cy, cz = c
    ring_a, ring_b = [], []
    for i in range(segs):
        a = 2 * math.pi * i / segs
        u, w = radius * math.cos(a), radius * math.sin(a)
        if axis == "x":
            pa = (cx - length / 2, cy + u, cz + w); pb = (cx + length / 2, cy + u, cz + w)
        elif axis == "y":
            pa = (cx + w, cy - length / 2, cz + u); pb = (cx + w, cy + length / 2, cz + u)
        else:
            pa = (cx + u, cy + w, cz - length / 2); pb = (cx + u, cy + w, cz + length / 2)
        ring_a.append(bm.verts.new(pa)); ring_b.append(bm.verts.new(pb))
    faces = []
    for i in range(segs):
        j = (i + 1) % segs
        f = bm.faces.new((ring_a[i], ring_a[j], ring_b[j], ring_b[i]))
        f.material_index = mat; f.smooth = smooth; faces.append(f)
    if caps:
        fa = bm.faces.new(ring_a[::-1]); fa.material_index = mat; faces.append(fa)
        fb = bm.faces.new(ring_b); fb.material_index = mat; faces.append(fb)
    return faces


def bm_ring_x(bm, cx, r_out, r_in, width, segs, mat_side=0, mat_outer=0, mat_inner=0):
    """Anillo de sección rectangular con eje X (aro de rueda). Caras exteriores con material propio."""
    rings = {}
    for key, (r, x) in {"oa": (r_out, cx - width / 2), "ob": (r_out, cx + width / 2),
                        "ia": (r_in, cx - width / 2), "ib": (r_in, cx + width / 2)}.items():
        rings[key] = [bm.verts.new((x, r * math.cos(2 * math.pi * i / segs), r * math.sin(2 * math.pi * i / segs)))
                      for i in range(segs)]
    faces = []
    for i in range(segs):
        j = (i + 1) % segs
        spec = [
            ((rings["oa"][i], rings["oa"][j], rings["ob"][j], rings["ob"][i]), mat_outer),   # banda exterior
            ((rings["ib"][i], rings["ib"][j], rings["ia"][j], rings["ia"][i]), mat_inner),   # banda interior
            ((rings["ia"][i], rings["ia"][j], rings["oa"][j], rings["oa"][i]), mat_side),    # cara -X
            ((rings["ob"][i], rings["ob"][j], rings["ib"][j], rings["ib"][i]), mat_side),    # cara +X
        ]
        for verts, m in spec:
            f = bm.faces.new(verts); f.material_index = m; f.smooth = True; faces.append(f)
    return faces


def finish_mesh(bm, name, materials, sharp_angle_deg=40.0, recalc=True):
    """Recalcula normales (mallas cerradas), marca aristas vivas por ángulo y crea la malla."""
    bm.verts.ensure_lookup_table()
    if recalc:
        bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    bm.normal_update()
    thr = math.radians(sharp_angle_deg)
    for e in bm.edges:
        if len(e.link_faces) == 2:
            f1, f2 = e.link_faces
            if f1.smooth and f2.smooth and f1.normal.angle(f2.normal, 0.0) > thr:
                e.smooth = False
            elif not (f1.smooth and f2.smooth):
                e.smooth = False
    me = bpy.data.meshes.new(name)
    bm.to_mesh(me)
    bm.free()
    for m in materials:
        me.materials.append(m)
    me.validate()
    return me


def new_object(name, mesh, parent=None, location=(0, 0, 0), collection=None):
    ob = bpy.data.objects.new(name, mesh)
    (collection or bpy.context.scene.collection).objects.link(ob)
    ob.location = location
    if parent is not None:
        ob.parent = parent  # sin parent_inverse: transform local = relativa al padre
        ob.matrix_parent_inverse = Matrix.Identity(4)
    return ob


def add_bevel(ob, cfg):
    mod = ob.modifiers.new("Bevel", "BEVEL")
    mod.width = cfg["width"]
    mod.segments = cfg["segments"]
    mod.limit_method = "ANGLE"
    mod.angle_limit = math.radians(cfg["angle_deg"])
    mod.harden_normals = False
    return mod


# --------------------------------------------------------------------------------------------
# Construcción de piezas
# --------------------------------------------------------------------------------------------

def build_wheel(name, radius, W, mats, parent, location, bevel_cfg):
    """Rueda con eje de giro X local, origen en el centro del buje."""
    bm = bmesh.new()
    wood, iron = 0, 1
    # Aro de madera + llanta de hierro (banda exterior)
    bm_ring_x(bm, 0.0, radius, radius - W["rim_depth"], W["rim_width"], W["ring_segments"],
              mat_side=wood, mat_outer=iron, mat_inner=wood)
    # Buje (madera) y tapa exterior (hierro). La tapa sobresale hacia fuera del vehículo (+X para la
    # derecha, se refleja para la izquierda en build_wheel_pair).
    bm_cylinder(bm, "x", (0, 0, 0), W["hub_radius"], W["hub_length"], W["hub_segments"], mat=wood)
    bm_cylinder(bm, "x", (W["hub_length"] / 2 + W["hub_cap_length"] / 2, 0, 0), W["hub_cap_radius"],
                W["hub_cap_length"], W["hub_segments"], mat=iron)
    # Radios
    r_in = radius - W["rim_depth"] + 0.004
    r_hub = W["hub_radius"] - 0.01
    for i in range(W["spokes"]):
        a = 2 * math.pi * i / W["spokes"]
        d = Vector((0, math.cos(a), math.sin(a)))
        p0, p1 = d * r_hub, d * r_in
        mid = (p0 + p1) / 2
        length = (p1 - p0).length
        faces = bm_cylinder(bm, "y", (0, 0, 0), W["spoke_radius"], length, W["spoke_segments"], mat=wood, caps=True)
        # orientar el radio: cilindro creado a lo largo de Y, girar alrededor de X hasta la dirección d
        rot = Matrix.Rotation(a, 4, "X")
        verts = {v for f in faces for v in f.verts}
        for v in verts:
            v.co = rot @ v.co + mid
    me = finish_mesh(bm, name + "_mesh", [mats["JIA_Wood_Brown"], mats["JIA_Iron_Dark"]])
    ob = new_object(name, me, parent, location)
    # Sin bisel: a escala de mapa no aporta y triplicaría el coste de la rueda.
    return ob


def build_body(cfg, mats, parent, bevel_cfg):
    B = cfg["body"]
    bm = bmesh.new()
    honey, brown, iron = 0, 1, 2
    L, Wi, t = B["length"], B["inner_width"], B["wall_thickness"]
    y0, y1 = -L / 2, L / 2
    xo = Wi / 2 + t  # exterior de la pared
    zf0 = B["floor_bottom_z"]
    zf1 = zf0 + B["floor_thickness"]
    ztop = zf0 + B["wall_height"]
    # Suelo
    bm_box(bm, -Wi / 2 - t, Wi / 2 + t, y0, y1, zf0, zf1, honey)
    # Tablones laterales (horizontales) y frontal/trasero
    n = B["planks_per_wall"]
    ph = (B["wall_height"] - B["plank_gap"] * (n - 1)) / n
    for k in range(n):
        z0 = zf0 + k * (ph + B["plank_gap"])
        z1 = z0 + ph
        bm_box(bm, Wi / 2, xo, y0, y1, z0, z1, honey)        # derecha
        bm_box(bm, -xo, -Wi / 2, y0, y1, z0, z1, honey)      # izquierda
        bm_box(bm, -Wi / 2, Wi / 2, y1 - t, y1, z0, z1, honey)   # frontal
        bm_box(bm, -Wi / 2, Wi / 2, y0, y0 + t, z0, z1, honey)   # trasero
    # Estacas verticales (refuerzos) por fuera de cada lateral, y en las esquinas frontal/trasera
    sw, sp = B["stake_width"], B["stake_proud"]
    zs0, zs1 = zf0 - B["stake_overhang_bottom"], ztop + B["stake_overhang_top"]
    ns = B["stakes_per_side"]
    for k in range(ns):
        y = y0 + sw / 2 + 0.02 + (L - sw - 0.04) * k / (ns - 1)
        bm_box(bm, xo, xo + sp, y - sw / 2, y + sw / 2, zs0, zs1, brown)
        bm_box(bm, -xo - sp, -xo, y - sw / 2, y + sw / 2, zs0, zs1, brown)
    # Barandas superiores (listón sobre cada lateral)
    rh, rw = B["rail_height"], B["rail_width"]
    bm_box(bm, xo - rw + sp, xo + sp, y0, y1, ztop, ztop + rh, brown)
    bm_box(bm, -xo - sp, -xo + rw - sp, y0, y1, ztop, ztop + rh, brown)
    bm_box(bm, -xo - sp, xo + sp, y1 - rw, y1, ztop, ztop + rh, brown)
    bm_box(bm, -xo - sp, xo + sp, y0, y0 + rw, ztop, ztop + rh, brown)
    # Largueros bajo el suelo (dentro de la vía; no interfieren con el giro de las ruedas delanteras)
    sx, sh = B["sill_width"], B["sill_height"]
    xi = B["sill_inset_x"]
    bm_box(bm, xi, xi + sx, y0 + 0.05, y1 - 0.05, zf0 - sh, zf0, brown)
    bm_box(bm, -xi - sx, -xi, y0 + 0.05, y1 - 0.05, zf0 - sh, zf0, brown)
    # Travesaño delantero bajo el suelo (sobre el pivote de dirección)
    cb = B["front_crossbeam"]
    bm_box(bm, -xi - sx, xi + sx, cb["y"] - cb["depth"] / 2, cb["y"] + cb["depth"] / 2, zf0 - sh - cb["height"], zf0 - sh, brown)
    me = finish_mesh(bm, "JIA_Body_mesh", [mats["JIA_Wood_Honey"], mats["JIA_Wood_Brown"], mats["JIA_Iron_Dark"]])
    ob = new_object("JIA_Body", me, parent)
    add_bevel(ob, bevel_cfg)
    return ob, dict(xo=xo, ztop=ztop + rh, zf0=zf0, y0=y0, y1=y1, sp=sp)


def canvas_profile(C, body_ztop):
    """Perfil transversal (x, z) de la lona, de derecha a izquierda, con ligero rizo interior abajo."""
    a0 = math.radians(C["curl_angle_deg"])
    Rx = C["max_half_width"]
    z_bot = body_ztop + C["bottom_z_offset"]
    # top = zc + Rz ; bottom = zc - Rz*sin(a0)  ->  Rz = (top - z_bot) / (1 + sin a0)
    Rz = (C["top_z"] - z_bot) / (1 + math.sin(a0))
    zc = z_bot + Rz * math.sin(a0)
    n = C["profile_segments"]
    pts = []
    for i in range(n + 1):
        a = -a0 + (math.pi + 2 * a0) * i / n
        pts.append((Rx * math.cos(a), zc + Rz * math.sin(a)))
    return pts, z_bot, zc


def build_canvas(cfg, mats, parent, body_ztop):
    C = cfg["canvas"]
    prof, z_bot, zc = canvas_profile(C, body_ztop)
    y_min, y_max = C["y_min"], C["y_max"]
    L = y_max - y_min
    bows = C["bows"]
    yb0 = y_min + C["bow_margin"]
    spacing = (L - 2 * C["bow_margin"]) / (bows - 1)

    def scale_at(y):
        u = (y - (y_min + y_max) / 2) / (L / 2)          # -1..1
        rise = 1.0 + C["end_rise"] * u ** 2
        phase = (y - yb0) / spacing
        sag = 1.0 - C["sag_between_bows"] * math.sin(math.pi * phase) ** 2
        ridge = 0.0
        for b in range(bows):
            yb = yb0 + b * spacing
            ridge += math.exp(-((y - yb) / C["bow_ridge_width"]) ** 2)
        return rise * sag * (1.0 + C["bow_ridge"] * ridge)

    def station(y, s, pucker=1.0, zopen=None):
        """Vértices del perfil en la estación y, escala s (respecto a la línea inferior) y fruncido."""
        out = []
        for (x, z) in prof:
            x2, z2 = x * s, z_bot + (z - z_bot) * s
            if pucker < 1.0:
                x2 = x2 * pucker
                z2 = zopen + (z2 - zopen) * pucker
            out.append((x2, y, z2))
        return out

    bm = bmesh.new()
    rows = []
    zopen = zc + C["opening_center_z_offset"]
    # Fruncido trasero (entra hacia el interior del vehículo desde y_min - largo hasta y_min)
    m = C["rear_pucker_steps"]
    for k in range(m, 0, -1):
        f = k / m
        p = 1 - (1 - C["rear_pucker_scale"]) * (1 - math.cos(math.pi * f / 2))
        y = y_min - C["rear_pucker_length"] * math.sin(math.pi * f / 2)
        rows.append(station(y, scale_at(y_min), p, zopen))
    # Cuerpo de la lona
    for i in range(C["stations"] + 1):
        y = y_min + L * i / C["stations"]
        rows.append(station(y, scale_at(y)))
    # Fruncido delantero (abertura mayor)
    m = C["front_pucker_steps"]
    for k in range(1, m + 1):
        f = k / m
        p = 1 - (1 - C["front_pucker_scale"]) * (1 - math.cos(math.pi * f / 2))
        y = y_max + C["front_pucker_length"] * math.sin(math.pi * f / 2)
        rows.append(station(y, scale_at(y_max), p, zopen))
    vrows = [[bm.verts.new(p) for p in r] for r in rows]
    for r in range(len(vrows) - 1):
        for i in range(len(prof) - 1):
            # Orden elegido para que la normal apunte hacia FUERA (Solidify crece hacia dentro)
            f = bm.faces.new((vrows[r][i], vrows[r + 1][i], vrows[r + 1][i + 1], vrows[r][i + 1]))
            f.smooth = True
            f.material_index = 0
    # Tapa trasera plana (cierra el fruncido trasero); normal hacia -Y
    cap = bm.faces.new(list(vrows[0]))
    cap.smooth = False
    cap.material_index = 0
    me = finish_mesh(bm, "JIA_Canvas_mesh", [mats["JIA_Canvas_Cream"], mats["JIA_Canvas_Shade"]], sharp_angle_deg=60, recalc=False)
    ob = new_object("JIA_Canvas", me, parent)
    sol = ob.modifiers.new("Solidify", "SOLIDIFY")
    sol.thickness = C["thickness"]
    sol.offset = -1.0          # el grosor crece hacia el interior
    sol.use_rim = True
    sol.material_offset = 1    # cara interior: JIA_Canvas_Shade
    sol.material_offset_rim = 1
    return ob, dict(y_front_open=y_max + C["front_pucker_length"], y_rear=y_min - C["rear_pucker_length"])


def build_driver_seat(cfg, mats, parent, bevel_cfg):
    """Pescante: estribo apoyado en dos rieles desde la caja, cajón de asiento sobre el estribo y respaldo."""
    S = cfg["driver_seat"]
    bm = bmesh.new()
    honey, brown = 0, 1
    hw = S["seat_half_width"]
    fz0 = S["footboard_z"]; fz1 = fz0 + S["footboard_thickness"]
    # Estribo (tabla) y dos rieles de apoyo que salen de la caja
    fh = S["footboard_half_width"]
    bm_box(bm, -fh, fh, S["footboard_y_min"], S["footboard_y_max"], fz0, fz1, honey)
    for sx in (-1, 1):
        bm_box(bm, sx * (fh - 0.10) - 0.025, sx * (fh - 0.10) + 0.025, S["rail_y_min"], S["footboard_y_max"] - 0.03, fz0 - 0.05, fz0, brown)
    # Cajón del asiento (bloque) sobre el estribo, con tapa y respaldo
    bm_box(bm, -hw, hw, S["seat_y_min"], S["seat_y_max"], fz1, S["seat_z_max"] - 0.03, honey)
    bm_box(bm, -hw - 0.012, hw + 0.012, S["seat_y_min"] - 0.012, S["seat_y_max"] + 0.012, S["seat_z_max"] - 0.03, S["seat_z_max"], brown)
    bm_box(bm, -hw, hw, S["seat_y_min"], S["seat_y_min"] + S["backrest_thickness"], S["seat_z_max"], S["backrest_top_z"], brown)
    me = finish_mesh(bm, "JIA_DriverSeat_mesh", [mats["JIA_Wood_Honey"], mats["JIA_Wood_Brown"]])
    ob = new_object("JIA_DriverSeat", me, parent)
    add_bevel(ob, bevel_cfg)
    return ob


def build_details(cfg, mats, parent, body_info, bevel_cfg):
    D = cfg["details"]
    B = cfg["body"]
    bm = bmesh.new()
    honey, brown, iron = 0, 1, 2
    tb = D["toolbox"]
    bm_box(bm, tb["x_min"], tb["x_max"], tb["y_min"], tb["y_max"], tb["z_min"], tb["z_max"], honey)
    # Tapa del cofre ligeramente mayor
    bm_box(bm, tb["x_min"] - 0.005, tb["x_max"] + 0.012, tb["y_min"] - 0.01, tb["y_max"] + 0.01, tb["z_max"], tb["z_max"] + 0.025, brown)
    # Herrajes de esquina (flejes verticales) en las cuatro esquinas de la caja
    xo, sp = body_info["xo"], body_info["sp"]
    w, th = D["corner_strap_width"], D["corner_strap_thickness"]
    z0, z1 = body_info["zf0"] + 0.03, body_info["ztop"] - 0.005  # por encima de la cota superior de la rueda delantera (giro)
    for sx in (-1, 1):
        for yy in (body_info["y0"], body_info["y1"]):
            ys = (yy, yy + w) if yy < 0 else (yy - w, yy)
            bm_box(bm, sx * (xo + sp) - (th if sx < 0 else 0), sx * (xo + sp) + (th if sx > 0 else 0), ys[0], ys[1], z0, z1, iron)
    # Ganchos de cuerda de la lona: pequeños tacos oscuros en el borde superior, entre estacas
    if D.get("rope_hooks"):
        ns = B["stakes_per_side"]
        L = B["length"]
        for k in range(ns - 1):
            y = body_info["y0"] + 0.05 + (L - 0.10) * (k + 0.5) / (ns - 1)
            for sx in (-1, 1):
                bm_box(bm, sx * xo - (0.018 if sx < 0 else -0.002), sx * xo + (0.018 if sx > 0 else -0.002),
                       y - 0.015, y + 0.015, body_info["ztop"] - 0.13, body_info["ztop"] - 0.10, iron)
    me = finish_mesh(bm, "JIA_Details_mesh", [mats["JIA_Wood_Honey"], mats["JIA_Wood_Brown"], mats["JIA_Iron_Dark"]])
    ob = new_object("JIA_Details", me, parent)
    add_bevel(ob, bevel_cfg)
    return ob


def build_chassis(cfg, mats, parent, bevel_cfg):
    """Eje trasero, bolster trasero y varal central. Coordenadas locales = ROOT (suelo, centro)."""
    W, CH, B = cfg["wheels"], cfg["chassis"], cfg["body"]
    bm = bmesh.new()
    brown, iron = 0, 1
    y_r = -W["wheelbase"] / 2
    y_f = W["wheelbase"] / 2
    r_r = W["rear_radius"]
    a = CH["axle_section"]
    half_track = W["track_width"] / 2
    # Eje trasero (viga) hasta el interior de los bujes + muñones cilíndricos dentro de los bujes
    bm_box_c(bm, (0, y_r, r_r), (W["track_width"] - W["hub_length"] - 0.02, a, a), brown)
    for sx in (-1, 1):
        bm_cylinder(bm, "x", (sx * (half_track - W["hub_length"] / 2 - 0.01), y_r, r_r), CH["spindle_radius"], W["hub_length"] * 0.9 + 0.02, 10, mat=iron)
    # Bolster trasero: bloque entre el eje y el suelo de la caja
    zf0 = B["floor_bottom_z"]
    bm_box(bm, -CH["bolster_half_width"], CH["bolster_half_width"], y_r - CH["bolster_depth"] / 2, y_r + CH["bolster_depth"] / 2, r_r + a / 2, zf0, brown)
    # Varal central (reach) del eje trasero al delantero
    rw = CH["reach_half_width"]
    bm_box(bm, -rw, rw, y_r, y_f + 0.10, CH["reach_z_min"], CH["reach_z_max"], brown)
    me = finish_mesh(bm, "JIA_Chassis_mesh", [mats["JIA_Wood_Brown"], mats["JIA_Iron_Dark"]])
    ob = new_object("JIA_Chassis", me, parent)
    add_bevel(ob, bevel_cfg)
    return ob


def build_front_axle(cfg, mats, parent, bevel_cfg):
    """Eje delantero en coordenadas locales de JIA_FrontSteer (origen en el centro del eje delantero)."""
    W, CH, B = cfg["wheels"], cfg["chassis"], cfg["body"]
    bm = bmesh.new()
    brown, iron = 0, 1
    r_f = W["front_radius"]
    a = CH["axle_section"]
    half_track = W["track_width"] / 2
    bm_box_c(bm, (0, 0, 0), (W["track_width"] - W["hub_length"] - 0.02, a, a), brown)
    for sx in (-1, 1):
        bm_cylinder(bm, "x", (sx * (half_track - W["hub_length"] / 2 - 0.01), 0, 0), CH["spindle_radius"], W["hub_length"] * 0.9 + 0.02, 10, mat=iron)
    # Bolster delantero (bloque) y pivote vertical hasta el suelo de la caja
    zf0 = B["floor_bottom_z"] - r_f  # suelo de la caja, relativo al centro del eje
    bh = CH["front_bolster_height"]
    bm_box(bm, -CH["bolster_half_width"], CH["bolster_half_width"], -CH["bolster_depth"] / 2, CH["bolster_depth"] / 2, a / 2, a / 2 + bh, brown)
    # Pivote de dirección (kingpin): del bolster al suelo de la caja, atravesando la zona del varal
    bm_cylinder(bm, "z", (0, 0, (a / 2 + bh + zf0) / 2), CH["kingpin_radius"], zf0 - (a / 2 + bh) - 0.004, 12, mat=iron)
    me = finish_mesh(bm, "JIA_FrontAxle_mesh", [mats["JIA_Wood_Brown"], mats["JIA_Iron_Dark"]])
    ob = new_object("JIA_FrontAxle", me, parent)
    add_bevel(ob, bevel_cfg)
    return ob


# --------------------------------------------------------------------------------------------
# Escena: cámaras, luces, suelo de prueba
# --------------------------------------------------------------------------------------------

def look_at_rotation(location, target):
    d = Vector(target) - Vector(location)
    return d.to_track_quat("-Z", "Y").to_euler()


def build_cameras(cfg, coll):
    K = cfg["cameras"]
    cams = {}
    # Cenital estricta: encima, mirando -Z, con +Y de la escena hacia arriba en la imagen
    cam = bpy.data.cameras.new("JIA_Camera_Top")
    cam.type = "ORTHO"; cam.ortho_scale = K["ortho_scale"]; cam.clip_end = 100
    ob = bpy.data.objects.new("JIA_Camera_Top", cam); coll.objects.link(ob)
    ob.location = (0, 0, K["top_height"]); ob.rotation_euler = (0, 0, 0)
    cams["top"] = ob
    # Cenital inclinada ~12° (vista desde delante, mirando hacia -Y y abajo)
    t = math.radians(K["tilt_deg"])
    cam = bpy.data.cameras.new("JIA_Camera_TopTilt")
    cam.type = "ORTHO"; cam.ortho_scale = K["ortho_scale"]; cam.clip_end = 100
    ob = bpy.data.objects.new("JIA_Camera_TopTilt", cam); coll.objects.link(ob)
    ob.location = (0, K["top_height"] * math.sin(t), K["top_height"] * math.cos(t))
    ob.rotation_euler = (-t, 0, 0)
    cams["tilt"] = ob
    # Tres cuartos (perspectiva)
    cam = bpy.data.cameras.new("JIA_Camera_Review")
    cam.type = "PERSP"; cam.lens = K["review_focal_mm"]; cam.clip_end = 100
    ob = bpy.data.objects.new("JIA_Camera_Review", cam); coll.objects.link(ob)
    ob.location = K["review_location"]
    ob.rotation_euler = look_at_rotation(K["review_location"], K["review_target"])
    cams["review"] = ob
    return cams


def build_lighting(cfg, coll_warm, coll_neutral):
    R = cfg["render"]
    # Cálida de presentación
    sun = bpy.data.lights.new("JIA_Sun_Warm", "SUN")
    sun.energy = R["sun_warm_strength"]; sun.color = hex_to_linear_rgba(R["sun_warm"])[:3]; sun.angle = math.radians(8)
    ob = bpy.data.objects.new("JIA_Sun_Warm", sun); coll_warm.objects.link(ob)
    ob.rotation_euler = [math.radians(v) for v in R["sun_warm_rotation_deg"]]
    fill = bpy.data.lights.new("JIA_Fill_Warm", "AREA")
    fill.energy = R["fill_strength"]; fill.size = 6.0; fill.color = (0.95, 0.92, 0.88)
    ob = bpy.data.objects.new("JIA_Fill_Warm", fill); coll_warm.objects.link(ob)
    ob.location = (-3.5, 2.5, 4.0); ob.rotation_euler = look_at_rotation(ob.location, (0, 0, 1))
    # Neutra de revisión
    sun_n = bpy.data.lights.new("JIA_Sun_Neutral", "SUN")
    sun_n.energy = R["sun_neutral_strength"]; sun_n.color = (1, 1, 1); sun_n.angle = math.radians(5)
    ob = bpy.data.objects.new("JIA_Sun_Neutral", sun_n); coll_neutral.objects.link(ob)
    ob.rotation_euler = (math.radians(35), 0, math.radians(20))


def set_world(color_hex, strength):
    world = bpy.context.scene.world
    if world is None:
        world = bpy.data.worlds.new("JIA_World"); bpy.context.scene.world = world
    world.use_nodes = True
    bg = world.node_tree.nodes.get("Background")
    bg.inputs["Color"].default_value = hex_to_linear_rgba(color_hex)
    bg.inputs["Strength"].default_value = strength


def build_ground(cfg, coll, mats_extra):
    """Plano de papel para las pruebas de legibilidad; oculto por defecto y NUNCA exportado."""
    bm = bmesh.new()
    bmesh.ops.create_grid(bm, x_segments=1, y_segments=1, size=6.0)
    me = bpy.data.meshes.new("JIA_TestGround_mesh")
    bm.to_mesh(me); bm.free()
    mat = bpy.data.materials.new("JIA_TestPaper")
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes.get("Principled BSDF")
    bsdf.inputs["Base Color"].default_value = hex_to_linear_rgba(cfg["render"]["paper_color"])
    bsdf.inputs["Roughness"].default_value = 1.0
    me.materials.append(mat)
    ob = bpy.data.objects.new("JIA_TestGround", me); coll.objects.link(ob)
    ob.hide_render = True; ob.hide_viewport = True
    return ob


# --------------------------------------------------------------------------------------------
# Render
# --------------------------------------------------------------------------------------------

def configure_render(scene, cfg, quick):
    R = cfg["render"]
    engine_set = False
    for eng in ("BLENDER_EEVEE", "BLENDER_EEVEE_NEXT"):
        try:
            scene.render.engine = eng
            engine_set = True
            break
        except TypeError:
            continue
    if not engine_set:
        scene.render.engine = "CYCLES"
        scene.cycles.samples = 32
    if scene.render.engine.startswith("BLENDER_EEVEE"):
        scene.eevee.taa_render_samples = 16 if quick else R["samples"]
        try:
            scene.eevee.use_shadows = True
        except AttributeError:
            pass
    scene.render.film_transparent = True
    scene.render.image_settings.file_format = "PNG"
    scene.render.image_settings.color_mode = "RGBA"
    scene.render.image_settings.compression = 60
    scene.view_settings.view_transform = "Standard"   # sin AgX/Filmic: colores tal cual, sin look cinematográfico
    scene.view_settings.look = "None"
    return scene.render.engine


def render_to(scene, cam, path, res):
    scene.camera = cam
    scene.render.resolution_x, scene.render.resolution_y = res
    scene.render.resolution_percentage = 100
    scene.render.filepath = path
    bpy.ops.render.render(write_still=True)


def compose_sheet(paths, cell_w, cell_h, cols, out_path, bg=(0.945, 0.906, 0.847, 1.0)):
    """Hoja de contacto a partir de PNGs renderizados (para revisar orientaciones/legibilidad)."""
    rows = math.ceil(len(paths) / cols)
    W, H = cell_w * cols, cell_h * rows
    sheet = bpy.data.images.new("JIA_sheet", W, H, alpha=True)
    px = [bg[0], bg[1], bg[2], 1.0] * (W * H)
    for idx, p in enumerate(paths):
        img = bpy.data.images.load(p)
        iw, ih = img.size
        src = list(img.pixels)
        ox = (idx % cols) * cell_w + (cell_w - iw) // 2
        oy = (rows - 1 - idx // cols) * cell_h + (cell_h - ih) // 2
        for y in range(ih):
            for x in range(iw):
                s = (y * iw + x) * 4
                a = src[s + 3]
                if a <= 0.0:
                    continue
                d = ((oy + y) * W + (ox + x)) * 4
                for c in range(3):
                    px[d + c] = src[s + c] * a + px[d + c] * (1 - a)
                px[d + 3] = 1.0
        bpy.data.images.remove(img)
    sheet.pixels = px
    sheet.filepath_raw = out_path
    sheet.file_format = "PNG"
    sheet.save()
    bpy.data.images.remove(sheet)


# --------------------------------------------------------------------------------------------
# Exportación GLB
# --------------------------------------------------------------------------------------------

def export_glb(scene, root, path):
    for ob in scene.objects:
        ob.select_set(False)
    def sel(o):
        o.select_set(True)
        for c in o.children:
            sel(c)
    sel(root)
    bpy.context.view_layer.objects.active = root
    base = dict(
        filepath=path,
        export_format="GLB",
        use_selection=True,
        export_apply=True,          # aplica bevel/solidify SOLO en la exportación
        export_yup=True,            # Blender +Z arriba -> glTF +Y; Blender +Y avance -> glTF -Z
        export_animations=False,
        export_cameras=False,
        export_lights=False,
        export_materials="EXPORT",
        export_extras=False,
    )
    extra = dict(export_skins=False, export_morph=False, export_image_format="AUTO", export_texcoords=True,
                 export_normals=True, export_tangents=False, export_hierarchy_full_collections=False)
    try:
        bpy.ops.export_scene.gltf(**base, **extra)
    except TypeError as e:  # nombres de parámetros cambiados entre versiones del exportador
        print("export_scene.gltf: reintento con parámetros mínimos:", e)
        bpy.ops.export_scene.gltf(**base)


# --------------------------------------------------------------------------------------------
# Programa principal
# --------------------------------------------------------------------------------------------

def main():
    opts = parse_args()
    cfg_path, out_dir = check_paths(opts)
    with open(cfg_path, "r", encoding="utf-8") as fh:
        cfg = json.load(fh)
    name = cfg["asset_name"]
    blend_path = os.path.join(out_dir, f"{name}.blend")
    glb_path = os.path.join(out_dir, f"{name}.glb")
    for p in (blend_path, glb_path):
        guard_overwrite(p, opts["overwrite"])

    # Fichero nuevo y vacío (modo background: no afecta a ninguna sesión abierta)
    bpy.ops.wm.read_factory_settings(use_empty=True)
    scene = bpy.context.scene
    scene.name = "JIA_Carruaje"
    scene.unit_settings.system = "METRIC"; scene.unit_settings.scale_length = 1.0

    # Colecciones
    col_asset = bpy.data.collections.new("JIA_Carruaje_Asset")
    col_review = bpy.data.collections.new("JIA_Review_Cameras")
    col_light_w = bpy.data.collections.new("JIA_Lighting_Warm")
    col_light_n = bpy.data.collections.new("JIA_Lighting_Neutral")
    col_test = bpy.data.collections.new("JIA_Test_NoExport")
    for c in (col_asset, col_review, col_light_w, col_light_n, col_test):
        scene.collection.children.link(c)

    mats = {k: make_material(k, v) for k, v in cfg["materials"].items()}
    W = cfg["wheels"]
    bevel_cfg = cfg["bevel"]
    r_f, r_r = W["front_radius"], W["rear_radius"]
    y_f, y_r = W["wheelbase"] / 2, -W["wheelbase"] / 2
    half_track = W["track_width"] / 2

    # --- Nodos de control ---
    root = bpy.data.objects.new("JIA_Wagon_ROOT", None); col_asset.objects.link(root)
    root.empty_display_type = "ARROWS"; root.empty_display_size = 0.5
    body_motion = new_object("JIA_BodyMotion", None, root, (0, 0, cfg["body"]["floor_bottom_z"]), col_asset)
    body_motion.empty_display_type = "PLAIN_AXES"; body_motion.empty_display_size = 0.3
    front_steer = new_object("JIA_FrontSteer", None, root, (0, y_f, r_f), col_asset)
    front_steer.empty_display_type = "PLAIN_AXES"; front_steer.empty_display_size = 0.3

    # --- Piezas (las mallas hijas de BodyMotion se construyen en coordenadas ROOT y se compensa
    #     su origen para que BodyMotion pueda balancear desde el plano inferior de la caja) ---
    body, body_info = build_body(cfg, mats, body_motion, bevel_cfg)
    canvas, canvas_info = build_canvas(cfg, mats, body_motion, body_info["ztop"])
    seat = build_driver_seat(cfg, mats, body_motion, bevel_cfg)
    details = build_details(cfg, mats, body_motion, body_info, bevel_cfg)
    for ob in (body, canvas, seat, details):
        ob.location = (0, 0, -cfg["body"]["floor_bottom_z"])  # compensa el pivote de BodyMotion

    chassis = build_chassis(cfg, mats, root, bevel_cfg)
    front_axle = build_front_axle(cfg, mats, front_steer, bevel_cfg)

    # Ruedas: origen en el centro del buje; eje de giro = X local. Las ruedas izquierdas se construyen
    # como espejo (tapa del buje hacia fuera) escalando la malla, no el objeto (escala objeto = +1).
    wheel_specs = [
        ("JIA_Wheel_FR", r_f, front_steer, (half_track, 0, 0), +1),
        ("JIA_Wheel_FL", r_f, front_steer, (-half_track, 0, 0), -1),
        ("JIA_Wheel_RR", r_r, root, (half_track, y_r, r_r), +1),
        ("JIA_Wheel_RL", r_r, root, (-half_track, y_r, r_r), -1),
    ]
    wheels = {}
    for wname, rad, parent, loc, side in wheel_specs:
        ob = build_wheel(wname, rad, W, mats, parent, loc, bevel_cfg)
        if side < 0:
            me = ob.data
            for v in me.vertices:
                v.co.x = -v.co.x
            me.flip_normals()
        wheels[wname] = ob
    for ob in (body, canvas, seat, details, chassis, front_axle, *wheels.values()):
        col_asset.objects.link(ob) if ob.name not in col_asset.objects else None
        if ob.name in scene.collection.objects:
            scene.collection.objects.unlink(ob)
    for ob in (body_motion, front_steer):
        if ob.name in scene.collection.objects:
            scene.collection.objects.unlink(ob)

    # --- Escena de revisión ---
    cams = build_cameras(cfg, col_review)
    build_lighting(cfg, col_light_w, col_light_n)
    ground = build_ground(cfg, col_test, mats)
    set_world(cfg["render"]["world_warm"], cfg["render"]["world_warm_strength"])
    col_light_n.hide_render = True
    scene.camera = cams["top"]

    # --- Propiedades de contrato (custom properties, legibles pero no necesarias en el GLB) ---
    root["jia_forward_axis_blender"] = "+Y"
    root["jia_up_axis_blender"] = "+Z"
    root["jia_wheelbase_m"] = W["wheelbase"]
    root["jia_track_m"] = W["track_width"]
    root["jia_front_wheel_radius_m"] = r_f
    root["jia_rear_wheel_radius_m"] = r_r

    # --- Métricas de geometría (evaluada, con modificadores) ---
    deps = bpy.context.evaluated_depsgraph_get()
    metrics = {"objects": {}, "total_triangles": 0, "total_vertices": 0}
    bbox_min = Vector((1e9, 1e9, 1e9)); bbox_max = Vector((-1e9, -1e9, -1e9))
    def walk(o):
        yield o
        for c in o.children:
            yield from walk(c)
    for o in walk(root):
        if o.type != "MESH":
            continue
        ev = o.evaluated_get(deps)
        me = ev.to_mesh()
        me.calc_loop_triangles()
        tris = len(me.loop_triangles); verts = len(me.vertices)
        metrics["objects"][o.name] = {"triangles": tris, "vertices": verts, "materials": [m.name for m in o.data.materials]}
        metrics["total_triangles"] += tris; metrics["total_vertices"] += verts
        for v in me.vertices:
            wv = ev.matrix_world @ v.co
            bbox_min = Vector(map(min, bbox_min, wv)); bbox_max = Vector(map(max, bbox_max, wv))
        ev.to_mesh_clear()
    metrics["bbox_min"] = list(bbox_min); metrics["bbox_max"] = list(bbox_max)
    metrics["dimensions"] = list(bbox_max - bbox_min)
    metrics["materials_used"] = sorted({m for d in metrics["objects"].values() for m in d["materials"]})
    metrics["wheelbase"] = W["wheelbase"]; metrics["track"] = W["track_width"]
    metrics["front_radius"] = r_f; metrics["rear_radius"] = r_r
    metrics["canvas"] = canvas_info
    metrics["blender_version"] = bpy.app.version_string

    # --- Render de previsualizaciones ---
    engine = configure_render(scene, cfg, opts["quick"])
    metrics["render_engine"] = engine
    R = cfg["render"]
    prev = os.path.join(out_dir, "previews")
    rendered = []
    if not opts["no_render"]:
        render_to(scene, cams["top"], os.path.join(prev, "top.png"), R["resolution_top"]); rendered.append("top.png")
        render_to(scene, cams["tilt"], os.path.join(prev, "top-tilt.png"), R["resolution_top"]); rendered.append("top-tilt.png")
        render_to(scene, cams["review"], os.path.join(prev, "review-3-4.png"), R["resolution_review"]); rendered.append("review-3-4.png")
        # Revisión neutra (materiales sin color de ambiente cálido)
        col_light_w.hide_render = True; col_light_n.hide_render = False
        set_world(R["world_neutral"], R["world_neutral_strength"])
        render_to(scene, cams["review"], os.path.join(prev, "review-3-4-neutral.png"), R["resolution_review"]); rendered.append("review-3-4-neutral.png")
        render_to(scene, cams["top"], os.path.join(prev, "top-neutral.png"), R["resolution_top"]); rendered.append("top-neutral.png")
        col_light_w.hide_render = False; col_light_n.hide_render = True
        set_world(R["world_warm"], R["world_warm_strength"])
        # Legibilidad a tamaños pequeños sobre papel: longitud visible del vehículo = N px
        ground.hide_render = False
        leg_dir = os.path.join(prev, "legibility")
        ortho = cfg["cameras"]["ortho_scale"]; veh_len = metrics["dimensions"][1]  # longitud medida (Y)
        sheet_cells = []
        for n_px in R["legibility_lengths_px"]:
            px_per_m = n_px / veh_len
            h = int(round(ortho * px_per_m)); w = int(round(h * 0.72))
            p = os.path.join(leg_dir, f"top-{n_px}px.png")
            render_to(scene, cams["top"], p, (w, h)); rendered.append(f"legibility/top-{n_px}px.png")
            sheet_cells.append(p)
        # Ocho orientaciones de la raíz a 160 px (la raíz vuelve a 0° antes de guardar/exportar)
        rot_paths = []
        n_px = 160; px_per_m = n_px / veh_len
        h = int(round(ortho * px_per_m)); w = h  # cuadrado para orientaciones libres
        for k in range(8):
            root.rotation_euler = (0, 0, math.radians(45 * k))
            p = os.path.join(leg_dir, f"top-160px-rot{45 * k:03d}.png")
            render_to(scene, cams["top"], p, (w, h)); rot_paths.append(p)
        root.rotation_euler = (0, 0, 0)
        compose_sheet(rot_paths, w + 8, h + 8, 4, os.path.join(prev, "orientations-160px.png")); rendered.append("orientations-160px.png")
        compose_sheet(sheet_cells, max(int(round(ortho * n / veh_len * 0.72)) for n in R["legibility_lengths_px"]) + 12,
                      max(int(round(ortho * n / veh_len)) for n in R["legibility_lengths_px"]) + 12, 3,
                      os.path.join(prev, "legibility-96-160-256.png")); rendered.append("legibility-96-160-256.png")
        ground.hide_render = True
    metrics["previews"] = rendered

    # --- Pose de reposo garantizada antes de guardar/exportar ---
    root.location = (0, 0, 0); root.rotation_euler = (0, 0, 0); root.scale = (1, 1, 1)
    body_motion.rotation_euler = (0, 0, 0); front_steer.rotation_euler = (0, 0, 0)
    for wob in wheels.values():
        wob.rotation_euler = (0, 0, 0)
    scene.camera = cams["top"]
    scene.frame_set(1)

    # --- Guardar .blend (cámara cenital activa) y exportar GLB ---
    bpy.ops.wm.save_as_mainfile(filepath=blend_path, compress=True)
    export_glb(scene, root, glb_path)
    metrics["glb_bytes"] = os.path.getsize(glb_path)
    metrics["blend_bytes"] = os.path.getsize(blend_path)

    with open(os.path.join(out_dir, "previews", "generation-metrics.json"), "w", encoding="utf-8") as fh:
        json.dump(metrics, fh, indent=2, ensure_ascii=False)
    print("JIA_CARRUAJE_OK", json.dumps({k: metrics[k] for k in ("total_triangles", "total_vertices", "dimensions", "glb_bytes", "render_engine", "materials_used")}))


if __name__ == "__main__":
    try:
        main()
    except SystemExit as e:
        print(f"JIA_CARRUAJE_ABORT: {e}")
        raise
    except Exception:
        traceback.print_exc()
        print("JIA_CARRUAJE_ERROR")
        sys.exit(1)
