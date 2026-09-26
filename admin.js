/**
 * Anfal Enterprises - Management Console Controller (admin.js)
 * Coordinates:
 * 1. Dashboard: Metrics & Live Activity
 * 2. Home Page CMS: Hero Background Image, Copy, CTAs & Featured Products CRUD
 * 3. Facility Page CMS: Full-Bleed 2D Backdrop Image & 4 Infrastructure Pillars
 * 4. Team CMS: Executive Leadership Directory CRUD & Portrait Photo Upload
 * 5. Contact CMS: Commercial Details & Google Maps Live Interactive Map (Click to Pick)
 * 6. Brands CMS: Full-Bleed Packaging Cards & Client-Side Color Extraction
 * 7. Wholesale Enquiries: Lead Management, Status Updates & Safe Operations
 * 8. Backup & Data Tools: JSON Snapshot Export, Restore & Reset
 */

let adminMap = null;
let adminMarker = null;

// Ensure document is loaded
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initAdmin);
} else {
  initAdmin();
}

function initAdmin() {
  setupTabs();
  setupModalBackdropListeners();
  renderDashboardStats();
  renderDashboardActivity();
  
  // Home Section CMS
  loadHomeCms();
  setupHomeHeroForm();
  renderHomeProductsTable();
  setupProductModal();

  // Facility Section CMS
  loadFacilityCms();
  setupFacilityForm();

  // Team Section CMS
  renderTeamDirectory();
  setupTeamModal();

  // Contact Section CMS & Live Google Map
  loadContactCms();
  setupContactForm();
  setupContactMap();

  // Brands Section CMS
  renderBrands();
  setupBrandModalAndUpload();

  // Wholesale Enquiries
  renderEnquiries();
  setupEnquiryModal();

  // Maintenance & System Tools
  setupTools();
}

/**
 * =========================================================================
 * MODAL MANAGER (Robust Show/Hide Helper)
 * =========================================================================
 */
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) {
    console.error(`Modal with id "${modalId}" not found.`);
    return;
  }
  modal.classList.remove("hidden");
  modal.style.display = "flex";
  
  // Focus first visible input
  const firstInput = modal.querySelector("input:not([type=hidden]), textarea, select");
  if (firstInput) {
    setTimeout(() => firstInput.focus(), 50);
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;
  modal.classList.add("hidden");
  modal.style.display = "none";
}

function setupModalBackdropListeners() {
  const modalIds = ["product-modal", "team-modal", "brand-modal", "enquiry-modal"];
  modalIds.forEach(id => {
    const modal = document.getElementById(id);
    if (modal) {
      modal.addEventListener("click", (e) => {
        if (e.target === modal) {
          closeModal(id);
        }
      });
    }
  });

  // ESC key closes any open modal
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      modalIds.forEach(id => closeModal(id));
    }
  });
}

/**
 * =========================================================================
 * NAVIGATION & TAB SWITCHER
 * =========================================================================
 */
function setupTabs() {
  const tabButtons = document.querySelectorAll(".admin-tab-btn");
  tabButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const tabId = btn.getAttribute("data-tab");
      switchTab(tabId);
    });
  });
}

function switchTab(tabId) {
  const tabButtons = document.querySelectorAll(".admin-tab-btn");
  const tabContents = document.querySelectorAll(".tab-content");

  tabButtons.forEach(btn => {
    if (btn.getAttribute("data-tab") === tabId) {
      btn.classList.add("bg-primary", "text-on-primary", "shadow-sm");
      btn.classList.remove("text-on-surface-variant", "hover:bg-surface-container-low");
    } else {
      btn.classList.remove("bg-primary", "text-on-primary", "shadow-sm");
      btn.classList.add("text-on-surface-variant", "hover:bg-surface-container-low");
    }
  });

  tabContents.forEach(content => {
    if (content.id === `tab-${tabId}`) {
      content.classList.add("active");
    } else {
      content.classList.remove("active");
    }
  });

  // Re-render corresponding tab data & trigger leaflet resize if contact tab
  if (tabId === "dashboard") {
    renderDashboardStats();
    renderDashboardActivity();
  } else if (tabId === "home") {
    loadHomeCms();
    renderHomeProductsTable();
  } else if (tabId === "facility") {
    loadFacilityCms();
  } else if (tabId === "team") {
    renderTeamDirectory();
  } else if (tabId === "contact") {
    loadContactCms();
    if (adminMap) {
      setTimeout(() => {
        adminMap.invalidateSize();
      }, 200);
    }
  } else if (tabId === "brands") {
    renderBrands();
  } else if (tabId === "enquiries") {
    renderEnquiries();
  }
}

/**
 * =========================================================================
 * 1. DASHBOARD OVERVIEW & ACTIVITY
 * =========================================================================
 */
function renderDashboardStats() {
  const enquiries = CMS.getEnquiries();
  const brands = CMS.getBrands();
  const team = CMS.getTeam();
  const products = CMS.getFeaturedProducts();

  const newEnquiriesCount = enquiries.filter(e => e.status === "New").length;

  const statEnq = document.getElementById("stat-enquiries-count");
  if (statEnq) statEnq.textContent = newEnquiriesCount;

  const statBrands = document.getElementById("stat-brands-count");
  if (statBrands) statBrands.textContent = brands.length;

  const statTeam = document.getElementById("stat-team-count");
  if (statTeam) statTeam.textContent = team.length;

  const statProds = document.getElementById("stat-products-count");
  if (statProds) statProds.textContent = products.length;

  const badgeEnq = document.getElementById("badge-enquiries-count");
  if (badgeEnq) badgeEnq.textContent = newEnquiriesCount;

  const badgeBrands = document.getElementById("badge-brands-count");
  if (badgeBrands) badgeBrands.textContent = brands.length;

  const badgeTeam = document.getElementById("badge-team-count");
  if (badgeTeam) badgeTeam.textContent = team.length;

  // Recent enquiries list in dashboard
  const recentContainer = document.getElementById("dashboard-recent-enquiries");
  if (!recentContainer) return;

  if (enquiries.length === 0) {
    recentContainer.innerHTML = `
      <div class="p-8 text-center text-on-surface-variant text-xs">
        <span class="material-symbols-outlined text-[32px] text-outline mb-1 block">inbox</span>
        No wholesale inquiries yet. Incoming requests from the storefront will appear here.
      </div>
    `;
    return;
  }

  const top3 = enquiries.slice(0, 3);
  recentContainer.innerHTML = top3.map(enq => `
    <div class="p-3.5 rounded-2xl bg-surface-container-low hover:bg-surface-container flex items-center justify-between gap-4 transition-all">
      <div class="flex items-center gap-3 min-w-0">
        <div class="w-9 h-9 rounded-xl ${enq.status === 'New' ? 'bg-secondary-fixed text-secondary' : 'bg-surface-container text-on-surface-variant'} flex items-center justify-center shrink-0 font-bold text-xs">
          <span class="material-symbols-outlined text-[18px]">store</span>
        </div>
        <div class="truncate">
          <div class="flex items-center gap-2">
            <span class="font-headline-sm text-xs font-bold text-primary truncate">${escapeHtml(enq.company || enq.name)}</span>
            <span class="px-2 py-0.5 rounded-full text-[9px] font-extrabold ${enq.status === 'New' ? 'bg-secondary-fixed text-secondary' : 'bg-slate-200 text-slate-700'}">${escapeHtml(enq.status)}</span>
          </div>
          <p class="text-[11px] text-on-surface-variant truncate">${escapeHtml(enq.message || enq.phone)}</p>
        </div>
      </div>
      <button onclick="openEnquiryModal('${enq.id}')" class="shrink-0 text-xs font-bold text-primary hover:text-secondary px-3 py-1.5 rounded-lg bg-surface-container-lowest border border-outline-variant/30 transition-colors">
        Review →
      </button>
    </div>
  `).join("");
}

