(() => {
  const displayAge = () => {
    const target = document.getElementById('site-age');
    if (!target) return;
    const started = Date.parse('2024-11-11T00:00:00+08:00');
    const days = Math.max(0, Math.floor((Date.now() - started) / 86400000));
    target.textContent = `一起走过 ${days} 天`;
  };
  displayAge();
  document.addEventListener('pjax:complete', displayAge);
})();
