(function () {
  'use strict';

  function initMusic() {
    var card = document.getElementById('card-music');
    if (!card || card.dataset.musicReady === 'true') return;

    var audio = card.querySelector('.music-audio');
    var play = card.querySelector('[data-music-play]');
    var seek = card.querySelector('[data-music-seek]');
    var current = card.querySelector('[data-music-current]');
    var duration = card.querySelector('[data-music-duration]');
    var mute = card.querySelector('[data-music-mute]');
    var status = card.querySelector('[data-music-status]');
    if (!audio || !play || !seek || !current || !duration || !mute || !status) return;

    card.dataset.musicReady = 'true';
    var playRequested = false;
    var requestId = 0;

    function formatTime(seconds) {
      seconds = Number.isFinite(seconds) && seconds > 0 ? Math.floor(seconds) : 0;
      return Math.floor(seconds / 60) + ':' + String(seconds % 60).padStart(2, '0');
    }

    function updateTime() {
      var canSeek = Number.isFinite(audio.duration) && audio.duration > 0;
      current.textContent = formatTime(audio.currentTime);
      seek.disabled = !canSeek;
      if (canSeek) {
        var totalTime = formatTime(Math.round(audio.duration));
        duration.textContent = totalTime;
        seek.value = Math.round(audio.currentTime / audio.duration * 1000);
        seek.setAttribute('aria-valuetext', formatTime(audio.currentTime) + ' / ' + totalTime);
      }
      seek.style.setProperty('--music-progress', Number(seek.value) / 10 + '%');
    }

    function updatePlayback() {
      var playing = !audio.paused && !audio.ended;
      card.classList.toggle('is-playing', playing);
      play.setAttribute('aria-label', playing ? '暂停音乐' : '播放音乐');
      play.setAttribute('title', playing ? '暂停音乐' : '播放音乐');
    }

    function updateVolume() {
      var muted = audio.muted || audio.volume === 0;
      card.classList.toggle('is-muted', muted);
      mute.setAttribute('aria-label', muted ? '开启声音' : '静音');
      mute.setAttribute('title', muted ? '开启声音' : '静音');
      mute.setAttribute('aria-pressed', String(muted));
    }

    function showError() {
      playRequested = false;
      status.textContent = '音频暂时无法播放，请再点播放重试。';
      updatePlayback();
    }

    play.addEventListener('click', function () {
      var thisRequest = ++requestId;
      if (!audio.paused || playRequested) {
        playRequested = false;
        audio.pause();
        status.textContent = '';
        updatePlayback();
        return;
      }

      playRequested = true;
      status.textContent = '';
      if (audio.error) audio.load();
      try {
        Promise.resolve(audio.play()).catch(function (error) {
          if (thisRequest !== requestId) return;
          if (error.name === 'AbortError') {
            playRequested = false;
            status.textContent = '';
            updatePlayback();
          } else {
            showError();
          }
        });
      } catch (error) {
        showError();
      }
    });

    seek.addEventListener('input', function () {
      if (!Number.isFinite(audio.duration) || audio.duration <= 0) return;
      try {
        audio.currentTime = Number(seek.value) / 1000 * audio.duration;
        updateTime();
      } catch (error) {
        status.textContent = '暂时无法跳转，请稍后再试。';
      }
    });

    mute.addEventListener('click', function () {
      if (audio.volume === 0) {
        audio.volume = 1;
        audio.muted = false;
      } else {
        audio.muted = !audio.muted;
      }
      updateVolume();
    });

    audio.addEventListener('play', updatePlayback);
    audio.addEventListener('playing', function () {
      status.textContent = '';
      updatePlayback();
    });
    audio.addEventListener('pause', function () {
      if (audio.paused) playRequested = false;
      updatePlayback();
    });
    audio.addEventListener('waiting', function () {
      if (playRequested && !audio.paused) status.textContent = '正在加载音频…';
    });
    audio.addEventListener('error', showError);
    audio.addEventListener('volumechange', updateVolume);
    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateTime);
    audio.addEventListener('durationchange', updateTime);
    audio.addEventListener('ended', function () {
      ++requestId;
      playRequested = false;
      status.textContent = '';
      audio.currentTime = 0;
      updateTime();
      updatePlayback();
    });

    updateTime();
    updatePlayback();
    updateVolume();
    card.querySelectorAll('[data-music-controls]').forEach(function (controls) {
      controls.hidden = false;
    });
    card.classList.add('is-enhanced');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMusic, { once: true });
  } else {
    initMusic();
  }
  document.addEventListener('pjax:complete', initMusic);
})();
