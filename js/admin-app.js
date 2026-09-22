// Admin Dashboard Application Logic
if (!requireAuth(['admin'])) {}

const session = getCurrentUser();
if (session) {
  const nameEl = document.getElementById('user-name');
  const avEl = document.getElementById('user-avatar');
  if (nameEl) nameEl.textContent = session.name;
  if (avEl) avEl.textContent = session.name.charAt(0);
}

function showPage(page) {
  document.querySelectorAll('.page-section').forEach(p => p.style.display = 'none');
  const el = document.getElementById('page-' + page);
  if (el) el.style.display = 'block';
  document.querySelectorAll('.sidebar-nav a').forEach(a => a.classList.remove('active'));
  const navLink = document.querySelector('.sidebar-nav a[data-page="' + page + '"]');
  if (navLink) navLink.classList.add('active');
  const titles = {
    dashboard:'Dashboard',students:'Students',parents:'Parents',teachers:'Teachers',classes:'Classes & Subjects',
    attendance:'Attendance',fees:'Fee Management',defaulters:'Fee Defaulters',exams:'Exams',results:'Results',
    timetable:'Timetable',homework:'Homework',whatsapp:'WhatsApp Contacts',bulkwa:'Bulk WhatsApp',
    admissions:'Admissions',notices:'Notices',events:'Events',library:'Library',transport:'Transport',
    payroll:'Payroll',idcards:'ID Cards',certificates:'Certificates',reports:'Reports',
    notifications:'Notifications',settings:'Settings',search:'Search Results'
  };
  document.getElementById('page-title').textContent = titles[page] || page;
  closeSidebar();
  if (page === 'dashboard') loadDashboard();
  if (page === 'students') loadStudents();
  if (page === 'parents') loadParents();
  if (page === 'teachers') loadTeachers();
  if (page === 'classes') loadClasses();
  if (page === 'attendance') { initAttendanceFilters(); loadAttendanceForm(); }
  if (page === 'fees') loadFees();
  if (page === 'defaulters') loadDefaulters();
  if (page === 'exams') loadExams();
  if (page === 'results') loadResults();
  if (page === 'timetable') { initTTFilters(); loadTimetable(); }
  if (page === 'homework') loadHomework();
  if (page === 'whatsapp') { initWAFilters(); loadWhatsAppContacts(); }
  if (page === 'bulkwa') { initBulkFilters(); loadBulkWA(); }
  if (page === 'admissions') loadAdmissions();
  if (page === 'notices') loadNotices();
  if (page === 'events') loadEvents();
  if (page === 'library') loadLibrary();
  if (page === 'transport') loadTransport();
  if (page === 'payroll') loadPayroll();
  if (page === 'idcards') initIDCards();
  if (page === 'certificates') initCertificates();
  if (page === 'notifications') renderNotifications('notifications-list');
  if (page === 'settings') loadSettingsForm();
}

function switchTab(btn, tabId) {
  btn.parentElement.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  btn.closest('.content-card-body').querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
  document.getElementById(tabId).classList.add('active');
}

