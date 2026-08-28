/* ==========================================================================
   NY REALTY INVESTMENT GROUP - MAIN APPLICATION CONTROLLER
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  App.init();
});

const App = {
  currentSlide: 0,
  sliderInterval: null,

  init() {
    this.renderHeroSlides();
    this.initHeroSlider();
    this.initScrollHeader();
    this.initCounters();
    this.renderFeaturedHome();
    this.renderHomeNewSections();
    this.renderPropertiesPage();
    this.renderMarketsPage();
    this.renderPortfolioExits();
    this.renderInsightsPage();
    this.renderAboutPage();
    this.initContactForm();
    this.initSchedulerWidget();
    this.initBrokerSubmission();
    this.initContactMap();
    this.initMobileNav();
    this.initScrollToTop();

    // Submodules initialization
    Router.init();
    InvestmentCalculator.init();
    ModalManager.init();
  },

  /* ------------------------------------------------------------------------
     1. HERO SLIDER CONTROLLER
     ------------------------------------------------------------------------ */
  renderHeroSlides() {
    const sliderContainer = document.getElementById('hero-slider-bg');
    const indicatorContainer = document.getElementById('hero-indicators');
    if (!sliderContainer || !indicatorContainer) return;

    sliderContainer.innerHTML = NY_DATA.heroSlides.map((slide, idx) => `
      <div class="hero-slide ${idx === 0 ? 'active' : ''}" style="background-image: url('${slide.image}');" data-index="${idx}"></div>
    `).join('');

    indicatorContainer.innerHTML = NY_DATA.heroSlides.map((slide, idx) => `
      <div class="indicator-item ${idx === 0 ? 'active' : ''}" data-index="${idx}">
        <span>${slide.id}</span>
        <div class="indicator-line"></div>
      </div>
    `).join('');
  },

  initHeroSlider() {
    const slides = document.querySelectorAll('.hero-slide');
    const indicators = document.querySelectorAll('.indicator-item');
    const heroTitle = document.getElementById('hero-title');
    const heroTag = document.getElementById('hero-tag');
    const heroSubtitle = document.getElementById('hero-subtitle');
    const heroCta = document.getElementById('hero-cta');

    if (!slides.length) return;

    const showSlide = (index) => {
      this.currentSlide = index;
      const slideData = NY_DATA.heroSlides[index];

      slides.forEach((s, i) => s.classList.toggle('active', i === index));
      indicators.forEach((ind, i) => ind.classList.toggle('active', i === index));

      if (heroTitle && heroTag && heroSubtitle && heroCta) {
        heroTag.textContent = slideData.tag;
        heroTitle.textContent = slideData.title;
        heroSubtitle.textContent = slideData.subtitle;
        heroCta.textContent = `${slideData.ctaText} ↗`;
        heroCta.setAttribute('href', slideData.ctaLink);
      }
    };

    indicators.forEach((ind, i) => {
      ind.addEventListener('click', () => {
        showSlide(i);
        this.resetSliderTimer();
      });
    });

    this.startSliderTimer = () => {
      this.sliderInterval = setInterval(() => {
        const next = (this.currentSlide + 1) % NY_DATA.heroSlides.length;
        showSlide(next);
      }, 7000);
    };

    this.resetSliderTimer = () => {
      clearInterval(this.sliderInterval);
      this.startSliderTimer();
    };

    this.startSliderTimer();
  },

  /* ------------------------------------------------------------------------
     2. SCROLL HEADER BEHAVIOR
     ------------------------------------------------------------------------ */
  initScrollHeader() {
    const header = document.getElementById('site-header');
    if (!header) return;

    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  },

  /* ------------------------------------------------------------------------
     3. ANIMATED IMPACT COUNTERS
     ------------------------------------------------------------------------ */
  initCounters() {
    const statsContainer = document.getElementById('impact-stats-container');
    if (!statsContainer) return;

    statsContainer.innerHTML = NY_DATA.impactStats.map(stat => `
      <div class="stat-card">
        <div class="stat-number">
          <span class="stat-prefix">${stat.prefix}</span><span class="counter-val" data-target="${stat.value}">${stat.value}</span><span class="stat-suffix">${stat.suffix}</span>
        </div>
        <div class="stat-label">${stat.label}</div>
      </div>
    `).join('');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateNumbers();
          observer.disconnect();
        }
      });
    }, { threshold: 0.2 });

    observer.observe(statsContainer);
  },

  animateNumbers() {
    const counters = document.querySelectorAll('.counter-val');
    counters.forEach(counter => {
      const target = parseFloat(counter.getAttribute('data-target'));
      const isDecimal = target % 1 !== 0;
      const duration = 1800;
      const startTime = performance.now();

      const updateCount = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // easeOutQuad
        const ease = 1 - (1 - progress) * (1 - progress);
        const currentVal = ease * target;

        counter.textContent = isDecimal ? currentVal.toFixed(1) : Math.floor(currentVal);

        if (progress < 1) {
          requestAnimationFrame(updateCount);
        } else {
          counter.textContent = isDecimal ? target.toFixed(1) : target;
        }
      };

      requestAnimationFrame(updateCount);
    });
  },

  /* ------------------------------------------------------------------------
     4. HOME PAGE SPOTLIGHTS & 3 NEW SECTIONS
     ------------------------------------------------------------------------ */
  renderFeaturedHome() {
    // Featured Property Spotlight
    const featProp = NY_DATA.properties.find(p => p.featured) || NY_DATA.properties[0];
    const featContainer = document.getElementById('home-featured-property-slot');
    if (featContainer && featProp) {
      featContainer.innerHTML = `
        <div class="featured-prop-info">
          <div>
            <div class="eyebrow" style="margin-bottom: 0.5rem;">FEATURED PROPERTY</div>
            <h3 class="featured-prop-name">${featProp.name}</h3>
            <p class="featured-prop-desc">${featProp.description}</p>
          </div>
          <div>
            <button class="btn-link" onclick="ModalManager.openPropertyModal('${featProp.id}')">
              VIEW PROPERTY <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 17L17 7M17 7H7M17 7V17"/></svg>
            </button>
          </div>
        </div>
        <div class="featured-prop-media" onclick="ModalManager.openPropertyModal('${featProp.id}')" style="cursor: pointer;">
          <img src="${featProp.image}" alt="${featProp.name}" />
          <div class="featured-prop-location">${featProp.city}</div>
        </div>
      `;
    }

    // Home Insights Mini List
    const insightsContainer = document.getElementById('home-insights-slot');
    if (insightsContainer) {
      insightsContainer.innerHTML = NY_DATA.insights.slice(0, 3).map(insight => `
        <div class="insight-mini-item" onclick="ModalManager.openInsightModal('${insight.id}')">
          <div class="insight-mini-thumb">
            <img src="${insight.image}" alt="${insight.title}" />
          </div>
          <div class="insight-mini-content">
            <div class="insight-mini-date">${insight.date}</div>
            <div class="insight-mini-title">${insight.title}</div>
          </div>
        </div>
      `).join('');
    }
  },

  renderHomeNewSections() {
    // Render Deal Flow Pipeline
    const pipelineSlot = document.getElementById('home-deal-pipeline-slot');
    if (pipelineSlot) {
      pipelineSlot.innerHTML = NY_DATA.dealPipeline.map(item => `
        <div class="pipeline-card">
          <div class="pipeline-status-badge">${item.status}</div>
          <h3 class="pipeline-title">${item.title}</h3>
          <div class="pipeline-location">📍 ${item.location} • ${item.assetType}</div>
          <p class="pipeline-thesis">${item.thesis}</p>
          
          <div class="pipeline-footer">
            <div class="pipeline-metric-row">
              <span>Target Capital Size</span>
              <strong>${item.targetSize}</strong>
            </div>
            <div class="pipeline-progress-bar">
              <div class="pipeline-progress-fill" style="width: ${item.progress}%;"></div>
            </div>
            <div class="pipeline-pct">${item.progress}% Formed</div>
          </div>
        </div>
      `).join('');
    }

    // Render Testimonials with Partner Portraits
    const testSlot = document.getElementById('home-testimonials-slot');
    if (testSlot) {
      testSlot.innerHTML = NY_DATA.testimonials.map(t => `
        <div class="testimonial-card">
          <div class="testimonial-quote">${t.quote}</div>
          <div class="testimonial-footer">
            <img src="${t.image}" alt="${t.author}" class="testimonial-avatar" referrerpolicy="no-referrer" loading="lazy" />
            <div class="testimonial-author">
              <div class="testimonial-author-name">${t.author}</div>
              <div class="testimonial-author-role">${t.role}</div>
            </div>
          </div>
        </div>
      `).join('');
    }
  },

  /* ------------------------------------------------------------------------
     5. PROPERTIES PAGE CATALOG & FILTERS
     ------------------------------------------------------------------------ */
  renderPropertiesPage() {
    const grid = document.getElementById('properties-catalog-grid');
    if (!grid) return;

    let activeFilter = 'all';
    let searchQuery = '';

    const render = () => {
      const filtered = NY_DATA.properties.filter(item => {
        const matchesCategory = activeFilter === 'all' || item.type.toLowerCase() === activeFilter.toLowerCase() || item.category.toLowerCase() === activeFilter.toLowerCase();
        const matchesSearch = item.name.toLowerCase().includes(searchQuery) || item.location.toLowerCase().includes(searchQuery);
        return matchesCategory && matchesSearch;
      });

      if (filtered.length === 0) {
        grid.innerHTML = `
          <div style="grid-column: 1 / -1; text-align: center; padding: 4rem; background: var(--bg-surface); border: 1px dashed var(--border-subtle); border-radius: var(--radius-md);">
            <h3 style="margin-bottom: 0.5rem;">No properties matched your criteria</h3>
            <p>Try clearing filters or adjusting your search keywords.</p>
          </div>
        `;
        return;
      }

      grid.innerHTML = filtered.map(prop => `
        <div class="property-card" onclick="ModalManager.openPropertyModal('${prop.id}')">
          <div class="prop-card-media">
            <img src="${prop.image}" alt="${prop.name}" />
            <div class="prop-card-badges">
              <span class="badge badge-gold">${prop.status}</span>
              <span class="badge badge-outline">${prop.type}</span>
            </div>
          </div>
          <div class="prop-card-body">
            <div class="prop-card-location">📍 ${prop.location}</div>
            <h3 class="prop-card-title">${prop.name}</h3>
            <p class="prop-card-desc">${prop.description}</p>
            
            <div class="prop-card-metrics">
              <div class="prop-metric-item">
                <span class="prop-metric-label">Target IRR</span>
                <span class="prop-metric-val text-gold">${prop.targetIRR}</span>
              </div>
              <div class="prop-metric-item">
                <span class="prop-metric-label">Multiple</span>
                <span class="prop-metric-val">${prop.equityMultiple}</span>
              </div>
              <div class="prop-metric-item">
                <span class="prop-metric-label">Size</span>
                <span class="prop-metric-val">${prop.sqft.split(' ')[0]}</span>
              </div>
            </div>

            <div class="prop-card-footer">
              <span style="font-family: var(--font-mono); font-size: 0.85rem; color: #fff;">Valuation: <strong>${prop.price}</strong></span>
              <button class="btn-link">View Details ↗</button>
            </div>
          </div>
        </div>
      `).join('');
    };

    // Filter pill buttons
    document.querySelectorAll('.prop-filter-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.prop-filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeFilter = btn.getAttribute('data-filter');
        render();
      });
    });

    // Search box
    const searchInput = document.getElementById('properties-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.trim().toLowerCase();
        render();
      });
    }

    render();
  },

  /* ------------------------------------------------------------------------
     6. MARKETS PAGE
     ------------------------------------------------------------------------ */
  renderMarketsPage() {
    const grid = document.getElementById('markets-cards-grid');
    const tableBody = document.getElementById('markets-table-body');
    if (!grid) return;

    grid.innerHTML = NY_DATA.markets.map(m => `
      <div class="market-card" onclick="window.location.hash='#properties'">
        <img src="${m.image}" alt="${m.name}" />
        <div class="market-card-overlay">
          <div class="market-region-tag">${m.region}</div>
          <h3 class="market-city-name">${m.name}</h3>
          <p class="market-card-desc">${m.desc}</p>
          <div class="market-quick-stats">
            <span>Cap: <strong class="text-gold">${m.capRate}</strong></span>
            <span>Growth: <strong class="text-white">${m.growth}</strong></span>
          </div>
        </div>
      </div>
    `).join('');

    if (tableBody) {
      tableBody.innerHTML = NY_DATA.markets.map(m => `
        <tr>
          <td><strong>${m.name}</strong><br/><span style="font-size: 0.78rem; color: var(--text-muted);">${m.region}</span></td>
          <td class="mono" style="color: var(--gold-light);">${m.capRate}</td>
          <td class="mono">${m.avgRent}</td>
          <td class="mono" style="color: #10b981;">${m.growth}</td>
          <td style="color: #fff;">${m.portfolioAssets}</td>
        </tr>
      `).join('');
    }
  },

  /* ------------------------------------------------------------------------
     7. PORTFOLIO PAGE: EXITS LEDGER
     ------------------------------------------------------------------------ */
  renderPortfolioExits() {
    const tableBody = document.getElementById('portfolio-exits-table-body');
    if (!tableBody) return;

    tableBody.innerHTML = NY_DATA.historicalExits.map(exit => `
      <tr>
        <td>
          <strong style="color: #fff;">${exit.name}</strong><br/>
          <span style="font-size: 0.78rem; color: var(--text-muted);">📍 ${exit.location} • ${exit.type}</span>
        </td>
        <td class="mono">${exit.acquired} – ${exit.exited}</td>
        <td class="mono">${exit.equityInvested}</td>
        <td class="mono" style="color: #fff;">${exit.realizedProceeds}</td>
        <td class="mono" style="color: var(--gold-light); font-weight: 600;">${exit.moic}</td>
        <td class="mono" style="color: #10b981; font-weight: 600;">${exit.netIRR}</td>
      </tr>
    `).join('');
  },

  /* ------------------------------------------------------------------------
     8. INSIGHTS PAGE
     ------------------------------------------------------------------------ */
  renderInsightsPage() {
    const grid = document.getElementById('insights-full-grid');
    if (!grid) return;

    grid.innerHTML = NY_DATA.insights.map(i => `
      <div class="insight-card" onclick="ModalManager.openInsightModal('${i.id}')">
        <div class="insight-card-media">
          <img src="${i.image}" alt="${i.title}" />
        </div>
        <div class="insight-card-body">
          <div class="insight-card-meta">
            <span>${i.category}</span> • <span>${i.readTime}</span>
          </div>
          <h3 class="insight-card-title">${i.title}</h3>
          <p class="insight-card-excerpt">${i.excerpt}</p>
          <div class="insight-card-author">
            <span>By ${i.author.split(',')[0]}</span>
            <span style="color: var(--gold-light); font-family: var(--font-mono); font-size: 0.75rem;">${i.date}</span>
          </div>
        </div>
      </div>
    `).join('');
  },

  /* ------------------------------------------------------------------------
     9. ABOUT US & LEADERSHIP
     ------------------------------------------------------------------------ */
  renderAboutPage() {
    const grid = document.getElementById('leadership-grid');
    if (!grid) return;

    grid.innerHTML = NY_DATA.leadership.map(leader => `
      <div class="leader-card">
        <div class="leader-photo-wrap">
          <img src="${leader.image}" alt="${leader.name}" />
        </div>
        <div class="leader-info">
          <h3 class="leader-name">${leader.name}</h3>
          <div class="leader-role">${leader.role}</div>
          <p class="leader-bio">${leader.bio}</p>
        </div>
      </div>
    `).join('');
  },

  /* ------------------------------------------------------------------------
     10. CONTACT, SCHEDULER & BROKER SUBMISSION
     ------------------------------------------------------------------------ */
  initContactForm() {
    const form = document.getElementById('investor-intake-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('intake-name').value;

      form.reset();
      ModalManager.showToast('Inquiry Submitted Successfully', `Thank you ${name}. Our Capital Markets & Investor Relations partner will reach out within 1 business day.`);
    });

    // Newsletter forms
    document.querySelectorAll('.newsletter-form').forEach(f => {
      f.addEventListener('submit', (e) => {
        e.preventDefault();
        f.reset();
        ModalManager.showToast('Subscribed to NY Realty Briefings', 'You have been subscribed to our private institutional quarterly dispatch.');
      });
    });
  },

  initSchedulerWidget() {
    let selectedSlot = '10:00 AM EST (Tomorrow)';
    document.querySelectorAll('.slot-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.slot-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectedSlot = btn.textContent;
      });
    });

    const scheduleBtn = document.getElementById('btn-confirm-briefing');
    if (scheduleBtn) {
      scheduleBtn.addEventListener('click', () => {
        const email = document.getElementById('briefing-email')?.value;
        if (!email) {
          ModalManager.showToast('Email Required', 'Please enter your corporate email to confirm your private meeting.');
          return;
        }
        ModalManager.showToast('Private Briefing Confirmed', `Your virtual session for ${selectedSlot} is reserved. Calendar invite dispatched to ${email}.`);
      });
    }
  },

  initBrokerSubmission() {
    const brokerForm = document.getElementById('broker-submission-form');
    if (!brokerForm) return;

    brokerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      brokerForm.reset();
      ModalManager.showToast('Off-Market Deal Submitted', 'Acquisitions team will review within our standard 14-day turnaround window.');
    });
  },

  /* ------------------------------------------------------------------------
     11. INTERACTIVE CONTACT MAP
     ------------------------------------------------------------------------ */
  initContactMap() {
    const tabs = document.querySelectorAll('.map-tab-btn');
    const iframe = document.getElementById('office-map-iframe');
    const caption = document.getElementById('map-address-caption');
    if (!tabs.length || !iframe) return;

    const locations = {
      nyc: {
        caption: 'General Motors Building, 767 Fifth Avenue, 45th Floor, New York, NY 10153',
        url: 'https://maps.google.com/maps?q=767%20Fifth%20Avenue%20New%20York%20NY%2010153&t=&z=15&ie=UTF8&iwloc=&output=embed'
      },
      miami: {
        caption: 'Brickell Financial Center, 1101 Brickell Avenue, Suite 1800, Miami, FL 33131',
        url: 'https://maps.google.com/maps?q=1101%20Brickell%20Avenue%20Miami%20FL%2033131&t=&z=15&ie=UTF8&iwloc=&output=embed'
      },
      london: {
        caption: 'Mayfair Advisory Hub, 25 Berkeley Square, Mayfair, London W1J 6HN, United Kingdom',
        url: 'https://maps.google.com/maps?q=25%20Berkeley%20Square%20London%20W1J%206HN&t=&z=15&ie=UTF8&iwloc=&output=embed'
      }
    };

    tabs.forEach(btn => {
      btn.addEventListener('click', () => {
        tabs.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const city = btn.getAttribute('data-city');
        if (locations[city]) {
          iframe.src = locations[city].url;
          if (caption) caption.textContent = locations[city].caption;
        }
      });
    });
  },

  /* ------------------------------------------------------------------------
     12. MOBILE NAVIGATION DRAWER & ACCESSIBILITY
     ------------------------------------------------------------------------ */
  initMobileNav() {
    const btn = document.getElementById('mobile-menu-toggle');
    const nav = document.getElementById('main-nav');
    if (!btn || !nav) return;

    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = nav.classList.toggle('mobile-open');
      btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Close on navigation link click
    nav.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('mobile-open');
        btn.setAttribute('aria-expanded', 'false');
      });
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
      if (nav.classList.contains('mobile-open') && !nav.contains(e.target) && !btn.contains(e.target)) {
        nav.classList.remove('mobile-open');
        btn.setAttribute('aria-expanded', 'false');
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && nav.classList.contains('mobile-open')) {
        nav.classList.remove('mobile-open');
        btn.setAttribute('aria-expanded', 'false');
      }
    });
  },

  /* ------------------------------------------------------------------------
     13. FLOATING SCROLL-TO-TOP / BOTTOM NAVIGATION CONTROLLER
     ------------------------------------------------------------------------ */
  initScrollToTop() {
    const scrollBtn = document.getElementById('floating-scroll-btn');
    if (!scrollBtn) return;

    window.addEventListener('scroll', () => {
      if (window.scrollY > 250) {
        scrollBtn.classList.add('visible');
      } else {
        scrollBtn.classList.remove('visible');
      }
    });

    scrollBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
};
