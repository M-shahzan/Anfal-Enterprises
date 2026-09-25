/**
 * ANFAL ENTERPRISES — Wholesale FMCG Distribution Hub
 * Client Application Logic & Dynamic CMS Synchronization
 */

document.addEventListener("DOMContentLoaded", () => {
  initAnfalApp();
});

function initAnfalApp() {
  renderCompanyData();
  renderSiteImages();
  renderPillars();
  renderBrands();
  renderTeam();
  setupWholesaleForm();
  setupNavigation();
  setupBrandSlider();
  setupCMSListeners();
}

/**
 * 1. Render Company Metadata across DOM
 */
function renderCompanyData() {
  const data = CMS.getCompanyData();
  if (!data) return;

  // Overview / Hero
  const heroSub = document.getElementById("hero-subtitle");
  if (heroSub && data.heroText) {
    heroSub.innerHTML = escapeHtml(data.heroText).replace(/\. /g, ".<br/>");
  }

  const activeSkus = document.getElementById("hero-active-skus");
  if (activeSkus && data.activeSkus) {
    activeSkus.textContent = data.activeSkus;
  }

  const dispatchSla = document.getElementById("hero-dispatch-sla");
  if (dispatchSla && data.dispatchSla) {
    dispatchSla.textContent = data.dispatchSla;
  }

  // About Section
  const aboutTitle = document.getElementById("about-statement-title");
  if (aboutTitle && data.aboutStatement) {
    aboutTitle.innerHTML = `ANFAL ENTERPRISES.<br/><span class="text-secondary">${escapeHtml(data.aboutStatement)}</span><span class="text-white">.</span>`;
  }

  const aboutDesc = document.getElementById("about-narrative-text");
  if (aboutDesc && data.aboutDescription) {
    aboutDesc.textContent = data.aboutDescription;
  }

  const gpsCoords = document.getElementById("about-gps-coords");
  if (gpsCoords && data.gpsCoordinates) {
    gpsCoords.textContent = data.gpsCoordinates;
  }

  const locationTag = document.getElementById("about-location-tag");
  if (locationTag && data.locationShort) {
    locationTag.textContent = `${data.locationShort} Coastal Bypass Corridor`;
  }

  // Connect Section Contact Links
  const phoneLink = document.getElementById("contact-phone-link");
  if (phoneLink && data.phone) {
    phoneLink.textContent = data.phone;
    phoneLink.href = `tel:${cleanPhone(data.phone)}`;
  }

  const whatsappLink = document.getElementById("contact-whatsapp-link");
  if (whatsappLink && data.whatsapp) {
    whatsappLink.textContent = data.whatsapp;
    whatsappLink.href = `https://wa.me/${cleanPhone(data.whatsapp)}?text=${encodeURIComponent("Hello Anfal Enterprises, I would like to inquire about wholesale FMCG distribution.")}`;
  }

  const emailLink = document.getElementById("contact-email-link");
  if (emailLink && data.email) {
    emailLink.textContent = data.email;
    emailLink.href = `mailto:${data.email}?subject=${encodeURIComponent("Wholesale FMCG Enquiry - Anfal Enterprises")}`;
  }

  const addressText = document.getElementById("contact-address-text");
  if (addressText && data.address) {
    addressText.textContent = data.address;
  }

  const hoursText = document.getElementById("contact-hours-text");
  if (hoursText && data.operatingHours) {
    hoursText.textContent = `OPERATING HOURS: ${data.operatingHours}`;
  }
}

/**
 * 2. Render Typographic Why Us Pillars from CMS
 */
function renderPillars() {
  const container = document.getElementById("pillars-container");
  if (!container) return;

  const pillars = CMS.getPillars();
  if (!pillars || !pillars.length) return;

  container.innerHTML = pillars.map((pillar, index) => {
    const serial = String(index + 1).padStart(2, "0");
    const tag = pillar.tag || "STAPLES";
    return `
      <div class="py-8 group cursor-pointer transition-all duration-300 hover:pl-4">
        <div class="flex items-baseline justify-between mb-2">
          <span class="font-display text-xs font-mono text-secondary font-bold">${serial} / ${escapeHtml(tag)}</span>
          <span class="text-xs font-display uppercase tracking-widest text-charcoal-muted group-hover:text-primary transition-colors">${escapeHtml(pillar.actionLabel || "VIEW DETAILS →")}</span>
        </div>
        <h3 class="font-display text-2xl sm:text-4xl font-extrabold text-primary group-hover:text-secondary transition-colors duration-200">
          ${escapeHtml(pillar.title)}
        </h3>
        <p class="mt-2 text-sm sm:text-base text-charcoal-muted max-w-xl group-hover:text-charcoal transition-colors leading-relaxed">
          ${escapeHtml(pillar.description)}
        </p>
      </div>
    `;
  }).join("");
}

