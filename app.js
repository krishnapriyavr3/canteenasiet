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
  parseRupees(text){ return parseInt(String(text).replace(/[^\d]/g,''))||0; },
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
  }
};

// ======= Cart helpers (shared) =======
function updateCartCount(){
  const cart = APP.getCart();
  const count = cart.reduce((s,i)=>s + Number(i.qty||0), 0);
  const el = document.getElementById('cart-count');
  if(el) el.textContent = count;
}
document.addEventListener('DOMContentLoaded', updateCartCount);

// ======= Slide menu toggling =======
function toggleMenu(){
  const m = document.querySelector('.side-menu');
  if(!m) return;
  m.classList.toggle('open');
}

// ======= Feedback handling (shared) =======
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
  alert('Thank you for your feedback!');
}

// ======= Search helper =======
function highlightMatch(text, term){
  if(!term) return text;
  const re = new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'ig');
  return text.replace(re, '<mark>$1</mark>');
}

// Expose globally
window.APP = APP;
window.updateCartCount = updateCartCount;
window.toggleMenu = toggleMenu;
window.submitFeedback = submitFeedback;
window.highlightMatch = highlightMatch;