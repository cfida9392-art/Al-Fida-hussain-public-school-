// Homework Module
function getAllHomework() { return getRecords(DB_KEYS.homework); }
function addHomework(data) { return addRecord(DB_KEYS.homework, data); }
function updateHomework(id, data) { return updateRecord(DB_KEYS.homework, id, data); }
function deleteHomework(id) { return deleteRecord(DB_KEYS.homework, id); }

function renderHomeworkTable(containerId, filters = {}) {
  const container = document.getElementById(containerId);
  if (!container) return;
  let hw = getAllHomework();
  if (filters.className) hw = hw.filter(h => h.className === filters.className);
  if (filters.search) hw = filterData(hw, filters.search, ['title', 'subject', 'description', 'teacher']);

  if (hw.length === 0) {
    container.innerHTML = '<div class="empty-state"><p>No homework found</p></div>';
    return;
  }
  let html = `<div class="table-responsive"><table class="data-table"><thead><tr>
    <th>#</th><th>Title</th><th>Class</th><th>Subject</th><th>Due Date</th><th>Teacher</th><th>Actions</th>
  </tr></thead><tbody>`;
  hw.forEach((h, i) => {
    html += `<tr>
      <td>${i + 1}</td>
      <td><strong>${escapeHtml(h.title)}</strong><br><small>${escapeHtml(h.description || '').substring(0, 60)}</small></td>
      <td>${escapeHtml(h.className)}-${escapeHtml(h.section || '')}</td>
      <td>${escapeHtml(h.subject)}</td>
      <td>${formatDate(h.dueDate)}</td>
      <td>${escapeHtml(h.teacher || '')}</td>
      <td class="actions">
        <button class="btn btn-sm btn-danger" onclick="if(confirmAction('Delete?')){deleteHomework('${h.id}');loadHomework();showToast('Deleted');}"><i class="fas fa-trash"></i></button>
      </td>
    </tr>`;
  });
  html += '</tbody></table></div>';
  container.innerHTML = html;
}