function loadDashboard() {
  const students = getAllStudents().filter(s => s.status === 'active');
  const teachers = getAllTeachers().filter(t => t.status === 'active');
  const parents = getAllParents();
  const classes = getRecords(DB_KEYS.classes);
  const attStats = getTodayAttendanceStats();
  const pendingFees = getPendingFees().length;
  const todayCollection = getTodayCollection();
  const newAdmissions = getAllAdmissions().filter(a => a.status === 'new').length;

  document.getElementById('dashboard-stats').innerHTML =
    '<div class="stat-card"><div class="icon blue"><i class="fas fa-user-graduate"></i></div><div class="info"><h3>'+students.length+'</h3><p>Total Students</p></div></div>'+
    '<div class="stat-card"><div class="icon green"><i class="fas fa-chalkboard-teacher"></i></div><div class="info"><h3>'+teachers.length+'</h3><p>Total Teachers</p></div></div>'+
    '<div class="stat-card"><div class="icon purple"><i class="fas fa-users"></i></div><div class="info"><h3>'+parents.length+'</h3><p>Total Parents</p></div></div>'+
    '<div class="stat-card"><div class="icon teal"><i class="fas fa-school"></i></div><div class="info"><h3>'+classes.length+'</h3><p>Total Classes</p></div></div>'+
    '<div class="stat-card"><div class="icon green"><i class="fas fa-check-circle"></i></div><div class="info"><h3>'+attStats.present+'</h3><p>Today Present</p></div></div>'+
    '<div class="stat-card"><div class="icon red"><i class="fas fa-times-circle"></i></div><div class="info"><h3>'+attStats.absent+'</h3><p>Today Absent</p></div></div>'+
    '<div class="stat-card"><div class="icon orange"><i class="fas fa-exclamation-triangle"></i></div><div class="info"><h3>'+pendingFees+'</h3><p>Pending Fees</p></div></div>'+
    '<div class="stat-card"><div class="icon gold"><i class="fas fa-coins"></i></div><div class="info"><h3>'+formatCurrency(todayCollection)+'</h3><p>Today Collection</p></div></div>'+
    '<div class="stat-card"><div class="icon blue"><i class="fas fa-user-plus"></i></div><div class="info"><h3>'+newAdmissions+'</h3><p>New Admissions</p></div></div>';

  const classCounts = {};
  students.forEach(s => { classCounts[s.className] = (classCounts[s.className]||0)+1; });
  const maxCount = Math.max(...Object.values(classCounts),1);
  document.getElementById('chart-students').innerHTML = Object.entries(classCounts).slice(0,8).map(function(e){
    return '<div class="bar-group"><div class="bar" style="height:'+(e[1]/maxCount*100)+'%;"></div><div class="bar-label">'+e[0].replace('Class ','C')+'</div></div>';
  }).join('');

  document.getElementById('chart-attendance').innerHTML =
    '<div style="display:flex;gap:20px;flex-wrap:wrap;">'+
    '<div><span class="badge badge-success">Present: '+attStats.present+'</span></div>'+
    '<div><span class="badge badge-danger">Absent: '+attStats.absent+'</span></div>'+
    '<div><span class="badge badge-warning">Late: '+attStats.late+'</span></div>'+
    '<div><span class="badge badge-info">Leave: '+attStats.leave+'</span></div></div>'+
    '<p style="margin-top:16px;color:var(--gray-500);">Total marked: '+attStats.total+'</p>';

  const allFees = getAllFees();
  const totalDue = allFees.reduce(function(s,f){return s+f.total;},0);
  const totalPaid = allFees.reduce(function(s,f){return s+f.paid;},0);
  document.getElementById('chart-fees').innerHTML =
    '<p><strong>Total Due:</strong> '+formatCurrency(totalDue)+'</p>'+
    '<p><strong>Collected:</strong> '+formatCurrency(totalPaid)+'</p>'+
    '<p><strong>Outstanding:</strong> '+formatCurrency(totalDue-totalPaid)+'</p>'+
    '<div style="background:var(--gray-200);border-radius:8px;height:12px;margin-top:12px;overflow:hidden;">'+
    '<div style="background:var(--green);height:100%;width:'+(totalDue?Math.round(totalPaid/totalDue*100):0)+'%;"></div></div>';

  renderNotifications('dashboard-notifs');
  updateNotifBadge();
}

let currentStudentPage = 1;
function loadStudents() {
  populateClassSelects();
  renderStudentsTable('students-table', {
    search: (document.getElementById('student-search')||{}).value||'',
    filters: {
      className: (document.getElementById('student-class-filter')||{}).value||'',
      section: (document.getElementById('student-section-filter')||{}).value||'',
      status: (document.getElementById('student-status-filter')||{}).value||''
    },
    page: currentStudentPage
  });
}
function loadStudentsPage(p) { currentStudentPage = p; loadStudents(); }

function populateClassSelects() {
  const classes = getRecords(DB_KEYS.classes);
  ['student-class-filter','stu-class','att-class','tt-class','wa-class','bulk-class'].forEach(function(id){
    const el = document.getElementById(id);
    if (!el) return;
    const current = el.value;
    const isFilter = id.indexOf('filter')>=0 || id==='wa-class' || id==='bulk-class';
    el.innerHTML = (isFilter?'<option value="">All Classes</option>':'') + classes.map(function(c){return '<option value="'+c.name+'">'+c.name+'</option>';}).join('');
    if (current) el.value = current;
  });
}

