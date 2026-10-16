/* 章节内嵌示例的公共工具：双语标签、确定性随机数、画布与提示框 */

(function () {
  const p = new URLSearchParams(location.search);
  const LANG = p.get('lang') === 'en' ? 'en' : 'zh';

  window.L = function (zh, en) { return LANG === 'en' ? en : zh; };
  window.DEMO_LANG = LANG;

  /* 确定性随机数：保证每次打开示例图形一致，便于对照学习 */
  window.rnd = function (seed) {
    let a = seed >>> 0;
    return function () {
      a += 0x6d2b79f5;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  };

  /* 创建自适应画布：以容器宽度绘制，viewBox 保证缩放不变形 */
  window.canvas = function (sel, height, margin) {
    const el = document.querySelector(sel);
    const m = margin || { top: 16, right: 16, bottom: 28, left: 40 };
    const W = Math.max(el.clientWidth || 640, 320);
    const H = height || 300;
    el.innerHTML = '';
    const svg = d3.select(el).append('svg')
      .attr('viewBox', '0 0 ' + W + ' ' + H)
      .attr('width', '100%')
      .attr('height', H)
      .style('overflow', 'visible');
    const g = svg.append('g').attr('transform', 'translate(' + m.left + ',' + m.top + ')');
    return {
      svg: svg, g: g, el: el,
      w: W - m.left - m.right,
      h: H - m.top - m.bottom,
      W: W, H: H, m: m
    };
  };

  /* 跟随鼠标的提示框 */
  window.tip = function (hostSel) {
    const host = document.querySelector(hostSel);
    let box = host.querySelector('.d-tip');
    if (!box) {
      box = document.createElement('div');
      box.className = 'd-tip';
      host.style.position = 'relative';
      host.appendChild(box);
    }
    return {
      show: function (html, event) {
        box.innerHTML = html;
        box.classList.add('in');
        const r = host.getBoundingClientRect();
        let x = event.clientX - r.left + 12;
        let y = event.clientY - r.top - 8;
        if (x > r.width - 130) x = event.clientX - r.left - box.offsetWidth - 12;
        box.style.left = x + 'px';
        box.style.top = Math.max(y, 2) + 'px';
      },
      move: function (event) {
        const r = host.getBoundingClientRect();
        let x = event.clientX - r.left + 12;
        if (x > r.width - 130) x = event.clientX - r.left - box.offsetWidth - 12;
        box.style.left = x + 'px';
        box.style.top = Math.max(event.clientY - r.top - 8, 2) + 'px';
      },
      hide: function () { box.classList.remove('in'); }
    };
  };

  window.fmt = function (v, n) { return (+v).toFixed(n == null ? 2 : n); };
})();
