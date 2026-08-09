/* ============================================
   Resume Website - App Renderer
   ============================================ */

(function () {
  'use strict';

  // --- Helpers ---
  const $ = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));

  function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // Normalize list items: accept both ["str"] and [{"key":"str"}] formats
  function plainList(arr) {
    if (!arr || !Array.isArray(arr)) return [];
    return arr.map(item => {
      if (typeof item === 'string') return item;
      if (typeof item === 'object' && item !== null) {
        // Return the first value found in the object
        const vals = Object.values(item);
        return vals.length > 0 ? String(vals[0]) : '';
      }
      return String(item);
    }).filter(Boolean);
  }

  // Extract percentage/effect metrics from text for visual tags
  function extractMetrics(text) {
    const patterns = [
      /(\d+\.?\d*%)\s*(?:的)?(?:以上|以下|左右)?\s*([^，。,\n]{0,20})/g,
      /(\d+\.?\d*[万亿kw])\s*([^，。,\n]{0,15})/g,
    ];
    const metrics = [];
    for (const pattern of patterns) {
      let match;
      while ((match = pattern.exec(text)) !== null) {
        const m = match[1] + (match[2] ? match[2].trim().slice(0, 15) : '');
        if (m.length <= 30 && !metrics.includes(m)) {
          metrics.push(m);
        }
      }
    }
    return metrics.slice(0, 6);
  }

  // --- Render Functions ---

  function renderSidebar(data) {
    const basics = data.basics;

    // Name & Title
    $('#sidebar-name').textContent = basics.name;
    $('#sidebar-title').textContent = basics.label;

    // Avatar
    const avatar = $('#avatar');
    if (basics.avatar) {
      avatar.innerHTML = `<img src="${escapeHTML(basics.avatar)}" alt="${escapeHTML(basics.name)}">`;
    } else {
      avatar.textContent = basics.name.charAt(0);
    }

    // Contact Info
    const contactHTML = [
      basics.email ? `<div class="contact-item"><span class="icon">📧</span><a href="mailto:${escapeHTML(basics.email)}">${escapeHTML(basics.email)}</a></div>` : '',
      basics.phone ? `<div class="contact-item"><span class="icon">📱</span>${escapeHTML(basics.phone)}</div>` : '',
      basics.location ? `<div class="contact-item"><span class="icon">📍</span>${escapeHTML(basics.location)}</div>` : '',
      basics.website ? `<div class="contact-item"><span class="icon">🔗</span><a href="${escapeHTML(basics.website)}" target="_blank" rel="noopener">${escapeHTML(basics.website.replace(/^https?:\/\//, ''))}</a></div>` : '',
    ].filter(Boolean).join('');
    $('#contact-info').innerHTML = contactHTML;

    // Skills in sidebar
    renderSidebarSkills(data.skills);
  }

  function renderSidebarSkills(skills) {
    if (!skills) return;
    const container = $('#sidebar-skills');
    let html = '';

    // Technical Skills
    const techList = plainList(skills.technical);
    if (techList.length > 0) {
      html += '<div class="sidebar-section"><h3>🛠 专业技能</h3><div class="skill-tags">';
      techList.forEach(s => {
        html += `<span class="skill-tag">${escapeHTML(s)}</span>`;
      });
      html += '</div></div>';
    }

    // Languages
    if (skills.languages && skills.languages.length > 0) {
      html += '<div class="sidebar-section"><h3>🌐 语言能力</h3>';
      skills.languages.forEach(l => {
        html += `<div class="lang-item"><div class="lang-name">${escapeHTML(l.name)} — ${escapeHTML(l.level)}</div></div>`;
      });
      html += '</div>';
    }

    // Certificates
    const certList = plainList(skills.certificates);
    if (certList.length > 0) {
      html += '<div class="sidebar-section"><h3>📜 证书</h3>';
      certList.forEach(c => {
        html += `<div class="sidebar-cert">${escapeHTML(c)}</div>`;
      });
      html += '</div>';
    }

    container.innerHTML = html;
  }

  function renderAbout(data) {
    $('#summary-text').textContent = data.basics.summary;
  }

  function renderEducation(data) {
    const container = $('#education-container');
    if (!data.education || data.education.length === 0) {
      container.innerHTML = '<p style="color:var(--color-text-lighter)">暂无教育经历</p>';
      return;
    }

    let html = '';
    data.education.forEach(edu => {
      html += '<div class="edu-card">';
      html += '<div class="edu-header">';
      html += '<div>';
      html += `<span class="edu-school">${escapeHTML(edu.school)}</span>`;
      if (edu.type) html += `<span class="edu-badge">${escapeHTML(edu.type)}</span>`;
      html += `<br><span class="edu-degree">${escapeHTML(edu.degree)}</span>`;
      html += `<span class="edu-major">${escapeHTML(edu.major)}</span>`;
      html += '</div>';
      html += `<div class="edu-date">${escapeHTML(edu.startDate)} - ${escapeHTML(edu.endDate)}</div>`;
      html += '</div>';

      // Courses
      const courses = plainList(edu.courses);
      if (courses.length > 0) {
        html += '<div class="edu-details"><div class="edu-detail-group">';
        html += '<div class="edu-detail-label">主修课程</div>';
        html += '<div class="edu-detail-tags">';
        courses.forEach(c => {
          html += `<span class="edu-detail-tag">${escapeHTML(c)}</span>`;
        });
        html += '</div></div></div>';
      }

      // Honors
      const honors = plainList(edu.honors);
      if (honors.length > 0) {
        html += '<div class="edu-details"><div class="edu-detail-group">';
        html += '<div class="edu-detail-label">曾获荣誉</div>';
        html += '<div class="edu-detail-tags">';
        honors.forEach(h => {
          html += `<span class="edu-detail-tag">${escapeHTML(h)}</span>`;
        });
        html += '</div></div></div>';
      }

      // Competitions
      const competitions = plainList(edu.competitions);
      if (competitions.length > 0) {
        html += '<div class="edu-details"><div class="edu-detail-group">';
        html += '<div class="edu-detail-label">竞赛奖项</div>';
        html += '<div class="edu-detail-tags">';
        competitions.forEach(c => {
          html += `<span class="edu-detail-tag">${escapeHTML(c)}</span>`;
        });
        html += '</div></div></div>';
      }

      // Activities
      const activities = plainList(edu.activities);
      if (activities.length > 0) {
        html += '<div class="edu-details"><div class="edu-detail-group">';
        html += '<div class="edu-detail-label">校园经历</div>';
        activities.forEach(a => {
          html += `<div class="edu-detail-text">${escapeHTML(a)}</div>`;
        });
        html += '</div></div>';
      }

      html += '</div>';
    });

    container.innerHTML = html;
  }

  function renderInternships(data) {
    const container = $('#internships-container');
    if (!data.internships || data.internships.length === 0) {
      container.innerHTML = '<p style="color:var(--color-text-lighter)">暂无实习经历</p>';
      return;
    }

    let html = '<div class="timeline">';
    data.internships.forEach(intern => {
      html += '<div class="timeline-item">';
      html += '<div class="timeline-dot"></div>';
      html += '<div class="timeline-card">';

      // Header
      html += '<div class="timeline-header">';
      html += '<div>';
      html += `<span class="timeline-company">${escapeHTML(intern.company)}</span>`;
      html += `<span class="timeline-role">${escapeHTML(intern.role)}</span>`;
      html += '</div>';
      html += '<div class="timeline-meta">';
      html += `<div class="timeline-date">${escapeHTML(intern.startDate)} - ${escapeHTML(intern.endDate)}</div>`;
      if (intern.department) {
        html += `<div class="timeline-dept">${escapeHTML(intern.department)}</div>`;
      }
      html += '</div>';
      html += '</div>';

      // Highlights
      if (intern.highlights && intern.highlights.length > 0) {
        intern.highlights.forEach(h => {
          html += '<div class="highlight-block">';
          html += `<div class="highlight-title">▸ ${escapeHTML(h.title)}</div>`;
          html += `<div class="highlight-content">${escapeHTML(h.content)}</div>`;

          // Extract and display metrics
          const metrics = extractMetrics(h.content);
          if (metrics.length > 0) {
            html += '<div class="metrics-tags">';
            metrics.forEach(m => {
              html += `<span class="metric-tag">📊 ${escapeHTML(m)}</span>`;
            });
            html += '</div>';
          }
          html += '</div>';
        });
      }

      html += '</div></div>';
    });
    html += '</div>';

    container.innerHTML = html;
  }

  function renderProjects(data) {
    const container = $('#projects-container');
    if (!data.projects || data.projects.length === 0) {
      container.innerHTML = '<p style="color:var(--color-text-lighter)">暂无项目经历</p>';
      return;
    }

    let html = '';
    data.projects.forEach(proj => {
      html += '<div class="project-card">';
      html += '<div class="project-header">';
      html += '<div>';
      html += `<span class="project-name">${escapeHTML(proj.name)}</span>`;
      html += `<span class="project-role">${escapeHTML(proj.role)}</span>`;
      html += '</div>';
      html += `<div class="project-date">${escapeHTML(proj.date)}</div>`;
      html += '</div>';

      if (proj.highlights && proj.highlights.length > 0) {
        proj.highlights.forEach(h => {
          html += '<div class="highlight-block">';
          html += `<div class="highlight-title">▸ ${escapeHTML(h.title)}</div>`;
          html += `<div class="highlight-content">${escapeHTML(h.content)}</div>`;
          html += '</div>';
        });
      }

      html += '</div>';
    });

    container.innerHTML = html;
  }

  function renderPersonal(data) {
    const container = $('#personal-container');
    if (!data.personal || data.personal.length === 0) {
      container.innerHTML = '<p style="color:var(--color-text-lighter)">暂无信息</p>';
      return;
    }

    let html = '<div class="personal-grid">';
    data.personal.forEach(p => {
      // Pick emoji based on title
      let emoji = '✨';
      if (p.title.includes('快乐') || p.title.includes('发动机')) emoji = '🎉';
      else if (p.title.includes('厨师') || p.title.includes('厨')) emoji = '👨‍🍳';
      else if (p.title.includes('脱口秀') || p.title.includes('演员') || p.title.includes('演讲')) emoji = '🎤';

      html += '<div class="personal-card">';
      html += `<div class="personal-title">${emoji} ${escapeHTML(p.title)}</div>`;
      html += `<div class="personal-content">${escapeHTML(p.content)}</div>`;
      html += '</div>';
    });
    html += '</div>';

    container.innerHTML = html;
  }

  // --- Init ---
  async function init() {
    try {
      const resp = await fetch('data/resume.json');
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const data = await resp.json();

      renderSidebar(data);
      renderAbout(data);
      renderEducation(data);
      renderInternships(data);
      renderProjects(data);
      renderPersonal(data);

      // Show app, hide loading
      $('#loading').classList.add('hidden');
      $('#app').style.display = 'flex';

      // Set document title
      document.title = `${data.basics.name} - ${data.basics.label} | 个人简历`;
    } catch (err) {
      console.error('Failed to load resume data:', err);
      $('#loading').innerHTML = `
        <div style="text-align:center;color:var(--color-text-light);">
          <p style="font-size:18px;margin-bottom:10px;">⚠️ 简历数据加载失败</p>
          <p style="font-size:14px;">请确认 <code>data/resume.json</code> 文件存在</p>
        </div>`;
    }
  }

  // Start when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
