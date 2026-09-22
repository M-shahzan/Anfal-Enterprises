/**
 * ANFAL ENTERPRISES - Standalone Admin Portal Controller
 * Drives admin.html dashboard.
 */

document.addEventListener("DOMContentLoaded", () => {
  initAdminDashboard();
});

function initAdminDashboard() {
  setupAdminTabs();
  loadCompanyFormValues();
  setupCompanyForm();
  setupBrandsManager();
  renderAdminBrandsTable();
  setupEnquiriesManager();
  renderAdminEnquiriesList();
  setupResetButton();
}

/**
 * Tab Switching Logic
 */
function setupAdminTabs() {
  const tabBtns = document.querySelectorAll(".admin-tab-btn");
  const tabPanes = document.querySelectorAll(".admin-tab-pane");

  tabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const targetTab = btn.getAttribute("data-tab");
      tabBtns.forEach(b => b.classList.remove("active"));
      tabPanes.forEach(p => p.classList.remove("active"));

      btn.classList.add("active");
      const targetPane = document.getElementById(`admin-tab-${targetTab}`);
      if (targetPane) targetPane.classList.add("active");
    });
  });
}

/**
 * Company Info Form Setup
 */
function setupCompanyForm() {
  const form = document.getElementById("cms-company-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const companyData = {
      name: document.getElementById("cms-input-name").value.trim(),
      subtitle: document.getElementById("cms-input-subtitle").value.trim(),
      tagline: document.getElementById("cms-input-tagline").value.trim(),
      heroText: document.getElementById("cms-input-hero-text").value.trim(),
      aboutStatement: document.getElementById("cms-input-about-statement").value.trim(),
      aboutDescription: document.getElementById("cms-input-about-desc").value.trim(),
      address: document.getElementById("cms-input-address").value.trim(),
      locationShort: document.getElementById("cms-input-location-short").value.trim(),
      proprietor: document.getElementById("cms-input-proprietor").value.trim(),
      phone: document.getElementById("cms-input-phone").value.trim(),
      whatsapp: document.getElementById("cms-input-whatsapp").value.trim(),
      email: document.getElementById("cms-input-email").value.trim(),
      googleMapsUrl: document.getElementById("cms-input-maps-url").value.trim(),
      heroImage: document.getElementById("cms-input-hero-image").value.trim() || "assets/images/anfal-building.jpg",
      aboutImage: document.getElementById("cms-input-about-image") ? document.getElementById("cms-input-about-image").value.trim() : "assets/images/anfal-building.jpg"
    };

    if (CMS.saveCompanyData(companyData)) {
      showAdminToast("Company settings saved successfully!");
    } else {
      showAdminToast("Failed to save company settings.", "warning");
    }
  });
}

function loadCompanyFormValues() {
  const data = CMS.getCompanyData();
  if (!data) return;

  setVal("cms-input-name", data.name);
  setVal("cms-input-subtitle", data.subtitle);
  setVal("cms-input-tagline", data.tagline);
  setVal("cms-input-hero-text", data.heroText);
  setVal("cms-input-about-statement", data.aboutStatement);
  setVal("cms-input-about-desc", data.aboutDescription);
  setVal("cms-input-address", data.address);
  setVal("cms-input-location-short", data.locationShort);
  setVal("cms-input-proprietor", data.proprietor);
  setVal("cms-input-phone", data.phone);
  setVal("cms-input-whatsapp", data.whatsapp);
  setVal("cms-input-email", data.email);
  setVal("cms-input-maps-url", data.googleMapsUrl);
  setVal("cms-input-hero-image", data.heroImage);
}

function setVal(id, val) {
  const el = document.getElementById(id);
  if (el) el.value = val || "";
}

/**
 * Brands Manager
 */
function setupBrandsManager() {
  const addBrandForm = document.getElementById("cms-add-brand-form");
  if (!addBrandForm) return;

  addBrandForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("cms-new-brand-name").value.trim();
    const category = document.getElementById("cms-new-brand-category").value.trim();
    const color = document.getElementById("cms-new-brand-color").value.trim() || "#D32F2F";
    const logoText = document.getElementById("cms-new-brand-logotext").value.trim() || name;
    const description = document.getElementById("cms-new-brand-desc").value.trim();

    if (!name || !category) {
      showAdminToast("Please provide Brand Name and Category.", "warning");
      return;
    }

    const brands = CMS.getBrands();
    const newBrand = {
      id: "brand-" + Date.now(),
      name,
      category,
      color,
      logoText,
      description,
      active: true,
      order: brands.length + 1
    };

    brands.push(newBrand);
    CMS.saveBrands(brands);
    addBrandForm.reset();
    renderAdminBrandsTable();
    showAdminToast(`Added "${name}" to brand portfolio.`);
  });
}