function openAddStudentModal() {
  document.getElementById('student-modal-title').textContent = 'Add Student';
  document.getElementById('student-edit-id').value = '';
  ['stu-name','stu-father','stu-mother','stu-dob','stu-phone','stu-father-phone','stu-whatsapp','stu-address','stu-prev-school','stu-roll'].forEach(function(id){
    var el = document.getElementById(id); if(el) el.value='';
  });
  populateClassSelects();
  openModal('modal-student');
}

function editStudent(id) {
  var s = getStudentById(id);
  if (!s) return;
  document.getElementById('student-modal-title').textContent = 'Edit Student';
  document.getElementById('student-edit-id').value = id;
  document.getElementById('stu-name').value = s.name||'';
  document.getElementById('stu-father').value = s.fatherName||'';
  document.getElementById('stu-mother').value = s.motherName||'';
  document.getElementById('stu-dob').value = s.dob||'';
  document.getElementById('stu-gender').value = s.gender||'Male';
  populateClassSelects();
  document.getElementById('stu-class').value = s.className||'';
  document.getElementById('stu-section').value = s.section||'A';
  document.getElementById('stu-roll').value = s.rollNo||'';
  document.getElementById('stu-phone').value = s.phone||'';
  document.getElementById('stu-father-phone').value = s.fatherPhone||'';
  document.getElementById('stu-whatsapp').value = s.parentWhatsApp||'';
  document.getElementById('stu-address').value = s.address||'';
  document.getElementById('stu-prev-school').value = s.previousSchool||'';
  document.getElementById('stu-status').value = s.status||'active';
  openModal('modal-student');
}

function saveStudent() {
  var id = document.getElementById('student-edit-id').value;
  var data = {
    name: document.getElementById('stu-name').value.trim(),
    fatherName: document.getElementById('stu-father').value.trim(),
    motherName: document.getElementById('stu-mother').value.trim(),
    dob: document.getElementById('stu-dob').value,
    gender: document.getElementById('stu-gender').value,
    className: document.getElementById('stu-class').value,
    section: document.getElementById('stu-section').value,
    rollNo: parseInt(document.getElementById('stu-roll').value)||0,
    phone: document.getElementById('stu-phone').value.trim(),
    fatherPhone: document.getElementById('stu-father-phone').value.trim(),
    parentWhatsApp: document.getElementById('stu-whatsapp').value.trim(),
    address: document.getElementById('stu-address').value.trim(),
    previousSchool: document.getElementById('stu-prev-school').value.trim(),
    status: document.getElementById('stu-status').value
  };
  if (!data.name || !data.fatherName || !data.className) { showToast('Please fill required fields','error'); return; }
  if (id) { updateStudent(id, data); showToast('Student updated'); }
  else { data.admissionDate = new Date().toISOString().split('T')[0]; addStudent(data); showToast('Student added'); }
  closeModal('modal-student');
  loadStudents();
}

function viewStudent(id) { editStudent(id); }
function confirmDeleteStudent(id) {
  if (confirmAction('Delete this student?')) { deleteStudent(id); showToast('Deleted'); loadStudents(); }
}

function loadParents() { renderParentsTable('parents-table', (document.getElementById('parent-search')||{}).value||''); }
function openAddParentModal() {
  var fatherName = prompt('Father Name:');
  if (!fatherName) return;
  var phone = prompt('Phone / WhatsApp:')||'';
  addParent({fatherName:fatherName,motherName:'',phone:phone,whatsapp:phone,email:'',address:'',children:[],status:'active'});
  showToast('Parent added'); loadParents();
}
function editParent(id) {
  var p = getParentById(id); if(!p) return;
  var name = prompt('Father Name:', p.fatherName);
  if (name===null) return;
  updateParent(id,{fatherName:name}); showToast('Updated'); loadParents();
}

function loadTeachers() { renderTeachersTable('teachers-table', (document.getElementById('teacher-search')||{}).value||''); }
function openAddTeacherModal() {
  var name = prompt('Teacher Name:'); if(!name) return;
  var phone = prompt('Phone:')||'';
  addTeacher({name:name,phone:phone,whatsapp:phone,email:'',qualification:'',experience:0,subjects:[],classes:[],joiningDate:new Date().toISOString().split('T')[0],salary:30000,status:'active'});
  showToast('Teacher added'); loadTeachers();
}
function editTeacher(id) {
  var t = getTeacherById(id); if(!t) return;
  var name = prompt('Name:', t.name); if(name===null) return;
  updateTeacher(id,{name:name}); showToast('Updated'); loadTeachers();
}

