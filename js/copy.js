(() => {
  if (window.__blogCopyNotificationsReady) return
  window.__blogCopyNotificationsReady = true

  let timer
  const notify = text => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      if (window.btf && typeof window.btf.snackbarShow === 'function' &&
          typeof Snackbar !== 'undefined' && typeof GLOBAL_CONFIG !== 'undefined' &&
          GLOBAL_CONFIG.Snackbar) {
        window.btf.snackbarShow(text, true, 5000)
      }
    }, 300)
  }

  document.addEventListener('copy', () => {
    notify('哎嘿！复制成功🍬 若要转载最好保留原文链接哦，给你一个大大的赞！🤞🤞')
  })

  // Keep the existing shortcut reminder without blocking browser shortcuts.
  document.addEventListener('keydown', event => {
    const key = (event.key || '').toLowerCase()
    const isDevTools = key === 'f12' || event.keyCode === 123 ||
      (event.ctrlKey && event.shiftKey &&
        (['j', 'i', 'c'].includes(key) || [74, 73, 67].includes(event.keyCode))) ||
      (event.ctrlKey && (key === 'u' || event.keyCode === 85))
    if (isDevTools) notify('你已被发现😜 小伙子，扒源记住要遵循GPL协议！')
  })
})()
