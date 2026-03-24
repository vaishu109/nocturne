const app = document.getElementById('app');

const mediaData = [
  {
    type: 'music',
    title: 'Neon Nights',
    artist: 'Digital Spirit',
    id: 1,
    accent: '#99f7ff'
  },
  {
    type: 'image',
    title: 'Cyberpunk Skyline',
    author: 'AuraLens',
    id: 2,
    accent: '#bc13fe'
  },
  {
    type: 'code',
    title: 'Glassmorphic Button Hook',
    language: 'React / CSS',
    size: '1.2 KB',
    id: 3,
    accent: '#6fb5ff'
  }
];

window.showFeed = () => {
  app.innerHTML = `
    <div class="feed-container">
      <aside class="sidebar glass">
        <div class="sidebar-links">
          <a href="#" class="active"><i class="fas fa-home"></i> Home</a>
          <a href="#"><i class="fas fa-rss"></i> Feed</a>
          <a href="#"><i class="fas fa-music"></i> Music</a>
          <a href="#"><i class="fas fa-images"></i> Images</a>
          <a href="#"><i class="fas fa-code"></i> Code</a>
          <a href="#"><i class="fas fa-user-friends"></i> Friends</a>
        </div>
        <button class="btn-primary" style="padding: 0.8rem; width: 100%; font-size: 0.9rem;" onclick="openModal()">
          <i class="fas fa-plus"></i> NEW UPLOAD
        </button>
      </aside>
      
      <div class="main-feed">
        <header class="feed-header">
          <h2>Latest Discoveries</h2>
          <div class="filter-btns">
             <button class="active" onclick="filterFeed('all')">All</button>
             <button onclick="filterFeed('music')">Music</button>
             <button onclick="filterFeed('image')">Images</button>
             <button onclick="filterFeed('code')">Code</button>
          </div>
        </header>
        
        <div id="mediaGrid" class="media-grid">
          ${mediaData.map(item => renderMediaCard(item)).join('')}
        </div>
      </div>
    </div>
  `;
};

window.filterFeed = (type) => {
  const filtered = type === 'all' ? mediaData : mediaData.filter(m => m.type === type);
  document.getElementById('mediaGrid').innerHTML = filtered.map(item => renderMediaCard(item)).join('');
  document.querySelectorAll('.filter-btns button').forEach(btn => {
    btn.classList.toggle('active', btn.innerText.toLowerCase() === type);
  });
};

// Modal Logic
const modalHtml = `
  <div id="modalOverlay" class="modal-overlay">
    <div class="modal-content glass">
      <h2>Transfer New Media</h2>
      <div id="dropZone" class="drop-zone">
        <i class="fas fa-cloud-upload-alt"></i>
        <p>Drop file here or click to select</p>
        <input type="file" id="fileInput" style="display: none">
      </div>
      <div class="form-group">
        <label>Title</label>
        <input type="text" id="mediaTitle" placeholder="Give it a name...">
      </div>
      <div class="form-group">
        <label>Type</label>
        <select id="mediaType">
          <option value="music">Music</option>
          <option value="image">Image</option>
          <option value="code">Code</option>
        </select>
      </div>
      <div class="transfer-progress-container" id="progressContainer">
         <div class="transfer-info">
           <span id="transferStatus">Transferring...</span>
           <span id="transferPercent">0%</span>
         </div>
         <div class="transfer-bar"><div id="transferFill" class="transfer-fill"></div></div>
      </div>
      <div class="modal-actions" id="modalActions">
        <button class="btn-secondary" onclick="closeModal()">Cancel</button>
        <button class="btn-primary" onclick="handleUpload()">Initialize Transfer</button>
      </div>
    </div>
  </div>
`;

document.body.insertAdjacentHTML('beforeend', modalHtml);

window.openModal = () => {
  document.getElementById('modalOverlay').classList.add('active');
  setupDropZone();
};

