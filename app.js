/**
 * ANFAL ENTERPRISES - Main Client Application Logic
 * Supports scrollable sections, dynamic CMS data binding, Team rendering,
 * Brand portfolio rendering, in-page and modal enquiry forms.
 */

document.addEventListener("DOMContentLoaded", () => {
  initApp();
});

function initApp() {
  renderCompanyData();
  renderBrands();
  renderTeamSection();
  setupEnquiryForms();
  setupNavigation();
  setupEventListeners();
  updateCurrentYear();
}

/**
 * Render Company Details into the website sections
 */
function renderCompanyData() {
  const data = CMS.getCompanyData();
  if (!data) return;

  // Header & Top Bar
  setElementText("top-bar-phone", data.phone);
  setElementText("top-bar-email", data.email);

  // Hero Section
  setElementText("hero-tagline", data.subtitle || "WHOLESALE FMCG DISTRIBUTOR");
  setElementText("hero-location-text", data.locationShort || "BHATKAL, KARNATAKA");
  setElementText("about-statement", data.aboutStatement || "Reliable FMCG Distribution. Built on Trust.");
  setElementText("about-statement-2", data.aboutStatement || "Reliable FMCG Distribution. Built on Trust.");
  
  if (data.heroText) {
    const heroDescEl = document.getElementById("hero-desc-text");
    if (heroDescEl) {
      heroDescEl.innerHTML = `<strong class="brand-anfal">ANFAL</strong> <strong class="brand-enterprises">ENTERPRISES</strong> is the premier wholesale FMCG distribution house based in ${escapeHtml(data.locationShort || "Bhatkal, Karnataka")}. Supplying verified, high-velocity consumer goods to supermarkets, retailers, and commercial businesses with speed and volume pricing.<br>Partnering directly with leading manufacturing conglomerates to guarantee uninterrupted stock availability and transparent B2B wholesale rates.`;
    }
  }

  // Address & Proprietor Badges
  setElementText("contact-address-text", data.address || "N.H. 66, Nawayath Colony, Bhatkal");
  setElementText("contact-proprietor-name", data.proprietor || "Mr. Imtiyaz Hussain");

  // Contact Section Hub
  setElementText("contact-full-address", data.address || "N.H. 66, Nawayath Colony, Bhatkal, Karnataka – 581320, India");
  setElementText("contact-operating-hours", data.operatingHours || "Monday – Saturday: 9:00 AM – 8:00 PM");

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

  // Quick Action Buttons
  const btnQuickCall = document.getElementById("btn-quick-call");
  if (btnQuickCall && data.phone) {
    btnQuickCall.href = `tel:${cleanPhone(data.phone)}`;
  }

  const btnQuickWhatsapp = document.getElementById("btn-quick-whatsapp");
  if (btnQuickWhatsapp && data.whatsapp) {
    btnQuickWhatsapp.href = `https://wa.me/${cleanPhone(data.whatsapp)}?text=${encodeURIComponent("Hello Anfal Enterprises, I have a wholesale enquiry")}`;
  }

  const btnGetDirections = document.getElementById("btn-get-directions");
  if (btnGetDirections) {
    btnGetDirections.href = data.directionsUrl || "https://maps.app.goo.gl/Vvbhyn822UTp8xpi7";
  }

  const btnEmailUs = document.getElementById("btn-email-us");
  if (btnEmailUs && data.email) {
    btnEmailUs.href = `mailto:${data.email}?subject=${encodeURIComponent("Wholesale FMCG Enquiry - Anfal Enterprises")}`;
  }

  // Maps Iframe
  const mapFrame = document.getElementById("google-maps-frame");
  if (mapFrame && data.googleMapsUrl) {
    mapFrame.src = data.googleMapsUrl;
  }
}

/**
 * Render the Verified Brands
 */
function renderBrands() {
  const container = document.getElementById("brands-grid");
  if (!container) return;

  const brands = CMS.getBrands();
  const activeBrands = brands.filter(b => b.active !== false);

  // Dynamically update Hero Stat Counter for Brands
  const brandsCountEl = document.getElementById("hero-brands-count");
  if (brandsCountEl) {
    brandsCountEl.textContent = `${activeBrands.length}+`;
  }

  container.innerHTML = activeBrands.map(brand => {
    let logoContent = "";
    if (brand.imageUrl) {
      logoContent = `<img src="${escapeHtml(brand.imageUrl)}" alt="${escapeHtml(brand.name)}" style="max-height: 44px; max-width: 140px; object-fit: contain;">`;
    } else if (brand.logoSvg) {
      logoContent = brand.logoSvg;
    } else {
      logoContent = `<span style="font-family: var(--font-heading); font-weight: 900; font-size: 1.2rem; color: ${brand.color || '#0F1B2E'};">${escapeHtml(brand.shortName || brand.name)}</span>`;
    }

    return `
      <div class="brand-showcase-card">
        <div class="brand-card-top">
          <div class="brand-logo-holder">
            ${logoContent}
          </div>
          <span class="brand-cat-pill">${escapeHtml(brand.shortName || 'FMCG')}</span>
        </div>
        <div class="brand-card-bottom">
          <h3 class="brand-card-name">${escapeHtml(brand.name)}</h3>
          <p class="brand-card-desc">${escapeHtml(brand.description || brand.category)}</p>
        </div>
      </div>
    `;
  }).join("");
}