/**
 * 3. Render Verified FMCG Brand Panels from CMS
 */
function renderBrands() {
  const track = document.getElementById("brands-track");
  if (!track) return;

  const brands = CMS.getBrands() || [];
  const activeBrands = brands.filter(b => b.active !== false).sort((a, b) => (a.order || 0) - (b.order || 0));

  const badge = document.getElementById("brands-count-badge");
  if (badge) {
    badge.textContent = `${activeBrands.length} AUTHORIZED PILLARS`;
  }

  const totalCount = String(activeBrands.length).padStart(2, "0");

  track.innerHTML = activeBrands.map((brand, index) => {
    const serial = String(index + 1).padStart(2, "0");
    const category = brand.category || "FMCG GOODS";
    const line = brand.productLine || brand.description || "";
    
    // Brand display visual: logo image if provided, otherwise heavy architectural typography
    let brandVisualHtml = "";
    if (brand.logoUrl || brand.imageUrl) {
      const src = brand.logoUrl || brand.imageUrl;
      brandVisualHtml = `
        <div class="flex items-center gap-3">
          <img src="${escapeHtml(src)}" alt="${escapeHtml(brand.name)} Logo" class="h-10 max-w-[140px] object-contain">
          <span class="font-display font-black text-2xl text-primary tracking-tighter group-hover:text-secondary transition-colors">
            ${escapeHtml(brand.shortName || brand.name)}
          </span>
        </div>
      `;
    } else {
      brandVisualHtml = `
        <span class="font-display font-black text-3xl sm:text-4xl text-primary tracking-tighter group-hover:text-secondary transition-colors">
          ${escapeHtml(brand.shortName || brand.name)}
        </span>
      `;
    }

    return `
      <div class="w-[300px] sm:w-[340px] flex-shrink-0 bg-warm-white border border-hairline-dark p-6 flex flex-col justify-between h-[380px] snap-start group hover:border-primary transition-all duration-300 shadow-sm hover:shadow-md">
        <div>
          <div class="flex items-center justify-between border-b border-hairline pb-3 mb-6">
            <span class="font-mono text-xs text-secondary font-bold">${serial} / ${totalCount}</span>
            <span class="text-[11px] font-mono uppercase tracking-wider text-charcoal-muted truncate max-w-[170px]">${escapeHtml(category)}</span>
          </div>
          <div class="h-20 flex items-center mb-6">
            ${brandVisualHtml}
          </div>
          <p class="text-xs font-mono uppercase tracking-wider text-charcoal-muted leading-relaxed min-h-[36px]">
            ${escapeHtml(line)}
          </p>
        </div>
        <div class="pt-4 border-t border-hairline flex items-center justify-between text-xs font-display font-bold uppercase tracking-wider text-primary">
          <span>AUTHORIZED</span>
          <span class="text-secondary font-mono text-xs">VERIFIED</span>
        </div>
      </div>
    `;
  }).join("");
}

/**
 * 4. Render Leadership Section from CMS
 */
