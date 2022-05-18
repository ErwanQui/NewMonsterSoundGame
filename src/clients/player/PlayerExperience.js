import { AbstractExperience } from '@soundworks/core/client';
import { render, html } from 'lit-html';
import renderInitializationScreens from '@soundworks/template-helpers/client/render-initialization-screens.js';

import Monster from './Monster.js';

class PlayerExperience extends AbstractExperience {
  constructor(client, config = {}, $container) {
    super(client);

    this.config = config;
    this.$container = $container;
    this.rafId = null;

    this.filesystem = this.require('filesystem');
    // this.audioBufferLoader = this.require('audio-buffer-loader');


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
      SoundOut: null,
    }
    this.azimutAim = 180;
    this.azimutPrecision = 20;


    renderInitializationScreens(client, config, $container);
  }

  async start() {
    super.start();


    this.audioContext = new AudioContext();

    this.monsters.Sounds = await this.audioBufferLoader.load({
      'MonsterSound1': 'Audio/Monster1.mp3',
      'MonsterSound2': 'Audio/Monster2.mp3',
      'MonsterSound3': 'Audio/Monster3.mp3',
      'MonsterSound4': 'Audio/Monster4.mp3',
      'MonsterSound5': 'Audio/Monster5.mp3',
    }, true);

    // this.sound = this.audioContext.createBufferSource();
    this.monsters.SoundOut = new this.ambisonics.binDecoder(this.audioContext, 2);
    // this.encoder = new this.ambisonics.monoEncoder(this.audioContext, 2);
    // this.gain = this.audioContext.createGain();

    // this.gain.gain.setValueAtTime(1, 0);

    // this.sound.connect(this.encoder.in)
    // this.encoder.out.connect(this.binDecoder.in)
    this.monsters.SoundOut.out.connect(this.audioContext.destination)
    // this.gain.connect(this.audioContext.destination)


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
      render(html`
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
      `, this.$container);

      // assign callbacks
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
          this.render();
          // this.onAzimAimChange(slider.value);
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

    console.log("de")
    console.log(this)
    setInterval(() => {
      console.log(this.monsters)
      this.monsters.List.push(new Monster(this.monsters, this.audioContext));
      // console.log(this.monsterList)
      this.monsters.List[this.monsters.List.length-1].start()
      // this.monsterTemplate += 2;
    }, 1000*this.monsters.SpawnRate)
  }

  onShootClicked() {
    var killing = false;
    var iterator = 0;
    while ((iterator < this.monsters.List.length) && (this.monsters.List[iterator].Shoot(this.azimutAim) > this.azimutPrecision)) {
      iterator += 1
    }
    if (iterator < this.monsters.List.length) {
      console.log("You kill a monster")
      this.monsters.List[iterator].Die();
      this.monsters.List.splice(iterator, 1);
    }
    else {
      console.log("You miss your shoot !")
    }
  }
}

export default PlayerExperience;
