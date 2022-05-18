"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _client = require("@soundworks/core/client");

var _litHtml = require("lit-html");

var _renderInitializationScreens = _interopRequireDefault(require("@soundworks/template-helpers/client/render-initialization-screens.js"));

var _Monster = _interopRequireDefault(require("./Monster.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class PlayerExperience extends _client.AbstractExperience {
  constructor(client, config = {}, $container) {
    super(client);
    this.config = config;
    this.$container = $container;
    this.rafId = null;
    this.filesystem = this.require('filesystem'); // this.audioBufferLoader = this.require('audio-buffer-loader');
    // require plugins if needed

    this.audioBufferLoader = this.require('audio-buffer-loader');
    this.ambisonics = require('ambisonics');
    this.initialising = true;
    this.monsters = {
      List: [],
      LifeTime: 10,
      Speed: 10,
      SpawnRate: 10,
      Sounds: null,
      SoundOut: null
    };
    this.azimutAim = 180;
    this.azimutPrecision = 20;
    (0, _renderInitializationScreens.default)(client, config, $container);
  }

  async start() {
    super.start();
    this.audioContext = new AudioContext();
    this.monsters.Sounds = await this.audioBufferLoader.load({
      'MonsterSound1': 'Audio/Monster1.mp3',
      'MonsterSound2': 'Audio/Monster2.mp3',
      'MonsterSound3': 'Audio/Monster3.mp3',
      'MonsterSound4': 'Audio/Monster4.mp3',
      'MonsterSound5': 'Audio/Monster5.mp3'
    }, true); // this.sound = this.audioContext.createBufferSource();

    this.monsters.SoundOut = new this.ambisonics.binDecoder(this.audioContext, 2); // this.encoder = new this.ambisonics.monoEncoder(this.audioContext, 2);
    // this.gain = this.audioContext.createGain();
    // this.gain.gain.setValueAtTime(1, 0);
    // this.sound.connect(this.encoder.in)
    // this.encoder.out.connect(this.binDecoder.in)

    this.monsters.SoundOut.out.connect(this.audioContext.destination); // this.gain.connect(this.audioContext.destination)
    // // subscribe to display loading state
    // this.audioBufferLoader.subscribe(() => this.render());
    // // subscribe to display loading state
    // this.filesystem.subscribe(() => this.loadSoundbank());
    // // init with current content
    // this.loadSoundbank();

    window.addEventListener('resize', () => this.render());
    this.render();
  }

  loadSoundbank() {
    const soundbankTree = this.filesystem.get('soundbank');
    const defObj = {};
    soundbankTree.children.forEach(leaf => {
      if (leaf.type === 'file') {
        defObj[leaf.name] = leaf.url;
      }
    });
    this.audioBufferLoader.load(defObj, true);
  }

  render() {
    // debounce with requestAnimationFrame
    window.cancelAnimationFrame(this.rafId);
    this.rafId = window.requestAnimationFrame(() => {
      (0, _litHtml.render)((0, _litHtml.html)`
        <div style="padding: 20px">
          <h1 style="margin: 20px 0">${this.client.type} [id: ${this.client.id}]</h1>
        </div>
        <div>
        <input type="button" id="beginButton" value="Validate"/>
        </div>
        <div>
        <input type="button" id="shootButton" value="Shoot"/>
        </div>
        <div>
        <input type="range" id="sliderAzimAim" min=0 max=360 value=${this.azimutAim}/>${this.azimutAim}
        </div>
      `, this.$container); // assign callbacks

      if (this.initialising) {
        this.beginButton = document.getElementById("beginButton");
        this.beginButton.addEventListener("click", () => {
          this.onBeginClicked();
        });
        var shootButton = document.getElementById("shootButton");
        shootButton.addEventListener("click", () => {
          this.onShootClicked();
        });
        var slider = document.getElementById("sliderAzimAim");
        slider.addEventListener("input", () => {
          this.azimutAim = slider.value;
          this.render(); // this.onAzimAimChange(slider.value);
        });
        this.initialising = false;
      }
    });
  }

  onBeginClicked() {
    // this.audioContext.resume();
    // this.sound.loop = true;
    // console.log(this.audio.Shot)
    // this.sound.buffer = this.audio.Shot;
    // this.sound.start(0);
    console.log("de");
    console.log(this);
    setInterval(() => {
      console.log(this.monsters);
      this.monsters.List.push(new _Monster.default(this.monsters, this.audioContext)); // console.log(this.monsterList)

      this.monsters.List[this.monsters.List.length - 1].start(); // this.monsterTemplate += 2;
    }, 1000 * this.monsters.SpawnRate);
  }

  onShootClicked() {
    var killing = false;
    var iterator = 0;

    while (iterator < this.monsters.List.length && this.monsters.List[iterator].Shoot(this.azimutAim) > this.azimutPrecision) {
      iterator += 1;
    }

    if (iterator < this.monsters.List.length) {
      console.log("You kill a monster");
      this.monsters.List[iterator].Die();
      this.monsters.List.splice(iterator, 1);
    } else {
      console.log("You miss your shoot !");
    }
  }

}

var _default = PlayerExperience;
exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJQbGF5ZXJFeHBlcmllbmNlIiwiQWJzdHJhY3RFeHBlcmllbmNlIiwiY29uc3RydWN0b3IiLCJjbGllbnQiLCJjb25maWciLCIkY29udGFpbmVyIiwicmFmSWQiLCJmaWxlc3lzdGVtIiwicmVxdWlyZSIsImF1ZGlvQnVmZmVyTG9hZGVyIiwiYW1iaXNvbmljcyIsImluaXRpYWxpc2luZyIsIm1vbnN0ZXJzIiwiTGlzdCIsIkxpZmVUaW1lIiwiU3BlZWQiLCJTcGF3blJhdGUiLCJTb3VuZHMiLCJTb3VuZE91dCIsImF6aW11dEFpbSIsImF6aW11dFByZWNpc2lvbiIsInJlbmRlckluaXRpYWxpemF0aW9uU2NyZWVucyIsInN0YXJ0IiwiYXVkaW9Db250ZXh0IiwiQXVkaW9Db250ZXh0IiwibG9hZCIsImJpbkRlY29kZXIiLCJvdXQiLCJjb25uZWN0IiwiZGVzdGluYXRpb24iLCJ3aW5kb3ciLCJhZGRFdmVudExpc3RlbmVyIiwicmVuZGVyIiwibG9hZFNvdW5kYmFuayIsInNvdW5kYmFua1RyZWUiLCJnZXQiLCJkZWZPYmoiLCJjaGlsZHJlbiIsImZvckVhY2giLCJsZWFmIiwidHlwZSIsIm5hbWUiLCJ1cmwiLCJjYW5jZWxBbmltYXRpb25GcmFtZSIsInJlcXVlc3RBbmltYXRpb25GcmFtZSIsImh0bWwiLCJpZCIsImJlZ2luQnV0dG9uIiwiZG9jdW1lbnQiLCJnZXRFbGVtZW50QnlJZCIsIm9uQmVnaW5DbGlja2VkIiwic2hvb3RCdXR0b24iLCJvblNob290Q2xpY2tlZCIsInNsaWRlciIsInZhbHVlIiwiY29uc29sZSIsImxvZyIsInNldEludGVydmFsIiwicHVzaCIsIk1vbnN0ZXIiLCJsZW5ndGgiLCJraWxsaW5nIiwiaXRlcmF0b3IiLCJTaG9vdCIsIkRpZSIsInNwbGljZSJdLCJzb3VyY2VzIjpbIlBsYXllckV4cGVyaWVuY2UuanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQWJzdHJhY3RFeHBlcmllbmNlIH0gZnJvbSAnQHNvdW5kd29ya3MvY29yZS9jbGllbnQnO1xuaW1wb3J0IHsgcmVuZGVyLCBodG1sIH0gZnJvbSAnbGl0LWh0bWwnO1xuaW1wb3J0IHJlbmRlckluaXRpYWxpemF0aW9uU2NyZWVucyBmcm9tICdAc291bmR3b3Jrcy90ZW1wbGF0ZS1oZWxwZXJzL2NsaWVudC9yZW5kZXItaW5pdGlhbGl6YXRpb24tc2NyZWVucy5qcyc7XG5cbmltcG9ydCBNb25zdGVyIGZyb20gJy4vTW9uc3Rlci5qcyc7XG5cbmNsYXNzIFBsYXllckV4cGVyaWVuY2UgZXh0ZW5kcyBBYnN0cmFjdEV4cGVyaWVuY2Uge1xuICBjb25zdHJ1Y3RvcihjbGllbnQsIGNvbmZpZyA9IHt9LCAkY29udGFpbmVyKSB7XG4gICAgc3VwZXIoY2xpZW50KTtcblxuICAgIHRoaXMuY29uZmlnID0gY29uZmlnO1xuICAgIHRoaXMuJGNvbnRhaW5lciA9ICRjb250YWluZXI7XG4gICAgdGhpcy5yYWZJZCA9IG51bGw7XG5cbiAgICB0aGlzLmZpbGVzeXN0ZW0gPSB0aGlzLnJlcXVpcmUoJ2ZpbGVzeXN0ZW0nKTtcbiAgICAvLyB0aGlzLmF1ZGlvQnVmZmVyTG9hZGVyID0gdGhpcy5yZXF1aXJlKCdhdWRpby1idWZmZXItbG9hZGVyJyk7XG5cblxuLy8gcmVxdWlyZSBwbHVnaW5zIGlmIG5lZWRlZFxuICAgIHRoaXMuYXVkaW9CdWZmZXJMb2FkZXIgPSB0aGlzLnJlcXVpcmUoJ2F1ZGlvLWJ1ZmZlci1sb2FkZXInKTtcbiAgICB0aGlzLmFtYmlzb25pY3MgPSByZXF1aXJlKCdhbWJpc29uaWNzJyk7XG5cbiAgICB0aGlzLmluaXRpYWxpc2luZyA9IHRydWU7XG5cbiAgICB0aGlzLm1vbnN0ZXJzID0ge1xuICAgICAgTGlzdDogW10sXG4gICAgICBMaWZlVGltZTogMTAsXG4gICAgICBTcGVlZDogMTAsXG4gICAgICBTcGF3blJhdGU6IDEwLFxuICAgICAgU291bmRzOiBudWxsLFxuICAgICAgU291bmRPdXQ6IG51bGwsXG4gICAgfVxuICAgIHRoaXMuYXppbXV0QWltID0gMTgwO1xuICAgIHRoaXMuYXppbXV0UHJlY2lzaW9uID0gMjA7XG5cblxuICAgIHJlbmRlckluaXRpYWxpemF0aW9uU2NyZWVucyhjbGllbnQsIGNvbmZpZywgJGNvbnRhaW5lcik7XG4gIH1cblxuICBhc3luYyBzdGFydCgpIHtcbiAgICBzdXBlci5zdGFydCgpO1xuXG5cbiAgICB0aGlzLmF1ZGlvQ29udGV4dCA9IG5ldyBBdWRpb0NvbnRleHQoKTtcblxuICAgIHRoaXMubW9uc3RlcnMuU291bmRzID0gYXdhaXQgdGhpcy5hdWRpb0J1ZmZlckxvYWRlci5sb2FkKHtcbiAgICAgICdNb25zdGVyU291bmQxJzogJ0F1ZGlvL01vbnN0ZXIxLm1wMycsXG4gICAgICAnTW9uc3RlclNvdW5kMic6ICdBdWRpby9Nb25zdGVyMi5tcDMnLFxuICAgICAgJ01vbnN0ZXJTb3VuZDMnOiAnQXVkaW8vTW9uc3RlcjMubXAzJyxcbiAgICAgICdNb25zdGVyU291bmQ0JzogJ0F1ZGlvL01vbnN0ZXI0Lm1wMycsXG4gICAgICAnTW9uc3RlclNvdW5kNSc6ICdBdWRpby9Nb25zdGVyNS5tcDMnLFxuICAgIH0sIHRydWUpO1xuXG4gICAgLy8gdGhpcy5zb3VuZCA9IHRoaXMuYXVkaW9Db250ZXh0LmNyZWF0ZUJ1ZmZlclNvdXJjZSgpO1xuICAgIHRoaXMubW9uc3RlcnMuU291bmRPdXQgPSBuZXcgdGhpcy5hbWJpc29uaWNzLmJpbkRlY29kZXIodGhpcy5hdWRpb0NvbnRleHQsIDIpO1xuICAgIC8vIHRoaXMuZW5jb2RlciA9IG5ldyB0aGlzLmFtYmlzb25pY3MubW9ub0VuY29kZXIodGhpcy5hdWRpb0NvbnRleHQsIDIpO1xuICAgIC8vIHRoaXMuZ2FpbiA9IHRoaXMuYXVkaW9Db250ZXh0LmNyZWF0ZUdhaW4oKTtcblxuICAgIC8vIHRoaXMuZ2Fpbi5nYWluLnNldFZhbHVlQXRUaW1lKDEsIDApO1xuXG4gICAgLy8gdGhpcy5zb3VuZC5jb25uZWN0KHRoaXMuZW5jb2Rlci5pbilcbiAgICAvLyB0aGlzLmVuY29kZXIub3V0LmNvbm5lY3QodGhpcy5iaW5EZWNvZGVyLmluKVxuICAgIHRoaXMubW9uc3RlcnMuU291bmRPdXQub3V0LmNvbm5lY3QodGhpcy5hdWRpb0NvbnRleHQuZGVzdGluYXRpb24pXG4gICAgLy8gdGhpcy5nYWluLmNvbm5lY3QodGhpcy5hdWRpb0NvbnRleHQuZGVzdGluYXRpb24pXG5cblxuICAgIC8vIC8vIHN1YnNjcmliZSB0byBkaXNwbGF5IGxvYWRpbmcgc3RhdGVcbiAgICAvLyB0aGlzLmF1ZGlvQnVmZmVyTG9hZGVyLnN1YnNjcmliZSgoKSA9PiB0aGlzLnJlbmRlcigpKTtcbiAgICAvLyAvLyBzdWJzY3JpYmUgdG8gZGlzcGxheSBsb2FkaW5nIHN0YXRlXG4gICAgLy8gdGhpcy5maWxlc3lzdGVtLnN1YnNjcmliZSgoKSA9PiB0aGlzLmxvYWRTb3VuZGJhbmsoKSk7XG5cbiAgICAvLyAvLyBpbml0IHdpdGggY3VycmVudCBjb250ZW50XG4gICAgLy8gdGhpcy5sb2FkU291bmRiYW5rKCk7XG5cbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgKCkgPT4gdGhpcy5yZW5kZXIoKSk7XG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfVxuXG4gIGxvYWRTb3VuZGJhbmsoKSB7XG4gICAgY29uc3Qgc291bmRiYW5rVHJlZSA9IHRoaXMuZmlsZXN5c3RlbS5nZXQoJ3NvdW5kYmFuaycpO1xuICAgIGNvbnN0IGRlZk9iaiA9IHt9O1xuXG4gICAgc291bmRiYW5rVHJlZS5jaGlsZHJlbi5mb3JFYWNoKGxlYWYgPT4ge1xuICAgICAgaWYgKGxlYWYudHlwZSA9PT0gJ2ZpbGUnKSB7XG4gICAgICAgIGRlZk9ialtsZWFmLm5hbWVdID0gbGVhZi51cmw7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICB0aGlzLmF1ZGlvQnVmZmVyTG9hZGVyLmxvYWQoZGVmT2JqLCB0cnVlKTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICAvLyBkZWJvdW5jZSB3aXRoIHJlcXVlc3RBbmltYXRpb25GcmFtZVxuICAgIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSh0aGlzLnJhZklkKTtcblxuICAgIHRoaXMucmFmSWQgPSB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgIHJlbmRlcihodG1sYFxuICAgICAgICA8ZGl2IHN0eWxlPVwicGFkZGluZzogMjBweFwiPlxuICAgICAgICAgIDxoMSBzdHlsZT1cIm1hcmdpbjogMjBweCAwXCI+JHt0aGlzLmNsaWVudC50eXBlfSBbaWQ6ICR7dGhpcy5jbGllbnQuaWR9XTwvaDE+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2PlxuICAgICAgICA8aW5wdXQgdHlwZT1cImJ1dHRvblwiIGlkPVwiYmVnaW5CdXR0b25cIiB2YWx1ZT1cIlZhbGlkYXRlXCIvPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdj5cbiAgICAgICAgPGlucHV0IHR5cGU9XCJidXR0b25cIiBpZD1cInNob290QnV0dG9uXCIgdmFsdWU9XCJTaG9vdFwiLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXY+XG4gICAgICAgIDxpbnB1dCB0eXBlPVwicmFuZ2VcIiBpZD1cInNsaWRlckF6aW1BaW1cIiBtaW49MCBtYXg9MzYwIHZhbHVlPSR7dGhpcy5hemltdXRBaW19Lz4ke3RoaXMuYXppbXV0QWltfVxuICAgICAgICA8L2Rpdj5cbiAgICAgIGAsIHRoaXMuJGNvbnRhaW5lcik7XG5cbiAgICAgIC8vIGFzc2lnbiBjYWxsYmFja3NcbiAgICAgIGlmICh0aGlzLmluaXRpYWxpc2luZykge1xuICAgICAgICB0aGlzLmJlZ2luQnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJiZWdpbkJ1dHRvblwiKTtcbiAgICAgICAgdGhpcy5iZWdpbkJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgICAgICAgIHRoaXMub25CZWdpbkNsaWNrZWQoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdmFyIHNob290QnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzaG9vdEJ1dHRvblwiKTtcbiAgICAgICAgc2hvb3RCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgICAgICAgICB0aGlzLm9uU2hvb3RDbGlja2VkKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHZhciBzbGlkZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNsaWRlckF6aW1BaW1cIik7XG4gICAgICAgIHNsaWRlci5hZGRFdmVudExpc3RlbmVyKFwiaW5wdXRcIiwgKCkgPT4ge1xuICAgICAgICAgIHRoaXMuYXppbXV0QWltID0gc2xpZGVyLnZhbHVlO1xuICAgICAgICAgIHRoaXMucmVuZGVyKCk7XG4gICAgICAgICAgLy8gdGhpcy5vbkF6aW1BaW1DaGFuZ2Uoc2xpZGVyLnZhbHVlKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuaW5pdGlhbGlzaW5nID0gZmFsc2U7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBvbkJlZ2luQ2xpY2tlZCgpIHtcbiAgICAvLyB0aGlzLmF1ZGlvQ29udGV4dC5yZXN1bWUoKTtcblxuICAgIC8vIHRoaXMuc291bmQubG9vcCA9IHRydWU7XG4gICAgLy8gY29uc29sZS5sb2codGhpcy5hdWRpby5TaG90KVxuICAgIC8vIHRoaXMuc291bmQuYnVmZmVyID0gdGhpcy5hdWRpby5TaG90O1xuICAgIC8vIHRoaXMuc291bmQuc3RhcnQoMCk7XG5cbiAgICBjb25zb2xlLmxvZyhcImRlXCIpXG4gICAgY29uc29sZS5sb2codGhpcylcbiAgICBzZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgICBjb25zb2xlLmxvZyh0aGlzLm1vbnN0ZXJzKVxuICAgICAgdGhpcy5tb25zdGVycy5MaXN0LnB1c2gobmV3IE1vbnN0ZXIodGhpcy5tb25zdGVycywgdGhpcy5hdWRpb0NvbnRleHQpKTtcbiAgICAgIC8vIGNvbnNvbGUubG9nKHRoaXMubW9uc3Rlckxpc3QpXG4gICAgICB0aGlzLm1vbnN0ZXJzLkxpc3RbdGhpcy5tb25zdGVycy5MaXN0Lmxlbmd0aC0xXS5zdGFydCgpXG4gICAgICAvLyB0aGlzLm1vbnN0ZXJUZW1wbGF0ZSArPSAyO1xuICAgIH0sIDEwMDAqdGhpcy5tb25zdGVycy5TcGF3blJhdGUpXG4gIH1cblxuICBvblNob290Q2xpY2tlZCgpIHtcbiAgICB2YXIga2lsbGluZyA9IGZhbHNlO1xuICAgIHZhciBpdGVyYXRvciA9IDA7XG4gICAgd2hpbGUgKChpdGVyYXRvciA8IHRoaXMubW9uc3RlcnMuTGlzdC5sZW5ndGgpICYmICh0aGlzLm1vbnN0ZXJzLkxpc3RbaXRlcmF0b3JdLlNob290KHRoaXMuYXppbXV0QWltKSA+IHRoaXMuYXppbXV0UHJlY2lzaW9uKSkge1xuICAgICAgaXRlcmF0b3IgKz0gMVxuICAgIH1cbiAgICBpZiAoaXRlcmF0b3IgPCB0aGlzLm1vbnN0ZXJzLkxpc3QubGVuZ3RoKSB7XG4gICAgICBjb25zb2xlLmxvZyhcIllvdSBraWxsIGEgbW9uc3RlclwiKVxuICAgICAgdGhpcy5tb25zdGVycy5MaXN0W2l0ZXJhdG9yXS5EaWUoKTtcbiAgICAgIHRoaXMubW9uc3RlcnMuTGlzdC5zcGxpY2UoaXRlcmF0b3IsIDEpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIGNvbnNvbGUubG9nKFwiWW91IG1pc3MgeW91ciBzaG9vdCAhXCIpXG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFBsYXllckV4cGVyaWVuY2U7XG4iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFDQTs7QUFFQTs7OztBQUVBLE1BQU1BLGdCQUFOLFNBQStCQywwQkFBL0IsQ0FBa0Q7RUFDaERDLFdBQVcsQ0FBQ0MsTUFBRCxFQUFTQyxNQUFNLEdBQUcsRUFBbEIsRUFBc0JDLFVBQXRCLEVBQWtDO0lBQzNDLE1BQU1GLE1BQU47SUFFQSxLQUFLQyxNQUFMLEdBQWNBLE1BQWQ7SUFDQSxLQUFLQyxVQUFMLEdBQWtCQSxVQUFsQjtJ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