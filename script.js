// defaultPackages is loaded from packages-data.js
let EVENT_TONES = ['wedding', 'funeral', 'naming', 'corporate', 'concert', 'others'];
let ALL_TONES = ['wedding', 'funeral', 'naming', 'corporate', 'concert', 'others', 'portrait', 'streaming'];
let packages = window.defaultPackages || {};

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
  ["Birthday Reel", "GHS 500–GHS 1,500"],
  ["Framed Portrait", "GHS 250–GHS 800"],
  ["Photo Album", "GHS 500–GHS 2,000"],
  ["Extra outfit change", "GHS 150"],
  ["Same-day delivery", "+30% of package price"],
  ["Adult kente traditional props", "GHS 700"],
  ["Adult props with makeup and 4 retouched pictures", "GHS 1,000"],
  ["Child kente traditional props", "GHS 400"],
  ["Child props with makeup and 3 retouched pictures", "GHS 800"],
  ["Cake Smash Setup Assistance", "GHS 300–GHS 800"],
  ["Extended Family Portraits", "GHS 300"],
  ["Child Styling & Makeup (where applicable)", "GHS 200–GHS 500"]
];

// ─── EVENT DEFINITIONS ──────────────────────────────────────────────────────
let eventTypes = [
  {
    key: "wedding",
    label: "Wedding",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l2 7h7l-5.5 4 2 7L12 16l-5.5 4 2-7L3 9h7z"/></svg>`,
    tabs: ["Photo & Video", "Live Streaming", "Drone"]
  },
  {
    key: "funeral",
    label: "Funeral",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M12 12v10"/><path d="M9 14h6"/></svg>`,
    tabs: ["Coverage", "Live Streaming", "Full Package"]
  },
  {
    key: "naming",
    label: "Naming",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
    tabs: ["Photo only", "Video only", "Photo & Video", "Live Streaming"]
  },
  {
    key: "corporate",
    label: "Corporate",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/></svg>`,
    tabs: ["Conference", "Launch & Party", "Award Night"]
  },
  {
    key: "concert",
    label: "Concert",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>`,
    tabs: ["Coverage", "Streaming", "Full Production"]
  },
  {
    key: "others",
    label: "Other Events",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
    tabs: ["Classic", "Premium", "Luxury"]
  }
];

function syncTonesFromEventTypes() {
  EVENT_TONES = eventTypes.map(e => e.key);
  ALL_TONES = [...EVENT_TONES, 'portrait', 'streaming'];
}

