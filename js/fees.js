// ============================================================
// Fees Management Module
// ============================================================

function getAllFees() {
  return getRecords(DB_KEYS.fees);
}

function calculateFeeTotals(fee) {
  fee.total = (Number(fee.tuitionFee) || 0) + (Number(fee.admissionFee) || 0) + (Number(fee.examFee) || 0) +
    (Number(fee.transportFee) || 0) + (Number(fee.otherFee) || 0) - (Number(fee.discount) || 0) + (Number(fee.fine) || 0);
  fee.remaining = Math.max(0, fee.total - (Number(fee.paid) || 0));
  if (fee.remaining === 0) fee.status = 'paid';
  else if (fee.paid > 0) fee.status = 'partial';
  else fee.status = 'pending';
  return fee;
}

function addFee(data) {
  data = calculateFeeTotals(data);
  if (!data.receiptNo && data.paid > 0) {
    data.receiptNo = 'RCP-' + new Date().getFullYear() + '-' + String(getAllFees().length + 1).padStart(4, '0');
    data.paymentDate = data.paymentDate || new Date().toISOString().split('T')[0];
  }
  const fee = addRecord(DB_KEYS.fees, data);
  if (data.paid > 0) {
    addNotification('Fee Payment', `Payment received for ${data.studentName} - ${formatCurrency(data.paid)}`, 'fee');
  }
  return fee;
}

function updateFee(id, data) {
  data = calculateFeeTotals(data);
  return updateRecord(DB_KEYS.fees, id, data);
}

function deleteFee(id) {
  return deleteRecord(DB_KEYS.fees, id);
}

function getPendingFees() {
  return getAllFees().filter(f => f.remaining > 0);
}

function getFeeDefaulters() {
  return getPendingFees();
}

function getTodayCollection() {
  const today = new Date().toISOString().split('T')[0];
  return getAllFees()
    .filter(f => f.paymentDate === today)
    .reduce((sum, f) => sum + (Number(f.paid) || 0), 0);
}

function getFeesByStudent(studentId) {
  return getAllFees().filter(f => f.studentId === studentId);
}

function renderFeesTable(containerId, filters = {}) {
  const container = document.getElementById(containerId);
  if (!container) return;
  let fees = getAllFees();
  if (filters.status === 'pending') fees = fees.filter(f => f.remaining > 0);
  if (filters.status === 'paid') fees = fees.filter(f => f.remaining === 0);
  if (filters.className) fees = fees.filter(f => f.className === filters.className);
  if (filters.search) fees = filterData(fees, filters.search, ['studentName', 'fatherName', 'receiptNo', 'month', 'className']);

  if (fees.length === 0) {
    container.innerHTML = '<div class="empty-state"><i class="fas fa-money-bill"></i><p>No fee records found</p></div>';
    return;
  }

  let html = `<div class="table-responsive"><table class="data-table"><thead><tr>
    <th>#</th><th>Student</th><th>Class</th><th>Month</th><th>Total</th><th>Paid</th><th>Remaining</th><th>Status</th><th>Actions</th>
  </tr></thead><tbody>`;
  fees.forEach((f, i) => {
    html += `<tr>
      <td>${i + 1}</td>
      <td><strong>${escapeHtml(f.studentName)}</strong><br><small>${escapeHtml(f.fatherName || '')}</small></td>
      <td>${escapeHtml(f.className)}</td>
      <td>${escapeHtml(f.month)}</td>
      <td>${formatCurrency(f.total)}</td>
      <td>${formatCurrency(f.paid)}</td>
      <td>${formatCurrency(f.remaining)}</td>
      <td><span class="badge badge-${f.status === 'paid' ? 'success' : f.status === 'partial' ? 'warning' : 'danger'}">${f.status}</span></td>
      <td class="actions">
        <button class="btn btn-sm btn-primary" onclick="viewFeeReceipt('${f.id}')" title="Receipt"><i class="fas fa-receipt"></i></button>
        <button class="btn btn-sm" style="background:var(--gray-200);" onclick="editFee('${f.id}')"><i class="fas fa-edit"></i></button>
        ${f.remaining > 0 ? `<button class="btn btn-sm btn-whatsapp" onclick="sendFeeReminder('${f.id}')"><i class="fab fa-whatsapp"></i></button>` : ''}
      </td>
    </tr>`;
  });
  html += '</tbody></table></div>';
  container.innerHTML = html;
}

function sendFeeReminder(feeId) {
  const fee = getRecordById(DB_KEYS.fees, feeId);
  if (!fee) return;
  const student = getStudentById(fee.studentId);
  if (!student) return;
  openParentWhatsApp(student, 'feeReminder', {
    month: fee.month,
    total: fee.total,
    remaining: fee.remaining
  });
}

