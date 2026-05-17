(function () {
  'use strict';

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function renderPieces(pieces, lang) {
    if (!pieces) return '';
    const intermission = lang === 'fr' ? 'Entracte' : 'Intermission';
    return pieces
      .map((item) => {
        if (item.intermission) {
          return `<li class="programme-piece programme-piece--break"><span class="programme-piece__break">${intermission}</span></li>`;
        }
        const note = item.note
          ? `<span class="programme-piece__note">${escapeHtml(item.note)}</span>`
          : '';
        const duration = item.duration
          ? `<span class="programme-piece__duration">${escapeHtml(item.duration)}</span>`
          : '';
        return `<li class="programme-piece">
          <span class="programme-piece__work">${escapeHtml(item.text)}</span>
          ${note}
          ${duration}
        </li>`;
      })
      .join('');
  }

  function renderSections(sections, footnoteOptional) {
    if (!sections) return '';
    let html = '<div class="programme-sections">';
    sections.forEach((section) => {
      html += `<div class="programme-section"><h3 class="programme-section__composer">${escapeHtml(section.composer)}</h3><ul class="programme-list">`;
      section.works.forEach((work) => {
        const title = work.optional ? `(${escapeHtml(work.title)})` : escapeHtml(work.title);
        html += `<li class="programme-piece programme-piece--concerto"><span class="programme-piece__work">${title}</span></li>`;
      });
      html += '</ul></div>';
    });
    html += '</div>';
    if (footnoteOptional) {
      html += `<p class="programme-detail__legend">${escapeHtml(footnoteOptional)}</p>`;
    }
    return html;
  }

  function renderProgrammeBody(programme, ui, lang) {
    let html = '<div class="programme-detail">';
    const hasIntro = programme.meta || (programme.intro && programme.intro.length);

    if (hasIntro) {
      html += '<div class="programme-detail__intro">';
      if (programme.meta) {
        html += `<p class="programme-detail__meta">${escapeHtml(programme.meta)}</p>`;
      }
      if (programme.intro) {
        programme.intro.forEach((p) => {
          html += `<p class="programme-detail__text">${escapeHtml(p)}</p>`;
        });
      }
      html += '</div>';
    }

    if (programme.sections || programme.pieces) {
      html += '<div class="programme-detail__works">';
      if (programme.sections) {
        html += renderSections(programme.sections, ui.footnoteOptional);
      }
      if (programme.pieces) {
        html += `<ul class="programme-list">${renderPieces(programme.pieces, lang)}</ul>`;
      }
      html += '</div>';
    }

    if (programme.footnote) {
      html += `<p class="programme-detail__footer">${escapeHtml(programme.footnote)}</p>`;
    }
    if (programme.links) {
      programme.links.forEach((link) => {
        html += `<p class="programme-detail__link"><a href="${escapeHtml(link.href)}" target="_blank" rel="noopener">${escapeHtml(link.label)}</a></p>`;
      });
    }

    html += '</div>';
    return html;
  }

  function initProgrammes() {
    const root = document.querySelector('[data-programmes]');
    if (!root || !window.PROGRAMMES_DATA) return;

    const lang = root.dataset.lang || (document.documentElement.lang || 'fr').slice(0, 2);
    const ui = window.PROGRAMMES_DATA[lang] || window.PROGRAMMES_DATA.fr;
    const contactHref = lang === 'en' ? '/en/contact.html' : '/fr/contact.html';

    const listEl = root.querySelector('.programmes-index');
    const introEl = root.querySelector('[data-programmes-intro]');
    const labelEl = root.querySelector('[data-programmes-label]');
    const ctaEl = root.querySelector('[data-programmes-cta]');

    if (!listEl) return;

    if (labelEl) labelEl.textContent = ui.label;
    if (introEl) introEl.textContent = ui.intro;
    if (ctaEl) {
      ctaEl.href = contactHref;
      ctaEl.textContent = ui.contactCta;
    }

    let modal = document.querySelector('.programme-modal');
    if (!modal) {
      const wrap = document.createElement('div');
      wrap.className = 'programme-modal';
      wrap.setAttribute('aria-hidden', 'true');
      wrap.innerHTML = [
        '<div class="programme-modal__backdrop" data-close-modal tabindex="-1" aria-hidden="true"></div>',
        '<div class="programme-modal__panel" role="dialog" aria-modal="true" aria-labelledby="programme-modal-title">',
        '  <button type="button" class="programme-modal__close" data-close-modal aria-label="">×</button>',
        '  <div class="programme-modal__scroll">',
        '    <h2 id="programme-modal-title" class="programme-modal__title"></h2>',
        '    <p class="programme-modal__subtitle"></p>',
        '    <div class="programme-modal__body"></div>',
        '  </div>',
        '  <div class="programme-modal__actions">',
        '    <a href="#" class="programme-modal__download" download></a>',
        '  </div>',
        '</div>',
      ].join('');
      document.body.appendChild(wrap);
      modal = wrap;
    }

    const titleEl = modal.querySelector('.programme-modal__title');
    const subtitleEl = modal.querySelector('.programme-modal__subtitle');
    const bodyEl = modal.querySelector('.programme-modal__body');
    const downloadEl = modal.querySelector('.programme-modal__download');
    const closeBtn = modal.querySelector('.programme-modal__close');
    const panel = modal.querySelector('.programme-modal__panel');

    closeBtn.setAttribute('aria-label', ui.close);

    let activeProgramme = null;
    let lastFocus = null;
    let closeTimer = null;

    function openModal(programme) {
      if (closeTimer) {
        clearTimeout(closeTimer);
        closeTimer = null;
      }
      activeProgramme = programme;
      lastFocus = document.activeElement;
      titleEl.textContent = programme.title;
      subtitleEl.textContent = programme.subtitle || '';
      bodyEl.innerHTML = renderProgrammeBody(programme, ui, lang);
      downloadEl.textContent = ui.downloadPdf;
      downloadEl.download = programme.pdfFilename;
      downloadEl.href = '#';
      downloadEl.dataset.generatePdf = 'true';
      modal.removeAttribute('hidden');
      modal.setAttribute('aria-hidden', 'false');
      requestAnimationFrame(() => modal.classList.add('is-open'));
      document.body.classList.add('programme-modal-open');
      closeBtn.focus();
    }

    function closeModal() {
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('programme-modal-open');
      closeTimer = window.setTimeout(() => {
        bodyEl.innerHTML = '';
        activeProgramme = null;
        closeTimer = null;
        if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus();
      }, 320);
    }

    function buildProgrammeSheetMarkup(programme) {
      return `<h2 class="programme-modal__title">${escapeHtml(programme.title)}</h2>
        <p class="programme-modal__subtitle">${escapeHtml(programme.subtitle || '')}</p>
        <div class="programme-modal__body">${renderProgrammeBody(programme, ui, lang)}</div>`;
    }

    function buildPrintableHtml(programme) {
      const origin = window.location.origin || '';
      const sheetClass = programme.sections ? 'programme-pdf-sheet programme-pdf-sheet--sections' : 'programme-pdf-sheet';
      return `<!DOCTYPE html><html lang="${lang}"><head><meta charset="UTF-8"><title>${escapeHtml(programme.pdfFilename)}</title>
        <link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@300;400&family=Cormorant+Garamond&family=Tenor+Sans&display=swap" rel="stylesheet">
        <link rel="stylesheet" href="https://use.typekit.net/pex8zol.css">
        <link rel="stylesheet" href="${origin}/css/main.css">
        <style>
          body { margin: 0; background: #fff; }
          .programme-pdf-sheet {
            position: static;
            opacity: 1;
            z-index: auto;
            pointer-events: auto;
            margin: 0 auto;
          }
          @media print {
            .programme-pdf-sheet .programme-detail__intro,
            .programme-pdf-sheet .programme-section,
            .programme-pdf-sheet .programme-piece,
            .programme-pdf-sheet .programme-detail__legend,
            .programme-pdf-sheet .programme-detail__footer {
              page-break-inside: avoid;
              break-inside: avoid-page;
            }
            .programme-pdf-sheet .programme-section__composer {
              page-break-after: avoid;
            }
          }
        </style></head><body>
        <div class="${sheetClass}">${buildProgrammeSheetMarkup(programme)}</div>
        </body></html>`;
    }

    function createPdfSheetElement(programme) {
      const sheet = document.createElement('div');
      sheet.className = 'programme-pdf-sheet';
      if (programme.sections) sheet.classList.add('programme-pdf-sheet--sections');
      sheet.setAttribute('aria-hidden', 'true');
      sheet.innerHTML = buildProgrammeSheetMarkup(programme);
      document.body.appendChild(sheet);
      return sheet;
    }

    async function downloadGeneratedPdf(programme) {
      if (!window.html2pdf) {
        const w = window.open('', '_blank');
        if (w) {
          w.document.write(buildPrintableHtml(programme));
          w.document.close();
          w.focus();
          w.print();
        }
        return;
      }

      const sheet = createPdfSheetElement(programme);
      await document.fonts.ready;
      await new Promise((resolve) => {
        requestAnimationFrame(() => requestAnimationFrame(resolve));
      });

      try {
        await window
          .html2pdf()
          .set({
            margin: [14, 14, 16, 14],
            filename: programme.pdfFilename,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: {
              scale: 2,
              useCORS: true,
              letterRendering: true,
              scrollX: 0,
              scrollY: 0,
              windowWidth: 680,
            },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
            pagebreak: {
              mode: ['avoid-all', 'css', 'legacy'],
              avoid: [
                '.programme-detail__intro',
                '.programme-section',
                '.programme-section__composer',
                '.programme-piece',
                '.programme-piece--break',
                '.programme-detail__legend',
                '.programme-detail__footer',
              ],
            },
          })
          .from(sheet)
          .save();
      } finally {
        sheet.remove();
      }
    }

    downloadEl.addEventListener('click', (e) => {
      if (downloadEl.dataset.generatePdf === 'true' && activeProgramme) {
        e.preventDefault();
        downloadGeneratedPdf(activeProgramme);
      }
    });

    ui.programmes.forEach((programme, index) => {
      const card = document.createElement('button');
      card.type = 'button';
      card.className = 'programme-card';
      card.style.setProperty('--stagger', String(index));
      card.innerHTML = `
        <span class="programme-card__title">${escapeHtml(programme.title)}</span>
        <span class="programme-card__subtitle">${escapeHtml(programme.subtitle || '')}</span>
        <span class="programme-card__hint" aria-hidden="true">+</span>
      `;
      card.addEventListener('click', () => openModal(programme));
      listEl.appendChild(card);
    });

    modal.querySelectorAll('[data-close-modal]').forEach((el) => {
      el.addEventListener('click', closeModal);
    });

    panel.addEventListener('click', (e) => e.stopPropagation());

    document.addEventListener('keydown', (e) => {
      if (!modal.classList.contains('is-open')) return;
      if (e.key === 'Escape') closeModal();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initProgrammes);
  } else {
    initProgrammes();
  }
})();
