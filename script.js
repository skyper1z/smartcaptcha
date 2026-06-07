// defaultPackages is loaded from packages-data.js
let packages = window.defaultPackages || { wedding: [], portrait: [], streaming: [], funeral: [] };

// Gallery Data fallback
let galleryData = [];

const extras = [
  ["Event Live Streaming", "GHS 5,500"],
  ["Retouching per image", "GHS 200"],
  ["Creative director", "GHS 3,000"],
  ["Extra photographer", "GHS 2,000"],
  ["Extra hourly rate", "GHS 1,000"],
  ["Extra softcopies (100)", "GHS 500"],
  ["Groom preparation", "GHS 1,500"],
  ["Photo book A3", "GHS 4,500"],
  ["Photo book A4", "GHS 3,000"],
  ["Photo frame A4", "GHS 450"],
  ["Photo frame A3", "GHS 600"],
  ["Photo frame A2", "GHS 800"],
  ["Drone coverage", "GHS 2,500"],
  ["Thanksgiving / lunch, 5 hours", "GHS 5,000"],
  ["Same-day edit, 10 to 15 images", "GHS 2,000"],
  ["Express service within 5 working days", "GHS 4,000"],
  ["Professional makeup", "GHS 250–GHS 700"],
  ["Extra edited photo", "GHS 50 each"],
  ["Birthday reel only", "GHS 300–GHS 800"],
  ["Framed portrait", "GHS 150–GHS 900"],
  ["Printed photobook", "GHS 500–GHS 2,000"],
  ["Extra outfit change", "GHS 150"],
  ["Same-day delivery", "+30% of package price"],
  ["Adult kente traditional props", "GHS 700"],
  ["Adult props with makeup and 4 retouched pictures", "GHS 1,000"],
  ["Child kente traditional props", "GHS 400"],
  ["Child props with makeup and 3 retouched pictures", "GHS 800"]
];

const packageGrid = document.querySelector("[data-package-grid]");
const packageTabs = document.querySelectorAll("#packages .tab");
const portraitFilterRow = document.getElementById("portrait-filters");
const extrasList = document.querySelector("[data-extras-list]");
let activeCategory = "wedding";
let activePortraitFilter = "studio";
let activeBirthdayLocation = "In-studio";

const portraitFilters = [
  {
    key: "studio",
    label: "Studio shoot",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h4l2-3h4l2 3h4a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2z"/><circle cx="12" cy="13" r="3"/></svg>`,
    category: "Photoshoot"
  },
  {
    key: "birthday",
    label: "Birthday shoot",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 15h14v5H5z"/><path d="M7 15V9a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v6"/><path d="M9 7l1-3 1 3m4 0l1-3 1 3"/></svg>`,
    category: "Birthday shoot"
  },
  {
    key: "kente",
    label: "Kente shoot",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 5l6 6-6 6"/><path d="M19 5l-6 6 6 6"/></svg>`,
    category: "Kente shoot"
  },
  {
    key: "bump",
    label: "Bump shoot",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4a4 4 0 0 1 4 4v4a4 4 0 1 1-8 0V8a4 4 0 0 1 4-4z"/><circle cx="12" cy="13" r="2"/></svg>`,
    category: "Bump shoot"
  }
];

function renderPackageCard(item) {
  return `
    <article class="package-card${item.featured ? " featured" : ""}">
      <div class="package-body">
        <div class="package-topline">
          <span class="package-category">${item.category}</span>
          ${item.featured ? '<span class="mini-label">Popular</span>' : ""}
        </div>
        <div class="package-visual ${item.tone}" style="--photo: url('${item.photo}')" aria-hidden="true">
          <span>${item.title.split(" ").slice(0, 2).join(" ")}</span>
        </div>
        <h3>${item.title}</h3>
        <div class="price">${item.price}</div>
        <ul>${item.bullets.map((bullet) => `<li>${bullet}</li>`).join("")}</ul>
        <div class="tag-row">${item.tags.map((tag) => `<span>${tag}</span>`).join("")}</div>
        <a class="button card-cta" href="https://wa.me/233244101740?text=Hello%20Smart%20Captcha%2C%20I%20want%20to%20book%20the%20${encodeURIComponent(item.title)}%20package%20(${encodeURIComponent(item.price)}).">
          <span>Book package</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="btn-icon-right"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
        </a>
      </div>
    </article>
  `;
}

function renderPortraitFilters() {
  portraitFilterRow.innerHTML = portraitFilters.map((filter) => `
    <button type="button" class="portrait-filter-button${filter.key === activePortraitFilter ? " active" : ""}" data-portrait-filter="${filter.key}" aria-pressed="${filter.key === activePortraitFilter}">
      <span class="portrait-filter-icon">${filter.icon}</span>
      <span>${filter.label}</span>
    </button>
  `).join("");

  portraitFilterRow.querySelectorAll("[data-portrait-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      setPortraitFilter(button.dataset.portraitFilter);
    });
  });
}

