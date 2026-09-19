/**
 * The tree's geometry, grown from a seed: no DOM, no renderer, no model file. The wood (trunk and branches) is one
 * merged mesh of tapering tubes; the foliage is a list of instances of one small leaf, massed around the branch tips;
 * the mound is a flattened, roughened cap with a few pebbles. The tree stands on its own origin (the foot of the
 * trunk, y up); the mound is built below it. Same seed, same options → same tree.
 */
import * as THREE from "three";
import type { TreeOptions } from "./config";

export type ResolvedPalette = { leaves: THREE.Color[]; trunk: THREE.Color; trunkDark: THREE.Color; ground: THREE.Color; groundDark: THREE.Color };

export type LeafInstances = {
  count: number;
  /** 16 floats per leaf. */
  matrices: Float32Array;
  /** rgb per leaf. */
  colors: Float32Array;
  /** Per leaf: the direction out of the crown (the normal the light sees). */
  outward: Float32Array;
  /** Per leaf: x = phase of its flutter, y = when it opens (0 first, 1 last). */
  leaf: Float32Array;
};

export type BuiltTree = {
  wood: THREE.BufferGeometry;
  leafShape: THREE.BufferGeometry;
  leaves: LeafInstances;
  mound: THREE.BufferGeometry;
  pebbles: THREE.BufferGeometry | null;
  /** How far the foot of the trunk stands above the ground plane (the mound's top, a little sunk). */
  footY: number;
  /** Height of the tree above its foot: the wind's lever. */
  height: number;
  /** Everything, in the space of the ground plane (y = 0). */
  bounds: THREE.Box3;
};

/** mulberry32: small, fast, good enough to grow a tree. */
export function seeded(seed: number): () => number {
  let a = seed >>> 0 || 1;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Buffers = { pos: number[]; nor: number[]; col: number[]; idx: number[] };

const UP = new THREE.Vector3(0, 1, 0);

/** A unit vector at right angles to `dir`, turned a random amount about it. */
function sideOf(dir: THREE.Vector3, rng: () => number): THREE.Vector3 {
  const ref = Math.abs(dir.y) < 0.9 ? UP : new THREE.Vector3(1, 0, 0);
  return new THREE.Vector3().crossVectors(dir, ref).normalize().applyAxisAngle(dir, rng() * Math.PI * 2);
}

/** One tapering tube along `path`, appended to `out`. Frames are carried along the curve so it never twists. */
function addTube(out: Buffers, path: THREE.Vector3[], r0: number, r1: number, radial: number, palette: ResolvedPalette, rng: () => number) {
  const curve = new THREE.CatmullRomCurve3(path, false, "centripetal");
  const rings = Math.max(4, path.length * 3);
  const base = out.pos.length / 3;
  const tangent = new THREE.Vector3();
  const prev = new THREE.Vector3();
  const normal = new THREE.Vector3();
  const binormal = new THREE.Vector3();
  const q = new THREE.Quaternion();
  const p = new THREE.Vector3();
  const c = new THREE.Color();
  const grain = rng() * 6.28;
  for (let i = 0; i <= rings; i++) {
    const t = i / rings;
    curve.getPoint(t, p);
    curve.getTangent(t, tangent).normalize();
    if (i === 0) normal.copy(sideOf(tangent, rng));
    else normal.applyQuaternion(q.setFromUnitVectors(prev, tangent)).normalize();
    prev.copy(tangent);
    binormal.crossVectors(tangent, normal).normalize();
    const r = r0 + (r1 - r0) * t;
    for (let k = 0; k < radial; k++) {
      const a = (k / radial) * Math.PI * 2;
      const nx = Math.cos(a) * normal.x + Math.sin(a) * binormal.x;
      const ny = Math.cos(a) * normal.y + Math.sin(a) * binormal.y;
      const nz = Math.cos(a) * normal.z + Math.sin(a) * binormal.z;
      out.pos.push(p.x + nx * r, p.y + ny * r, p.z + nz * r);
      out.nor.push(nx, ny, nz);
      // Bark: long streaks along the branch, darker in the grooves.
      const streak = 0.5 + 0.5 * Math.sin(a * 3 + grain + p.y * 2.2);
      c.copy(palette.trunkDark).lerp(palette.trunk, 0.25 + 0.75 * streak * (0.7 + 0.3 * rng()));
      out.col.push(c.r, c.g, c.b);
    }
  }
  for (let i = 0; i < rings; i++) {
    for (let k = 0; k < radial; k++) {
      const a = base + i * radial + k;
      const b = base + i * radial + ((k + 1) % radial);
      const d = a + radial;
      const e = b + radial;
      out.idx.push(a, b, d, b, e, d);
    }
  }
}

type Tip = { at: THREE.Vector3; weight: number };

/** A small pointed leaf standing on its base (y from 0 to 1), folded a little along its midrib. */
function leafGeometry(): THREE.BufferGeometry {
  const fold = 0.09;
  const v = [
    [0, 0, 0],
    [-0.34, 0.32, fold],
    [-0.27, 0.7, fold],
    [0, 0.95, 0],
    [0.27, 0.7, fold],
    [0.34, 0.32, fold],
    [0, 0.45, 0],
  ];
  const tris = [0, 6, 1, 1, 6, 2, 2, 6, 3, 3, 6, 4, 4, 6, 5, 5, 6, 0];
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(v.flat(), 3));
  g.setIndex(tris);
  g.computeVertexNormals();
  return g;
}