async function loadEventTypesFromDB() {
  if (!window.supabaseClient) return;
  try {
    const { data, error } = await window.supabaseClient
      .from('event_types')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.warn("Could not load event types from database (using default fallback):", error.message);
      return;
    }

    if (data && data.length > 0) {
      eventTypes = data.map(evt => ({
        key: evt.key,
        label: evt.label,
        icon: evt.icon || `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
        tabs: Array.isArray(evt.tabs) ? evt.tabs : []
      }));
      syncTonesFromEventTypes();
      
      // If activeEvent is no longer valid, default to first event type
      if (!eventTypes.some(e => e.key === activeEvent)) {
        activeEvent = eventTypes[0] ? eventTypes[0].key : "";
        const activeEvtDef = eventTypes.find(e => e.key === activeEvent);
        activeEventTab = activeEvtDef && activeEvtDef.tabs[0] ? activeEvtDef.tabs[0] : "";
      }
    }
  } catch (err) {
    console.error("Error fetching event types:", err);
  }
}


// ─── STATE ──────────────────────────────────────────────────────────────────
const packageGrid = document.querySelector("[data-package-grid]");
const packageTabs = document.querySelectorAll("#packages .tab");
const portraitFilterRow = document.getElementById("portrait-filters");
const birthdayLocationRow = document.getElementById("birthday-location-filters");
const eventTypeRow = document.getElementById("event-type-filters");
const eventSubTabRow = document.getElementById("event-sub-tab-filters");
const extrasList = document.querySelector("[data-extras-list]");

let activeCategory = "events";
let activeEvent = "wedding";
let activeEventTab = "Photo & Video";

let activePortraitFilter = "studio";
let activeBirthdayLocation = "In-studio";

// ─── PORTRAIT FILTERS ────────────────────────────────────────────────────────
const portraitFilters = [
  {
    key: "studio",
    label: "Studio shoot",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h4l2-3h4l2 3h4a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2z"/><circle cx="12" cy="13" r="3"/></svg>`,
    category: "Photoshoot"
  },
  {
    key: "child-birthday",
    label: "Child Birthday",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>`,
    category: "Child Birthday"
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

// ─── DEEP LINK URL BUILDER ───────────────────────────────────────────────────
// Builds a URL that, when opened, restores the exact package view the sender
// was looking at. Included in every WhatsApp booking message so the recipient
// can tap the link and land on the right package immediately.
function buildDeepLinkUrl(item) {
  const base = window.location.origin + window.location.pathname;
  const params = new URLSearchParams();
  const tone = item.tone || '';

  if (tone === 'portrait') {
    params.set('cat', 'portrait');
    const pf = portraitFilters.find(f => f.category === item.category);
    if (pf) {
      params.set('pf', pf.key);
      if (pf.key === 'birthday' && item.location) {
        params.set('loc', item.location);
      }
    }
  } else if (tone === 'streaming') {
    params.set('cat', 'streaming');
  } else {
    // Event tones (wedding, funeral, naming, corporate, concert, others, …)
    params.set('cat', 'events');
    params.set('event', tone);
    if (item.tab) params.set('tab', item.tab);
  }

  if (item.title) params.set('pkg', item.title);

  return `${base}?${params.toString()}#packages`;
}

// ─── CARD RENDERER ───────────────────────────────────────────────────────────
function renderPackageCard(item) {
  const bullets = Array.isArray(item.bullets) ? item.bullets : [];
  const tags = Array.isArray(item.tags) ? item.tags : [];
  const deepLink = buildDeepLinkUrl(item);
  const waMessage = `Hello Smart Captcha, I want to book the ${item.title || ''} package (${item.price || ''}).\n\nView package: ${deepLink}`;
  return `
    <article class="package-card${item.featured ? " featured" : ""}">
      <div class="package-body">
        <div class="package-topline">
          <span class="package-category">${item.category || ""}</span>
          ${item.featured ? '<span class="mini-label">Popular</span>' : ""}
        </div>
        <div class="package-visual ${item.tone || ""}" style="--photo: url('${item.photo || ""}')" aria-hidden="true">
          <span>${item.title ? item.title.split(" ").slice(0, 2).join(" ") : ""}</span>
        </div>
        <h3>${item.title || ""}</h3>
        <div class="price">${item.price || ""}</div>
        <ul>${bullets.map((bullet) => `<li>${bullet}</li>`).join("")}</ul>
        <div class="tag-row">${tags.map((tag) => `<span>${tag}</span>`).join("")}</div>
        <a class="button card-cta" href="https://wa.me/233244101740?text=${encodeURIComponent(waMessage)}">
          <span>Book package</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="btn-icon-right"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
        </a>
      </div>
    </article>
  `;
}

// ─── EVENT TYPE CHIPS ────────────────────────────────────────────────────────
function renderEventTypeFilters() {
  if (!eventTypeRow) return;
  eventTypeRow.innerHTML = eventTypes.map((evt) => `
    <button type="button" class="event-type-button${evt.key === activeEvent ? " active" : ""}" data-event-type="${evt.key}" aria-pressed="${evt.key === activeEvent}">
      <span class="event-type-icon">${evt.icon}</span>
      <span>${evt.label}</span>
    </button>
  `).join("");

  eventTypeRow.querySelectorAll("[data-event-type]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const eventDef = eventTypes.find(e => e.key === btn.dataset.eventType);
      activeEvent = btn.dataset.eventType;
      activeEventTab = eventDef ? eventDef.tabs[0] : "";
      renderEventTypeFilters();
      renderEventSubTabs();
      renderPackages("events");
    });
  });
}

// ─── EVENT SUB-TABS ──────────────────────────────────────────────────────────
function renderEventSubTabs() {
  if (!eventSubTabRow) return;
  const eventDef = eventTypes.find(e => e.key === activeEvent);
  if (!eventDef) { eventSubTabRow.classList.add("hidden"); return; }

  eventSubTabRow.classList.remove("hidden");
  eventSubTabRow.innerHTML = eventDef.tabs.map((tab) => `
    <button type="button" class="event-subtab-button${tab === activeEventTab ? " active" : ""}" data-event-tab="${tab}" aria-pressed="${tab === activeEventTab}">
      ${tab}
    </button>
  `).join("");

  eventSubTabRow.querySelectorAll("[data-event-tab]").forEach((btn) => {
    btn.addEventListener("click", () => {
      activeEventTab = btn.dataset.eventTab;
      renderEventSubTabs();
      renderPackages("events");
    });
  });
}

// ─── PORTRAIT FILTERS ────────────────────────────────────────────────────────
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

// ─── DEEP LINK PARAMS READER ─────────────────────────────────────────────────
// Reads URL query params produced by buildDeepLinkUrl() and restores the
// correct category/event/tab/portrait-filter state so the recipient of the
// WhatsApp link lands on exactly the right package view.
function applyDeepLinkParams() {
  const params = new URLSearchParams(window.location.search);
  const cat = params.get('cat');
  if (!cat) return false;

  if (cat === 'events') {
    activeCategory = 'events';
    const eventKey = params.get('event');
    if (eventKey && eventTypes.some(e => e.key === eventKey)) {
      activeEvent = eventKey;
      const eventDef = eventTypes.find(e => e.key === eventKey);
      const tabParam = params.get('tab');
      activeEventTab = (tabParam && eventDef && eventDef.tabs.includes(tabParam))
        ? tabParam
        : (eventDef && eventDef.tabs[0] ? eventDef.tabs[0] : '');
    }
  } else if (cat === 'portrait') {
    activeCategory = 'portrait';
    const pfKey = params.get('pf');
    if (pfKey && portraitFilters.some(f => f.key === pfKey)) {
      activePortraitFilter = pfKey;
      if (pfKey === 'birthday') {
        const loc = params.get('loc');
        if (loc) activeBirthdayLocation = loc;
      }
    }
  } else if (cat === 'streaming') {
    activeCategory = 'streaming';
  }

  // Sync the main tab buttons to match restored category
  packageTabs.forEach(tab => {
    const isActive = tab.dataset.filter === activeCategory;
    tab.classList.toggle('active', isActive);
    tab.setAttribute('aria-selected', String(isActive));
  });

  return true;
}

// ─── VISIBILITY HELPERS ──────────────────────────────────────────────────────
function updatePortraitFilterVisibility() {
  if (activeCategory === "portrait") {
    portraitFilterRow.classList.remove("hidden");
    renderPortraitFilters();
    updateBirthdayFilterVisibility();
  } else {
    portraitFilterRow.classList.add("hidden");
    if (birthdayLocationRow) birthdayLocationRow.classList.add("hidden");
    activePortraitFilter = "studio";
    activeBirthdayLocation = "In-studio";
  }
}

function updateEventFilterVisibility() {
  if (activeCategory === "events") {
    if (eventTypeRow) eventTypeRow.classList.remove("hidden");
    renderEventTypeFilters();
    renderEventSubTabs();
  } else {
    if (eventTypeRow) eventTypeRow.classList.add("hidden");
    if (eventSubTabRow) eventSubTabRow.classList.add("hidden");
  }
}

// ─── RENDER PACKAGES ─────────────────────────────────────────────────────────
function renderPackages(category) {
  if (!packageGrid) return;

  // EVENTS — filter by activeEvent + activeEventTab
  if (category === "events") {
    const eventPackages = Array.isArray(packages[activeEvent]) ? packages[activeEvent] : [];
    const filtered = eventPackages.filter(item => 
      item && item.tab && activeEventTab && item.tab.trim().toLowerCase() === activeEventTab.trim().toLowerCase()
    );
    packageGrid.innerHTML = filtered.length
      ? `<div class="package-carousel">${filtered.map(renderPackageCard).join("")}</div>`
      : `<div class="empty-state">No ${activeEventTab} packages available yet.</div>`;
    return;
  }

  // PORTRAIT — sub-filtered by type then birthday location
  if (category === "portrait") {
    const filterInfo = portraitFilters.find((filter) => filter.key === activePortraitFilter);
    if (!filterInfo) return;
    const portraitPackages = Array.isArray(packages.portrait) ? packages.portrait : [];
    let filteredItems = portraitPackages.filter((item) => item && item.category === filterInfo.category);
    if (activePortraitFilter === "birthday") {
      filteredItems = filteredItems.filter((item) => item.location === activeBirthdayLocation);
    }
    packageGrid.innerHTML = filteredItems.length
      ? `<div class="package-carousel">${filteredItems.map(renderPackageCard).join("")}</div>`
      : `<div class="empty-state">No ${filterInfo.label} packages available yet.</div>`;
    return;
  }

  // STREAMING — group by category
  const categoryPackages = Array.isArray(packages[category]) ? packages[category] : [];
  const groupedPackages = categoryPackages.reduce((groups, item) => {
    if (item && item.category) {
      groups[item.category] = groups[item.category] || [];
      groups[item.category].push(item);
    }
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

// ─── EXTRAS ──────────────────────────────────────────────────────────────────
function renderExtras() {
  extrasList.innerHTML = extras.map(([name, price]) => `
    <article class="extra-item">
      <strong>${name}</strong>
      <span>${price}</span>
    </article>
  `).join("");
}

// ─── TAB LISTENERS ───────────────────────────────────────────────────────────
packageTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    activeCategory = tab.dataset.filter;
    packageTabs.forEach((item) => {
      const isActive = item === tab;
      item.classList.toggle("active", isActive);
      item.setAttribute("aria-selected", String(isActive));
    });
    updateEventFilterVisibility();
    updatePortraitFilterVisibility();
    renderPackages(activeCategory);
  });
});

