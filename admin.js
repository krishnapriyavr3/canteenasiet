document.addEventListener('DOMContentLoaded', () => {
  // Protect the route
  APP.requireAdmin();

  loadOrders();
  loadFeedback();
});

function loadOrders() {
  const orders = APP.getPlacedOrders();
  const tbody = document.querySelector('#orders-table tbody');
  tbody.innerHTML = '';

  if (orders.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" class="text-muted" style="text-align:center;">No orders yet.</td></tr>';
    return;
  }

  orders.slice().reverse().forEach(order => {
    const row = document.createElement('tr');
    const itemsSummary = order.items.map(i => `${i.qty}× ${i.name}`).join(', ');
    const statuses = ['Pending', 'Preparing', 'Ready', 'Completed', 'Cancelled'];
    const statusOptions = statuses.map(s => `<option value="${s}" ${order.status === s ? 'selected' : ''}>${s}</option>`).join('');

    row.innerHTML = `
      <td>${order.id}</td>
      <td>${order.user}</td>
      <td>${itemsSummary}</td>
      <td>${APP.fmtRupees(order.total)}</td>
      <td>
        <select class="input" onchange="updateStatus('${order.id}', this.value)">
          ${statusOptions}
        </select>
      </td>
    `;
    tbody.appendChild(row);
  });
}

function updateStatus(orderId, newStatus) {
  const orders = APP.getPlacedOrders();
  const order = orders.find(o => o.id === orderId);
  if (order) {
    order.status = newStatus;
    APP.setPlacedOrders(orders);
    // Optional: add a visual confirmation
    alert(`Order ${orderId} status updated to ${newStatus}`);
  }
}

function loadFeedback() {
    const feedback = APP.getFeedback();
    const listEl = document.getElementById('feedback-list');
    listEl.innerHTML = '';

    if (feedback.length === 0) {
        listEl.innerHTML = '<p class="text-muted">No feedback submitted yet.</p>';
        return;
    }

    feedback.slice().reverse().forEach(fb => {
        const entry = document.createElement('div');
        entry.className = 'panel';
        entry.style.marginBottom = '1rem';
        entry.innerHTML = `
            <p><strong>From:</strong> ${fb.name || 'Anonymous'} (<span class="badge">${fb.type}</span>)</p>
            <p>${fb.msg}</p>
            <p class="text-muted" style="font-size:0.8rem;">${new Date(fb.at).toLocaleString()}</p>
        `;
        listEl.appendChild(entry);
    });
}

// Make updateStatus globally accessible from the inline onchange handler
window.updateStatus = updateStatus;