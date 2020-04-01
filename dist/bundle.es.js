import Player from "@vimeo/player";
import assign from "object-assign";
var pid = 0;
function emitVueEvent(e) {
  var t = this;
  this.player.on(e, function(i) {
    t.$emit(e, i, t.player);
  });
}
var eventsToEmit = [
    "playbackratechange",
    "play",
    "pause",
    "ended",
    "seeked",
    "texttrackchange",
    "cuechange",
    "cuepoint",
    "volumechange",
    "error",
    "loaded"
  ],
  vueVimeoPlayer = {
    props: {
      playerHeight: { default: 320 },
      playerWidth: { default: 640 },
      options: {
        default: function() {
          return {};
        }
      },
      videoId: { required: !0 },
      videoUrl: { default: void 0 },
      loop: { default: !1 },
      autoplay: { default: !1 },
      controls: { default: !0 }
    },
    render: function(e) {
      return e("div", { attrs: { id: this.elementId, class: "vimeo-player" } });
    },
    watch: { videoId: "update" },
    data: function() {
      return { elementId: "vimeo-player-" + (pid += 1), player: null };
    },
    methods: {
      update: function(e) {
        return this.player.loadVideo(e);
      },
      play: function() {
        return this.player.play();
      },
      pause: function() {
        return this.player.pause();
      },
      mute: function() {
        return this.player.setVolume(0);
      },
      unmute: function(e) {
        return void 0 === e && (e = 0.5), this.player.setVolume(e);
      },
      setEvents: function() {
        var e = this;
        this.player
          .ready()
          .then(function() {
            e.$emit("ready", e.player);
          })
          .catch(function(t) {
            e.$emit("error", t, e.player);
          }),
          eventsToEmit.forEach(function(t) {
            return emitVueEvent.call(e, t);
          });
      }
    },
    mounted: function() {
      var e = {
        id: this.videoId,
        width: this.playerWidth,
        height: this.playerHeight,
        loop: this.loop,
        autoplay: this.autoplay,
        controls: this.controls
      };
      this.videoUrl && (e.url = this.videoUrl),
        (this.player = new Player(this.elementId, assign(e, this.options))),
        this.setEvents();
    },
    beforeDestroy: function() {
      this.player.unload();
    }
  };
function plugin(e, t) {
  e.component("vimeo-player", vueVimeoPlayer);
}
(plugin.version = "0.1.0"),
  "undefined" != typeof window && window.Vue && window.Vue.use(plugin);
export default plugin;
export { vueVimeoPlayer };
