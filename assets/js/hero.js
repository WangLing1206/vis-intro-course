import * as THREE from './vendor/three.module.js';

/* 首页 Hero：粒子在可视化流程的五个阶段之间形变，
   体现"原始数据 → 清洗变换 → 可视化编码 → 渲染 → 交互"的数据处理动效 */

const COUNT = 6000;
const STAGES = [
  { zh: '原始数据 · 采集', en: 'RAW DATA · COLLECT' },
  { zh: '清洗与变换', en: 'CLEAN & TRANSFORM' },
  { zh: '可视化编码', en: 'VISUAL ENCODING' },
  { zh: '渲染绘制', en: 'RENDERING' },
  { zh: '交互探索', en: 'INTERACTION' }
];

function circularTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const g = c.getContext('2d');
  const grd = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grd.addColorStop(0, 'rgba(255,255,255,1)');
  grd.addColorStop(0.35, 'rgba(255,255,255,0.55)');
  grd.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = grd;
  g.fillRect(0, 0, 64, 64);
  const t = new THREE.CanvasTexture(c);
  t.needsUpdate = true;
  return t;
}

/* ---------- 五套布局：每套给出 COUNT 个目标坐标 ---------- */
function layoutCloud(n) {
  const a = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    a[i * 3] = (Math.random() - 0.5) * 70;
    a[i * 3 + 1] = (Math.random() - 0.5) * 42;
    a[i * 3 + 2] = (Math.random() - 0.5) * 42;
  }
  return a;
}

