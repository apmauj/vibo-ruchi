import * as QRCode from './vendor/qrcode.min.js';

function currentShareUrl() {
  try {
    return new URL(window.parent.location.href).href;
  } catch {
    return window.location.href;
  }
}

export class ShareModal {
  constructor(root) {
    this.root = root;
    this.lastFocus = null;
    this.generatedUrl = null;
    this._build();
    this._bind();
  }

  _build() {
    const overlay = document.createElement('div');
    overlay.className = 'screen share-screen';
    overlay.id = 'share-screen';
    overlay.hidden = true;
    overlay.innerHTML = `
      <section class="menu-card share-modal" role="dialog" aria-modal="true" aria-labelledby="share-title" aria-describedby="share-description">
        <header class="share-modal-header">
          <div><span class="share-kicker">COMPARTIR</span><h2 id="share-title">¡Compartí el juego con tus amigos!</h2></div>
          <button class="modal-close" type="button" aria-label="Cerrar">×</button>
        </header>
        <div class="share-content">
          <p id="share-description">Escaneá este código desde otro dispositivo para abrir el juego.</p>
          <div class="share-qr-frame"><canvas aria-label="Código QR con el enlace del juego"></canvas></div>
          <p class="share-url"></p>
          <p class="share-error" role="status" hidden>No pudimos generar el código QR. Volvé a intentarlo.</p>
        </div>
      </section>`;
    this.root.appendChild(overlay);
    this.el = {
      overlay,
      dialog: overlay.querySelector('.share-modal'),
      close: overlay.querySelector('.modal-close'),
      canvas: overlay.querySelector('canvas'),
      url: overlay.querySelector('.share-url'),
      error: overlay.querySelector('.share-error'),
    };
  }

  _bind() {
    this.el.close.onclick = () => this.close();
    this.el.overlay.addEventListener('mousedown', event => { if (event.target === this.el.overlay) this.close(); });
    this.el.overlay.addEventListener('keydown', event => {
      if (event.key === 'Escape') { event.preventDefault(); this.close(); return; }
      if (event.key === 'Tab') { event.preventDefault(); this.el.close.focus(); }
    });
  }

  async open() {
    this.lastFocus = document.activeElement;
    this.backgroundElements = [...this.root.children].filter(element => element !== this.el.overlay);
    this.backgroundElements.forEach(element => { element.inert = true; });
    this.el.overlay.hidden = false;
    this.el.close.focus();

    const url = currentShareUrl();
    this.el.url.textContent = url;
    this.el.error.hidden = true;
    if (url === this.generatedUrl) return;

    try {
      await QRCode.toCanvas(this.el.canvas, url, {
        width: 240,
        margin: 2,
        errorCorrectionLevel: 'M',
        color: { dark: '#0a0618ff', light: '#ffffffff' },
      });
      this.generatedUrl = url;
    } catch {
      this.generatedUrl = null;
      this.el.error.hidden = false;
    }
  }

  close() {
    if (this.el.overlay.hidden) return;
    this.el.overlay.hidden = true;
    this.backgroundElements?.forEach(element => { element.inert = false; });
    this.lastFocus?.focus?.();
  }
}
