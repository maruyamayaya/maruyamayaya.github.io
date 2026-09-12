(function () {
  'use strict'
  // The shared iconfont sprite has no photo icon; keep this local symbol alongside it.
  if (document.getElementById('icon-photo-album')) return
  const sprite = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  sprite.setAttribute('aria-hidden', 'true')
  sprite.setAttribute('focusable', 'false')
  sprite.setAttribute('style', 'position:absolute;width:0;height:0;overflow:hidden')
  sprite.innerHTML = '<symbol id="icon-photo-album" viewBox="0 0 64 64">' +
    '<rect x="8" y="7" width="44" height="48" rx="5" transform="rotate(-9 30 31)" fill="#F2B66F" stroke="#D59353" stroke-width="2"/>' +
    '<rect x="13" y="10" width="43" height="48" rx="5" fill="#FFFCF6" stroke="#AD738A" stroke-width="2"/>' +
    '<rect x="18" y="15" width="33" height="29" rx="3" fill="#BFE5ED"/>' +
    '<circle cx="42" cy="23" r="4" fill="#FFD16B"/>' +
    '<path d="M18 39 29 28 37 36 42 31 51 40v1a3 3 0 0 1-3 3H21a3 3 0 0 1-3-3Z" fill="#69A88B"/>' +
    '<rect x="20" y="49" width="17" height="3" rx="1.5" fill="#CD9BAB"/>' +
    '<rect x="41" y="49" width="7" height="3" rx="1.5" fill="#E7C9D3"/>' +
    '</symbol>'
  document.body.prepend(sprite)
})()