function renderDashboardActivity() {
  const container = document.getElementById("dashboard-activity-log");
  if (!container) return;

  const activities = CMS.getActivityLog();
  if (!activities || activities.length === 0) {
    container.innerHTML = `<p class="text-on-surface-variant text-xs italic">No recent activity recorded.</p>`;
    return;
  }

  container.innerHTML = activities.slice(0, 5).map(act => `
    <div class="flex items-center justify-between gap-2 py-1.5 border-b border-outline-variant/10 last:border-0">
      <div class="flex items-center gap-2 min-w-0">
        <span class="material-symbols-outlined text-[15px] text-secondary">check_circle</span>
        <span class="text-xs font-semibold text-slate-800 truncate">${escapeHtml(act.message)}</span>
      </div>
      <span class="text-[10px] text-slate-400 font-mono shrink-0">${escapeHtml(act.time || "")}</span>
    </div>
  `).join("");
}

/**
 * =========================================================================
 * 2. HOME PAGE CMS & FEATURED PRODUCTS
 * =========================================================================
 */
function loadHomeCms() {
  const homeData = CMS.getHomeData();
  
  const heroImg = document.getElementById("home-hero-preview");
  const heroVal = document.getElementById("home-hero-image-val");
  const badgeInput = document.getElementById("home-hero-badge");
  const headingInput = document.getElementById("home-hero-heading");
  const taglineInput = document.getElementById("home-hero-tagline");
  const ctaTextInput = document.getElementById("home-hero-cta-text");
  const ctaLinkInput = document.getElementById("home-hero-cta-link");

  if (heroImg) heroImg.src = homeData.heroImage || "assets/images/facility-full.jpg";
  if (heroVal) heroVal.value = homeData.heroImage || "";
  if (badgeInput) badgeInput.value = homeData.heroBadge || "";
  if (headingInput) headingInput.value = homeData.heroHeading || "";
  if (taglineInput) taglineInput.value = homeData.heroTagline || "";
  if (ctaTextInput) ctaTextInput.value = homeData.heroCtaText || "";
  if (ctaLinkInput) ctaLinkInput.value = homeData.heroCtaLink || "";
}

function setupHomeHeroForm() {
  const fileInput = document.getElementById("home-hero-file");
  const heroImg = document.getElementById("home-hero-preview");
  const heroVal = document.getElementById("home-hero-image-val");
  const removeBtn = document.getElementById("btn-remove-hero-img");
  const form = document.getElementById("form-home-hero");

  if (fileInput) {
    fileInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (!file) return;

      if (!file.type.startsWith("image/")) {
        showToast("Please upload an image file (JPEG, PNG, WebP).", "error");
        return;
      }

      const reader = new FileReader();
      reader.onload = (ev) => {
        const rawData = ev.target.result;
        compressImage(rawData, 1600, 0.82, (compressed) => {
          heroImg.src = compressed;
          heroVal.value = compressed;
          showToast("Hero image prepared. Click 'Save Hero Content' to publish.", "info");
        });
      };
      reader.readAsDataURL(file);
    });
  }

  if (removeBtn) {
    removeBtn.addEventListener("click", () => {
      heroImg.src = "assets/images/facility-full.jpg";
      heroVal.value = "assets/images/facility-full.jpg";
      showToast("Reset to default hero backdrop.", "info");
    });
  }

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const updated = {
        heroBadge: document.getElementById("home-hero-badge").value.trim(),
        heroHeading: document.getElementById("home-hero-heading").value.trim(),
        heroTagline: document.getElementById("home-hero-tagline").value.trim(),
        heroCtaText: document.getElementById("home-hero-cta-text").value.trim(),
        heroCtaLink: document.getElementById("home-hero-cta-link").value.trim(),
        heroImage: document.getElementById("home-hero-image-val").value.trim() || "assets/images/facility-full.jpg"
      };

      CMS.saveHomeData(updated);
      showToast("Home hero content & image saved successfully!");
      renderDashboardActivity();
    });
  }
}

// Featured Products Table
function renderHomeProductsTable() {
  const tbody = document.getElementById("home-products-tbody");
  if (!tbody) return;

  const products = CMS.getFeaturedProducts();
  if (products.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" class="text-center py-8 text-on-surface-variant text-xs">
          No featured products added. Click "Add Featured Product" to create one.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = products.map(prod => `
    <tr class="hover:bg-surface-container-low transition-colors">
      <td class="py-3 px-4 font-mono text-xs font-bold text-slate-500">#${prod.order || 1}</td>
      <td class="py-3 px-4">
        <div class="w-12 h-12 rounded-xl bg-white border border-outline-variant/30 flex items-center justify-center p-1 overflow-hidden">
          <img src="${escapeHtml(prod.image)}" alt="${escapeHtml(prod.name)}" class="max-h-full object-contain" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'40\\' height=\\'40\\'><rect fill=\\'%23eee\\' width=\\'40\\' height=\\'40\\'/></svg>'"/>
        </div>
      </td>
      <td class="py-3 px-4 font-bold text-primary text-sm">${escapeHtml(prod.name)}</td>
      <td class="py-3 px-4 text-xs font-semibold text-slate-700">${escapeHtml(prod.brand)}</td>
      <td class="py-3 px-4 text-xs text-on-surface-variant">${escapeHtml(prod.category || "-")}</td>
      <td class="py-3 px-4">
        <span class="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-secondary-fixed text-secondary">
          ${escapeHtml(prod.badge || "Direct")}
        </span>
      </td>
      <td class="py-3 px-4">
        <span class="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${prod.active !== false ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'}">
          ${prod.active !== false ? 'PUBLISHED' : 'HIDDEN'}
        </span>
      </td>
      <td class="py-3 px-4 text-right">
        <div class="flex items-center justify-end gap-1.5">
          <button type="button" onclick="editProduct('${prod.id}')" class="p-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-primary transition-colors" title="Edit Product">
            <span class="material-symbols-outlined text-[16px]">edit</span>
          </button>
          <button type="button" onclick="deleteProduct('${prod.id}', '${escapeHtml(prod.name)}')" class="p-1.5 rounded-lg bg-surface-container hover:bg-error-container text-on-surface-variant hover:text-error transition-colors" title="Delete Product">
            <span class="material-symbols-outlined text-[16px]">delete</span>
          </button>
        </div>
      </td>
    </tr>
  `).join("");
}

function setupProductModal() {
  const form = document.getElementById("product-modal-form");
  const fileInput = document.getElementById("pm-image-file");
  const imgUrl = document.getElementById("pm-image-url");
  const previewImg = document.getElementById("pm-image-preview");

  if (fileInput) {
    fileInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (ev) => {
        compressImage(ev.target.result, 800, 0.85, (compressed) => {
          previewImg.src = compressed;
          imgUrl.value = compressed;
        });
      };
      reader.readAsDataURL(file);
    });
  }

  if (imgUrl) {
    imgUrl.addEventListener("input", () => {
      previewImg.src = imgUrl.value.trim();
    });
  }

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const id = document.getElementById("pm-id").value;
      const productObj = {
        name: document.getElementById("pm-name").value.trim(),
        brand: document.getElementById("pm-brand").value.trim(),
        category: document.getElementById("pm-category").value.trim(),
        badge: document.getElementById("pm-badge").value.trim() || "Wholesale Ready",
        order: parseInt(document.getElementById("pm-order").value) || 1,
        active: document.getElementById("pm-active").checked,
        image: document.getElementById("pm-image-url").value.trim() || previewImg.src || "assets/images/facility-full.jpg"
      };

      if (id) {
        CMS.updateFeaturedProduct(id, productObj);
        showToast("Product updated successfully!");
      } else {
        CMS.addFeaturedProduct(productObj);
        showToast("New featured product added!");
      }

      closeProductModal();
      renderHomeProductsTable();
      renderDashboardStats();
      renderDashboardActivity();
    });
  }
}

