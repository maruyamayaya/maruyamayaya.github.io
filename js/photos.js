(function () {
  'use strict'
  const wall = document.getElementById('photo-wall')
  const dialog = document.getElementById('photo-dialog')
  if (!wall || !dialog || wall.dataset.ready) return
  let allPhotos
  try { allPhotos = JSON.parse(document.getElementById('photo-wall-data').textContent) } catch (_) { return }
  if (!Array.isArray(allPhotos) || !allPhotos.length) return
  wall.dataset.ready = 'true'
  wall.dataset.view = 'overview'

  const albums = Array.from(wall.querySelectorAll('.pw-album'))
  const yearButtons = Array.from(wall.querySelectorAll('.pw-year-button'))
  const search = document.getElementById('pw-search')
  const results = document.getElementById('pw-album-results')
  const empty = wall.querySelector('.pw-no-results')
  const image = document.getElementById('pw-full-image')
  const date = document.getElementById('pw-dialog-date')
  const counter = document.getElementById('pw-dialog-count')
  const error = document.getElementById('pw-dialog-error')
  const previous = dialog.querySelector('.pw-dialog-prev')
  const next = dialog.querySelector('.pw-dialog-next')
  let year = 'all'
  let activeAlbum = null
  let overviewScroll = 0
  let selection = []
  let current = 0
  let returnFocus = null
  let previousOverflow = ''
  wall.querySelector('.pw-toolbar').hidden = false
  wall.querySelector('.pw-search').hidden = false
  wall.querySelectorAll('.pw-back').forEach(button => { button.hidden = false })

  function applyFilters () {
    const query = search.value.trim().toLocaleLowerCase()
    let visible = 0
    albums.forEach(album => {
      const match = (year === 'all' || album.dataset.year === year) && album.dataset.search.toLocaleLowerCase().includes(query)
      album.hidden = !match
      if (match) visible++
    })
    yearButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.year === year)))
    results.textContent = visible + ' 个相册'
    empty.hidden = visible > 0
  }
  yearButtons.forEach(button => button.addEventListener('click', () => {
    year = button.dataset.year
    applyFilters()
  }))
  search.addEventListener('input', applyFilters)
  wall.querySelector('.pw-reset').addEventListener('click', () => {
    year = 'all'
    search.value = ''
    applyFilters()
    search.focus()
  })

  albums.forEach(album => {
    const cover = album.querySelector('summary')
    cover.addEventListener('click', () => { if (!album.open) overviewScroll = window.scrollY })
    album.addEventListener('toggle', () => {
      if (album.open) {
        activeAlbum = album
        albums.forEach(other => {
          other.hidden = other !== album
          if (other !== album) other.open = false
        })
        selection = allPhotos.filter(photo => photo.id.startsWith(album.dataset.albumId + '-'))
        wall.dataset.view = 'album'
        empty.hidden = true
        window.scrollTo({ top: Math.max(0, wall.getBoundingClientRect().top + window.scrollY - 88), behavior: 'instant' })
        album.querySelector('.pw-back').focus({ preventScroll: true })
      } else if (activeAlbum === album) {
        activeAlbum = null
        wall.dataset.view = 'overview'
        applyFilters()
        window.scrollTo({ top: overviewScroll, behavior: 'instant' })
        cover.focus({ preventScroll: true })
      }
    })
    album.querySelector('.pw-back').addEventListener('click', () => { album.open = false })
  })

  function show (index) {
    if (!selection.length) return
    current = (index + selection.length) % selection.length
    const photo = selection[current]
    image.alt = photo.alt
    error.hidden = true
    dialog.dataset.loading = 'true'
    image.src = photo.full
    date.textContent = photo.dateLabel
    date.href = photo.url
    counter.textContent = (current + 1) + ' / ' + selection.length
    previous.disabled = selection.length < 2
    next.disabled = selection.length < 2
  }
  image.addEventListener('load', () => { delete dialog.dataset.loading })
  image.addEventListener('error', () => { delete dialog.dataset.loading; error.hidden = false })
  wall.addEventListener('click', event => {
    const shot = event.target.closest('.pw-shot')
    if (!shot || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || typeof dialog.showModal !== 'function') return
    const album = shot.closest('.pw-album')
    selection = allPhotos.filter(photo => photo.id.startsWith(album.dataset.albumId + '-'))
    const index = selection.findIndex(photo => photo.id === shot.dataset.photoId)
    if (index < 0) return
    event.preventDefault()
    returnFocus = shot
    previousOverflow = document.documentElement.style.overflow
    document.documentElement.style.overflow = 'hidden'
    show(index)
    dialog.showModal()
    dialog.querySelector('.pw-dialog-close').focus()
  })
  dialog.querySelector('.pw-dialog-close').addEventListener('click', () => dialog.close())
  previous.addEventListener('click', () => show(current - 1))
  next.addEventListener('click', () => show(current + 1))
  dialog.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft') { event.preventDefault(); show(current - 1) }
    if (event.key === 'ArrowRight') { event.preventDefault(); show(current + 1) }
  })
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close() })
  dialog.addEventListener('close', () => {
    document.documentElement.style.overflow = previousOverflow
    image.removeAttribute('src')
    if (returnFocus && returnFocus.isConnected) returnFocus.focus({ preventScroll: true })
  })
})()