function setPortraitFilter(filterKey) {
  activePortraitFilter = filterKey;
  renderPortraitFilters();
  updateBirthdayFilterVisibility();
  renderPackages("portrait");
}

function updateBirthdayFilterVisibility() {
  const birthdayLocationRow = document.getElementById("birthday-location-filters");
  if (!birthdayLocationRow) return;

  const isBirthdaySelected = activePortraitFilter === "birthday";
  if (isBirthdaySelected) {
    birthdayLocationRow.classList.remove("hidden");
    renderBirthdayLocationFilters();
  } else {
    birthdayLocationRow.classList.add("hidden");
    activeBirthdayLocation = "In-studio";
  }
}

function renderBirthdayLocationFilters() {
  const birthdayLocationRow = document.getElementById("birthday-location-filters");
  if (!birthdayLocationRow) return;

  const birthdayLocations = [
    { key: "In-studio", label: "In-studio" },
    { key: "Location", label: "Out-studio" }
  ];

  birthdayLocationRow.innerHTML = birthdayLocations.map((loc) => `
    <button type="button" class="birthday-location-button${loc.key === activeBirthdayLocation ? " active" : ""}" data-birthday-location="${loc.key}" aria-pressed="${loc.key === activeBirthdayLocation}">
      ${loc.label}
    </button>
  `).join("");

  birthdayLocationRow.querySelectorAll("[data-birthday-location]").forEach((button) => {
    button.addEventListener("click", () => {
      activeBirthdayLocation = button.dataset.birthdayLocation;
      renderBirthdayLocationFilters();
      renderPackages("portrait");
    });
  });
}

function updatePortraitFilterVisibility() {
  if (activeCategory === "portrait") {
    portraitFilterRow.classList.remove("hidden");
    renderPortraitFilters();
    updateBirthdayFilterVisibility();
  } else {
    portraitFilterRow.classList.add("hidden");
    const birthdayLocationRow = document.getElementById("birthday-location-filters");
    if (birthdayLocationRow) birthdayLocationRow.classList.add("hidden");
    activePortraitFilter = "studio";
    activeBirthdayLocation = "In-studio";
  }
}

function renderPackages(category) {
  if (category === "portrait") {
    const filterInfo = portraitFilters.find((filter) => filter.key === activePortraitFilter);
    let filteredItems = packages.portrait.filter((item) => item.category === filterInfo.category);

    // Additional filtering for birthday location
    if (activePortraitFilter === "birthday") {
      filteredItems = filteredItems.filter((item) => item.location === activeBirthdayLocation);
    }

    packageGrid.innerHTML = filteredItems.length
      ? `<div class="package-carousel">${filteredItems.map(renderPackageCard).join("")}</div>`
      : `<div class="empty-state">No ${filterInfo.label} packages available yet.</div>`;
    return;
  }

  const groupedPackages = packages[category].reduce((groups, item) => {
    groups[item.category] = groups[item.category] || [];
    groups[item.category].push(item);
    return groups;
  }, {});

  packageGrid.innerHTML = Object.entries(groupedPackages).map(([group, items]) => `
    <section class="package-group">
      <div class="package-group-title">${group}</div>
      <div class="package-carousel">
        ${items.map(renderPackageCard).join("")}
      </div>
    </section>
  `).join("");
}

function renderExtras() {
  extrasList.innerHTML = extras.map(([name, price]) => `
    <article class="extra-item">
      <strong>${name}</strong>
      <span>${price}</span>
    </article>
  `).join("");
}

packageTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    activeCategory = tab.dataset.filter;
    packageTabs.forEach((item) => {
      const isActive = item === tab;
      item.classList.toggle("active", isActive);
      item.setAttribute("aria-selected", String(isActive));
    });
    updatePortraitFilterVisibility();
    renderPackages(activeCategory);
  });
});

// Gallery Logic
const galleryGrid = document.querySelector("[data-gallery-grid]");
const galleryTabs = document.querySelectorAll("#gallery .tab");
const lightbox = document.getElementById("lightbox");
const lightboxContent = document.querySelector("[data-lightbox-content]");
const lightboxClose = document.querySelector("[data-lightbox-close]");
const backToTop = document.querySelector("[data-back-to-top]");

let currentGalleryItems = [];

function openLightbox(item) {
  lightboxContent.innerHTML = "";
  if (item.type === "video") {
    lightboxContent.innerHTML = `<video src="${item.src}" controls autoplay playsinline></video>`;
  } else {
    lightboxContent.innerHTML = `<img src="${item.src}" alt="Gallery Image">`;
  }
  lightbox.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden"; // Prevent scrolling
}

