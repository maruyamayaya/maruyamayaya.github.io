(() => {
  const awayTitle = '👀跑哪里去了~';
  const returnTitle = '(*´∀ ˋ*) 抓到你啦～';
  let originalTitle = document.title;
  let restoreTimer = null;
  let hasBeenVisible = !document.hidden;
  let showingHint = false;

  function clearRestoreTimer() {
    if (restoreTimer !== null) {
      clearTimeout(restoreTimer);
      restoreTimer = null;
    }
  }

  document.addEventListener('visibilitychange', () => {
    clearRestoreTimer();
    if (document.hidden) {
      // Keep the real title when a page is first opened in the background.
      if (!hasBeenVisible) return;
      if (!showingHint) originalTitle = document.title;
      showingHint = true;
      document.title = awayTitle;
    } else if (showingHint) {
      document.title = returnTitle;
      restoreTimer = setTimeout(() => {
        restoreTimer = null;
        if (!document.hidden) {
          document.title = originalTitle;
          showingHint = false;
        }
      }, 2000);
    } else {
      hasBeenVisible = true;
      originalTitle = document.title;
    }
  });

  // Do not retain a transient greeting in a back/forward-cache snapshot.
  window.addEventListener('pagehide', () => {
    clearRestoreTimer();
    if (showingHint) document.title = originalTitle;
    showingHint = false;
  });
})();