function openAddProductModal() {
  document.getElementById("product-modal-title").textContent = "Add Featured Product";
  document.getElementById("pm-id").value = "";
  document.getElementById("pm-name").value = "";
  document.getElementById("pm-brand").value = "";
  document.getElementById("pm-category").value = "";
  document.getElementById("pm-badge").value = "Direct Wholesale";
  document.getElementById("pm-order").value = (CMS.getFeaturedProducts().length + 1);
  document.getElementById("pm-active").checked = true;
  document.getElementById("pm-image-url").value = "";
  document.getElementById("pm-image-preview").src = "https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&auto=format&fit=crop&q=60";
  
  openModal("product-modal");
}

function editProduct(id) {
  const prod = CMS.getFeaturedProductById(id);
  if (!prod) {
    showToast("Product not found.", "error");
    return;
  }

  document.getElementById("product-modal-title").textContent = "Edit Featured Product";
  document.getElementById("pm-id").value = prod.id;
  document.getElementById("pm-name").value = prod.name || "";
  document.getElementById("pm-brand").value = prod.brand || "";
  document.getElementById("pm-category").value = prod.category || "";
  document.getElementById("pm-badge").value = prod.badge || "Direct Wholesale";
  document.getElementById("pm-order").value = prod.order || 1;
  document.getElementById("pm-active").checked = prod.active !== false;
  document.getElementById("pm-image-url").value = prod.image || "";
  document.getElementById("pm-image-preview").src = prod.image || "https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&auto=format&fit=crop&q=60";

  openModal("product-modal");
}

function closeProductModal() {
  closeModal("product-modal");
}

function deleteProduct(id, name) {
  if (confirm(`Delete featured product "${name}"? This will remove it from the home page showcase.`)) {
    CMS.deleteFeaturedProduct(id);
    showToast("Product deleted.");
    renderHomeProductsTable();
    renderDashboardStats();
    renderDashboardActivity();
  }
}

/**
 * =========================================================================
 * 3. FACILITY PAGE CMS
 * =========================================================================
 */
function loadFacilityCms() {
  const fac = CMS.getFacilityData();
  
  const bgImg = document.getElementById("facility-cms-bg-preview");
  const bgUrl = document.getElementById("facility-bg-url");
  
  if (bgImg) bgImg.src = fac.backgroundImage || "assets/images/facility-full.jpg";
  if (bgUrl) bgUrl.value = fac.backgroundImage || "";

  const pill = document.getElementById("fac-location-pill");
  const eyebrow = document.getElementById("fac-eyebrow");
  const heading = document.getElementById("fac-heading");
  const tagline = document.getElementById("fac-tagline");

  if (pill) pill.value = fac.locationPill || "";
  if (eyebrow) eyebrow.value = fac.eyebrow || "";
  if (heading) heading.value = fac.heading || "";
  if (tagline) tagline.value = fac.tagline || "";

  // 4 Features
  const features = fac.features || [];
  if (features[0]) {
    document.getElementById("fac-f1-title").value = features[0].title || "";
    document.getElementById("fac-f1-desc").value = features[0].desc || "";
  }
  if (features[1]) {
    document.getElementById("fac-f2-title").value = features[1].title || "";
    document.getElementById("fac-f2-desc").value = features[1].desc || "";
  }
  if (features[2]) {
    document.getElementById("fac-f3-title").value = features[2].title || "";
    document.getElementById("fac-f3-desc").value = features[2].desc || "";
  }
  if (features[3]) {
    document.getElementById("fac-f4-title").value = features[3].title || "";
    document.getElementById("fac-f4-desc").value = features[3].desc || "";
  }

  const leaderTag = document.getElementById("fac-leader-tag");
  const ctaText = document.getElementById("fac-cta-text");
  const ctaLink = document.getElementById("fac-cta-link");

  if (leaderTag) leaderTag.value = fac.bottomLeaderTag || "";
  if (ctaText) ctaText.value = fac.ctaText || "";
  if (ctaLink) ctaLink.value = fac.ctaLink || "";
}

function setupFacilityForm() {
  const dropzone = document.getElementById("dropzone-facility-cms");
  const fileInput = document.getElementById("file-facility-cms");
  const bgImg = document.getElementById("facility-cms-bg-preview");
  const bgUrl = document.getElementById("facility-bg-url");
  const presetBtn = document.getElementById("btn-preset-facility-default");
  const form = document.getElementById("form-facility-cms");

  if (dropzone && fileInput) {
    dropzone.addEventListener("click", () => fileInput.click());
    
    dropzone.addEventListener("dragover", (e) => {
      e.preventDefault();
      dropzone.classList.add("dragover");
    });
    dropzone.addEventListener("dragleave", () => {
      dropzone.classList.remove("dragover");
    });
    dropzone.addEventListener("drop", (e) => {
      e.preventDefault();
      dropzone.classList.remove("dragover");
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFacilityFile(e.dataTransfer.files[0]);
      }
    });

    fileInput.addEventListener("change", (e) => {
      if (e.target.files && e.target.files[0]) {
        handleFacilityFile(e.target.files[0]);
      }
    });
  }

  function handleFacilityFile(file) {
    if (!file.type.startsWith("image/")) {
      showToast("Please upload an image file (JPEG, PNG, WebP).", "error");
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      compressImage(ev.target.result, 1600, 0.82, (compressed) => {
        bgImg.src = compressed;
        bgUrl.value = compressed;
        showToast("Facility image loaded. Click 'Save Facility Page' to publish.", "info");
      });
    };
    reader.readAsDataURL(file);
  }

  if (bgUrl) {
    bgUrl.addEventListener("input", () => {
      bgImg.src = bgUrl.value.trim();
    });
  }

  if (presetBtn) {
    presetBtn.addEventListener("click", () => {
      bgImg.src = "assets/images/facility-full.jpg";
      bgUrl.value = "assets/images/facility-full.jpg";
      showToast("Preset Bhatkal HQ facility image selected.", "info");
    });
  }

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const updated = {
        backgroundImage: bgUrl.value.trim() || "assets/images/facility-full.jpg",
        locationPill: document.getElementById("fac-location-pill").value.trim(),
        eyebrow: document.getElementById("fac-eyebrow").value.trim(),
        heading: document.getElementById("fac-heading").value.trim(),
        tagline: document.getElementById("fac-tagline").value.trim(),
        features: [
          {
            title: document.getElementById("fac-f1-title").value.trim(),
            desc: document.getElementById("fac-f1-desc").value.trim()
          },
          {
            title: document.getElementById("fac-f2-title").value.trim(),
            desc: document.getElementById("fac-f2-desc").value.trim()
          },
          {
            title: document.getElementById("fac-f3-title").value.trim(),
            desc: document.getElementById("fac-f3-desc").value.trim()
          },
          {
            title: document.getElementById("fac-f4-title").value.trim(),
            desc: document.getElementById("fac-f4-desc").value.trim()
          }
        ],
        bottomLeaderTag: document.getElementById("fac-leader-tag").value.trim(),
        ctaText: document.getElementById("fac-cta-text").value.trim(),
        ctaLink: document.getElementById("fac-cta-link").value.trim()
      };

      CMS.saveFacilityData(updated);
      showToast("Facility page content & background photo saved successfully!");
      renderDashboardActivity();
    });
  }
}

