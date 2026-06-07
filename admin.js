document.addEventListener('DOMContentLoaded', async () => {
  const authContainer = document.getElementById('auth-container');
  const dashboardContainer = document.getElementById('dashboard-container');
  const loginForm = document.getElementById('login-form');
  const logoutBtn = document.getElementById('logout-btn');
  const authError = document.getElementById('auth-error');
  const loginBtn = loginForm.querySelector('button[type="submit"]');

  // Attach listener synchronously to prevent form reload!
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    authError.classList.add('hidden');
    loginBtn.textContent = 'Logging in...';
    loginBtn.disabled = true;

    try {
      const { data, error } = await window.supabaseClient.auth.signInWithPassword({ email, password });
      
      if (error) {
        throw error;
      }
      
      if (data.session) {
        showDashboard();
      }
    } catch (err) {
      authError.textContent = err.message || 'Login failed.';
      authError.classList.remove('hidden');
    } finally {
      loginBtn.textContent = 'Login';
      loginBtn.disabled = false;
    }
  });

  // Auth Listener
  window.supabaseClient.auth.onAuthStateChange((event, session) => {
    if (session) {
      showDashboard();
    } else {
      showLogin();
    }
  });

  // Check auth state on load
  const { data: { session } } = await window.supabaseClient.auth.getSession();
  if (session) {
    showDashboard();
  } else {
    showLogin();
  }

  // Logout
  logoutBtn.addEventListener('click', async () => {
    await window.supabaseClient.auth.signOut();
  });

  function showDashboard() {
    authContainer.classList.add('hidden');
    dashboardContainer.classList.remove('hidden');
    loadGallery();
  }

  function showLogin() {
    authContainer.classList.remove('hidden');
    dashboardContainer.classList.add('hidden');
  }

  // Tab Switching
  document.querySelectorAll('.admin-tabs .tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.admin-tabs .tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.admin-section').forEach(s => s.classList.remove('active', 'hidden'));
      document.querySelectorAll('.admin-section').forEach(s => s.classList.add('hidden'));
      
      tab.classList.add('active');
      document.getElementById(`${tab.dataset.target}-tab`).classList.remove('hidden');
      document.getElementById(`${tab.dataset.target}-tab`).classList.add('active');
    });
  });

  // -----------------------------------------
  // GALLERY MANAGEMENT
  // -----------------------------------------
  async function loadGallery() {
    const grid = document.getElementById('admin-gallery-grid');
    grid.innerHTML = 'Loading...';
    const { data, error } = await window.supabaseClient.from('gallery_images').select('*').order('created_at', { ascending: false });
    
    if (error) {
      grid.innerHTML = 'Error loading gallery: ' + error.message;
      return;
    }

    if (data.length === 0) {
      grid.innerHTML = 'No images found.';
      return;
    }

    grid.innerHTML = data.map(img => `
      <div class="admin-image-card">
        <img src="${img.src}" alt="Gallery Image">
        <button class="delete-btn" data-id="${img.id}">X</button>
      </div>
    `).join('');

    // Delete handlers
    grid.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        if (!confirm('Delete this image?')) return;
        const id = e.target.dataset.id;
        await window.supabaseClient.from('gallery_images').delete().eq('id', id);
        loadGallery();
      });
    });
  }

  // Upload Gallery Image
  const uploadInput = document.getElementById('upload-gallery-input');
  const galleryStatus = document.getElementById('gallery-status');
  
  uploadInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    galleryStatus.textContent = 'Uploading to storage...';
    
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `gallery/${fileName}`;

    // 1. Upload to Supabase Storage Bucket ('media')
    const { error: uploadError } = await window.supabaseClient.storage.from('media').upload(filePath, file);
    
    if (uploadError) {
      galleryStatus.textContent = 'Upload failed: ' + uploadError.message;
      return;
    }

    // 2. Get Public URL
    const { data: { publicUrl } } = window.supabaseClient.storage.from('media').getPublicUrl(filePath);

    // 3. Insert into database
    galleryStatus.textContent = 'Saving to database...';
    const { error: dbError } = await window.supabaseClient.from('gallery_images').insert([{
      src: publicUrl,
      type: 'image',
      category: 'image'
    }]);

    if (dbError) {
      galleryStatus.textContent = 'DB Save failed: ' + dbError.message;
    } else {
      galleryStatus.textContent = 'Upload successful!';
      setTimeout(() => galleryStatus.textContent = '', 3000);
      loadGallery();
    }
  });

  // -----------------------------------------
  // SEED DATA TOOL
  // -----------------------------------------
  const seedBtn = document.getElementById('seed-data-btn');
  const seedStatus = document.getElementById('seed-status');

  seedBtn.addEventListener('click', async () => {
    if (!confirm('Are you sure? This will insert all your hardcoded packages and gallery data into Supabase.')) return;
    
    seedStatus.textContent = 'Migrating packages...';
    seedBtn.disabled = true;

    try {
      // 1. Migrate Packages (from window.defaultPackages in script.js)
      let packagesToInsert = [];
      for (const [mainCat, items] of Object.entries(window.defaultPackages)) {
        items.forEach(p => {
          packagesToInsert.push({
            category: p.category,
            title: p.title,
            location: p.location || null,
            price: p.price,
            tone: p.tone,
            photo_url: p.photo,
            bullets: p.bullets,
            tags: p.tags,
            featured: p.featured || false
          });
        });
      }

      if (packagesToInsert.length > 0) {
        const { error: pkgErr } = await window.supabaseClient.from('packages').insert(packagesToInsert);
        if (pkgErr) throw pkgErr;
      }

      // 2. Migrate Gallery (from window.legacyGalleryData)
      seedStatus.textContent = 'Migrating gallery...';
      if (window.legacyGalleryData && window.legacyGalleryData.length > 0) {
        const { error: galErr } = await window.supabaseClient.from('gallery_images').insert(window.legacyGalleryData);
        if (galErr) throw galErr;
      }

      seedStatus.textContent = 'Migration Complete! You can now use the dashboard to manage content.';
    } catch (err) {
      seedStatus.textContent = 'Error during migration: ' + err.message;
      console.error(err);
    }
    
    seedBtn.disabled = false;
  });

});
