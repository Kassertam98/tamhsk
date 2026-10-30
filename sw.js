// Bộ nhớ đệm để mở được khi mất mạng
const C='lophsk-f0480da3';
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(["./", "index.html", "manifest.webmanifest", "lib/hanzi-writer.min.js", "lib/pinyin-pro.js"])).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C&&k!=='hsk-pet').map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{const u=new URL(e.request.url);if(e.request.method!=='GET'||u.origin!==location.origin)return;
  if(e.request.mode==='navigate'){if(u.pathname!=='/'&&u.pathname!=='/index.html')return;e.respondWith(fetch(e.request).then(r=>{const cp=r.clone();caches.open(C).then(c=>c.put('./',cp));return r;}).catch(()=>caches.match('./')));return;}
  e.respondWith(caches.match(e.request).then(m=>m||fetch(e.request).then(r=>{if(r.ok){const cp=r.clone();caches.open(C).then(c=>c.put(e.request,cp));}return r;})));});
// Nhắc học: máy chủ gửi tín hiệu rỗng, Tiểu Long Hổ soạn lời nhắc theo tâm trạng lưu trên máy
const PET_LINES={
 risk:['🔥 Chủ nhân ơi, chuỗi {s} ngày của mình sắp tắt rồi! Vào học 5 phút với Long Hổ nha.','😟 Tối rồi mà chủ nhân chưa ghé… Cứu chuỗi {s} ngày giúp Long Hổ với!'],
 due:['📚 Có {d} từ đang nhớ chủ nhân! Ôn nhanh cho tụi nó khỏi buồn nha.'],
 sad:['🥺 Hu hu, lâu rồi chủ nhân không ghé… Long Hổ nhớ chủ nhân lắm.','🐾 Long Hổ đứng ở cửa đợi hoài nè. Mình bắt đầu chuỗi mới nha chủ nhân?'],
 any:['🐉 Long Hổ ngồi chờ chủ nhân cả ngày rồi đó… Học vài từ rồi hẵng ngủ nha!','💪 Tối nay học 5 phút thôi, Long Hổ hứa sẽ quẫy đuôi mừng luôn! 加油!','💧 Vườn chữ Hán khát nước rồi, chủ nhân tưới giúp Long Hổ với!','🏆 Giải đấu tuần đang gay cấn, kiếm thêm chút XP giữ hạng nào chủ nhân!']};
function petPick(st){let pool=[];if(st.s>=2)pool=pool.concat(PET_LINES.risk,PET_LINES.risk);if(st.d>=3)pool=pool.concat(PET_LINES.due);if(!st.s&&st.t)pool=pool.concat(PET_LINES.sad);pool=pool.concat(PET_LINES.any);
  let m=pool[Math.floor(Math.random()*pool.length)];if(st.n)m=m.replace(/([Cc]hủ nhân)/,'$1 '+st.n);return m.replace('{s}',st.s).replace('{d}',st.d);}
self.addEventListener('push',e=>{e.waitUntil((async()=>{let st={};try{const r=await caches.match('__pet',{cacheName:'hsk-pet'});if(r)st=await r.json();}catch(x){}
  let body=petPick(st);try{const d=e.data&&e.data.text();if(d)body=d;}catch(x){}
  return self.registration.showNotification('Tiểu Long Hổ 🐉',{body,icon:'icons/icon-192.png',badge:'icons/favicon-64.png',tag:'nhac-hoc',renotify:true,data:{url:'./#review'}});})());});
self.addEventListener('notificationclick',e=>{e.notification.close();const url=new URL((e.notification.data&&e.notification.data.url)||'./',self.registration.scope).href;
  e.waitUntil(clients.matchAll({type:'window',includeUncontrolled:true}).then(cs=>{for(const c of cs){if(c.url.startsWith(self.registration.scope)&&'focus' in c){try{c.navigate(url);}catch(x){}return c.focus();}}return clients.openWindow(url);}));});
