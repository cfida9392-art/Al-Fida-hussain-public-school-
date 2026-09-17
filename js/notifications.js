// ============================================================
// Notifications Module
// ============================================================

function addNotification(title, message, type = 'general') {
  addRecord(DB_KEYS.notifications, {
    title,
    message,
    type,
    read: false,
    date: new Date().toISOString()
  });
}

function getNotifications() {
  return getRecords(DB_KEYS.notifications).sort((a, b) => new Date(b.date) - new Date(a.date));
}

function getUnreadCount() {
  return getNotifications().filter(n => !n.read).length;
}

function markAsRead(id) {
  updateRecord(DB_KEYS.notifications, id, { read: true });
}

function markAllAsRead() {
  const notes = getNotifications();
  notes.forEach(n => {
    if (!n.read) updateRecord(DB_KEYS.notifications, n.id, { read: true });
  });
}

function renderNotifications(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const notes = getNotifications().slice(0, 30);
  if (notes.length === 0) {
    container.innerHTML = '<div class="empty-state"><i class="fas fa-bell"></i><p>No notifications</p></div>';
    return;
  }
  container.innerHTML = notes.map(n => `
    <div class="card" style="margin-bottom:10px;padding:14px;${n.read ? 'opacity:0.7;' : 'border-left:3px solid var(--gold);'}">
      <div class="d-flex justify-between align-center">
        <strong style="font-size:0.95rem;">${escapeHtml(n.title)}</strong>
        <small style="color:var(--gray-500);">${formatDate(n.date)}</small>
      </div>
      <p style="font-size:0.85rem;color:var(--gray-600);margin-top:4px;">${escapeHtml(n.message)}</p>
      ${!n.read ? `<button class="btn btn-sm" style="margin-top:6px;background:var(--gray-200);" onclick="markAsRead('${n.id}');renderNotifications('${containerId}');updateNotifBadge();">Mark read</button>` : ''}
    </div>
  `).join('');
}

function updateNotifBadge() {
  const count = getUnreadCount();
  document.querySelectorAll('.badge-count').forEach(el => {
    el.textContent = count;
    el.style.display = count > 0 ? 'flex' : 'none';
  });
}
