AFRAME.registerSystem('s-video360', {
  init() {
    this.isPaused = false;
    this.isMuted = false;
    this.activeVideo360ElId = 'innerVideo360HtmlEl';

    this.bindMethods();
    this.addEventListeners();
  },

  pause() {
    this.removeEventListeners();
  },

  getPlayer(videoElId) {
    if (!window.videojs) {
      return null;
    }
    return videojs.players[videoElId || this.activeVideo360ElId];
  },

  updateActiveVideoElId(event) {
    const { activeBackgroundContainer } = event.detail;
    this.activeVideo360ElId = activeBackgroundContainer + 'Video360HtmlEl';
    console.log('this.activeVideo360ElId', this.activeVideo360ElId);
  },

  muted(muted) {
    // Get muted
    if (muted === undefined) return this.isMuted;

    // Set muted
    if (muted === this.isMuted) return this.isMuted;
    const player = this.getPlayer();
    if (!player) return null;

    player.muted(muted);
    this.isMuted = muted;
    this.el.sceneEl.emit('vidoe360-muted', { muted });
    return this.isMuted;
  },

  paused() {
    return this.isPaused;
  },

  playVideo(videoElId) {
    const player = this.getPlayer(videoElId);
    if (!player) return;

    // TODO : Monkey patching
    setTimeout(() => {
      player.play();
      player.muted(this.muted());
      this.isPaused = false;
      this.el.sceneEl.emit('video360-played');
    }, 0);
  },

  pauseVideo() {
    const player = this.getPlayer();
    if (!player) return;

    player.pause();
    this.isPaused = true;
    this.el.sceneEl.emit('video360-paused');
  },

  bindMethods() {
    this.updateActiveVideoElId = this.updateActiveVideoElId.bind(this);
    this.playVideo = this.playVideo.bind(this);
    this.pauseVideo = this.pauseVideo.bind(this);
  },

  addEventListeners() {
    this.el.sceneEl.addEventListener('active-background-container-updated', this.updateActiveVideoElId);
    this.el.sceneEl.addEventListener('play-video360', this.playVideo);
    this.el.sceneEl.addEventListener('pause-video360', this.pauseVideo);
  },

  removeEventListeners() {
    this.el.sceneEl.removeEventListener('active-background-container-updated', this.updateActiveVideoElId);
    this.el.sceneEl.removeEventListener('play-video360', this.playVideo);
    this.el.sceneEl.removeEventListener('pause-video360', this.pauseVideo);
  }
});
