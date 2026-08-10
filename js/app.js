/* ============================================
   Modern Portfolio v3 — Timeline + Sections
   ============================================ */

(function () {
  'use strict';

  const $ = (s, c) => (c || document).querySelector(s);
  const $$ = (s, c) => Array.from((c || document).querySelectorAll(s));

  function esc(s) {
    const d = document.createElement('div');
    d.textContent = s;
    return d.innerHTML;
  }

  let data = null;

  async function loadData() {
    try {
      const r = await fetch('data/portfolio.json');
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      data = await r.json();
      return data;
    } catch (e) { console.error('Load failed:', e); return null; }
  }

  // =============================================
  // HERO
  // =============================================
  function renderHero() {
    const b = data.basics;
    $('#heroName').textContent = b.name;
    $('#heroTitle').textContent = b.label;
    $('#heroSubtitle').textContent = '大连理工大学 企业管理硕士 · AI 策略产品方向';
    $('#heroBio').textContent = b.summary;
    if (b.avatar) {
      $('#heroAvatar').innerHTML = `<img src="${esc(b.avatar)}" alt="${esc(b.name)}">`;
    }
  }

  // =============================================
  // CORE STRENGTHS
  // =============================================
  const ICONS = { school: '🎓', ai: '🤖', data: '📊', global: '🌍' };

  function renderHighlights() {
    if (!data.highlights) return;
    $('#highlightsGrid').innerHTML = data.highlights.map(h => `
      <div class="highlight-card">
        <div class="highlight-icon">${ICONS[h.icon] || '✨'}</div>
        <h3>${esc(h.title)}</h3>
        <div class="hl-subtitle">${esc(h.subtitle)}</div>
        <p>${esc(h.description)}</p>
      </div>
    `).join('');
  }

  // =============================================
  // INTERNSHIP TIMELINE
  // =============================================
  function renderTimeline() {
    if (!data.internships) return;
    $('#timeline').innerHTML = data.internships.map(item => `
      <div class="timeline-item" data-id="${item.id}" data-source="internships">
        <div class="timeline-dot"></div>
        <div class="timeline-card">
          <div class="timeline-card-header">
            <div class="timeline-card-left">
              <div class="timeline-logo" style="background:${item.gradient}">${esc(item.logo)}</div>
              <div>
                <div class="timeline-company">${esc(item.company)}</div>
                <span class="timeline-role">${esc(item.role)} · ${esc(item.department)}</span>
              </div>
            </div>
            <div class="timeline-date">${esc(item.date)}</div>
          </div>
          <div class="timeline-abstract">${esc(item.abstract)}</div>
          <div class="timeline-keywords">
            ${item.keywords.map(k => `<span class="timeline-keyword">${esc(k)}</span>`).join('')}
          </div>
          <div class="timeline-hint">Click for details →</div>
        </div>
      </div>
    `).join('');

    // Click to open modal
    $$('.timeline-card').forEach(card => {
      card.addEventListener('click', () => {
        const itemEl = card.closest('.timeline-item');
        openModal(itemEl.dataset.source, itemEl.dataset.id);
      });
    });
  }

  // =============================================
  // WORKS / 作品集
  // =============================================
  function renderWorks() {
    if (!data.works || !data.works.length) return;
    $('#worksGrid').innerHTML = data.works.map(item => `
      <article class="work-card" data-id="${item.id}" data-source="works">
        <div class="work-banner" style="background:${item.gradient}">
          <div class="work-logo">${esc(item.logo)}</div>
        </div>
        <div class="work-body">
          <div class="work-company">${esc(item.company)}</div>
          <div class="work-role">${esc(item.role)}</div>
          <p class="work-abstract">${esc(item.abstract)}</p>
          <div class="work-keywords">
            ${item.keywords.map(k => `<span class="work-keyword">${esc(k)}</span>`).join('')}
          </div>
        </div>
        <div class="work-footer">
          <span class="work-date">${esc(item.date)}</span>
          <span class="work-badge">个人作品</span>
        </div>
      </article>
    `).join('');

    $$('.work-card').forEach(card => {
      card.addEventListener('click', () => openModal(card.dataset.source, card.dataset.id));
    });
  }

  // =============================================
  // SCHOOL PROJECTS
  // =============================================
  function renderSchoolProjects() {
    if (!data.schoolProjects || !data.schoolProjects.length) return;
    $('#schoolGrid').innerHTML = data.schoolProjects.map(item => `
      <article class="school-card" data-id="${item.id}" data-source="schoolProjects">
        <div class="school-banner" style="background:${item.gradient}">
          <div class="school-logo">${esc(item.logo)}</div>
        </div>
        <div class="school-body">
          <div class="school-name">${esc(item.company)}</div>
          <div class="school-role">${esc(item.role)}</div>
          <p class="school-abstract">${esc(item.abstract)}</p>
          <div class="school-keywords">
            ${item.keywords.map(k => `<span class="school-keyword">${esc(k)}</span>`).join('')}
          </div>
        </div>
        <div class="school-footer">
          <span class="school-date">${esc(item.date)}</span>
          <span class="school-badge">学校调研项目</span>
        </div>
      </article>
    `).join('');

    $$('.school-card').forEach(card => {
      card.addEventListener('click', () => openModal(card.dataset.source, card.dataset.id));
    });
  }

  // =============================================
  // RESEARCH INTERESTS
  // =============================================
  function renderResearch() {
    if (!data.researchInterests) return;
    const RI = { ai: '🤖', data: '📊', global: '🌍' };
    $('#researchGrid').innerHTML = data.researchInterests.map(r => `
      <div class="research-card">
        <div class="research-icon">${RI[r.icon] || '💡'}</div>
        <h3>${esc(r.title)}</h3>
        <p>${esc(r.description)}</p>
      </div>
    `).join('');
  }

  // =============================================
  // PERSONALITY
  // =============================================
  function renderPersonality() {
    const p = data.personal;
    if (!p) return;
    const layout = $('#personalityLayout');

    const mbtiTraits = (p.mbti && p.mbti.traits) ? p.mbti.traits.map(t =>
      `<span class="connection-trait"><span class="ct-label">${esc(t.trait)}</span>${esc(t.desc)}</span>`
    ).join('') : '';

    const zodiacTags = (p.zodiac && p.zodiac.traits) ? p.zodiac.traits.map(t =>
      `<span class="profile-trait-tag">${esc(t)}</span>`
    ).join('') : '';

    const avatarHTML = p.avatar
      ? `<img class="profile-avatar-img" src="${esc(p.avatar)}" alt="Avatar">`
      : `<div class="profile-avatar-fallback">${data.basics.name.charAt(0)}</div>`;

    layout.innerHTML = `
      <div class="profile-card">
        <div class="profile-card-top">
          <div class="profile-avatar-wrapper">${avatarHTML}</div>
          <div class="profile-name">${esc(data.basics.name)}</div>
          <div class="profile-role">${esc(data.basics.label)}</div>
          <div class="profile-badges">
            <span class="profile-badge badge-mbti">💜 ENFJ · ${esc(p.mbti.nickname)}</span>
            <span class="profile-badge badge-zodiac">♑ ${esc(p.zodiac.sign)}</span>
          </div>
        </div>
        <div class="profile-stats">
          <div class="profile-stat"><div class="stat-num">4</div><div class="stat-label">实习经历</div></div>
          <div class="profile-stat"><div class="stat-num">3</div><div class="stat-label">项目经历</div></div>
          <div class="profile-stat"><div class="stat-num">985</div><div class="stat-label">硕士在读</div></div>
        </div>
        <div class="profile-body">
          <div class="profile-body-label">✨ ${esc(p.zodiac.sign)}特质</div>
          <div class="profile-trait-tags">${zodiacTags}</div>
        </div>
      </div>
      <div class="personality-right">
        <div class="personality-cards">
          ${(p.personalityCards || []).map(c => `
            <div class="person-card">
              <span class="pc-emoji">${esc(c.emoji)}</span>
              <div class="pc-title">${esc(c.title)}</div>
              <p class="pc-content">${esc(c.content)}</p>
            </div>
          `).join('')}
        </div>
        <div class="connection-cards">
          <div class="connection-card">
            <div class="connection-header">
              <div class="connection-icon mbti">💜</div>
              <div><div class="connection-title">ENFJ · ${esc(p.mbti.nickname)}</div><div class="connection-subtitle">Myers-Briggs Type Indicator</div></div>
            </div>
            <div class="connection-traits">${mbtiTraits}</div>
            <p class="connection-text">${esc(p.mbti.pmConnection)}</p>
          </div>
          <div class="connection-card">
            <div class="connection-header">
              <div class="connection-icon zodiac">♑</div>
              <div><div class="connection-title">${esc(p.zodiac.sign)} · ${esc(p.zodiac.element)}</div><div class="connection-subtitle">Zodiac Sign</div></div>
            </div>
            <div class="connection-traits">
              ${(p.zodiac.traits || []).map(t => `<span class="connection-trait"><span class="ct-label">${esc(t)}</span></span>`).join('')}
            </div>
            <p class="connection-text">${esc(p.zodiac.pmConnection)}</p>
          </div>
        </div>
      </div>
    `;
  }

  // =============================================
  // MODAL
  // =============================================
  function openModal(source, id) {
    const collection = data[source];
    if (!collection) return;
    const item = collection.find(x => x.id === id);
    if (!item) return;

    const dept = item.department || '';
    const subline = dept ? `${esc(item.role)} · ${esc(dept)}` : esc(item.role);

    $('#modalHeader').innerHTML = `
      <div class="mh-company">${esc(item.company)}</div>
      <div class="mh-role">${subline}</div>
      <div class="mh-date">${esc(item.date)}</div>
    `;

    const highlights = item.details && item.details.highlights ? item.details.highlights : [];
    $('#modalBody').innerHTML = highlights.length
      ? highlights.map(h => `
          <div class="modal-highlight">
            <h4>▸ ${esc(h.title)}</h4>
            <p>${esc(h.content)}</p>
          </div>
        `).join('')
      : '<p style="color:var(--text-muted)">暂无详细信息</p>';

    $('#modalOverlay').classList.add('open');
    document.body.style.overflow = 'hidden';
    $('#modalClose').focus();
  }

  function closeModal() {
    $('#modalOverlay').classList.remove('open');
    document.body.style.overflow = '';
  }

  function setupModal() {
    $('#modalClose').addEventListener('click', closeModal);
    $('.modal-close-btn').addEventListener('click', closeModal);
    $('#modalOverlay').addEventListener('click', e => {
      if (e.target === $('#modalOverlay')) closeModal();
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && $('#modalOverlay').classList.contains('open')) closeModal();
    });
  }

  // =============================================
  // NAVIGATION
  // =============================================
  function setupNav() {
    const navbar = $('#navbar');
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 10);
      const sections = $$('section[id]');
      const links = $$('.nav-link');
      let current = '';
      sections.forEach(s => { if (window.scrollY >= s.offsetTop - 120) current = s.id; });
      links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === `#${current}`));
    });
    $$('a[href^="#"]').forEach(a => {
      a.addEventListener('click', e => {
        const t = document.querySelector(a.getAttribute('href'));
        if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth' }); }
      });
    });
  }

  function setupMobileMenu() {
    $('#mobileMenuBtn').addEventListener('click', () => $('#mobileNavOverlay').classList.add('open'));
    $('#mobileNavClose').addEventListener('click', () => $('#mobileNavOverlay').classList.remove('open'));
    $$('.mobile-nav-link').forEach(l => l.addEventListener('click', () => $('#mobileNavOverlay').classList.remove('open')));
  }

  // =============================================
  // INIT
  // =============================================
  async function init() {
    const d = await loadData();
    if (!d) {
      document.body.innerHTML = `<div style="display:flex;align-items:center;justify-content:center;height:100vh;flex-direction:column;gap:16px;font-family:sans-serif;"><span style="font-size:48px;">⚠️</span><p>数据加载失败</p></div>`;
      return;
    }
    renderHero();
    renderHighlights();
    renderTimeline();
    renderWorks();
    renderSchoolProjects();
    renderResearch();
    renderPersonality();
    setupModal();
    setupNav();
    setupMobileMenu();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
