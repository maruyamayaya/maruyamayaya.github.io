(() => {
  const controllerKey = '__ayaHomeSnow';
  const preferenceKey = 'aya-home-snow';
  window[controllerKey]?.destroy();

  let cleanUpScene = () => {};

  const mount = () => {
    cleanUpScene();
    const template = document.getElementById('home-effects-controls');
    const header = document.getElementById('page-header');
    if (!template || !header) return;

    const button = template.content.firstElementChild.cloneNode(true);
    const canvas = document.createElement('canvas');
    canvas.id = 'snow';
    canvas.setAttribute('aria-hidden', 'true');
    const context = canvas.getContext('2d');
    if (!context) return;
    header.append(canvas, button);

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let preference = null;
    try {
      const stored = localStorage.getItem(preferenceKey);
      if (stored === 'on' || stored === 'off') preference = stored === 'on';
    } catch (_) { /* Storage can be unavailable in private browsers. */ }

    let enabled = !reducedMotion.matches && preference !== false;
    let visible = header.getBoundingClientRect().bottom > 0;
    let frame = 0;
    let lastTime = 0;
    let width = 0;
    let height = 0;
    let flakes = [];

    const draw = time => {
      const elapsed = lastTime ? Math.min((time - lastTime) / 1000, 0.05) : 0;
      lastTime = time;
      context.clearRect(0, 0, width, height);
      flakes.forEach(flake => {
        flake.y += flake.speed * elapsed;
        flake.x += Math.sin(time / 2800 + flake.phase) * 5 * elapsed;
        if (flake.y > height + 4) {
          flake.y = -4;
          flake.x = Math.random() * width;
        }
        context.beginPath();
        context.fillStyle = `rgba(255,255,255,${flake.opacity})`;
        context.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
        context.fill();
      });
      frame = requestAnimationFrame(draw);
    };

    const update = () => {
      button.setAttribute('aria-pressed', String(enabled));
      button.setAttribute('aria-label', enabled ? '关闭首页雪花' : '开启首页雪花');
      button.title = enabled ? '关闭雪花' : '开启雪花';
      canvas.hidden = !enabled;
      if (enabled && visible && !document.hidden) {
        if (!frame) frame = requestAnimationFrame(draw);
      } else {
        cancelAnimationFrame(frame);
        frame = 0;
        lastTime = 0;
      }
    };

    const resize = () => {
      const bounds = header.getBoundingClientRect();
      width = Math.round(bounds.width);
      height = Math.round(bounds.height);
      const scale = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * scale);
      canvas.height = Math.round(height * scale);
      context.setTransform(scale, 0, 0, scale, 0, 0);
      const count = Math.min(24, Math.max(8, Math.round(width / 65)));
      flakes = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: 1 + Math.random() * 1.4,
        speed: 9 + Math.random() * 10,
        opacity: 0.3 + Math.random() * 0.3,
        phase: Math.random() * Math.PI * 2
      }));
    };

    const toggle = () => {
      preference = enabled = !enabled;
      try {
        localStorage.setItem(preferenceKey, enabled ? 'on' : 'off');
      } catch (_) { /* Keep the control usable without persistent storage. */ }
      update();
    };

    const motionChange = event => {
      enabled = !event.matches && preference !== false;
      update();
    };

    const observeVisibility = () => {
      const bounds = header.getBoundingClientRect();
      visible = bounds.bottom > 0 && bounds.top < window.innerHeight;
      update();
    };

    const observer = 'IntersectionObserver' in window
      ? new IntersectionObserver(entries => {
        visible = entries[0].isIntersecting;
        update();
      })
      : null;
    if (observer) observer.observe(header);
    else window.addEventListener('scroll', observeVisibility, { passive: true });

    const resizeObserver = 'ResizeObserver' in window ? new ResizeObserver(resize) : null;
    if (resizeObserver) resizeObserver.observe(header);
    else window.addEventListener('resize', resize);

    button.addEventListener('click', toggle);
    document.addEventListener('visibilitychange', update);
    reducedMotion.addEventListener('change', motionChange);
    resize();
    observeVisibility();

    cleanUpScene = () => {
      cancelAnimationFrame(frame);
      observer?.disconnect();
      resizeObserver?.disconnect();
      window.removeEventListener('scroll', observeVisibility);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', update);
      reducedMotion.removeEventListener('change', motionChange);
      button.removeEventListener('click', toggle);
      canvas.remove();
      button.remove();
      cleanUpScene = () => {};
    };
  };

  const unmount = () => cleanUpScene();
  document.addEventListener('pjax:send', unmount);
  document.addEventListener('pjax:complete', mount);
  window[controllerKey] = {
    destroy() {
      cleanUpScene();
      document.removeEventListener('pjax:send', unmount);
      document.removeEventListener('pjax:complete', mount);
    }
  };
  mount();
})();
