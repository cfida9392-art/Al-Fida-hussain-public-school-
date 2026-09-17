// ============================================================
// Common Application Utilities
// ============================================================

// Toast notifications
function showToast(message, type = 'success') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.style.cssText = 'position:fixed;top:20px;right:20px;z-index:99999;display:flex;flex-direction:column;gap:10px;';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  const colors = { success: '#10b981', error: '#ef4444', warning: '#f59e0b', info: '#3b82f6' };
  toast.style.cssText = `background:${colors[type] || colors.info};color:white;padding:14px 20px;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,0.15);font-size:14px;max-width:350px;animation:slideIn 0.3s ease;display:flex;align-items:center;gap:10px;`;
  toast.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'times-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i><span>${escapeHtml(message)}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// Escape HTML
function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Format phone to international WhatsApp format
function toWhatsAppNumber(phone) {
  if (!phone) return '';
  let cleaned = phone.toString().replace(/\D/g, '');
  if (cleaned.startsWith('0')) cleaned = '92' + cleaned.substring(1);
  if (!cleaned.startsWith('92') && cleaned.length === 10) cleaned = '92' + cleaned;
  return cleaned;
}

// Open WhatsApp with message
function openWhatsApp(phone, message = '') {
  const number = toWhatsAppNumber(phone);
  if (!number) {
    showToast('Invalid WhatsApp number', 'error');
    return;
  }
  const url = `https://wa.me/${number}${message ? '?text=' + encodeURIComponent(message) : ''}`;
  window.open(url, '_blank');
}

// School WhatsApp
function openSchoolWhatsApp(message = '') {
  const settings = getSettings();
  openWhatsApp(settings.whatsappIntl || '923168122916', message);
}

// Confirm dialog
function confirmAction(message) {
  return window.confirm(message);
}

// Format date
function formatDate(dateStr) {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr;
  return d.toLocaleDateString('en-PK', { year: 'numeric', month: 'short', day: 'numeric' });
}

// Format currency
function formatCurrency(amount) {
  return 'PKR ' + Number(amount || 0).toLocaleString('en-PK');
}

// Calculate grade
function calculateGrade(percentage) {
  const settings = getSettings();
  const system = settings.gradeSystem || [];
  for (const g of system) {
    if (percentage >= g.min) return g;
  }
  return { grade: 'F', remark: 'Fail' };
}

// Export to CSV
function exportToCSV(data, filename) {
  if (!data || data.length === 0) {
    showToast('No data to export', 'warning');
    return;
  }
  const headers = Object.keys(data[0]);
  const csvRows = [headers.join(',')];
  data.forEach(row => {
    const values = headers.map(h => {
      let val = row[h] == null ? '' : String(row[h]);
      val = val.replace(/"/g, '""');
      if (val.includes(',') || val.includes('"') || val.includes('\n')) val = `"${val}"`;
      return val;
    });
    csvRows.push(values.join(','));
  });
  const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename || 'export.csv';
  link.click();
  showToast('CSV exported successfully');
}

// Print element
function printElement(elementId, title = '') {
  const el = document.getElementById(elementId);
  if (!el) return;
  const printWindow = window.open('', '_blank');
  printWindow.document.write(`
    <html>
    <head>
      <title>${title || 'Print'}</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; color: #000; }
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background: #1e3a5f; color: white; }
        .no-print { display: none !important; }
        @media print { body { margin: 0; } }
      </style>
    </head>
    <body>${el.innerHTML}</body>
    </html>
  `);
  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => printWindow.print(), 300);
}

// Theme toggle
function toggleTheme() {
  const settings = getSettings();
  settings.theme = settings.theme === 'dark' ? 'light' : 'dark';
  saveSettings(settings);
  applyTheme();
}

function applyTheme() {
  const settings = getSettings();
  document.documentElement.setAttribute('data-theme', settings.theme || 'light');
}

// Sidebar toggle for mobile
function toggleSidebar() {
  const sidebar = document.querySelector('.sidebar');
  const overlay = document.querySelector('.sidebar-overlay');
  if (sidebar) sidebar.classList.toggle('open');
  if (overlay) overlay.classList.toggle('active');
}

// Close sidebar
function closeSidebar() {
  const sidebar = document.querySelector('.sidebar');
  const overlay = document.querySelector('.sidebar-overlay');
  if (sidebar) sidebar.classList.remove('open');
  if (overlay) overlay.classList.remove('active');
}

// Modal helpers
function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// Pagination helper
function paginate(array, page = 1, perPage = 10) {
  const total = array.length;
  const totalPages = Math.ceil(total / perPage) || 1;
  const start = (page - 1) * perPage;
  return {
    data: array.slice(start, start + perPage),
    page,
    perPage,
    total,
    totalPages
  };
}

// Search filter
function filterData(data, searchTerm, fields) {
  if (!searchTerm) return data;
  const term = searchTerm.toLowerCase();
  return data.filter(item => fields.some(f => String(item[f] || '').toLowerCase().includes(term)));
}

// Init common UI
document.addEventListener('DOMContentLoaded', () => {
  applyTheme();
  // Close modals on overlay click
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  });
});
