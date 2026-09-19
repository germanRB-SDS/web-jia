/**
 * The tree's geometry, grown from a seed: no DOM, no renderer, no model file. The wood (a few slender stems, their
 * branches and the thin roots hanging from the crown) is one merged mesh of tapering tubes; the foliage is a list of
 * instances of one small leaf laid on the skin of rounded lobes around the branch tips and forks, overlapping like
 * feathers; the ground is a mossy knoll among piled, flat-faced rocks. The tree stands on its own origin (the foot
 * of the stems, y up); the ground is built below it. Same seed, same options → same tree.
 */
import * as THREE from "three";
import type { TreeOptions } from "./config";

export type ResolvedPalette = {
  leaves: THREE.Color[];
  trunk: THREE.Color;
  trunkDark: THREE.Color;
  ground: THREE.Color;
  groundDark: THREE.Color;
  moss: THREE.Color;
  mossDark: THREE.Color;
};

export type LeafInstances = {
  count: number;
  /** 16 floats per leaf. */
  matrices: Float32Array;
  /** rgb per leaf. */
  colors: Float32Array;
  /** Per leaf: the direction out of its lobe (the normal the light sees). */
  outward: Float32Array;
  /** Per leaf: x = phase of its flutter, y = when it opens if the tree grows (0 first, 1 last). */
  leaf: Float32Array;
};

/** The leaves the breeze tears off: where each one lets go (on the crown's skin), its colour and its numbers. */
export type FallingLeaves = {
  count: number;
  start: Float32Array;
  colors: Float32Array;
  /** Per leaf: x = phase (0–1), y = life in seconds, z = a seed (0–1), w = size. */
  fall: Float32Array;
};

export type BuiltTree = {
  wood: THREE.BufferGeometry;
  leafShape: THREE.BufferGeometry;
  leaves: LeafInstances;
  falling: FallingLeaves;
  mound: THREE.BufferGeometry;
  rocks: THREE.BufferGeometry | null;
  /** How far the foot of the stems stands above the ground plane (the knoll's top, a little sunk). */
  footY: number;
  /** Height of the tree above its foot: the wind's lever. */
  height: number;
  /** Everything that stands still, in the space of the ground plane (y = 0). */
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
    c.copy(palette.mossDark).lerp(palette.moss, THREE.MathUtils.clamp(0.3 + 0.4 * y + 0.3 * n + 0.3 * mottle, 0, 1));
    col.set([c.r, c.g, c.b], i * 3);
  }
  g.setAttribute("color", new THREE.BufferAttribute(col, 3));
  g.computeVertexNormals();
  return g;
}

/**
 * Piled rocks with flat faces: a ring of large ones around the knoll, smaller ones further out. Each is a coarse
 * ball pushed about by a function of position alone (so its faces stay closed), sat on the ground plane. Moss takes
 * the faces that look at the sky.
 */