function layoutSphere(n) {
  const a = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const u = Math.random(), v = Math.random();
    const theta = 2 * Math.PI * u, phi = Math.acos(2 * v - 1);
    const r = 20 + Math.random() * 4;
    a[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    a[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.9;
    a[i * 3 + 2] = r * Math.cos(phi);
  }
  return a;
}

function layoutBars(n) {
  const a = new Float32Array(n * 3);
  const cols = 26;
  const values = [];
  for (let c = 0; c < cols; c++) {
    values.push(6 + 20 * Math.abs(Math.sin(c * 0.55)) + Math.random() * 7);
  }
  const per = Math.floor(n / cols);
  let k = 0;
  for (let c = 0; c < cols; c++) {
    const x = (c - (cols - 1) / 2) * 2.5;
    const h = values[c];
    for (let j = 0; j < per && k < n; j++, k++) {
      a[k * 3] = x + (Math.random() - 0.5) * 1.6;
      a[k * 3 + 1] = -20 + Math.random() * h * 2;
      a[k * 3 + 2] = (Math.random() - 0.5) * 10;
    }
  }
  for (; k < n; k++) {
    a[k * 3] = (Math.random() - 0.5) * 60;
    a[k * 3 + 1] = -20 + Math.random() * 30;
    a[k * 3 + 2] = (Math.random() - 0.5) * 10;
  }
  return a;
}

function layoutWave(n) {
  const a = new Float32Array(n * 3);
  const side = Math.ceil(Math.sqrt(n));
  let k = 0;
  for (let i = 0; i < side; i++) {
    for (let j = 0; j < side && k < n; j++, k++) {
      const x = (i / (side - 1) - 0.5) * 64;
      const z = (j / (side - 1) - 0.5) * 44;
      const d = Math.sqrt(x * x + z * z) * 0.16;
      a[k * 3] = x;
      a[k * 3 + 1] = Math.sin(d) * 13 * Math.exp(-d * 0.16) - 6;
      a[k * 3 + 2] = z;
    }
  }
  return a;
}

function layoutNetwork(n, centers) {
  const a = new Float32Array(n * 3);
  const m = centers.length;
  for (let i = 0; i < n; i++) {
    const c = centers[i % m];
    const ang = Math.random() * Math.PI * 2;
    const rad = 2 + Math.pow(Math.random(), 0.7) * 7;
    a[i * 3] = c.x + Math.cos(ang) * rad;
    a[i * 3 + 1] = c.y + Math.sin(ang) * rad * 0.8;
    a[i * 3 + 2] = c.z + (Math.random() - 0.5) * 5;
  }
  return a;
}

function makeCenters() {
  const pts = [];
  const R = 17;
  for (let i = 0; i < 7; i++) {
    const ang = (i / 7) * Math.PI * 2;
    pts.push({
      x: Math.cos(ang) * R + (Math.random() - 0.5) * 4,
      y: Math.sin(ang) * R * 0.75 + (Math.random() - 0.5) * 4,
      z: (Math.random() - 0.5) * 10
    });
  }
  pts.push({ x: 0, y: 0, z: 0 });
  return pts;
}

function VizHero() {
  let renderer, scene, camera, points, lineSeg, centerLines;
  let pos, col, targets = [], current = 0, raf = null, mounted = false;
  let container = null, stageEl = null, timer = null;
  const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
  const centers = makeCenters();

  function buildTargets() {
    targets = [
      layoutCloud(COUNT),
      layoutSphere(COUNT),
      layoutBars(COUNT),
      layoutWave(COUNT),
      layoutNetwork(COUNT, centers)
    ];
  }

  function buildLines() {
    const arr = [];
    for (let i = 0; i < centers.length; i++) {
      for (let j = i + 1; j < centers.length; j++) {
        if (Math.random() < 0.55) {
          arr.push(centers[i].x, centers[i].y, centers[i].z,
                   centers[j].x, centers[j].y, centers[j].z);
        }
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(arr, 3));
    const m = new THREE.LineBasicMaterial({
      color: 0x6366f1, transparent: true, opacity: 0
    });
    lineSeg = new THREE.LineSegments(g, m);
    centerLines = arr;
    return lineSeg;
  }

  function init(el) {
    container = el;
    stageEl = container.parentElement
      ? container.parentElement.querySelector('.hero-stage') : null;
    const w = container.clientWidth || window.innerWidth;
    const h = container.clientHeight || 600;

    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0c0c10, 0.012);
    camera = new THREE.PerspectiveCamera(58, w / h, 1, 400);
    camera.position.set(0, 4, 62);

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(w, h);
    renderer.setClearColor(0x0c0c10, 1);
    container.appendChild(renderer.domElement);
    renderer.domElement.id = 'hero-canvas';

    buildTargets();
    pos = new Float32Array(targets[0]);
    col = new Float32Array(COUNT * 3);
    const c0 = new THREE.Color(0xffffff), c1 = new THREE.Color(0x818cf8), tmp = new THREE.Color();
    for (let i = 0; i < COUNT; i++) {
      tmp.copy(c0).lerp(c1, Math.random() * 0.85);
      col[i * 3] = tmp.r; col[i * 3 + 1] = tmp.g; col[i * 3 + 2] = tmp.b;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
    const mat = new THREE.PointsMaterial({
      size: 0.85,
      map: circularTexture(),
      vertexColors: true,
      transparent: true,
      opacity: 0.95,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true
    });
    points = new THREE.Points(geo, mat);
    scene.add(points);
    scene.add(buildLines());

    mounted = true;
    updateStageLabel();
    animate();
    autoPlay();

    window.addEventListener('resize', onResize);
    window.addEventListener('mousemove', onMouseMove);
    container.addEventListener('click', next);
  }

  function onMouseMove(e) {
    mouse.tx = (e.clientX / window.innerWidth - 0.5) * 2;
    mouse.ty = (e.clientY / window.innerHeight - 0.5) * 2;
  }

  function onResize() {
    if (!renderer || !container) return;
    const w = container.clientWidth, h = container.clientHeight;
    if (!w || !h) return;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }

  function lang() {
    return localStorage.getItem('vis_lang') === 'en' ? 'en' : 'zh';
  }

  function updateStageLabel() {
    if (stageEl) {
      const s = STAGES[current];
      stageEl.textContent = lang() === 'en' ? s.en : s.zh;
      stageEl.style.opacity = '0.2';
      requestAnimationFrame(() => { stageEl.style.opacity = '1'; });
    }
  }

  function next() { go((current + 1) % STAGES.length); }
  function go(i) {
    current = i;
    updateStageLabel();
  }
  function autoPlay() {
    clearInterval(timer);
    timer = setInterval(() => { if (mounted) next(); }, 5200);
  }

  function animate() {
    raf = requestAnimationFrame(animate);
    if (!mounted) return;
    const t = targets[current];
    const ease = 0.055;
    for (let i = 0; i < COUNT; i++) {
      const i3 = i * 3;
      const wob = i % 7 === 0 ? Math.sin(Date.now() * 0.0012 + i) * 0.35 : 0;
      pos[i3] += (t[i3] - pos[i3]) * ease;
      pos[i3 + 1] += (t[i3 + 1] + wob - pos[i3 + 1]) * ease;
      pos[i3 + 2] += (t[i3 + 2] - pos[i3 + 2]) * ease;
    }
    points.geometry.attributes.position.needsUpdate = true;

    // 网络阶段的连线渐显
    const targetOpacity = current === 4 ? 0.35 : 0;
    lineSeg.material.opacity += (targetOpacity - lineSeg.material.opacity) * 0.05;

    mouse.x += (mouse.tx - mouse.x) * 0.05;
    mouse.y += (mouse.ty - mouse.y) * 0.05;
    points.rotation.y += 0.0016;
    points.rotation.x = mouse.y * 0.16;
    lineSeg.rotation.copy(points.rotation);
    camera.position.x = mouse.x * 8;
    camera.position.y = 4 - mouse.y * 5;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
  }

  function destroy() {
    mounted = false;
    clearInterval(timer);
    if (raf) cancelAnimationFrame(raf);
    window.removeEventListener('resize', onResize);
    window.removeEventListener('mousemove', onMouseMove);
    if (renderer) {
      renderer.dispose();
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    }
    scene = null; points = null; renderer = null;
  }

  return { init, destroy, next, go, updateStageLabel, isMounted: () => mounted };
}

const hero = VizHero();
window.VizHero = hero;

/* hero 容器由 app.js 渲染，模块脚本在文档解析后执行，直接挂载 */
const el = document.getElementById('hero-mount');
if (el) hero.init(el);

/* 语言切换时同步舞台标签 */
window.addEventListener('vis:langchange', () => hero.updateStageLabel());