function setupDropZone() {
  const dropZone = document.getElementById('dropZone');
  const fileInput = document.getElementById('fileInput');

  dropZone.onclick = () => fileInput.click();

  fileInput.onchange = (e) => handleFileSelection(e.target.files[0]);

  dropZone.ondragover = (e) => {
    e.preventDefault();
    dropZone.classList.add('drag-over');
  };

  dropZone.ondragleave = () => dropZone.classList.remove('drag-over');

  dropZone.ondrop = (e) => {
    e.preventDefault();
    dropZone.classList.remove('drag-over');
    handleFileSelection(e.dataTransfer.files[0]);
  };
}

let selectedFile = null;

function handleFileSelection(file) {
  if (!file) return;
  selectedFile = file;
  document.getElementById('mediaTitle').value = file.name;
  document.getElementById('dropZone').innerHTML = `<i class="fas fa-file-alt" style="color: var(--primary-neon)"></i><p>${file.name} ready</p>`;
}

window.closeModal = () => {
  document.getElementById('modalOverlay').classList.remove('active');
  // Reset
  document.getElementById('mediaTitle').value = '';
  document.getElementById('progressContainer').classList.remove('active');
  document.getElementById('modalActions').style.display = 'flex';
  selectedFile = null;
  document.getElementById('dropZone').innerHTML = `<i class="fas fa-cloud-upload-alt"></i><p>Drop file here or click to select</p>`;
};

window.handleUpload = () => {
  const title = document.getElementById('mediaTitle').value;
  const type = document.getElementById('mediaType').value;
  
  if (!title) return alert('Please enter a title');
  
  document.getElementById('modalActions').style.display = 'none';
  document.getElementById('progressContainer').classList.add('active');
  
  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.random() * 15;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      finalizeUpload(title, type);
    }
    document.getElementById('transferFill').style.width = progress + '%';
    document.getElementById('transferPercent').innerText = Math.round(progress) + '%';
  }, 200);
};

function finalizeUpload(title, type) {
  const newItem = {
    type,
    title,
    artist: 'Me',
    author: 'Me',
    language: 'Custom',
    size: selectedFile ? (selectedFile.size / 1024).toFixed(1) + ' KB' : '0 KB',
    accent: type === 'music' ? '#99f7ff' : (type === 'image' ? '#bc13fe' : '#6fb5ff'),
    id: Date.now()
  };
  
  mediaData.unshift(newItem);
  setTimeout(() => {
    closeModal();
    showFeed();
  }, 500);
}

function renderMediaCard(item) {
  const commonFooter = `
    <div class="card-footer">
       <a href="#" class="download-btn" onclick="alert('Starting Download for ${item.title}...')"><i class="fas fa-download"></i> Download</a>
       <span class="meta"><i class="fas fa-share"></i></span>
    </div>
  `;

  if (item.type === 'music') {
    return `
      <div class="media-card glass music-card" style="--accent: ${item.accent}">
        <div class="card-content">
          <i class="fas fa-music"></i>
          <h4>${item.title}</h4>
          <p>${item.artist}</p>
          <div class="wave-visualizer">
            <span></span><span></span><span></span><span></span><span></span><span></span>
          </div>
          <div class="card-footer">
             <button class="play-btn"><i class="fas fa-play"></i></button>
             <div class="progress-bar"><div class="progress" style="width: 30%"></div></div>
             <a href="#" class="download-btn" onclick="alert('Starting Download for ${item.title}...')"><i class="fas fa-download"></i></a>
          </div>
        </div>
      </div>
    `;
  }
  
  if (item.type === 'image') {
    return `
      <div class="media-card glass image-card" style="--accent: ${item.accent}">
         <div class="image-placeholder" style="background: linear-gradient(45deg, #1a1a1a, #2a2a2a)">
           <i class="fas fa-image"></i>
         </div>
         <div class="card-content">
           <h4>${item.title}</h4>
           <p>By ${item.author}</p>
           ${commonFooter}
         </div>
      </div>
    `;
  }

  if (item.type === 'code') {
    return `
      <div class="media-card glass code-card" style="--accent: ${item.accent}">
        <div class="card-content">
          <i class="fas fa-code"></i>
          <h4>${item.title}</h4>
          <p>${item.language} • ${item.size}</p>
          <pre class="code-preview"><code>// Code snippet...</code></pre>
          ${commonFooter}
        </div>
      </div>
    `;
  }
}
