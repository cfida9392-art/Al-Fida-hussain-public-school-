// ============================================================
// AL FIDA HUSSAIN PUBLIC SCHOOLS - Database Layer (LocalStorage)
// ============================================================

const DB_KEYS = {
  students: 'school_students',
  parents: 'school_parents',
  teachers: 'school_teachers',
  classes: 'school_classes',
  subjects: 'school_subjects',
  attendance: 'school_attendance',
  fees: 'school_fees',
  exams: 'school_exams',
  results: 'school_results',
  timetable: 'school_timetable',
  homework: 'school_homework',
  admissions: 'school_admissions',
  notices: 'school_notices',
  events: 'school_events',
  books: 'school_books',
  transport: 'school_transport',
  payroll: 'school_payroll',
  notifications: 'school_notifications',
  settings: 'school_settings',
  users: 'school_users',
  gallery: 'school_gallery',
  libraryIssues: 'school_library_issues'
};

// Generate unique ID
function generateId(prefix = 'ID') {
  return prefix + '_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Generic CRUD
function loadData(key) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Error loading', key, e);
    return [];
  }
}

function saveData(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (e) {
    console.error('Error saving', key, e);
    return false;
  }
}

function getRecords(key) {
  return loadData(key);
}

function getRecordById(key, id) {
  const records = loadData(key);
  return records.find(r => r.id === id) || null;
}

function addRecord(key, record) {
  const records = loadData(key);
  if (!record.id) record.id = generateId(key.replace('school_', '').toUpperCase().slice(0, 3));
  record.createdAt = new Date().toISOString();
  record.updatedAt = new Date().toISOString();
  records.push(record);
  saveData(key, records);
  return record;
}

function updateRecord(key, id, updates) {
  const records = loadData(key);
  const index = records.findIndex(r => r.id === id);
  if (index === -1) return null;
  records[index] = { ...records[index], ...updates, updatedAt: new Date().toISOString() };
  saveData(key, records);
  return records[index];
}

function deleteRecord(key, id) {
  let records = loadData(key);
  const initialLength = records.length;
  records = records.filter(r => r.id !== id);
  saveData(key, records);
  return records.length < initialLength;
}

// Settings helpers
function getSettings() {
  const settings = localStorage.getItem(DB_KEYS.settings);
  if (settings) return JSON.parse(settings);
  return getDefaultSettings();
}

function saveSettings(settings) {
  localStorage.setItem(DB_KEYS.settings, JSON.stringify(settings));
}

function getDefaultSettings() {
  return {
    schoolName: 'AL FIDA HUSSAIN PUBLIC SCHOOLS',
    tagline: 'Quality Education, Bright Future',
    whatsapp: '03168122916',
    whatsappIntl: '923168122916',
    phone: '03168122916',
    email: 'info@alfidahussain.edu.pk',
    address: 'Pakistan',
    academicSession: '2025-2026',
    logo: 'assets/logo.png',
    currency: 'PKR',
    gradeSystem: [
      { min: 90, grade: 'A+', remark: 'Outstanding' },
      { min: 80, grade: 'A', remark: 'Excellent' },
      { min: 70, grade: 'B', remark: 'Very Good' },
      { min: 60, grade: 'C', remark: 'Good' },
      { min: 50, grade: 'D', remark: 'Satisfactory' },
      { min: 0, grade: 'F', remark: 'Fail' }
    ],
    theme: 'light'
  };
}