/**
 * =========================================================================
 * 4. TEAM ROSTER MANAGEMENT
 * =========================================================================
 */
function renderTeamDirectory() {
  const tbody = document.getElementById("admin-team-tbody");
  if (!tbody) return;

  const team = CMS.getTeam();
  if (team.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" class="text-center py-8 text-on-surface-variant text-xs">
          No team members registered. Click "Add Team Member" to add one.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = team.map(member => `
    <tr class="hover:bg-surface-container-low transition-colors">
      <td class="py-3 px-4 font-mono text-xs font-bold text-slate-500">#${member.order || 1}</td>
      <td class="py-3 px-4">
        <div class="w-10 h-10 rounded-full bg-slate-200 border border-outline-variant/40 overflow-hidden shrink-0">
          <img src="${escapeHtml(member.image)}" alt="${escapeHtml(member.name)}" class="w-full h-full object-cover" onerror="this.src='https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'"/>
        </div>
      </td>
      <td class="py-3 px-4 font-bold text-primary text-sm">${escapeHtml(member.name)}</td>
      <td class="py-3 px-4 text-xs font-semibold text-slate-700">${escapeHtml(member.role)}</td>
      <td class="py-3 px-4 text-xs font-mono font-semibold text-primary">${escapeHtml(member.phone || "-")}</td>
      <td class="py-3 px-4">
        <span class="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${member.active !== false ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'}">
          ${member.active !== false ? 'ACTIVE' : 'HIDDEN'}
        </span>
      </td>
      <td class="py-3 px-4 text-right">
        <div class="flex items-center justify-end gap-1.5">
          <button type="button" onclick="editTeamMember('${member.id}')" class="p-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-primary transition-colors" title="Edit Member">
            <span class="material-symbols-outlined text-[16px]">edit</span>
          </button>
          <button type="button" onclick="deleteTeamMember('${member.id}', '${escapeHtml(member.name)}')" class="p-1.5 rounded-lg bg-surface-container hover:bg-error-container text-on-surface-variant hover:text-error transition-colors" title="Delete Member">
            <span class="material-symbols-outlined text-[16px]">delete</span>
          </button>
        </div>
      </td>
    </tr>
  `).join("");
}

function setupTeamModal() {
  const form = document.getElementById("team-modal-form");
  const fileInput = document.getElementById("tm-avatar-file");
  const imgUrl = document.getElementById("tm-avatar-url");
  const previewImg = document.getElementById("tm-avatar-preview");

  if (fileInput) {
    fileInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (ev) => {
        compressImage(ev.target.result, 600, 0.85, (compressed) => {
          previewImg.src = compressed;
          imgUrl.value = compressed;
        });
      };
      reader.readAsDataURL(file);
    });
  }

  if (imgUrl) {
    imgUrl.addEventListener("input", () => {
      previewImg.src = imgUrl.value.trim();
    });
  }

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const id = document.getElementById("tm-id").value;
      const memberObj = {
        name: document.getElementById("tm-name").value.trim(),
        role: document.getElementById("tm-role").value.trim(),
        phone: document.getElementById("tm-phone").value.trim(),
        bio: document.getElementById("tm-bio").value.trim(),
        order: parseInt(document.getElementById("tm-order").value) || 1,
        active: document.getElementById("tm-active").checked,
        image: document.getElementById("tm-avatar-url").value.trim() || previewImg.src || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80"
      };

      if (id) {
        CMS.updateTeamMember(id, memberObj);
        showToast("Team member profile updated!");
      } else {
        CMS.addTeamMember(memberObj);
        showToast("New leadership member added!");
      }

      closeTeamModal();
      renderTeamDirectory();
      renderDashboardStats();
      renderDashboardActivity();
    });
  }
}

function openAddTeamModal() {
  document.getElementById("team-modal-title").textContent = "Add Team Member";
  document.getElementById("tm-id").value = "";
  document.getElementById("tm-name").value = "";
  document.getElementById("tm-role").value = "";
  document.getElementById("tm-phone").value = "+91 8385 226700";
  document.getElementById("tm-bio").value = "";
  document.getElementById("tm-order").value = (CMS.getTeam().length + 1);
  document.getElementById("tm-active").checked = true;
  document.getElementById("tm-avatar-url").value = "";
  document.getElementById("tm-avatar-preview").src = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80";

  openModal("team-modal");
}

function editTeamMember(id) {
  const member = CMS.getTeamMemberById(id);
  if (!member) {
    showToast("Team member not found.", "error");
    return;
  }

  document.getElementById("team-modal-title").textContent = "Edit Team Member";
  document.getElementById("tm-id").value = member.id;
  document.getElementById("tm-name").value = member.name || "";
  document.getElementById("tm-role").value = member.role || "";
  document.getElementById("tm-phone").value = member.phone || "";
  document.getElementById("tm-bio").value = member.bio || "";
  document.getElementById("tm-order").value = member.order || 1;
  document.getElementById("tm-active").checked = member.active !== false;
  document.getElementById("tm-avatar-url").value = member.image || "";
  document.getElementById("tm-avatar-preview").src = member.image || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80";

  openModal("team-modal");
}

function closeTeamModal() {
  closeModal("team-modal");
}

function deleteTeamMember(id, name) {
  if (confirm(`Remove executive member "${name}" from the directory?`)) {
    CMS.deleteTeamMember(id);
    showToast("Team member removed.");
    renderTeamDirectory();
    renderDashboardStats();
    renderDashboardActivity();
  }
}

/**
 * =========================================================================
 * 5. CONTACT PAGE & GOOGLE MAPS LIVE INTERACTIVE MAP (Click to Pick)
 * =========================================================================
 */
function loadContactCms() {
  const contact = CMS.getContactData();

  const heading = document.getElementById("contact-heading");
  const subtitle = document.getElementById("contact-subtitle");
  const phone = document.getElementById("contact-phone");
  const wa = document.getElementById("contact-whatsapp");
  const email = document.getElementById("contact-email");
  const hours = document.getElementById("contact-hours");
  const address = document.getElementById("contact-address");

  if (heading) heading.value = contact.heading || "";
  if (subtitle) subtitle.value = contact.subtitle || "";
  if (phone) phone.value = contact.phone || "";
  if (wa) wa.value = contact.whatsapp || "";
  if (email) email.value = contact.email || "";
  if (hours) hours.value = contact.hours || "";
  if (address) address.value = contact.address || "";

  // Map Config
  const locName = document.getElementById("map-location-name");
  const lat = document.getElementById("map-latitude");
  const lng = document.getElementById("map-longitude");
  const zoom = document.getElementById("map-zoom");
  const zoomVal = document.getElementById("map-zoom-val");
  const dirUrl = document.getElementById("map-directions-url");

  const finalLat = contact.mapLatitude || 13.9872;
  const finalLng = contact.mapLongitude || 74.5539;

  if (locName) locName.value = contact.mapLocationName || "Anfal Wholesale Depot (Bhatkal)";
  if (lat) lat.value = finalLat;
  if (lng) lng.value = finalLng;
  if (zoom) {
    zoom.value = contact.mapZoom || 15;
    if (zoomVal) zoomVal.textContent = contact.mapZoom || 15;
  }
  if (dirUrl) dirUrl.value = contact.googleMapsUrl || `https://maps.google.com/?q=${finalLat},${finalLng}`;

  // Enquiry Reasons Config
  const reasonsEl = document.getElementById("contact-enquiry-reasons");
  if (reasonsEl) {
    const reasons = CMS.getEnquiryReasons();
    reasonsEl.value = reasons.join("\n");
  }
}

