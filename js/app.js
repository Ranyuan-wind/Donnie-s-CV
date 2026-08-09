/* ============================================
   Modern Portfolio — App Logic
   ============================================ */

(function () {
  'use strict';

  const $ = (s, c) => (c || document).querySelector(s);
  const $$ = (s, c) => Array.from((c || document).querySelectorAll(s));

  function escapeHTML(s) {
    const d = document.createElement('div');
    d.textContent = s;
    return d.innerHTML;
  }

  // =============================================
  // DATA LOADING
  // =============================================
  let portfolioData = null;

  async function loadData() {
    try {
      const resp = await fetch('data/portfolio.json');
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      portfolioData = await resp.json();
      return portfolioData;
    } catch (err) {
      console.error('Failed to load portfolio data:', err);
      return null;
    }
  }

  // =============================================
  // RENDER: HERO
  // =============================================
  function renderHero(d) {
    const b = d.basics;
    $('#heroName').textContent = b.name;
    $('#heroTitle').textContent = b.label;
    $('#heroSubtitle').textContent = `大连理工大学 企业管理硕士 · AI 策略产品方向`;
    $('#heroBio').textContent = b.summary;
    if (b.avatar) {
      $('#heroAvatar').innerHTML = `<img src="${escapeHTML(b.avatar)}" alt="${escapeHTML(b.name)}">`;
    }
  }

  // =============================================
  // RENDER: HIGHLIGHTS
  // =============================================
  const ICON_MAP = {
    school: '🎓',
    ai: '🤖',
    data: '📊',
    global: '🌍',
  };

  function renderHighlights(d) {
    if (!d.highlights) return;
    const grid = $('#highlightsGrid');
    grid.innerHTML = d.highlights.map(h => `
      <div class="highlight-card">
        <div class="highlight-icon">${ICON_MAP[h.icon] || '✨'}</div>
        <h3>${escapeHTML(h.title)}</h3>
        <div class="hl-subtitle">${escapeHTML(h.subtitle)}</div>
        <p>${escapeHTML(h.description)}</p>
      </div>
    `).join('');
  }

  // =============================================
  // RENDER: PORTFOLIO GRID
  // =============================================
  function renderPortfolio(d) {
    if (!d.portfolio) return;
    const grid = $('#projectGrid');
    grid.innerHTML = d.portfolio.map((item, i) => `
      <article class="project-card" data-id="${item.id}" data-categories='${JSON.stringify(item.category)}'>
        <div class="card-banner" style="background:${item.gradient}">
          <div class="card-logo">${escapeHTML(item.logo)}</div>
        </div>
        <div class="card-body">
          <div class="card-company">${escapeHTML(item.company)}</div>
          <div class="card-role">${escapeHTML(item.role)} · ${escapeHTML(item.department)}</div>
          <p class="card-abstract">${escapeHTML(item.abstract)}</p>
          <div class="card-keywords">
            ${item.keywords.map(k => `<span class="card-keyword">${escapeHTML(k)}</span>`).join('')}
          </div>
          <button class="btn-detail" data-id="${item.id}" aria-label="View details of ${escapeHTML(item.company)}">
            View Details →
          </button>
        </div>
        <div class="card-footer">
          <span class="card-date">${escapeHTML(item.date)}</span>
          <span class="card-status">${escapeHTML(item.status)}</span>
        </div>
      </article>
    `).join('');

    // Bind detail buttons
    $$('.btn-detail', grid).forEach(btn => {
      btn.addEventListener('click', () => openModal(btn.dataset.id));
    });
  }

  // =============================================
  // FILTER LOGIC
  // =============================================
  function setupFilters() {
    const btns = $$('.filter-btn');
    const cards = $$('.project-card');

    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Update active state
        btns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter;

        cards.forEach(card => {
          if (filter === 'all') {
            card.classList.remove('hidden');
          } else {
            const cats = JSON.parse(card.dataset.categories);
            card.classList.toggle('hidden', !cats.includes(filter));
          }
        });
      });
    });
  }

  // =============================================
  // RENDER: RESEARCH INTERESTS
  // =============================================
  const RESEARCH_ICONS = {
    ai: '🤖',
    data: '📊',
    global: '🌍',
  };

  function renderResearch(d) {
    if (!d.researchInterests) return;
    const grid = $('#researchGrid');
    grid.innerHTML = d.researchInterests.map(r => `
      <div class="research-card">
        <div class="research-icon">${RESEARCH_ICONS[r.icon] || '💡'}</div>
        <h3>${escapeHTML(r.title)}</h3>
        <p>${escapeHTML(r.description)}</p>
      </div>
    `).join('');
  }

  // =============================================
  // RENDER: PERSONALITY SECTION
  // =============================================
  function renderPersonality(d) {
    if (!d.personal) return;
    const p = d.personal;
    const layout = $('#personalityLayout');

    // Build MBTI trait tags
    const mbtiTraits = (p.mbti && p.mbti.traits) ? p.mbti.traits.map(t =>
      `<span class="connection-trait"><span class="ct-label">${escapeHTML(t.trait)}</span>${escapeHTML(t.desc)}</span>`
    ).join('') : '';

    // Build zodiac trait tags
    const zodiacTraits = (p.zodiac && p.zodiac.traits) ? p.zodiac.traits.map(t =>
      `<span class="profile-trait-tag">${escapeHTML(t)}</span>`
    ).join('') : '';

    const avatarHTML = p.avatar
      ? `<img class="profile-avatar-img" src="${escapeHTML(p.avatar)}" alt="Avatar">`
      : `<div class="profile-avatar-fallback">何</div>`;

    layout.innerHTML = `
      <!-- Left: Profile Card -->
      <div class="profile-card">
        <div class="profile-card-top">
          <div class="profile-avatar-wrapper">${avatarHTML}</div>
          <div class="profile-name">${escapeHTML(d.basics.name)}</div>
          <div class="profile-role">${escapeHTML(d.basics.label)}</div>
          <div class="profile-badges">
            <span class="profile-badge badge-mbti">💜 ENFJ · ${escapeHTML(p.mbti.nickname)}</span>
            <span class="profile-badge badge-zodiac">♑ ${escapeHTML(p.zodiac.sign)}</span>
          </div>
        </div>
        <div class="profile-stats">
          <div class="profile-stat">
            <div class="stat-num">4</div>
            <div class="stat-label">实习经历</div>
          </div>
          <div class="profile-stat">
            <div class="stat-num">3</div>
            <div class="stat-label">项目经历</div>
          </div>
          <div class="profile-stat">
            <div class="stat-num">985</div>
            <div class="stat-label">硕士在读</div>
          </div>
        </div>
        <div class="profile-body">
          <div class="profile-body-label">✨ 摩羯座特质</div>
          <div class="profile-trait-tags">${zodiacTraits}</div>
        </div>
      </div>

      <!-- Right: Traits + Connection -->
      <div class="personality-right">
        <!-- Personality Cards -->
        <div class="personality-cards">
          ${(p.personalityCards || []).map(card => `
            <div class="person-card">
              <span class="pc-emoji">${escapeHTML(card.emoji)}</span>
              <div class="pc-title">${escapeHTML(card.title)}</div>
              <p class="pc-content">${escapeHTML(card.content)}</p>
            </div>
          `).join('')}
        </div>

        <!-- MBTI + Zodiac Connection -->
        <div class="connection-cards">
          <div class="connection-card">
            <div class="connection-header">
              <div class="connection-icon mbti">💜</div>
              <div>
                <div class="connection-title">ENFJ · ${escapeHTML(p.mbti.nickname)}</div>
                <div class="connection-subtitle">Myers-Briggs Type Indicator</div>
              </div>
            </div>
            <div class="connection-traits">${mbtiTraits}</div>
            <p class="connection-text">${escapeHTML(p.mbti.pmConnection)}</p>
          </div>
          <div class="connection-card">
            <div class="connection-header">
              <div class="connection-icon zodiac">♑</div>
              <div>
                <div class="connection-title">${escapeHTML(p.zodiac.sign)} · ${escapeHTML(p.zodiac.element)}</div>
                <div class="connection-subtitle">Zodiac Sign</div>
              </div>
            </div>
            <div class="connection-traits">
              ${(p.zodiac.traits || []).map(t =>
                `<span class="connection-trait"><span class="ct-label">${escapeHTML(t)}</span></span>`
              ).join('')}
            </div>
            <p class="connection-text">${escapeHTML(p.zodiac.pmConnection)}</p>
          </div>
        </div>
      </div>
    `;
  }

  // =============================================
  // MODAL
  // =============================================
  function openModal(id) {
    if (!portfolioData) return;
    const item = portfolioData.portfolio.find(p => p.id === id);
    if (!item) return;

    // Header
    $('#modalHeader').innerHTML = `
      <div class="mh-company">${escapeHTML(item.company)}</div>
      <div class="mh-role">${escapeHTML(item.role)} · ${escapeHTML(item.department)}</div>
      <div class="mh-date">${escapeHTML(item.date)}</div>
    `;

    // Body
    const highlights = item.details && item.details.highlights ? item.details.highlights : [];
    $('#modalBody').innerHTML = highlights.map(h => `
      <div class="modal-highlight">
        <h4>▸ ${escapeHTML(h.title)}</h4>
        <p>${escapeHTML(h.content)}</p>
      </div>
    `).join('') || '<p style="color:var(--text-muted)">暂无详细信息</p>';

    // Show
    $('#modalOverlay').classList.add('open');
    document.body.style.overflow = 'hidden';

    // Focus trap
    $('#modalClose').focus();
  }

  function closeModal() {
    $('#modalOverlay').classList.remove('open');
    document.body.style.overflow = '';
  }

  function setupModal() {
    $('#modalClose').addEventListener('click', closeModal);
    $('.modal-close-btn').addEventListener('click', closeModal);
    $('#modalOverlay').addEventListener('click', (e) => {
      if (e.target === $('#modalOverlay')) closeModal();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && $('#modalOverlay').classList.contains('open')) {
        closeModal();
      }
    });
  }

  // =============================================
  // NAVIGATION
  // =============================================
  function setupNav() {
    const navbar = $('#navbar');

    // Scroll shadow
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 10);

      // Update active nav link
      const sections = $$('section[id]');
      const links = $$('.nav-link');
      let current = '';
      sections.forEach(s => {
        const top = s.offsetTop - 100;
        if (window.scrollY >= top) current = s.id;
      });
      links.forEach(l => {
        l.classList.toggle('active', l.getAttribute('href') === `#${current}`);
      });
    });

    // Smooth scroll for anchor links
    $$('a[href^="#"]').forEach(a => {
      a.addEventListener('click', (e) => {
        const target = document.querySelector(a.getAttribute('href'));
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }

  // =============================================
  // MOBILE MENU
  // =============================================
  function setupMobileMenu() {
    const btn = $('#mobileMenuBtn');
    const overlay = $('#mobileNavOverlay');
    const close = $('#mobileNavClose');
    const links = $$('.mobile-nav-link');

    btn.addEventListener('click', () => overlay.classList.add('open'));
    close.addEventListener('click', () => overlay.classList.remove('open'));
    links.forEach(l => l.addEventListener('click', () => overlay.classList.remove('open')));
  }

  // =============================================
  // INIT
  // =============================================
  async function init() {
    const data = await loadData();
    if (!data) {
      document.body.innerHTML = `
        <div style="display:flex;align-items:center;justify-content:center;height:100vh;flex-direction:column;gap:16px;font-family:var(--font-sans);">
          <span style="font-size:48px;">⚠️</span>
          <p style="font-size:18px;color:var(--text-heading);">数据加载失败</p>
          <p style="font-size:14px;color:var(--text-muted);">请确认 <code>data/portfolio.json</code> 文件存在</p>
        </div>`;
      return;
    }

    renderHero(data);
    renderHighlights(data);
    renderPortfolio(data);
    renderResearch(data);
    renderPersonality(data);

    setupFilters();
    setupModal();
    setupNav();
    setupMobileMenu();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
