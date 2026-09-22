/**
 * ANFAL ENTERPRISES - Standalone Admin Portal Controller
 * Drives admin.html dashboard (Company, Team, Brands with Image upload, Enquiries).
 */

document.addEventListener("DOMContentLoaded", () => {
  initAdminDashboard();
});

function initAdminDashboard() {
  setupAdminTabs();
  loadCompanyFormValues();
  setupCompanyForm();
  renderTeamEditor();
  setupTeamForm();
  setupBrandForm();
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
      operatingHours: document.getElementById("cms-input-hours").value.trim(),
      googleMapsUrl: document.getElementById("cms-input-maps-url").value.trim(),
      heroImage: "assets/images/anfal-building.jpg",
      aboutImage: "assets/images/anfal-building.jpg"
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
  setVal("cms-input-hours", data.operatingHours);
  setVal("cms-input-maps-url", data.googleMapsUrl);
}

/**
 * Team Management Setup
 */
function renderTeamEditor() {
  const container = document.getElementById("cms-team-list-container");
  if (!container) return;

  const team = CMS.getTeam();

  container.innerHTML = team.map((member, idx) => `
    <div class="team-edit-card" data-index="${idx}">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
        <span style="font-weight: 800; color: var(--anfal-red); font-size: 0.85rem; text-transform: uppercase;">Role ${idx + 1}: ${escapeHtml(member.role)}</span>
        <span style="font-size: 0.75rem; color: #94A3B8;">ID: ${escapeHtml(member.id)}</span>
      </div>

      <div class="cms-form-grid">
        <div class="cms-input-group">
          <label class="cms-label">Designation / Role Title</label>
          <input type="text" class="cms-input team-input-role" value="${escapeHtml(member.role)}">
        </div>
        <div class="cms-input-group">
          <label class="cms-label">Member Name</label>
          <input type="text" class="cms-input team-input-name" value="${escapeHtml(member.name)}">
        </div>
        <div class="cms-input-group">
          <label class="cms-label">Category Subtitle</label>
          <input type="text" class="cms-input team-input-category" value="${escapeHtml(member.category)}">
        </div>
        <div class="cms-input-group">
          <label class="cms-label">Direct Phone Number</label>
          <input type="text" class="cms-input team-input-phone" value="${escapeHtml(member.phone || '')}" placeholder="+91 98450 00000">
        </div>
        <div class="cms-input-group full-width">
          <label class="cms-label">Contact Email</label>
          <input type="email" class="cms-input team-input-email" value="${escapeHtml(member.email || '')}" placeholder="name@anfalenterprises.com">
        </div>
        <div class="cms-input-group full-width">
          <label class="cms-label">Role Description / Bio</label>
          <textarea class="cms-textarea team-input-bio">${escapeHtml(member.bio)}</textarea>
        </div>
      </div>
    </div>
  `).join("");
}

function setupTeamForm() {
  const saveBtn = document.getElementById("btn-save-team");
  if (!saveBtn) return;

  saveBtn.addEventListener("click", () => {
    const cards = document.querySelectorAll(".team-edit-card");
    const currentTeam = CMS.getTeam();
    const updatedTeam = [];

    cards.forEach((card, idx) => {
      const original = currentTeam[idx] || {};
      updatedTeam.push({
        id: original.id || `team-${idx + 1}`,
        role: card.querySelector(".team-input-role").value.trim(),
        name: card.querySelector(".team-input-name").value.trim(),
        category: card.querySelector(".team-input-category").value.trim(),
        phone: card.querySelector(".team-input-phone").value.trim() || "+91 98450 12345",
        email: card.querySelector(".team-input-email").value.trim(),
        bio: card.querySelector(".team-input-bio").value.trim(),
        avatarIcon: original.avatarIcon || "shield"
      });
    });

    if (CMS.saveTeam(updatedTeam)) {
      showAdminToast("Leadership & Team details saved successfully!");
    } else {
      showAdminToast("Failed to save team details.", "warning");
    }
  });
}

/**
 * Brands Management Setup with Image Upload & URL
 */