function loadClasses() {
  var classes = getRecords(DB_KEYS.classes);
  document.getElementById('classes-list').innerHTML = '<div class="table-responsive"><table class="data-table"><thead><tr><th>Class</th><th>Sections</th><th>Capacity</th><th>Students</th></tr></thead><tbody>'+
    classes.map(function(c){
      var count = getAllStudents().filter(function(s){return s.className===c.name&&s.status==='active';}).length;
      return '<tr><td><strong>'+c.name+'</strong></td><td>'+(c.sections||[]).join(', ')+'</td><td>'+c.capacity+'</td><td>'+count+'</td></tr>';
    }).join('')+'</tbody></table></div>';
  var subjects = getRecords(DB_KEYS.subjects);
  document.getElementById('subjects-list').innerHTML = '<div class="table-responsive"><table class="data-table"><thead><tr><th>Code</th><th>Subject</th></tr></thead><tbody>'+
    subjects.map(function(s){return '<tr><td>'+s.code+'</td><td>'+s.name+'</td></tr>';}).join('')+'</tbody></table></div>';
}

function initAttendanceFilters() {
  populateClassSelects();
  var dateEl = document.getElementById('att-date');
  if (dateEl && !dateEl.value) dateEl.value = new Date().toISOString().split('T')[0];
}
function loadAttendanceForm() {
  var date = (document.getElementById('att-date')||{}).value || new Date().toISOString().split('T')[0];
  var cls = (document.getElementById('att-class')||{}).value || 'Class 5';
  var sec = (document.getElementById('att-section')||{}).value || 'A';
  renderAttendanceForm('attendance-form', cls, sec, date);
}
function showAbsentWhatsApp() {
  showPage('bulkwa');
  document.getElementById('bulk-type').value = 'absent';
  loadBulkWA();
}

function loadFees() {
  renderFeesTable('fees-table', {
    search: (document.getElementById('fee-search')||{}).value||'',
    status: (document.getElementById('fee-status-filter')||{}).value||''
  });
}
function openAddFeeModal() {
  var stuId = prompt('Enter Student ID (e.g. STU_001):');
  if (!stuId) return;
  var student = getStudentById(stuId);
  if (!student) { showToast('Student not found','error'); return; }
  var month = prompt('Month:','September 2025')||'September 2025';
  var tuition = parseInt(prompt('Tuition Fee:','3500'))||0;
  var paid = parseInt(prompt('Amount Paid:',String(tuition)))||0;
  addFee({studentId:student.id,studentName:student.name,fatherName:student.fatherName,className:student.className,section:student.section,month:month,tuitionFee:tuition,admissionFee:0,examFee:0,transportFee:0,otherFee:0,discount:0,fine:0,paid:paid});
  showToast('Fee added'); loadFees();
}
function editFee(id) {
  var fee = getRecordById(DB_KEYS.fees, id); if(!fee) return;
  var paid = parseInt(prompt('Update Paid Amount:', fee.paid));
  if (isNaN(paid)) return;
  updateFee(id, Object.assign({}, fee, {paid:paid}));
  showToast('Updated'); loadFees();
}
function viewFeeReceipt(id) {
  var fee = getRecordById(DB_KEYS.fees, id); if(!fee) return;
  document.getElementById('receipt-content').innerHTML = generateFeeReceiptHTML(fee);
  openModal('modal-receipt');
}
function loadDefaulters() {
  var fees = getPendingFees();
  var container = document.getElementById('defaulters-table');
  if (fees.length===0) { container.innerHTML='<div class="empty-state"><p>No fee defaulters</p></div>'; return; }
  var html = '<div class="table-responsive"><table class="data-table"><thead><tr><th>#</th><th>Student</th><th>Father</th><th>Class</th><th>Month</th><th>Total</th><th>Paid</th><th>Remaining</th><th>WhatsApp</th></tr></thead><tbody>';
  fees.forEach(function(f,i){
    var student = getStudentById(f.studentId);
    html += '<tr><td>'+(i+1)+'</td><td>'+escapeHtml(f.studentName)+'</td><td>'+escapeHtml(f.fatherName||'')+'</td><td>'+escapeHtml(f.className)+'</td><td>'+escapeHtml(f.month)+'</td><td>'+formatCurrency(f.total)+'</td><td>'+formatCurrency(f.paid)+'</td><td>'+formatCurrency(f.remaining)+'</td><td>'+(student?'<button class="btn btn-sm btn-whatsapp" onclick="sendFeeReminder(\''+f.id+'\')"><i class="fab fa-whatsapp"></i></button>':'-')+'</td></tr>';
  });
  html += '</tbody></table></div>';
  container.innerHTML = html;
}

