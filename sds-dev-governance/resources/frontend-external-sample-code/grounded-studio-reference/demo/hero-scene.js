export const THREE_MODULE_URL =
  'https://cdn.jsdelivr.net/npm/three@0.185.1/build/three.module.min.js';

const THREE = await import(THREE_MODULE_URL);

const SCENE = {
  palette: {
    ground: 0x14110f,
    groundSunk: 0x0d0b0a,
    material: 0xf3eee7,
    stone: 0xb9a28e,
    sky: 0x343b48,
    atmosphere: 0xe8c79a
  },
  camera: {
    desktop: { fov: 44, position: [0, 5.2, 13], target: [0, 0.2, -16], showFocal: true },
    narrow: { fov: 50, position: [0.4, 5.8, 15], target: [0, 0.4, -17], showFocal: true },
    portrait: { fov: 56, position: [0, 6.2, 17], target: [0, 0.8, -18], showFocal: false }
  },
  field: {
    fromZ: -58,
    toZ: 9,
    spanX: 72,
    plotWidth: 1.34,
    plotDepth: 0.82,
    gapX: 0.32,
    gapZ: 0.28,
    maxDesktop: 1650,
    maxNarrow: 720,
    seed: 0x4e4f5254
  },
  corridor: {
    xFar: -15,
    xNear: -3.8,
    halfFar: 2.2,
    halfNear: 6.1
  },
  pointer: { yaw: 2.8, pitch: 1.7, shift: 0.32, lambda: 2.4 },
  quality: { dpr: 2, coarseDpr: 1.55, narrowAt: 860, degradeAfter: 45 }
};

