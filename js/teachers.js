// Teachers Module
function getAllTeachers() { return getRecords(DB_KEYS.teachers); }
function getTeacherById(id) { return getRecordById(DB_KEYS.teachers, id); }
function addTeacher(data) { return addRecord(DB_KEYS.teachers, data); }
function updateTeacher(id, data) { return updateRecord(DB_KEYS.teachers, id, data); }
function deleteTeacher(id) { return deleteRecord(DB_KEYS.teachers, id); }

function renderTeachersTable(containerId, search = '') {
  const container = document.getElementById(containerId);
  if (!container) return;
  let teachers = getAllTeachers();
  if (search) teachers = filterData(teachers, search, ['name', 'phone', 'email', 'subjects', 'qualification']);
  if (teachers.length === 0) {
    container.innerHTML = '<div class="empty-state"><i class="fas fa-chalkboard-teacher"></i><p>No teachers found</p></div>';
    return;
  }
  let html = `<div class="table-responsive"><table class="data-table"><thead><tr>
    <th>#</th><th>Name</th><th>Phone</th><th>Subjects</th><th>Classes</th><th>Experience</th><th>Status</th><th>Actions</th>
  </tr></thead><tbody>`;
  teachers.forEach((t, i) => {
    html += `<tr>
      <td>${i + 1}</td>
      <td><strong>${escapeHtml(t.name)}</strong><br><small>${escapeHtml(t.qualification || '')}</small></td>
      <td>${escapeHtml(t.phone || '-')}</td>
      <td>${escapeHtml((t.subjects || []).join(', '))}</td>
      <td>${escapeHtml((t.classes || []).join(', '))}</td>
      <td>${t.experience || 0} yrs</td>
      <td><span class="badge badge-${t.status === 'active' ? 'success' : 'secondary'}">${t.status}</span></td>
      <td class="actions">
        <button class="btn btn-sm" style="background:var(--gray-200);" onclick="editTeacher('${t.id}')"><i class="fas fa-edit"></i></button>
        ${t.whatsapp ? `<button class="btn btn-sm btn-whatsapp" onclick="openWhatsApp('${t.whatsapp}','Assalam-o-Alaikum. Message from AL FIDA HUSSAIN PUBLIC SCHOOLS.')"><i class="fab fa-whatsapp"></i></button>` : ''}
        <button class="btn btn-sm btn-danger" onclick="if(confirmAction('Delete this teacher?')){deleteTeacher('${t.id}');loadTeachers();showToast('Deleted');}"><i class="fas fa-trash"></i></button>
      </td>
    </tr>`;
  });
  html += '</tbody></table></div>';
  container.innerHTML = html;
}