function closeLightbox() {
  lightbox.setAttribute("aria-hidden", "true");
  lightboxContent.innerHTML = ""; // Stop video playback
  document.body.style.overflow = "";
}

lightboxClose.addEventListener("click", closeLightbox);
lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) closeLightbox();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && lightbox.getAttribute("aria-hidden") === "false") {
    closeLightbox();
  }
});

function generateGalleryItemHTML(item) {
  if (item.type === "video") {
    return `
      <div class="gallery-item video-item" data-src="${item.src}" data-type="video" role="button" tabindex="0">
        <video src="${item.src}" preload="metadata" muted playsinline></video>
        <div class="video-overlay">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
        </div>
      </div>
    `;
  }

  // Use thumbnail for faster preview loading if it's an image
  let thumbSrc = item.src;
  if (item.type === "image" && thumbSrc.startsWith("smartcaptcha/")) {
    thumbSrc = thumbSrc.replace("smartcaptcha/", "smartcaptcha/thumbnails/");
  }

  return `
    <div class="gallery-item image-item" data-src="${item.src}" data-type="image" role="button" tabindex="0">
      <img src="${thumbSrc}" alt="Gallery photo">
    </div>
  `;
}

function initGallery(filterCategory) {
  if (typeof galleryData === "undefined" || !galleryGrid) return;

  // Reset
  galleryGrid.innerHTML = "";

  currentGalleryItems = filterCategory === "all"
    ? galleryData
    : galleryData.filter(item => item.category === filterCategory);

  // Split into two rows
  const mid = Math.ceil(currentGalleryItems.length / 2);
  const row1Items = currentGalleryItems.slice(0, mid);
  const row2Items = currentGalleryItems.slice(mid);

  // Pad the shorter row so both have the exact same length (keeps them perfectly in sync)
  while (row2Items.length < row1Items.length) {
    row2Items.push(row2Items[0]);
  }
  while (row1Items.length < row2Items.length) {
    row1Items.push(row1Items[0]);
  }

  const htmlRow1 = row1Items.map(generateGalleryItemHTML).join("");
  const htmlRow2 = row2Items.map(generateGalleryItemHTML).join("");

  // Build the two marquee tracks. Each contains two groups to allow seamless looping.
  const marqueeHTML = `
    <div class="marquee-track right-slide">
      <div class="marquee-group">${htmlRow1}</div>
      <div class="marquee-group" aria-hidden="true">${htmlRow1}</div>
    </div>
    <div class="marquee-track left-slide">
      <div class="marquee-group">${htmlRow2}</div>
      <div class="marquee-group" aria-hidden="true">${htmlRow2}</div>
    </div>
  `;

  galleryGrid.innerHTML = marqueeHTML;

  // Attach event listeners to all newly added items
  const newItems = galleryGrid.querySelectorAll('.gallery-item');
  newItems.forEach(el => {
    el.addEventListener("click", () => {
      openLightbox({ type: el.dataset.type, src: el.dataset.src });
    });
    el.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openLightbox({ type: el.dataset.type, src: el.dataset.src });
      }
    });
  });
}

// Back to Top Logic
if (backToTop) {
  window.addEventListener("scroll", () => {
    if (window.scrollY > 500) {
      backToTop.classList.add("visible");
    } else {
      backToTop.classList.remove("visible");
    }
  }, { passive: true });
}

document.addEventListener("DOMContentLoaded", async () => {
  // If we are not on the homepage, skip the frontend UI rendering.
  if (!packageGrid) return;
  // Fetch data from Supabase
  try {
    const { data: dbPackages, error: pkgError } = await window.supabaseClient.from('packages').select('*');
    if (dbPackages && dbPackages.length > 0) {
      const newPackages = { wedding: [], portrait: [], streaming: [], funeral: [] };
      dbPackages.forEach(p => {
        if (newPackages[p.tone]) {
          newPackages[p.tone].push({
            title: p.title,
            category: p.category,
            location: p.location,
            price: p.price,
            tone: p.tone,
            photo: p.photo_url,
            bullets: p.bullets,
            tags: p.tags,
            featured: p.featured
          });
        }
      });
      packages = newPackages;
      
      // Re-render currently active category
      renderPackages(activeCategory);
      if (activeCategory === "portrait") {
        updatePortraitFilterVisibility();
      }
    }

    const { data: dbGallery, error: galError } = await window.supabaseClient.from('gallery_images').select('*').order('created_at', { ascending: false });
    if (dbGallery && dbGallery.length > 0) {
      galleryData = dbGallery;
      initGallery("all");
    } else {
      console.warn("No gallery images found in Supabase database.");
    }
  } catch (err) {
    console.error("Error fetching from Supabase:", err);
  }

  renderPackages(activeCategory);
  renderExtras();
});
