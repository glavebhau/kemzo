AFRAME.registerComponent('c-video360-stream-handler', {
  schema: {
    streamUrl: { type: 'string', default: '' },
    videoElId: { type: 'string', default: '' },
    autoPlay: { type: 'boolean', default: false }
  },

  init() {
    this.bindMethods();

    this.video360System = document.querySelector('a-scene').systems['s-video360'];

    this.initPlayer();
  },

  initPlayer() {
    const { videoElId } = this.data;
    const doesVideoElExists = document.getElementById(videoElId);
    if (!window.videojs || !doesVideoElExists) return;
    const videoPlayerAlreadyExists = videojs.players[videoElId] && true;

    this.player = videoPlayerAlreadyExists ? videojs.players[videoElId] : this.createPlayer(videoElId);
    this.player.on('loadeddata', this.onLoadedData);
  },

  createPlayer(videoElId) {
    const setupOpt = {
      html5: {
        nativeAudioTracks: false,
        nativeVideoTracks: false,
        nativeCaptions: false
      },
      hls: {
        overrideNative: true
      }
    };

    return videojs(videoElId, setupOpt);
  },

  update() {
    this.updateSrc(this.data.streamUrl);
  },

  updateSrc(streamUrl) {
    if (!this.player || streamUrl === '') return;

    this.player.src({
      src: streamUrl,
      type: this.getMimeType(streamUrl)
    });

    if (this.data.autoPlay) {
      if (!this.video360System.paused()) {
        this.video360System.playVideo(this.data.videoElId);
      }
    }
  },

  remove() {
    if (!this.player) return;
    this.player.off('loadeddata', this.onLoadedData);
  },

  pauseVideoStream() {
    if (!this.player) return;

    this.player.src('');
    this.player.pause();
  },

  bindMethods() {
    this.onLoadedData = this.onLoadedData.bind(this);
  },

  getMimeType(url) {
    if (url.endsWith('m3u8')) return 'application/x-mpegURL';

    if (url.endsWith('mpd')) return 'application/dash+xml';

    if (url.endsWith('webm')) return 'video/webm';

    return 'video/mp4';
  },

  onLoadedData() {
    console.log('onLoadedData');
    this.el.setAttribute('src', '#' + this.data.videoElId + '_html5_api');
  }
});