function loadExams() { renderExamsTable('exams-table'); }
function openAddExamModal() {
  var name = prompt('Exam Name:'); if(!name) return;
  addExam({name:name,startDate:new Date().toISOString().split('T')[0],endDate:'',classes:['All'],status:'scheduled',totalMarks:100,passingMarks:40});
  showToast('Exam added'); loadExams();
}
function editExam(id) {
  var e = getRecordById(DB_KEYS.exams,id); if(!e) return;
  var name = prompt('Exam Name:',e.name); if(name===null) return;
  updateExam(id,{name:name}); showToast('Updated'); loadExams();
}
function loadResults() { renderResultsTable('results-table',{search:(document.getElementById('result-search')||{}).value||''}); }

function initTTFilters() { populateClassSelects(); }
function loadTimetable() {
  var cls = (document.getElementById('tt-class')||{}).value||'Class 5';
  var sec = (document.getElementById('tt-section')||{}).value||'A';
  renderTimetable('timetable-view',cls,sec);
}

function loadHomework() { renderHomeworkTable('homework-table'); }
function openAddHomeworkModal() {
  var title = prompt('Homework Title:'); if(!title) return;
  var subject = prompt('Subject:','Mathematics')||'Mathematics';
  var className = prompt('Class:','Class 5')||'Class 5';
  addHomework({title:title,subject:subject,className:className,section:'A',description:title,dueDate:new Date().toISOString().split('T')[0],teacher:'Admin',status:'active'});
  showToast('Added'); loadHomework();
}

function initWAFilters() { populateClassSelects(); }
function loadWhatsAppContacts() {
  renderWhatsAppContactsTable('wa-contacts-table',{
    search:(document.getElementById('wa-search')||{}).value||'',
    className:(document.getElementById('wa-class')||{}).value||'',
    section:(document.getElementById('wa-section')||{}).value||''
  });
}
function initBulkFilters() { populateClassSelects(); }
function loadBulkWA() {
  var type = (document.getElementById('bulk-type')||{}).value||'all_parents';
  renderBulkWhatsApp('bulk-wa-table',type,{
    className:(document.getElementById('bulk-class')||{}).value||'',
    section:(document.getElementById('bulk-section')||{}).value||''
  });
}

function loadAdmissions() { renderAdmissionsTable('admissions-table',(document.getElementById('adm-status')||{}).value||''); }

function loadNotices() {
  var notices = getRecords(DB_KEYS.notices);
  document.getElementById('notices-list').innerHTML = notices.map(function(n){
    return '<div class="card" style="margin-bottom:12px;"><div class="d-flex justify-between"><strong>'+escapeHtml(n.title)+'</strong><span class="badge badge-info">'+n.category+'</span></div><p style="margin-top:8px;font-size:0.9rem;">'+escapeHtml(n.content)+'</p><small style="color:var(--gray-500);">'+formatDate(n.date)+'</small></div>';
  }).join('') || '<div class="empty-state"><p>No notices</p></div>';
}
function openAddNoticeModal() {
  var title = prompt('Notice Title:'); if(!title) return;
  var content = prompt('Content:')||'';
  addRecord(DB_KEYS.notices,{title:title,content:content,category:'General',date:new Date().toISOString().split('T')[0],published:true,author:'Admin'});
  showToast('Notice added'); loadNotices();
}