/**
 * Render Leadership & Management Team
 */
function renderTeamSection() {
  const container = document.getElementById("team-cards-container");
  if (!container) return;

  const team = CMS.getTeam();
  if (!team || team.length === 0) return;

  const iconsMap = {
    shield: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
    settings: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`,
    "trending-up": `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>`,
    zap: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`
  };

  container.innerHTML = team.map((member, index) => {
    const iconSvg = iconsMap[member.avatarIcon] || iconsMap.shield;
    const phoneClean = cleanPhone(member.phone);
    return `
      <div class="team-member-card">
        <div class="team-avatar-icon">
          ${iconSvg}
        </div>
        <span class="team-role-badge">${escapeHtml(member.role)}</span>
        <h3 class="team-member-name">${escapeHtml(member.name)}</h3>
        <p class="team-category-text">${escapeHtml(member.category)}</p>
        
        <div class="team-phone-badge">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
          <a href="tel:${phoneClean}" class="team-phone-link">${escapeHtml(member.phone)}</a>
        </div>

        <p class="team-bio-text">${escapeHtml(member.bio)}</p>

        <div class="team-actions-row">
          <a href="tel:${phoneClean}" class="team-contact-btn" title="Call ${escapeHtml(member.name)}">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            <span>Call</span>
          </a>
          <a href="https://wa.me/${phoneClean}?text=${encodeURIComponent('Hello ' + member.name + ', I would like to connect regarding wholesale FMCG.')}" target="_blank" rel="noopener" class="team-whatsapp-btn" title="WhatsApp">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
            <span>WhatsApp</span>
          </a>
        </div>
      </div>
    `;
  }).join("");
}

/**
 * Setup Both In-Page & Modal Enquiry Forms
 */
/**
 * Setup In-Page Wholesale Enquiry Form
 */
function setupEnquiryForms() {
  const inpageForm = document.getElementById("inpage-enquiry-form");
  if (inpageForm) {
    inpageForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("inpage-name").value.trim();
      const company = document.getElementById("inpage-company").value.trim();
      const phone = document.getElementById("inpage-phone").value.trim();
      const brandInterest = document.getElementById("inpage-brand-interest").value;
      const message = document.getElementById("inpage-message").value.trim();

      if (!name || !phone || !message) {
        showToast("Please fill in your Name, Phone/WhatsApp, and Requirements.", "warning");
        return;
      }

      const fullMessage = `[Brand Interest: ${brandInterest}] - ${message}`;

      CMS.addEnquiry({
        name,
        company: company || "Retail Store",
        phone,
        message: fullMessage
      });

      showToast("Thank you! Your wholesale enquiry has been submitted. Our sales team will reach out shortly.");
      inpageForm.reset();
    });
  }
}

/**
 * Setup Navigation, Mobile Drawer & Scroll Spy
 */
function setupNavigation() {
  const toggleBtn = document.getElementById("mobile-menu-toggle");
  const drawer = document.getElementById("mobile-drawer");
  const mobileLinks = document.querySelectorAll(".mobile-nav-link");

  if (toggleBtn && drawer) {
    toggleBtn.addEventListener("click", () => {
      drawer.classList.toggle("open");
    });

    mobileLinks.forEach(link => {
      link.addEventListener("click", () => {
        drawer.classList.remove("open");
      });
    });
  }

  // Scroll Spy for desktop nav active states
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".navbar-links .nav-link");

  window.addEventListener("scroll", () => {
    let current = "";
    const scrollPos = window.scrollY + 120;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach(link => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("active");
      }
    });
  });
}

function setupEventListeners() {
  window.addEventListener("cms:company-updated", () => renderCompanyData());
  window.addEventListener("cms:brands-updated", () => renderBrands());
  window.addEventListener("cms:team-updated", () => renderTeamSection());

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      const modal = document.getElementById("enquiry-modal");
      if (modal) modal.classList.remove("open");
      const drawer = document.getElementById("mobile-drawer");
      if (drawer) drawer.classList.remove("open");
    }
  });
}

function updateCurrentYear() {
  const yearEl = document.getElementById("current-year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

function showToast(message, type = "success") {
  let toast = document.getElementById("app-toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "app-toast";
    toast.className = "toast-notice";
    document.body.appendChild(toast);
  }

  toast.innerHTML = `<span>${escapeHtml(message)}</span>`;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 4500);
}

function setElementText(id, text) {
  const el = document.getElementById(id);
  if (el && text) el.textContent = text;
}

function cleanPhone(phone) {
  if (!phone) return "";
  return phone.replace(/[^0-9+]/g, '');
}

function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
