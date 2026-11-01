(function () {
  'use strict'
  // Keep the current location when moving between the two static interfaces.
  function updateLinks () {
    document.querySelectorAll('a.language-switch').forEach(function (link) {
      const target = new URL(link.getAttribute('href'), window.location.origin)
      target.search = window.location.search
      target.hash = window.location.hash
      link.href = target.pathname + target.search + target.hash
    })
  }
  updateLinks()
  window.addEventListener('hashchange', updateLinks)
  document.addEventListener('pjax:complete', updateLinks)
})()
