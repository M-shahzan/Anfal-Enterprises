/**
 * ANFAL ENTERPRISES - Single Screen Application Logic
 */

document.addEventListener("DOMContentLoaded", () => {
  initApp();
});

function initApp() {
  renderCompanyData();
  renderBrandsPlaque();
  setupEnquiryModal();
  setupEventListeners();
}

/**
 * Render Company Details into the single-screen layout
 */
function renderCompanyData() {
  const data = CMS.getCompanyData();
  if (!data) return;

  const heroTaglineEl = document.getElementById("hero-tagline");
  const aboutStatementEl = document.getElementById("about-statement");
  const aboutDescEl = document.getElementById("about-description");
  const contactAddressEl = document.getElementById("contact-address-text");
  const contactProprietorEl = document.getElementById("contact-proprietor-name");
  const btnQuickCall = document.getElementById("btn-quick-call");
  const btnQuickWhatsapp = document.getElementById("btn-quick-whatsapp");
  const btnGetDirections = document.getElementById("btn-get-directions");
  const btnEmailUs = document.getElementById("btn-email-us");

  if (heroTaglineEl) heroTaglineEl.textContent = data.subtitle || "WHOLESALE FMCG DISTRIBUTOR";
  if (aboutStatementEl) aboutStatementEl.textContent = data.aboutStatement || "Reliable FMCG Distribution. Built on Trust.";
  if (aboutDescEl) {
    const rawDesc = data.aboutDescription || "ANFAL ENTERPRISES is an established FMCG wholesaler and distributor based in Bhatkal, Karnataka, supplying everyday branded consumer goods to retailers and institutions.";
    aboutDescEl.innerHTML = rawDesc.replace(/ANFAL ENTERPRISES/g, '<span class="brand-anfal">ANFAL</span> <span class="brand-enterprises">ENTERPRISES</span>');
  }

  if (contactAddressEl) contactAddressEl.textContent = data.address || "N.H. 66, Nawayath Colony, Bhatkal, Karnataka – 581320";
  if (contactProprietorEl) contactProprietorEl.textContent = data.proprietor || "Mr. Imtiyaz Hussain";

  if (btnQuickCall && data.phone) {
    const cleanPhone = data.phone.replace(/[^0-9+]/g, '');
    btnQuickCall.href = `tel:${cleanPhone}`;
  }

  if (btnQuickWhatsapp && data.whatsapp) {
    const cleanPhone = data.whatsapp.replace(/[^0-9]/g, '');
    btnQuickWhatsapp.href = `https://wa.me/${cleanPhone}?text=${encodeURIComponent("Hello Anfal Enterprises, I have a wholesale FMCG enquiry.")}`;
  }

  if (btnGetDirections) {
    btnGetDirections.href = data.directionsUrl || "https://maps.google.com/?q=Nawayath+Colony+Bhatkal+Karnataka+581320";
  }

  if (btnEmailUs && data.email) {
    btnEmailUs.href = `mailto:${data.email}?subject=${encodeURIComponent("Wholesale FMCG Enquiry - Anfal Enterprises")}`;
  }
}

/**
 * Render the 6 Verified Brands Plaque
 */
function renderBrandsPlaque() {
  const container = document.getElementById("brands-grid");
  if (!container) return;

  const brands = CMS.getBrands();
  const activeBrands = brands.filter(b => b.active !== false);

  container.innerHTML = activeBrands.map(brand => {
    const logoContent = brand.logoSvg || `<span style="font-family: var(--font-heading); font-weight: 900; font-size: 1.05rem; color: ${brand.color || '#000000'};">${escapeHtml(brand.shortName || brand.name)}</span>`;
    return `
      <div class="brand-tile" title="${escapeHtml(brand.name)} - ${escapeHtml(brand.category)}">
        ${logoContent}
      </div>
    `;
  }).join("");
}

/**
 * Setup Enquiry Modal
 */
function setupEnquiryModal() {
  const openBtn = document.getElementById("btn-open-enquiry-modal");
  const closeBtn = document.getElementById("btn-close-enquiry");
  const modal = document.getElementById("enquiry-modal");
  const form = document.getElementById("wholesale-enquiry-form");

  if (openBtn && modal) {
    openBtn.addEventListener("click", () => {
      modal.classList.add("open");
    });
  }

  if (closeBtn && modal) {
    closeBtn.addEventListener("click", () => {
      modal.classList.remove("open");
    });
  }

  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) modal.classList.remove("open");
    });
  }

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = form.querySelector("#enquiry-name").value.trim();
      const company = form.querySelector("#enquiry-company").value.trim();
      const phone = form.querySelector("#enquiry-phone").value.trim();
      const message = form.querySelector("#enquiry-message").value.trim();

      if (!name || !phone || !message) {
        showToast("Please provide Name, Phone, and your Requirement.", "warning");
        return;
      }

      CMS.addEnquiry({
        name,
        company: company || "Retail Store",
        phone,
        message
      });

      showToast("Enquiry submitted. Anfal wholesale team will reach out shortly.");
      form.reset();
      if (modal) modal.classList.remove("open");
    });
  }
}

function setupEventListeners() {
  window.addEventListener("cms:company-updated", () => renderCompanyData());
  window.addEventListener("cms:brands-updated", () => renderBrandsPlaque());
  
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      const modal = document.getElementById("enquiry-modal");
      if (modal) modal.classList.remove("open");
    }
  });
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
  }, 4000);
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
