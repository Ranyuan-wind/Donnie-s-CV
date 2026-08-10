/* ============================================
   Donnie He Portfolio — v4: Scroll Animation Engine + Glassmorphism
   ============================================ */

(function () {
  'use strict';
  const $ = (s, c) => (c || document).querySelector(s);
  const $$ = (s, c) => Array.from((c || document).querySelectorAll(s));
  const esc = s => { const d = document.createElement('div'); d.textContent = String(s); return d.innerHTML; };

  let portfolio = null;
  const ICONS = { school: '🎓', ai: '🤖', data: '📊', global: '🌍' };
  const isImg = s => s && /\.(png|svg|jpe?g|webp|gif)/i.test(s);

  // =============================================
  // DATA LOADING
  // =============================================
  async function loadData() {
    try {
      const r = await fetch('data/portfolio.json');
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      portfolio = await r.json();
      return portfolio;
    } catch (e) { console.error(e); return null; }
  }

  // =============================================
  // SIDEBAR
  // =============================================
  function renderSidebar() {
    const b = portfolio.basics;
    $('#sbInitial').textContent = (b.nameEn || b.name).charAt(0).toUpperCase();
    $('#sbName').textContent = b.name;
    $('#sbTitle').textContent = b.label;
    $('#sbBio').textContent = b.summary;
    $('#sbContact').innerHTML = [
      b.email ? `<a href="mailto:${esc(b.email)}">📧 ${esc(b.email)}</a>` : '',
      b.wechat ? `<span>💬 微信：${esc(b.wechat)}</span>` : '',
      b.phone ? `<span>📱 ${esc(b.phone)}</span>` : '',
      b.location ? `<span>📍 ${esc(b.location)}</span>` : '',
    ].filter(Boolean).join('');
  }

  // =============================================
  // TIMELINE
  // =============================================
  function renderTimeline() {
    const list = portfolio.internships;
    if (!list) return;
    $('#timelineV2').innerHTML = list.map(item => `
      <div class="tl-item" data-id="${item.id}" data-source="internships">
        <div class="tl-dot-wrap"><div class="tl-dot"></div></div>
        <div class="tl-card">
          <div class="tl-card-header">
            <div class="tl-card-left">
              ${isImg(item.logo)
                ? `<img src="${esc(item.logo)}" alt="${esc(item.company)}" class="tl-logo-img">`
                : `<div class="tl-logo" style="background:${item.gradient}">${esc(item.logo)}</div>`
              }
              <div>
                <div class="tl-company">${esc(item.company)}</div>
                <span class="tl-role">${esc(item.role)} · ${esc(item.department)}</span>
              </div>
            </div>
            <div class="tl-date">${esc(item.date)}</div>
          </div>
          <div class="tl-abstract">${esc(item.abstract)}</div>
          <div class="tl-keywords">${item.keywords.map(k => `<span class="tl-kw">${esc(k)}</span>`).join('')}</div>
        </div>
      </div>
    `).join('');

    $$('.tl-card').forEach(card => {
      card.addEventListener('click', () => {
        const el = card.closest('.tl-item');
        openModal(el.dataset.source, el.dataset.id);
      });
    });
  }

  // =============================================
  // GENERIC CARD GRID RENDERER (Works + School)
  // =============================================
  function renderCardGrid(containerId, items, badgeType, badgeText) {
    const container = $(containerId);
    if (!items || !items.length) { container.innerHTML = ''; return; }
    container.innerHTML = items.map(item => `
      <article class="c-card" data-id="${item.id}" data-source="${badgeType === 'works' ? 'works' : 'schoolProjects'}">
        <div class="c-card-banner" style="background:${item.gradient}">
          ${isImg(item.logo)
            ? `<img src="${esc(item.logo)}" alt="${esc(item.company)}" class="c-card-logo-img">`
            : `<div class="c-card-logo">${esc(item.logo)}</div>`
          }
        </div>
        <div class="c-card-body">
          <div class="c-card-name">${esc(item.company)}</div>
          <div class="c-card-role">${esc(item.role)}</div>
          <p class="c-card-desc">${esc(item.abstract)}</p>
          <div class="c-card-kws">${item.keywords.map(k => `<span class="c-card-kw">${esc(k)}</span>`).join('')}</div>
          ${item.link ? `<a href="${esc(item.link)}" target="_blank" rel="noopener" class="c-card-link" onclick="event.stopPropagation()">🔗 ${esc(item.linkLabel || 'View Project')} →</a>` : ''}
        </div>
        <div class="c-card-footer">
          <span class="c-card-date">${esc(item.date)}</span>
          <span class="c-card-badge ${badgeType}">${esc(badgeText)}</span>
        </div>
      </article>
    `).join('');

    $$('.c-card', container).forEach(card => {
      card.addEventListener('click', () => openModal(card.dataset.source, card.dataset.id));
    });
  }

  // =============================================
  // SKILL STACK
  // =============================================
  function renderSkillStack() {
    const list = portfolio.skillStack;
    if (!list) return;
    const ICONS_MAP = { business: '📊', tech: '🤖', collab: '🤝' };
    $('#skillsGrid').innerHTML = list.map(s => `
      <div class="sk-card">
        <div class="sk-card-hd">
          <div class="sk-icon">${ICONS_MAP[s.icon] || '💡'}</div>
          <div>
            <h4 class="sk-title">${esc(s.title)}</h4>
            <p class="sk-sub">${esc(s.subtitle || '')}</p>
          </div>
        </div>
        <p class="sk-desc">${esc(s.description)}</p>
        <div class="sk-tags">${(s.highlights || []).map(h => `<span class="sk-tag">${esc(h)}</span>`).join('')}</div>
      </div>
    `).join('');
  }

  // =============================================
  // PERSONALITY V2
  // =============================================
  function renderPersonalityV2() {
    const p = portfolio.personal;
    if (!p) return;
    const b = portfolio.basics;
    const container = $('#personalityV2');

    const mbtiTraits = p.mbti?.traits ? p.mbti.traits.map(t =>
      `<span class="pv2-conn-trait"><strong>${esc(t.trait)}</strong>${esc(t.desc)}</span>`
    ).join('') : '';

    const zodiacTags = p.zodiac?.traits ? p.zodiac.traits.map(t =>
      `<span class="pv2-trait">${esc(t)}</span>`
    ).join('') : '';

    const avatarHTML = p.avatar
      ? `<img src="${esc(p.avatar)}" alt="Avatar" style="width:100%;height:100%;object-fit:cover">`
      : `<div class="pv2-avatar-fallback">${b.name?.charAt(0) || '?'}</div>`;

    container.innerHTML = `
      <div class="pv2-top">
        <div class="pv2-profile">
          <div class="pv2-profile-top">
            <div class="pv2-avatar-wrap">${avatarHTML}</div>
            <div class="pv2-name">${esc(b.name)}</div>
            <div class="pv2-role">${esc(b.label)}</div>
            <div class="pv2-badges">
              <span class="pv2-badge mbti">💜 ENFJ · ${esc(p.mbti.nickname)}</span>
              <span class="pv2-badge zodiac">♑ ${esc(p.zodiac.sign)}</span>
            </div>
          </div>
          <div class="pv2-stats">
            <div class="pv2-stat"><div class="num">4</div><div class="lbl">实习经历</div></div>
            <div class="pv2-stat"><div class="num">3</div><div class="lbl">项目经历</div></div>
            <div class="pv2-stat"><div class="num">985</div><div class="lbl">硕士在读</div></div>
          </div>
          <div class="pv2-body">
            <div class="pv2-body-label">✨ ${esc(p.zodiac.sign)}特质</div>
            <div class="pv2-traits">${zodiacTags}</div>
          </div>
        </div>
        <div class="pv2-cards">
          ${(p.personalityCards || []).map(c => `
            <div class="pv2-card">
              <span class="pv2-card-emoji">${esc(c.emoji)}</span>
              <div class="pv2-card-title">${esc(c.title)}</div>
              <p class="pv2-card-text">${esc(c.content)}</p>
            </div>
          `).join('')}
        </div>
      </div>
      <div class="pv2-bottom">
        <div class="pv2-conn">
          <div class="pv2-conn-hd">
            <div class="pv2-conn-icon mbti">💜</div>
            <div><div class="pv2-conn-ttl">ENFJ · ${esc(p.mbti.nickname)}</div><div class="pv2-conn-sub">Myers-Briggs Type Indicator</div></div>
          </div>
          <div class="pv2-conn-traits">${mbtiTraits}</div>
          <p class="pv2-conn-text">${esc(p.mbti.pmConnection)}</p>
        </div>
        <div class="pv2-conn">
          <div class="pv2-conn-hd">
            <div class="pv2-conn-icon zodiac">♑</div>
            <div><div class="pv2-conn-ttl">${esc(p.zodiac.sign)} · ${esc(p.zodiac.element)}</div><div class="pv2-conn-sub">Zodiac Sign</div></div>
          </div>
          <div class="pv2-conn-traits">
            ${(p.zodiac.traits||[]).map(t => `<span class="pv2-conn-trait"><strong>${esc(t)}</strong></span>`).join('')}
          </div>
          <p class="pv2-conn-text">${esc(p.zodiac.pmConnection)}</p>
        </div>
      </div>
    `;
  }

  // =============================================
  // MODAL
  // =============================================
  function openModal(source, id) {
    const collection = portfolio[source];
    if (!collection) return;
    const item = collection.find(x => x.id === id);
    if (!item) return;

    const subline = item.department ? `${esc(item.role)} · ${esc(item.department)}` : esc(item.role);

    $('#modalHeaderEl').innerHTML = `
      <div class="mh-company">${esc(item.company)}</div>
      <div class="mh-role">${subline}</div>
      <div class="mh-date">${esc(item.date)}</div>
    `;

    const highlights = item.details?.highlights || [];
    let extraHTML = '';

    // Workflow image
    if (item.workflowImage) {
      extraHTML += `<div class="modal-workflow">
        <div class="modal-workflow-label">📋 工作流架构</div>
        <img src="${esc(item.workflowImage)}" alt="Workflow" class="modal-workflow-img" onerror="this.style.display='none'">
      </div>`;
    }

    // Coze / external link
    if (item.link) {
      extraHTML += `<div class="modal-cta-row">
        <a href="${esc(item.link)}" target="_blank" rel="noopener" class="modal-link-btn">🔗 ${esc(item.linkLabel || 'View Project')} →</a>
      </div>`;
    }

    $('#modalBodyEl').innerHTML = extraHTML + (highlights.length
      ? highlights.map(h => `<div class="modal-hl"><h4>▸ ${esc(h.title)}</h4><p>${esc(h.content)}</p></div>`).join('')
      : '<p style="color:var(--m)">暂无详细信息</p>');

    $('#modalOverlay').classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    $('#modalOverlay').classList.remove('open');
    document.body.style.overflow = '';
  }

  // =============================================
  // INTERSECTION OBSERVER — Scroll Reveal
  // =============================================
  function setupScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;

          // Staggered children
          if (el.classList.contains('reveal-stagger')) {
            const children = Array.from(el.children);
            children.forEach((child, i) => {
              child.style.transitionDelay = `${i * 0.08}s`;
            });
          }

          el.classList.add('in-view');
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    // Observe all .reveal and .reveal-stagger elements
    $$('.reveal, .reveal-stagger').forEach(el => observer.observe(el));

    // Also stagger timeline items individually
    $$('.tl-item').forEach((el, i) => {
      el.style.transitionDelay = `${i * 0.08}s`;
    });
  }

  // =============================================
  // INTERSECTION OBSERVER — ScrollSpy
  // =============================================
  function setupScrollSpy() {
    const sections = $$('section[id]');
    const navLinks = $$('.sb-nav-link');

    if (!sections.length || !navLinks.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach(link => {
            link.classList.toggle('active', link.dataset.section === id);
          });
        }
      });
    }, { threshold: 0.3, rootMargin: '-10% 0px -60% 0px' });

    sections.forEach(s => observer.observe(s));
  }

  // =============================================
  // PARALLAX BACKGROUND BLOBS
  // =============================================
  function setupParallax() {
    const blobs = $$('.bg-blob');
    if (!blobs.length) return;

    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      blobs.forEach((blob, i) => {
        const speed = 0.03 + i * 0.015;
        blob.style.transform = `translateY(${y * speed}px)`;
      });
    }, { passive: true });
  }

  // =============================================
  // MOBILE MENU
  // =============================================
  function setupMobileMenu() {
    $('#mhMenuBtn')?.addEventListener('click', () => $('#mhOverlay').classList.add('open'));
    $('#mhClose')?.addEventListener('click', () => $('#mhOverlay').classList.remove('open'));
    $$('.mh-link').forEach(l => l.addEventListener('click', () => $('#mhOverlay').classList.remove('open')));
  }

  // =============================================
  // MODAL EVENTS
  // =============================================
  function setupModalEvents() {
    $('#modalCloseBtn').addEventListener('click', closeModal);
    $('.modal-dismiss').addEventListener('click', closeModal);
    $('#modalOverlay').addEventListener('click', e => {
      if (e.target === $('#modalOverlay')) closeModal();
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && $('#modalOverlay').classList.contains('open')) closeModal();
    });
  }

  // =============================================
  // HIDE SCROLL HINT ON SCROLL
  // =============================================
  function setupScrollHint() {
    const hint = $('.intro-scroll-hint');
    if (!hint) return;
    window.addEventListener('scroll', () => {
      if (window.scrollY > 100) {
        hint.style.opacity = '0';
        hint.style.transition = 'opacity 0.5s ease';
      } else {
        hint.style.opacity = '1';
      }
    }, { passive: true });
  }

  // =============================================
  // SIDEBAR NAV CLICK — SMOOTH SCROLL
  // =============================================
  function setupSidebarNav() {
    $$('.sb-nav-link').forEach(link => {
      link.addEventListener('click', e => {
        e.preventDefault();
        const sectionId = link.dataset.section;
        const target = document.getElementById(sectionId);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  // =============================================
  // INIT
  // =============================================
  async function init() {
    const d = await loadData();
    if (!d) {
      document.body.innerHTML = `
        <div style="display:flex;align-items:center;justify-content:center;height:100vh;flex-direction:column;gap:16px;font-family:system-ui;">
          <span style="font-size:48px;">⚠️</span>
          <p style="font-size:18px;color:#0A0A0A;">Data failed to load</p>
          <p style="font-size:14px;color:#A3A3A3;">Check <code>data/portfolio.json</code></p>
        </div>`;
      return;
    }

    renderSidebar();
    renderTimeline();
    renderCardGrid('#worksGridV2', portfolio.works, 'works', '个人作品');
    renderCardGrid('#schoolGridV2', portfolio.schoolProjects, 'school', '学校调研项目');
    renderSkillStack();
    renderPersonalityV2();

    setupScrollReveal();
    setupScrollSpy();
    setupParallax();
    setupMobileMenu();
    setupModalEvents();
    setupScrollHint();
    setupSidebarNav();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