function rocksGeometry(o: TreeOptions["mound"], palette: ResolvedPalette, rng: () => number): THREE.BufferGeometry | null {
  if (!o.rocks) return null;
  const out: Buffers = { pos: [], nor: [], col: [], idx: [] };
  const c = new THREE.Color();
  const moss = new THREE.Color();
  const a = new THREE.Vector3();
  const b = new THREE.Vector3();
  const d = new THREE.Vector3();
  const n = new THREE.Vector3();
  for (let r = 0; r < o.rocks; r++) {
    const share = r / o.rocks;
    const size = o.rockSize[1] - (o.rockSize[1] - o.rockSize[0]) * Math.pow(share, 0.6) * (0.7 + rng() * 0.3);
    const turn = share * Math.PI * 2 * 2.4 + rng() * 0.8;
    const reach = o.radius * (0.55 + share * (o.rockReach - 0.55)) * (0.85 + rng() * 0.3);
    const stone = new THREE.IcosahedronGeometry(1, 1);
    const p = stone.attributes.position as THREE.BufferAttribute;
    const off = rng() * 20;
    for (let i = 0; i < p.count; i++) {
      d.fromBufferAttribute(p, i);
      const k = 1 + 0.32 * lump(d.x * 1.3 + off, d.y * 1.3, d.z * 1.3 - off);
      p.setXYZ(i, d.x * k, d.y * k, d.z * k);
    }
    const m = new THREE.Matrix4().compose(
      new THREE.Vector3(Math.cos(turn) * reach, size * (0.12 + rng() * 0.2), Math.sin(turn) * reach * 0.85),
      new THREE.Quaternion().setFromEuler(new THREE.Euler(rng() * 0.6 - 0.3, rng() * 6.28, rng() * 0.6 - 0.3)),
      new THREE.Vector3(size * (0.9 + rng() * 0.5), size * (0.6 + rng() * 0.35), size * (0.8 + rng() * 0.4)),
    );
    stone.applyMatrix4(m);
    const tone = 0.25 + rng() * 0.6;
    for (let i = 0; i < p.count; i += 3) {
      a.fromBufferAttribute(p, i);
      b.fromBufferAttribute(p, i + 1);
      d.fromBufferAttribute(p, i + 2);
      // Sat on the ground: nothing hangs below it.
      a.y = Math.max(0, a.y);
      b.y = Math.max(0, b.y);
      d.y = Math.max(0, d.y);
      n.crossVectors(b.clone().sub(a), d.clone().sub(a)).normalize();
      const face = lump(a.x * 3 + off, a.y * 3, a.z * 3);
      c.copy(palette.groundDark).lerp(palette.ground, THREE.MathUtils.clamp(tone + 0.25 * face + 0.25 * n.y, 0, 1));
      const mossy = THREE.MathUtils.clamp((n.y - (1 - o.mossOnRocks)) * 3 + face * 0.6, 0, 1);
      if (mossy > 0) c.lerp(moss.copy(palette.mossDark).lerp(palette.moss, 0.5 + 0.5 * face), mossy);
      const base = out.pos.length / 3;
      for (const v of [a, b, d]) {
        out.pos.push(v.x, v.y, v.z);
        out.nor.push(n.x, n.y, n.z);
        out.col.push(c.r, c.g, c.b);
      }
      out.idx.push(base, base + 1, base + 2);
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

type Lobe = { at: THREE.Vector3; radius: number; weight: number };

export function buildTree(options: TreeOptions, palette: ResolvedPalette, seed: number): BuiltTree {
  const rng = seeded(seed);
  const { shape } = options;
  const lo = options.leaves;
  const wood: Buffers = { pos: [], nor: [], col: [], idx: [] };
  const lobes: Lobe[] = [];

  const grow = (start: THREE.Vector3, dir: THREE.Vector3, length: number, radius: number, level: number) => {
    const isStem = level === 0;
    const steps = isStem ? 7 : 5;
    const wander = isStem ? shape.trunk.wander : shape.wander;
    const path = [start.clone()];
    const d = dir.clone().normalize();
    const p = start.clone();
    for (let i = 0; i < steps; i++) {
      d.add(new THREE.Vector3((rng() - 0.5) * wander, (rng() - 0.5) * wander * 0.5, (rng() - 0.5) * wander));
      d.y += shape.upward * (isStem ? 0.6 : 1) * (1 / steps) * 2;
      d.normalize();
      p.addScaledVector(d, length / steps);
      path.push(p.clone());
    }
    const endRadius = radius * (isStem ? 0.62 : 0.5);
    const share = Math.min(1, level / shape.levels.length);
    const radial = Math.round(shape.radialSegments.trunk + (shape.radialSegments.twig - shape.radialSegments.trunk) * share);
    addTube(wood, path, radius, endRadius, radial, palette, rng);

    const next = shape.levels[level];
    if (!next) {
      lobes.push({ at: p.clone(), radius: lo.lobeRadius * (0.85 + rng() * 0.35), weight: 1 });
      return;
    }
    // A larger lobe on every fork above the stems: the crown has no hollow middle.
    if (level >= 1) lobes.push({ at: p.clone(), radius: lo.lobeRadius * lo.forkLobe * (0.85 + rng() * 0.3), weight: lo.forkLobe * lo.forkLobe });
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

  // The stems leave one foot, leaning apart, each a little different.
  const stems = Math.max(1, Math.round(shape.trunk.stems));
  const firstTurn = rng() * Math.PI * 2;
  for (let s = 0; s < stems; s++) {
    const turn = firstTurn + (s / stems) * Math.PI * 2 + (rng() - 0.5) * 0.8;
    const lean = stems === 1 ? shape.trunk.lean : shape.trunk.lean * (0.7 + rng() * 0.6);
    const dir = new THREE.Vector3(Math.cos(turn) * lean, 1, Math.sin(turn) * lean * 0.7);
    const foot = new THREE.Vector3(Math.cos(turn), 0, Math.sin(turn)).multiplyScalar(stems === 1 ? 0 : shape.trunk.radius * 0.9);
    grow(foot, dir, shape.trunk.height * (0.85 + rng() * 0.3), shape.trunk.radius * (0.8 + rng() * 0.35), 0);
  }

  // ---- thin roots hanging from under the crown ----
  const crown = new THREE.Box3();
  for (const l of lobes) crown.expandByPoint(l.at);
  for (let v = 0; v < shape.vines.count && lobes.length; v++) {
    const lobe = lobes[Math.floor(rng() * lobes.length)];
    // From the lower lobes only, a little inside them.
    if (lobe.at.y > crown.min.y + (crown.max.y - crown.min.y) * 0.55 && rng() < 0.8) continue;
    const p = lobe.at.clone().add(new THREE.Vector3((rng() - 0.5) * lobe.radius, -lobe.radius * 0.3, (rng() - 0.5) * lobe.radius));
    const length = Math.min(p.y - 0.25, shape.vines.length[0] + rng() * (shape.vines.length[1] - shape.vines.length[0]));
    if (length < 0.3) continue;
    const path = [p.clone()];
    const side = new THREE.Vector3(rng() - 0.5, 0, rng() - 0.5).multiplyScalar(0.12);
    for (let i = 1; i <= 5; i++) path.push(p.clone().add(new THREE.Vector3(side.x * Math.sin(i * 1.3), -(length * i) / 5, side.z * Math.cos(i * 1.1))));
    addTube(wood, path, shape.vines.radius, shape.vines.radius * 0.45, 4, palette, rng);
  }

  const woodGeometry = toGeometry(wood);
  if (shape.turnDeg) woodGeometry.rotateY(THREE.MathUtils.degToRad(shape.turnDeg));
  const turnM = new THREE.Matrix4().makeRotationY(THREE.MathUtils.degToRad(shape.turnDeg));
  for (const l of lobes) l.at.applyMatrix4(turnM);
  crown.makeEmpty();
  for (const l of lobes) crown.expandByPoint(l.at);

  // ---- foliage ----
  const centre = crown.getCenter(new THREE.Vector3());
  const crownHalf = Math.max(0.001, (crown.max.x - crown.min.x) / 2 + lo.lobeRadius);
  const totalWeight = lobes.reduce((s, l) => s + l.weight, 0);
  const sun = new THREE.Vector3(...options.light.sunFrom).normalize();
  const litSide = Math.sign(sun.x) || 1;

  const count = lo.count;
  const matrices = new Float32Array(count * 16);
  const colors = new Float32Array(count * 3);
  const outward = new Float32Array(count * 3);
  const leaf = new Float32Array(count * 2);
  const m = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const spin = new THREE.Quaternion();
  const at = new THREE.Vector3();
  const out = new THREE.Vector3();
  const tipDir = new THREE.Vector3();
  const fromCrown = new THREE.Vector3();
  const scale = new THREE.Vector3();
  const col = new THREE.Color();
  const dirOut = new THREE.Vector3();
  let n = 0;
  lobes.forEach((lobe, li) => {
    const share = li === lobes.length - 1 ? count - n : Math.round((count * lobe.weight) / totalWeight);
    // Each lobe takes its tone from where it hangs across the crown: the run of tones starts on the sun's side.
    const lobeTone = 0.34 - litSide * ((lobe.at.x - centre.x) / crownHalf) * 0.4 + (rng() - 0.5) * 0.2;
    for (let i = 0; i < share && n < count; i++, n++) {
      // A direction out of the lobe, and a place on its skin.
      do dirOut.set(rng() * 2 - 1, rng() * 2 - 1, rng() * 2 - 1);
      while (dirOut.lengthSq() > 1 || dirOut.lengthSq() < 1e-4);
      dirOut.normalize();
      const depth = lo.shell + (1 - lo.shell) * Math.sqrt(rng());
      at.copy(dirOut).multiplyScalar(depth * lobe.radius);
      at.y *= lo.lobeFlatten;
      at.add(lobe.at);

      // The light sees the lobe's roundness first, the crown's second.
      fromCrown.copy(at).sub(centre).normalize();
      out.copy(dirOut).multiplyScalar(0.7).addScaledVector(fromCrown, 0.3);
      out.y += 0.12;
      out.normalize();

      // The leaf's tip points out of the lobe, hanging a little, then it is turned freely about itself.
      tipDir.set(dirOut.x + (rng() - 0.5) * 0.9, dirOut.y - lo.droop + (rng() - 0.5) * 0.9, dirOut.z + (rng() - 0.5) * 0.9).normalize();
      q.setFromUnitVectors(UP, tipDir).multiply(spin.setFromAxisAngle(UP, rng() * Math.PI * 2));
      const s = lo.size * (1 + (rng() * 2 - 1) * lo.sizeJitter);
      m.compose(at, q, scale.set(s, s, s));
      m.toArray(matrices, n * 16);

      const facesSun = dirOut.dot(sun);
      const tone = rng() < lo.toneScatter ? rng() : lobeTone - facesSun * 0.3 + (rng() - 0.5) * 0.14;
      toneAt(palette.leaves, tone, col);
      // Darker inside the lobe and under it.
      const lit = 1 - lo.depthShade * (1 - depth) * 1.2 - lo.depthShade * Math.max(0, -dirOut.y) * 0.75;
      col.multiplyScalar(THREE.MathUtils.clamp(lit * (0.94 + rng() * 0.12), 0.25, 1.15));
      colors.set([col.r, col.g, col.b], n * 3);
      outward.set([out.x, out.y, out.z], n * 3);
      const reach = THREE.MathUtils.clamp((at.y - crown.min.y) / Math.max(0.001, crown.max.y - crown.min.y), 0, 1);
      leaf.set([rng() * Math.PI * 2, THREE.MathUtils.clamp(reach * 0.8 + rng() * 0.2, 0, 1)], n * 2);
    }
  });

  // ---- the leaves the breeze takes: each lets go from where a leaf of the crown already is ----
  const fo = options.fall;
  const falling: FallingLeaves = { count: fo.count, start: new Float32Array(fo.count * 3), colors: new Float32Array(fo.count * 3), fall: new Float32Array(fo.count * 4) };
  for (let f = 0; f < fo.count && n > 0; f++) {
    const from = Math.floor(rng() * n);
    falling.start.set([matrices[from * 16 + 12], matrices[from * 16 + 13], matrices[from * 16 + 14]], f * 3);
    falling.colors.set([colors[from * 3], colors[from * 3 + 1], colors[from * 3 + 2]], f * 3);
    falling.fall.set([rng(), fo.seconds[0] + rng() * (fo.seconds[1] - fo.seconds[0]), rng(), lo.size * fo.size * (0.8 + rng() * 0.4)], f * 4);
  }

  // ---- ground ----
  const mound = moundGeometry(options.mound, palette, rng);
  const rocks = rocksGeometry(options.mound, palette, rng);
  const footY = options.mound.height * 0.8;

  woodGeometry.computeBoundingBox();
  const bounds = new THREE.Box3();
  const groundReach = options.mound.radius * (options.mound.rocks ? options.mound.rockReach : 1) + options.mound.rockSize[1];
  // The rocks' ring is a little flat towards the eye (rocksGeometry).
  bounds.expandByPoint(new THREE.Vector3(-groundReach, 0, -groundReach * 0.85));
  bounds.expandByPoint(new THREE.Vector3(groundReach, 0, groundReach * 0.85));
  bounds.union(woodGeometry.boundingBox!.clone().translate(new THREE.Vector3(0, footY, 0)));
  const pad = lo.lobeRadius + lo.size * 0.5;
  bounds.union(crown.clone().expandByScalar(pad).translate(new THREE.Vector3(0, footY, 0)));

  return { wood: woodGeometry, leafShape: leafGeometry(), leaves: { count: n, matrices, colors, outward, leaf }, falling, mound, rocks, footY, height: crown.max.y + pad, bounds };
}
