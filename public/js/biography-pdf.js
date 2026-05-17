(function () {
  'use strict';

  const PDF_STYLES = `
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { margin: 0; background: #fff; color: #000; }
    .bio-pdf-sheet {
      width: 680px;
      padding: 44px 44px 48px;
      background: #fff;
      -webkit-font-smoothing: antialiased;
    }
    .bio-pdf__header {
      margin-bottom: 32px;
      padding-bottom: 24px;
      border-bottom: 1px solid rgba(0,0,0,0.1);
    }
    .bio-pdf__brand {
      font-family: 'Barlow Condensed', 'Helvetica Neue', sans-serif;
      font-size: 11px;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: #666;
      margin-bottom: 10px;
    }
    .bio-pdf__title {
      font-family: Georgia, 'Cormorant Garamond', serif;
      font-size: 28px;
      font-weight: 400;
      letter-spacing: 0.06em;
    }
    .bio-pdf__body { margin-bottom: 40px; }
    .bio-pdf__text {
      font-family: 'Cormorant Garamond', Georgia, serif;
      font-size: 16px;
      line-height: 1.75;
      color: #333;
      margin-bottom: 18px;
    }
    .bio-pdf__contact {
      padding-top: 32px;
      border-top: 1px solid rgba(0,0,0,0.1);
    }
    .bio-pdf__contact-title {
      font-family: 'Barlow Condensed', sans-serif;
      font-size: 11px;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: #666;
      margin-bottom: 24px;
    }
    .bio-pdf-agencies { display: flex; flex-direction: column; gap: 36px; }
    .bio-pdf-agency + .bio-pdf-agency {
      padding-top: 8px;
      border-top: 1px solid rgba(0,0,0,0.08);
    }
    .bio-pdf-agency__region {
      font-family: 'Barlow Condensed', sans-serif;
      font-size: 11px;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: #666;
      margin-bottom: 8px;
      line-height: 1.4;
    }
    .bio-pdf-agency__name {
      font-family: Georgia, 'Cormorant Garamond', serif;
      font-size: 17px;
      letter-spacing: 0.04em;
      margin-bottom: 16px;
      color: #000;
    }
    .bio-pdf-agency__line {
      font-family: 'Cormorant Garamond', Georgia, serif;
      font-size: 15px;
      line-height: 1.5;
      margin-bottom: 8px;
      color: #333;
    }
    .bio-pdf-agency__line a { color: #333; text-decoration: none; }
  `;

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function renderAgency(agency) {
    const address = agency.address
      .map((line) => '<p class="bio-pdf-agency__line">' + escapeHtml(line) + '</p>')
      .join('');
    const tel = agency.phone.replace(/\s/g, '');
    return (
      '<div class="bio-pdf-agency">' +
      '<p class="bio-pdf-agency__region">' + escapeHtml(agency.region) + '</p>' +
      '<p class="bio-pdf-agency__name">' + escapeHtml(agency.name) + '</p>' +
      '<p class="bio-pdf-agency__line"><a href="' + escapeHtml(agency.website) + '">' + escapeHtml(agency.website) + '</a></p>' +
      '<p class="bio-pdf-agency__line">' + escapeHtml(agency.contact) + '</p>' +
      '<p class="bio-pdf-agency__line"><a href="mailto:' + escapeHtml(agency.email) + '">' + escapeHtml(agency.email) + '</a></p>' +
      '<p class="bio-pdf-agency__line"><a href="tel:' + escapeHtml(tel) + '">' + escapeHtml(agency.phone) + '</a></p>' +
      address +
      '</div>'
    );
  }

  function buildSheetHtml(data) {
    const paragraphs = data.paragraphs
      .map((p) => '<p class="bio-pdf__text">' + escapeHtml(p) + '</p>')
      .join('');
    const agencies = data.agencies.map((a) => renderAgency(a)).join('');

    return (
      '<header class="bio-pdf__header">' +
      '<p class="bio-pdf__brand">\u52d9\u5ddd\u6167\u609f \u00b7 KEIGO MUKAWA</p>' +
      '<h1 class="bio-pdf__title">' + escapeHtml(data.title) + '</h1>' +
      '</header>' +
      '<div class="bio-pdf__body">' + paragraphs + '</div>' +
      '<section class="bio-pdf__contact">' +
      '<h2 class="bio-pdf__contact-title">' + escapeHtml(data.contactTitle) + '</h2>' +
      '<div class="bio-pdf-agencies">' + agencies + '</div>' +
      '</section>'
    );
  }

  function buildPrintDocument(data) {
    return (
      '<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8">' +
      '<link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@300;400&family=Cormorant+Garamond:ital,wght@0,400&display=swap" rel="stylesheet">' +
      '<style>' +
      PDF_STYLES +
      '</style></head><body>' +
      '<div class="bio-pdf-sheet">' +
      buildSheetHtml(data) +
      '</div></body></html>'
    );
  }

  function openPrintWindow(data) {
    const w = window.open('', '_blank');
    if (!w) return;
    w.document.write(buildPrintDocument(data));
    w.document.close();
    w.focus();
  }

  function loadIframeDocument(data) {
    return new Promise((resolve, reject) => {
      const iframe = document.createElement('iframe');
      iframe.setAttribute('aria-hidden', 'true');
      iframe.style.cssText =
        'position:fixed;left:0;top:0;width:680px;height:0;border:0;opacity:0;pointer-events:none;z-index:-1';
      document.body.appendChild(iframe);

      const doc = iframe.contentDocument || iframe.contentWindow.document;
      doc.open();
      doc.write(buildPrintDocument(data));
      doc.close();

      const done = () => {
        const sheet = doc.querySelector('.bio-pdf-sheet');
        if (!sheet) {
          iframe.remove();
          reject(new Error('PDF sheet missing'));
          return;
        }
        resolve({ iframe, sheet, doc });
      };

      iframe.addEventListener('load', done, { once: true });
      setTimeout(done, 400);
    });
  }

  async function downloadBioPdf(data) {
    let iframeCtx;
    try {
      iframeCtx = await loadIframeDocument(data);
    } catch (err) {
      openPrintWindow(data);
      return;
    }

    const { iframe, sheet, doc } = iframeCtx;

    if (doc.fonts && doc.fonts.ready) {
      await doc.fonts.ready;
    }
    await new Promise((resolve) => {
      requestAnimationFrame(() => requestAnimationFrame(resolve));
    });

    if (!window.html2pdf) {
      iframe.remove();
      openPrintWindow(data);
      return;
    }

    const btn = document.querySelector('[data-bio-download]');
    const prevLabel = btn ? btn.textContent : '';
    if (btn) {
      btn.disabled = true;
      btn.textContent = btn.dataset.loading || '…';
    }

    try {
      await window
        .html2pdf()
        .set({
          margin: [14, 14, 16, 14],
          filename: data.pdfFilename,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: {
            scale: 2,
            useCORS: true,
            letterRendering: true,
            scrollX: 0,
            scrollY: 0,
            logging: false,
          },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
          pagebreak: { mode: ['avoid-all', 'css'], avoid: ['.bio-pdf__text', '.bio-pdf-agency'] },
        })
        .from(sheet)
        .save();
    } catch (err) {
      iframe.remove();
      openPrintWindow(data);
    } finally {
      iframe.remove();
      if (btn) {
        btn.disabled = false;
        btn.textContent = prevLabel;
      }
    }
  }

  function initBioPdf() {
    const root = document.querySelector('[data-biography]');
    if (!root || !window.BIOGRAPHY_DATA) return;

    const lang = root.dataset.lang || (document.documentElement.lang || 'fr').slice(0, 2);
    const data = window.BIOGRAPHY_DATA[lang] || window.BIOGRAPHY_DATA.fr;
    const btn = root.querySelector('[data-bio-download]');
    if (!btn) return;

    btn.textContent = data.downloadPdf;
    btn.dataset.loading = lang === 'en' ? 'Generating…' : 'Génération…';
    btn.addEventListener('click', () => downloadBioPdf(data));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBioPdf);
  } else {
    initBioPdf();
  }
})();
