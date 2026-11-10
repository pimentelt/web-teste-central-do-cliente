const navItems = document.querySelectorAll('.nav-item');
const views = document.querySelectorAll('.page-view');
const crumb = document.querySelector('#crumb-current');
const toast = document.querySelector('#toast');
let toastTimer;

const previewVideo = document.querySelector('.video-player');
const videoEmptyState = document.querySelector('#video-empty-state');
previewVideo.addEventListener('loadeddata', () => { videoEmptyState.hidden = true; });
previewVideo.addEventListener('play', () => { videoEmptyState.hidden = true; });

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2600);
}

navItems.forEach((item) => item.addEventListener('click', () => {
  switchView(item.dataset.view, item.textContent.trim().replace(/\s+\d+$/, ''));
}));

function switchView(id, label = 'Visão geral') {
  const activeNavId = id === 'brand-kit' ? 'profile' : id;
  navItems.forEach((nav) => nav.classList.toggle('active', nav.dataset.view === activeNavId));
  views.forEach((view) => view.classList.toggle('active', view.id === id));
  crumb.textContent = label;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

const companyProfileLink = document.querySelector('#company-profile-link');
function navigateFromCompanyBreadcrumb() {
  const currentView = document.querySelector('.page-view.active')?.id;
  if (currentView === 'company-profile') switchView('overview', 'Visão geral');
  else switchView('company-profile', 'Perfil da empresa');
}
companyProfileLink.addEventListener('click', navigateFromCompanyBreadcrumb);
document.querySelector('.brand').addEventListener('click', (event) => {
  event.preventDefault();
  navigateFromCompanyBreadcrumb();
});

const companySettings = document.querySelector('#company-settings');
const companySettingsBackdrop = document.querySelector('#company-settings-backdrop');
const editCompanyButton = document.querySelector('#edit-company-button');
document.body.append(companySettingsBackdrop, companySettings);
const profileStorageKey = 'central-cliente-company-profile';
const defaultCompany = {
  name: 'Sua Empresa',
  summary: 'Uma apresentação da empresa para quem participa dos projetos na plataforma.',
  industry: 'Serviços e soluções',
  website: 'www.suaempresa.com.br',
  instagram: '@suaempresa',
  shareSummary: true,
  shareWebsite: true,
  shareInstagram: true,
};
let companyProfile = { ...defaultCompany };

try {
  const savedProfile = localStorage.getItem(profileStorageKey);
  if (savedProfile) companyProfile = { ...defaultCompany, ...JSON.parse(savedProfile) };
} catch (_) {
  // A página continua funcional quando o navegador restringe o armazenamento local.
}

function companyInitials(name) {
  return name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase() || 'SE';
}

function renderCompanyProfile() {
  const initials = companyInitials(companyProfile.name);
  companyProfileLink.textContent = companyProfile.name;
  document.querySelector('.brand strong').textContent = companyProfile.name;
  document.querySelector('.user-row strong').textContent = `Equipe ${companyProfile.name}`;
  document.querySelector('.account-menu-header strong').textContent = `Equipe ${companyProfile.name}`;
  document.querySelector('.account-menu-avatar').textContent = initials;
  document.querySelectorAll('.brand-mark,.avatar,.top-avatar,.profile-logo,.ig-logo').forEach((item) => { item.textContent = initials; });
  document.querySelector('#company-name-display').textContent = companyProfile.name;
  document.querySelector('#brand-kit-name').textContent = companyProfile.name;
  document.querySelectorAll('.logo-company-name').forEach((item) => { item.textContent = companyProfile.name; });
  document.querySelector('#company-summary-display').textContent = companyProfile.summary;
  document.querySelector('#company-summary-info').textContent = companyProfile.summary;
  document.querySelector('#company-industry-info').textContent = companyProfile.industry;
  document.querySelector('#company-website-info').textContent = companyProfile.website;
  document.querySelector('#company-instagram-info').textContent = companyProfile.instagram;
  document.querySelector('#profile .profile-summary h2').textContent = companyProfile.name;
  document.querySelector('#profile .profile-summary .profile-logo').textContent = initials;
  document.querySelector('#profile-instagram-display').textContent = companyProfile.instagram;
  companySettings.elements.name.value = companyProfile.name;
  companySettings.elements.summary.value = companyProfile.summary;
  companySettings.elements.industry.value = companyProfile.industry;
  companySettings.elements.website.value = companyProfile.website;
  companySettings.elements.instagram.value = companyProfile.instagram;
  companySettings.elements['share-summary'].checked = companyProfile.shareSummary;
  companySettings.elements['share-website'].checked = companyProfile.shareWebsite;
  companySettings.elements['share-instagram'].checked = companyProfile.shareInstagram;
  const sharedFields = [companyProfile.shareSummary, companyProfile.shareWebsite, companyProfile.shareInstagram];
  const anyShared = sharedFields.some(Boolean);
  const allShared = sharedFields.every(Boolean);
  document.querySelector('#company-audience-status').textContent = allShared ? 'Visível para a rede' : anyShared ? 'Visibilidade parcial' : 'Privado para equipe';
  document.querySelector('.audience-badge small').textContent = anyShared ? 'Editores e usuários autorizados' : 'Somente equipe da empresa';
  document.querySelector('#sharing-status').textContent = allShared ? 'Compartilhado com a rede' : anyShared ? 'Compartilhamento parcial' : 'Compartilhamento desativado';
  document.querySelector('.audience-badge').classList.toggle('audience-private', !anyShared);
  document.querySelector('.shared-note').classList.toggle('shared-note-private', !anyShared);
  document.querySelectorAll('.visibility-state').forEach((state) => {
    const isShared = companyProfile[state.dataset.visibility];
    state.textContent = isShared ? 'Visível para a rede' : 'Visível apenas para a equipe';
    state.classList.toggle('private-state', !isShared);
    state.closest('.company-info-item').classList.toggle('private-info', !isShared);
  });
}

function setCompanySettings(open) {
  if (open) renderCompanyProfile();
  companySettings.hidden = !open;
  companySettingsBackdrop.hidden = !open;
  editCompanyButton.setAttribute('aria-expanded', String(open));
  document.body.classList.toggle('settings-open', open);
  if (open) companySettings.elements.name.focus();
  else editCompanyButton.focus();
}

editCompanyButton.addEventListener('click', () => setCompanySettings(companySettings.hidden));
document.querySelector('#close-company-settings').addEventListener('click', () => setCompanySettings(false));
companySettingsBackdrop.addEventListener('click', () => setCompanySettings(false));
document.querySelector('#cancel-company-settings').addEventListener('click', () => {
  renderCompanyProfile();
  setCompanySettings(false);
});
companySettings.addEventListener('submit', (event) => {
  event.preventDefault();
  companyProfile = {
    name: companySettings.elements.name.value.trim() || defaultCompany.name,
    summary: companySettings.elements.summary.value.trim() || defaultCompany.summary,
    industry: companySettings.elements.industry.value.trim() || defaultCompany.industry,
    website: companySettings.elements.website.value.trim() || defaultCompany.website,
    instagram: companySettings.elements.instagram.value.trim() || defaultCompany.instagram,
    shareSummary: companySettings.elements['share-summary'].checked,
    shareWebsite: companySettings.elements['share-website'].checked,
    shareInstagram: companySettings.elements['share-instagram'].checked,
  };
  try { localStorage.setItem(profileStorageKey, JSON.stringify(companyProfile)); } catch (_) {}
  renderCompanyProfile();
  setCompanySettings(false);
  showToast('Perfil atualizado neste navegador.');
});
renderCompanyProfile();

document.querySelector('#brand-guide-open').addEventListener('click', () => switchView('brand-kit', 'Identidade da marca'));
document.querySelector('#brand-kit-open').addEventListener('click', () => switchView('brand-kit', 'Identidade da marca'));
document.querySelector('#brand-kit-back').addEventListener('click', () => switchView('profile', 'Perfil'));

const brandIdentityKey = 'central-cliente-brand-identity';
const brandIdentityDefaults = {
  colors: { primary: '#172B68', accent: '#F0643D', complementary: '#41B8CC', dark: '#111827', light: '#F5F7FA' },
  headingFont: 'Inter',
  bodyFont: 'DM Sans',
};
let brandIdentity = structuredClone(brandIdentityDefaults);
try {
  const savedBrandIdentity = JSON.parse(localStorage.getItem(brandIdentityKey) || 'null');
  if (savedBrandIdentity) brandIdentity = {
    ...brandIdentityDefaults,
    ...savedBrandIdentity,
    colors: { ...brandIdentityDefaults.colors, ...savedBrandIdentity.colors },
  };
} catch (_) {}

const colorNames = {
  primary: 'Principal',
  accent: 'Destaque',
  complementary: 'Complementar',
  dark: 'Fundo escuro',
  light: 'Fundo claro',
};
const colorPresets = [
  '#FFFFFF', '#F5F7FA', '#DCE2EA', '#AEB8C7', '#66758B', '#26364B', '#111827', '#000000',
  '#FCE4E4', '#F29AA0', '#E34E5D', '#A51F37', '#FFF0E2', '#F9B77D', '#F0643D', '#C74B25',
  '#FFF5C2', '#F3D35C', '#D7A520', '#9A6A12', '#E2F3E9', '#91D5AA', '#38A875', '#176443',
  '#DDF5F7', '#86D7E1', '#41B8CC', '#137E94', '#E3EAFE', '#8DA8ED', '#3153A0', '#172B68',
  '#F0E8FA', '#C7A4E8', '#8453B3', '#582F78',
];
const brandSwatches = document.querySelector('.brand-swatches');
brandSwatches.innerHTML = Object.entries(colorNames).map(([key, label]) => `
  <article class="brand-swatch editable-swatch" data-brand-color="${key}">
    <span class="swatch-color"></span><div class="brand-swatch-content"><strong>${label}</strong>
      <div class="color-editors">
        <button type="button" class="color-picker-trigger" aria-haspopup="dialog" aria-expanded="false" aria-label="Escolher ${label.toLocaleLowerCase('pt-BR')}">
          <span class="color-picker-preview"></span><span>Escolher cor</span>
          <svg viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg>
        </button>
        <code class="color-code-display" id="brand-color-${key}"></code>
      </div>
    </div>
    <div class="color-picker-popover" role="dialog" aria-label="Escolher ${label.toLocaleLowerCase('pt-BR')}" hidden>
      <div class="color-popover-heading">
        <span class="color-popover-preview"></span>
        <div><strong>Escolha uma cor</strong><small>${label}</small></div>
        <button type="button" class="color-popover-close" aria-label="Fechar seletor">×</button>
      </div>
      <label class="color-code-label" for="brand-color-${key}-hex">Código HEX</label>
      <input class="color-popover-code" id="brand-color-${key}-hex" value="${brandIdentity.colors[key]}" maxlength="7" spellcheck="false" autocomplete="off">
      <div class="color-preset-grid" aria-label="Cores sugeridas">
        ${colorPresets.map((color) => `<button type="button" class="color-preset" data-color="${color}" style="--preset-color:${color}" aria-label="${color}" title="${color}"></button>`).join('')}
      </div>
      <div class="color-picker-actions">
        <button type="button" class="color-picker-cancel">Cancelar</button>
        <button type="button" class="color-picker-apply">Aplicar cor</button>
      </div>
    </div>
  </article>`).join('');
brandSwatches.insertAdjacentHTML('afterend', '<small class="brand-save-hint">Alterações salvas neste navegador.</small>');

const typeSamples = document.querySelector('.type-samples');
typeSamples.insertAdjacentHTML('beforebegin', `<div class="font-controls">
  <div class="font-field">
    <label for="brand-heading-font">Títulos</label>
    <div class="font-input-shell">
      <input id="brand-heading-font" autocomplete="off" placeholder="Digite uma fonte">
      <button type="button" class="font-picker" aria-label="Escolher fonte para títulos" aria-expanded="false">
        <svg viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg>
      </button>
    </div>
    <div class="font-options" hidden>
      <button type="button">Inter</button><button type="button">DM Sans</button>
      <button type="button">Arial</button><button type="button">Segoe UI</button>
      <button type="button">Georgia</button><button type="button">Verdana</button>
      <button type="button">system-ui</button>
    </div>
  </div>
  <div class="font-field">
    <label for="brand-body-font">Textos</label>
    <div class="font-input-shell">
      <input id="brand-body-font" autocomplete="off" placeholder="Digite uma fonte">
      <button type="button" class="font-picker" aria-label="Escolher fonte para textos" aria-expanded="false">
        <svg viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg>
      </button>
    </div>
    <div class="font-options" hidden>
      <button type="button">Inter</button><button type="button">DM Sans</button>
      <button type="button">Arial</button><button type="button">Segoe UI</button>
      <button type="button">Georgia</button><button type="button">Verdana</button>
      <button type="button">system-ui</button>
    </div>
  </div>
</div>`);
typeSamples.querySelector('article:first-child>small').id = 'brand-heading-sample-label';
typeSamples.querySelector('article:first-child>strong').id = 'brand-heading-sample';
typeSamples.querySelector('article:last-child>small').id = 'brand-body-sample-label';
typeSamples.querySelector('article:last-child>p').id = 'brand-body-sample';

const assetGroups = [
  { key: 'logo-light', label: 'Fundo claro', hint: 'Logo para aplicações claras', accept: 'image/png,image/jpeg,image/webp,image/svg+xml' },
  { key: 'logo-dark', label: 'Fundo escuro', hint: 'Logo para aplicações escuras', accept: 'image/png,image/jpeg,image/webp,image/svg+xml' },
  { key: 'logo-mono', label: 'Monocromático', hint: 'Versão de uma só cor', accept: 'image/png,image/jpeg,image/webp,image/svg+xml' },
  { key: 'image-environment', label: 'Ambiente', hint: 'Locais e contexto', accept: 'image/png,image/jpeg,image/webp' },
  { key: 'image-product', label: 'Produto', hint: 'Detalhes e aplicações', accept: 'image/png,image/jpeg,image/webp' },
  { key: 'image-people', label: 'Pessoas', hint: 'Equipe e bastidores', accept: 'image/png,image/jpeg,image/webp' },
  { key: 'image-other', label: 'Outras referências', hint: 'Imagens adicionais', accept: 'image/png,image/jpeg,image/webp' },
];
function folderMarkup(group) {
  return `
    <article class="asset-folder">
      <div class="asset-folder-head">
        <span class="folder-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24"><path d="M3 7a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/></svg>
        </span>
        <div><strong>${group.label}</strong><small>${group.hint}</small></div>
        <label class="upload-button">
          Enviar
          <input class="brand-asset-input" type="file" data-folder="${group.key}" accept="${group.accept}" multiple>
        </label>
      </div>
      <div class="uploaded-assets" id="assets-${group.key}">
        <p class="empty-folder">Nenhum arquivo nesta pasta.</p>
      </div>
    </article>`;
}
document.querySelector('.logo-variants').outerHTML = `<div class="asset-folder-grid logo-folder-grid">${assetGroups.slice(0, 3).map(folderMarkup).join('')}</div>`;
document.querySelector('.image-reference-grid').insertAdjacentHTML('afterend', `<div class="asset-folder-grid image-folder-grid">${assetGroups.slice(3).map(folderMarkup).join('')}</div>`);
document.querySelector('.reference-note').textContent = 'Arquivos ficam organizados neste navegador.';

function saveBrandIdentity() {
  try { localStorage.setItem(brandIdentityKey, JSON.stringify(brandIdentity)); } catch (_) {}
}

function applyBrandIdentity() {
  const root = document.documentElement;
  Object.entries(brandIdentity.colors).forEach(([key, value]) => {
    root.style.setProperty(`--brand-${key}`, value);
    const row = document.querySelector(`[data-brand-color="${key}"]`);
    if (row) {
      row.querySelector('.swatch-color').style.backgroundColor = value;
      row.querySelector('.color-picker-preview').style.backgroundColor = value;
      row.querySelector('.color-code-display').textContent = value.toUpperCase();
      const codeField = row.querySelector('.color-popover-code');
      if (codeField && row !== activeColorPopover?.closest('.editable-swatch')) codeField.value = value.toUpperCase();
    }
  });
  brandIdentity.headingFont = brandIdentity.headingFont || 'Inter';
  brandIdentity.bodyFont = brandIdentity.bodyFont || 'DM Sans';
  root.style.setProperty('--brand-heading-font', brandIdentity.headingFont);
  root.style.setProperty('--brand-body-font', brandIdentity.bodyFont);
  document.querySelector('#brand-heading-font').value = brandIdentity.headingFont;
  document.querySelector('#brand-body-font').value = brandIdentity.bodyFont;
  const titleLabel = `TÍTULO · ${brandIdentity.headingFont.toLocaleUpperCase('pt-BR')} SEMIBOLD`;
  const bodyLabel = `TEXTO · ${brandIdentity.bodyFont.toLocaleUpperCase('pt-BR')} REGULAR`;
  document.querySelector('#brand-heading-sample-label').textContent = titleLabel;
  document.querySelector('#brand-body-sample-label').textContent = bodyLabel;
  document.querySelector('#brand-heading-sample').style.fontFamily = brandIdentity.headingFont;
  document.querySelector('#brand-body-sample').style.fontFamily = brandIdentity.bodyFont;
}

let activeColorPopover = null;
let activeColorTrigger = null;
function closeColorPopover() {
  if (!activeColorPopover) return;
  activeColorPopover.hidden = true;
  activeColorTrigger?.setAttribute('aria-expanded', 'false');
  activeColorPopover = null;
  activeColorTrigger = null;
}
function setColorDraft(popover, value) {
  const code = popover.querySelector('.color-popover-code');
  const valid = /^#[\da-f]{6}$/i.test(value);
  if (valid) code.removeAttribute('aria-invalid');
  else code.setAttribute('aria-invalid', 'true');
  popover.querySelector('.color-picker-apply').disabled = !valid;
  if (!valid) return;
  const normalized = value.toUpperCase();
  popover.querySelector('.color-popover-preview').style.backgroundColor = normalized;
  popover.querySelectorAll('.color-preset').forEach((chip) => chip.classList.toggle('selected', chip.dataset.color === normalized));
}
document.querySelectorAll('.color-picker-trigger').forEach((trigger) => trigger.addEventListener('click', () => {
  if (activeColorTrigger === trigger) { closeColorPopover(); return; }
  closeColorPopover();
  const row = trigger.closest('.editable-swatch');
  const popover = row.querySelector('.color-picker-popover');
  const value = brandIdentity.colors[row.dataset.brandColor];
  popover.querySelector('.color-popover-code').value = value;
  setColorDraft(popover, value);
  popover.hidden = false;
  trigger.setAttribute('aria-expanded', 'true');
  activeColorPopover = popover;
  activeColorTrigger = trigger;
}));
document.querySelectorAll('.color-picker-popover').forEach((popover) => {
  popover.querySelectorAll('.color-preset').forEach((chip) => chip.addEventListener('click', () => {
    popover.querySelector('.color-popover-code').value = chip.dataset.color;
    setColorDraft(popover, chip.dataset.color);
  }));
  popover.querySelector('.color-popover-code').addEventListener('input', (event) => setColorDraft(popover, event.currentTarget.value.trim()));
  popover.querySelector('.color-picker-cancel').addEventListener('click', closeColorPopover);
  popover.querySelector('.color-popover-close').addEventListener('click', closeColorPopover);
  popover.querySelector('.color-picker-apply').addEventListener('click', () => {
    const row = popover.closest('.editable-swatch');
    const key = row.dataset.brandColor;
    const value = popover.querySelector('.color-popover-code').value.trim().toUpperCase();
    if (!/^#[\da-f]{6}$/i.test(value)) return;
    brandIdentity.colors[key] = value;
    applyBrandIdentity();
    saveBrandIdentity();
    if (userTheme === 'brand') applyUserTheme('brand');
    closeColorPopover();
  });
});
document.addEventListener('click', (event) => {
  if (activeColorPopover && !event.target.closest('.editable-swatch')) closeColorPopover();
});
['headingFont', 'bodyFont'].forEach((key) => {
  const input = document.querySelector(key === 'headingFont' ? '#brand-heading-font' : '#brand-body-font');
  input.addEventListener('change', () => {
    const value = input.value.trim();
    if (!value) return;
    brandIdentity[key] = value;
    applyBrandIdentity();
    saveBrandIdentity();
  });
});
document.querySelectorAll('.font-picker').forEach((picker) => picker.addEventListener('click', () => {
  const field = picker.closest('.font-field');
  const options = field.querySelector('.font-options');
  const open = options.hidden;
  document.querySelectorAll('.font-options').forEach((menu) => { menu.hidden = true; });
  document.querySelectorAll('.font-picker').forEach((button) => button.setAttribute('aria-expanded', 'false'));
  options.hidden = !open;
  picker.setAttribute('aria-expanded', String(open));
}));
document.querySelectorAll('.font-options button').forEach((option) => option.addEventListener('click', () => {
  const field = option.closest('.font-field');
  const input = field.querySelector('input');
  input.value = option.textContent;
  input.dispatchEvent(new Event('change', { bubbles: true }));
  field.querySelector('.font-options').hidden = true;
  field.querySelector('.font-picker').setAttribute('aria-expanded', 'false');
}));
document.addEventListener('click', (event) => {
  if (!event.target.closest('.font-field')) {
    document.querySelectorAll('.font-options').forEach((menu) => { menu.hidden = true; });
    document.querySelectorAll('.font-picker').forEach((button) => button.setAttribute('aria-expanded', 'false'));
  }
});
applyBrandIdentity();

const brandAssetMemory = new Map();
let brandAssetDatabase;
function openBrandAssetDatabase() {
  if (brandAssetDatabase) return brandAssetDatabase;
  brandAssetDatabase = new Promise((resolve, reject) => {
    if (!window.indexedDB) { reject(new Error('Armazenamento local indisponível')); return; }
    const request = window.indexedDB.open('central-cliente-brand-library', 1);
    request.onupgradeneeded = () => request.result.createObjectStore('assets', { keyPath: 'id' });
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
  return brandAssetDatabase;
}
async function readBrandAssets() {
  try {
    const db = await openBrandAssetDatabase();
    const records = await new Promise((resolve, reject) => {
      const request = db.transaction('assets', 'readonly').objectStore('assets').getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    records.forEach((asset) => brandAssetMemory.set(asset.id, asset));
  } catch (_) {}
  renderBrandAssets();
}
function renderBrandAssets() {
  assetGroups.forEach((group) => {
    const target = document.querySelector(`#assets-${group.key}`);
    if (!target) return;
    target.replaceChildren();
    const assets = [...brandAssetMemory.values()].filter((asset) => asset.folder === group.key);
    if (!assets.length) {
      const empty = document.createElement('p');
      empty.className = 'empty-folder';
      empty.textContent = 'Nenhum arquivo nesta pasta.';
      target.append(empty);
      return;
    }
    assets.forEach((asset) => {
      const card = document.createElement('article');
      card.className = 'uploaded-asset';
      const image = document.createElement('img');
      image.alt = asset.name;
      image.src = URL.createObjectURL(asset.file);
      const name = document.createElement('span');
      name.textContent = asset.name;
      const remove = document.createElement('button');
      remove.type = 'button';
      remove.className = 'remove-asset';
      remove.setAttribute('aria-label', `Remover ${asset.name}`);
      remove.textContent = '×';
      remove.addEventListener('click', async () => {
        brandAssetMemory.delete(asset.id);
        try {
          const db = await openBrandAssetDatabase();
          db.transaction('assets', 'readwrite').objectStore('assets').delete(asset.id);
        } catch (_) {}
        renderBrandAssets();
      });
      card.append(image, name, remove);
      target.append(card);
    });
  });
}
document.querySelectorAll('.brand-asset-input').forEach((input) => input.addEventListener('change', async () => {
  for (const file of input.files || []) {
    const asset = { id: `${input.dataset.folder}-${Date.now()}-${Math.random().toString(36).slice(2)}`, folder: input.dataset.folder, name: file.name, file };
    brandAssetMemory.set(asset.id, asset);
    try {
      const db = await openBrandAssetDatabase();
      await new Promise((resolve, reject) => {
        const request = db.transaction('assets', 'readwrite').objectStore('assets').put(asset);
        request.onsuccess = resolve;
        request.onerror = () => reject(request.error);
      });
    } catch (_) {
      showToast('Arquivo carregado nesta sessão do navegador.');
    }
  }
  input.value = '';
  renderBrandAssets();
}));
readBrandAssets();

const userSettingsModal = document.querySelector('#user-settings-modal');
const userSettingsBackdrop = document.querySelector('#user-settings-backdrop');
const userSettingsForm = document.querySelector('#user-settings-form');
const accountMenu = document.querySelector('#account-menu');
const accountMenuTriggers = document.querySelectorAll('.user-settings-trigger');
const userThemeKey = 'central-cliente-user-theme';
let userTheme = 'system';
let lastUserSettingsTrigger = null;
let lastAccountMenuTrigger = null;
try { userTheme = localStorage.getItem(userThemeKey) || 'system'; } catch (_) {}

function colorLuminance(hex) {
  const match = /^#([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i.exec(hex || '');
  if (!match) return 1;
  const channels = match.slice(1).map((part) => {
    const value = parseInt(part, 16) / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
}

function applyUserTheme(theme) {
  const root = document.documentElement;
  root.removeAttribute('data-brand-theme');
  ['--navy', '--orange', '--aqua'].forEach((property) => root.style.removeProperty(property));
  if (theme === 'brand') {
    const brandNeedsDarkMode = colorLuminance(brandIdentity.colors.light) < 0.42;
    if (brandNeedsDarkMode) {
      root.dataset.theme = 'dark';
      root.dataset.brandTheme = 'true';
      root.style.setProperty('--navy', `color-mix(in srgb, ${brandIdentity.colors.primary}, white 38%)`);
      root.style.setProperty('--orange', `color-mix(in srgb, ${brandIdentity.colors.accent}, white 16%)`);
      root.style.setProperty('--aqua', brandIdentity.colors.complementary);
    } else {
      root.dataset.theme = 'brand';
    }
    return;
  }
  const resolvedTheme = theme === 'system'
    ? (window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    : theme;
  root.dataset.theme = resolvedTheme;
}

function openUserSettings(trigger = lastAccountMenuTrigger) {
  lastUserSettingsTrigger = trigger;
  userSettingsForm.elements.theme.value = userTheme;
  userSettingsBackdrop.hidden = false;
  userSettingsModal.hidden = false;
  document.body.classList.add('user-settings-open');
  userSettingsModal.querySelector('.theme-choice input:checked')?.focus();
}

function closeAccountMenu(restoreFocus = false) {
  accountMenu.hidden = true;
  accountMenuTriggers.forEach((button) => button.setAttribute('aria-expanded', 'false'));
  if (restoreFocus) lastAccountMenuTrigger?.focus();
}

function openAccountMenu(trigger) {
  if (!accountMenu.hidden && lastAccountMenuTrigger === trigger) {
    closeAccountMenu();
    return;
  }
  closeAccountMenu();
  lastAccountMenuTrigger = trigger;
  const bounds = trigger.getBoundingClientRect();
  accountMenu.hidden = false;
  const menuBounds = accountMenu.getBoundingClientRect();
  const left = Math.max(12, Math.min(bounds.right - menuBounds.width, window.innerWidth - menuBounds.width - 12));
  const top = bounds.bottom + menuBounds.height + 12 <= window.innerHeight
    ? bounds.bottom + 8
    : Math.max(12, bounds.top - menuBounds.height - 8);
  accountMenu.style.left = `${left}px`;
  accountMenu.style.top = `${top}px`;
  accountMenuTriggers.forEach((button) => button.setAttribute('aria-expanded', String(button === trigger)));
  accountMenu.querySelector('#account-menu-account').focus();
  const themeNames = { system: 'Padrão do sistema', light: 'Claro', dark: 'Escuro', brand: 'Padrão da marca' };
  document.querySelector('#account-theme-current').textContent = themeNames[userTheme] || themeNames.system;
}

function closeUserSettings() {
  userSettingsBackdrop.hidden = true;
  userSettingsModal.hidden = true;
  document.body.classList.remove('user-settings-open');
  lastUserSettingsTrigger?.focus();
}

accountMenuTriggers.forEach((button) => button.addEventListener('click', () => openAccountMenu(button)));
document.querySelector('#account-menu-account').addEventListener('click', () => {
  closeAccountMenu();
  switchView('company-profile', 'Perfil da empresa');
});
document.querySelector('#account-menu-settings').addEventListener('click', () => {
  closeAccountMenu();
  setCompanySettings(true);
});
document.querySelector('#account-menu-theme').addEventListener('click', () => {
  const trigger = lastAccountMenuTrigger;
  closeAccountMenu();
  openUserSettings(trigger);
});
document.querySelector('#account-menu-logout').addEventListener('click', () => {
  closeAccountMenu();
  showToast('A opção de sair fica disponível na versão conectada.');
});
document.addEventListener('click', (event) => {
  if (!event.target.closest('#account-menu') && !event.target.closest('.user-settings-trigger')) closeAccountMenu();
});
document.querySelector('#user-settings-close').addEventListener('click', closeUserSettings);
document.querySelector('#user-settings-cancel').addEventListener('click', closeUserSettings);
userSettingsBackdrop.addEventListener('click', closeUserSettings);
const notificationsButton = document.querySelector('#notifications-button');
const notificationsPanel = document.querySelector('#notifications-panel');
const notificationCount = document.querySelector('#notification-count');
function setNotificationsOpen(open) {
  notificationsPanel.hidden = !open;
  notificationsButton.setAttribute('aria-expanded', String(open));
}
function markNotificationsRead() {
  document.querySelectorAll('.notification-item.unread').forEach((item) => item.classList.remove('unread'));
  notificationCount.hidden = true;
}
notificationsButton.addEventListener('click', () => setNotificationsOpen(notificationsPanel.hidden));
document.querySelector('#notifications-mark-read').addEventListener('click', markNotificationsRead);
document.querySelector('#notifications-view-all').addEventListener('click', () => {
  markNotificationsRead();
  setNotificationsOpen(false);
  showToast('Você está em dia com as atualizações.');
});
document.addEventListener('click', (event) => {
  if (!event.target.closest('.notification-wrap')) setNotificationsOpen(false);
});
userSettingsForm.addEventListener('submit', (event) => {
  event.preventDefault();
  userTheme = userSettingsForm.elements.theme.value;
  applyUserTheme(userTheme);
  try { localStorage.setItem(userThemeKey, userTheme); } catch (_) {}
  const themeNames = { system: 'Padrão do sistema', light: 'Claro', dark: 'Escuro', brand: 'Padrão da marca' };
  document.querySelector('#account-theme-current').textContent = themeNames[userTheme] || themeNames.system;
  closeUserSettings();
  showToast('Tema atualizado.');
});
applyUserTheme(userTheme);
const systemThemePreference = window.matchMedia?.('(prefers-color-scheme: dark)');
systemThemePreference?.addEventListener?.('change', () => {
  if (userTheme === 'system') applyUserTheme('system');
});

document.querySelectorAll('.feedback-tab').forEach((tab) => tab.addEventListener('click', () => {
  const general = tab.dataset.tab === 'general';
  document.querySelectorAll('.feedback-tab').forEach((item) => item.classList.toggle('selected', item === tab));
  document.querySelector('#points-list').classList.toggle('hidden', general);
  document.querySelector('#general-list').classList.toggle('hidden', !general);
}));

document.querySelectorAll('.time-chip').forEach((button) => button.addEventListener('click', () => {
  document.querySelector('#current-time').textContent = button.dataset.time;
  document.querySelector('#comment-input').focus();
}));

document.querySelectorAll('.new-comment').forEach((form) => form.addEventListener('submit', (event) => {
  event.preventDefault();
  const field = form.querySelector('textarea');
  const value = field.value.trim();
  if (!value) {
    field.focus();
    return;
  }
  const card = document.createElement('article');
  card.className = 'comment-card';
  const time = form.classList.contains('general-form') ? 'Geral' : document.querySelector('#current-time').textContent;
  card.innerHTML = `<div class="comment-top"><span class="time-chip">${time}</span><span class="comment-state open"><i></i> Enviado agora</span></div><p></p><small>Você <span>·</span> agora</small>`;
  card.querySelector('p').textContent = value;
  form.before(card);
  field.value = '';
  showToast('Comentário adicionado à prévia.');
}));

document.querySelector('.approve-button').addEventListener('click', () => showToast('Vídeo aprovado nesta prévia.'));
document.querySelector('.adjust-button').addEventListener('click', () => {
  document.querySelector('#comment-input').focus();
  showToast('Escreva um comentário para solicitar o ajuste.');
});
const periodButton = document.querySelector('#period-button');
const periodMenu = document.querySelector('#period-menu');
const periodLabel = document.querySelector('.period-label');

periodButton.addEventListener('click', () => {
  const isOpen = periodButton.getAttribute('aria-expanded') === 'true';
  periodButton.setAttribute('aria-expanded', String(!isOpen));
  periodMenu.hidden = isOpen;
});

document.querySelectorAll('.period-option').forEach((option) => option.addEventListener('click', () => {
  periodLabel.textContent = option.dataset.month;
  document.querySelectorAll('.period-option').forEach((item) => {
    const selected = item === option;
    item.classList.toggle('selected', selected);
    item.setAttribute('aria-selected', String(selected));
  });
  periodMenu.hidden = true;
  periodButton.setAttribute('aria-expanded', 'false');
  showToast(`${option.dataset.project} · ${option.dataset.month}`);
}));

document.addEventListener('click', (event) => {
  if (!event.target.closest('.period-picker')) {
    periodMenu.hidden = true;
    periodButton.setAttribute('aria-expanded', 'false');
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && activeColorPopover) {
    closeColorPopover();
    return;
  }
  if (event.key === 'Escape' && !accountMenu.hidden) {
    closeAccountMenu(true);
    return;
  }
  if (event.key === 'Escape' && !notificationsPanel.hidden) {
    setNotificationsOpen(false);
    notificationsButton.focus();
    return;
  }
  if (event.key === 'Escape' && !userSettingsModal.hidden) {
    closeUserSettings();
    return;
  }
  if (event.key === 'Escape' && !calendarModal.hidden) {
    if (!calendarEventDetail.hidden) {
      calendarEventDetail.hidden = true;
      return;
    }
    closeCalendar();
    return;
  }
  if (event.key === 'Escape' && !companySettings.hidden) {
    setCompanySettings(false);
    return;
  }
  if (event.key === 'Escape' && !periodMenu.hidden) {
    periodMenu.hidden = true;
    periodButton.setAttribute('aria-expanded', 'false');
    periodButton.focus();
  }
});

const calendarModal = document.querySelector('#calendar-modal');
const calendarBackdrop = document.querySelector('#calendar-backdrop');
const calendarGrid = document.querySelector('#calendar-grid');
const calendarMonthTitle = document.querySelector('#calendar-month-title');
const calendarOpenButton = document.querySelector('#content-calendar-open');
const calendarEventDetail = document.querySelector('#calendar-event-detail');
let visibleCalendarMonth = new Date(2026, 11, 1);
const contentCalendarEvents = {
  '2026-12-03': [{
    title: 'Briefing finalizado',
    type: 'production',
    time: '16h',
    project: 'Campanha de exemplo',
    status: 'Concluído',
    description: 'Briefing revisado com a equipe. Conceito, referências e entregas do mês definidos.',
  }],
  '2026-12-08': [{
    title: 'Roteiro · Campanha de exemplo',
    type: 'production',
    time: '10h',
    project: 'Campanha de exemplo',
    status: 'Em produção',
    description: 'A equipe está preparando o roteiro dos vídeos da campanha para sua revisão.',
  }],
  '2026-12-12': [{
    title: 'Gravação do vídeo 01',
    type: 'production',
    time: '9h30',
    project: 'Campanha de exemplo',
    status: 'Agendado',
    description: 'Gravação do primeiro vídeo com base no roteiro aprovado.',
  }],
  '2026-12-18': [{
    title: 'Entrega para aprovação',
    type: 'approval',
    time: 'Até 18h',
    project: 'Campanha de exemplo',
    status: 'Aguardando envio',
    description: 'Previsão de entrega da primeira versão para comentários e aprovação.',
  }],
  '2026-12-22': [{
    title: 'Revisão com a equipe',
    type: 'approval',
    time: '14h',
    project: 'Campanha de exemplo',
    status: 'Programado',
    description: 'Reunião para revisar os ajustes solicitados e alinhar os próximos passos.',
  }],
  '2027-01-05': [{
    title: 'Publicação · Vídeo 01',
    type: 'publication',
    time: '12h',
    project: 'Campanha de exemplo',
    status: 'Programado',
    description: 'Publicação do primeiro conteúdo aprovado nos canais da campanha.',
  }],
  '2027-01-12': [{
    title: 'Vídeo 02 · Conteúdo de marca',
    type: 'production',
    time: '10h',
    project: 'Conteúdo de marca',
    status: 'Em produção',
    description: 'Captação e edição do segundo vídeo para a sequência de conteúdo da marca.',
  }],
  '2027-01-19': [{
    title: 'Aprovação dos cortes',
    type: 'approval',
    time: 'Até 17h',
    project: 'Conteúdo de marca',
    status: 'Aguardando aprovação',
    description: 'Prazo para revisar os cortes, deixar comentários e aprovar a versão final.',
  }],
  '2027-01-26': [{
    title: 'Entrega dos arquivos finais',
    type: 'production',
    time: 'Até 18h',
    project: 'Conteúdo de marca',
    status: 'Programado',
    description: 'Entrega dos arquivos finais aprovados, organizados para publicação.',
  }],
};

function calendarDateKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function renderContentCalendar() {
  calendarEventDetail.hidden = true;
  const year = visibleCalendarMonth.getFullYear();
  const month = visibleCalendarMonth.getMonth();
  const monthLabel = new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' }).format(visibleCalendarMonth);
  calendarMonthTitle.textContent = monthLabel.charAt(0).toLocaleUpperCase('pt-BR') + monthLabel.slice(1);
  calendarGrid.replaceChildren();

  const firstOfMonth = new Date(year, month, 1);
  const mondayOffset = (firstOfMonth.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const dayCount = Math.ceil((mondayOffset + daysInMonth) / 7) * 7;
  const todayKey = calendarDateKey(new Date());

  for (let index = 0; index < dayCount; index += 1) {
    const date = new Date(year, month, 1 - mondayOffset + index);
    const dateKey = calendarDateKey(date);
    const cell = document.createElement('div');
    cell.className = 'calendar-day';
    cell.setAttribute('role', 'gridcell');
    cell.setAttribute('aria-label', new Intl.DateTimeFormat('pt-BR', { dateStyle: 'full' }).format(date));
    if (date.getMonth() !== month) cell.classList.add('outside-month');
    if (dateKey === todayKey) cell.classList.add('today-cell');

    const dayNumber = document.createElement('span');
    dayNumber.className = 'calendar-day-number';
    dayNumber.textContent = String(date.getDate());
    cell.append(dayNumber);

    (contentCalendarEvents[dateKey] || []).forEach((item) => {
      const eventButton = document.createElement('button');
      eventButton.type = 'button';
      eventButton.className = `calendar-event ${item.type}`;
      eventButton.textContent = item.title;
      eventButton.title = item.title;
      eventButton.addEventListener('click', () => {
        const typeLabels = { production: 'PRODUÇÃO', approval: 'APROVAÇÃO', publication: 'PUBLICAÇÃO' };
        const fullDate = new Intl.DateTimeFormat('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(date);
        document.querySelector('#calendar-detail-type').textContent = typeLabels[item.type] || 'EVENTO';
        document.querySelector('#calendar-detail-title').textContent = item.title;
        document.querySelector('#calendar-detail-description').textContent = item.description;
        document.querySelector('#calendar-detail-date').textContent = fullDate.charAt(0).toLocaleUpperCase('pt-BR') + fullDate.slice(1);
        document.querySelector('#calendar-detail-time').textContent = item.time;
        document.querySelector('#calendar-detail-project').textContent = item.project;
        document.querySelector('#calendar-detail-status').textContent = item.status;
        calendarEventDetail.hidden = false;
        calendarEventDetail.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      });
      cell.append(eventButton);
    });
    calendarGrid.append(cell);
  }
}

function openCalendar() {
  renderContentCalendar();
  calendarBackdrop.hidden = false;
  calendarModal.hidden = false;
  document.body.classList.add('calendar-open');
  document.querySelector('#calendar-close').focus();
}

function closeCalendar() {
  calendarBackdrop.hidden = true;
  calendarModal.hidden = true;
  document.body.classList.remove('calendar-open');
  calendarOpenButton.focus();
}

calendarOpenButton.addEventListener('click', openCalendar);
calendarBackdrop.addEventListener('click', closeCalendar);
document.querySelector('#calendar-close').addEventListener('click', closeCalendar);
document.querySelector('#calendar-detail-close').addEventListener('click', () => { calendarEventDetail.hidden = true; });
document.querySelector('#calendar-prev').addEventListener('click', () => {
  visibleCalendarMonth = new Date(visibleCalendarMonth.getFullYear(), visibleCalendarMonth.getMonth() - 1, 1);
  renderContentCalendar();
});
document.querySelector('#calendar-next').addEventListener('click', () => {
  visibleCalendarMonth = new Date(visibleCalendarMonth.getFullYear(), visibleCalendarMonth.getMonth() + 1, 1);
  renderContentCalendar();
});
document.querySelector('#calendar-today').addEventListener('click', () => {
  const today = new Date();
  visibleCalendarMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  renderContentCalendar();
});

document.querySelectorAll('.resolve-button').forEach((button) => button.addEventListener('click', () => showToast('Resposta registrada nesta prévia.')));
document.querySelectorAll('.extra-card button:not(#content-calendar-open):not(#brand-kit-open)')
  .forEach((button) => button.addEventListener('click', () => showToast('Material disponível nesta prévia local.')));
document.querySelectorAll('.campaign-card,.hero-side').forEach((card) => card.addEventListener('click', () => {
  switchView('approvals', 'Aprovações');
}));
