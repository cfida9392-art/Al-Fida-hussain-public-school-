// Admissions Module
function getAllAdmissions() { return getRecords(DB_KEYS.admissions); }
function addAdmission(data) {
  data.status = data.status || 'new';
  data.appliedDate = data.appliedDate || new Date().toISOString();
  const adm = addRecord(DB_KEYS.admissions, data);
  addNotification('New Admission', `New application from ${data.studentName} for ${data.className}`, 'admission');
  return adm;
}
function updateAdmission(id, data) { return updateRecord(DB_KEYS.admissions, id, data); }
function deleteAdmission(id) { return deleteRecord(DB_KEYS.admissions, id); }

function enrollStudent(admissionId) {
  const adm = getRecordById(DB_KEYS.admissions, admissionId);
  if (!adm) return null;
  const student = addStudent({
    name: adm.studentName,
    fatherName: adm.fatherName,
    motherName: adm.motherName,
    dob: adm.dob,
    gender: adm.gender,
    className: adm.className,
    section: 'A',
    phone: adm.phone,
    fatherPhone: adm.phone,
    parentWhatsApp: adm.whatsapp || adm.phone,
    address: adm.address,
    previousSchool: adm.previousSchool,
    status: 'active',
    admissionDate: new Date().toISOString().split('T')[0]
  });
  updateAdmission(admissionId, { status: 'enrolled', studentId: student.id });
  showToast('Student enrolled successfully');
  return student;
}

function renderAdmissionsTable(containerId, statusFilter = '') {
  const container = document.getElementById(containerId);
  if (!container) return;
  let ads = getAllAdmissions();
  if (statusFilter) ads = ads.filter(a => a.status === statusFilter);
  if (ads.length === 0) {
    container.innerHTML = '<div class="empty-state"><p>No admission applications</p></div>';
    return;
  }
  let html = `<div class="table-responsive"><table class="data-table"><thead><tr>
    <th>#</th><th>Student</th><th>Father</th><th>Class</th><th>Phone</th><th>Status</th><th>Date</th><th>Actions</th>
  </tr></thead><tbody>`;
  ads.forEach((a, i) => {
    html += `<tr>
      <td>${i + 1}</td>
      <td><strong>${escapeHtml(a.studentName)}</strong></td>
      <td>${escapeHtml(a.fatherName)}</td>
      <td>${escapeHtml(a.className)}</td>
      <td>${escapeHtml(a.phone)}</td>
      <td><span class="badge badge-${a.status === 'enrolled' ? 'success' : a.status === 'rejected' ? 'danger' : a.status === 'approved' ? 'info' : 'warning'}">${a.status}</span></td>
      <td>${formatDate(a.appliedDate)}</td>
      <td class="actions">
        ${a.status === 'new' || a.status === 'under_review' ? `
          <button class="btn btn-sm btn-success" onclick="updateAdmission('${a.id}',{status:'approved'});loadAdmissions();showToast('Approved');">Approve</button>
          <button class="btn btn-sm btn-danger" onclick="updateAdmission('${a.id}',{status:'rejected'});loadAdmissions();showToast('Rejected');">Reject</button>
        ` : ''}
        ${a.status === 'approved' ? `<button class="btn btn-sm btn-primary" onclick="enrollStudent('${a.id}');loadAdmissions();">Enroll</button>` : ''}
        ${a.whatsapp ? `<button class="btn btn-sm btn-whatsapp" onclick="openWhatsApp('${a.whatsapp}','Assalam-o-Alaikum. Regarding your admission application at AL FIDA HUSSAIN PUBLIC SCHOOLS.')"><i class="fab fa-whatsapp"></i></button>` : ''}
      </td>
    </tr>`;
  });
  html += '</tbody></table></div>';
  container.innerHTML = html;
}
