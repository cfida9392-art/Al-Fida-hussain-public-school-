// ============================================================
// WhatsApp Integration Module
// ============================================================

function getWhatsAppMessage(template, data = {}) {
  let msg = template;
  Object.keys(data).forEach(key => {
    msg = msg.replace(new RegExp(`{{${key}}}`, 'g'), data[key] || '');
  });
  return msg;
}

const WA_TEMPLATES = {
  general: 'Assalam-o-Alaikum. This is a message from AL FIDA HUSSAIN PUBLIC SCHOOLS regarding your child {{studentName}}.',
  absent: 'Assalam-o-Alaikum. This is to inform you that your child {{studentName}} (Class {{className}}-{{section}}) was absent from school on {{date}}. Please ensure regular attendance. - AL FIDA HUSSAIN PUBLIC SCHOOLS',
  feeReminder: 'Assalam-o-Alaikum. This is a fee reminder from AL FIDA HUSSAIN PUBLIC SCHOOLS. Fee for {{month}} of your child {{studentName}} (Class {{className}}) is pending. Total: PKR {{total}}, Remaining: PKR {{remaining}}. Please clear dues at the earliest. WhatsApp: 03168122916',
  admission: 'Assalam-o-Alaikum. Thank you for your interest in AL FIDA HUSSAIN PUBLIC SCHOOLS. Regarding admission inquiry for {{studentName}}.',
  homework: 'Assalam-o-Alaikum. New homework has been assigned for {{studentName}} in {{subject}}. Due date: {{dueDate}}. - AL FIDA HUSSAIN PUBLIC SCHOOLS',
  result: 'Assalam-o-Alaikum. Results for {{examName}} of your child {{studentName}} have been published. Please check the parent portal. - AL FIDA HUSSAIN PUBLIC SCHOOLS',
  notice: 'Assalam-o-Alaikum. Notice from AL FIDA HUSSAIN PUBLIC SCHOOLS: {{title}}. {{content}}'
};

function openParentWhatsApp(student, type = 'general', extra = {}) {
  const phone = student.parentWhatsApp || student.fatherPhone || student.phone;
  if (!phone) {
    showToast('No WhatsApp number available', 'error');
    return;
  }
  const data = {
    studentName: student.name,
    className: student.className,
    section: student.section,
    date: extra.date || new Date().toLocaleDateString(),
    month: extra.month || '',
    total: extra.total || '',
    remaining: extra.remaining || '',
    subject: extra.subject || '',
    dueDate: extra.dueDate || '',
    examName: extra.examName || '',
    title: extra.title || '',
    content: extra.content || ''
  };
  const message = getWhatsAppMessage(WA_TEMPLATES[type] || WA_TEMPLATES.general, data);
  openWhatsApp(phone, message);
}

function renderWhatsAppContactsTable(containerId, filters = {}) {
  const container = document.getElementById(containerId);
  if (!container) return;
  let list = getStudentWhatsAppList(filters);
  if (filters.hasWhatsApp) {
    list = list.filter(s => s.whatsapp);
  }
  if (filters.search) {
    list = filterData(list, filters.search, ['name', 'fatherName', 'className', 'whatsapp', 'admissionNo']);
  }

  if (list.length === 0) {
    container.innerHTML = '<div class="empty-state"><i class="fab fa-whatsapp"></i><p>No contacts found</p></div>';
    return;
  }

  let html = `
    <div class="table-responsive">
      <table class="data-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Student ID</th>
            <th>Student Name</th>
            <th>Father Name</th>
            <th>Class</th>
            <th>Section</th>
            <th>WhatsApp</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
  `;
  list.forEach((s, i) => {
    const waNum = toWhatsAppNumber(s.whatsapp);
    html += `
      <tr>
        <td>${i + 1}</td>
        <td>${escapeHtml(s.studentId)}</td>
        <td><strong>${escapeHtml(s.name)}</strong></td>
        <td>${escapeHtml(s.fatherName)}</td>
        <td>${escapeHtml(s.className)}</td>
        <td>${escapeHtml(s.section)}</td>
        <td>${escapeHtml(s.whatsapp || '-')}</td>
        <td><span class="badge badge-${s.status === 'active' ? 'success' : 'secondary'}">${s.status}</span></td>
        <td>
          ${s.whatsapp ? `<button class="btn btn-sm btn-whatsapp" onclick="openWhatsApp('${s.whatsapp}','Assalam-o-Alaikum. This is a message from AL FIDA HUSSAIN PUBLIC SCHOOLS regarding ${s.name}.')"><i class="fab fa-whatsapp"></i> Chat</button>` : '<span class="badge badge-secondary">N/A</span>'}
        </td>
      </tr>
    `;
  });
  html += '</tbody></table></div>';
  html += `<div class="mt-2"><button class="btn btn-sm btn-primary" onclick="exportWhatsAppCSV()"><i class="fas fa-file-csv"></i> Export CSV</button>
  <button class="btn btn-sm" style="background:var(--gray-200);margin-left:8px;" onclick="window.print()"><i class="fas fa-print"></i> Print</button></div>`;
  container.innerHTML = html;
  window._waContactsList = list;
}

