// Parents Module
function getAllParents() { return getRecords(DB_KEYS.parents); }
function getParentById(id) { return getRecordById(DB_KEYS.parents, id); }
function addParent(data) { return addRecord(DB_KEYS.parents, data); }
function updateParent(id, data) { return updateRecord(DB_KEYS.parents, id, data); }
function deleteParent(id) { return deleteRecord(DB_KEYS.parents, id); }

function renderParentsTable(containerId, search = '') {
  const container = document.getElementById(containerId);
  if (!container) return;
  let parents = getAllParents();
  if (search) parents = filterData(parents, search, ['fatherName', 'motherName', 'phone', 'whatsapp', 'email']);
  if (parents.length === 0) {
    container.innerHTML = '<div class="empty-state"><i class="fas fa-users"></i><p>No parents found</p></div>';
    return;
  }
  let html = `<div class="table-responsive"><table class="data-table"><thead><tr>
    <th>#</th><th>Father Name</th><th>Mother Name</th><th>Phone</th><th>WhatsApp</th><th>Children</th><th>Actions</th>
  </tr></thead><tbody>`;
  parents.forEach((p, i) => {
    const children = (p.children || []).map(cid => {
      const s = getStudentById(cid);
      return s ? s.name : cid;
    }).join(', ');
    html += `<tr>
      <td>${i + 1}</td>
      <td><strong>${escapeHtml(p.fatherName)}</strong></td>
      <td>${escapeHtml(p.motherName || '-')}</td>
      <td>${escapeHtml(p.phone || '-')}</td>
      <td>${escapeHtml(p.whatsapp || '-')}</td>
      <td>${escapeHtml(children || '-')}</td>
      <td class="actions">
        <button class="btn btn-sm" style="background:var(--gray-200);" onclick="editParent('${p.id}')"><i class="fas fa-edit"></i></button>
        ${p.whatsapp ? `<button class="btn btn-sm btn-whatsapp" onclick="openWhatsApp('${p.whatsapp}','Assalam-o-Alaikum. Message from AL FIDA HUSSAIN PUBLIC SCHOOLS.')"><i class="fab fa-whatsapp"></i></button>` : ''}
        <button class="btn btn-sm btn-danger" onclick="if(confirmAction('Delete this parent?')){deleteParent('${p.id}');loadParents();showToast('Deleted');}"><i class="fas fa-trash"></i></button>
      </td>
    </tr>`;
  });
  html += '</tbody></table></div>';
  container.innerHTML = html;
}