function setupContactForm() {
  const form = document.getElementById("form-contact-cms");
  const zoomInput = document.getElementById("map-zoom");
  const zoomVal = document.getElementById("map-zoom-val");
  const btnUpdatePreview = document.getElementById("btn-update-map-preview");

  if (zoomInput && zoomVal) {
    zoomInput.addEventListener("input", () => {
      zoomVal.textContent = zoomInput.value;
      if (adminMap) adminMap.setZoom(parseInt(zoomInput.value));
    });
  }

  if (btnUpdatePreview) {
    btnUpdatePreview.addEventListener("click", () => {
      updateAdminMapFromInputs();
      showToast("Interactive map preview updated.", "info");
    });
  }

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const updated = {
        heading: document.getElementById("contact-heading").value.trim(),
        subtitle: document.getElementById("contact-subtitle").value.trim(),
        phone: document.getElementById("contact-phone").value.trim(),
        whatsapp: document.getElementById("contact-whatsapp").value.trim(),
        email: document.getElementById("contact-email").value.trim(),
        hours: document.getElementById("contact-hours").value.trim(),
        address: document.getElementById("contact-address").value.trim(),
        mapLocationName: document.getElementById("map-location-name").value.trim(),
        mapLatitude: parseFloat(document.getElementById("map-latitude").value) || 13.9872,
        mapLongitude: parseFloat(document.getElementById("map-longitude").value) || 74.5539,
        mapZoom: parseInt(document.getElementById("map-zoom").value) || 15,
        googleMapsUrl: document.getElementById("map-directions-url").value.trim()
      };

      const reasonsEl = document.getElementById("contact-enquiry-reasons");
      if (reasonsEl) {
        const lines = reasonsEl.value.split("\n").map(s => s.trim()).filter(Boolean);
        if (lines.length > 0) {
          updated.enquiryReasons = lines;
        }
      }

      CMS.saveContactData(updated);
      showToast("Contact details, Google Map & Enquiry Reasons saved successfully!");
      renderDashboardActivity();
    });
  }
}

function setupContactMap() {
  const mapContainer = document.getElementById("admin-interactive-map");
  if (!mapContainer || typeof L === "undefined") return;

  const contact = CMS.getContactData();
  const lat = parseFloat(contact.mapLatitude) || 13.9872;
  const lng = parseFloat(contact.mapLongitude) || 74.5539;
  const zoom = parseInt(contact.mapZoom) || 15;

  try {
    if (adminMap) {
      adminMap.remove();
      adminMap = null;
    }

    adminMap = L.map(mapContainer, {
      center: [lat, lng],
      zoom: zoom,
      scrollWheelZoom: true
    });

    // Google Maps Tile Layers (Roadmap, Hybrid Satellite, Terrain)
    const googleRoadmap = L.tileLayer("https://mt{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}", {
      maxZoom: 20,
      subdomains: ["0", "1", "2", "3"],
      attribution: "&copy; Google Maps"
    });

    const googleSatellite = L.tileLayer("https://mt{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}", {
      maxZoom: 20,
      subdomains: ["0", "1", "2", "3"],
      attribution: "&copy; Google Maps Satellite"
    });

    const googleTerrain = L.tileLayer("https://mt{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}", {
      maxZoom: 20,
      subdomains: ["0", "1", "2", "3"],
      attribution: "&copy; Google Maps Terrain"
    });

    // Default to Google Roadmap
    googleRoadmap.addTo(adminMap);

    // Layer Switcher Control
    L.control.layers({
      "Google Maps (Road)": googleRoadmap,
      "Google Satellite Hybrid": googleSatellite,
      "Google Terrain": googleTerrain
    }, null, { position: "topright" }).addTo(adminMap);

    // Custom Draggable Pin Marker
    adminMarker = L.marker([lat, lng], { draggable: true }).addTo(adminMap);
    adminMarker.bindPopup(`<b>${escapeHtml(contact.mapLocationName || 'Anfal Wholesale Depot')}</b><br><span style="color:#0a192f;font-weight:bold;">📍 Click or drag pin to relocate</span><br>Lat: ${lat.toFixed(5)}, Lng: ${lng.toFixed(5)}`).openPopup();

    // Helper: update inputs when marker moves (by click or drag)
    function syncCoordinates(newLat, newLng, origin = "click") {
      const latFixed = Number(newLat).toFixed(6);
      const lngFixed = Number(newLng).toFixed(6);
      
      const latInput = document.getElementById("map-latitude");
      const lngInput = document.getElementById("map-longitude");
      const dirInput = document.getElementById("map-directions-url");
      const locName = document.getElementById("map-location-name") ? document.getElementById("map-location-name").value.trim() : "Anfal Wholesale Depot";

      if (latInput) latInput.value = latFixed;
      if (lngInput) lngInput.value = lngFixed;
      if (dirInput) dirInput.value = `https://maps.google.com/?q=${latFixed},${lngFixed}`;

      const indicator = document.getElementById("map-coords-indicator");
      if (indicator) {
        indicator.textContent = `Coordinates: ${Number(newLat).toFixed(4)}° N, ${Number(newLng).toFixed(4)}° E (Updated)`;
      }

      adminMarker.setLatLng([newLat, newLng]);
      adminMarker.setPopupContent(`<b>${escapeHtml(locName)}</b><br><span style="color:#c51d24;font-weight:bold;">✓ New Depot Pin Position</span><br>Lat: ${Number(newLat).toFixed(5)}, Lng: ${Number(newLng).toFixed(5)}`).openPopup();

      showToast(`📍 Location updated to [${Number(newLat).toFixed(4)}, ${Number(newLng).toFixed(4)}]. Click 'Save Contact & Map' to publish.`, "info");
    }

    // 1. CLICK ON MAP TO CHANGE LOCATION
    adminMap.on("click", function(e) {
      syncCoordinates(e.latlng.lat, e.latlng.lng, "click");
    });

    // 2. DRAG MARKER TO CHANGE LOCATION
    adminMarker.on("dragend", function(e) {
      const pos = e.target.getLatLng();
      syncCoordinates(pos.lat, pos.lng, "drag");
    });

  } catch (err) {
    console.error("Google Maps Leaflet initialization error:", err);
  }
}