function exportWhatsAppCSV() {
  const list = window._waContactsList || getStudentWhatsAppList();
  exportToCSV(list.map(s => ({
    'Student ID': s.studentId,
    'Student Name': s.name,
    'Father Name': s.fatherName,
    'Class': s.className,
    'Section': s.section,
    'WhatsApp': s.whatsapp,
    'Status': s.status
  })), 'student_whatsapp_contacts.csv');
}

function renderBulkWhatsApp(containerId, type, filters = {}) {
  const container = document.getElementById(containerId);
  if (!container) return;
  let list = [];
  if (type === 'all_parents') {
    list = getStudentWhatsAppList({ status: 'active' });
  } else if (type === 'class') {
    list = getStudentWhatsAppList({ className: filters.className, section: filters.section, status: 'active' });
  } else if (type === 'absent') {
    const today = new Date().toISOString().split('T')[0];
    const att = getRecords(DB_KEYS.attendance).filter(a => a.date === today && a.status === 'absent');
    const studentIds = att.map(a => a.studentId);
    list = getStudentWhatsAppList({ status: 'active' }).filter(s => studentIds.includes(s.studentId));
  } else if (type === 'fee_defaulters') {
    const fees = getRecords(DB_KEYS.fees).filter(f => f.remaining > 0);
    const studentIds = [...new Set(fees.map(f => f.studentId))];
    list = getStudentWhatsAppList({ status: 'active' }).filter(s => studentIds.includes(s.studentId));
    list = list.map(s => {
      const fee = fees.find(f => f.studentId === s.studentId);
      return { ...s, month: fee?.month, total: fee?.total, remaining: fee?.remaining };
    });
  }

  if (list.length === 0) {
    container.innerHTML = '<div class="empty-state"><i class="fab fa-whatsapp"></i><p>No contacts found for selection</p></div>';
    return;
  }

  const template = document.getElementById('bulk-wa-message')?.value || WA_TEMPLATES.general;

  let html = `<p><strong>${list.length}</strong> contacts selected</p>
    <div class="table-responsive"><table class="data-table"><thead><tr>
      <th>#</th><th>Student</th><th>Father</th><th>Class</th><th>WhatsApp</th><th>Action</th>
    </tr></thead><tbody>`;
  list.forEach((s, i) => {
    let msg = template.replace(/{{studentName}}/g, s.name)
      .replace(/{{className}}/g, s.className)
      .replace(/{{section}}/g, s.section)
      .replace(/{{month}}/g, s.month || '')
      .replace(/{{total}}/g, s.total || '')
      .replace(/{{remaining}}/g, s.remaining || '');
    html += `<tr>
      <td>${i + 1}</td>
      <td>${escapeHtml(s.name)}</td>
      <td>${escapeHtml(s.fatherName)}</td>
      <td>${escapeHtml(s.className)}-${escapeHtml(s.section)}</td>
      <td>${escapeHtml(s.whatsapp || '-')}</td>
      <td>${s.whatsapp ? `<button class="btn btn-sm btn-whatsapp" onclick="openWhatsApp('${s.whatsapp}','${msg.replace(/'/g, "\\'")}')"><i class="fab fa-whatsapp"></i> Open</button>` : 'N/A'}</td>
    </tr>`;
  });
  html += '</tbody></table></div>';
  container.innerHTML = html;
}
