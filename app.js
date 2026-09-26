/**
 * ANFAL ENTERPRISES — Wholesale FMCG Distribution Hub
 * Client Application Logic & Dynamic CMS Synchronization
 */

document.addEventListener("DOMContentLoaded", () => {
  initAnfalApp();
});

function initAnfalApp() {
  setupThemeToggle();
  renderCompanyData();
  renderSiteImages();
  renderPillars();
  renderBrands();
  renderTeam();
  setupWholesaleForm();
  setupNavigation();
  setupBrandSlider();
  initStrengthsObserver();
  initStatCounters();
  initBrandsObserver();
  initFacilityObserver();
  initTeamObserver();
  initContactObserver();
  initFooterObserver();
  setupCMSListeners();
}

/**
 * 0. Theme Toggle & Dark Mode Controller
 */
function setupThemeToggle() {
  const toggleBtn = document.getElementById("theme-toggle-btn");
  const toggleIcon = document.getElementById("theme-toggle-icon");

  const getPreferredTheme = () => {
    const stored = localStorage.getItem("anfal_theme");
    if (stored === "dark" || stored === "light") return stored;
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  };

  const applyTheme = (theme) => {
    if (theme === "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
      document.documentElement.classList.add("dark");
      if (toggleIcon) toggleIcon.textContent = "light_mode";
    } else {
      document.documentElement.removeAttribute("data-theme");
      document.documentElement.classList.remove("dark");
      if (toggleIcon) toggleIcon.textContent = "dark_mode";
    }
  };

  // Initial apply
  applyTheme(getPreferredTheme());

  // Listen for system theme changes if no stored preference
  if (window.matchMedia) {
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
      if (!localStorage.getItem("anfal_theme")) {
        applyTheme(e.matches ? "dark" : "light");
      }
    });
  }

  // Toggle button handler
  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      const current = document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
      const next = current === "dark" ? "light" : "dark";
      localStorage.setItem("anfal_theme", next);
      applyTheme(next);
    });
  }
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
          ${founder.phone ? `
            <div class="mt-3">
              <a href="tel:${escapeHtml(founder.phone.replace(/[^0-9+]/g, ''))}" class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container/60 hover:bg-primary hover:text-white transition-colors text-on-surface font-mono text-xs font-bold border border-hairline">
                <span class="material-symbols-outlined text-[14px]">call</span>
                <span>${escapeHtml(founder.phone)}</span>
              </a>
            </div>
          ` : ''}
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
              ${member.phone ? `
                <a href="tel:${escapeHtml(member.phone.replace(/[^0-9+]/g, ''))}" class="inline-flex items-center gap-1.5 mt-2 px-2.5 py-1 rounded-full bg-surface-container/60 hover:bg-primary hover:text-white transition-colors text-on-surface font-mono text-[11px] font-bold border border-outline-variant/30">
                  <span class="material-symbols-outlined text-[13px]">call</span>
                  <span>${escapeHtml(member.phone)}</span>
                </a>
              ` : ''}
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
  const form = document.getElementById("enquiry-form") || document.getElementById("wholesale-form");
  const successBox = document.getElementById("enquiry-success");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const nameInput = document.getElementById("enq-name") || document.getElementById("form-name");
    const companyInput = document.getElementById("enq-company") || document.getElementById("form-store");
    const phoneInput = document.getElementById("enq-phone") || document.getElementById("form-phone");
    const townInput = document.getElementById("enq-town") || document.getElementById("form-town");
    const reasonSelect = document.getElementById("enq-reason");
    const messageInput = document.getElementById("enq-message") || document.getElementById("form-message");

    const name = nameInput ? nameInput.value.trim() : "";
    const company = companyInput ? companyInput.value.trim() : "";
    const phone = phoneInput ? phoneInput.value.trim() : "";
    const town = townInput ? townInput.value.trim() : "";
    const reason = reasonSelect ? reasonSelect.value : "Wholesale Supply / Bulk Purchase";
    const userMsg = messageInput ? messageInput.value.trim() : "";

    // Validation check with error horizontal shake (450ms)
    let hasError = false;
    [nameInput, companyInput, phoneInput, townInput].forEach(input => {
      if (input && !input.value.trim()) {
        hasError = true;
        input.classList.remove("field-error-shake");
        void input.offsetWidth; // Trigger reflow
        input.classList.add("field-error-shake");
        setTimeout(() => {
          input.classList.remove("field-error-shake");
        }, 450);
      }
    });

    if (hasError) return;

    const messageContent = `[Town: ${town}] [Reason: ${reason}] ${userMsg ? 'Note: ' + userMsg : ''}`;

    const enquiryPayload = {
      name: name,
      company: `${company} (${town})`,
      phone: phone,
      town: town,
      reason: reason,
      message: messageContent
    };

    if (typeof CMS !== "undefined" && CMS.addEnquiry) {
      CMS.addEnquiry(enquiryPayload);
    }

    form.reset();
    if (successBox) {
      successBox.classList.remove("hidden");
      successBox.classList.remove("enquiry-success-animated");
      void successBox.offsetWidth; // Trigger reflow
      successBox.classList.add("enquiry-success-animated");
      successBox.scrollIntoView({ behavior: "smooth", block: "center" });
      setTimeout(() => {
        successBox.classList.add("hidden");
        successBox.classList.remove("enquiry-success-animated");
      }, 8000);
    } else {
      showToast("Wholesale registration submitted! Our commercial desk will reach you within 4 hours.", "success");
    }
  });
}