function updateAdminMapFromInputs() {
  if (!adminMap || !adminMarker) return;
  const lat = parseFloat(document.getElementById("map-latitude").value) || 13.9872;
  const lng = parseFloat(document.getElementById("map-longitude").value) || 74.5539;
  const zoom = parseInt(document.getElementById("map-zoom").value) || 15;
  const locName = document.getElementById("map-location-name").value.trim() || "Anfal Wholesale Depot";

  adminMap.setView([lat, lng], zoom);
  adminMarker.setLatLng([lat, lng]);
  adminMarker.setPopupContent(`<b>${escapeHtml(locName)}</b><br><span style="color:#0a192f;font-weight:bold;">📍 Position Verified</span><br>Lat: ${lat.toFixed(5)}, Lng: ${lng.toFixed(5)}`).openPopup();

  const indicator = document.getElementById("map-coords-indicator");
  if (indicator) {
    indicator.textContent = `Coordinates: ${lat.toFixed(4)}° N, ${lng.toFixed(4)}° E`;
  }
}

/**
 * =========================================================================
 * 6. BRANDS CMS WITH COLOR EXTRACTION & FULL-BLEED CARDS
 * =========================================================================
 */
function renderBrands() {
  const container = document.getElementById("admin-brands-grid");
  if (!container) return;

  const brands = CMS.getBrands();
  if (brands.length === 0) {
    container.innerHTML = `
      <div class="col-span-full p-12 text-center text-on-surface-variant bg-surface-container-lowest rounded-3xl border border-outline-variant/30">
        <span class="material-symbols-outlined text-[48px] text-outline mb-2">category</span>
        <p class="font-headline-sm text-base font-bold text-primary">No brands configured</p>
        <p class="text-xs text-on-surface-variant mt-1">Add your authorized FMCG brand partners above.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = brands.map(brand => {
    const cardBg = brand.dominantColor || "#f1f5f9";
    const productsList = Array.isArray(brand.products) ? brand.products.join(" • ") : (brand.products || "");

    return `
      <div class="brand-cms-card rounded-3xl border border-outline-variant/30 shadow-sm overflow-hidden flex flex-col justify-between group transition-all duration-300 hover:shadow-md hover:-translate-y-1 relative" style="background: linear-gradient(145deg, #ffffff 0%, ${cardBg}30 100%);">
        
        <!-- Top Card Content -->
        <div class="p-6 space-y-4">
          <!-- Monogram & Category Row -->
          <div class="flex items-center justify-between">
            <div class="w-12 h-12 rounded-2xl flex items-center justify-center font-headline-sm font-extrabold text-sm tracking-wider shadow-sm border border-black/5" style="background-color: ${brand.dominantColor || '#0a192f'}; color: #ffffff;">
              ${escapeHtml(brand.monogram || brand.name.substring(0, 3).toUpperCase())}
            </div>

            <div class="flex items-center gap-1.5">
              <span class="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-black/5 text-slate-700">
                ${escapeHtml(brand.category || "FMCG")}
              </span>
              <span class="px-2 py-0.5 rounded-full text-[9px] font-extrabold ${brand.active !== false ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'}">
                ${brand.active !== false ? 'LIVE' : 'HIDDEN'}
              </span>
            </div>
          </div>

          <!-- Brand Title & Slogan -->
          <div>
            <h3 class="font-headline-md text-xl font-extrabold text-primary tracking-tight">${escapeHtml(brand.name)}</h3>
            <p class="text-xs text-on-surface-variant font-medium mt-1 line-clamp-2 leading-relaxed">
              ${escapeHtml(productsList)}
            </p>
          </div>
        </div>

        <!-- Full-Bleed Product Image with Overlay -->
        <div class="relative w-full h-44 overflow-hidden bg-slate-100 group/img">
          <img src="${escapeHtml(brand.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80')}" alt="${escapeHtml(brand.name)}" class="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500"/>
          <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-4 flex items-end justify-between">
            <span class="text-[10px] font-extrabold text-white/90 uppercase tracking-widest font-mono">Order #${brand.order || 1}</span>
            <span class="text-[10px] font-bold text-secondary-fixed bg-black/40 px-2 py-0.5 rounded-full backdrop-blur-sm">Edge-to-Edge Composition</span>
          </div>
        </div>

        <!-- Card Footer Actions -->
        <div class="p-4 bg-surface-container-low border-t border-outline-variant/20 flex items-center justify-between">
          <button type="button" onclick="editBrand('${brand.id}')" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-primary font-bold text-xs transition-colors">
            <span class="material-symbols-outlined text-[15px]">edit</span>
            <span>Edit</span>
          </button>
          
          <button type="button" onclick="deleteBrand('${brand.id}', '${escapeHtml(brand.name)}')" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-container hover:bg-error-container text-on-surface-variant hover:text-error font-bold text-xs transition-colors">
            <span class="material-symbols-outlined text-[15px]">delete</span>
            <span>Delete</span>
          </button>
        </div>
      </div>
    `;
  }).join("");
}

function setupBrandModalAndUpload() {
  const dropzone = document.getElementById("upload-dropzone");
  const fileInput = document.getElementById("brand-image-file-input");
  const form = document.getElementById("brand-modal-form");
  const imgUrlInput = document.getElementById("bm-image-url-input");

  if (dropzone && fileInput) {
    dropzone.addEventListener("click", () => fileInput.click());

    dropzone.addEventListener("dragover", (e) => {
      e.preventDefault();
      dropzone.classList.add("dragover");
    });
    dropzone.addEventListener("dragleave", () => {
      dropzone.classList.remove("dragover");
    });
    dropzone.addEventListener("drop", (e) => {
      e.preventDefault();
      dropzone.classList.remove("dragover");
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        processBrandImageFile(e.dataTransfer.files[0]);
      }
    });

    fileInput.addEventListener("change", (e) => {
      if (e.target.files && e.target.files[0]) {
        processBrandImageFile(e.target.files[0]);
      }
    });
  }

  if (imgUrlInput) {
    imgUrlInput.addEventListener("change", () => {
      const url = imgUrlInput.value.trim();
      if (url) {
        document.getElementById("bm-image-data").value = url;
        document.getElementById("upload-preview-thumb").src = url;
        document.getElementById("mini-preview-img").src = url;
        document.getElementById("upload-preview-box").classList.remove("hidden");
      }
    });
  }

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const id = document.getElementById("bm-id").value;
      const name = document.getElementById("bm-name").value.trim();
      const monogram = document.getElementById("bm-monogram").value.trim();
      const category = document.getElementById("bm-category").value.trim();
      const icon = document.getElementById("bm-icon").value.trim() || "category";
      const productsStr = document.getElementById("bm-products").value.trim();
      const order = parseInt(document.getElementById("bm-order").value) || 1;
      const active = document.getElementById("bm-active").checked;
      const image = document.getElementById("bm-image-data").value.trim() || document.getElementById("bm-image-url-input").value.trim() || "https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80";

      const products = productsStr.includes("•") ? productsStr.split("•").map(s => s.trim()) : productsStr.split(",").map(s => s.trim());

      const brandObj = {
        name,
        monogram,
        category,
        icon,
        products,
        order,
        active,
        image
      };

      if (id) {
        CMS.updateBrand(id, brandObj);
        showToast("Brand partner updated successfully!");
      } else {
        CMS.addBrand(brandObj);
        showToast("New brand partner added!");
      }

      closeBrandModal();
      renderBrands();
      renderDashboardStats();
      renderDashboardActivity();
    });
  }
}

function processBrandImageFile(file) {
  if (!file.type.startsWith("image/")) {
    showToast("Please upload an image file (JPEG, PNG, WebP).", "error");
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    const rawData = e.target.result;
    compressImage(rawData, 900, 0.85, (compressed) => {
      document.getElementById("bm-image-data").value = compressed;
      document.getElementById("upload-preview-thumb").src = compressed;
      document.getElementById("upload-preview-filename").textContent = file.name;
      document.getElementById("mini-preview-img").src = compressed;
      document.getElementById("upload-preview-box").classList.remove("hidden");

      // Dynamic Color Extraction
      if (typeof ColorExtractor !== "undefined") {
        ColorExtractor.extractColors(compressed, (palette) => {
          if (palette) {
            const miniCard = document.getElementById("brand-mini-card");
            if (miniCard) {
              miniCard.style.background = `linear-gradient(135deg, #ffffff 0%, ${palette.dominant}40 100%)`;
            }
          }
        });
      }
    });
  };
  reader.readAsDataURL(file);
}

