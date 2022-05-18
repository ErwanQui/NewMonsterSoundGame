"use strict";

require("core-js/stable");

require("regenerator-runtime/runtime");

var _client = require("@soundworks/core/client");

var _initQos = _interopRequireDefault(require("@soundworks/template-helpers/client/init-qos.js"));

var _client2 = _interopRequireDefault(require("@soundworks/plugin-filesystem/client"));

var _client3 = _interopRequireDefault(require("@soundworks/plugin-audio-buffer-loader/client"));

var _PlayerExperience = _interopRequireDefault(require("./PlayerExperience.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import pluginAudioBufferLoaderFactory from '@soundworks/plugin-audio-buffer-loader/client';
// Import plugin
const config = window.soundworksConfig; // store experiences of emulated clients

const experiences = new Set();

async function launch($container, index) {
  try {
    const client = new _client.Client(); // -------------------------------------------------------------------
    // register plugins
    // -------------------------------------------------------------------

    client.pluginManager.register('filesystem', _client2.default, {}, []);
    client.pluginManager.register('audio-buffer-loader', _client3.default, {
      data: {
        'Shoot': 'Audio/Kill.mp3',
        'MonsterSound1': 'Audio/Monster1.mp3',
        'MonsterSound2': 'Audio/Monster2.mp3',
        'MonsterSound3': 'Audio/Monster3.mp3',
        'MonsterSound4': 'Audio/Monster4.mp3',
        'MonsterSound5': 'Audio/Monster5.mp3',
        'MonsterDie': 'Audio/MonsterDie.wav'
      }
    }, []); // -------------------------------------------------------------------
    // launch application
    // -------------------------------------------------------------------

    await client.init(config);
    (0, _initQos.default)(client);
    const experience = new _PlayerExperience.default(client, config, $container); // store exprience for emulated clients

    experiences.add(experience);
    document.body.classList.remove('loading'); // start all the things

    await client.start();
    experience.start();
    return Promise.resolve();
  } catch (err) {
    console.error(err);
  }
} // -------------------------------------------------------------------
// bootstrapping
// -------------------------------------------------------------------


const $container = document.querySelector('#__soundworks-container');
const searchParams = new URLSearchParams(window.location.search); // enable instanciation of multiple clients in the same page to facilitate
// development and testing (be careful in production...)

const numEmulatedClients = parseInt(searchParams.get('emulate')) || 1; // special logic for emulated clients (1 click to rule them all)

if (numEmulatedClients > 1) {
  for (let i = 0; i < numEmulatedClients; i++) {
    const $div = document.createElement('div');
    $div.classList.add('emulate');
    $container.appendChild($div);
    launch($div, i);
  }

  const $initPlatformBtn = document.createElement('div');
  $initPlatformBtn.classList.add('init-platform');
  $initPlatformBtn.textContent = 'resume all';

  function initPlatforms(e) {
    experiences.forEach(experience => {
      if (experience.platform) {
        experience.platform.onUserGesture(e);
      }
    });
    $initPlatformBtn.removeEventListener('touchend', initPlatforms);
    $initPlatformBtn.removeEventListener('mouseup', initPlatforms);
    $initPlatformBtn.remove();
  }

  $initPlatformBtn.addEventListener('touchend', initPlatforms);
  $initPlatformBtn.addEventListener('mouseup', initPlatforms);
  $container.appendChild($initPlatformBtn);
} else {
  launch($container, 0);
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJjb25maWciLCJ3aW5kb3ciLCJzb3VuZHdvcmtzQ29uZmlnIiwiZXhwZXJpZW5jZXMiLCJTZXQiLCJsYXVuY2giLCIkY29udGFpbmVyIiwiaW5kZXgiLCJjbGllbnQiLCJDbGllbnQiLCJwbHVnaW5NYW5hZ2VyIiwicmVnaXN0ZXIiLCJwbHVnaW5GaWxlc3lzdGVtRmFjdG9yeSIsInBsdWdpbkF1ZGlvQnVmZmVyTG9hZGVyRmFjdG9yeSIsImRhdGEiLCJpbml0IiwiaW5pdFFvUyIsImV4cGVyaWVuY2UiLCJQbGF5ZXJFeHBlcmllbmNlIiwiYWRkIiwiZG9jdW1lbnQiLCJib2R5IiwiY2xhc3NMaXN0IiwicmVtb3ZlIiwic3RhcnQiLCJQcm9taXNlIiwicmVzb2x2ZSIsImVyciIsImNvbnNvbGUiLCJlcnJvciIsInF1ZXJ5U2VsZWN0b3IiLCJzZWFyY2hQYXJhbXMiLCJVUkxTZWFyY2hQYXJhbXMiLCJsb2NhdGlvbiIsInNlYXJjaCIsIm51bUVtdWxhdGVkQ2xpZW50cyIsInBhcnNlSW50IiwiZ2V0IiwiaSIsIiRkaXYiLCJjcmVhdGVFbGVtZW50IiwiYXBwZW5kQ2hpbGQiLCIkaW5pdFBsYXRmb3JtQnRuIiwidGV4dENvbnRlbnQiLCJpbml0UGxhdGZvcm1zIiwiZSIsImZvckVhY2giLCJwbGF0Zm9ybSIsIm9uVXNlckdlc3R1cmUiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwiYWRkRXZlbnRMaXN0ZW5lciJdLCJzb3VyY2VzIjpbImluZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAnY29yZS1qcy9zdGFibGUnO1xuaW1wb3J0ICdyZWdlbmVyYXRvci1ydW50aW1lL3J1bnRpbWUnO1xuaW1wb3J0IHsgQ2xpZW50IH0gZnJvbSAnQHNvdW5kd29ya3MvY29yZS9jbGllbnQnO1xuaW1wb3J0IGluaXRRb1MgZnJvbSAnQHNvdW5kd29ya3MvdGVtcGxhdGUtaGVscGVycy9jbGllbnQvaW5pdC1xb3MuanMnO1xuXG5pbXBvcnQgcGx1Z2luRmlsZXN5c3RlbUZhY3RvcnkgZnJvbSAnQHNvdW5kd29ya3MvcGx1Z2luLWZpbGVzeXN0ZW0vY2xpZW50Jztcbi8vIGltcG9ydCBwbHVnaW5BdWRpb0J1ZmZlckxvYWRlckZhY3RvcnkgZnJvbSAnQHNvdW5kd29ya3MvcGx1Z2luLWF1ZGlvLWJ1ZmZlci1sb2FkZXIvY2xpZW50JztcblxuLy8gSW1wb3J0IHBsdWdpblxuaW1wb3J0IHBsdWdpbkF1ZGlvQnVmZmVyTG9hZGVyRmFjdG9yeSBmcm9tICdAc291bmR3b3Jrcy9wbHVnaW4tYXVkaW8tYnVmZmVyLWxvYWRlci9jbGllbnQnO1xuXG5pbXBvcnQgUGxheWVyRXhwZXJpZW5jZSBmcm9tICcuL1BsYXllckV4cGVyaWVuY2UuanMnO1xuXG5jb25zdCBjb25maWcgPSB3aW5kb3cuc291bmR3b3Jrc0NvbmZpZztcbi8vIHN0b3JlIGV4cGVyaWVuY2VzIG9mIGVtdWxhdGVkIGNsaWVudHNcbmNvbnN0IGV4cGVyaWVuY2VzID0gbmV3IFNldCgpO1xuXG5cbmFzeW5jIGZ1bmN0aW9uIGxhdW5jaCgkY29udGFpbmVyLCBpbmRleCkge1xuICB0cnkge1xuICAgIGNvbnN0IGNsaWVudCA9IG5ldyBDbGllbnQoKTtcblxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyByZWdpc3RlciBwbHVnaW5zXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGNsaWVudC5wbHVnaW5NYW5hZ2VyLnJlZ2lzdGVyKCdmaWxlc3lzdGVtJywgcGx1Z2luRmlsZXN5c3RlbUZhY3RvcnksIHt9LCBbXSk7XG4gICAgY2xpZW50LnBsdWdpbk1hbmFnZXIucmVnaXN0ZXIoJ2F1ZGlvLWJ1ZmZlci1sb2FkZXInLCBwbHVnaW5BdWRpb0J1ZmZlckxvYWRlckZhY3RvcnksIHtcbiAgICAgIGRhdGE6IHtcbiAgICAgICAgJ1Nob290JzogJ0F1ZGlvL0tpbGwubXAzJyxcbiAgICAgICAgJ01vbnN0ZXJTb3VuZDEnOiAnQXVkaW8vTW9uc3RlcjEubXAzJyxcbiAgICAgICAgJ01vbnN0ZXJTb3VuZDInOiAnQXVkaW8vTW9uc3RlcjIubXAzJyxcbiAgICAgICAgJ01vbnN0ZXJTb3VuZDMnOiAnQXVkaW8vTW9uc3RlcjMubXAzJyxcbiAgICAgICAgJ01vbnN0ZXJTb3VuZDQnOiAnQXVkaW8vTW9uc3RlcjQubXAzJyxcbiAgICAgICAgJ01vbnN0ZXJTb3VuZDUnOiAnQXVkaW8vTW9uc3RlcjUubXAzJyxcbiAgICAgICAgJ01vbnN0ZXJEaWUnOidBdWRpby9Nb25zdGVyRGllLndhdicsXG4gICAgICB9XG4gICAgfSwgW10pXG4gICAgXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIGxhdW5jaCBhcHBsaWNhdGlvblxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBhd2FpdCBjbGllbnQuaW5pdChjb25maWcpO1xuICAgIGluaXRRb1MoY2xpZW50KTtcblxuICAgIGNvbnN0IGV4cGVyaWVuY2UgPSBuZXcgUGxheWVyRXhwZXJpZW5jZShjbGllbnQsIGNvbmZpZywgJGNvbnRhaW5lcik7XG4gICAgLy8gc3RvcmUgZXhwcmllbmNlIGZvciBlbXVsYXRlZCBjbGllbnRzXG4gICAgZXhwZXJpZW5jZXMuYWRkKGV4cGVyaWVuY2UpO1xuXG4gICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QucmVtb3ZlKCdsb2FkaW5nJyk7XG5cbiAgICAvLyBzdGFydCBhbGwgdGhlIHRoaW5nc1xuICAgIGF3YWl0IGNsaWVudC5zdGFydCgpO1xuICAgIGV4cGVyaWVuY2Uuc3RhcnQoKTtcblxuICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiAgfSBjYXRjaChlcnIpIHtcbiAgICBjb25zb2xlLmVycm9yKGVycik7XG4gIH1cbn1cblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gYm9vdHN0cmFwcGluZ1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuY29uc3QgJGNvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNfX3NvdW5kd29ya3MtY29udGFpbmVyJyk7XG5jb25zdCBzZWFyY2hQYXJhbXMgPSBuZXcgVVJMU2VhcmNoUGFyYW1zKHdpbmRvdy5sb2NhdGlvbi5zZWFyY2gpO1xuLy8gZW5hYmxlIGluc3RhbmNpYXRpb24gb2YgbXVsdGlwbGUgY2xpZW50cyBpbiB0aGUgc2FtZSBwYWdlIHRvIGZhY2lsaXRhdGVcbi8vIGRldmVsb3BtZW50IGFuZCB0ZXN0aW5nIChiZSBjYXJlZnVsIGluIHByb2R1Y3Rpb24uLi4pXG5jb25zdCBudW1FbXVsYXRlZENsaWVudHMgPSBwYXJzZUludChzZWFyY2hQYXJhbXMuZ2V0KCdlbXVsYXRlJykpIHx8IDE7XG5cbi8vIHNwZWNpYWwgbG9naWMgZm9yIGVtdWxhdGVkIGNsaWVudHMgKDEgY2xpY2sgdG8gcnVsZSB0aGVtIGFsbClcbmlmIChudW1FbXVsYXRlZENsaWVudHMgPiAxKSB7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbnVtRW11bGF0ZWRDbGllbnRzOyBpKyspIHtcbiAgICBjb25zdCAkZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgJGRpdi5jbGFzc0xpc3QuYWRkKCdlbXVsYXRlJyk7XG4gICAgJGNvbnRhaW5lci5hcHBlbmRDaGlsZCgkZGl2KTtcblxuICAgIGxhdW5jaCgkZGl2LCBpKTtcbiAgfVxuXG4gIGNvbnN0ICRpbml0UGxhdGZvcm1CdG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgJGluaXRQbGF0Zm9ybUJ0bi5jbGFzc0xpc3QuYWRkKCdpbml0LXBsYXRmb3JtJyk7XG4gICRpbml0UGxhdGZvcm1CdG4udGV4dENvbnRlbnQgPSAncmVzdW1lIGFsbCc7XG5cbiAgZnVuY3Rpb24gaW5pdFBsYXRmb3JtcyhlKSB7XG4gICAgZXhwZXJpZW5jZXMuZm9yRWFjaChleHBlcmllbmNlID0+IHtcbiAgICAgIGlmIChleHBlcmllbmNlLnBsYXRmb3JtKSB7XG4gICAgICAgIGV4cGVyaWVuY2UucGxhdGZvcm0ub25Vc2VyR2VzdHVyZShlKVxuICAgICAgfVxuICAgIH0pO1xuICAgICRpbml0UGxhdGZvcm1CdG4ucmVtb3ZlRXZlbnRMaXN0ZW5lcigndG91Y2hlbmQnLCBpbml0UGxhdGZvcm1zKTtcbiAgICAkaW5pdFBsYXRmb3JtQnRuLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCBpbml0UGxhdGZvcm1zKTtcbiAgICAkaW5pdFBsYXRmb3JtQnRuLnJlbW92ZSgpO1xuICB9XG5cbiAgJGluaXRQbGF0Zm9ybUJ0bi5hZGRFdmVudExpc3RlbmVyKCd0b3VjaGVuZCcsIGluaXRQbGF0Zm9ybXMpO1xuICAkaW5pdFBsYXRmb3JtQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCBpbml0UGxhdGZvcm1zKTtcblxuICAkY29udGFpbmVyLmFwcGVuZENoaWxkKCRpbml0UGxhdGZvcm1CdG4pO1xufSBlbHNlIHtcbiAgbGF1bmNoKCRjb250YWluZXIsIDApO1xufVxuIl0sIm1hcHBpbmdzIjoiOztBQUFBOztBQUNBOztBQUNBOztBQUNBOztBQUVBOztBQUlBOztBQUVBOzs7O0FBTEE7QUFFQTtBQUtBLE1BQU1BLE1BQU0sR0FBR0MsTUFBTSxDQUFDQyxnQkFBdEIsQyxDQUNBOztBQUNBLE1BQU1DLFdBQVcsR0FBRyxJQUFJQyxHQUFKLEVBQXBCOztBQUdBLGVBQWVDLE1BQWYsQ0FBc0JDLFVBQXRCLEVBQWtDQyxLQUFsQyxFQUF5QztFQUN2QyxJQUFJ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