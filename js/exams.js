// Exams Module
function getAllExams() { return getRecords(DB_KEYS.exams); }
function addExam(data) { return addRecord(DB_KEYS.exams, data); }
function updateExam(id, data) { return updateRecord(DB_KEYS.exams, id, data); }
function deleteExam(id) { return deleteRecord(DB_KEYS.exams, id); }

function renderExamsTable(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const exams = getAllExams();
  if (exams.length === 0) {
    container.innerHTML = '<div class="empty-state"><p>No exams found</p></div>';
    return;
  }
  let html = `<div class="table-responsive"><table class="data-table"><thead><tr>
    <th>#</th><th>Exam Name</th><th>Start</th><th>End</th><th>Total Marks</th><th>Passing</th><th>Status</th><th>Actions</th>
  </tr></thead><tbody>`;
  exams.forEach((e, i) => {
    html += `<tr>
      <td>${i + 1}</td>
      <td><strong>${escapeHtml(e.name)}</strong></td>
      <td>${formatDate(e.startDate)}</td>
      <td>${formatDate(e.endDate)}</td>
      <td>${e.totalMarks}</td>
      <td>${e.passingMarks}</td>
      <td><span class="badge badge-${e.status === 'completed' ? 'success' : e.status === 'upcoming' ? 'info' : 'warning'}">${e.status}</span></td>
      <td class="actions">
        <button class="btn btn-sm" style="background:var(--gray-200);" onclick="editExam('${e.id}')"><i class="fas fa-edit"></i></button>
        <button class="btn btn-sm btn-danger" onclick="if(confirmAction('Delete exam?')){deleteExam('${e.id}');loadExams();showToast('Deleted');}"><i class="fas fa-trash"></i></button>
      </td>
    </tr>`;
  });
  html += '</tbody></table></div>';
  container.innerHTML = html;
}
