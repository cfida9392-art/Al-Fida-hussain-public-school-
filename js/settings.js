// ============================================================
// Settings Module - Logo & Profile Picture Support
// ============================================================

function getLogoSrc() {
  const s = getSettings();
  if (s.logo && (s.logo.startsWith('data:') || s.logo.startsWith('http') || s.logo.startsWith('blob:'))) {
    return s.logo;
  }
  return s.logo || 'assets/logo.png';
}

function getAdminProfileSrc() {
  const s = getSettings();
  if (s.adminProfilePhoto && s.adminProfilePhoto.startsWith('data:')) {
    return s.adminProfilePhoto;
  }
  return null;
}

function loadSettingsForm() {
  const s = getSettings();
  const fields = ['schoolName', 'tagline', 'whatsapp', 'phone', 'email', 'address', 'academicSession'];
  fields.forEach(f => {
    const el = document.getElementById('setting-' + f);
    if (el) el.value = s[f] || '';
  });

  const logoPreview = document.getElementById('setting-logo-preview');
  if (logoPreview) {
    logoPreview.src = getLogoSrc();
    logoPreview.onerror = function () { this.src = 'assets/logo.png'; };
  }

  const profilePreview = document.getElementById('setting-profile-preview');
  const profilePlaceholder = document.getElementById('setting-profile-placeholder');
  if (profilePreview && profilePlaceholder) {
    const src = getAdminProfileSrc();
    if (src) {
      profilePreview.src = src;
      profilePreview.style.display = 'block';
      profilePlaceholder.style.display = 'none';
    } else {
      profilePreview.style.display = 'none';
      profilePlaceholder.style.display = 'flex';
      const session = typeof getCurrentUser === 'function' ? getCurrentUser() : null;
      profilePlaceholder.textContent = (session && session.name) ? session.name.charAt(0).toUpperCase() : 'A';
    }
  }
}

function saveSettingsForm() {
  const s = getSettings();
  s.schoolName = document.getElementById('setting-schoolName')?.value || s.schoolName;
  s.tagline = document.getElementById('setting-tagline')?.value || s.tagline;
  s.whatsapp = document.getElementById('setting-whatsapp')?.value || s.whatsapp;
  s.whatsappIntl = (typeof toWhatsAppNumber === 'function') ? toWhatsAppNumber(s.whatsapp) : s.whatsapp;
  s.phone = document.getElementById('setting-phone')?.value || s.phone;
  s.email = document.getElementById('setting-email')?.value || s.email;
  s.address = document.getElementById('setting-address')?.value || s.address;
  s.academicSession = document.getElementById('setting-academicSession')?.value || s.academicSession;
  saveSettings(s);
  applyBranding();
  showToast('Settings saved successfully');
}

function readImageAsDataURL(file, maxSizeMB, callback) {
  if (!file) return;
  if (!file.type.startsWith('image/')) {
    showToast('Please select an image file (JPG, PNG, WEBP, GIF)', 'error');
    return;
  }
  const maxBytes = (maxSizeMB || 1.5) * 1024 * 1024;
  if (file.size > maxBytes) {
    showToast('Image too large. Please use an image under ' + (maxSizeMB || 1.5) + ' MB', 'error');
    return;
  }
  const reader = new FileReader();
  reader.onload = function (e) { callback(e.target.result); };
  reader.onerror = function () { showToast('Failed to read image', 'error'); };
  reader.readAsDataURL(file);
}

function changeLogo(input) {
  const file = input.files && input.files[0];
  if (!file) return;
  readImageAsDataURL(file, 1.5, function (dataUrl) {
    const s = getSettings();
    s.logo = dataUrl;
    saveSettings(s);
    const preview = document.getElementById('setting-logo-preview');
    if (preview) preview.src = dataUrl;
    applyBranding();
    showToast('Logo updated successfully');
    input.value = '';
  });
}

function removeLogo() {
  if (!confirmAction('Remove custom logo and use default logo?')) return;
  const s = getSettings();
  s.logo = 'assets/logo.png';
  saveSettings(s);
  const preview = document.getElementById('setting-logo-preview');
  if (preview) preview.src = 'assets/logo.png';
  applyBranding();
  showToast('Logo reset to default');
}

function changeAdminProfile(input) {
  const file = input.files && input.files[0];
  if (!file) return;
  readImageAsDataURL(file, 1, function (dataUrl) {
    const s = getSettings();
    s.adminProfilePhoto = dataUrl;
    saveSettings(s);
    const preview = document.getElementById('setting-profile-preview');
    const placeholder = document.getElementById('setting-profile-placeholder');
    if (preview) {
      preview.src = dataUrl;
      preview.style.display = 'block';
    }
    if (placeholder) placeholder.style.display = 'none';
    applyBranding();
    showToast('Profile picture updated');
    input.value = '';
  });
}

function removeAdminProfile() {
  if (!confirmAction('Remove profile picture?')) return;
  const s = getSettings();
  s.adminProfilePhoto = '';
  saveSettings(s);
  const preview = document.getElementById('setting-profile-preview');
  const placeholder = document.getElementById('setting-profile-placeholder');
  if (preview) preview.style.display = 'none';
  if (placeholder) {
    placeholder.style.display = 'flex';
    const session = typeof getCurrentUser === 'function' ? getCurrentUser() : null;
    placeholder.textContent = (session && session.name) ? session.name.charAt(0).toUpperCase() : 'A';
  }
  applyBranding();
  showToast('Profile picture removed');
}

function applyBranding() {
  const logoSrc = getLogoSrc();
  document.querySelectorAll('img.brand-logo, .sidebar-header img, .logo-area img').forEach(function (img) {
    if (img.id === 'setting-logo-preview' || img.id === 'setting-profile-preview') return;
    img.src = logoSrc;
    img.onerror = function () { this.src = 'assets/logo.png'; };
  });

  const avatarEl = document.getElementById('user-avatar');
  const profileSrc = getAdminProfileSrc();
  if (avatarEl) {
    if (profileSrc) {
      avatarEl.style.backgroundImage = 'url(' + profileSrc + ')';
      avatarEl.style.backgroundSize = 'cover';
      avatarEl.style.backgroundPosition = 'center';
      avatarEl.textContent = '';
    } else {
      avatarEl.style.backgroundImage = '';
      const session = typeof getCurrentUser === 'function' ? getCurrentUser() : null;
      avatarEl.textContent = (session && session.name) ? session.name.charAt(0).toUpperCase() : 'A';
    }
  }
}
