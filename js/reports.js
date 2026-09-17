// Reports Module
function generateStudentReport() {
  return getAllStudents().map(s => ({
    'Student ID': s.id,
    'Admission No': s.admissionNo,
    'Name': s.name,
    'Father Name': s.fatherName,
    'Class': s.className,
    'Section': s.section,
    'Roll No': s.rollNo,
    'Phone': s.phone || s.fatherPhone,
    'WhatsApp': s.parentWhatsApp,
    'Status': s.status
  }));
}

function generateFeeReport() {
  return getAllFees().map(f => ({
    'Student': f.studentName,
    'Class': f.className,
    'Month': f.month,
    'Total': f.total,
    'Paid': f.paid,
    'Remaining': f.remaining,
    'Status': f.status,
    'Receipt': f.receiptNo
  }));
}

function generateAttendanceReport(date) {
  const records = getAttendanceByDate(date || new Date().toISOString().split('T')[0]);
  return records.map(a => ({
    'Student': a.studentName,
    'Class': a.className,
    'Section': a.section,
    'Date': a.date,
    'Status': a.status
  }));
}

function generateDefaulterReport() {
  return getPendingFees().map(f => ({
    'Student': f.studentName,
    'Father': f.fatherName,
    'Class': f.className,
    'Month': f.month,
    'Total': f.total,
    'Paid': f.paid,
    'Remaining': f.remaining
  }));
}