function loadEvents() {
  var events = getRecords(DB_KEYS.events);
  document.getElementById('events-list').innerHTML = events.map(function(e){
    return '<div class="card" style="margin-bottom:12px;"><strong>'+escapeHtml(e.title)+'</strong><p style="font-size:0.9rem;margin-top:6px;"><i class="fas fa-calendar"></i> '+formatDate(e.date)+' '+escapeHtml(e.time||'')+' <i class="fas fa-map-marker-alt"></i> '+escapeHtml(e.location||'')+'</p><p style="font-size:0.85rem;color:var(--gray-500);">'+escapeHtml(e.description||'')+'</p></div>';
  }).join('') || '<div class="empty-state"><p>No events</p></div>';
}
function openAddEventModal() {
  var title = prompt('Event Title:'); if(!title) return;
  addRecord(DB_KEYS.events,{title:title,date:new Date().toISOString().split('T')[0],time:'10:00 AM',location:'School',description:'',status:'upcoming'});
  showToast('Event added'); loadEvents();
}

function loadLibrary() {
  var books = getRecords(DB_KEYS.books);
  document.getElementById('library-list').innerHTML = '<div class="table-responsive"><table class="data-table"><thead><tr><th>Title</th><th>Author</th><th>Category</th><th>Qty</th><th>Available</th></tr></thead><tbody>'+
    books.map(function(b){return '<tr><td>'+escapeHtml(b.title)+'</td><td>'+escapeHtml(b.author)+'</td><td>'+escapeHtml(b.category)+'</td><td>'+b.quantity+'</td><td>'+b.available+'</td></tr>';}).join('')+'</tbody></table></div>';
}

function loadTransport() {
  var vehicles = getRecords(DB_KEYS.transport);
  document.getElementById('transport-list').innerHTML = vehicles.map(function(v){
    return '<div class="card" style="margin-bottom:12px;"><strong>'+escapeHtml(v.vehicleNo)+'</strong> - '+escapeHtml(v.route)+'<p style="font-size:0.9rem;">Driver: '+escapeHtml(v.driver)+' ('+escapeHtml(v.driverPhone)+') | Fee: '+formatCurrency(v.fee)+'</p></div>';
  }).join('') || '<div class="empty-state"><p>No transport</p></div>';
}

function loadPayroll() {
  var payroll = getRecords(DB_KEYS.payroll);
  document.getElementById('payroll-list').innerHTML = '<div class="table-responsive"><table class="data-table"><thead><tr><th>Teacher</th><th>Month</th><th>Basic</th><th>Bonus</th><th>Deduction</th><th>Net</th><th>Status</th></tr></thead><tbody>'+
    payroll.map(function(p){return '<tr><td>'+escapeHtml(p.teacherName)+'</td><td>'+escapeHtml(p.month)+'</td><td>'+formatCurrency(p.basicSalary)+'</td><td>'+formatCurrency(p.bonus)+'</td><td>'+formatCurrency(p.deduction)+'</td><td><strong>'+formatCurrency(p.netSalary)+'</strong></td><td><span class="badge badge-success">'+p.status+'</span></td></tr>';}).join('')+'</tbody></table></div>';
}

function initIDCards() {
  var students = getAllStudents().filter(function(s){return s.status==='active';});
  document.getElementById('idcard-student').innerHTML = '<option value="">Select Student</option>'+students.map(function(s){return '<option value="'+s.id+'">'+s.name+' ('+s.className+')</option>';}).join('');
}
function generateIDCard() {
  var id = document.getElementById('idcard-student').value; if(!id) return;
  var s = getStudentById(id); if(!s) return;
  var settings = getSettings();
  document.getElementById('idcard-preview').innerHTML =
    '<div class="id-card"><div class="id-card-header"><img src="'+getLogoSrc()+'" alt="Logo"><h4>'+settings.schoolName+'</h4></div>'+
    '<div class="id-card-body"><div class="photo"><i class="fas fa-user"></i></div><h3>'+escapeHtml(s.name)+'</h3>'+
    '<p>ID: '+s.id+'</p><p>Class: '+escapeHtml(s.className)+' - '+escapeHtml(s.section)+'</p><p>Roll: '+(s.rollNo||'-')+'</p>'+
    '<p style="font-size:0.75rem;margin-top:8px;">Father: '+escapeHtml(s.fatherName)+'</p></div>'+
    '<div class="id-card-footer">'+settings.tagline+' | WhatsApp: '+settings.whatsapp+'</div></div>';
}

