/**
 * The tree's Three.js scene, without React: it owns a transparent canvas inside the host element, fills the host's
 * box, frames the whole tree standing on the box's floor, and draws only while the host is on screen and the tab is
 * visible. The tree is there, whole, from its first frame (it can rise from the ground instead: options.grow); the
 * wind (wind.ts) sways it and tears leaves off its crown. With reduced motion there is no loop and no falling
 * leaf: one still frame.
 * Colours arrive as CSS (values or custom properties) and are resolved against the host, so they follow the page.
 */
import * as THREE from "three";
import { buildTree } from "./tree-builder.js";
import { applyFall, applyWind, windUniforms } from "./wind.js";
export function webglAvailable() {
    try {
        const c = document.createElement("canvas");
        return Boolean(c.getContext("webgl2"));
    }
    catch {
        return false;
    }
}
/** Any CSS colour the page understands (custom properties included) → a Three.js colour, through a 1 px canvas. */
function colorResolver(host) {
    const probe = document.createElement("span");
    probe.style.display = "none";
    host.appendChild(probe);
    const ctx = document.createElement("canvas").getContext("2d", { willReadFrequently: true });
    return {
        color(css) {
            probe.style.color = "";
            probe.style.color = css;
            const computed = getComputedStyle(probe).color;
            if (!ctx)
                return new THREE.Color().setStyle(computed);
            ctx.clearRect(0, 0, 1, 1);
            ctx.fillStyle = computed;
            ctx.fillRect(0, 0, 1, 1);
            const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
            return new THREE.Color().setRGB(r / 255, g / 255, b / 255, THREE.SRGBColorSpace);
        },
        done: () => probe.remove(),
    };
}
const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
export class TreeScene {
    host;
    options;
    reducedMotion;
    renderer;
    canvas;
    scene = new THREE.Scene();
    camera;
    tree = new THREE.Group();
    built;
    bounds;
    uniforms = windUniforms();
    disposables = [];
    io;
    onScreen = false;
    frame = 0;
    last = 0;
    time = 0;
    growStart = -1;
    disposed = false;
    hazeColor = null;
    constructor(host, options, palette, seed, reducedMotion) {
        this.host = host;
        this.options = options;
        this.reducedMotion = reducedMotion;
        this.canvas = document.createElement("canvas");
        this.canvas.setAttribute("aria-hidden", "true");
        this.canvas.style.cssText = "display:block;width:100%;height:100%";
        host.appendChild(this.canvas);
        this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, alpha: true, antialias: true, powerPreference: "low-power" });
        this.renderer.setClearColor(0x000000, 0);
        this.renderer.outputColorSpace = THREE.SRGBColorSpace;
        this.renderer.toneMapping = THREE.NoToneMapping;
        this.camera = new THREE.PerspectiveCamera(options.camera.fovDeg, 1, 0.1, 200);
        const css = colorResolver(host);
        const resolved = {
            leaves: palette.leaves.map((c) => css.color(c)),
            trunk: css.color(palette.trunk),
            trunkDark: css.color(palette.trunkDark),
            ground: css.color(palette.ground),
            groundDark: css.color(palette.groundDark),
            moss: css.color(palette.moss),
            mossDark: css.color(palette.mossDark),
        };
        const shadowColor = css.color(palette.shadow);
        this.hazeColor = options.haze.amount > 0 ? css.color(options.haze.color) : null;
        const light = options.light;
        const sky = new THREE.HemisphereLight(css.color(light.sky), css.color(light.bounce), light.skyIntensity);
        const sun = new THREE.DirectionalLight(css.color(light.sun), light.sunIntensity);
        sun.position.set(...light.sunFrom);
        css.done();
        this.scene.add(sky, sun, sun.target);
        this.built = buildTree(options, resolved, seed);
        this.bounds = this.built.bounds.clone();
        this.assemble(shadowColor);
        const u = this.uniforms;
        u.uStrength.value = reducedMotion ? 0 : options.wind.strength;
        u.uSway.value = options.wind.sway;
        u.uFlutter.value = options.wind.flutter;
        u.uFlutterSpeed.value = options.wind.flutterSpeed;
        u.uHeight.value = this.built.height;
        u.uNormalBlend.value = options.leaves.normalBlend;
        u.uGrow.value = reducedMotion || !options.grow.enabled ? 1 : 0;
        u.uFall.value = reducedMotion ? 0 : 1;
        u.uFallDir.value.set(...options.fall.direction).normalize();
        u.uFallDist.value = options.fall.distance;
        u.uTumble.value = options.fall.tumble;
        u.uDrift.value = options.fall.drift;
        this.applyGrow();
        this.io = new IntersectionObserver((entries) => {
            this.onScreen = entries.some((e) => e.isIntersecting);
            this.sync();
        });
        this.io.observe(host);
        document.addEventListener("visibilitychange", this.sync);
        this.resize();
    }
    assemble(shadowColor) {
        const b = this.built;
        const keep = (x) => {
            this.disposables.push(x);
            return x;
        };
        const woodMat = keep(new THREE.MeshLambertMaterial({ vertexColors: true }));
        applyWind(woodMat, this.uniforms, false);
        const wood = new THREE.Mesh(keep(b.wood), woodMat);
        wood.frustumCulled = false;
        const fallShape = b.falling.count > 0 ? b.leafShape.clone() : null;
        const leafGeo = keep(b.leafShape);
        leafGeo.setAttribute("aOutward", new THREE.InstancedBufferAttribute(b.leaves.outward, 3));
        leafGeo.setAttribute("aLeaf", new THREE.InstancedBufferAttribute(b.leaves.leaf, 2));
        const leafMat = keep(new THREE.MeshLambertMaterial({ side: THREE.DoubleSide }));
        applyWind(leafMat, this.uniforms, true);
        const leaves = new THREE.InstancedMesh(leafGeo, leafMat, b.leaves.count);
        leaves.instanceMatrix = new THREE.InstancedBufferAttribute(b.leaves.matrices, 16);
        leaves.instanceColor = new THREE.InstancedBufferAttribute(b.leaves.colors, 3);
        leaves.frustumCulled = false;
        keep(leaves);
        this.tree.position.y = b.footY;
        this.tree.add(wood, leaves);
        // The leaves the breeze takes: the same leaf, a few dozen instances, placed by the shader alone.
        if (fallShape) {
            const fallGeo = keep(fallShape);
            fallGeo.setAttribute("aStart", new THREE.InstancedBufferAttribute(b.falling.start, 3));
            fallGeo.setAttribute("aFall", new THREE.InstancedBufferAttribute(b.falling.fall, 4));
            const fallMat = keep(new THREE.MeshLambertMaterial({ side: THREE.DoubleSide }));
            applyFall(fallMat, this.uniforms);
            const falling = new THREE.InstancedMesh(fallGeo, fallMat, b.falling.count);
            falling.instanceColor = new THREE.InstancedBufferAttribute(b.falling.colors, 3);
            falling.frustumCulled = false;
            keep(falling);
            this.tree.add(falling);
        }
        const groundMat = keep(new THREE.MeshLambertMaterial({ vertexColors: true }));
        this.scene.add(this.tree, new THREE.Mesh(keep(b.mound), groundMat));
        if (b.rocks)
            this.scene.add(new THREE.Mesh(keep(b.rocks), groundMat));
        // Contact shadow: a soft blot on the ground, drawn out away from the sun. No shadow map.
        const so = this.options.shadow;
        if (so.opacity > 0) {
            const size = 128;
            const c = document.createElement("canvas");
            c.width = c.height = size;
            const ctx = c.getContext("2d");
            if (ctx) {
                const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
                // An alpha map reads the green channel: opaque greys, white at the heart, black at the rim.
                g.addColorStop(0, "rgb(255,255,255)");
                g.addColorStop(0.45, "rgb(140,140,140)");
                g.addColorStop(1, "rgb(0,0,0)");
                ctx.fillStyle = g;
                ctx.fillRect(0, 0, size, size);
                const tex = keep(new THREE.CanvasTexture(c));
                const plane = keep(new THREE.PlaneGeometry(2, 2));
                const away = Math.sign(-this.options.light.sunFrom[0]) || 1;
                const rx = so.radius * so.stretch;
                const rz = so.radius * so.depth;
                const offset = away * (rx - so.radius) * 0.6;
                // The halo first, then the core over it, both under everything else.
                for (const [scale, opacity, order] of [[1, so.opacity, -2], [so.core.scale, so.core.opacity, -1]]) {
                    if (opacity <= 0)
                        continue;
                    const mat = keep(new THREE.MeshBasicMaterial({ color: shadowColor, alphaMap: tex, transparent: true, opacity, depthWrite: false, fog: false }));
                    const blot = new THREE.Mesh(plane, mat);
                    blot.rotation.x = -Math.PI / 2;
                    blot.scale.set(rx * scale, rz * scale, 1);
                    blot.position.set(offset * scale, 0.004, 0);
                    blot.renderOrder = order;
                    this.scene.add(blot);
                }
                // Only its dark heart counts for the framing: the halo's rim is next to nothing and may run off the box.
                this.bounds.expandByPoint(new THREE.Vector3(0, 0, rz * so.core.scale));
            }
        }
    }
    /**
     * The whole tree stands in the box, on its floor, with the air asked for on each side. The fit is made on the
     * real projection of the tree's box (a few rounds of measure and correct), so it holds for a wide angle as well
     * as for a long lens. Then the haze is laid between the near and the far side of the tree.
     */
    frameCamera(aspect) {
        const o = this.options.camera;
        const cam = this.camera;
        const e = THREE.MathUtils.degToRad(o.elevationDeg);
        const toEye = new THREE.Vector3(0, Math.sin(e), Math.cos(e));
        const target = this.bounds.getCenter(new THREE.Vector3());
        const size = this.bounds.getSize(new THREE.Vector3());
        const tan = Math.tan(THREE.MathUtils.degToRad(o.fovDeg) / 2);
        cam.aspect = aspect;
        cam.updateProjectionMatrix();
        // Where the tree's box must sit in the canvas (NDC, −1…1): its share of the width and height, and its place.
        const wide = 1 + o.padding + o.air.left + o.air.right;
        const tall = 1 + o.padding + o.air.top + o.air.bottom;
        const wantCx = -1 + (2 * (o.padding / 2 + o.air.left + 0.5)) / wide;
        const wantFloor = -1 + (2 * (o.padding / 2 + o.air.bottom)) / tall;
        const right = new THREE.Vector3();
        const up = new THREE.Vector3();
        const v = new THREE.Vector3();
        const { min, max } = this.bounds;
        let d = Math.max(size.y, size.x / aspect) / (2 * tan) + size.z / 2;
        let near = d;
        let far = d;
        for (let round = 0; round < 8; round++) {
            cam.position.copy(target).addScaledVector(toEye, d);
            cam.lookAt(target);
            cam.updateMatrixWorld();
            let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
            near = Infinity;
            far = 0;
            for (const x of [min.x, max.x])
                for (const y of [min.y, max.y])
                    for (const z of [min.z, max.z]) {
                        const depth = cam.position.distanceTo(v.set(x, y, z));
                        near = Math.min(near, depth);
                        far = Math.max(far, depth);
                        v.project(cam);
                        x0 = Math.min(x0, v.x);
                        x1 = Math.max(x1, v.x);
                        y0 = Math.min(y0, v.y);
                        y1 = Math.max(y1, v.y);
                    }
            // Too big or too small for its share: step back or come closer. Then slide it into place.
            const fit = Math.max(((x1 - x0) / 2) * wide, ((y1 - y0) / 2) * tall);
            d *= fit;
            right.setFromMatrixColumn(cam.matrixWorld, 0);
            up.setFromMatrixColumn(cam.matrixWorld, 1);
            target.addScaledVector(right, (((x0 + x1) / 2) / fit - wantCx) * d * tan * aspect);
            target.addScaledVector(up, (y0 / fit - wantFloor) * d * tan);
        }
        cam.position.copy(target).addScaledVector(toEye, d);
        cam.lookAt(target);
        cam.updateProjectionMatrix();
        const haze = this.options.haze.amount;
        if (this.hazeColor && haze > 0) {
            // A third of the veil already on the near side, all of it on the far one.
            const span = Math.max(0.001, far - near) / (haze * (1 - 0.35));
            this.scene.fog = new THREE.Fog(this.hazeColor, near - 0.35 * haze * span, near - 0.35 * haze * span + span);
        }
    }
    resize() {
        if (this.disposed)
            return;
        const w = this.host.clientWidth;
        const h = this.host.clientHeight;
        if (!w || !h)
            return;
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, this.options.render.maxPixelRatio));
        this.renderer.setSize(w, h, false);
        this.frameCamera(w / h);
        this.render();
    }
    applyGrow() {
        const g = this.uniforms.uGrow.value;
        this.tree.scale.setScalar(Math.max(0.0001, easeOutCubic(Math.min(1, g / 0.7))));
    }
    render() {
        if (!this.disposed)
            this.renderer.render(this.scene, this.camera);
    }
    sync = () => {
        const run = this.onScreen && !document.hidden && !this.disposed;
        if (this.reducedMotion) {
            if (run)
                this.render();
            return;
        }
        if (run && !this.frame) {
            this.last = 0;
            this.frame = requestAnimationFrame(this.tick);
        }
        else if (!run && this.frame) {
            cancelAnimationFrame(this.frame);
            this.frame = 0;
        }
    };
    tick = (now) => {
        this.frame = requestAnimationFrame(this.tick);
        const { maxFps } = this.options.render;
        if (maxFps > 0 && this.last && now - this.last < 1000 / maxFps - 1)
            return;
        const dt = this.last ? Math.min(0.1, (now - this.last) / 1000) : 0;
        this.last = now;
        this.time += dt;
        this.uniforms.uTime.value = this.time;
        const grow = this.options.grow;
        if (grow.enabled && this.uniforms.uGrow.value < 1) {
            if (this.growStart < 0)
                this.growStart = now;
            this.uniforms.uGrow.value = Math.min(1, (now - this.growStart) / grow.ms);
            this.applyGrow();
        }
        this.render();
    };
    dispose() {
        this.disposed = true;
        if (this.frame)
            cancelAnimationFrame(this.frame);
        this.frame = 0;
        this.io.disconnect();
        document.removeEventListener("visibilitychange", this.sync);
        for (const d of this.disposables)
            d.dispose();
        this.renderer.dispose();
        this.renderer.forceContextLoss();
        this.canvas.remove();
    }
}
