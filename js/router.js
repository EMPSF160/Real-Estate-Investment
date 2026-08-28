/* ==========================================================================
   NY REALTY INVESTMENT GROUP - CLIENT-SIDE ROUTER (SPA)
   ========================================================================== */

const Router = {
  routes: {
    'home': { title: 'Home | NY Realty Investment Group', viewId: 'page-home' },
    'properties': { title: 'Trophy Properties & Assets | NY Realty', viewId: 'page-properties' },
    'strategy': { title: 'Investment Strategy & Yield Simulator | NY Realty', viewId: 'page-strategy' },
    'markets': { title: 'Core Metropolitan Markets | NY Realty', viewId: 'page-markets' },
    'portfolio': { title: 'Portfolio Track Record & Performance | NY Realty', viewId: 'page-portfolio' },
    'insights': { title: 'Market Insights & Research | NY Realty', viewId: 'page-insights' },
    'about': { title: 'About Us & Leadership Committee | NY Realty', viewId: 'page-about' },
    'contact': { title: 'Investor Relations & Contact | NY Realty', viewId: 'page-contact' }
  },

  defaultRoute: 'home',

  getCurrentRoute() {
    const hash = window.location.hash.replace(/^#\/?/, '').trim().toLowerCase();
    return this.routes[hash] ? hash : this.defaultRoute;
  },

  navigate(routeName) {
    const route = this.routes[routeName] || this.routes[this.defaultRoute];
    const targetRouteName = this.routes[routeName] ? routeName : this.defaultRoute;

    // Update document title
    document.title = route.title;

    // Switch active view
    document.querySelectorAll('.page-view').forEach(view => {
      view.classList.remove('active');
    });

    const activeView = document.getElementById(route.viewId);
    if (activeView) {
      activeView.classList.add('active');
    }

    // Update active nav links
    document.querySelectorAll('.nav-link').forEach(link => {
      const linkTarget = link.getAttribute('href')?.replace(/^#\/?/, '').trim().toLowerCase();
      if (linkTarget === targetRouteName) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // Close mobile nav if open
    const mainNav = document.getElementById('main-nav');
    if (mainNav) mainNav.classList.remove('mobile-open');

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  init() {
    window.addEventListener('hashchange', () => {
      this.navigate(this.getCurrentRoute());
    });

    // Intercept in-app routing clicks
    document.addEventListener('click', (e) => {
      const anchor = e.target.closest('a[href^="#"]');
      if (anchor) {
        const hash = anchor.getAttribute('href').replace(/^#\/?/, '').trim().toLowerCase();
        if (this.routes[hash]) {
          // Valid route
          e.preventDefault();
          window.location.hash = `#${hash}`;
        }
      }
    });

    // Initial load
    this.navigate(this.getCurrentRoute());
  }
};
