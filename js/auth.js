// ============================================================
// Authentication Module
// ============================================================

const SESSION_KEY = 'school_session';

function login(username, password) {
  const users = getRecords(DB_KEYS.users);
  const user = users.find(u => u.username === username && u.password === password && u.status === 'active');
  if (!user) {
    return { success: false, message: 'Invalid username or password' };
  }
  const session = {
    id: user.id,
    username: user.username,
    role: user.role,
    name: user.name,
    teacherId: user.teacherId || null,
    parentId: user.parentId || null,
    studentId: user.studentId || null,
    loginTime: new Date().toISOString()
  };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return { success: true, user: session };
}

function logout() {
  localStorage.removeItem(SESSION_KEY);
  window.location.href = 'login.html';
}

function getSession() {
  try {
    const data = localStorage.getItem(SESSION_KEY);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    return null;
  }
}

function isLoggedIn() {
  return getSession() !== null;
}

function requireAuth(allowedRoles = []) {
  const session = getSession();
  if (!session) {
    window.location.href = 'login.html';
    return false;
  }
  if (allowedRoles.length > 0 && !allowedRoles.includes(session.role)) {
    // Redirect to their own dashboard
    redirectToDashboard(session.role);
    return false;
  }
  return true;
}

function redirectToDashboard(role) {
  const map = {
    admin: 'admin.html',
    teacher: 'teacher.html',
    accountant: 'accountant.html',
    parent: 'parent.html',
    student: 'student.html'
  };
  window.location.href = map[role] || 'login.html';
}

function getCurrentUser() {
  return getSession();
}

// Protect pages on load
function protectPage(roles) {
  document.addEventListener('DOMContentLoaded', () => {
    if (!requireAuth(roles)) return;
  });
}