/**
 * 6. Brand Slider Continuous Marquee & Interaction
 */
function setupBrandSlider() {
  const track = document.getElementById("brands-track");
  if (!track) return;

  // Clone items if marquee track to ensure seamless loop
  if (track.classList.contains("brands-marquee-container") || track.classList.contains("animate-marquee")) {
    if (track.children.length > 0 && track.dataset.duplicated !== "true") {
      const children = Array.from(track.children);
      children.forEach(child => {
        const clone = child.cloneNode(true);
        clone.setAttribute("aria-hidden", "true");
        track.appendChild(clone);
      });
      track.dataset.duplicated = "true";
    }
  }

  const prevBtn = document.getElementById("brand-prev");
  const nextBtn = document.getElementById("brand-next");

  if (prevBtn && nextBtn) {
    const scrollAmount = 360;
    prevBtn.addEventListener("click", () => {
      track.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    });
    nextBtn.addEventListener("click", () => {
      track.scrollBy({ left: scrollAmount, behavior: "smooth" });
    });
  }
}

/**
 * 7. Active Navigation Highlighting, Shrink-on-Scroll & Mobile Drawer
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

  // Sticky nav shrink-on-scroll with smooth transitions
  const headerNav = document.querySelector("header") || document.querySelector(".floating-nav-container");
  if (headerNav) {
    window.addEventListener("scroll", () => {
      if ((window.scrollY || window.pageYOffset || 0) > 40) {
        headerNav.classList.add("scrolled");
      } else {
        headerNav.classList.remove("scrolled");
      }
    }, { passive: true });
  }

  // Active section scroll indicator & sliding pill
  const nav = document.getElementById("desktop-nav");
  const pill = document.getElementById("desktop-nav-pill");
  const sections = document.querySelectorAll("main section[id]");
  const navLinks = document.querySelectorAll("#desktop-nav .nav-item, #nav-menu-links a.nav-link");
  let activePath = "";

  function updatePillPosition(targetLink) {
    if (!nav || !pill || !targetLink) return;
    const navRect = nav.getBoundingClientRect();
    const linkRect = targetLink.getBoundingClientRect();

    const x = Math.round(linkRect.left - navRect.left);
    const y = Math.round(linkRect.top - navRect.top);
    const w = Math.round(linkRect.width);
    const h = Math.round(linkRect.height);

    pill.style.setProperty("--pill-x", `${x}px`);
    pill.style.setProperty("--pill-y", `${y}px`);
    pill.style.setProperty("--pill-w", `${w}px`);
    pill.style.setProperty("--pill-h", `${h}px`);
    pill.classList.add("is-active");
  }

  function setActiveLink(path) {
    if (path === activePath && pill && pill.classList.contains("is-active")) return;
    activePath = path;

    let matchedLink = null;
    navLinks.forEach(link => {
      const linkPath = link.getAttribute("data-path") || link.getAttribute("data-target") || (link.getAttribute("href") || "").replace("#", "");
      if (linkPath === path) {
        link.classList.add("is-active");
        link.setAttribute("aria-current", "page");
        matchedLink = link;
      } else {
        link.classList.remove("is-active");
        link.removeAttribute("aria-current");
      }
    });

    if (matchedLink && nav && nav.contains(matchedLink)) {
      updatePillPosition(matchedLink);
    }
  }

  function onScroll() {
    let current = "";
    const scrollPos = window.scrollY || window.pageYOffset || 0;

    if (scrollPos < 80) {
      current = "home";
    } else {
      sections.forEach(section => {
        const sectionTop = section.offsetTop - 140;
        if (scrollPos >= sectionTop) {
          current = section.getAttribute("id");
        }
      });
    }

    if (current) {
      setActiveLink(current);
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", () => {
    const activeItem = document.querySelector("#desktop-nav .nav-item.is-active") || document.querySelector("#desktop-nav .nav-item");
    if (activeItem) updatePillPosition(activeItem);
  }, { passive: true });

  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      const path = link.getAttribute("data-path") || link.getAttribute("data-target") || (link.getAttribute("href") || "").replace("#", "");
      if (path) setActiveLink(path);
    });
  });

  setTimeout(() => {
    onScroll();
  }, 60);
}

/**
 * 7b. Core Strengths Staggered Entrance on Scroll & Reversible Scroll Response
 */
