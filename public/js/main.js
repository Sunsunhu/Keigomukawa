(function () {
  'use strict';

  const header = document.querySelector('.site-header');
  const hero = document.querySelector('.hero, .page-hero');

  function updateHeader() {
    if (!header) return;
    const scrolled = window.scrollY > 60;
    header.classList.toggle('scrolled', scrolled);
    if (hero && !header.classList.contains('force-light')) {
      const heroBottom = hero.offsetTop + hero.offsetHeight;
      header.classList.toggle('on-dark', window.scrollY < heroBottom - 100 && hero.classList.contains('hero'));
    }
  }

  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();

  // Home: fixed cover fades as content scrolls over
  const immersiveHero = document.querySelector('.hero--immersive');
  if (immersiveHero && document.body.classList.contains('home-page')) {
    const heroBg = immersiveHero.querySelector('.hero-bg');
    const heroOverlay = immersiveHero.querySelector('.hero-overlay');

    function updateImmersiveHero() {
      const vh = window.innerHeight;
      const y = window.scrollY;
      const progress = Math.min(y / vh, 1);
      const fade = 1 - progress * 0.4;

      if (heroBg) heroBg.style.opacity = String(fade);
      if (heroOverlay) heroOverlay.style.opacity = String(fade);

      const hideAfter = document.documentElement.scrollHeight - vh * 1.75;
      immersiveHero.classList.toggle('hero--past', y > hideAfter);
    }

    window.addEventListener('scroll', updateImmersiveHero, { passive: true });
    window.addEventListener('resize', updateImmersiveHero, { passive: true });
    updateImmersiveHero();
  }

  // Mobile menu — build from desktop nav if missing
  function initMobileNav() {
    const toggle = document.querySelector('.menu-toggle');
    const desktopNav = document.querySelector('.nav-desktop');
    if (!toggle) return;

    let mobileNav = document.querySelector('.nav-mobile');

    if (!mobileNav && desktopNav) {
      mobileNav = document.createElement('nav');
      mobileNav.className = 'nav-mobile';
      mobileNav.setAttribute('aria-label', 'Menu principal');

      desktopNav.querySelectorAll(':scope > a').forEach((link) => {
        mobileNav.appendChild(link.cloneNode(true));
      });

      const langSwitch = desktopNav.querySelector('.lang-switch');
      if (langSwitch) {
        langSwitch.querySelectorAll('a').forEach((link) => {
          mobileNav.appendChild(link.cloneNode(true));
        });
      }

      if (header) {
        header.insertAdjacentElement('afterend', mobileNav);
      } else {
        document.body.prepend(mobileNav);
      }
    }

    if (!mobileNav) return;

    let panel = mobileNav.querySelector('.nav-mobile-panel');
    if (!panel) {
      panel = document.createElement('div');
      panel.className = 'nav-mobile-panel';
      while (mobileNav.firstChild) {
        panel.appendChild(mobileNav.firstChild);
      }
      mobileNav.appendChild(panel);
    }

    let backdrop = mobileNav.querySelector('.nav-mobile-backdrop');
    if (!backdrop) {
      backdrop = document.createElement('button');
      backdrop.type = 'button';
      backdrop.className = 'nav-mobile-backdrop';
      const lang = document.documentElement.lang || '';
      backdrop.setAttribute(
        'aria-label',
        lang.startsWith('fr') ? 'Fermer le menu' : 'Close menu'
      );
      mobileNav.insertBefore(backdrop, mobileNav.firstChild);
    }

    const desktopLang = desktopNav?.querySelector('.lang-switch');
    if (desktopLang && panel) {
      panel.querySelectorAll('.lang-switch').forEach((el) => el.remove());
      panel.querySelectorAll('a').forEach((a) => {
        const label = a.textContent.trim();
        if (label === 'English' || label === 'Français') {
          a.remove();
        }
      });
      const mobileLang = desktopLang.cloneNode(true);
      mobileLang.classList.add('lang-switch--mobile');
      panel.appendChild(mobileLang);
    }

    function closeMobileMenu() {
      mobileNav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      document.body.classList.remove('menu-open');
    }

    function openMobileMenu() {
      mobileNav.classList.add('open');
      toggle.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
      document.body.classList.add('menu-open');
    }

    if (!mobileNav.dataset.bound) {
      mobileNav.dataset.bound = 'true';
      toggle.setAttribute('aria-expanded', 'false');

      toggle.addEventListener('click', (e) => {
        e.stopPropagation();
        if (mobileNav.classList.contains('open')) {
          closeMobileMenu();
        } else {
          openMobileMenu();
        }
      });

      const closeOnBackdrop = (e) => {
        if (!mobileNav.classList.contains('open')) return;
        e.preventDefault();
        closeMobileMenu();
      };

      backdrop.addEventListener('click', closeOnBackdrop);

      panel.querySelectorAll('a').forEach((a) => {
        a.addEventListener('click', () => closeMobileMenu());
      });

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileNav.classList.contains('open')) {
          closeMobileMenu();
        }
      });
    }
  }

  initMobileNav();

  initScrollReveal();
  initPageHeroParallax();
  initConcerts();

  document.querySelectorAll('.parallax-strip img').forEach((img) => {
    const wrap = img.closest('.parallax-strip');
    if (!wrap) return;
    window.addEventListener(
      'scroll',
      () => {
        const rect = wrap.getBoundingClientRect();
        const vh = window.innerHeight;
        if (rect.bottom < 0 || rect.top > vh) return;
        const progress = (vh - rect.top) / (vh + rect.height);
        img.style.transform = `translateY(${-15 + progress * 30}%)`;
      },
      { passive: true }
    );
  });

  initQuotesCarousels();

  document.querySelectorAll('.concert-tabs').forEach((tabBar) => {
    const buttons = tabBar.querySelectorAll('button');
    const panelRoot = tabBar.parentElement;
    const lists = panelRoot.querySelectorAll('.concert-list');
    buttons.forEach((btn, i) => {
      btn.addEventListener('click', () => {
        buttons.forEach((b) => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
        lists.forEach((list, j) => {
          const show = j === i;
          list.hidden = !show;
          if (show) {
            list.classList.add('is-active');
            list.querySelectorAll('.concert-item').forEach((item, idx) => {
              item.style.setProperty('--stagger', String(idx));
              item.classList.remove('is-visible');
              requestAnimationFrame(() => item.classList.add('is-visible'));
            });
          }
        });
      });
    });
  });

  function initScrollReveal() {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const reveals = document.querySelectorAll('.reveal');
    if (prefersReduced) {
      reveals.forEach((el) => el.classList.add('visible'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -5% 0px' }
    );
    reveals.forEach((el) => io.observe(el));
  }

  function initQuotesCarousels() {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const scrollBehavior = prefersReduced ? 'auto' : 'smooth';

    document.querySelectorAll('.quotes-carousel').forEach((carousel) => {
      const wrap = carousel.querySelector('.quotes-track-wrap');
      const track = carousel.querySelector('.quotes-track');
      const navRoot = carousel.parentElement;
      const prevBtn =
        carousel.querySelector('.quotes-prev') || navRoot?.querySelector('.quotes-prev');
      const nextBtn =
        carousel.querySelector('.quotes-next') || navRoot?.querySelector('.quotes-next');
      if (!wrap || !track) return;

      const cards = track.querySelectorAll('.quote-card');
      if (!cards.length) return;

      function getScrollTarget(card) {
        return card.offsetLeft - (parseFloat(getComputedStyle(track).paddingLeft) || 0);
      }

      function getMaxScrollLeft() {
        const last = cards[cards.length - 1];
        return Math.max(0, last.offsetLeft + last.offsetWidth - wrap.clientWidth);
      }

      function setSnapEnabled(enabled) {
        if (enabled) {
          wrap.style.scrollSnapType = '';
          cards.forEach((card) => {
            card.style.scrollSnapAlign = '';
          });
        } else {
          wrap.style.scrollSnapType = 'none';
          cards.forEach((card) => {
            card.style.scrollSnapAlign = 'none';
          });
        }
      }

      function getActiveIndex() {
        const wrapRect = wrap.getBoundingClientRect();
        const pad =
          parseFloat(getComputedStyle(wrap).scrollPaddingLeft) ||
          parseFloat(getComputedStyle(track).paddingLeft) ||
          0;
        const anchor = wrapRect.left + pad + 2;
        let closest = 0;
        let minDist = Infinity;
        cards.forEach((card, i) => {
          const dist = Math.abs(card.getBoundingClientRect().left - anchor);
          if (dist < minDist) {
            minDist = dist;
            closest = i;
          }
        });
        return closest;
      }

      function scrollToIndex(nextIndex) {
        const i = Math.max(0, Math.min(cards.length - 1, nextIndex));
        const left = Math.min(getScrollTarget(cards[i]), getMaxScrollLeft());

        setSnapEnabled(false);
        wrap.scrollTo({ left, behavior: scrollBehavior });

        let done = false;
        const finish = () => {
          if (done) return;
          done = true;
          const max = getMaxScrollLeft();
          if (wrap.scrollLeft > max + 1) {
            wrap.scrollLeft = max;
          }
          setSnapEnabled(true);
          updateButtons();
        };

        setTimeout(finish, scrollBehavior === 'smooth' ? 520 : 80);
      }

      function updateButtons() {
        const index = getActiveIndex();
        if (prevBtn) prevBtn.disabled = index === 0;
        if (nextBtn) nextBtn.disabled = index >= cards.length - 1;
      }

      wrap.addEventListener('scroll', () => updateButtons(), { passive: true });

      if (prevBtn) {
        prevBtn.addEventListener('click', () => scrollToIndex(getActiveIndex() - 1));
      }
      if (nextBtn) {
        nextBtn.addEventListener('click', () => scrollToIndex(getActiveIndex() + 1));
      }

      window.addEventListener('resize', updateButtons);
      updateButtons();
    });
  }

  function initPageHeroParallax() {
    const heroes = document.querySelectorAll('.page-hero:not(.hero--immersive)');
    if (!heroes.length || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    heroes.forEach((hero) => {
      const img = hero.querySelector('.hero-bg img');
      if (!img) return;
      const onScroll = () => {
        const rect = hero.getBoundingClientRect();
        const progress = Math.min(Math.max(-rect.top / (rect.height || 1), 0), 1);
        img.style.transform = `scale(1.08) translateY(${progress * 12}%)`;
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    });
  }

  function initConcerts() {
    const root = document.querySelector('.concert-panels');
    if (!root || !window.CONCERTS_DATA) return;
    const lang = root.dataset.lang || 'fr';
    const data = window.CONCERTS_DATA[lang];
    if (!data) return;
    const soldOutLabel = root.dataset.soldOutLabel || 'Complet';

    function renderItem(c, index) {
      const li = document.createElement('li');
      li.className = 'concert-item';
      li.style.setProperty('--stagger', String(index));
      const dateParts = c.date.split('.');
      const dayNum = c.dayNum || dateParts[0];
      const monthYear = dateParts.length >= 3 ? `${dateParts[1]}.${dateParts[2]}` : c.date;
      li.innerHTML = `
        <div class="concert-date"><strong>${dayNum}</strong>${monthYear}${c.day ? ` <span>${c.day}</span>` : ''}</div>
        <div>
          <p class="concert-venue">${c.venue}</p>
          <p class="concert-title">${c.title}</p>
        </div>
        ${c.soldOut ? `<span class="sold-out">${soldOutLabel}</span>` : ''}`;
      return li;
    }

    function renderList(key, items) {
      const list = root.querySelector(`[data-list="${key}"]`);
      if (!list) return;
      list.innerHTML = '';
      let lastYear = '';
      items.forEach((c, index) => {
        const year = c.date.split('.').pop();
        if (key === 'past' && year && year !== lastYear) {
          const heading = document.createElement('li');
          heading.className = 'concert-year';
          heading.textContent = year;
          list.appendChild(heading);
          lastYear = year;
        }
        list.appendChild(renderItem(c, index));
      });
      requestAnimationFrame(() => {
        list.querySelectorAll('.concert-item').forEach((item) => item.classList.add('is-visible'));
      });
    }

    renderList('upcoming', data.upcoming);
    renderList('past', data.past);
  }

  function initSocialDock() {
    if (document.querySelector('.social-dock')) return;

    const dock = document.createElement('aside');
    dock.className = 'social-dock';
    dock.setAttribute('aria-label', 'Réseaux sociaux');

    const links = [
      {
        href: 'https://www.instagram.com/keigomukawa_piano/',
        label: 'Instagram',
        icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.974.974 1.246 2.241 1.308 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.334 2.633-1.308 3.608-.974.974-2.241 1.246-3.608 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.334-3.608-1.308-.974-.974-1.246-2.241-1.308-3.608C2.175 15.747 2.163 15.367 2.163 12s.012-3.584.07-4.85c.062-1.366.334-2.633 1.308-3.608.974-.974 2.241-1.246 3.608-1.308C8.416 2.175 8.796 2.163 12 2.163zm0-2.163C8.741 0 8.332.013 7.052.072 5.775.131 4.602.425 3.635 1.392 2.668 2.359 2.374 3.532 2.315 4.809 2.256 6.089 2.243 6.498 2.243 12c0 5.502.013 5.911.072 7.191.059 1.277.353 2.45 1.32 3.417.967.967 2.14 1.261 3.417 1.32 1.28.059 1.689.072 7.191.072s5.911-.013 7.191-.072c1.277-.059 2.45-.353 3.417-1.32.967-.967 1.261-2.14 1.32-3.417.059-1.28.072-1.689.072-7.191s-.013-5.911-.072-7.191c-.059-1.277-.353-2.45-1.32-3.417-.967-.967-2.14-1.261-3.417-1.32C17.911.013 17.502 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>',
      },
      {
        href: 'https://x.com/keigoop32',
        label: 'X',
        icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>',
      },
      {
        href: 'https://www.youtube.com/@keigomukawa9425',
        label: 'YouTube',
        icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>',
      },
      {
        href: 'https://www.facebook.com/share/1BBjxk5f7n/?mibextid=wwXIfr',
        label: 'Facebook',
        icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>',
      },
    ];

    links.forEach(({ href, label, icon }) => {
      const a = document.createElement('a');
      a.href = href;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.setAttribute('aria-label', label);
      a.innerHTML = icon;
      dock.appendChild(a);
    });

    document.body.appendChild(dock);
  }

  const FOOTER_NAV = {
    fr: [
      { href: '/fr/', label: 'Accueil' },
      { href: '/fr/biographie.html', label: 'Biographie' },
      { href: '/fr/concerts.html', label: 'Concerts' },
      { href: '/fr/medias.html', label: 'Médias' },
      { href: '/fr/discographie.html', label: 'Discographie' },
      { href: '/fr/repertoires.html', label: 'Répertoires' },
      { href: '/fr/contact.html', label: 'Contact' },
    ],
    en: [
      { href: '/en/', label: 'Home' },
      { href: '/en/biography.html', label: 'Biography' },
      { href: '/en/concerts.html', label: 'Concerts' },
      { href: '/en/media.html', label: 'Press' },
      { href: '/en/discography.html', label: 'Discography' },
      { href: '/en/repertoire.html', label: 'Repertoire' },
      { href: '/en/contact.html', label: 'Contact' },
    ],
  };

  function getSiteLang() {
    const path = window.location.pathname;
    if (path.includes('/en/')) return 'en';
    if (path.includes('/fr/')) return 'fr';
    const htmlLang = (document.documentElement.lang || 'fr').slice(0, 2);
    return htmlLang === 'en' ? 'en' : 'fr';
  }

  function normalizePath(p) {
    if (!p || p === '/') return '/';
    return p.replace(/\/index\.html$/, '/').replace(/\/$/, '') || '/';
  }

  function initFooterNav() {
    const footerInner = document.querySelector('.site-footer .footer-inner');
    if (!footerInner) return;

    const lang = getSiteLang();
    const items = FOOTER_NAV[lang] || FOOTER_NAV.fr;
    const currentPath = normalizePath(window.location.pathname);

    let nav = footerInner.querySelector('.footer-nav');
    if (!nav) {
      nav = document.createElement('nav');
      nav.className = 'footer-nav';
      nav.setAttribute('aria-label', lang === 'en' ? 'Site navigation' : 'Navigation du site');
      const copy = footerInner.querySelector('.footer-copy');
      footerInner.insertBefore(nav, copy || null);
    }

    nav.innerHTML = items
      .map(({ href, label }) => {
        const isCurrent = normalizePath(href) === currentPath;
        const current = isCurrent ? ' aria-current="page"' : '';
        return `<a href="${href}"${current}>${label}</a>`;
      })
      .join('');
  }

  initFooterNav();
  initSocialDock();
})();
