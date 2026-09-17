// Timetable Module
function getAllTimetable() { return getRecords(DB_KEYS.timetable); }
function addTimetableEntry(data) { return addRecord(DB_KEYS.timetable, data); }
function updateTimetableEntry(id, data) { return updateRecord(DB_KEYS.timetable, id, data); }
function deleteTimetableEntry(id) { return deleteRecord(DB_KEYS.timetable, id); }

function getTimetableByClass(className, section) {
  return getAllTimetable().filter(t => t.className === className && (!section || t.section === section));
}

function renderTimetable(containerId, className, section) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const entries = getTimetableByClass(className, section);
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  if (entries.length === 0) {
    container.innerHTML = '<div class="empty-state"><p>No timetable entries. Add periods below.</p></div>';
    return;
  }
  let html = `<div class="table-responsive"><table class="data-table"><thead><tr>
    <th>Day</th><th>Subject</th><th>Teacher</th><th>Room</th><th>Time</th><th>Actions</th>
  </tr></thead><tbody>`;
  days.forEach(day => {
    const dayEntries = entries.filter(e => e.day === day);
    dayEntries.forEach(e => {
      html += `<tr>
        <td><strong>${e.day}</strong></td>
        <td>${escapeHtml(e.subject)}</td>
        <td>${escapeHtml(e.teacher)}</td>
        <td>${escapeHtml(e.room || '-')}</td>
        <td>${e.startTime} - ${e.endTime}</td>
        <td><button class="btn btn-sm btn-danger" onclick="if(confirmAction('Delete?')){deleteTimetableEntry('${e.id}');loadTimetable();}"><i class="fas fa-trash"></i></button></td>
      </tr>`;
    });
  });
  html += '</tbody></table></div>';
  container.innerHTML = html;
}
