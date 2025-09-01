// ======= Shared Utilities / State =======
const APP = {
  getUser(){
    try { return JSON.parse(localStorage.getItem('authUser') || 'null'); } catch { return null; }
  },
  requireAdmin(){
    const u = APP.getUser();
    if(!u || u.role !== 'admin'){ window.location.href = 'login.html?next=' + encodeURIComponent(location.pathname); }
  },
  logout(){
    localStorage.removeItem('authUser');
    location.href = 'login.html';
  },
  fmtRupees(n){ return '₹' + Number(n).toFixed(2); },
  parseRupees(text){ 
    // This is the corrected function for the cart total
    return parseFloat(String(text).replace(/[^0-9.]/g, '')) || 0; 
  },
  uid(prefix='ORD'){
    return `${prefix}${Date.now().toString().slice(-6)}${Math.floor(Math.random()*90+10)}`;
  },
  categorize(name){
    const s = name.toLowerCase();
    if(/idli|dosa|uttapam|sambar|poha|upma|paratha|roti/.test(s)) return 'breakfast';
    if(/sandwich|samosa|bhaji|gobi|65|manchurian|snack/.test(s)) return 'snacks';
    if(/lassi|juice|tea|coffee|drink/.test(s)) return 'drinks';
    if(/biryani|pulao|rice|dal|paneer|chole|rajma|curry|kofta|thali/.test(s)) return 'lunch';
    return 'others';
  },
  getCart(){ return JSON.parse(localStorage.getItem('cart')||'[]'); },
  setCart(c){ localStorage.setItem('cart', JSON.stringify(c)); },
  getPlacedOrders(){ return JSON.parse(localStorage.getItem('orders')||'[]'); },
  setPlacedOrders(list){ localStorage.setItem('orders', JSON.stringify(list)); },
  getCurrentOrder(){ return JSON.parse(localStorage.getItem('order')||'[]'); },
  setCurrentOrder(o){ localStorage.setItem('order', JSON.stringify(o)); },
  getFeedback(){ return JSON.parse(localStorage.getItem('feedback')||'[]'); },
  setFeedback(f){ localStorage.setItem('feedback', JSON.stringify(f)); },
  pulseCart(){
    const b = document.getElementById('cart-badge');
    if(!b) return;
    b.classList.add('active'); setTimeout(()=>b.classList.remove('active'), 350);
  },
  toggleDarkMode(){
    const body = document.body;
    body.classList.toggle('dark-mode');
    const isDark = body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDark ? 'enabled' : 'disabled');
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
      themeToggle.textContent = isDark ? '☀️' : '🌙';
    }
  },
  applyTheme(){
    if (localStorage.getItem('darkMode') === 'enabled') {
      document.body.classList.add('dark-mode');
      const themeToggle = document.getElementById('theme-toggle');
      if (themeToggle) {
        themeToggle.textContent = '☀️';
      }
    }
  },
  showToast(message, type = 'info') {
    const icons = { info: 'ℹ️', success: '✅', error: '❌' };
    const colors = { info: '#0275d8', success: '#5cb85c', error: '#d9534f' };
    
    const toast = document.createElement('div');
    toast.innerHTML = `${icons[type] || icons.info} &nbsp; ${message}`;
    
    Object.assign(toast.style, {
      position: 'fixed',
      bottom: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      backgroundColor: colors[type] || colors.info,
      color: 'white',
      padding: '12px 20px',
      borderRadius: '50px',
      zIndex: '1000',
      opacity: '0',
      transition: 'opacity 0.4s ease, bottom 0.4s ease',
      boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
      fontWeight: '500'
    });
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.style.opacity = '1';
      toast.style.bottom = '40px';
    }, 10);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.bottom = '20px';
      setTimeout(() => {
        if(document.body.contains(toast)) document.body.removeChild(toast);
      }, 400);
    }, 3500);
  }
};

function updateCartCount(){
  const cart = APP.getCart();
  const count = cart.reduce((s,i)=>s + Number(i.qty||0), 0);
  const el = document.getElementById('cart-count');
  if(el) el.textContent = count;
}
document.addEventListener('DOMContentLoaded', ()=>{
  updateCartCount();
  APP.applyTheme();
});

function toggleMenu(){
  const m = document.querySelector('.side-menu');
  if(!m) return;
  m.classList.toggle('open');
}

function submitFeedback(ev){
  ev.preventDefault();
  const name = document.getElementById('fb-name').value.trim();
  const type = document.getElementById('fb-type').value;
  const msg  = document.getElementById('fb-msg').value.trim();
  if(!msg){ alert('Please write your message.'); return; }
  const list = APP.getFeedback();
  list.push({ id: APP.uid('FB'), name, type, msg, at: new Date().toISOString() });
  APP.setFeedback(list);
  ev.target.reset();
  APP.showToast('Thank you for your feedback!', 'success');
  toggleFeedbackMenu();
}

function highlightMatch(text, term){
  if(!term) return text;
  const re = new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'ig');
  return text.replace(re, '<mark>$1</mark>');
}

window.APP = APP;
window.updateCartCount = updateCartCount;
window.toggleMenu = toggleMenu;
window.submitFeedback = submitFeedback;
window.highlightMatch = highlightMatch;