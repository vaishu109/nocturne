const ADJECTIVES = ['Neon', 'Solar', 'Lunar', 'Cyber', 'Arctic', 'Vibrant', 'Silent', 'Electric'];
const NOUNS = ['Fox', 'Lynx', 'Raven', 'Panda', 'Eagle', 'Wolf', 'Shark', 'Falcon'];

function generateIdentity() {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  return `${adj} ${noun}`;
}

const myIdentity = generateIdentity();
const myRoom = 'VIBE-' + Math.floor(Math.random() * 99);

const peers = [
  { name: 'Crystal Cat', id: 'p1', icon: 'fas fa-laptop' },
  { name: 'Orbit Owl', id: 'p2', icon: 'fas fa-mobile-alt' },
  { name: 'Glimmer Goat', id: 'p3', icon: 'fas fa-desktop' }
];

const app = document.getElementById('app');

function initHub() {
  document.getElementById('userIdentity').innerText = `You are ${myIdentity}`;
  document.getElementById('roomCode').innerText = `nocturne.net/${myRoom.toLowerCase()}`;
  renderDeviceGrid();
  setupGlobalDragAndDrop();
}

function renderDeviceGrid() {
  const grid = document.getElementById('deviceGrid');
  grid.innerHTML = `
    <div class="device-tile self glass" id="selfDevice">
        <div class="device-icon"><i class="fas fa-user-circle"></i></div>
        <div class="device-name">You (${myIdentity})</div>
        <div class="pulse-ring"></div>
    </div>
    ${peers.map(peer => `
      <div class="device-tile peer glass" id="device-${peer.id}" onclick="triggerFilePick('${peer.id}')">
          <div class="device-icon"><i class="${peer.icon}"></i></div>
          <div class="device-name">${peer.name}</div>
          <div class="transfer-overlay" id="overlay-${peer.id}">
             <div class="progress-arc"></div>
             <span class="percent">0%</span>
          </div>
      </div>
    `).join('')}
  `;
}

function setupGlobalDragAndDrop() {
  window.ondragover = (e) => e.preventDefault();
  window.ondrop = (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      alert(`Transferring ${files.length} files to the room...`);
      // Simulate transfer to first peer for demo
      simulateTransfer(peers[0].id, files[0].name);
    }
  };
}

window.triggerFilePick = (peerId) => {
  const input = document.getElementById('globalFileInput');
  input.onchange = (e) => {
    if (e.target.files.length > 0) {
      simulateTransfer(peerId, e.target.files[0].name);
    }
  };
  input.click();
};

function simulateTransfer(peerId, fileName) {
  const overlay = document.getElementById(`overlay-${peerId}`);
  const percentText = overlay.querySelector('.percent');
  overlay.classList.add('active');
  
  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.random() * 10;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      setTimeout(() => {
        overlay.classList.remove('active');
        alert(`Successfully transferred ${fileName} to ${peers.find(p => p.id === peerId).name}`);
      }, 500);
    }
    percentText.innerText = Math.round(progress) + '%';
  }, 100);
}

window.copyRoomLink = () => {
    const link = document.getElementById('roomCode').innerText;
    navigator.clipboard.writeText(link);
    alert('Room link copied!');
};

initHub();