function openAddBrandModal() {
  document.getElementById("brand-modal-title").textContent = "Add Brand Partner";
  document.getElementById("bm-id").value = "";
  document.getElementById("bm-name").value = "";
  document.getElementById("bm-monogram").value = "";
  document.getElementById("bm-category").value = "";
  document.getElementById("bm-icon").value = "category";
  document.getElementById("bm-products").value = "";
  document.getElementById("bm-order").value = (CMS.getBrands().length + 1);
  document.getElementById("bm-active").checked = true;
  document.getElementById("bm-image-data").value = "";
  document.getElementById("bm-image-url-input").value = "";
  document.getElementById("upload-preview-box").classList.add("hidden");

  openModal("brand-modal");
}

function editBrand(id) {
  const brand = CMS.getBrandById(id);
  if (!brand) {
    showToast("Brand not found.", "error");
    return;
  }

  document.getElementById("brand-modal-title").textContent = "Edit Brand Partner";
  document.getElementById("bm-id").value = brand.id;
  document.getElementById("bm-name").value = brand.name || "";
  document.getElementById("bm-monogram").value = brand.monogram || "";
  document.getElementById("bm-category").value = brand.category || "";
  document.getElementById("bm-icon").value = brand.icon || "category";
  document.getElementById("bm-products").value = Array.isArray(brand.products) ? brand.products.join(" • ") : (brand.products || "");
  document.getElementById("bm-order").value = brand.order || 1;
  document.getElementById("bm-active").checked = brand.active !== false;
  document.getElementById("bm-image-data").value = brand.image || "";
  document.getElementById("bm-image-url-input").value = brand.image || "";

  if (brand.image) {
    document.getElementById("upload-preview-thumb").src = brand.image;
    document.getElementById("mini-preview-img").src = brand.image;
    document.getElementById("upload-preview-filename").textContent = brand.name + " Image";
    document.getElementById("upload-preview-box").classList.remove("hidden");
  } else {
    document.getElementById("upload-preview-box").classList.add("hidden");
  }

  openModal("brand-modal");
}

function closeBrandModal() {
  closeModal("brand-modal");
}

function deleteBrand(id, name) {
  if (confirm(`Delete brand "${name}"? This will remove the brand card and its dynamic visual theme from the public website.`)) {
    CMS.deleteBrand(id);
    showToast("Brand deleted.");
    renderBrands();
    renderDashboardStats();
    renderDashboardActivity();
  }
}

/**
 * =========================================================================
 * 7. WHOLESALE ENQUIRIES MANAGEMENT
 * =========================================================================
 */
let enquiryFilter = "all";
let enquirySearch = "";

function renderEnquiries() {
  const tbody = document.getElementById("admin-enquiries-tbody");
  if (!tbody) return;

  let enquiries = CMS.getEnquiries();

  // Filter
  if (enquiryFilter !== "all") {
    enquiries = enquiries.filter(e => e.status === enquiryFilter);
  }

  // Search
  if (enquirySearch) {
    const q = enquirySearch.toLowerCase();
    enquiries = enquiries.filter(e => 
      (e.name && e.name.toLowerCase().includes(q)) ||
      (e.company && e.company.toLowerCase().includes(q)) ||
      (e.phone && e.phone.toLowerCase().includes(q)) ||
      (e.reason && e.reason.toLowerCase().includes(q)) ||
      (e.message && e.message.toLowerCase().includes(q))
    );
  }

  if (enquiries.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" class="text-center py-10 text-on-surface-variant text-xs">
          <span class="material-symbols-outlined text-[32px] text-outline mb-1 block">search_off</span>
          No wholesale inquiries match the selected criteria.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = enquiries.map(enq => `
    <tr class="hover:bg-surface-container-low transition-colors">
      <td class="py-3 px-4 text-xs font-mono text-slate-500 whitespace-nowrap">${escapeHtml(enq.date || "-")}</td>
      <td class="py-3 px-4">
        <div class="font-bold text-primary text-sm">${escapeHtml(enq.company || enq.name)}</div>
        <div class="text-[11px] text-on-surface-variant">${escapeHtml(enq.name || "")} ${enq.town ? '• ' + escapeHtml(enq.town) : ''}</div>
      </td>
      <td class="py-3 px-4">
        <span class="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-primary/10 text-primary border border-primary/20">
          ${escapeHtml(enq.reason || "Wholesale Supply")}
        </span>
      </td>
      <td class="py-3 px-4 text-xs font-mono font-bold text-slate-700">${escapeHtml(enq.phone || "-")}</td>
      <td class="py-3 px-4 text-xs text-on-surface-variant max-w-xs truncate">${escapeHtml(enq.message || "-")}</td>
      <td class="py-3 px-4">
        <span class="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${getEnquiryBadgeClass(enq.status)}">
          ${escapeHtml(enq.status || "New")}
        </span>
      </td>
      <td class="py-3 px-4 text-right">
        <div class="flex items-center justify-end gap-1.5">
          <button type="button" onclick="openEnquiryModal('${enq.id}')" class="px-3 py-1.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-primary font-bold text-xs transition-colors">
            View
          </button>
          <button type="button" onclick="deleteEnquirySafe('${enq.id}')" class="p-1.5 rounded-lg bg-surface-container hover:bg-error-container text-on-surface-variant hover:text-error transition-colors" title="Delete record">
            <span class="material-symbols-outlined text-[16px]">delete</span>
          </button>
        </div>
      </td>
    </tr>
  `).join("");
}

function getEnquiryBadgeClass(status) {
  switch (status) {
    case "New": return "bg-secondary-fixed text-secondary";
    case "Read": return "bg-sky-100 text-sky-800";
    case "Contacted": return "bg-amber-100 text-amber-800";
    case "Closed": return "bg-emerald-100 text-emerald-800";
    default: return "bg-slate-200 text-slate-700";
  }
}

function setupEnquiryModal() {
  const statusSelect = document.getElementById("view-enq-status-select");
  const searchInput = document.getElementById("search-enquiries-input");
  const filterBtns = document.querySelectorAll(".enq-filter-btn");
  const clearBtn = document.getElementById("clear-all-enquiries-btn");

  if (statusSelect) {
    statusSelect.addEventListener("change", (e) => {
      const id = document.getElementById("view-enq-id").value;
      if (id) {
        CMS.updateEnquiryStatus(id, e.target.value);
        showToast(`Enquiry status marked as ${e.target.value}.`);
        renderEnquiries();
        renderDashboardStats();
      }
    });
  }

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      enquirySearch = e.target.value.trim();
      renderEnquiries();
    });
  }

  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      filterBtns.forEach(b => {
        b.classList.remove("bg-primary", "text-on-primary", "shadow-sm");
        b.classList.add("bg-surface-container", "text-on-surface-variant");
      });
      btn.classList.add("bg-primary", "text-on-primary", "shadow-sm");
      btn.classList.remove("bg-surface-container", "text-on-surface-variant");

      enquiryFilter = btn.getAttribute("data-filter");
      renderEnquiries();
    });
  });

  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      if (confirm("Are you sure you want to clear all wholesale inquiries? This action cannot be undone.")) {
        CMS.clearAllEnquiries();
        showToast("All wholesale inquiries cleared.");
        renderEnquiries();
        renderDashboardStats();
        renderDashboardActivity();
      }
    });
  }
}