function renderAdminBrandsTable() {
  const tbody = document.getElementById("cms-brands-tbody");
  if (!tbody) return;

  const brands = CMS.getBrands();
  if (brands.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: #94A3B8; padding: 24px;">No brands configured yet.</td></tr>`;
    return;
  }

  tbody.innerHTML = brands.map((brand, index) => {
    return `
      <tr class="cms-brand-row">
        <td><strong>${index + 1}</strong></td>
        <td>
          <div style="display: flex; align-items: center; gap: 10px;">
            <span style="display: inline-block; width: 14px; height: 14px; border-radius: 2px; background: ${escapeHtml(brand.color || '#D32F2F')}"></span>
            <strong>${escapeHtml(brand.name)}</strong>
          </div>
        </td>
        <td><span style="font-size: 0.82rem; color: #CBD5E1;">${escapeHtml(brand.category)}</span></td>
        <td>
          <button class="cms-action-btn" onclick="window.toggleBrandStatus('${brand.id}')">
            ${brand.active !== false ? '✅ Active' : '⏸ Inactive'}
          </button>
        </td>
        <td>
          <button class="cms-action-btn" title="Move Up" onclick="window.moveBrand('${brand.id}', -1)">↑</button>
          <button class="cms-action-btn" title="Move Down" onclick="window.moveBrand('${brand.id}', 1)">↓</button>
          <button class="cms-action-btn delete" title="Delete Brand" onclick="window.deleteBrand('${brand.id}')">✕ Delete</button>
        </td>
      </tr>
    `;
  }).join("");
}

window.toggleBrandStatus = function(id) {
  const brands = CMS.getBrands();
  const target = brands.find(b => b.id === id);
  if (target) {
    target.active = target.active === false ? true : false;
    CMS.saveBrands(brands);
    renderAdminBrandsTable();
    showAdminToast(`Brand status updated.`);
  }
};

window.moveBrand = function(id, direction) {
  const brands = CMS.getBrands();
  const index = brands.findIndex(b => b.id === id);
  if (index === -1) return;

  const newIndex = index + direction;
  if (newIndex < 0 || newIndex >= brands.length) return;

  const temp = brands[index];
  brands[index] = brands[newIndex];
  brands[newIndex] = temp;

  brands.forEach((b, i) => b.order = i + 1);
  CMS.saveBrands(brands);
  renderAdminBrandsTable();
};

window.deleteBrand = function(id) {
  const brands = CMS.getBrands();
  const target = brands.find(b => b.id === id);
  if (target && confirm(`Remove "${target.name}" from brands list?`)) {
    const updated = brands.filter(b => b.id !== id);
    CMS.saveBrands(updated);
    renderAdminBrandsTable();
    showAdminToast(`Brand deleted.`);
  }
};

/**
 * Enquiries Viewer
 */
function setupEnquiriesManager() {
  const exportBtn = document.getElementById("btn-export-enquiries");
  if (exportBtn) {
    exportBtn.addEventListener("click", () => {
      exportEnquiriesToCSV();
    });
  }
}

function renderAdminEnquiriesList() {
  const container = document.getElementById("cms-enquiries-container");
  if (!container) return;

  const enquiries = CMS.getEnquiries();
  if (enquiries.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 40px; background: #0F172A; border: 1px solid #334155; border-radius: var(--radius-xs);">
        <p style="color: #94A3B8; font-size: 0.95rem;">No wholesale enquiries received yet.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = enquiries.map(enq => {
    return `
      <div class="admin-enquiry-box">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px;">
          <div>
            <div style="font-weight: 800; font-size: 1.05rem; color: #FFFFFF;">${escapeHtml(enq.name)}</div>
            <div style="font-size: 0.85rem; color: #94A3B8; margin-top: 2px;">
              🏢 <strong>${escapeHtml(enq.company || 'Retailer')}</strong> &nbsp;|&nbsp; 
              📞 <a href="tel:${escapeHtml(enq.phone)}" style="color: var(--anfal-red); text-decoration: underline;">${escapeHtml(enq.phone)}</a>
            </div>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 0.75rem; color: #64748B;">${escapeHtml(enq.date)}</div>
            <button class="cms-action-btn delete" style="margin-top: 8px;" onclick="window.removeEnquiry('${enq.id}')">Delete</button>
          </div>
        </div>
        <div style="background: #1E293B; border: 1px solid #334155; padding: 12px 16px; border-radius: 4px; font-size: 0.9rem; line-height: 1.5; color: #F1F5F9;">
          ${escapeHtml(enq.message)}
        </div>
      </div>
    `;
  }).join("");
}

window.removeEnquiry = function(id) {
  if (confirm("Delete this wholesale enquiry?")) {
    CMS.deleteEnquiry(id);
    renderAdminEnquiriesList();
    showAdminToast("Enquiry removed.");
  }
};

function exportEnquiriesToCSV() {
  const enquiries = CMS.getEnquiries();
  if (enquiries.length === 0) {
    showAdminToast("No enquiries to export.", "warning");
    return;
  }

  const headers = ["Date", "Name", "Company", "Phone", "Message", "Status"];
  const rows = enquiries.map(e => [
    `"${e.date || ''}"`,
    `"${(e.name || '').replace(/"/g, '""')}"`,
    `"${(e.company || '').replace(/"/g, '""')}"`,
    `"${(e.phone || '').replace(/"/g, '""')}"`,
    `"${(e.message || '').replace(/"/g, '""')}"`,
    `"${e.status || 'New'}"`
  ]);

  const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `anfal_enquiries_${Date.now()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function setupResetButton() {
  const resetBtn = document.getElementById("btn-admin-reset");
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      if (confirm("Reset company settings and brands to defaults?")) {
        CMS.resetDefaults();
        loadCompanyFormValues();
        renderAdminBrandsTable();
        renderAdminEnquiriesList();
        showAdminToast("Reset to factory defaults.");
      }
    });
  }
}

function showAdminToast(message, type = "success") {
  let toast = document.getElementById("admin-toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "admin-toast";
    toast.className = "toast-notice";
    document.body.appendChild(toast);
  }

  toast.innerHTML = `<span>${escapeHtml(message)}</span>`;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3500);
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
