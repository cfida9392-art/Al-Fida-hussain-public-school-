// Settings Module
function loadSettingsForm() {
  const s = getSettings();
  const fields = ['schoolName', 'tagline', 'whatsapp', 'phone', 'email', 'address', 'academicSession'];
  fields.forEach(f => {
    const el = document.getElementById('setting-' + f);
    if (el) el.value = s[f] || '';
  });
}

function saveSettingsForm() {
  const s = getSettings();
  s.schoolName = document.getElementById('setting-schoolName')?.value || s.schoolName;
  s.tagline = document.getElementById('setting-tagline')?.value || s.tagline;
  s.whatsapp = document.getElementById('setting-whatsapp')?.value || s.whatsapp;
  s.whatsappIntl = toWhatsAppNumber(s.whatsapp);
  s.phone = document.getElementById('setting-phone')?.value || s.phone;
  s.email = document.getElementById('setting-email')?.value || s.email;
  s.address = document.getElementById('setting-address')?.value || s.address;
  s.academicSession = document.getElementById('setting-academicSession')?.value || s.academicSession;
  saveSettings(s);
  showToast('Settings saved successfully');
}