function openEnquiryModal(id) {
  const enq = CMS.getEnquiryById(id);
  if (!enq) {
    showToast("Enquiry not found.", "error");
    return;
  }

  document.getElementById("view-enq-id").value = enq.id;
  document.getElementById("view-enq-company").textContent = enq.company || enq.name || "Retail Merchant";
  document.getElementById("view-enq-name").textContent = enq.name ? `Contact Person: ${enq.name}` : "";
  document.getElementById("view-enq-badge").textContent = enq.status || "New";
  document.getElementById("view-enq-badge").className = `px-3 py-1 rounded-full text-xs font-extrabold ${getEnquiryBadgeClass(enq.status)}`;
  const reasonEl = document.getElementById("view-enq-reason");
  if (reasonEl) reasonEl.textContent = enq.reason || "Wholesale Supply / General";
  document.getElementById("view-enq-phone").textContent = enq.phone || "-";
  document.getElementById("view-enq-date").textContent = enq.date || "-";
  document.getElementById("view-enq-message").textContent = enq.message || "No specific message provided.";
  document.getElementById("view-enq-status-select").value = enq.status || "New";

  const waBtn = document.getElementById("view-enq-wa-btn");
  const callBtn = document.getElementById("view-enq-call-btn");

  const cleanPhone = (enq.phone || "").replace(/[^0-9]/g, "");
  if (waBtn) waBtn.href = `https://wa.me/${cleanPhone.startsWith('91') ? cleanPhone : '91' + cleanPhone}`;
  if (callBtn) callBtn.href = `tel:${enq.phone}`;

  // Automatically mark as read if it was New
  if (enq.status === "New") {
    CMS.updateEnquiryStatus(enq.id, "Read");
    document.getElementById("view-enq-status-select").value = "Read";
    renderEnquiries();
    renderDashboardStats();
  }

  openModal("enquiry-modal");
}

function closeEnquiryModal() {
  closeModal("enquiry-modal");
}

function deleteEnquirySafe(id) {
  if (confirm("Delete this wholesale enquiry record?")) {
    CMS.deleteEnquiry(id);
    showToast("Enquiry deleted.");
    renderEnquiries();
    renderDashboardStats();
    renderDashboardActivity();
  }
}

/**
 * =========================================================================
 * 8. DATA BACKUP & MAINTENANCE TOOLS
 * =========================================================================
 */
function setupTools() {
  const exportBtn = document.getElementById("btn-export-json");
  const quickExportBtn = document.getElementById("quick-export-btn");
  const importInput = document.getElementById("import-file-input");
  const factoryResetBtn = document.getElementById("btn-factory-reset");
  const quickResetBtn = document.getElementById("quick-reset-btn");

  function handleExport() {
    const data = CMS.exportDatabaseSnapshot();
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `anfal-cms-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("CMS database snapshot exported successfully!");
  }

  if (exportBtn) exportBtn.addEventListener("click", handleExport);
  if (quickExportBtn) quickExportBtn.addEventListener("click", handleExport);

  if (importInput) {
    importInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (ev) => {
        const success = CMS.importDatabaseSnapshot(ev.target.result);
        if (success) {
          showToast("Database restored successfully! Refreshing view...");
          setTimeout(() => location.reload(), 800);
        } else {
          showToast("Failed to restore backup. Invalid JSON schema.", "error");
        }
      };
      reader.readAsText(file);
    });
  }

  function handleReset() {
    if (confirm("Reset the entire CMS database back to original factory defaults? All unsaved custom data will be replaced.")) {
      CMS.resetToFactoryDefaults();
      showToast("CMS reverted to factory defaults! Refreshing...");
      setTimeout(() => location.reload(), 800);
    }
  }

  if (factoryResetBtn) factoryResetBtn.addEventListener("click", handleReset);
  if (quickResetBtn) quickResetBtn.addEventListener("click", handleReset);
}

/**
 * =========================================================================
 * UTILITY HELPERS: COMPRESSION, TOAST & ESCAPING
 * =========================================================================
 */
function compressImage(src, maxDim, quality, callback) {
  const img = new Image();
  img.crossOrigin = "anonymous";
  img.onload = () => {
    let width = img.width;
    let height = img.height;

    if (width > maxDim || height > maxDim) {
      if (width > height) {
        height = Math.round((height * maxDim) / width);
        width = maxDim;
      } else {
        width = Math.round((width * maxDim) / height);
        height = maxDim;
      }
    }

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, width, height);
    const compressed = canvas.toDataURL("image/jpeg", quality);
    callback(compressed);
  };
  img.onerror = () => callback(src);
  img.src = src;
}

let toastTimeout = null;
function showToast(message, type = "success") {
  const toast = document.getElementById("admin-toast");
  const msgEl = document.getElementById("toast-message");
  const iconEl = document.getElementById("toast-icon");
  if (!toast || !msgEl) return;

  msgEl.textContent = message;
  if (iconEl) {
    iconEl.textContent = type === "error" ? "error" : (type === "info" ? "info" : "check_circle");
    iconEl.className = `material-symbols-outlined text-[20px] ${type === 'error' ? 'text-rose-400' : (type === 'info' ? 'text-sky-400' : 'text-secondary-fixed')}`;
  }

  toast.classList.remove("translate-y-20", "opacity-0", "pointer-events-none");
  toast.classList.add("translate-y-0", "opacity-100");

  if (toastTimeout) clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.add("translate-y-20", "opacity-0", "pointer-events-none");
    toast.classList.remove("translate-y-0", "opacity-100");
  }, 3500);
}

function escapeHtml(str) {
  if (typeof str !== "string") return str || "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * =========================================================================
 * GLOBAL ATTACHMENTS FOR INLINE HTML EVENT HANDLERS
 * =========================================================================
 */
window.openModal = openModal;
window.closeModal = closeModal;
window.switchTab = switchTab;

// Products
window.openAddProductModal = openAddProductModal;
window.editProduct = editProduct;
window.closeProductModal = closeProductModal;
window.deleteProduct = deleteProduct;

// Team
window.openAddTeamModal = openAddTeamModal;
window.editTeamMember = editTeamMember;
window.closeTeamModal = closeTeamModal;
window.deleteTeamMember = deleteTeamMember;

// Brands
window.openAddBrandModal = openAddBrandModal;
window.editBrand = editBrand;
window.closeBrandModal = closeBrandModal;
window.deleteBrand = deleteBrand;

// Enquiries
window.openEnquiryModal = openEnquiryModal;
window.closeEnquiryModal = closeEnquiryModal;
window.deleteEnquirySafe = deleteEnquirySafe;

// Map & Tools
window.updateAdminMapFromInputs = updateAdminMapFromInputs;
window.setupContactMap = setupContactMap;