/** Cheap value noise on a sphere's direction: enough to rough up a mound. */
function lump(x: number, y: number, z: number): number {
  return Math.sin(x * 3.1 + z * 1.7) * 0.5 + Math.sin(z * 4.3 - x * 2.2 + y * 1.3) * 0.3 + Math.sin(x * 7.9 + z * 6.1) * 0.2;
}

function moundGeometry(o: TreeOptions["mound"], palette: ResolvedPalette, rng: () => number): THREE.BufferGeometry {
  const g = new THREE.SphereGeometry(1, o.segments, Math.max(6, Math.round(o.segments / 3)), 0, Math.PI * 2, 0, Math.PI / 2);
  const pos = g.attributes.position as THREE.BufferAttribute;
  const col = new Float32Array(pos.count * 3);
  const c = new THREE.Color();
  const off = rng() * 10;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);
    const n = lump(x + off, y, z + off);
    // The rim stays on the ground; the roughness grows towards the top.
    const k = 1 + n * o.roughness * (0.4 + y);
    pos.setXYZ(i, x * o.radius * k, Math.max(0, y * o.height * (1 + n * o.roughness * 2)), z * o.radius * k);
    // Lighter where the sun reaches (the top), darker in the hollows, mottled all over.
    const mottle = lump(x * 4.7 + off, y * 3, z * 5.3 - off);
    c.copy(palette.groundDark).lerp(palette.ground, THREE.MathUtils.clamp(0.3 + 0.4 * y + 0.3 * n + 0.3 * mottle, 0, 1));
    col.set([c.r, c.g, c.b], i * 3);
  }
  g.setAttribute("color", new THREE.BufferAttribute(col, 3));
  g.computeVertexNormals();
  return g;
}

function pebblesGeometry(o: TreeOptions["mound"], palette: ResolvedPalette, rng: () => number): THREE.BufferGeometry | null {
  if (!o.pebbles) return null;
  const out: Buffers = { pos: [], nor: [], col: [], idx: [] };
  const c = new THREE.Color();
  for (let n = 0; n < o.pebbles; n++) {
    const stone = new THREE.IcosahedronGeometry(1, 1);
    const size = o.radius * (0.035 + rng() * 0.05);
    const a = rng() * Math.PI * 2;
    const d = o.radius * (0.55 + rng() * 0.5);
    // On the mound's slope, or just off it on the ground.
    const share = Math.min(1, d / o.radius);
    const y = o.height * Math.sqrt(Math.max(0, 1 - share * share)) * 0.9;
    const m = new THREE.Matrix4().compose(
      new THREE.Vector3(Math.cos(a) * d, y + size * 0.25, Math.sin(a) * d),
      new THREE.Quaternion().setFromEuler(new THREE.Euler(rng() * 3, rng() * 3, rng() * 3)),
      new THREE.Vector3(size, size * (0.5 + rng() * 0.3), size * (0.7 + rng() * 0.5)),
    );
    stone.applyMatrix4(m);
    stone.computeVertexNormals();
    const p = stone.attributes.position as THREE.BufferAttribute;
    const nn = stone.attributes.normal as THREE.BufferAttribute;
    const base = out.pos.length / 3;
    c.copy(palette.groundDark).lerp(palette.ground, 0.3 + rng() * 0.6);
    for (let i = 0; i < p.count; i++) {
      out.pos.push(p.getX(i), p.getY(i), p.getZ(i));
      out.nor.push(nn.getX(i), nn.getY(i), nn.getZ(i));
      out.col.push(c.r, c.g, c.b);
      out.idx.push(base + i);
    }
    stone.dispose();
  }
  return toGeometry(out);
}