let currentBrandImageBase64 = "";

function setupBrandForm() {
  const form = document.getElementById("cms-brand-edit-form");
  const fileInput = document.getElementById("cms-brand-image-file");
  const urlInput = document.getElementById("cms-brand-image-url");
  const previewBox = document.getElementById("brand-img-preview-box");
  const cancelBtn = document.getElementById("btn-cancel-brand-edit");

  if (fileInput) {
    fileInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          currentBrandImageBase64 = event.target.result;
          if (previewBox) {
            previewBox.innerHTML = `<img src="${currentBrandImageBase64}" alt="Brand Preview">`;
          }
          if (urlInput) urlInput.value = "";
        };
        reader.readAsDataURL(file);
      }
    });
  }

  if (urlInput) {
    urlInput.addEventListener("input", () => {
      const url = urlInput.value.trim();
      if (url) {
        currentBrandImageBase64 = url;
        if (previewBox) {
          previewBox.innerHTML = `<img src="${url}" alt="Brand Preview" onerror="this.parentElement.innerHTML='<span style=\\'font-size:0.65rem;color:#EF4444;\\'>Invalid URL</span>'">`;
        }
      } else {
        currentBrandImageBase64 = "";
        if (previewBox) previewBox.innerHTML = `<span style="font-size: 0.7rem; color: #64748B;">No Image</span>`;
      }
    });
  }

  if (cancelBtn) {
    cancelBtn.addEventListener("click", () => {
      resetBrandForm();
    });
  }

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const editId = document.getElementById("cms-brand-edit-id").value;
      const name = document.getElementById("cms-brand-name").value.trim();
      const shortName = document.getElementById("cms-brand-shortname").value.trim();
      const category = document.getElementById("cms-brand-category").value.trim();
      const color = document.getElementById("cms-brand-color").value;
      const desc = document.getElementById("cms-brand-desc").value.trim();
      const imageUrl = currentBrandImageBase64 || urlInput.value.trim();

      const brands = CMS.getBrands();

      if (editId) {
        // Update existing brand
        const brandIndex = brands.findIndex(b => b.id === editId);
        if (brandIndex !== -1) {
          brands[brandIndex].name = name;
          brands[brandIndex].shortName = shortName;
          brands[brandIndex].category = category;
          brands[brandIndex].color = color;
          brands[brandIndex].description = desc;
          if (imageUrl) {
            brands[brandIndex].imageUrl = imageUrl;
          }
          CMS.saveBrands(brands);
          showAdminToast(`Updated brand "${name}" successfully!`);
        }
      } else {
        // Add new brand
        CMS.addBrand({
          name,
          shortName,
          category,
          color,
          description: desc,
          imageUrl: imageUrl || ""
        });
        showAdminToast(`Added new brand "${name}"!`);
      }

      resetBrandForm();
      renderAdminBrandsTable();
    });
  }
}

function resetBrandForm() {
  const form = document.getElementById("cms-brand-edit-form");
  if (form) form.reset();
  
  document.getElementById("cms-brand-edit-id").value = "";
  currentBrandImageBase64 = "";
  
  const heading = document.getElementById("brand-form-heading");
  if (heading) heading.textContent = "+ Add / Edit Brand";
  
  const cancelBtn = document.getElementById("btn-cancel-brand-edit");
  if (cancelBtn) cancelBtn.style.display = "none";

  const previewBox = document.getElementById("brand-img-preview-box");
  if (previewBox) previewBox.innerHTML = `<span style="font-size: 0.7rem; color: #64748B;">No Image</span>`;
}