function initStrengthsObserver() {
  const strengthsSection = document.getElementById("strengths");
  const headerEl = document.querySelector(".strengths-header");
  const strengthCards = document.querySelectorAll(".strength-card");
  const statEls = document.querySelectorAll(".stat-counter");
  if (!strengthsSection) return;

  let headerVisible = false;
  let cardsVisible = false;
  let cardTimeouts = [];

  const runStatCounter = (el) => {
    const target = parseInt(el.getAttribute("data-target"), 10);
    const prefix = el.getAttribute("data-prefix") || "";
    const suffix = el.getAttribute("data-suffix") || "";
    if (isNaN(target)) return;

    const duration = 1800;
    const startTime = performance.now();

    const updateCount = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic: 1 - (1 - t)^3
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentVal = Math.floor(easeOut * target);
      el.textContent = `${prefix}${currentVal}${suffix}`;

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      } else {
        el.textContent = `${prefix}${target}${suffix}`;
      }
    };

    requestAnimationFrame(updateCount);
  };

  // Header Observer: triggers when header enters viewport
  if (headerEl) {
    const headerObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (!headerVisible) {
            headerVisible = true;
            headerEl.classList.add("is-visible");
          }
        } else if (entry.boundingClientRect.top > 0) {
          headerVisible = false;
          headerEl.classList.remove("is-visible");
        }
      });
    }, { threshold: 0.25, rootMargin: "0px 0px -50px 0px" });
    headerObserver.observe(headerEl);
  }

  // Cards Grid Observer: triggers when cards are comfortably in viewport
  const cardsContainer = document.querySelector("#strengths .grid") || strengthsSection;
  const cardsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if (!cardsVisible) {
          cardsVisible = true;
          cardTimeouts.forEach(t => clearTimeout(t));
          cardTimeouts = [];
          strengthCards.forEach((card, index) => {
            const timeout = setTimeout(() => {
              card.classList.add("is-visible");
            }, index * 180);
            cardTimeouts.push(timeout);
          });
          statEls.forEach(runStatCounter);
        }
      } else if (entry.boundingClientRect.top > 0) {
        cardsVisible = false;
        cardTimeouts.forEach(t => clearTimeout(t));
        cardTimeouts = [];
        strengthCards.forEach(card => card.classList.remove("is-visible"));
        statEls.forEach(el => {
          const prefix = el.getAttribute("data-prefix") || "";
          const suffix = el.getAttribute("data-suffix") || "";
          el.textContent = `${prefix}0${suffix}`;
        });
      }
    });
  }, { threshold: 0.15, rootMargin: "0px 0px -60px 0px" });

  cardsObserver.observe(cardsContainer);
}

