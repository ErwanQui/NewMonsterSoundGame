"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

////
// Monster
///
class Monster {
  constructor(data, audioContext) {
    this.azimuts = [];
    this.azimutSpeed = data.Speed;
    this.yell = audioContext.createBufferSource();
    this.yell.loop = true;
    this.yell.buffer = data.Scream["MonsterSound" + Math.ceil(Math.random() * Object.keys(data.Scream).length)];
    this.lifeTime = data.LifeTime;
    this.currentAzimutIndex = null;
    this.moveId = null;
    this.ambisonics = require('ambisonics');
    this.gain = audioContext.createGain();
    this.encoder = new this.ambisonics.monoEncoder(audioContext, 2);
    this.encoder.out.connect(data.SoundOut.in);

    this.disconnect = function () {
      this.yell.stop();
      this.encoder.out.disconnect(data.SoundOut.in);
    };
  }

  async start() {
    // console.log("go")
    this.gain.gain.setValueAtTime(0.5, 0);
    this.yell.connect(this.gain);
    this.gain.connect(this.encoder.in);
    this.azimuts.push(Math.floor(Math.random() * 361));
    this.previousAzimut = this.azimuts[0]; // console.log("bonjour")
    // console.log(this.lifeTime)

    for (let i = 1; i <= this.lifeTime; i++) {
      this.azimuts.push((this.previousAzimut + Math.floor(Math.random() * (2 * this.azimutSpeed + 1)) - this.azimutSpeed + 360) % 360);
      this.previousAzimut = this.azimuts[i]; // console.log(this.azimuts);
      // console.log("bonsoir");
    }

    this.currentAzimutIndex = 0; // this.Gains.gain.linearRampToValueAtTime(1, 0);
    // console.log("er")

    this.yell.start();
    this.moveId = setInterval(() => this.UpdatePos(), 1000);
  }

  UpdatePos() {
    if (this.currentAzimutIndex == this.lifeTime) {
      clearInterval(this.moveId);
      this.KillPlayer();
      return;
    }

    this.encoder.azim = this.azimuts[this.currentAzimutIndex]; // console.log(this.currentAzimutIndex)

    this.encoder.updateGains();
    this.currentAzimutIndex += 1;
    console.log(this.azimuts[this.currentAzimutIndex]);
  }

  Shoot(azimutShootAngle) {
    var angleDifference = Math.abs(this.azimuts[this.currentAzimutIndex] - azimutShootAngle);
    return Math.min(angleDifference, 360 - angleDifference);
  }

  Die() {
    clearInterval(this.moveId);
    this.disconnect();
    console.log("normalement c'est devant"); // this.encoder.out.disconnect(data.SoundOut.in);
    // console.log("Le monstre est mort");

    return;
  }

  KillPlayer() {
    console.log("You die");
  }

}

