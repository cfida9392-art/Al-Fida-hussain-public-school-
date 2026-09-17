// Results Module
function getAllResults() { return getRecords(DB_KEYS.results); }
function addResult(data) {
  data.percentage = data.totalMarks > 0 ? Math.round((data.obtainedMarks / data.totalMarks) * 100) : 0;
  const g = calculateGrade(data.percentage);
  data.grade = g.grade;
  data.status = data.percentage >= 40 ? 'Pass' : 'Fail';
  return addRecord(DB_KEYS.results, data);
}
function updateResult(id, data) {
  data.percentage = data.totalMarks > 0 ? Math.round((data.obtainedMarks / data.totalMarks) * 100) : 0;
  const g = calculateGrade(data.percentage);
  data.grade = g.grade;
  data.status = data.percentage >= 40 ? 'Pass' : 'Fail';
  return updateRecord(DB_KEYS.results, id, data);
}
function deleteResult(id) { return deleteRecord(DB_KEYS.results, id); }

function getStudentResults(studentId, examId) {
  let results = getAllResults().filter(r => r.studentId === studentId);
  if (examId) results = results.filter(r => r.examId === examId);
  return results;
}

function getResultSummary(studentId, examId) {
  const results = getStudentResults(studentId, examId);
  const totalMarks = results.reduce((s, r) => s + (r.totalMarks || 0), 0);
  const obtained = results.reduce((s, r) => s + (r.obtainedMarks || 0), 0);
  const percentage = totalMarks > 0 ? Math.round((obtained / totalMarks) * 100) : 0;
  const grade = calculateGrade(percentage);
  return { totalMarks, obtained, percentage, grade: grade.grade, remark: grade.remark, subjects: results };
}

function renderResultsTable(containerId, filters = {}) {
  const container = document.getElementById(containerId);
  if (!container) return;
  let results = getAllResults();
  if (filters.examId) results = results.filter(r => r.examId === filters.examId);
  if (filters.className) results = results.filter(r => r.className === filters.className);
  if (filters.search) results = filterData(results, filters.search, ['studentName', 'subject', 'examName']);

  if (results.length === 0) {
    container.innerHTML = '<div class="empty-state"><p>No results found</p></div>';
    return;
  }
  let html = `<div class="table-responsive"><table class="data-table"><thead><tr>
    <th>#</th><th>Student</th><th>Exam</th><th>Subject</th><th>Total</th><th>Obtained</th><th>%</th><th>Grade</th><th>Status</th>
  </tr></thead><tbody>`;
  results.forEach((r, i) => {
    html += `<tr>
      <td>${i + 1}</td>
      <td>${escapeHtml(r.studentName)}</td>
      <td>${escapeHtml(r.examName)}</td>
      <td>${escapeHtml(r.subject)}</td>
      <td>${r.totalMarks}</td>
      <td>${r.obtainedMarks}</td>
      <td>${r.percentage}%</td>
      <td><strong>${r.grade}</strong></td>
      <td><span class="badge badge-${r.status === 'Pass' ? 'success' : 'danger'}">${r.status}</span></td>
    </tr>`;
  });
  html += '</tbody></table></div>';
  container.innerHTML = html;
}