/**
 * 7c. Animated Stat Counters from 0 to Target Value
 */
function initStatCounters() {
  // Cohesively synchronized with initStrengthsObserver
}

/**
 * 7d. Verified FMCG Brands Staggered Entrance, Parallax & Reversible Scroll Response
 */
let animateNewlyAddedBrandCards = null;

function initBrandsObserver() {
  const brandsSection = document.getElementById("brands");
  const headerEl = document.querySelector(".brands-section-header");
  if (!brandsSection) return;

  let headerVisible = false;
  let cardsVisible = false;
  let cardTimeouts = [];

  // 1. Header Observer: Trigger when header enters viewport
  if (headerEl) {
    const headerObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (!headerVisible) {
            headerVisible = true;
            headerEl.classList.add("is-visible");
          }
        } else if (entry.boundingClientRect.top > 0) {
          headerVisible = false;
          headerEl.classList.remove("is-visible");
        }
      });
    }, { threshold: 0.25, rootMargin: "0px 0px -50px 0px" });
    headerObserver.observe(headerEl);
  }

  // 2. Animate newly added brand cards when "See More" is clicked
  animateNewlyAddedBrandCards = () => {
    const unrevealedCards = document.querySelectorAll("#brand-cards-container .brand-card:not(.is-visible)");
    if (!unrevealedCards.length) return;

    if (cardsVisible) {
      // Stagger ONLY the new cards, starting at 0ms for the first new card
      unrevealedCards.forEach((card, newIndex) => {
        const timeout = setTimeout(() => {
          card.classList.add("is-visible");
        }, newIndex * 200);
        cardTimeouts.push(timeout);
      });
    }
  };

  // Trigger initial reveal of unrevealed cards when section scrolls into view
  const triggerCardsReveal = () => {
    const unrevealedCards = document.querySelectorAll("#brand-cards-container .brand-card:not(.is-visible), #brands-track > div:not(.is-visible)");
    cardTimeouts.forEach(t => clearTimeout(t));
    cardTimeouts = [];
    unrevealedCards.forEach((card, index) => {
      const timeout = setTimeout(() => {
        card.classList.add("is-visible");
      }, index * 200); // 200ms deliberate stagger
      cardTimeouts.push(timeout);
    });
  };

  const resetCardsReveal = () => {
    const brandCards = document.querySelectorAll("#brand-cards-container .brand-card, #brands-track > div");
    cardTimeouts.forEach(t => clearTimeout(t));
    cardTimeouts = [];
    brandCards.forEach(card => {
      card.classList.remove("is-visible");
      card.style.setProperty("--brand-parallax-y", "0px");
    });
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if (!cardsVisible) {
          cardsVisible = true;
          triggerCardsReveal();
        }
      } else if (entry.boundingClientRect.top > 0) {
        cardsVisible = false;
        resetCardsReveal();
      }
    });
  }, { threshold: 0.22, rootMargin: "0px 0px -60px 0px" });

  sectionObserver.observe(brandsSection);

  // 3. Subtle Scroll Parallax (Max 20-30px, differential column speeds)
  let parallaxTicking = false;
  const isReducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!isReducedMotion) {
    window.addEventListener("scroll", () => {
      if (parallaxTicking) return;
      parallaxTicking = true;
      requestAnimationFrame(() => {
        parallaxTicking = false;
        if (!cardsVisible) return;

        const rect = brandsSection.getBoundingClientRect();
        const windowH = window.innerHeight;
        if (rect.top < windowH && rect.bottom > 0) {
          const progress = (windowH - rect.top) / (windowH + rect.height);
          const centeredProgress = Math.max(-1, Math.min(1, (progress - 0.5) * 2));
          const brandCards = document.querySelectorAll("#brand-cards-container .brand-card, #brands-track > div");

          brandCards.forEach((card, index) => {
            const col = index % 3;
            let factor = 0;
            if (col === 0) factor = -14;
            else if (col === 1) factor = 18;
            else factor = -10;

            const offsetY = Math.round(centeredProgress * factor);
            card.style.setProperty("--brand-parallax-y", `${offsetY}px`);
          });
        }
      });
    }, { passive: true });
  }
}

