const packages = {
  wedding: [
    {
      title: "One-Day Essential",
      category: "Photo + video",
      price: "GHS 6,500",
      tone: "wedding",
      photo: "assets/photos/wedding-couple.jpg",
      featured: true,
      bullets: [
        "6 hours coverage: bride preparation, ceremony, reception, and couple session.",
        "2 photographers and videographers.",
        "150 basic edited images.",
        "10 retouched images.",
        "All unedited JPEGs, minimum 300 images."
      ],
      tags: ["6 hours", "10 retouched", "300+ JPEGs"]
    },
    {
      title: "One-Day Plus",
      category: "Photo + video",
      price: "GHS 7,000",
      tone: "wedding",
      photo: "assets/photos/wedding-party.jpg",
      bullets: [
        "8 hours coverage: bride and groom preparation, ceremony, reception, and couple session.",
        "2 photographers and videographers.",
        "200 basic edited images.",
        "15 retouched images.",
        "Designed A3-sized photo book.",
        "All unedited JPEGs, minimum 400 images."
      ],
      tags: ["8 hours", "A3 photobook", "400+ JPEGs"]
    },
    {
      title: "Same-Day Full",
      category: "Photo + video",
      price: "GHS 10,000",
      tone: "wedding",
      photo: "assets/photos/wedding-bride.jpg",
      bullets: [
        "10 hours coverage for traditional, wedding, ceremony, reception, and couple session.",
        "2 photographers and videographers.",
        "200 basic edited images.",
        "15 retouched images.",
        "Designed A3-sized photo book.",
        "All unedited JPEGs, minimum 400 images."
      ],
      tags: ["10 hours", "Same day events", "A3 photobook"]
    },
    {
      title: "Two-Day Classic",
      category: "2/3 days coverage",
      price: "GHS 9,000",
      tone: "wedding",
      photo: "assets/photos/wedding-bride.jpg",
      bullets: [
        "12 hours coverage of traditional and white wedding with reception.",
        "2 photographers and videographers.",
        "200 basic edited images.",
        "15 retouched images.",
        "Designed A3-sized photo book.",
        "All unedited JPEGs, minimum 500 images."
      ],
      tags: ["12 hours", "500+ JPEGs", "A3 photobook"]
    },
    {
      title: "Multi-Day Premium",
      category: "2/3 days coverage",
      price: "GHS 11,000",
      tone: "wedding",
      photo: "assets/photos/wedding-party.jpg",
      bullets: [
        "17 hours coverage of pre-wedding, traditional and white wedding plus reception.",
        "2 photographers and videographers with a creative assistant.",
        "200 basic edited images.",
        "20 retouched images.",
        "Designed A3-sized photo book.",
        "All unedited JPEGs, minimum 600 images."
      ],
      tags: ["17 hours", "Creative assistant", "600+ JPEGs"]
    },
    {
      title: "Signature Coverage",
      category: "2/3 days coverage",
      price: "GHS 13,000",
      tone: "wedding",
      photo: "assets/photos/wedding-couple.jpg",
      bullets: [
        "25 hours coverage of pre-wedding, traditional and white wedding plus reception.",
        "3 photographers and videographers with a creative director.",
        "500 basic edited images.",
        "40 retouched images.",
        "Designed A3-sized photobook and frame.",
        "All unedited JPEGs, minimum 800 images."
      ],
      tags: ["25 hours", "40 retouched", "800+ JPEGs"]
    }
  ],
  portrait: [
    {
      title: "Basic Bump Shoot",
      category: "Bump shoot",
      price: "GHS 500",
      tone: "portrait",
      photo: "assets/photos/studio-portrait.jpg",
      featured: true,
      bullets: [
        "45 minutes to 1 hour studio session.",
        "1 outfit.",
        "5 professionally edited images.",
        "Online delivery.",
        "One backdrop setup."
      ],
      tags: ["1 outfit", "5 edited images", "Online delivery"]
    },
    {
      title: "Standard Bump Shoot",
      category: "Bump shoot",
      price: "GHS 800",
      tone: "portrait",
      photo: "assets/photos/traditional-props.jpg",
      bullets: [
        "Up to 2 hours studio session.",
        "2–3 outfit changes.",
        "10–15 professionally edited images.",
        "Multiple backdrop setups.",
        "Online gallery delivery."
      ],
      tags: ["2–3 outfits", "10–15 photos", "Gallery delivery"]
    },
    {
      title: "Premium Bump Shoot",
      category: "Bump shoot",
      price: "GHS 1,500",
      tone: "portrait",
      photo: "assets/photos/studio-portrait.jpg",
      bullets: [
        "Up to 3 hours studio session.",
        "Unlimited outfit changes.",
        "Professional makeup artist.",
        "20+ edited images.",
        "Couple/family participation.",
        "Premium retouching.",
        "Photo book or framed print.",
        "Behind-the-scenes video clips for social media."
      ],
      tags: ["Unlimited outfits", "20+ images", "Makeup artist"]
    },
    {
      title: "Bump Shoot Express",
      category: "Bump shoot",
      price: "GHS 800+",
      tone: "portrait",
      photo: "assets/photos/studio-portrait.jpg",
      bullets: [
        "Mini Package: GHS 800.",
        "Classic Package: GHS 1,200.",
        "Luxury Package: GHS 2,000+.",
        "Fast booking and studio-ready support.",
        "Ideal for quick maternity sessions and social media-ready images."
      ],
      tags: ["Express plans", "Fast turnaround", "Social-ready"]
    },
    {
      title: "Studio Mini",
      category: "Photoshoot",
      price: "GHS 200",
      tone: "portrait",
      photo: "assets/photos/studio-portrait.jpg",
      bullets: ["5 retouched pictures.", "2 dresses.", "30 minutes session time."],
      tags: ["5 photos", "2 dresses", "30 mins"]
    },
    {
      title: "Studio Standard",
      category: "Photoshoot",
      price: "GHS 400",
      tone: "portrait",
      photo: "assets/photos/traditional-props.jpg",
      bullets: ["10 retouched pictures.", "2 dresses.", "30 to 45 minutes session time."],
      tags: ["10 photos", "2 dresses", "45 mins"]
    },
    {
      title: "Studio Deluxe",
      category: "Photoshoot",
      price: "GHS 650",
      tone: "portrait",
      photo: "assets/photos/studio-portrait.jpg",
      bullets: ["15 retouched pictures.", "3 dresses.", "45 to 60 minutes session time."],
      tags: ["15 photos", "3 dresses", "60 mins"]
    },
    {
      title: "Royal Bronze",
      category: "Kente shoot",
      price: "GHS 1,200",
      tone: "portrait",
      photo: "assets/photos/traditional-props.jpg",
      bullets: [
        "1-hour studio session.",
        "Kente styling assistance.",
        "Traditional props provided.",
        "Traditional jewelry/beads provided.",
        "1 setup.",
        "10 professionally edited photos.",
        "Soft copy delivery."
      ],
      tags: ["10 photos", "Kente styling", "1 setup"]
    },
    {
      title: "Royal Silver",
      category: "Kente shoot",
      price: "GHS 1,800",
      tone: "portrait",
      photo: "assets/photos/studio-portrait.jpg",
      bullets: [
        "Up to 2-hour studio session.",
        "Traditional props and jewelry provided.",
        "2 themed setups.",
        "Up to 2 outfit changes.",
        "15 professionally edited photos.",
        "Beauty retouching.",
        "Social media-ready images.",
        "One 12” × 18” print."
      ],
      tags: ["15 photos", "Beauty retouch", "12×18 print"]
    },
    {
      title: "Royal Gold",
      category: "Kente shoot",
      price: "GHS 2,500",
      tone: "portrait",
      photo: "assets/photos/traditional-props.jpg",
      bullets: [
        "Up to 3-hour studio session.",
        "Full traditional styling experience.",
        "Premium props and jewelry provided.",
        "Multiple cultural setups.",
        "Up to 3 outfit changes.",
        "25 professionally edited photos.",
        "Cinematic behind-the-scenes reel.",
        "One framed portrait.",
        "Social media content package."
      ],
      tags: ["25 photos", "3 outfits", "Framed portrait"]
    },
    {
      title: "Heritage Luxury Package",
      category: "Kente shoot",
      price: "GHS 3,500–GHS 5,000+",
      tone: "portrait",
      photo: "assets/photos/studio-portrait.jpg",
      bullets: [
        "Premium studio styling.",
        "Exclusive props and royal furniture.",
        "Professional makeup coordination.",
        "Cinematic reel.",
        "30+ edited images.",
        "Framed portrait.",
        "Premium photobook option."
      ],
      tags: ["Heritage luxury", "30+ images", "Photobook option"]
    },
    {
      title: "Mini Birthday Package",
      category: "Birthday shoot",
      location: "In-studio",
      price: "GHS 600",
      tone: "portrait",
      photo: "assets/photos/studio-portrait.jpg",
      bullets: [
        "30-minute studio session.",
        "1 outfit.",
        "1 backdrop.",
        "5 professionally edited photos.",
        "Soft copies delivered online."
      ],
      tags: ["5 photos", "1 outfit", "30 mins"]
    },
    {
      title: "Classic Birthday Package",
      category: "Birthday shoot",
      location: "In-studio",
      price: "GHS 1,000",
      tone: "portrait",
      photo: "assets/photos/traditional-props.jpg",
      bullets: [
        "1-hour studio session.",
        "Up to 2 outfit changes.",
        "2 backdrop setups.",
        "10 professionally edited photos.",
        "Basic retouching.",
        "Soft copies delivered online."
      ],
      tags: ["10 photos", "2 outfits", "1 hour"]
    },
    {
      title: "Premium Birthday Package",
      category: "Birthday shoot",
      location: "In-studio",
      price: "GHS 1,500",
      tone: "portrait",
      photo: "assets/photos/studio-portrait.jpg",
      bullets: [
        "2-hour studio session.",
        "Up to 3 outfit changes.",
        "Multiple backdrop setups.",
        "15 professionally edited photos.",
        "Advanced beauty retouching.",
        "Social media-ready images.",
        "30-second birthday reel."
      ],
      tags: ["15 photos", "3 outfits", "Reel included"]
    },
    {
      title: "Luxury Birthday Package",
      category: "Birthday shoot",
      location: "In-studio",
      price: "GHS 2,500+",
      tone: "portrait",
      photo: "assets/photos/traditional-props.jpg",
      bullets: [
        "Up to 3-hour studio session.",
        "Unlimited outfit changes.",
        "Premium themed setup.",
        "25 edited photos.",
        "Cinematic birthday reel.",
        "Premium retouching.",
        "One framed portrait (A3 size)."
      ],
      tags: ["25 photos", "Unlimited outfits", "A3 portrait"]
    },
    {
      title: "Outdoor Birthday Mini",
      category: "Birthday shoot",
      location: "Location",
      price: "GHS 700",
      tone: "portrait",
      photo: "assets/photos/studio-portrait.jpg",
      bullets: [
        "45-minute outdoor location session.",
        "1 outfit.",
        "Natural and golden hour setup.",
        "8 professionally edited photos.",
        "Soft copies delivered online."
      ],
      tags: ["8 photos", "Outdoor", "45 mins"]
    },
    {
      title: "Outdoor Birthday Classic",
      category: "Birthday shoot",
      location: "Location",
      price: "GHS 1,200",
      tone: "portrait",
      photo: "assets/photos/traditional-props.jpg",
      bullets: [
        "1.5-hour outdoor location session.",
        "Up to 2 outfit changes.",
        "Multiple scenic setups.",
        "12 professionally edited photos.",
        "Basic retouching.",
        "Online gallery delivery."
      ],
      tags: ["12 photos", "2 outfits", "Scenic locations"]
    },
    {
      title: "Outdoor Birthday Premium",
      category: "Birthday shoot",
      location: "Location",
      price: "GHS 1,800",
      tone: "portrait",
      photo: "assets/photos/studio-portrait.jpg",
      bullets: [
        "2.5-hour outdoor location session.",
        "Up to 3 outfit changes.",
        "Premium location scouting.",
        "20 professionally edited photos.",
        "Advanced beauty retouching.",
        "Drone aerial shots (weather permitting).",
        "Social media content ready."
      ],
      tags: ["20 photos", "3 outfits", "Drone included"]
    },
    {
      title: "Outdoor Birthday Luxury",
      category: "Birthday shoot",
      location: "Location",
      price: "GHS 2,800+",
      tone: "portrait",
      photo: "assets/photos/traditional-props.jpg",
      bullets: [
        "Up to 4-hour outdoor location experience.",
        "Unlimited outfit changes.",
        "Multiple premium locations.",
        "30+ professionally edited photos.",
        "Cinematic reel with location highlights.",
        "Premium retouching.",
        "One framed portrait.",
        "Drone aerial cinematography included."
      ],
      tags: ["30+ photos", "Multiple locations", "Cinematic"]
    }
  ],
  streaming: [
    {
      title: "Standard Live Streaming",
      category: "Live streaming",
      price: "GHS 5,500",
      tone: "streaming",
      photo: "assets/photos/funeral-service.jpg",
      featured: true,
      bullets: [
        "Professional 1080p multi-camera streaming with crystal-clear audio broadcast.",
        "Direct RTMP broadcast setup for YouTube, Facebook Live, or private portals.",
        "Dedicated wireless bonding network for reliable coverage.",
        "Remote viewing access with live viewer interaction and chat support."
      ],
      tags: ["1080p Broadcast", "Multi-Camera Setup", "RTMP Streaming"]
    },
    {
      title: "Thanksgiving / Lunch Stream",
      category: "Event live coverage",
      price: "GHS 5,500",
      tone: "streaming",
      photo: "assets/photos/wedding-party.jpg",
      bullets: [
        "5 hours of thanksgiving or lunch event coverage.",
        "Works as a standalone coverage option or an event add-on.",
        "Best for shorter programs with a defined running order."
      ],
      tags: ["5 hours", "Lunch event", "Add-on ready"]
    },
    {
      title: "Drone Stream Add-On",
      category: "Aerial coverage",
      price: "GHS 2,500",
      tone: "streaming",
      photo: "assets/photos/funeral-service.jpg",
      bullets: [
        "Drone coverage for establishing shots and cinematic aerial context.",
        "Pairs well with live streaming, wedding, and funeral packages.",
        "Location and weather conditions may affect availability."
      ],
      tags: ["Drone", "Aerials", "Event add-on"]
    }
  ],
  funeral: [
    {
      title: "Funeral Coverage 2025",
      category: "Event documentation",
      price: "GHS 6,500",
      tone: "funeral",
      photo: "assets/photos/funeral-moment.jpg",
      featured: true,
      bullets: [
        "Photography coverage.",
        "Video post-production.",
        "Drone shots.",
        "Photobook.",
        "All edited soft copies."
      ],
      tags: ["Photo", "Video", "Drone", "Photobook"]
    }
  ]
};

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
    packageGrid.classList.remove("portrait-carousel");
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
    
    packageGrid.classList.add("portrait-carousel");
    packageGrid.innerHTML = filteredItems.length
      ? filteredItems.map(renderPackageCard).join("")
      : `<div class="empty-state">No ${filterInfo.label} packages available yet.</div>`;
    return;
  }

  packageGrid.classList.remove("portrait-carousel");
  const groupedPackages = packages[category].reduce((groups, item) => {
    groups[item.category] = groups[item.category] || [];
    groups[item.category].push(item);
    return groups;
  }, {});

  packageGrid.innerHTML = Object.entries(groupedPackages).map(([group, items]) => `
    <section class="package-group">
      <div class="package-group-title">${group}</div>
      ${items.map((item) => `
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
      `).join("")}
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
window.addEventListener("scroll", () => {
  if (window.scrollY > 500) {
    backToTop.classList.add("visible");
  } else {
    backToTop.classList.remove("visible");
  }
}, { passive: true });

if (typeof galleryData !== "undefined") {
  initGallery("all");
}

renderPackages(activeCategory);
renderExtras();
