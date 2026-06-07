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
      title: "Studio Mini",
      category: "Photoshoot",
      price: "GHS 200",
      tone: "portrait",
      photo: "assets/photos/studio-portrait.jpg",
      featured: true,
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
    }
  ],
  streaming: [
    {
      title: "Standard Live Streaming",
      category: "Live streaming",
      price: "GHS 4,000",
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
      price: "GHS 5,000",
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
  ["Event Live Streaming", "GHS 4,000"],
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
  ["Adult kente traditional props", "GHS 700"],
  ["Adult props with makeup and 4 retouched pictures", "GHS 1,000"],
  ["Child kente traditional props", "GHS 400"],
  ["Child props with makeup and 3 retouched pictures", "GHS 800"]
];

const packageGrid = document.querySelector("[data-package-grid]");
const packageTabs = document.querySelectorAll("#packages .tab");
const extrasList = document.querySelector("[data-extras-list]");
let activeCategory = "wedding";

function renderPackages(category) {
  packageGrid.innerHTML = packages[category].map((item) => `
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
  return `
    <div class="gallery-item image-item" data-src="${item.src}" data-type="image" role="button" tabindex="0">
      <img src="${item.src}" loading="lazy" alt="Gallery photo">
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