/**
 * 7e. About / Facility Section Entrance, Reveal & Parallax
 */
function initFacilityObserver() {
  const facilitySection = document.getElementById("facility");
  if (!facilitySection) return;

  let isFacilityVisible = false;

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if (!isFacilityVisible) {
          isFacilityVisible = true;
          facilitySection.classList.add("is-visible");
        }
      } else if (entry.boundingClientRect.top > 0) {
        isFacilityVisible = false;
        facilitySection.classList.remove("is-visible");
        facilitySection.style.setProperty("--fac-image-parallax-y", "0px");
        facilitySection.style.setProperty("--fac-text-parallax-y", "0px");
      }
    });
  }, { threshold: 0.22, rootMargin: "0px 0px -50px 0px" });

  sectionObserver.observe(facilitySection);

  // Subtle scroll parallax (Image: ~20-30px, Text: ~10-15px)
  let parallaxTicking = false;
  const isReducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!isReducedMotion) {
    window.addEventListener("scroll", () => {
      if (parallaxTicking) return;
      parallaxTicking = true;
      requestAnimationFrame(() => {
        parallaxTicking = false;
        if (!isFacilityVisible) return;

        const rect = facilitySection.getBoundingClientRect();
        const windowH = window.innerHeight;
        if (rect.top < windowH && rect.bottom > 0) {
          const isMobile = window.innerWidth < 768;
          if (isMobile) {
            facilitySection.style.setProperty("--fac-image-parallax-y", "0px");
            facilitySection.style.setProperty("--fac-text-parallax-y", "0px");
            return;
          }

          const progress = (windowH - rect.top) / (windowH + rect.height);
          const centeredProgress = Math.max(-1, Math.min(1, (progress - 0.5) * 2));

          const imageOffset = Math.round(centeredProgress * 24);
          const textOffset = Math.round(centeredProgress * -12);

          facilitySection.style.setProperty("--fac-image-parallax-y", `${imageOffset}px`);
          facilitySection.style.setProperty("--fac-text-parallax-y", `${textOffset}px`);
        }
      });
    }, { passive: true });
  }
}

/**
 * 7f. Team / Leadership Section Sequential Entrance, Reveal & Parallax
 */
let updateTeamObserverCards = null;