function renderTeam() {
  const container = document.getElementById("leadership-container");
  if (!container) return;

  const team = CMS.getTeam() || [];
  if (!team.length) return;

  const founder = team[0];
  const others = team.slice(1);

  const dominantCardHtml = `
    <!-- Dominant Portrait Frame (Founder & CEO) -->
    <div class="lg:col-span-7 bg-white border border-hairline-dark p-6 md:p-8 flex flex-col md:flex-row gap-8 items-center shadow-sm">
      <div class="w-full md:w-1/2 aspect-[4/5] bg-primary relative overflow-hidden flex-shrink-0">
        <img 
          src="${escapeHtml(founder.avatarUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800')}" 
          alt="${escapeHtml(founder.name)}" 
          class="w-full h-full object-cover grayscale contrast-125 hover:grayscale-0 transition-all duration-700"
        >
        <div class="absolute top-3 left-3 bg-secondary text-white text-[10px] font-display font-bold px-2 py-0.5 uppercase tracking-widest">
          ${escapeHtml(founder.boardRole || "BOARD CHAIR")}
        </div>
      </div>
      <div class="flex flex-col justify-between h-full w-full py-2">
        <div>
          <span class="text-[11px] font-mono text-secondary uppercase font-bold tracking-widest">EXECUTIVE VISION</span>
          <h3 class="font-display text-2xl sm:text-3xl font-black text-primary uppercase tracking-tight mt-1 mb-2">
            ${escapeHtml(founder.name)}
          </h3>
          <p class="font-display text-xs uppercase tracking-widest text-charcoal-muted font-bold mb-4">
            ${escapeHtml(founder.role)}
          </p>
          <p class="text-xs sm:text-sm text-charcoal-muted leading-relaxed">
            ${escapeHtml(founder.bio || "Steering commercial operations and highway distribution strategy across coastal Karnataka.")}
          </p>
        </div>
        <div class="mt-6 pt-4 border-t border-hairline flex items-center justify-between text-xs font-mono text-charcoal-muted">
          <span>ANFAL ENTERPRISES</span>
          <span class="text-primary font-bold">BHATKAL HQ</span>
        </div>
      </div>
    </div>
  `;

  const offsetCardsHtml = `
    <!-- Offset Staggered Management Cards -->
    <div class="lg:col-span-5 flex flex-col gap-4">
      ${others.map((member, idx) => {
        const serial = String(idx + 2).padStart(2, "0");
        return `
          <div class="bg-white border border-hairline-dark p-5 flex items-center gap-5 hover:border-primary transition-all duration-300 shadow-sm">
            <div class="w-16 h-16 bg-primary flex-shrink-0 overflow-hidden">
              <img 
                src="${escapeHtml(member.avatarUrl || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400')}" 
                alt="${escapeHtml(member.name)}" 
                class="w-full h-full object-cover grayscale contrast-125 hover:grayscale-0 transition-all"
              >
            </div>
            <div class="flex-grow">
              <div class="flex items-center justify-between">
                <h4 class="font-display text-sm font-bold text-primary uppercase">${escapeHtml(member.name)}</h4>
                <span class="text-[10px] font-mono text-secondary uppercase font-bold">${serial}</span>
              </div>
              <p class="text-xs font-display text-charcoal-muted uppercase tracking-wider font-semibold">${escapeHtml(member.role)}</p>
              <p class="text-[11px] text-charcoal-muted mt-1 font-mono">${escapeHtml(member.category || member.boardRole || "")}</p>
            </div>
          </div>
        `;
      }).join("")}
    </div>
  `;

  container.innerHTML = dominantCardHtml + offsetCardsHtml;
}

/**
 * 5. Handle Wholesale Intake Form Submissions
 */
function setupWholesaleForm() {
  const form = document.getElementById("wholesale-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("form-name")?.value.trim() || "";
    const store = document.getElementById("form-store")?.value.trim() || "";
    const phone = document.getElementById("form-phone")?.value.trim() || "";
    const town = document.getElementById("form-town")?.value.trim() || "";
    const message = document.getElementById("form-message")?.value.trim() || "";

    // Collect checked brands
    const checkedBrandEls = form.querySelectorAll('input[name="brands"]:checked');
    const selectedBrands = Array.from(checkedBrandEls).map(el => el.value);

    let fullMessage = `Location/Town: ${town}`;
    if (selectedBrands.length > 0) {
      fullMessage += ` | Requested Brands: ${selectedBrands.join(", ")}`;
    }
    if (message) {
      fullMessage += ` | Details: ${message}`;
    }

    const newEnquiry = CMS.addEnquiry({
      name,
      company: store,
      phone,
      message: fullMessage
    });

    if (newEnquiry) {
      showToast("Wholesale registration submitted! Our commercial desk will reach you within 4 hours.", "success");
      form.reset();
    } else {
      showToast("Failed to submit enquiry. Please call our direct desk.", "error");
    }
  });
}

/**
 * 6. Brand Slider Horizontal Navigation
 */
function setupBrandSlider() {
  const track = document.getElementById("brands-track");
  const prevBtn = document.getElementById("brand-prev");
  const nextBtn = document.getElementById("brand-next");

  if (!track || !prevBtn || !nextBtn) return;

  const scrollAmount = 360;

  prevBtn.addEventListener("click", () => {
    track.scrollBy({ left: -scrollAmount, behavior: "smooth" });
  });

  nextBtn.addEventListener("click", () => {
    track.scrollBy({ left: scrollAmount, behavior: "smooth" });
  });
}

