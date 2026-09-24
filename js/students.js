// ============================================================
// Students Management Module
// ============================================================

function getAllStudents() {
  return getRecords(DB_KEYS.students);
}

function getStudentById(id) {
  return getRecordById(DB_KEYS.students, id);
}

function addStudent(data) {
  if (!data.admissionNo) {
    const year = new Date().getFullYear();
    const count = getAllStudents().length + 1;
    data.admissionNo = `ADM-${year}-${String(count).padStart(3, '0')}`;
  }
  if (!data.status) data.status = 'active';
  const student = addRecord(DB_KEYS.students, data);
  addNotification('New Student', `Student ${data.name} has been admitted to ${data.className}`, 'admission');
  return student;
}

function updateStudent(id, data) {
  return updateRecord(DB_KEYS.students, id, data);
}

function deleteStudent(id) {
  return deleteRecord(DB_KEYS.students, id);
}

function searchStudents(term, filters = {}) {
  let students = getAllStudents();
  if (term) {
    students = filterData(students, term, ['name', 'fatherName', 'admissionNo', 'id', 'rollNo', 'phone', 'parentWhatsApp', 'className']);
  }
  if (filters.className) students = students.filter(s => s.className === filters.className);
  if (filters.section) students = students.filter(s => s.section === filters.section);
  if (filters.status) students = students.filter(s => s.status === filters.status);
  if (filters.gender) students = students.filter(s => s.gender === filters.gender);
  return students;
}

function getStudentsByClass(className, section) {
  let students = getAllStudents().filter(s => s.className === className && s.status === 'active');
  if (section) students = students.filter(s => s.section === section);
  return students.sort((a, b) => (a.rollNo || 0) - (b.rollNo || 0));
}

function getStudentWhatsAppList(filters = {}) {
  let students = searchStudents('', filters).filter(s => s.status === 'active');
  return students.map(s => ({
    id: s.id,
    studentId: s.id,
    admissionNo: s.admissionNo,
    name: s.name,
    fatherName: s.fatherName,
    className: s.className,
    section: s.section,
    parentName: s.fatherName,
    whatsapp: s.parentWhatsApp || s.fatherPhone || s.phone,
    relation: 'Father',
    status: s.status
  }));
}

function renderStudentsTable(containerId, options = {}) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const students = searchStudents(options.search || '', options.filters || {});
  if (students.length === 0) {
    container.innerHTML = '<div class="empty-state"><i class="fas fa-user-graduate"></i><p>No students found</p></div>';
    return;
  }
  const paginated = paginate(students, options.page || 1, options.perPage || 15);
  let html = `
    <div class="table-responsive">
      <table class="data-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Admission No</th>
            <th>Name</th>
            <th>Father Name</th>
            <th>Class</th>
            <th>Section</th>
            <th>Roll</th>
            <th>Phone</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
  `;
  paginated.data.forEach((s, i) => {
    html += `
      <tr>
        <td>${(paginated.page - 1) * paginated.perPage + i + 1}</td>
        <td>${escapeHtml(s.admissionNo)}</td>
        <td><strong>${escapeHtml(s.name)}</strong></td>
        <td>${escapeHtml(s.fatherName)}</td>
        <td>${escapeHtml(s.className)}</td>
        <td>${escapeHtml(s.section)}</td>
        <td>${s.rollNo || '-'}</td>
        <td>${escapeHtml(s.phone || s.fatherPhone || '-')}</td>
        <td><span class="badge badge-${s.status === 'active' ? 'success' : 'secondary'}">${s.status}</span></td>
        <td class="actions">
          <button class="btn btn-sm btn-primary" onclick="viewStudent('${s.id}')" title="View"><i class="fas fa-eye"></i></button>
          <button class="btn btn-sm" style="background:var(--gray-200);" onclick="editStudent('${s.id}')" title="Edit"><i class="fas fa-edit"></i></button>
          <button class="btn btn-sm" style="background:#1e3a5f;color:#fff;" onclick="openStudentIDCard('${s.id}')" title="ID Card"><i class="fas fa-id-card"></i></button>
          ${s.parentWhatsApp ? `<button class="btn btn-sm btn-whatsapp" onclick="openWhatsApp('${s.parentWhatsApp}','Assalam-o-Alaikum. This is a message from AL FIDA HUSSAIN PUBLIC SCHOOLS regarding ${s.name}.')" title="WhatsApp"><i class="fab fa-whatsapp"></i></button>` : ''}
          <button class="btn btn-sm btn-danger" onclick="confirmDeleteStudent('${s.id}')" title="Delete"><i class="fas fa-trash"></i></button>
        </td>
      </tr>
    `;
  });
  html += '</tbody></table></div>';
  // Pagination
  if (paginated.totalPages > 1) {
    html += '<div class="pagination">';
    for (let p = 1; p <= paginated.totalPages; p++) {
      html += `<button class="${p === paginated.page ? 'active' : ''}" onclick="loadStudentsPage(${p})">${p}</button>`;
    }
    html += '</div>';
  }
  container.innerHTML = html;
}