function initTeamObserver() {
  const teamSection = document.getElementById("team");
  const headerEl = document.querySelector(".team-section-header");
  if (!teamSection) return;

  let headerVisible = false;
  let cardsVisible = false;
  let cardTimeouts = [];

  // 1. Header Observer: Trigger when heading enters viewport
  if (headerEl) {
    const headerObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (!headerVisible) {
            headerVisible = true;
            headerEl.classList.add("is-visible");
          }
        } else if (entry.boundingClientRect.top > 0) {
          headerVisible = false;
          headerEl.classList.remove("is-visible");
        }
      });
    }, { threshold: 0.25, rootMargin: "0px 0px -50px 0px" });
    headerObserver.observe(headerEl);
  }

  // 2. Team Cards Reveal: Trigger when ~20-30% of section has entered viewport
  const triggerCardsReveal = () => {
    const teamCards = document.querySelectorAll("#team-cards-container .team-card:not(.is-visible), #leadership-container > div:not(.is-visible)");
    cardTimeouts.forEach(t => clearTimeout(t));
    cardTimeouts = [];
    teamCards.forEach((card, index) => {
      const timeout = setTimeout(() => {
        card.classList.add("is-visible");
      }, index * 220); // 220ms deliberate stagger
      cardTimeouts.push(timeout);
    });
  };

  const resetCardsReveal = () => {
    const teamCards = document.querySelectorAll("#team-cards-container .team-card, #leadership-container > div");
    cardTimeouts.forEach(t => clearTimeout(t));
    cardTimeouts = [];
    teamCards.forEach(card => {
      card.classList.remove("is-visible");
      card.style.setProperty("--team-parallax-y", "0px");
    });
  };

  updateTeamObserverCards = () => {
    if (cardsVisible) {
      triggerCardsReveal();
    }
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if (!cardsVisible) {
          cardsVisible = true;
          triggerCardsReveal();
        }
      } else if (entry.boundingClientRect.top > 0) {
        cardsVisible = false;
        resetCardsReveal();
      }
    });
  }, { threshold: 0.22, rootMargin: "0px 0px -50px 0px" });

  sectionObserver.observe(teamSection);

  // 3. Subtle Scroll Parallax (Max 20-30px, differential column speeds)
  let parallaxTicking = false;
  const isReducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!isReducedMotion) {
    window.addEventListener("scroll", () => {
      if (parallaxTicking) return;
      parallaxTicking = true;
      requestAnimationFrame(() => {
        parallaxTicking = false;
        if (!cardsVisible) return;

        const rect = teamSection.getBoundingClientRect();
        const windowH = window.innerHeight;
        if (rect.top < windowH && rect.bottom > 0) {
          const isMobile = window.innerWidth < 768;
          const teamCards = document.querySelectorAll("#team-cards-container .team-card, #leadership-container > div");
          if (isMobile) {
            teamCards.forEach(card => card.style.setProperty("--team-parallax-y", "0px"));
            return;
          }

          const progress = (windowH - rect.top) / (windowH + rect.height);
          const centeredProgress = Math.max(-1, Math.min(1, (progress - 0.5) * 2));

          teamCards.forEach((card, index) => {
            const col = index % 4;
            let factor = 0;
            if (col === 0) factor = -12;
            else if (col === 1) factor = 16;
            else if (col === 2) factor = -8;
            else factor = 14;

            const offsetY = Math.round(centeredProgress * factor);
            card.style.setProperty("--team-parallax-y", `${offsetY}px`);
          });
        }
      });
    }, { passive: true });
  }
}

/**
 * 7g. Contact / Location Section Sequential Entrance, Map Reveal & Parallax
 */