function seededRandom(seed) {
  let state = seed >>> 0;
  return function random() {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function corridorAt(z) {
  const t = THREE.MathUtils.clamp(
    (z - SCENE.field.fromZ) / (SCENE.field.toZ - SCENE.field.fromZ),
    0,
    1
  );
  return {
    x: THREE.MathUtils.lerp(SCENE.corridor.xFar, SCENE.corridor.xNear, t),
    half: THREE.MathUtils.lerp(SCENE.corridor.halfFar, SCENE.corridor.halfNear, t)
  };
}

function buildField(maxInstances) {
  const random = seededRandom(SCENE.field.seed);
  const placements = [];
  const xStep = SCENE.field.plotWidth + SCENE.field.gapX;
  const zStep = SCENE.field.plotDepth + SCENE.field.gapZ;

  outer: for (let z = SCENE.field.fromZ; z <= SCENE.field.toZ; z += zStep) {
    const corridor = corridorAt(z);
    for (let x = -SCENE.field.spanX / 2; x <= SCENE.field.spanX / 2; x += xStep) {
      if (Math.abs(x - corridor.x) < corridor.half) continue;
      placements.push({
        x: x + (random() - 0.5) * SCENE.field.gapX * 0.7,
        z: z + (random() - 0.5) * SCENE.field.gapZ * 0.7,
        yaw: (random() - 0.5) * 0.12,
        scale: 0.86 + random() * 0.24
      });
      if (placements.length >= maxInstances) break outer;
    }
  }

  const geometry = new THREE.BoxGeometry(
    SCENE.field.plotWidth,
    0.075,
    SCENE.field.plotDepth
  );
  const material = new THREE.MeshStandardMaterial({
    color: SCENE.palette.material,
    roughness: 0.76,
    metalness: 0.03
  });
  const mesh = new THREE.InstancedMesh(geometry, material, placements.length);
  const dummy = new THREE.Object3D();

  placements.forEach((plot, index) => {
    dummy.position.set(plot.x, 0.045, plot.z);
    dummy.rotation.set(0, plot.yaw, 0);
    dummy.scale.set(plot.scale, 1, plot.scale);
    dummy.updateMatrix();
    mesh.setMatrixAt(index, dummy.matrix);
  });
  mesh.instanceMatrix.needsUpdate = true;
  mesh.matrixAutoUpdate = false;
  mesh.updateMatrix();
  return mesh;
}

function buildFocalObject() {
  const group = new THREE.Group();
  const material = new THREE.MeshStandardMaterial({
    color: SCENE.palette.stone,
    roughness: 0.82,
    metalness: 0
  });
  const dimensions = [[0.7, 2.8, 0.5], [0.92, 3.65, 0.58], [0.62, 2.25, 0.46]];
  dimensions.forEach((size, index) => {
    const geometry = new THREE.BoxGeometry(size[0], size[1], size[2], 1, 1, 1);
    const pillar = new THREE.Mesh(geometry, material);
    pillar.position.set((index - 1) * 1.12, size[1] / 2, (index % 2) * -0.3);
    pillar.rotation.y = (index - 1) * 0.08;
    group.add(pillar);
  });
  group.position.set(6.2, 0.03, -10.5);
  group.rotation.y = -0.18;
  return group;
}

export function createHeroScene(canvas, options = {}) {
  const host = canvas.parentElement || canvas;
  const coarse = window.matchMedia('(pointer: coarse)').matches;
  let pixelRatio = Math.min(
    window.devicePixelRatio || 1,
    coarse ? SCENE.quality.coarseDpr : SCENE.quality.dpr
  );

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: pixelRatio < 1.5,
    alpha: false,
    powerPreference: 'high-performance',
    stencil: false,
    depth: true
  });
  renderer.setPixelRatio(pixelRatio);
  renderer.setClearColor(SCENE.palette.ground, 1);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.92;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(SCENE.palette.ground);
  scene.fog = new THREE.Fog(SCENE.palette.ground, 17, 58);

  const camera = new THREE.PerspectiveCamera(44, 1, 0.1, 120);
  const hemisphere = new THREE.HemisphereLight(SCENE.palette.sky, SCENE.palette.groundSunk, 1.1);
  const sun = new THREE.DirectionalLight(SCENE.palette.atmosphere, 2.4);
  sun.position.set(15, 5, 3);
  scene.add(hemisphere, sun);

  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(180, 180),
    new THREE.MeshStandardMaterial({ color: SCENE.palette.groundSunk, roughness: 1 })
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.set(0, -0.02, -25);
  ground.matrixAutoUpdate = false;
  ground.updateMatrix();
  scene.add(ground);

  const narrow = window.innerWidth < SCENE.quality.narrowAt;
  const field = buildField(narrow ? SCENE.field.maxNarrow : SCENE.field.maxDesktop);
  const focal = buildFocalObject();
  scene.add(field, focal);

  const basePosition = new THREE.Vector3();
  const baseQuaternion = new THREE.Quaternion();
  const targetQuaternion = new THREE.Quaternion();
  const offsetQuaternion = new THREE.Quaternion();
  const offsetEuler = new THREE.Euler(0, 0, 0, 'YXZ');
  const lookTarget = new THREE.Vector3();

  function applyFrame(width, height) {
    const aspect = width / Math.max(height, 1);
    let profile = SCENE.camera.desktop;
    if (aspect < 0.95) profile = SCENE.camera.portrait;
    else if (width < SCENE.quality.narrowAt) profile = SCENE.camera.narrow;

    camera.fov = profile.fov;
    camera.aspect = aspect;
    camera.position.fromArray(profile.position);
    camera.lookAt(lookTarget.fromArray(profile.target));
    camera.updateProjectionMatrix();
    basePosition.copy(camera.position);
    baseQuaternion.copy(camera.quaternion);
    focal.visible = profile.showFocal;
  }

  let pointerX = 0;
  let pointerY = 0;
  let easedX = 0;
  let easedY = 0;
  let running = false;
  let firstFrame = false;
  let lastFrame = 0;
  let slowFrames = 0;
  let degraded = false;

  function onPointerMove(event) {
    pointerX = (event.clientX / window.innerWidth) * 2 - 1;
    pointerY = (event.clientY / window.innerHeight) * 2 - 1;
  }

  function onPointerLeave() {
    pointerX = 0;
    pointerY = 0;
  }

  function render() {
    const now = performance.now() / 1000;
    const dt = Math.min(now - lastFrame, 0.1);
    lastFrame = now;

    easedX = THREE.MathUtils.damp(easedX, pointerX, 5.5, dt);
    easedY = THREE.MathUtils.damp(easedY, pointerY, 5.5, dt);
    offsetEuler.set(
      THREE.MathUtils.degToRad(-easedY * SCENE.pointer.pitch),
      THREE.MathUtils.degToRad(-easedX * SCENE.pointer.yaw),
      0
    );
    offsetQuaternion.setFromEuler(offsetEuler);
    targetQuaternion.copy(baseQuaternion).multiply(offsetQuaternion);
    camera.quaternion.slerp(
      targetQuaternion,
      1 - Math.exp(-SCENE.pointer.lambda * dt)
    );
    camera.position.x = THREE.MathUtils.damp(
      camera.position.x,
      basePosition.x + easedX * SCENE.pointer.shift,
      SCENE.pointer.lambda,
      dt
    );
    focal.rotation.y = -0.18 - easedX * 0.08;

    renderer.render(scene, camera);
    if (!firstFrame) {
      firstFrame = true;
      if (options.onFirstFrame) options.onFirstFrame();
    }

    if (!degraded && dt > 1 / 30 && ++slowFrames > SCENE.quality.degradeAfter) {
      degraded = true;
      pixelRatio = Math.max(1, pixelRatio * 0.75);
      renderer.setPixelRatio(pixelRatio);
      applySize();
    }
  }

  let resizePending = false;
  function applySize() {
    resizePending = false;
    const width = host.clientWidth || window.innerWidth;
    const height = host.clientHeight || window.innerHeight;
    renderer.setSize(width, height, false);
    applyFrame(width, height);
  }
  function requestResize() {
    if (resizePending) return;
    resizePending = true;
    window.requestAnimationFrame(applySize);
  }
  const resizeObserver = 'ResizeObserver' in window ? new ResizeObserver(requestResize) : null;
  if (resizeObserver) resizeObserver.observe(host);
  else window.addEventListener('resize', requestResize, { passive: true });

  function start() {
    if (running) return;
    running = true;
    lastFrame = performance.now() / 1000;
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    document.addEventListener('pointerleave', onPointerLeave, { passive: true });
    renderer.setAnimationLoop(render);
  }
  function stop() {
    if (!running) return;
    running = false;
    renderer.setAnimationLoop(null);
    window.removeEventListener('pointermove', onPointerMove);
    document.removeEventListener('pointerleave', onPointerLeave);
  }
  function onContextLost(event) {
    event.preventDefault();
    stop();
  }
  canvas.addEventListener('webglcontextlost', onContextLost, false);

  function dispose() {
    stop();
    canvas.removeEventListener('webglcontextlost', onContextLost);
    if (resizeObserver) resizeObserver.disconnect();
    else window.removeEventListener('resize', requestResize);
    const geometries = new Set();
    const materials = new Set();
    scene.traverse((object) => {
      if (object.geometry) geometries.add(object.geometry);
      if (object.material) {
        const list = Array.isArray(object.material) ? object.material : [object.material];
        list.forEach((material) => materials.add(material));
      }
    });
    geometries.forEach((geometry) => geometry.dispose());
    materials.forEach((material) => material.dispose());
    renderer.dispose();
  }

  applySize();
  return { start, stop, dispose, isRunning: () => running };
}
