////
// Monster
///

class Monster {

	constructor (data, audioContext) {
		this.azimuts = [];
		this.azimutSpeed = data.Speed;

		this.yell = audioContext.createBufferSource();
		this.yell.loop = true;
		this.yell.buffer = data.Sounds["MonsterSound" + Math.ceil(Math.random()*(Object.keys(data.Sounds).length))];
		
		this.lifeTime = data.LifeTime;
		this.currentAzimutIndex = null;
		this.moveId = null;

		this.ambisonics = require('ambisonics');
		this.gain = audioContext.createGain();

		this.encoder = new this.ambisonics.monoEncoder(audioContext, 2);
		this.encoder.out.connect(data.SoundOut.in);

		this.disconnect = (() => function() {console.log("devant")})		

	}

	async start () {
		// console.log("go")
		this.gain.gain.setValueAtTime(0.5, 0);

		this.yell.connect(this.gain)
		this.gain.connect(this.encoder.in)

		this.azimuts.push(Math.floor(Math.random()*361))
		this.previousAzimut = this.azimuts[0];
		// console.log("bonjour")
		// console.log(this.lifeTime)
		for (let i = 1; i <= this.lifeTime; i++) {
			this.azimuts.push((this.previousAzimut + Math.floor(Math.random()*(2*this.azimutSpeed + 1)) - this.azimutSpeed + 360)%360);
			this.previousAzimut = this.azimuts[i];
			// console.log(this.azimuts);
			// console.log("bonsoir");
		}
		this.currentAzimutIndex = 0;
		// this.Gains.gain.linearRampToValueAtTime(1, 0);
		// console.log("er")
		this.yell.start();
		this.moveId = setInterval(() => this.UpdatePos(), 1000);
	}

	UpdatePos() {
		if(this.currentAzimutIndex == this.lifeTime) {
			clearInterval(this.moveId);
			this.KillPlayer();
			return;
		}
		this.encoder.azim = this.azimuts[this.currentAzimutIndex];
		// console.log(this.currentAzimutIndex)
		this.encoder.updateGains();
		this.currentAzimutIndex += 1;
		console.log(this.azimuts[this.currentAzimutIndex])


      	// this.Sources[i-1].connect(this.gain)
      	// this.gain.connect(Encoders[i-1].in);

      	// this.Encoders[i-1].out.connect(this.BinDecoders.in);
      	// this.binDecoder.connect(this.audioContext.destination);
	}

	Shoot(azimutShootAngle) {
		return ((Math.abs((this.azimuts[this.currentAzimutIndex] - azimutShootAngle)) + 360)%360);
	}

	Die() {
		clearInterval(this.moveId);
		this.disconnect()
		console.log("normalement c'est devant")
		// this.encoder.out.disconnect(data.SoundOut.in);
		// console.log("Le monstre est mort");
		return;
	}

	KillPlayer() {
		console.log("You die")
	}
}

export default Monster;
