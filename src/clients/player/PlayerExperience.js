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
    console.log(this.audioBufferLoader)
    this.initialising = true;
    this.order = 3;


    this.audioContext = new AudioContext();

    this.monsters = {
      List: [],
      LifeTime: 10,
      Speed: 10,
      SpawnRate: 10,
      Scream: null,
      OutToRotator: null,
    }
    this.azimutAim = 180;
    this.azimutPrecision = 180;


    this.playerGain = this.audioContext.createGain();
    this.playerBinDecoder = new this.ambisonics.monoEncoder(this.audioContext, this.order);

    renderInitializationScreens(client, config, $container);
  }

  async start() {
    super.start();

    this.monsters.Scream = await this.audioBufferLoader.load({
      'MonsterSound1': 'Audio/Monster1.mp3',
      'MonsterSound2': 'Audio/Monster2.mp3',
      'MonsterSound3': 'Audio/Monster3.mp3',
      'MonsterSound4': 'Audio/Monster4.mp3',
      'MonsterSound5': 'Audio/Monster5.mp3',
    }, true);

    this.soundBank = await this.audioBufferLoader.load({
      'MonsterDie':'Audio/MonsterDie.wav',
      'Shoot': 'Audio/Kill.mp3',
    }, true);

    this.monsters.OutToRotator = new this.ambisonics.Rotator(this.audioContext, this.order);

    this.playerGain.connect(this.audioContext.destination);
    this.monsters.OutToRotator.out.connect(this.playerBinDecoder.in)
    this.playerBinDecoder.out.connect(this.audioContext.destination)

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
        <input type="button" id="shootButton" value="Shoot" style="width: 200px; height: 200px;"/>
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
    this.Play(this.soundBank.Shoot);
    while ((iterator < this.monsters.List.length) && (this.monsters.List[iterator].Shoot(this.azimutAim) > this.azimutPrecision)) {
      iterator += 1
    }
    if (iterator < this.monsters.List.length) {
      console.log("You kill a monster")
      this.Play(this.soundBank.MonsterDie);
      this.monsters.List[iterator].Die();
      this.monsters.List.splice(iterator, 1);
      console.log(this.monsters.List)
    }
    else {
      console.log("You miss your shoot");
      this.monsters.List = [];
    }
  }

  Play(buffer) {
    var Sound = this.audioContext.createBufferSource()
    Sound.loop = false;
    Sound.buffer = buffer;
    Sound.connect(this.playerGain)

    Sound.addEventListener('ended', () => {Sound.disconnect(this.playerGain);})

    Sound.start();
  }
}

export default PlayerExperience;