function editBrand(id) {
  const brands = CMS.getBrands();
  const brand = brands.find(b => b.id === id);
  if (!brand) return;

  document.getElementById("cms-brand-edit-id").value = brand.id;
  document.getElementById("cms-brand-name").value = brand.name || "";
  document.getElementById("cms-brand-shortname").value = brand.shortName || "";
  document.getElementById("cms-brand-category").value = brand.category || "";
  document.getElementById("cms-brand-color").value = brand.color || "#005A9C";
  document.getElementById("cms-brand-desc").value = brand.description || "";
  document.getElementById("cms-brand-image-url").value = brand.imageUrl || "";

  currentBrandImageBase64 = brand.imageUrl || "";

  const previewBox = document.getElementById("brand-img-preview-box");
  if (previewBox) {
    if (brand.imageUrl) {
      previewBox.innerHTML = `<img src="${brand.imageUrl}" alt="${brand.name}">`;
    } else if (brand.logoSvg) {
      previewBox.innerHTML = brand.logoSvg;
    } else {
      previewBox.innerHTML = `<span style="font-size: 0.8rem; font-weight: 800; color: ${brand.color || '#000'}">${brand.shortName || 'Logo'}</span>`;
    }
  }

  const heading = document.getElementById("brand-form-heading");
  if (heading) heading.textContent = `✏️ Edit Brand: ${brand.name}`;

  const cancelBtn = document.getElementById("btn-cancel-brand-edit");
  if (cancelBtn) cancelBtn.style.display = "inline-flex";

  // Scroll to form smoothly
  document.getElementById("admin-tab-brands").scrollIntoView({ behavior: "smooth" });
}

/**
 * Brands Management Table
 */