// Initialize demo data on first launch
function initializeDatabase() {
  if (localStorage.getItem('school_db_initialized')) return;

  // Settings
  saveSettings(getDefaultSettings());

  // Users
  const users = [
    { id: 'USR_ADMIN', username: 'admin', password: 'admin123', role: 'admin', name: 'Super Admin', status: 'active' },
    { id: 'USR_TEACHER', username: 'teacher', password: 'teacher123', role: 'teacher', name: 'Demo Teacher', teacherId: 'TCH_001', status: 'active' },
    { id: 'USR_ACCOUNTANT', username: 'accountant', password: 'accountant123', role: 'accountant', name: 'Demo Accountant', status: 'active' },
    { id: 'USR_PARENT', username: 'parent', password: 'parent123', role: 'parent', name: 'Demo Parent', parentId: 'PAR_001', status: 'active' },
    { id: 'USR_STUDENT', username: 'student', password: 'student123', role: 'student', name: 'Demo Student', studentId: 'STU_001', status: 'active' }
  ];
  saveData(DB_KEYS.users, users);

  // Classes
  const classList = [
    { id: 'CLS_PG', name: 'Playgroup', sections: ['A', 'B'], capacity: 25 },
    { id: 'CLS_NUR', name: 'Nursery', sections: ['A', 'B'], capacity: 30 },
    { id: 'CLS_PREP', name: 'Prep', sections: ['A', 'B'], capacity: 30 },
    { id: 'CLS_1', name: 'Class 1', sections: ['A', 'B'], capacity: 35 },
    { id: 'CLS_2', name: 'Class 2', sections: ['A', 'B'], capacity: 35 },
    { id: 'CLS_3', name: 'Class 3', sections: ['A', 'B'], capacity: 35 },
    { id: 'CLS_4', name: 'Class 4', sections: ['A', 'B'], capacity: 35 },
    { id: 'CLS_5', name: 'Class 5', sections: ['A', 'B'], capacity: 35 },
    { id: 'CLS_6', name: 'Class 6', sections: ['A', 'B'], capacity: 40 },
    { id: 'CLS_7', name: 'Class 7', sections: ['A', 'B'], capacity: 40 },
    { id: 'CLS_8', name: 'Class 8', sections: ['A', 'B'], capacity: 40 },
    { id: 'CLS_9', name: 'Class 9', sections: ['A', 'B'], capacity: 40 },
    { id: 'CLS_10', name: 'Class 10', sections: ['A', 'B'], capacity: 40 }
  ];
  saveData(DB_KEYS.classes, classList);

  // Subjects
  const subjects = [
    { id: 'SUB_ENG', name: 'English', code: 'ENG' },
    { id: 'SUB_URD', name: 'Urdu', code: 'URD' },
    { id: 'SUB_MATH', name: 'Mathematics', code: 'MATH' },
    { id: 'SUB_SCI', name: 'Science', code: 'SCI' },
    { id: 'SUB_ISL', name: 'Islamic Studies', code: 'ISL' },
    { id: 'SUB_SST', name: 'Social Studies', code: 'SST' },
    { id: 'SUB_COMP', name: 'Computer', code: 'COMP' },
    { id: 'SUB_ART', name: 'Art', code: 'ART' },
    { id: 'SUB_PE', name: 'Physical Education', code: 'PE' },
    { id: 'SUB_GK', name: 'General Knowledge', code: 'GK' }
  ];
  saveData(DB_KEYS.subjects, subjects);

  // Teachers
  const teachers = [
    { id: 'TCH_001', name: 'Ahmed Khan', phone: '03001234567', whatsapp: '03001234567', email: 'ahmed@school.edu.pk', qualification: 'M.Ed', experience: 8, subjects: ['English', 'Urdu'], classes: ['Class 5', 'Class 6'], joiningDate: '2018-03-15', salary: 45000, status: 'active', photo: '' },
    { id: 'TCH_002', name: 'Fatima Ali', phone: '03011234567', whatsapp: '03011234567', email: 'fatima@school.edu.pk', qualification: 'B.Ed, M.A', experience: 6, subjects: ['Mathematics'], classes: ['Class 3', 'Class 4'], joiningDate: '2020-01-10', salary: 42000, status: 'active', photo: '' },
    { id: 'TCH_003', name: 'Muhammad Usman', phone: '03021234567', whatsapp: '03021234567', email: 'usman@school.edu.pk', qualification: 'M.Sc Physics', experience: 10, subjects: ['Science', 'Mathematics'], classes: ['Class 8', 'Class 9'], joiningDate: '2016-08-20', salary: 50000, status: 'active', photo: '' },
    { id: 'TCH_004', name: 'Ayesha Malik', phone: '03031234567', whatsapp: '03031234567', email: 'ayesha@school.edu.pk', qualification: 'B.Ed', experience: 4, subjects: ['Islamic Studies', 'Urdu'], classes: ['Nursery', 'Prep'], joiningDate: '2022-04-01', salary: 35000, status: 'active', photo: '' },
    { id: 'TCH_005', name: 'Hassan Raza', phone: '03041234567', whatsapp: '03041234567', email: 'hassan@school.edu.pk', qualification: 'M.A History', experience: 7, subjects: ['Social Studies'], classes: ['Class 6', 'Class 7'], joiningDate: '2019-09-12', salary: 40000, status: 'active', photo: '' },
    { id: 'TCH_006', name: 'Sana Iqbal', phone: '03051234567', whatsapp: '03051234567', email: 'sana@school.edu.pk', qualification: 'B.Sc Computer', experience: 5, subjects: ['Computer'], classes: ['Class 4', 'Class 5', 'Class 6'], joiningDate: '2021-02-15', salary: 38000, status: 'active', photo: '' },
    { id: 'TCH_007', name: 'Imran Shah', phone: '03061234567', whatsapp: '03061234567', email: 'imran@school.edu.pk', qualification: 'B.P.Ed', experience: 9, subjects: ['Physical Education'], classes: ['All'], joiningDate: '2017-07-01', salary: 37000, status: 'active', photo: '' },
    { id: 'TCH_008', name: 'Nadia Hussain', phone: '03071234567', whatsapp: '03071234567', email: 'nadia@school.edu.pk', qualification: 'M.A Fine Arts', experience: 3, subjects: ['Art'], classes: ['Class 1', 'Class 2', 'Class 3'], joiningDate: '2023-01-20', salary: 32000, status: 'active', photo: '' }
  ];
  saveData(DB_KEYS.teachers, teachers);

  // Parents
  const parents = [
    { id: 'PAR_001', fatherName: 'Abdul Rahman', motherName: 'Saima Bibi', guardian: 'Abdul Rahman', phone: '03211234567', whatsapp: '03211234567', email: 'abdul@email.com', address: 'House 12, Street 5, Lahore', children: ['STU_001', 'STU_002'], status: 'active' },
    { id: 'PAR_002', fatherName: 'Tariq Mehmood', motherName: 'Nasreen Akhtar', guardian: 'Tariq Mehmood', phone: '03221234567', whatsapp: '03221234567', email: 'tariq@email.com', address: 'House 45, Block C, Islamabad', children: ['STU_003'], status: 'active' },
    { id: 'PAR_003', fatherName: 'Kashif Ahmed', motherName: 'Rabia Sultana', guardian: 'Kashif Ahmed', phone: '03231234567', whatsapp: '03231234567', email: 'kashif@email.com', address: 'Flat 3B, Gulberg, Karachi', children: ['STU_004', 'STU_005'], status: 'active' },
    { id: 'PAR_004', fatherName: 'Naveed Iqbal', motherName: 'Farah Naz', guardian: 'Naveed Iqbal', phone: '03241234567', whatsapp: '03241234567', email: 'naveed@email.com', address: 'Village Kotli, Rawalpindi', children: ['STU_006'], status: 'active' },
    { id: 'PAR_005', fatherName: 'Shahid Ali', motherName: 'Amina Begum', guardian: 'Shahid Ali', phone: '03251234567', whatsapp: '03251234567', email: 'shahid@email.com', address: 'House 78, Model Town, Lahore', children: ['STU_007', 'STU_008'], status: 'active' },
    { id: 'PAR_006', fatherName: 'Faisal Khan', motherName: 'Hina Malik', guardian: 'Faisal Khan', phone: '03261234567', whatsapp: '03261234567', email: 'faisal@email.com', address: 'Street 12, DHA Phase 5, Lahore', children: ['STU_009'], status: 'active' },
    { id: 'PAR_007', fatherName: 'Waqas Hussain', motherName: 'Saba Noor', guardian: 'Waqas Hussain', phone: '03271234567', whatsapp: '03271234567', email: 'waqas@email.com', address: 'House 22, F-10, Islamabad', children: ['STU_010'], status: 'active' },
    { id: 'PAR_008', fatherName: 'Asif Raza', motherName: 'Mehwish Ali', guardian: 'Asif Raza', phone: '03281234567', whatsapp: '03281234567', email: 'asif@email.com', address: 'Block 15, Gulshan, Karachi', children: ['STU_011', 'STU_012'], status: 'active' },
    { id: 'PAR_009', fatherName: 'Bilal Ahmed', motherName: 'Zainab Fatima', guardian: 'Bilal Ahmed', phone: '03291234567', whatsapp: '03291234567', email: 'bilal@email.com', address: 'House 5, Satellite Town, Rawalpindi', children: ['STU_013'], status: 'active' },
    { id: 'PAR_010', fatherName: 'Omar Farooq', motherName: 'Samina Yasmin', guardian: 'Omar Farooq', phone: '03301234567', whatsapp: '03301234567', email: 'omar@email.com', address: 'Street 8, Johar Town, Lahore', children: ['STU_014', 'STU_015'], status: 'active' }
  ];
  saveData(DB_KEYS.parents, parents);

  // Students (20+)
  const students = [
    { id: 'STU_001', admissionNo: 'ADM-2024-001', name: 'Ali Rahman', fatherName: 'Abdul Rahman', motherName: 'Saima Bibi', dob: '2015-05-12', gender: 'Male', className: 'Class 5', section: 'A', rollNo: 1, admissionDate: '2024-03-01', phone: '03211234567', fatherPhone: '03211234567', motherPhone: '03211234568', parentWhatsApp: '03211234567', address: 'House 12, Street 5, Lahore', previousSchool: 'City Public School', status: 'active', parentId: 'PAR_001', photo: '' },
    { id: 'STU_002', admissionNo: 'ADM-2024-002', name: 'Ayesha Rahman', fatherName: 'Abdul Rahman', motherName: 'Saima Bibi', dob: '2017-08-20', gender: 'Female', className: 'Class 3', section: 'A', rollNo: 5, admissionDate: '2024-03-01', phone: '03211234567', fatherPhone: '03211234567', motherPhone: '03211234568', parentWhatsApp: '03211234567', address: 'House 12, Street 5, Lahore', previousSchool: 'City Public School', status: 'active', parentId: 'PAR_001', photo: '' },
    { id: 'STU_003', admissionNo: 'ADM-2024-003', name: 'Hassan Mehmood', fatherName: 'Tariq Mehmood', motherName: 'Nasreen Akhtar', dob: '2014-02-15', gender: 'Male', className: 'Class 6', section: 'B', rollNo: 3, admissionDate: '2023-04-10', phone: '03221234567', fatherPhone: '03221234567', motherPhone: '03221234568', parentWhatsApp: '03221234567', address: 'House 45, Block C, Islamabad', previousSchool: 'Islamabad Model School', status: 'active', parentId: 'PAR_002', photo: '' },
    { id: 'STU_004', admissionNo: 'ADM-2024-004', name: 'Zainab Ahmed', fatherName: 'Kashif Ahmed', motherName: 'Rabia Sultana', dob: '2016-11-03', gender: 'Female', className: 'Class 4', section: 'A', rollNo: 2, admissionDate: '2024-02-20', phone: '03231234567', fatherPhone: '03231234567', motherPhone: '03231234568', parentWhatsApp: '03231234567', address: 'Flat 3B, Gulberg, Karachi', previousSchool: 'Karachi Grammar', status: 'active', parentId: 'PAR_003', photo: '' },
    { id: 'STU_005', admissionNo: 'ADM-2024-005', name: 'Usman Ahmed', fatherName: 'Kashif Ahmed', motherName: 'Rabia Sultana', dob: '2018-06-25', gender: 'Male', className: 'Class 2', section: 'B', rollNo: 8, admissionDate: '2024-02-20', phone: '03231234567', fatherPhone: '03231234567', motherPhone: '03231234568', parentWhatsApp: '03231234567', address: 'Flat 3B, Gulberg, Karachi', previousSchool: '', status: 'active', parentId: 'PAR_003', photo: '' },
    { id: 'STU_006', admissionNo: 'ADM-2023-015', name: 'Sara Iqbal', fatherName: 'Naveed Iqbal', motherName: 'Farah Naz', dob: '2013-09-18', gender: 'Female', className: 'Class 7', section: 'A', rollNo: 4, admissionDate: '2023-03-15', phone: '03241234567', fatherPhone: '03241234567', motherPhone: '03241234568', parentWhatsApp: '03241234567', address: 'Village Kotli, Rawalpindi', previousSchool: 'Rawalpindi Public', status: 'active', parentId: 'PAR_004', photo: '' },
    { id: 'STU_007', admissionNo: 'ADM-2024-006', name: 'Hamza Ali', fatherName: 'Shahid Ali', motherName: 'Amina Begum', dob: '2015-01-30', gender: 'Male', className: 'Class 5', section: 'B', rollNo: 7, admissionDate: '2024-04-05', phone: '03251234567', fatherPhone: '03251234567', motherPhone: '03251234568', parentWhatsApp: '03251234567', address: 'House 78, Model Town, Lahore', previousSchool: 'Model Town School', status: 'active', parentId: 'PAR_005', photo: '' },
    { id: 'STU_008', admissionNo: 'ADM-2024-007', name: 'Maryam Ali', fatherName: 'Shahid Ali', motherName: 'Amina Begum', dob: '2017-04-12', gender: 'Female', className: 'Class 3', section: 'B', rollNo: 1, admissionDate: '2024-04-05', phone: '03251234567', fatherPhone: '03251234567', motherPhone: '03251234568', parentWhatsApp: '03251234567', address: 'House 78, Model Town, Lahore', previousSchool: '', status: 'active', parentId: 'PAR_005', photo: '' },
    { id: 'STU_009', admissionNo: 'ADM-2023-022', name: 'Ahmed Khan', fatherName: 'Faisal Khan', motherName: 'Hina Malik', dob: '2012-07-08', gender: 'Male', className: 'Class 8', section: 'A', rollNo: 2, admissionDate: '2023-02-28', phone: '03261234567', fatherPhone: '03261234567', motherPhone: '03261234568', parentWhatsApp: '03261234567', address: 'Street 12, DHA Phase 5, Lahore', previousSchool: 'DHA School', status: 'active', parentId: 'PAR_006', photo: '' },
    { id: 'STU_010', admissionNo: 'ADM-2024-008', name: 'Noor Hussain', fatherName: 'Waqas Hussain', motherName: 'Saba Noor', dob: '2016-12-22', gender: 'Female', className: 'Class 4', section: 'B', rollNo: 6, admissionDate: '2024-01-15', phone: '03271234567', fatherPhone: '03271234567', motherPhone: '03271234568', parentWhatsApp: '03271234567', address: 'House 22, F-10, Islamabad', previousSchool: 'F-10 Model School', status: 'active', parentId: 'PAR_007', photo: '' },
    { id: 'STU_011', admissionNo: 'ADM-2023-030', name: 'Bilal Raza', fatherName: 'Asif Raza', motherName: 'Mehwish Ali', dob: '2014-03-14', gender: 'Male', className: 'Class 6', section: 'A', rollNo: 9, admissionDate: '2023-05-10', phone: '03281234567', fatherPhone: '03281234567', motherPhone: '03281234568', parentWhatsApp: '03281234567', address: 'Block 15, Gulshan, Karachi', previousSchool: 'Gulshan Public', status: 'active', parentId: 'PAR_008', photo: '' },
    { id: 'STU_012', admissionNo: 'ADM-2024-009', name: 'Fatima Raza', fatherName: 'Asif Raza', motherName: 'Mehwish Ali', dob: '2018-10-05', gender: 'Female', className: 'Class 2', section: 'A', rollNo: 3, admissionDate: '2024-03-20', phone: '03281234567', fatherPhone: '03281234567', motherPhone: '03281234568', parentWhatsApp: '03281234567', address: 'Block 15, Gulshan, Karachi', previousSchool: '', status: 'active', parentId: 'PAR_008', photo: '' },
    { id: 'STU_013', admissionNo: 'ADM-2023-018', name: 'Yusuf Ahmed', fatherName: 'Bilal Ahmed', motherName: 'Zainab Fatima', dob: '2013-05-28', gender: 'Male', className: 'Class 7', section: 'B', rollNo: 5, admissionDate: '2023-04-01', phone: '03291234567', fatherPhone: '03291234567', motherPhone: '03291234568', parentWhatsApp: '03291234567', address: 'House 5, Satellite Town, Rawalpindi', previousSchool: 'Satellite Town School', status: 'active', parentId: 'PAR_009', photo: '' },
    { id: 'STU_014', admissionNo: 'ADM-2024-010', name: 'Hira Farooq', fatherName: 'Omar Farooq', motherName: 'Samina Yasmin', dob: '2015-08-17', gender: 'Female', className: 'Class 5', section: 'A', rollNo: 10, admissionDate: '2024-02-10', phone: '03301234567', fatherPhone: '03301234567', motherPhone: '03301234568', parentWhatsApp: '03301234567', address: 'Street 8, Johar Town, Lahore', previousSchool: 'Johar Town Academy', status: 'active', parentId: 'PAR_010', photo: '' },
    { id: 'STU_015', admissionNo: 'ADM-2024-011', name: 'Ibrahim Farooq', fatherName: 'Omar Farooq', motherName: 'Samina Yasmin', dob: '2017-01-09', gender: 'Male', className: 'Class 3', section: 'A', rollNo: 12, admissionDate: '2024-02-10', phone: '03301234567', fatherPhone: '03301234567', motherPhone: '03301234568', parentWhatsApp: '03301234567', address: 'Street 8, Johar Town, Lahore', previousSchool: '', status: 'active', parentId: 'PAR_010', photo: '' },
    { id: 'STU_016', admissionNo: 'ADM-2023-025', name: 'Amna Siddiqui', fatherName: 'Rashid Siddiqui', motherName: 'Kiran Bano', dob: '2014-11-11', gender: 'Female', className: 'Class 6', section: 'B', rollNo: 1, admissionDate: '2023-03-22', phone: '03311234567', fatherPhone: '03311234567', motherPhone: '03311234568', parentWhatsApp: '03311234567', address: 'House 33, Bahria Town, Lahore', previousSchool: 'Bahria School', status: 'active', parentId: '', photo: '' },
    { id: 'STU_017', admissionNo: 'ADM-2024-012', name: 'Danish Malik', fatherName: 'Imtiaz Malik', motherName: 'Shazia Malik', dob: '2016-04-03', gender: 'Male', className: 'Class 4', section: 'A', rollNo: 11, admissionDate: '2024-01-25', phone: '03321234567', fatherPhone: '03321234567', motherPhone: '03321234568', parentWhatsApp: '03321234567', address: 'Street 4, Garden Town, Lahore', previousSchool: 'Garden Public', status: 'active', parentId: '', photo: '' },
    { id: 'STU_018', admissionNo: 'ADM-2023-040', name: 'Sana Javed', fatherName: 'Javed Akhtar', motherName: 'Rubina Javed', dob: '2012-12-30', gender: 'Female', className: 'Class 8', section: 'B', rollNo: 4, admissionDate: '2023-01-15', phone: '03331234567', fatherPhone: '03331234567', motherPhone: '03331234568', parentWhatsApp: '03331234567', address: 'House 9, Cavalry Ground, Lahore', previousSchool: 'Cavalry School', status: 'active', parentId: '', photo: '' },
    { id: 'STU_019', admissionNo: 'ADM-2024-013', name: 'Rayan Sheikh', fatherName: 'Kamran Sheikh', motherName: 'Nadia Sheikh', dob: '2018-07-19', gender: 'Male', className: 'Class 2', section: 'B', rollNo: 2, admissionDate: '2024-03-08', phone: '03341234567', fatherPhone: '03341234567', motherPhone: '03341234568', parentWhatsApp: '03341234567', address: 'Block D, Askari 10, Lahore', previousSchool: '', status: 'active', parentId: '', photo: '' },
    { id: 'STU_020', admissionNo: 'ADM-2023-035', name: 'Maham Butt', fatherName: 'Saleem Butt', motherName: 'Fariha Butt', dob: '2013-02-14', gender: 'Female', className: 'Class 7', section: 'A', rollNo: 8, admissionDate: '2023-04-18', phone: '03351234567', fatherPhone: '03351234567', motherPhone: '03351234568', parentWhatsApp: '03351234567', address: 'House 17, Valencia Town, Lahore', previousSchool: 'Valencia Academy', status: 'active', parentId: '', photo: '' }
  ];
  saveData(DB_KEYS.students, students);

  // Fees (sample)
  const months = ['January 2025', 'February 2025', 'March 2025', 'April 2025', 'May 2025'];
  const fees = [];
  students.slice(0, 15).forEach((stu, i) => {
    const month = months[i % months.length];
    const tuition = 3000 + (parseInt(stu.className.replace(/\D/g, '') || 1) * 200);
    const paid = i % 3 === 0 ? tuition : (i % 3 === 1 ? tuition * 0.5 : 0);
    fees.push({
      id: 'FEE_' + (i + 1),
      studentId: stu.id,
      studentName: stu.name,
      fatherName: stu.fatherName,
      className: stu.className,
      section: stu.section,
      month: month,
      tuitionFee: tuition,
      admissionFee: 0,
      examFee: i % 4 === 0 ? 500 : 0,
      transportFee: i % 2 === 0 ? 800 : 0,
      otherFee: 0,
      discount: i % 5 === 0 ? 200 : 0,
      fine: i % 6 === 0 ? 100 : 0,
      total: 0,
      paid: paid,
      remaining: 0,
      paymentDate: paid > 0 ? '2025-0' + ((i % 5) + 1) + '-15' : '',
      receiptNo: paid > 0 ? 'RCP-2025-' + String(i + 1).padStart(4, '0') : '',
      status: paid >= tuition ? 'paid' : (paid > 0 ? 'partial' : 'pending')
    });
  });
  fees.forEach(f => {
    f.total = f.tuitionFee + f.admissionFee + f.examFee + f.transportFee + f.otherFee - f.discount + f.fine;
    f.remaining = Math.max(0, f.total - f.paid);
    if (f.remaining === 0) f.status = 'paid';
    else if (f.paid > 0) f.status = 'partial';
    else f.status = 'pending';
  });
  saveData(DB_KEYS.fees, fees);

  // Attendance (today + some past)
  const today = new Date().toISOString().split('T')[0];
  const attendance = [];
  students.forEach((stu, i) => {
    const status = i % 7 === 0 ? 'absent' : (i % 11 === 0 ? 'late' : (i % 13 === 0 ? 'leave' : 'present'));
    attendance.push({
      id: 'ATT_' + stu.id + '_' + today,
      studentId: stu.id,
      studentName: stu.name,
      className: stu.className,
      section: stu.section,
      date: today,
      status: status,
      remark: status === 'absent' ? 'Not informed' : ''
    });
  });
  // Add some historical
  for (let d = 1; d <= 5; d++) {
    const date = new Date();
    date.setDate(date.getDate() - d);
    const dateStr = date.toISOString().split('T')[0];
    students.slice(0, 10).forEach((stu, i) => {
      attendance.push({
        id: 'ATT_' + stu.id + '_' + dateStr,
        studentId: stu.id,
        studentName: stu.name,
        className: stu.className,
        section: stu.section,
        date: dateStr,
        status: (i + d) % 5 === 0 ? 'absent' : 'present',
        remark: ''
      });
    });
  }
  saveData(DB_KEYS.attendance, attendance);

  // Exams
  const exams = [
    { id: 'EXM_001', name: 'First Term Exam 2025', startDate: '2025-03-01', endDate: '2025-03-15', classes: ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5'], status: 'completed', totalMarks: 100, passingMarks: 40 },
    { id: 'EXM_002', name: 'Mid Term Exam 2025', startDate: '2025-05-10', endDate: '2025-05-20', classes: ['Class 6', 'Class 7', 'Class 8'], status: 'upcoming', totalMarks: 100, passingMarks: 40 },
    { id: 'EXM_003', name: 'Final Exam 2025', startDate: '2025-12-01', endDate: '2025-12-15', classes: ['All'], status: 'scheduled', totalMarks: 100, passingMarks: 40 }
  ];
  saveData(DB_KEYS.exams, exams);

  // Results
  const results = [];
  const subjNames = ['English', 'Urdu', 'Mathematics', 'Science', 'Islamic Studies'];
  students.slice(0, 12).forEach((stu, si) => {
    subjNames.forEach((sub, subi) => {
      const obtained = 40 + Math.floor(Math.random() * 55);
      results.push({
        id: 'RES_' + si + '_' + subi,
        studentId: stu.id,
        studentName: stu.name,
        className: stu.className,
        section: stu.section,
        examId: 'EXM_001',
        examName: 'First Term Exam 2025',
        subject: sub,
        totalMarks: 100,
        obtainedMarks: obtained,
        percentage: obtained,
        grade: obtained >= 90 ? 'A+' : obtained >= 80 ? 'A' : obtained >= 70 ? 'B' : obtained >= 60 ? 'C' : obtained >= 50 ? 'D' : 'F',
        status: obtained >= 40 ? 'Pass' : 'Fail'
      });
    });
  });
  saveData(DB_KEYS.results, results);

  // Timetable sample
  const timetable = [
    { id: 'TT_001', className: 'Class 5', section: 'A', day: 'Monday', subject: 'English', teacher: 'Ahmed Khan', room: '101', startTime: '08:00', endTime: '08:45' },
    { id: 'TT_002', className: 'Class 5', section: 'A', day: 'Monday', subject: 'Mathematics', teacher: 'Fatima Ali', room: '101', startTime: '08:45', endTime: '09:30' },
    { id: 'TT_003', className: 'Class 5', section: 'A', day: 'Monday', subject: 'Science', teacher: 'Muhammad Usman', room: '102', startTime: '09:45', endTime: '10:30' },
    { id: 'TT_004', className: 'Class 5', section: 'A', day: 'Tuesday', subject: 'Urdu', teacher: 'Ahmed Khan', room: '101', startTime: '08:00', endTime: '08:45' },
    { id: 'TT_005', className: 'Class 6', section: 'B', day: 'Monday', subject: 'Mathematics', teacher: 'Fatima Ali', room: '201', startTime: '08:00', endTime: '08:45' }
  ];
  saveData(DB_KEYS.timetable, timetable);

  // Homework
  const homework = [
    { id: 'HW_001', className: 'Class 5', section: 'A', subject: 'Mathematics', title: 'Chapter 5 Exercises', description: 'Solve exercise 5.1 to 5.3 from textbook.', dueDate: '2025-09-20', teacher: 'Fatima Ali', attachment: '', status: 'active', createdAt: new Date().toISOString() },
    { id: 'HW_002', className: 'Class 6', section: 'B', subject: 'English', title: 'Essay Writing', description: 'Write an essay on "My School" (150 words).', dueDate: '2025-09-22', teacher: 'Ahmed Khan', attachment: '', status: 'active', createdAt: new Date().toISOString() }
  ];
  saveData(DB_KEYS.homework, homework);

  // Admissions
  const admissions = [
    { id: 'ADM_APP_001', studentName: 'New Student One', fatherName: 'Father One', motherName: 'Mother One', dob: '2018-05-10', gender: 'Male', className: 'Class 1', phone: '03401234567', whatsapp: '03401234567', address: 'Lahore', previousSchool: '', guardian: 'Father One', status: 'new', appliedDate: new Date().toISOString(), documents: [], photo: '' },
    { id: 'ADM_APP_002', studentName: 'New Student Two', fatherName: 'Father Two', motherName: 'Mother Two', dob: '2017-08-15', gender: 'Female', className: 'Class 2', phone: '03411234567', whatsapp: '03411234567', address: 'Islamabad', previousSchool: 'Previous School', guardian: 'Father Two', status: 'under_review', appliedDate: new Date().toISOString(), documents: [], photo: '' }
  ];
  saveData(DB_KEYS.admissions, admissions);

  // Notices
  const notices = [
    { id: 'NTC_001', title: 'Welcome to New Academic Session', content: 'We welcome all students and parents to the academic session 2025-2026. Classes will commence from 1st April.', category: 'General', date: '2025-03-20', published: true, author: 'Admin' },
    { id: 'NTC_002', title: 'Fee Submission Deadline', content: 'Please submit March 2025 fees by 10th of the month to avoid late fine.', category: 'Fee', date: '2025-03-01', published: true, author: 'Admin' },
    { id: 'NTC_003', title: 'First Term Exam Schedule', content: 'First Term Examinations will be held from 1st to 15th March 2025. Timetable will be shared soon.', category: 'Exam', date: '2025-02-15', published: true, author: 'Admin' }
  ];
  saveData(DB_KEYS.notices, notices);

  // Events
  const events = [
    { id: 'EVT_001', title: 'Annual Sports Day', date: '2025-10-15', time: '09:00 AM', location: 'School Ground', description: 'Annual sports competition for all classes. Parents are invited.', image: '', status: 'upcoming' },
    { id: 'EVT_002', title: 'Parent Teacher Meeting', date: '2025-09-25', time: '10:00 AM', location: 'School Auditorium', description: 'PTM for Classes 1 to 5. Please attend to discuss student progress.', image: '', status: 'upcoming' },
    { id: 'EVT_003', title: 'Independence Day Celebration', date: '2025-08-14', time: '08:00 AM', location: 'School Premises', description: 'Flag hoisting and cultural program.', image: '', status: 'completed' }
  ];
  saveData(DB_KEYS.events, events);

  // Gallery
  const gallery = [
    { id: 'GAL_001', title: 'School Building', category: 'School', url: '', filename: 'school1.jpg' },
    { id: 'GAL_002', title: 'Sports Day 2024', category: 'Sports', url: '', filename: 'sports1.jpg' },
    { id: 'GAL_003', title: 'Annual Function', category: 'Annual Function', url: '', filename: 'annual1.jpg' }
  ];
  saveData(DB_KEYS.gallery, gallery);

  // Books
  const books = [
    { id: 'BK_001', title: 'Mathematics Grade 5', author: 'Oxford', isbn: '978-123456', category: 'Textbook', quantity: 30, available: 25, status: 'available' },
    { id: 'BK_002', title: 'English Grammar', author: 'Cambridge', isbn: '978-234567', category: 'Textbook', quantity: 25, available: 20, status: 'available' },
    { id: 'BK_003', title: 'Science Explorer', author: 'Pearson', isbn: '978-345678', category: 'Reference', quantity: 15, available: 12, status: 'available' }
  ];
  saveData(DB_KEYS.books, books);

  // Transport
  const transport = [
    { id: 'TRN_001', vehicleNo: 'LES-1234', driver: 'Rashid Khan', driverPhone: '03009876543', route: 'Route A - Model Town', capacity: 30, students: ['STU_001', 'STU_007'], fee: 800, status: 'active' },
    { id: 'TRN_002', vehicleNo: 'LES-5678', driver: 'Imran Ali', driverPhone: '03008765432', route: 'Route B - DHA', capacity: 25, students: ['STU_009'], fee: 1000, status: 'active' }
  ];
  saveData(DB_KEYS.transport, transport);

  // Payroll
  const payroll = teachers.map((t, i) => ({
    id: 'PAY_' + t.id,
    teacherId: t.id,
    teacherName: t.name,
    month: 'August 2025',
    basicSalary: t.salary,
    bonus: i % 3 === 0 ? 2000 : 0,
    deduction: i % 4 === 0 ? 500 : 0,
    advance: 0,
    netSalary: t.salary + (i % 3 === 0 ? 2000 : 0) - (i % 4 === 0 ? 500 : 0),
    status: 'paid',
    paymentDate: '2025-08-28'
  }));
  saveData(DB_KEYS.payroll, payroll);

  // Notifications
  const notifications = [
    { id: 'NOT_001', title: 'New Admission Application', message: 'New admission application received from New Student One', type: 'admission', read: false, date: new Date().toISOString() },
    { id: 'NOT_002', title: 'Fee Pending Reminder', message: 'Several students have pending fees for current month', type: 'fee', read: false, date: new Date().toISOString() },
    { id: 'NOT_003', title: 'Absent Students', message: 'Check today\'s absent students list', type: 'attendance', read: true, date: new Date().toISOString() }
  ];
  saveData(DB_KEYS.notifications, notifications);

  localStorage.setItem('school_db_initialized', 'true');
  console.log('Database initialized with demo data');
}

// Reset database
function resetDatabase() {
  Object.values(DB_KEYS).forEach(key => localStorage.removeItem(key));
  localStorage.removeItem('school_db_initialized');
  localStorage.removeItem('school_session');
  initializeDatabase();
}

// Auto init
initializeDatabase();