function initContactObserver() {
  const contactSection = document.getElementById("contact");
  const headerEl = document.querySelector(".contact-section-header");
  if (!contactSection) return;

  let isContactVisible = false;
  let detailTimeouts = [];
  let formFieldTimeouts = [];
  let submitBtnTimeout = null;
  let markerTimeout = null;

  const triggerDetailsReveal = () => {
    // 1. Reveal Contact Desk items
    const detailItems = document.querySelectorAll(".contact-detail-item");
    detailTimeouts.forEach(t => clearTimeout(t));
    detailTimeouts = [];
    detailItems.forEach((item, index) => {
      const timeout = setTimeout(() => {
        item.classList.add("is-visible");
      }, index * 200); // 200ms deliberate stagger
      detailTimeouts.push(timeout);
    });

    // 2. Sequential reveal of Enquiry Form fields (150ms stagger, 800ms duration)
    const formFields = document.querySelectorAll(".enquiry-field-group");
    formFieldTimeouts.forEach(t => clearTimeout(t));
    formFieldTimeouts = [];
    formFields.forEach((field, index) => {
      const timeout = setTimeout(() => {
        field.classList.add("is-visible");
      }, index * 150); // 150ms stagger
      formFieldTimeouts.push(timeout);
    });

    // 3. Submit button reveal (enters after fields ~ 6 * 150 = 900ms + 150ms = ~1050ms)
    const submitBtn = document.querySelector(".enquiry-submit-btn");
    if (submitBtn) {
      if (submitBtnTimeout) clearTimeout(submitBtnTimeout);
      submitBtnTimeout = setTimeout(() => {
        submitBtn.classList.add("is-visible");
      }, formFields.length * 150 + 150);
    }

    // 4. Marker pulse animation after map finishes revealing (~1400ms)
    if (markerTimeout) clearTimeout(markerTimeout);
    markerTimeout = setTimeout(() => {
      const markerIcons = document.querySelectorAll(".leaflet-marker-icon");
      markerIcons.forEach(icon => {
        icon.classList.remove("marker-pulsing");
        void icon.offsetWidth;
        icon.classList.add("marker-pulsing");
      });
    }, 1400);
  };

  const resetDetailsReveal = () => {
    detailTimeouts.forEach(t => clearTimeout(t));
    detailTimeouts = [];
    formFieldTimeouts.forEach(t => clearTimeout(t));
    formFieldTimeouts = [];
    if (submitBtnTimeout) clearTimeout(submitBtnTimeout);
    if (markerTimeout) clearTimeout(markerTimeout);

    const detailItems = document.querySelectorAll(".contact-detail-item");
    detailItems.forEach(item => item.classList.remove("is-visible"));

    const formFields = document.querySelectorAll(".enquiry-field-group");
    formFields.forEach(field => field.classList.remove("is-visible"));

    const submitBtn = document.querySelector(".enquiry-submit-btn");
    if (submitBtn) submitBtn.classList.remove("is-visible");

    contactSection.style.setProperty("--contact-content-parallax-y", "0px");
    contactSection.style.setProperty("--contact-map-parallax-y", "0px");
  };

  // 1. Header Observer: Trigger when heading enters viewport
  if (headerEl) {
    const headerObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          headerEl.classList.add("is-visible");
        } else if (entry.boundingClientRect.top > 0) {
          headerEl.classList.remove("is-visible");
        }
      });
    }, { threshold: 0.25, rootMargin: "0px 0px -50px 0px" });
    headerObserver.observe(headerEl);
  }

  // 2. Section Observer: Trigger content & map reveal
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if (!isContactVisible) {
          isContactVisible = true;
          contactSection.classList.add("is-visible");
          triggerDetailsReveal();
        }
      } else if (entry.boundingClientRect.top > 0) {
        isContactVisible = false;
        contactSection.classList.remove("is-visible");
        resetDetailsReveal();
      }
    });
  }, { threshold: 0.18, rootMargin: "0px 0px -50px 0px" });

  sectionObserver.observe(contactSection);

  // 3. Subtle Scroll Parallax (Map: max 20px, Content: max 10px)
  let parallaxTicking = false;
  const isReducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!isReducedMotion) {
    window.addEventListener("scroll", () => {
      if (parallaxTicking) return;
      parallaxTicking = true;
      requestAnimationFrame(() => {
        parallaxTicking = false;
        if (!isContactVisible) return;

        const rect = contactSection.getBoundingClientRect();
        const windowH = window.innerHeight;
        if (rect.top < windowH && rect.bottom > 0) {
          const isMobile = window.innerWidth < 768;
          if (isMobile) {
            contactSection.style.setProperty("--contact-content-parallax-y", "0px");
            contactSection.style.setProperty("--contact-map-parallax-y", "0px");
            return;
          }

          const progress = (windowH - rect.top) / (windowH + rect.height);
          const centeredProgress = Math.max(-1, Math.min(1, (progress - 0.5) * 2));

          // Map moves ~18px, Content moves ~-9px
          const mapOffset = Math.round(centeredProgress * 18);
          const contentOffset = Math.round(centeredProgress * -9);

          contactSection.style.setProperty("--contact-map-parallax-y", `${mapOffset}px`);
          contactSection.style.setProperty("--contact-content-parallax-y", `${contentOffset}px`);
        }
      });
    }, { passive: true });
  }
}