function generateFeeReceiptHTML(fee) {
  const settings = getSettings();
  const student = getStudentById(fee.studentId) || {};
  return `
    <div id="fee-receipt-print" style="max-width:700px;margin:0 auto;padding:30px;font-family:Arial,sans-serif;border:2px solid #1e3a5f;">
      <div style="text-align:center;border-bottom:2px solid #c9a227;padding-bottom:16px;margin-bottom:20px;">
        <img src="' + (typeof getLogoSrc === 'function' ? getLogoSrc() : 'assets/logo.png') + '" style="width:70px;height:70px;border-radius:50%;border:2px solid #c9a227;">
        <h2 style="color:#1e3a5f;margin:8px 0 4px;">${settings.schoolName}</h2>
        <p style="color:#c9a227;font-weight:600;margin:0;">${settings.tagline}</p>
        <p style="margin:4px 0;font-size:0.9rem;">Fee Receipt</p>
      </div>
      <div style="display:flex;justify-content:space-between;margin-bottom:16px;font-size:0.9rem;">
        <div>
          <p><strong>Receipt No:</strong> ${fee.receiptNo || '-'}</p>
          <p><strong>Date:</strong> ${formatDate(fee.paymentDate || fee.createdAt)}</p>
        </div>
        <div style="text-align:right;">
          <p><strong>Student ID:</strong> ${fee.studentId}</p>
          <p><strong>Class:</strong> ${fee.className} - ${student.section || fee.section || ''}</p>
        </div>
      </div>
      <table style="width:100%;border-collapse:collapse;margin-bottom:16px;font-size:0.9rem;">
        <tr><td style="padding:6px;border:1px solid #ddd;"><strong>Student Name</strong></td><td style="padding:6px;border:1px solid #ddd;">${fee.studentName}</td></tr>
        <tr><td style="padding:6px;border:1px solid #ddd;"><strong>Father Name</strong></td><td style="padding:6px;border:1px solid #ddd;">${fee.fatherName || student.fatherName || '-'}</td></tr>
        <tr><td style="padding:6px;border:1px solid #ddd;"><strong>Month</strong></td><td style="padding:6px;border:1px solid #ddd;">${fee.month}</td></tr>
      </table>
      <table style="width:100%;border-collapse:collapse;font-size:0.9rem;">
        <thead><tr style="background:#1e3a5f;color:white;">
          <th style="padding:8px;text-align:left;">Description</th><th style="padding:8px;text-align:right;">Amount (PKR)</th>
        </tr></thead>
        <tbody>
          <tr><td style="padding:6px;border:1px solid #ddd;">Tuition Fee</td><td style="padding:6px;border:1px solid #ddd;text-align:right;">${Number(fee.tuitionFee||0).toLocaleString()}</td></tr>
          ${fee.admissionFee ? `<tr><td style="padding:6px;border:1px solid #ddd;">Admission Fee</td><td style="padding:6px;border:1px solid #ddd;text-align:right;">${Number(fee.admissionFee).toLocaleString()}</td></tr>` : ''}
          ${fee.examFee ? `<tr><td style="padding:6px;border:1px solid #ddd;">Exam Fee</td><td style="padding:6px;border:1px solid #ddd;text-align:right;">${Number(fee.examFee).toLocaleString()}</td></tr>` : ''}
          ${fee.transportFee ? `<tr><td style="padding:6px;border:1px solid #ddd;">Transport Fee</td><td style="padding:6px;border:1px solid #ddd;text-align:right;">${Number(fee.transportFee).toLocaleString()}</td></tr>` : ''}
          ${fee.otherFee ? `<tr><td style="padding:6px;border:1px solid #ddd;">Other</td><td style="padding:6px;border:1px solid #ddd;text-align:right;">${Number(fee.otherFee).toLocaleString()}</td></tr>` : ''}
          ${fee.discount ? `<tr><td style="padding:6px;border:1px solid #ddd;">Discount</td><td style="padding:6px;border:1px solid #ddd;text-align:right;">-${Number(fee.discount).toLocaleString()}</td></tr>` : ''}
          ${fee.fine ? `<tr><td style="padding:6px;border:1px solid #ddd;">Fine</td><td style="padding:6px;border:1px solid #ddd;text-align:right;">${Number(fee.fine).toLocaleString()}</td></tr>` : ''}
          <tr style="font-weight:700;background:#f3f4f6;"><td style="padding:8px;border:1px solid #ddd;">Total</td><td style="padding:8px;border:1px solid #ddd;text-align:right;">${Number(fee.total).toLocaleString()}</td></tr>
          <tr><td style="padding:6px;border:1px solid #ddd;">Paid</td><td style="padding:6px;border:1px solid #ddd;text-align:right;color:green;">${Number(fee.paid).toLocaleString()}</td></tr>
          <tr><td style="padding:6px;border:1px solid #ddd;">Remaining</td><td style="padding:6px;border:1px solid #ddd;text-align:right;color:${fee.remaining>0?'red':'green'};">${Number(fee.remaining).toLocaleString()}</td></tr>
        </tbody>
      </table>
      <div style="margin-top:30px;display:flex;justify-content:space-between;">
        <div style="text-align:center;"><p style="border-top:1px solid #333;padding-top:4px;width:150px;font-size:0.8rem;">Accountant</p></div>
        <div style="text-align:center;"><p style="border-top:1px solid #333;padding-top:4px;width:150px;font-size:0.8rem;">Principal</p></div>
      </div>
      <p style="text-align:center;margin-top:20px;font-size:0.75rem;color:#666;">This is a computer generated receipt. WhatsApp: ${settings.whatsapp}</p>
    </div>
  `;
}
