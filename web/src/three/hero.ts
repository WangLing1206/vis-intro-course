import * as THREE from 'three';
import { HERO } from '../styles/palette';

function smooth(a: number, b: number, x: number): number {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
}

function mulberry32(seed: number): () => number {
  let s = seed | 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

/**
 * 首页 Hero v2:粒子管线(云->网格->柱聚合)+ 数据流光 + 鼠标斥力 + 滚动淡出。
 * 取色仅用色板品牌蓝 + 分类前两色。
 */
export function mountHero(canvas: HTMLCanvasElement): () => void {
  const parent = canvas.parentElement ?? canvas;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false });
  renderer.setClearColor(HERO.bg, 1);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100);
  camera.position.set(0, 0.4, 9);

  const isMobile = window.matchMedia('(max-width: 600px)').matches;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const N = isMobile ? 900 : 2200;
  const rand = mulberry32(42);

  // ---- 主粒子:三关键帧 ----
  const p0 = new Float32Array(N * 3);
  const p1 = new Float32Array(N * 3);
  const p2 = new Float32Array(N * 3);
  const seeds = new Float32Array(N);
  const colorArr = new Float32Array(N * 3);
  const cols = [HERO.particle[0], HERO.particle[1], HERO.particle[2]].map(
    (c) => new THREE.Color(c),
  );
  const bars: number[] = [];
  for (let i = 0; i < 12; i++) bars.push(0.8 + (((i * 37 + 11) % 10) / 10) * 2.4);

  for (let i = 0; i < N; i++) {
    const ix = i * 3;
    const x0 = (rand() * 2 - 1) * 7;
    const y0 = (rand() * 2 - 1) * 3;
    p0[ix] = x0;
    p0[ix + 1] = y0;
    p0[ix + 2] = 1 - rand() * 5;
    p1[ix] = clamp(Math.round(x0 / 0.9) * 0.9, -7, 7);
    p1[ix + 1] = clamp(Math.round(y0 / 0.9) * 0.9, -3, 3);
    p1[ix + 2] = -0.6;
    const bi = clamp(Math.floor(((x0 + 7) / 14) * 12), 0, 11);
    p2[ix] = -6.4 + bi * 1.16 + (rand() - 0.5) * 0.5;
    p2[ix + 1] = -2.8 + rand() * bars[bi];
    p2[ix + 2] = 0.4;
    seeds[i] = rand() * Math.PI * 2;
    const c = cols[i % 3];
    colorArr[ix] = c.r;
    colorArr[ix + 1] = c.g;
    colorArr[ix + 2] = c.b;
  }

  const geo = new THREE.BufferGeometry();
  const posAttr = new THREE.BufferAttribute(p0.slice(), 3);
  posAttr.setUsage(THREE.DynamicDrawUsage);
  geo.setAttribute('position', posAttr);
  geo.setAttribute('color', new THREE.BufferAttribute(colorArr, 3));
  const mat = new THREE.PointsMaterial({
    size: 0.055,
    vertexColors: true,
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  scene.add(new THREE.Points(geo, mat));

  // ---- 数据流光:沿正弦轨道自左向右的亮点 ----
  const M = isMobile ? 24 : 48;
  const flowPos = new Float32Array(M * 3);
  const flowCol = new Float32Array(M * 3);
  const lane = new Float32Array(M);
  const speed = new Float32Array(M);
  const phase = new Float32Array(M);
  for (let j = 0; j < M; j++) {
    lane[j] = (rand() * 2 - 1) * 2.6;
    speed[j] = 0.05 + rand() * 0.08;
    phase[j] = rand();
    const c = cols[j % 3];
    flowCol[j * 3] = c.r;
    flowCol[j * 3 + 1] = c.g;
    flowCol[j * 3 + 2] = c.b;
  }
  const flowGeo = new THREE.BufferGeometry();
  const flowAttr = new THREE.BufferAttribute(flowPos, 3);
  flowAttr.setUsage(THREE.DynamicDrawUsage);
  flowGeo.setAttribute('position', flowAttr);
  flowGeo.setAttribute('color', new THREE.BufferAttribute(flowCol, 3));
  const flowMat = new THREE.PointsMaterial({
    size: 0.16,
    vertexColors: true,
    transparent: true,
    opacity: 0.9,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  scene.add(new THREE.Points(flowGeo, flowMat));

  const grid = new THREE.GridHelper(16, 32, 0x2b3b72, 0x141c3a);
  grid.position.y = -3.4;
  const gm = grid.material as THREE.LineBasicMaterial;
  gm.transparent = true;
  gm.opacity = 0.55;
  scene.add(grid);

  // ---- 鼠标:视差 + 斥力 ----
  let mx = 0;
  let wx = 0;
  let wy = 0;
  let mouseIn = false;
  let halfW = 8;
  let halfH = 4.6;
  const onMove = (e: PointerEvent) => {
    const r = parent.getBoundingClientRect();
    const nx = ((e.clientX - r.left) / Math.max(1, r.width) - 0.5) * 2;
    const ny = -(((e.clientY - r.top) / Math.max(1, r.height) - 0.5) * 2);
    mx = nx;
    wx = nx * halfW;
    wy = ny * halfH;
    mouseIn = true;
  };
  const onLeave = () => {
    mouseIn = false;
    mx = 0;
  };
  parent.addEventListener('pointermove', onMove);
  parent.addEventListener('pointerleave', onLeave);

  // ---- 滚动淡出 ----
  let scrollK = 0;
  const onScroll = () => {
    const h = parent.clientHeight || 1;
    scrollK = clamp(window.scrollY / h, 0, 1);
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  const resize = () => {
    const w = parent.clientWidth || 1;
    const h = parent.clientHeight || 1;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    halfH = Math.tan((camera.fov * Math.PI) / 360) * 9;
    halfW = halfH * camera.aspect;
  };
  resize();
  const ro = new ResizeObserver(resize);
  ro.observe(parent);

  const T = 20;
  const arr = posAttr.array as Float32Array;
  const farr = flowAttr.array as Float32Array;
  const render = (elapsed: number) => {
    const tt = (elapsed % T) / T;
    const wGrid = smooth(0.02, 0.3, tt) * (1 - smooth(0.45, 0.72, tt));
    const wBar = smooth(0.45, 0.72, tt) * (1 - smooth(0.9, 1.0, tt));
    const wCloud = Math.max(0, 1 - wGrid - wBar);
    for (let i = 0; i < N; i++) {
      const ix = i * 3;
      let x = p0[ix] * wCloud + p1[ix] * wGrid + p2[ix] * wBar;
      let y =
        p0[ix + 1] * wCloud +
        p1[ix + 1] * wGrid +
        p2[ix + 1] * wBar +
        Math.sin(elapsed * 0.8 + seeds[i]) * 0.06;
      if (mouseIn) {
        const dx = x - wx;
        const dy = y - wy;
        const d2 = dx * dx + dy * dy;
        if (d2 < 2.56) {
          const d = Math.sqrt(d2) || 0.001;
          const f = ((1.6 - d) / 1.6) * 0.9;
          x += (dx / d) * f;
          y += (dy / d) * f;
        }
      }
      arr[ix] = x;
      arr[ix + 1] = y;
      arr[ix + 2] = p0[ix + 2] * wCloud + p1[ix + 2] * wGrid + p2[ix + 2] * wBar;
    }
    posAttr.needsUpdate = true;

    for (let j = 0; j < M; j++) {
      const p = (elapsed * speed[j] + phase[j]) % 1;
      const x = -8 + p * 16;
      farr[j * 3] = x;
      farr[j * 3 + 1] = lane[j] + Math.sin(x * 0.8 + phase[j] * 6.28) * 0.5;
      farr[j * 3 + 2] = -1.5 + (j % 3) * 0.5;
    }
    flowAttr.needsUpdate = true;

    mat.opacity = 0.85 * (1 - scrollK * 0.75);
    flowMat.opacity = 0.9 * (1 - scrollK * 0.75);
    gm.opacity = (0.45 + Math.sin(elapsed * 1.2) * 0.1) * (1 - scrollK * 0.75);
    camera.position.x += (mx * 0.6 - camera.position.x) * 0.05;
    camera.position.z = 9 + Math.sin(elapsed * 0.15) * 0.4;
    camera.lookAt(0, 0, 0);
    renderer.render(scene, camera);
  };

  let raf = 0;
  if (reduced) {
    render(T * 0.55);
  } else {
    const start = performance.now();
    const loop = () => {
      render((performance.now() - start) / 1000);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
  }

  return () => {
    cancelAnimationFrame(raf);
    parent.removeEventListener('pointermove', onMove);
    parent.removeEventListener('pointerleave', onLeave);
    window.removeEventListener('scroll', onScroll);
    ro.disconnect();
    geo.dispose();
    flowGeo.dispose();
    mat.dispose();
    flowMat.dispose();
    gm.dispose();
    renderer.dispose();
  };
}