function toGeometry(b: Buffers): THREE.BufferGeometry {
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(b.pos, 3));
  g.setAttribute("normal", new THREE.Float32BufferAttribute(b.nor, 3));
  g.setAttribute("color", new THREE.Float32BufferAttribute(b.col, 3));
  g.setIndex(b.idx);
  return g;
}

/** A colour along the foliage's run of tones, t from 0 (first tone) to 1 (last). */
function toneAt(tones: THREE.Color[], t: number, into: THREE.Color): THREE.Color {
  if (tones.length === 1) return into.copy(tones[0]);
  const x = THREE.MathUtils.clamp(t, 0, 1) * (tones.length - 1);
  const i = Math.min(tones.length - 2, Math.floor(x));
  return into.copy(tones[i]).lerp(tones[i + 1], x - i);
}

export function buildTree(options: TreeOptions, palette: ResolvedPalette, seed: number): BuiltTree {
  const rng = seeded(seed);
  const { shape } = options;
  const wood: Buffers = { pos: [], nor: [], col: [], idx: [] };
  const tips: Tip[] = [];

  const grow = (start: THREE.Vector3, dir: THREE.Vector3, length: number, radius: number, level: number) => {
    const isTrunk = level === 0;
    const steps = isTrunk ? 7 : 5;
    const wander = isTrunk ? shape.trunk.wander : shape.wander;
    const path = [start.clone()];
    const d = dir.clone().normalize();
    const p = start.clone();
    for (let i = 0; i < steps; i++) {
      d.add(new THREE.Vector3((rng() - 0.5) * wander, (rng() - 0.5) * wander * 0.5, (rng() - 0.5) * wander));
      d.y += shape.upward * (isTrunk ? 0.6 : 1) * (1 / steps) * 2;
      d.normalize();
      p.addScaledVector(d, length / steps);
      path.push(p.clone());
    }
    const endRadius = radius * (isTrunk ? 0.62 : 0.5);
    const share = Math.min(1, level / shape.levels.length);
    const radial = Math.round(shape.radialSegments.trunk + (shape.radialSegments.twig - shape.radialSegments.trunk) * share);
    addTube(wood, path, radius, endRadius, radial, palette, rng);

    const next = shape.levels[level];
    if (!next) {
      tips.push({ at: p.clone(), weight: 1 });
      return;
    }
    // Foliage also gathers on the forks of the upper levels, so the crown has no hollow middle.
    if (level >= 2) tips.push({ at: p.clone(), weight: 0.6 });
    const turn = rng() * Math.PI * 2;
    for (let c = 0; c < next.children; c++) {
      const spread = THREE.MathUtils.degToRad(next.spreadDeg * (0.75 + rng() * 0.5));
      const around = turn + (c / next.children) * Math.PI * 2 + (rng() - 0.5) * 0.7;
      const axis = sideOf(d, () => 0).applyAxisAngle(d, around);
      const childDir = d.clone().applyAxisAngle(axis, spread);
      grow(p.clone().addScaledVector(d, -endRadius * 0.5), childDir, length * shape.lengthRatio * (0.85 + rng() * 0.3), endRadius * (0.8 + shape.radiusRatio * 0.3), level + 1);
    }
    // A side branch part of the way up, on the branches that can carry one.
    if (level >= 1 && level < shape.levels.length - 1 && rng() < 0.7) {
      const at = path[Math.floor(steps * 0.55)];
      const axis = sideOf(d, rng);
      grow(at.clone(), d.clone().applyAxisAngle(axis, THREE.MathUtils.degToRad(48 + rng() * 20)), length * shape.lengthRatio * 0.8, endRadius * 0.75, level + 1);
    }
  };

  const leanTurn = rng() * Math.PI * 2;
  const trunkDir = new THREE.Vector3(Math.cos(leanTurn) * shape.trunk.lean, 1, Math.sin(leanTurn) * shape.trunk.lean * 0.4);
  // The first level's length follows from the trunk's, like every other level.
  grow(new THREE.Vector3(0, 0, 0), trunkDir, shape.trunk.height, shape.trunk.radius, 0);

  const woodGeometry = toGeometry(wood);
  if (shape.turnDeg) woodGeometry.rotateY(THREE.MathUtils.degToRad(shape.turnDeg));
  const turnM = new THREE.Matrix4().makeRotationY(THREE.MathUtils.degToRad(shape.turnDeg));
  for (const t of tips) t.at.applyMatrix4(turnM);

  // ---- foliage ----
  const lo = options.leaves;
  const crown = new THREE.Box3();
  for (const t of tips) crown.expandByPoint(t.at);
  const centre = crown.getCenter(new THREE.Vector3());
  const crownHalf = Math.max(0.001, (crown.max.x - crown.min.x) / 2 + lo.clusterRadius);
  const crownReach = crown.getSize(new THREE.Vector3()).length() / 2 + lo.clusterRadius;
  const totalWeight = tips.reduce((s, t) => s + t.weight, 0);

  const count = lo.count;
  const matrices = new Float32Array(count * 16);
  const colors = new Float32Array(count * 3);
  const outward = new Float32Array(count * 3);
  const leaf = new Float32Array(count * 2);
  const m = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const at = new THREE.Vector3();
  const out = new THREE.Vector3();
  const scale = new THREE.Vector3();
  const col = new THREE.Color();
  const rnd = new THREE.Vector3();
  let n = 0;
  tips.forEach((tip, ti) => {
    const share = ti === tips.length - 1 ? count - n : Math.round((count * tip.weight) / totalWeight);
    // Each mass takes its tone from where it hangs across the crown (the run of tones goes from the lit side over).
    const massTone = 0.5 + ((tip.at.x - centre.x) / crownHalf) * 0.42 + (rng() - 0.5) * 0.35;
    const radius = lo.clusterRadius * (0.8 + rng() * 0.45) * (0.75 + 0.25 * tip.weight);
    for (let i = 0; i < share && n < count; i++, n++) {
      // A point in the ball.
      do rnd.set(rng() * 2 - 1, rng() * 2 - 1, rng() * 2 - 1);
      while (rnd.lengthSq() > 1 || rnd.lengthSq() < 1e-4);
      const depth = rnd.length();
      rnd.multiplyScalar(radius);
      rnd.y *= lo.clusterFlatten;
      at.copy(tip.at).add(rnd);
      out.copy(at).sub(centre);
      const reach = THREE.MathUtils.clamp(out.length() / crownReach, 0, 1);
      out.y += crownReach * 0.25;
      out.normalize();

      // The leaf points roughly out of the crown, then is turned freely about that.
      q.setFromUnitVectors(UP, rnd.set(out.x + (rng() - 0.5) * 1.1, out.y + (rng() - 0.5) * 1.1, out.z + (rng() - 0.5) * 1.1).normalize());
      q.multiply(new THREE.Quaternion().setFromAxisAngle(UP, rng() * Math.PI * 2));
      const s = lo.size * (1 + (rng() * 2 - 1) * lo.sizeJitter);
      m.compose(at, q, scale.set(s, s, s));
      m.toArray(matrices, n * 16);

      const tone = rng() < lo.toneScatter ? rng() : massTone + (rng() - 0.5) * 0.18;
      toneAt(palette.leaves, tone, col);
      // Darker inside the mass and inside the crown, and a touch lower down.
      const lit = 1 - lo.depthShade * (1 - depth) * 0.6 - lo.depthShade * (1 - reach) * 0.7;
      col.multiplyScalar(THREE.MathUtils.clamp(lit * (0.92 + rng() * 0.16), 0.2, 1.2));
      colors.set([col.r, col.g, col.b], n * 3);
      outward.set([out.x, out.y, out.z], n * 3);
      leaf.set([rng() * Math.PI * 2, THREE.MathUtils.clamp(reach * 0.8 + rng() * 0.2, 0, 1)], n * 2);
    }
  });

  // ---- ground ----
  const mound = moundGeometry(options.mound, palette, rng);
  const pebbles = pebblesGeometry(options.mound, palette, rng);
  const footY = options.mound.height * 0.82;

  woodGeometry.computeBoundingBox();
  const bounds = new THREE.Box3();
  bounds.expandByPoint(new THREE.Vector3(-options.mound.radius, 0, -options.mound.radius));
  bounds.expandByPoint(new THREE.Vector3(options.mound.radius, 0, options.mound.radius));
  const woodBox = woodGeometry.boundingBox!.clone().translate(new THREE.Vector3(0, footY, 0));
  bounds.union(woodBox);
  const pad = lo.clusterRadius * 1.2 + lo.size;
  bounds.union(crown.clone().expandByScalar(pad).translate(new THREE.Vector3(0, footY, 0)));

  return { wood: woodGeometry, leafShape: leafGeometry(), leaves: { count: n, matrices, colors, outward, leaf }, mound, pebbles, footY, height: crown.max.y + pad, bounds };
}