/**
 * 15. Footer Section Sequential Entrance, Brand Chips Reveal & Subtle Parallax
 */
function initFooterObserver() {
  const footerEl = document.getElementById("site-footer") || document.querySelector("footer");
  if (!footerEl) return;

  let isFooterVisible = false;
  let colTimeouts = [];
  let chipTimeouts = [];

  const triggerFooterReveal = () => {
    // 1. Reveal Footer Columns with 200ms stagger
    const cols = footerEl.querySelectorAll(".footer-col-anim");
    colTimeouts.forEach(t => clearTimeout(t));
    colTimeouts = [];
    cols.forEach((col, index) => {
      const timeout = setTimeout(() => {
        col.classList.add("is-visible");
      }, index * 200);
      colTimeouts.push(timeout);
    });

    // 2. Reveal Authorized Brand Chips with 180ms stagger
    const chips = footerEl.querySelectorAll(".footer-brand-chip");
    chipTimeouts.forEach(t => clearTimeout(t));
    chipTimeouts = [];
    chips.forEach((chip, index) => {
      const timeout = setTimeout(() => {
        chip.classList.add("is-visible");
      }, 400 + index * 180);
      chipTimeouts.push(timeout);
    });
  };

  const resetFooterReveal = () => {
    colTimeouts.forEach(t => clearTimeout(t));
    colTimeouts = [];
    chipTimeouts.forEach(t => clearTimeout(t));
    chipTimeouts = [];

    const cols = footerEl.querySelectorAll(".footer-col-anim");
    cols.forEach(col => col.classList.remove("is-visible"));

    const chips = footerEl.querySelectorAll(".footer-brand-chip");
    chips.forEach(chip => chip.classList.remove("is-visible"));

    footerEl.style.setProperty("--footer-parallax-y", "0px");
  };

  const footerObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if (!isFooterVisible) {
          isFooterVisible = true;
          footerEl.classList.add("is-visible");
          triggerFooterReveal();
        }
      } else if (entry.boundingClientRect.top > 0) {
        isFooterVisible = false;
        footerEl.classList.remove("is-visible");
        resetFooterReveal();
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

  footerObserver.observe(footerEl);

  // Subtle scroll parallax across 500-700px (max 10-15px)
  let parallaxTicking = false;
  const isReducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!isReducedMotion) {
    window.addEventListener("scroll", () => {
      if (parallaxTicking) return;
      parallaxTicking = true;
      requestAnimationFrame(() => {
        parallaxTicking = false;
        if (!isFooterVisible) return;

        const rect = footerEl.getBoundingClientRect();
        const windowH = window.innerHeight;
        if (rect.top < windowH && rect.bottom > 0) {
          const isMobile = window.innerWidth < 768;
          if (isMobile) {
            footerEl.style.setProperty("--footer-parallax-y", "0px");
            return;
          }

          const progress = (windowH - rect.top) / (windowH + rect.height);
          const centeredProgress = Math.max(-1, Math.min(1, (progress - 0.5) * 2));

          // Max 10-12px imperceptible subtle lift
          const footerOffset = Math.round(centeredProgress * -10);
          footerEl.style.setProperty("--footer-parallax-y", `${footerOffset}px`);
        }
      });
    }, { passive: true });
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