var _default = Monster;
exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJNb25zdGVyIiwiY29uc3RydWN0b3IiLCJkYXRhIiwiYXVkaW9Db250ZXh0IiwiYXppbXV0cyIsImF6aW11dFNwZWVkIiwiU3BlZWQiLCJ5ZWxsIiwiY3JlYXRlQnVmZmVyU291cmNlIiwibG9vcCIsImJ1ZmZlciIsIlNjcmVhbSIsIk1hdGgiLCJjZWlsIiwicmFuZG9tIiwiT2JqZWN0Iiwia2V5cyIsImxlbmd0aCIsImxpZmVUaW1lIiwiTGlmZVRpbWUiLCJjdXJyZW50QXppbXV0SW5kZXgiLCJtb3ZlSWQiLCJhbWJpc29uaWNzIiwicmVxdWlyZSIsImdhaW4iLCJjcmVhdGVHYWluIiwiZW5jb2RlciIsIm1vbm9FbmNvZGVyIiwib3V0IiwiY29ubmVjdCIsIlNvdW5kT3V0IiwiaW4iLCJkaXNjb25uZWN0Iiwic3RvcCIsInN0YXJ0Iiwic2V0VmFsdWVBdFRpbWUiLCJwdXNoIiwiZmxvb3IiLCJwcmV2aW91c0F6aW11dCIsImkiLCJzZXRJbnRlcnZhbCIsIlVwZGF0ZVBvcyIsImNsZWFySW50ZXJ2YWwiLCJLaWxsUGxheWVyIiwiYXppbSIsInVwZGF0ZUdhaW5zIiwiY29uc29sZSIsImxvZyIsIlNob290IiwiYXppbXV0U2hvb3RBbmdsZSIsImFuZ2xlRGlmZmVyZW5jZSIsImFicyIsIm1pbiIsIkRpZSJdLCJzb3VyY2VzIjpbIk1vbnN0ZXIuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8vL1xuLy8gTW9uc3RlclxuLy8vXG5cbmNsYXNzIE1vbnN0ZXIge1xuXG5cdGNvbnN0cnVjdG9yIChkYXRhLCBhdWRpb0NvbnRleHQpIHtcblx0XHR0aGlzLmF6aW11dHMgPSBbXTtcblx0XHR0aGlzLmF6aW11dFNwZWVkID0gZGF0YS5TcGVlZDtcblxuXHRcdHRoaXMueWVsbCA9IGF1ZGlvQ29udGV4dC5jcmVhdGVCdWZmZXJTb3VyY2UoKTtcblx0XHR0aGlzLnllbGwubG9vcCA9IHRydWU7XG5cdFx0dGhpcy55ZWxsLmJ1ZmZlciA9IGRhdGEuU2NyZWFtW1wiTW9uc3RlclNvdW5kXCIgKyBNYXRoLmNlaWwoTWF0aC5yYW5kb20oKSooT2JqZWN0LmtleXMoZGF0YS5TY3JlYW0pLmxlbmd0aCkpXTtcblx0XHRcblx0XHR0aGlzLmxpZmVUaW1lID0gZGF0YS5MaWZlVGltZTtcblx0XHR0aGlzLmN1cnJlbnRBemltdXRJbmRleCA9IG51bGw7XG5cdFx0dGhpcy5tb3ZlSWQgPSBudWxsO1xuXG5cdFx0dGhpcy5hbWJpc29uaWNzID0gcmVxdWlyZSgnYW1iaXNvbmljcycpO1xuXHRcdHRoaXMuZ2FpbiA9IGF1ZGlvQ29udGV4dC5jcmVhdGVHYWluKCk7XG5cblx0XHR0aGlzLmVuY29kZXIgPSBuZXcgdGhpcy5hbWJpc29uaWNzLm1vbm9FbmNvZGVyKGF1ZGlvQ29udGV4dCwgMik7XG5cdFx0dGhpcy5lbmNvZGVyLm91dC5jb25uZWN0KGRhdGEuU291bmRPdXQuaW4pO1xuXG5cdFx0dGhpcy5kaXNjb25uZWN0ID0gZnVuY3Rpb24oKSB7XG5cdFx0XHR0aGlzLnllbGwuc3RvcCgpO1xuXHRcdFx0dGhpcy5lbmNvZGVyLm91dC5kaXNjb25uZWN0KGRhdGEuU291bmRPdXQuaW4pO1xuXHRcdH1cdFx0XG5cblx0fVxuXG5cdGFzeW5jIHN0YXJ0ICgpIHtcblx0XHQvLyBjb25zb2xlLmxvZyhcImdvXCIpXG5cdFx0dGhpcy5nYWluLmdhaW4uc2V0VmFsdWVBdFRpbWUoMC41LCAwKTtcblxuXHRcdHRoaXMueWVsbC5jb25uZWN0KHRoaXMuZ2Fpbilcblx0XHR0aGlzLmdhaW4uY29ubmVjdCh0aGlzLmVuY29kZXIuaW4pXG5cblx0XHR0aGlzLmF6aW11dHMucHVzaChNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkqMzYxKSlcblx0XHR0aGlzLnByZXZpb3VzQXppbXV0ID0gdGhpcy5hemltdXRzWzBdO1xuXHRcdC8vIGNvbnNvbGUubG9nKFwiYm9uam91clwiKVxuXHRcdC8vIGNvbnNvbGUubG9nKHRoaXMubGlmZVRpbWUpXG5cdFx0Zm9yIChsZXQgaSA9IDE7IGkgPD0gdGhpcy5saWZlVGltZTsgaSsrKSB7XG5cdFx0XHR0aGlzLmF6aW11dHMucHVzaCgodGhpcy5wcmV2aW91c0F6aW11dCArIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSooMip0aGlzLmF6aW11dFNwZWVkICsgMSkpIC0gdGhpcy5hemltdXRTcGVlZCArIDM2MCklMzYwKTtcblx0XHRcdHRoaXMucHJldmlvdXNBemltdXQgPSB0aGlzLmF6aW11dHNbaV07XG5cdFx0XHQvLyBjb25zb2xlLmxvZyh0aGlzLmF6aW11dHMpO1xuXHRcdFx0Ly8gY29uc29sZS5sb2coXCJib25zb2lyXCIpO1xuXHRcdH1cblx0XHR0aGlzLmN1cnJlbnRBemltdXRJbmRleCA9IDA7XG5cdFx0Ly8gdGhpcy5HYWlucy5nYWluLmxpbmVhclJhbXBUb1ZhbHVlQXRUaW1lKDEsIDApO1xuXHRcdC8vIGNvbnNvbGUubG9nKFwiZXJcIilcblx0XHR0aGlzLnllbGwuc3RhcnQoKTtcblx0XHR0aGlzLm1vdmVJZCA9IHNldEludGVydmFsKCgpID0+IHRoaXMuVXBkYXRlUG9zKCksIDEwMDApO1xuXHR9XG5cblx0VXBkYXRlUG9zKCkge1xuXHRcdGlmKHRoaXMuY3VycmVudEF6aW11dEluZGV4ID09IHRoaXMubGlmZVRpbWUpIHtcblx0XHRcdGNsZWFySW50ZXJ2YWwodGhpcy5tb3ZlSWQpO1xuXHRcdFx0dGhpcy5LaWxsUGxheWVyKCk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXHRcdHRoaXMuZW5jb2Rlci5hemltID0gdGhpcy5hemltdXRzW3RoaXMuY3VycmVudEF6aW11dEluZGV4XTtcblx0XHQvLyBjb25zb2xlLmxvZyh0aGlzLmN1cnJlbnRBemltdXRJbmRleClcblx0XHR0aGlzLmVuY29kZXIudXBkYXRlR2FpbnMoKTtcblx0XHR0aGlzLmN1cnJlbnRBemltdXRJbmRleCArPSAxO1xuXHRcdGNvbnNvbGUubG9nKHRoaXMuYXppbXV0c1t0aGlzLmN1cnJlbnRBemltdXRJbmRleF0pXG5cblx0fVxuXG5cdFNob290KGF6aW11dFNob290QW5nbGUpIHtcblx0XHR2YXIgYW5nbGVEaWZmZXJlbmNlID0gTWF0aC5hYnModGhpcy5hemltdXRzW3RoaXMuY3VycmVudEF6aW11dEluZGV4XSAtIGF6aW11dFNob290QW5nbGUpO1xuXHRcdHJldHVybiBNYXRoLm1pbihhbmdsZURpZmZlcmVuY2UsIDM2MCAtIGFuZ2xlRGlmZmVyZW5jZSk7XG5cdH1cblxuXHREaWUoKSB7XG5cdFx0Y2xlYXJJbnRlcnZhbCh0aGlzLm1vdmVJZCk7XG5cdFx0dGhpcy5kaXNjb25uZWN0KClcblx0XHRjb25zb2xlLmxvZyhcIm5vcm1hbGVtZW50IGMnZXN0IGRldmFudFwiKVxuXHRcdC8vIHRoaXMuZW5jb2Rlci5vdXQuZGlzY29ubmVjdChkYXRhLlNvdW5kT3V0LmluKTtcblx0XHQvLyBjb25zb2xlLmxvZyhcIkxlIG1vbnN0cmUgZXN0IG1vcnRcIik7XG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0S2lsbFBsYXllcigpIHtcblx0XHRjb25zb2xlLmxvZyhcIllvdSBkaWVcIilcblx0fVxufVxuXG5leHBvcnQgZGVmYXVsdCBNb25zdGVyO1xuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBRUEsTUFBTUEsT0FBTixDQUFjO0VBRWJDLFdBQVcsQ0FBRUMsSUFBRixFQUFRQyxZQUFSLEVBQXNCO0lBQ2hDLEtBQUtDLE9BQUwsR0FBZSxFQUFmO0lBQ0EsS0FBS0MsV0FBTCxHQUFtQkgsSUFBSSxDQUFDSSxLQUF4QjtJQUVBLEtBQUtDLElBQUwsR0FBWUosWUFBWSxDQUFDSyxrQkFBYixFQUFaO0lBQ0EsS0FBS0QsSUFBTCxDQUFVRSxJQUFWLEdBQWlCLElBQWpCO0lBQ0EsS0FBS0YsSUFBTCxDQUFVRyxNQUFWLEdBQW1CUixJQUFJLENBQUNTLE1BQUwsQ0FBWSxpQkFBaUJDLElBQUksQ0FBQ0MsSUFBTCxDQUFVRCxJQUFJLENBQUNFLE1BQUwsS0FBZUMsTUFBTSxDQUFDQyxJQUFQLENBQVlkLElBQUksQ0FBQ1MsTUFBakIsRUFBeUJNLE1BQWxELENBQTdCLENBQW5C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