/**
 * 7. Active Navigation Highlighting & Mobile Drawer
 */
function setupNavigation() {
  // Mobile drawer toggle
  const mobileBtn = document.getElementById("mobile-menu-btn");
  const mobileDrawer = document.getElementById("mobile-drawer");

  if (mobileBtn && mobileDrawer) {
    mobileBtn.addEventListener("click", () => {
      mobileDrawer.classList.toggle("hidden");
    });

    // Close drawer when clicking links
    mobileDrawer.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        mobileDrawer.classList.add("hidden");
      });
    });
  }

  // Active section scroll indicator
  const sections = document.querySelectorAll("main section[id]");
  const navLinks = document.querySelectorAll("#nav-menu-links a.nav-link");

  if (sections.length && navLinks.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute("id");
          navLinks.forEach(link => {
            const target = link.getAttribute("data-target");
            const indicator = link.querySelector(".nav-indicator");
            if (target === id) {
              link.classList.remove("text-charcoal-muted");
              link.classList.add("text-primary");
              if (indicator) {
                indicator.classList.remove("scale-x-0");
                indicator.classList.add("scale-x-100");
              }
            } else {
              link.classList.remove("text-primary");
              link.classList.add("text-charcoal-muted");
              if (indicator) {
                indicator.classList.remove("scale-x-100");
                indicator.classList.add("scale-x-0");
              }
            }
          });
        }
      });
    }, { threshold: 0.35 });

    sections.forEach(section => observer.observe(section));
  }
}

/**
 * 1b. Render Dynamic Site Images from CMS
 */
function renderSiteImages() {
  if (typeof CMS === 'undefined') return;
  const images = CMS.getSiteImages();
  if (!images) return;

  // Facility / About Background
  const facilityBg = document.getElementById("facility-bg-layer");
  if (facilityBg && images.facilityBg) {
    facilityBg.style.backgroundImage = `url('${images.facilityBg}')`;
  }

  // Hero Background
  const heroBg = document.getElementById("hero-bg-layer");
  if (heroBg && images.heroBg) {
    heroBg.style.backgroundImage = `url('${images.heroBg}')`;
  }

  // Brand Logos
  const navLogo = document.getElementById("site-nav-logo");
  if (navLogo && images.logo) {
    navLogo.src = images.logo;
  }

  // Map Background
  const mapBg = document.getElementById("contact-map-bg");
  if (mapBg && images.mapBg) {
    mapBg.style.backgroundImage = `url('${images.mapBg}')`;
  }

  // Hero Tangible Products
  for (let i = 1; i <= 4; i++) {
    const prodImg = document.getElementById(`hero-prod-img-${i}`);
    if (prodImg && images[`heroProduct${i}`]) {
      prodImg.src = images[`heroProduct${i}`];
    }
  }
}

/**
 * 8. Real-time Live Updates when CMS changes
 */
function setupCMSListeners() {
  window.addEventListener("cms:company-updated", () => renderCompanyData());
  window.addEventListener("cms:site-images-updated", () => renderSiteImages());
  window.addEventListener("cms:brands-updated", () => renderBrands());
  window.addEventListener("cms:team-updated", () => renderTeam());
}

/**
 * Visual Toast Notification
 */
function showToast(message, type = "success") {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  const bgColor = type === "success" ? "bg-primary text-white border-secondary" : "bg-secondary text-white border-white";
  
  toast.className = `${bgColor} border-l-4 px-6 py-4 shadow-xl text-xs font-display uppercase tracking-wider font-bold transition-all duration-300 transform translate-y-2 opacity-0 pointer-events-auto flex items-center gap-3`;
  toast.innerHTML = `
    <span class="material-symbols-outlined text-sm">${type === "success" ? "check_circle" : "error"}</span>
    <span>${escapeHtml(message)}</span>
  `;

  container.appendChild(toast);

  // Animate in
  requestAnimationFrame(() => {
    toast.classList.remove("translate-y-2", "opacity-0");
  });

  // Remove after 4.5s
  setTimeout(() => {
    toast.classList.add("translate-y-2", "opacity-0");
    setTimeout(() => toast.remove(), 300);
  }, 4500);
}

/**
 * Helpers
 */
function escapeHtml(str) {
  if (!str) return "";
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function cleanPhone(num) {
  if (!num) return "";
  return num.replace(/[^0-9]/g, "");
}