function initCertificates() {
  var students = getAllStudents().filter(function(s){return s.status==='active';});
  document.getElementById('cert-student').innerHTML = students.map(function(s){return '<option value="'+s.id+'">'+s.name+' ('+s.className+')</option>';}).join('');
}
function generateCertificate() {
  var type = document.getElementById('cert-type').value;
  var sid = document.getElementById('cert-student').value;
  var s = getStudentById(sid); if(!s) return;
  var settings = getSettings();
  var titles = {character:'Character Certificate',leaving:'School Leaving Certificate',achievement:'Achievement Certificate',participation:'Participation Certificate'};
  var text = type==='character'?'He/She bears a good moral character.':type==='leaving'?'He/She is leaving the school with our best wishes.':'He/She has actively participated / achieved excellence.';
  document.getElementById('certificate-preview').innerHTML =
    '<div style="max-width:700px;margin:0 auto;padding:40px;border:4px double #c9a227;text-align:center;font-family:serif;">'+
    '<img src="'+getLogoSrc()+'" style="width:80px;height:80px;border-radius:50%;border:2px solid #c9a227;">'+
    '<h2 style="color:#1e3a5f;margin:12px 0 4px;">'+settings.schoolName+'</h2>'+
    '<p style="color:#c9a227;font-weight:600;">'+settings.tagline+'</p>'+
    '<h1 style="margin:30px 0;color:#1e3a5f;font-size:1.8rem;border-bottom:2px solid #c9a227;display:inline-block;padding-bottom:8px;">'+titles[type]+'</h1>'+
    '<p style="font-size:1.1rem;line-height:1.8;margin:24px 0;">This is to certify that <strong>'+escapeHtml(s.name)+'</strong>, son/daughter of <strong>'+escapeHtml(s.fatherName)+'</strong>, student of <strong>'+escapeHtml(s.className)+'</strong>, has been a student of this institution. '+text+'</p>'+
    '<div style="display:flex;justify-content:space-between;margin-top:50px;"><div><p style="border-top:1px solid #333;padding-top:4px;width:150px;margin:0 auto;">Date</p></div><div><p style="border-top:1px solid #333;padding-top:4px;width:150px;margin:0 auto;">Principal</p></div></div></div>';
}

function globalSearch(term) {
  if (!term || term.length < 2) return;
  showPage('search');
  var students = filterData(getAllStudents(), term, ['name','fatherName','admissionNo','id','phone','parentWhatsApp']);
  var teachers = filterData(getAllTeachers(), term, ['name','phone','email']);
  var parents = filterData(getAllParents(), term, ['fatherName','phone','whatsapp']);
  var html = '';
  if (students.length) {
    html += '<h4 style="margin-bottom:10px;">Students ('+students.length+')</h4>';
    students.slice(0,10).forEach(function(s){
      html += '<div class="card" style="margin-bottom:8px;padding:12px;cursor:pointer;" onclick="showPage(\'students\');editStudent(\''+s.id+'\')"><strong>'+escapeHtml(s.name)+'</strong> - '+escapeHtml(s.className)+' | '+escapeHtml(s.admissionNo)+'</div>';
    });
  }
  if (teachers.length) {
    html += '<h4 style="margin:16px 0 10px;">Teachers ('+teachers.length+')</h4>';
    teachers.slice(0,5).forEach(function(t){
      html += '<div class="card" style="margin-bottom:8px;padding:12px;"><strong>'+escapeHtml(t.name)+'</strong> - '+escapeHtml(t.phone||'')+'</div>';
    });
  }
  if (parents.length) {
    html += '<h4 style="margin:16px 0 10px;">Parents ('+parents.length+')</h4>';
    parents.slice(0,5).forEach(function(p){
      html += '<div class="card" style="margin-bottom:8px;padding:12px;"><strong>'+escapeHtml(p.fatherName)+'</strong> - '+escapeHtml(p.phone||'')+'</div>';
    });
  }
  if (!html) html = '<div class="empty-state"><p>No results found</p></div>';
  document.getElementById('search-results').innerHTML = html;
}

document.addEventListener('DOMContentLoaded', function() {
  loadDashboard();
  updateNotifBadge();
  if (typeof applyBranding === 'function') applyBranding();
});
