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
             <button class="active">All</button>
             <button>Music</button>
             <button>Images</button>
             <button>Code</button>
          </div>
        </header>
        
        <div class="media-grid">
          ${mediaData.map(item => renderMediaCard(item)).join('')}
        </div>
      </div>
    </div>
  `;
};

// Modal Logic
const modalHtml = `
  <div id="modalOverlay" class="modal-overlay">
    <div class="modal-content glass">
      <h2>Share New Media</h2>
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
      <div class="form-group">
        <label>Creator / Description</label>
        <input type="text" id="mediaCreator" placeholder="Your name or artist...">
      </div>
      <div class="modal-actions">
        <button class="btn-secondary" onclick="closeModal()">Cancel</button>
        <button class="btn-primary" onclick="handleUpload()">Share Now</button>
      </div>
    </div>
  </div>
`;

document.body.insertAdjacentHTML('beforeend', modalHtml);

window.openModal = () => {
  document.getElementById('modalOverlay').classList.add('active');
};

window.closeModal = () => {
  document.getElementById('modalOverlay').classList.remove('active');
};

window.handleUpload = () => {
  const title = document.getElementById('mediaTitle').value;
  const type = document.getElementById('mediaType').value;
  const creator = document.getElementById('mediaCreator').value;
  
  if (!title) return alert('Please enter a title');
  
  const newItem = {
    type,
    title,
    [type === 'music' ? 'artist' : (type === 'image' ? 'author' : 'language')]: creator,
    accent: type === 'music' ? '#99f7ff' : (type === 'image' ? '#bc13fe' : '#6fb5ff'),
    id: Date.now()
  };
  
  mediaData.unshift(newItem);
  closeModal();
  showFeed();
};

function renderMediaCard(item) {
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
           <div class="card-footer">
             <span class="meta"><i class="fas fa-heart"></i> 24</span>
             <span class="meta"><i class="fas fa-share"></i> Share</span>
           </div>
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
          <pre class="code-preview"><code>.glass {
  background: rgba(38, 38, 38, 0.6);
  backdrop-filter: blur(20px);
}</code></pre>
          <div class="card-footer">
             <button class="copy-btn"><i class="fas fa-copy"></i> Copy Code</button>
          </div>
        </div>
      </div>
    `;
  }
}
