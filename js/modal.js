/* ==========================================================================
   NY REALTY INVESTMENT GROUP - MODAL SYSTEM & OVERLAYS
   ========================================================================== */

const ModalManager = {
  activeModal: null,

  open(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    this.activeModal = modal;
  },

  close() {
    if (!this.activeModal) return;
    this.activeModal.classList.remove('active');
    document.body.style.overflow = '';
    this.activeModal = null;
  },

  showToast(title, message, type = 'gold') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <div style="color: var(--gold-light); font-size: 1.2rem; margin-top: -2px;">✦</div>
      <div style="flex: 1;">
        <div style="font-family: var(--font-sans); font-size: 0.85rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: #fff; margin-bottom: 0.2rem;">${title}</div>
        <div style="font-size: 0.82rem; color: #cbd5e1; line-height: 1.4;">${message}</div>
      </div>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(40px)';
      toast.style.transition = 'all 0.35s ease';
      setTimeout(() => toast.remove(), 350);
    }, 4500);
  },

  openPropertyModal(propertyId) {
    const prop = NY_DATA.properties.find(p => p.id === propertyId);
    if (!prop) return;

    const modalBody = document.getElementById('property-modal-body');
    if (!modalBody) return;

    modalBody.innerHTML = `
      <div style="position: relative; width: 100%; aspect-ratio: 16 / 9; max-height: 320px; border-radius: var(--radius-md); overflow: hidden; margin-bottom: 2rem;">
        <img src="${prop.image}" alt="${prop.name}" style="width: 100%; height: 100%; object-fit: cover; object-position: center;" />
        <div style="position: absolute; top: 1rem; left: 1rem; display: flex; gap: 0.5rem; z-index: 2;">
          <span class="badge badge-gold">${prop.status}</span>
          <span class="badge badge-outline">${prop.type}</span>
        </div>
        <div style="position: absolute; bottom: 1rem; left: 1rem; background: rgba(7,9,12,0.85); backdrop-filter: blur(8px); padding: 0.4rem 1rem; border-radius: var(--radius-sm); border: 1px solid var(--border-subtle); color: var(--gold-light); font-family: var(--font-sans); font-size: 0.78rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.14em; z-index: 2;">
          📍 ${prop.location}
        </div>
      </div>

      <div style="margin-bottom: 2rem;">
        <h2 style="font-size: clamp(1.6rem, 2.5vw, 2.2rem); margin-bottom: 0.5rem; color: #fff;">${prop.name}</h2>
        <p style="font-size: 1.02rem; color: #cbd5e1; line-height: 1.7;">${prop.description}</p>
      </div>

      <!-- Financial Metrics Grid -->
      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; background: #070a0e; border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 1.5rem; margin-bottom: 2.5rem;">
        <div>
          <div style="font-family: var(--font-sans); font-size: 0.7rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 0.3rem;">Target Net IRR</div>
          <div style="font-family: var(--font-serif); font-size: 1.6rem; font-weight: 700; color: var(--gold-light);">${prop.targetIRR}</div>
        </div>
        <div>
          <div style="font-family: var(--font-sans); font-size: 0.7rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 0.3rem;">Target Equity Multiple</div>
          <div style="font-family: var(--font-serif); font-size: 1.6rem; font-weight: 700; color: #fff;">${prop.equityMultiple}</div>
        </div>
        <div>
          <div style="font-family: var(--font-sans); font-size: 0.7rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 0.3rem;">Asset Size</div>
          <div style="font-family: var(--font-mono); font-size: 1.1rem; font-weight: 600; color: #fff; margin-top: 0.3rem;">${prop.sqft}</div>
        </div>
        <div>
          <div style="font-family: var(--font-sans); font-size: 0.7rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 0.3rem;">Occupancy</div>
          <div style="font-family: var(--font-mono); font-size: 1.1rem; font-weight: 600; color: #fff; margin-top: 0.3rem;">${prop.occupancy}</div>
        </div>
      </div>

      <!-- Highlights & Tenancy -->
      <div style="display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 2rem; margin-bottom: 2.5rem;">
        <div>
          <h4 style="font-family: var(--font-sans); font-size: 0.85rem; letter-spacing: 0.16em; text-transform: uppercase; color: var(--gold-light); margin-bottom: 1rem;">Investment Highlights</h4>
          <ul style="list-style: none; display: flex; flex-direction: column; gap: 0.75rem;">
            ${prop.highlights.map(h => `<li style="font-size: 0.92rem; color: #cbd5e1; display: flex; gap: 0.6rem;"><span style="color: var(--gold-primary);">▪</span> <span>${h}</span></li>`).join('')}
          </ul>
        </div>
        <div style="background: rgba(255,255,255,0.02); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 1.5rem;">
          <h4 style="font-family: var(--font-sans); font-size: 0.85rem; letter-spacing: 0.16em; text-transform: uppercase; color: var(--gold-light); margin-bottom: 1rem;">Key Tenants / Structure</h4>
          <ul style="list-style: none; display: flex; flex-direction: column; gap: 0.6rem;">
            ${prop.tenantRoster.map(t => `<li style="font-family: var(--font-mono); font-size: 0.82rem; color: #fff; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 0.4rem;">${t}</li>`).join('')}
          </ul>
          <div style="margin-top: 1.5rem; font-size: 0.8rem; color: var(--text-muted);">
            Valuation: <strong style="color: #fff;">${prop.price}</strong> | Cap: <strong style="color: #fff;">${prop.financials.inPlaceCapRate}</strong>
          </div>
        </div>
      </div>

      <div class="modal-footer-actions">
        <button class="btn btn-outline" onclick="ModalManager.close()">Close</button>
        <button class="btn btn-primary" onclick="ModalManager.requestOM('${prop.name}')">Request Offering Memorandum (OM) ↗</button>
      </div>
    `;

    this.open('property-modal');
  },

  openInsightModal(insightId) {
    const article = NY_DATA.insights.find(i => i.id === insightId);
    if (!article) return;

    const modalBody = document.getElementById('insight-modal-body');
    if (!modalBody) return;

    modalBody.innerHTML = `
      <div style="position: relative; width: 100%; aspect-ratio: 16 / 9; max-height: 280px; border-radius: var(--radius-md); overflow: hidden; margin-bottom: 2rem;">
        <img src="${article.image}" alt="${article.title}" style="width: 100%; height: 100%; object-fit: cover; object-position: center;" />
        <div style="position: absolute; inset: 0; background: linear-gradient(0deg, #0e131b 0%, rgba(14,19,27,0.3) 100%);"></div>
        <div style="position: absolute; bottom: 1.5rem; left: 1.5rem;">
          <span class="badge badge-gold" style="margin-bottom: 0.5rem;">${article.category}</span>
          <div style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-muted);">${article.date} • ${article.readTime}</div>
        </div>
      </div>

      <h1 style="font-size: 2rem; color: #fff; margin-bottom: 1rem; line-height: 1.25;">${article.title}</h1>
      <div style="font-size: 0.85rem; color: var(--gold-light); font-family: var(--font-sans); margin-bottom: 2rem; padding-bottom: 1rem; border-bottom: 1px solid var(--border-subtle);">
        Author: <strong>${article.author}</strong> | NY Realty Global Research Division
      </div>

      <div style="font-size: 1.05rem; color: #cbd5e1; line-height: 1.8; margin-bottom: 2.5rem;">
        ${article.content}
      </div>

      <div class="modal-footer-actions">
        <button class="btn btn-outline" onclick="ModalManager.close()">Close Article</button>
        <button class="btn btn-primary" onclick="ModalManager.downloadResearchPDF('${article.title}')">Download Full PDF Report (14 Pages) ↗</button>
      </div>
    `;

    this.open('insight-modal');
  },

  requestOM(propertyName) {
    this.close();
    this.showToast('Offering Memorandum Requested', `Confidential OM package for "${propertyName}" sent to your registered investor profile.`);
  },

  downloadResearchPDF(title) {
    this.showToast('Research PDF Generated', `Institutional Whitepaper "${title.substring(0, 30)}..." download initialized.`);
  },

  init() {
    // Backdrop click close
    document.querySelectorAll('.modal-backdrop').forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) this.close();
      });
    });

    // Close buttons
    document.querySelectorAll('.modal-close-btn').forEach(btn => {
      btn.addEventListener('click', () => this.close());
    });

    // ESC key close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.close();
    });

    // Investor Login Triggers
    const loginTriggers = document.querySelectorAll('.btn-investor-login, .btn-drawer-login, [href="#login"], .btn-investor-login-trigger');
    loginTriggers.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const mainNav = document.getElementById('main-nav');
        const menuBtn = document.getElementById('mobile-menu-toggle');
        if (mainNav) mainNav.classList.remove('mobile-open');
        if (menuBtn) menuBtn.setAttribute('aria-expanded', 'false');
        this.open('investor-login-modal');
      });
    });

    // Investor Login Form Submit handler
    const loginForm = document.getElementById('investor-login-form');
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('lp-email').value;
        const pass = document.getElementById('lp-pass').value;

        if (email && pass) {
          document.getElementById('login-form-view').style.display = 'none';
          document.getElementById('investor-dashboard-view').style.display = 'block';
          this.showToast('Investor Portal Authenticated', `Welcome back, accredited partner. Portfolio statements synchronized.`);
        }
      });
    }
  }
};