// ─── GALLERY ─────────────────────────────────────────────────────────────────
const galleryGrid = document.querySelector("[data-gallery-grid]");
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
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  lightbox.setAttribute("aria-hidden", "true");
  lightboxContent.innerHTML = "";
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
  galleryGrid.innerHTML = "";
  currentGalleryItems = filterCategory === "all"
    ? galleryData
    : galleryData.filter(item => item.category === filterCategory);

  const mid = Math.ceil(currentGalleryItems.length / 2);
  const row1Items = currentGalleryItems.slice(0, mid);
  const row2Items = currentGalleryItems.slice(mid);

  while (row2Items.length < row1Items.length) row2Items.push(row2Items[0]);
  while (row1Items.length < row2Items.length) row1Items.push(row1Items[0]);

  const htmlRow1 = row1Items.map(generateGalleryItemHTML).join("");
  const htmlRow2 = row2Items.map(generateGalleryItemHTML).join("");

  galleryGrid.innerHTML = `
    <div class="marquee-track right-slide">
      <div class="marquee-group">${htmlRow1}</div>
      <div class="marquee-group" aria-hidden="true">${htmlRow1}</div>
    </div>
    <div class="marquee-track left-slide">
      <div class="marquee-group">${htmlRow2}</div>
      <div class="marquee-group" aria-hidden="true">${htmlRow2}</div>
    </div>
  `;

  galleryGrid.querySelectorAll('.gallery-item').forEach(el => {
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

// ─── BACK TO TOP ─────────────────────────────────────────────────────────────
if (backToTop) {
  window.addEventListener("scroll", () => {
    backToTop.classList.toggle("visible", window.scrollY > 500);
  }, { passive: true });
}

// ─── SUPABASE REALTIME ───────────────────────────────────────────────────────

// Tones that require sub-tab filtering (need a `tab` field to render correctly)

function buildPackagesFromDB(dbPackages) {
  const newPackages = {};
  ALL_TONES.forEach(t => newPackages[t] = []);

  dbPackages.forEach(p => {
    if (newPackages[p.tone] !== undefined) {
      newPackages[p.tone].push({
        title: p.title,
        category: p.category,
        tab: p.tab || null,
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

  // Fallback logic per tone:
  // 1. If a tone has zero packages → use defaults
  // 2. For event tones: if packages exist but NONE have a tab value
  //    (old pre-migration data) → use defaults so sub-tabs work correctly
  ALL_TONES.forEach(tone => {
    const arr = newPackages[tone];
    const defaults = window.defaultPackages && window.defaultPackages[tone];
    if (!defaults) return;

    const isEmpty = arr.length === 0;
    const isEventToneWithNoTabs = EVENT_TONES.includes(tone) && arr.length > 0 && arr.every(p => !p.tab);

    if (isEmpty || isEventToneWithNoTabs) {
      newPackages[tone] = defaults;
    }
  });

  return newPackages;
}


function setupRealtimeSubscriptions() {
  if (!window.supabaseClient) return;

  window.supabaseClient
    .channel('public:gallery_images')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'gallery_images' }, async () => {
      const { data: dbGallery } = await window.supabaseClient
        .from('gallery_images')
        .select('*')
        .order('created_at', { ascending: false });
      if (dbGallery) {
        galleryData = dbGallery;
        initGallery("all");
      }
    })
    .subscribe();

  window.supabaseClient
    .channel('public:packages')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'packages' }, async () => {
      const { data: dbPackages } = await window.supabaseClient.from('packages').select('*');
      if (dbPackages && dbPackages.length > 0) {
        packages = buildPackagesFromDB(dbPackages);
        renderPackages(activeCategory);
        if (activeCategory === "portrait") updatePortraitFilterVisibility();
        if (activeCategory === "events") updateEventFilterVisibility();
      }
    })
    .subscribe();

  window.supabaseClient
    .channel('public:event_types')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'event_types' }, async () => {
      await loadEventTypesFromDB();
      // Refetch packages because EVENT_TONES has updated
      const { data: dbPackages } = await window.supabaseClient.from('packages').select('*');
      if (dbPackages) {
        packages = buildPackagesFromDB(dbPackages);
      }
      renderPackages(activeCategory);
      if (activeCategory === "events") updateEventFilterVisibility();
    })
    .subscribe();
}

// ─── INIT ─────────────────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", async () => {
  // Set year
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  if (!packageGrid) return;

  // Render defaults immediately
  updateEventFilterVisibility();
  renderPackages(activeCategory);
  renderExtras();

  // Load dynamic event types first
  await loadEventTypesFromDB();

  setupRealtimeSubscriptions();

  // ── Packages fetch (independent) ──────────────────────────────────────────
  try {
    const { data: dbPackages } = await window.supabaseClient.from('packages').select('*');
    if (dbPackages && dbPackages.length > 0) {
      packages = buildPackagesFromDB(dbPackages);
      renderPackages(activeCategory);
      if (activeCategory === "events") updateEventFilterVisibility();
      if (activeCategory === "portrait") updatePortraitFilterVisibility();
    }
  } catch (err) {
    console.error("Error fetching packages from Supabase:", err);
  }

  // ── Gallery fetch (independent — never blocked by packages errors) ─────────
  try {
    const { data: dbGallery } = await window.supabaseClient
      .from('gallery_images')
      .select('*')
      .order('created_at', { ascending: false });

    if (dbGallery && dbGallery.length > 0) {
      galleryData = dbGallery;
      initGallery("all");
    } else {
      console.warn("No gallery images found in Supabase database.");
      initGallery("all"); // renders empty state gracefully
    }
  } catch (err) {
    console.error("Error fetching gallery from Supabase:", err);
    initGallery("all"); // attempt to render with whatever data is available
  }

  // ── Apply deep-link params AFTER event types are loaded from DB ──────────
  // This ensures event type keys from the database are valid before we try
  // to match the URL param. Re-render everything so the correct view shows.
  const wasDeepLink = applyDeepLinkParams();
  if (wasDeepLink) {
    updateEventFilterVisibility();
    updatePortraitFilterVisibility();
    renderPackages(activeCategory);
    // Scroll smoothly to the packages section
    setTimeout(() => {
      const pkgSection = document.getElementById('packages');
      if (pkgSection) pkgSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 300);
  } else {
    renderPackages(activeCategory);
    renderExtras();
  }
});