function renderAdminBrandsTable() {
  const tbody = document.getElementById("cms-brands-tbody");
  if (!tbody) return;

  const brands = CMS.getBrands();

  tbody.innerHTML = brands.map((brand, idx) => {
    let logoThumbnail = "";
    if (brand.imageUrl) {
      logoThumbnail = `<img src="${brand.imageUrl}" alt="${escapeHtml(brand.name)}" style="max-height: 32px; max-width: 60px; object-fit: contain;">`;
    } else if (brand.logoSvg) {
      logoThumbnail = brand.logoSvg;
    } else {
      logoThumbnail = `<span style="font-weight: 800; color: ${brand.color || '#0F1B2E'}; font-size: 0.85rem;">${escapeHtml(brand.shortName || brand.name)}</span>`;
    }

    return `
      <tr>
        <td>${idx + 1}</td>
        <td>
          <div class="brand-thumb-preview">
            ${logoThumbnail}
          </div>
        </td>
        <td>
          <strong style="color: #FFFFFF;">${escapeHtml(brand.name)}</strong>
          <div style="font-size: 0.78rem; color: #94A3B8;">${escapeHtml(brand.shortName || '')}</div>
        </td>
        <td>${escapeHtml(brand.category)}</td>
        <td>
          <span style="color: ${brand.active !== false ? '#10B981' : '#EF4444'}; font-weight: 700; font-size: 0.8rem;">
            ${brand.active !== false ? '● Active' : '○ Inactive'}
          </span>
        </td>
        <td>
          <div style="display: flex; gap: 6px;">
            <button type="button" class="btn-view-site" onclick="editBrand('${brand.id}')" style="padding: 4px 8px; font-size: 0.75rem; background: #2563EB; border-color: #3B82F6;">
              Edit
            </button>
            <button type="button" class="btn-view-site" onclick="toggleBrandStatus('${brand.id}')" style="padding: 4px 8px; font-size: 0.75rem;">
              ${brand.active !== false ? 'Deactivate' : 'Activate'}
            </button>
            <button type="button" class="btn-view-site" onclick="deleteBrandItem('${brand.id}')" style="padding: 4px 8px; font-size: 0.75rem; background: #DC2626; border-color: #EF4444;">
              Delete
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join("");
}

window.editBrand = editBrand;

window.toggleBrandStatus = function(brandId) {
  const brands = CMS.getBrands();
  const brand = brands.find(b => b.id === brandId);
  if (brand) {
    brand.active = brand.active === false ? true : false;
    CMS.saveBrands(brands);
    renderAdminBrandsTable();
    showAdminToast(`Updated status for ${brand.name}`);
  }
};

window.deleteBrandItem = function(brandId) {
  if (confirm("Are you sure you want to delete this brand from the list?")) {
    CMS.deleteBrand(brandId);
    renderAdminBrandsTable();
    showAdminToast("Brand deleted.");
  }
};

/**
 * Wholesale Enquiries Inbox
 */
function setupEnquiriesManager() {
  const exportBtn = document.getElementById("btn-export-enquiries");
  if (exportBtn) {
    exportBtn.addEventListener("click", () => exportEnquiriesToCSV());
  }
}

function renderAdminEnquiriesList() {
  const container = document.getElementById("cms-enquiries-container");
  if (!container) return;

  const enquiries = CMS.getEnquiries();

  if (enquiries.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 40px; background: #0F172A; border-radius: var(--radius-xs); border: 1px solid #334155;">
        <p style="color: #94A3B8;">No wholesale enquiries submitted yet.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = enquiries.map(enq => `
    <div class="admin-enquiry-box">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px; flex-wrap: wrap; gap: 8px;">
        <div>
          <strong style="font-size: 1.05rem; color: #FFFFFF;">${escapeHtml(enq.name)}</strong>
          <span style="color: #94A3B8; font-size: 0.85rem; margin-left: 8px;">• ${escapeHtml(enq.company || 'Retailer')}</span>
        </div>
        <div style="display: flex; align-items: center; gap: 10px;">
          <span style="font-size: 0.78rem; color: #64748B;">${escapeHtml(enq.date)}</span>
          <button type="button" onclick="deleteEnquiryItem('${enq.id}')" style="background: transparent; border: 0; color: #EF4444; font-size: 0.8rem; cursor: pointer;">Delete</button>
        </div>
      </div>

      <div style="margin-bottom: 10px;">
        <span style="font-size: 0.82rem; color: #94A3B8;">Phone:</span>
        <a href="tel:${escapeHtml(enq.phone)}" style="color: var(--anfal-red); font-weight: 700; text-decoration: none; margin-left: 6px;">${escapeHtml(enq.phone)}</a>
        <a href="https://wa.me/${escapeHtml(enq.phone).replace(/[^0-9]/g, '')}" target="_blank" style="margin-left: 10px; font-size: 0.78rem; color: #10B981; text-decoration: underline;">Open WhatsApp</a>
      </div>

      <p style="font-size: 0.9rem; color: #E2E8F0; background: #1E293B; padding: 12px; border-radius: var(--radius-xs); line-height: 1.5;">
        ${escapeHtml(enq.message)}
      </p>
    </div>
  `).join("");
}

window.deleteEnquiryItem = function(id) {
  if (confirm("Delete this wholesale enquiry?")) {
    CMS.deleteEnquiry(id);
    renderAdminEnquiriesList();
    showAdminToast("Enquiry deleted.");
  }
};

function exportEnquiriesToCSV() {
  const enquiries = CMS.getEnquiries();
  if (enquiries.length === 0) {
    showAdminToast("No enquiries to export.", "warning");
    return;
  }

  const headers = ["ID", "Name", "Company", "Phone", "Message", "Date", "Status"];
  const rows = enquiries.map(e => [
    e.id,
    `"${(e.name || '').replace(/"/g, '""')}"`,
    `"${(e.company || '').replace(/"/g, '""')}"`,
    `"${(e.phone || '').replace(/"/g, '""')}"`,
    `"${(e.message || '').replace(/"/g, '""')}"`,
    `"${(e.date || '').replace(/"/g, '""')}"`,
    `"${(e.status || '').replace(/"/g, '""')}"`
  ]);

  const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `anfal_wholesale_enquiries_${Date.now()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  showAdminToast("Exported enquiries to CSV!");
}

function setupResetButton() {
  const btn = document.getElementById("btn-admin-reset");
  if (btn) {
    btn.addEventListener("click", () => {
      if (confirm("Reset all company, brand, and team settings to factory defaults?")) {
        CMS.resetDefaults();
        loadCompanyFormValues();
        renderTeamEditor();
        renderAdminBrandsTable();
        renderAdminEnquiriesList();
        showAdminToast("Reset to defaults complete.");
      }
    });
  }
}

function setVal(id, val) {
  const el = document.getElementById(id);
  if (el) el.value = val || "";
}

function showAdminToast(message) {
  alert(message);
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
