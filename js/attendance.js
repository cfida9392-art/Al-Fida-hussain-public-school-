// ============================================================
// Attendance Module
// ============================================================

function getAttendanceByDate(date, className, section) {
  let records = getRecords(DB_KEYS.attendance).filter(a => a.date === date);
  if (className) records = records.filter(a => a.className === className);
  if (section) records = records.filter(a => a.section === section);
  return records;
}

function saveAttendance(date, className, section, attendanceList) {
  // Remove existing for this date/class/section
  let all = getRecords(DB_KEYS.attendance).filter(a => !(a.date === date && a.className === className && a.section === section));
  attendanceList.forEach(item => {
    all.push({
      id: 'ATT_' + item.studentId + '_' + date,
      studentId: item.studentId,
      studentName: item.studentName,
      className,
      section,
      date,
      status: item.status,
      remark: item.remark || ''
    });
  });
  saveData(DB_KEYS.attendance, all);
  // Notify for absents
  attendanceList.filter(a => a.status === 'absent').forEach(a => {
    addNotification('Absent Student', `${a.studentName} was marked absent on ${date}`, 'attendance');
  });
  return true;
}

function getTodayAttendanceStats() {
  const today = new Date().toISOString().split('T')[0];
  const records = getAttendanceByDate(today);
  return {
    present: records.filter(r => r.status === 'present').length,
    absent: records.filter(r => r.status === 'absent').length,
    late: records.filter(r => r.status === 'late').length,
    leave: records.filter(r => r.status === 'leave').length,
    total: records.length
  };
}

function getStudentAttendancePercentage(studentId) {
  const records = getRecords(DB_KEYS.attendance).filter(a => a.studentId === studentId);
  if (records.length === 0) return 100;
  const present = records.filter(r => r.status === 'present' || r.status === 'late').length;
  return Math.round((present / records.length) * 100);
}

function getAbsentStudentsToday() {
  const today = new Date().toISOString().split('T')[0];
  return getAttendanceByDate(today).filter(a => a.status === 'absent');
}

function renderAttendanceForm(containerId, className, section, date) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const students = getStudentsByClass(className, section);
  if (students.length === 0) {
    container.innerHTML = '<div class="empty-state"><p>No students in this class/section</p></div>';
    return;
  }
  const existing = getAttendanceByDate(date, className, section);
  let html = `<div class="table-responsive"><table class="data-table"><thead><tr>
    <th>#</th><th>Roll</th><th>Name</th><th>Present</th><th>Absent</th><th>Leave</th><th>Late</th>
  </tr></thead><tbody>`;
  students.forEach((s, i) => {
    const att = existing.find(a => a.studentId === s.id);
    const status = att ? att.status : 'present';
    html += `<tr>
      <td>${i + 1}</td>
      <td>${s.rollNo || '-'}</td>
      <td>${escapeHtml(s.name)}</td>
      <td><input type="radio" name="att_${s.id}" value="present" ${status === 'present' ? 'checked' : ''}></td>
      <td><input type="radio" name="att_${s.id}" value="absent" ${status === 'absent' ? 'checked' : ''}></td>
      <td><input type="radio" name="att_${s.id}" value="leave" ${status === 'leave' ? 'checked' : ''}></td>
      <td><input type="radio" name="att_${s.id}" value="late" ${status === 'late' ? 'checked' : ''}></td>
    </tr>`;
  });
  html += '</tbody></table></div>';
  html += `<button class="btn btn-primary mt-2" onclick="saveAttendanceForm('${className}','${section}','${date}')"><i class="fas fa-save"></i> Save Attendance</button>`;
  container.innerHTML = html;
  window._attendanceStudents = students;
}

function saveAttendanceForm(className, section, date) {
  const students = window._attendanceStudents || [];
  const list = students.map(s => {
    const radio = document.querySelector(`input[name="att_${s.id}"]:checked`);
    return {
      studentId: s.id,
      studentName: s.name,
      status: radio ? radio.value : 'present'
    };
  });
  saveAttendance(date, className, section, list);
  showToast('Attendance saved successfully');
}
