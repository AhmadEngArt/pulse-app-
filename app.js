const $=id=>document.getElementById(id);
const icons={'دوستان':'🥂','خانواده':'🏡','عاطفی':'💗','کاری':'💼','سفر و ماجراجویی':'🌍','ورزش':'⚡','بازی':'🎮','هنر و سرگرمی':'🎨','شخصی‌سازی‌شده':'✨'};
const load=(key,fallback)=>{try{return JSON.parse(localStorage.getItem(key))??fallback}catch{return fallback}};
let groups=load('pulse_groups',[
 {id:'g1',name:'رفقای آخر هفته',category:'دوستان'},
 {id:'g2',name:'خانواده',category:'خانواده'},
 {id:'g3',name:'آدمِ خاص من',category:'عاطفی'}
]);
let events=load('pulse_events',[]);
function save(){localStorage.setItem('pulse_groups',JSON.stringify(groups));localStorage.setItem('pulse_events',JSON.stringify(events))}
function renderGroups(){
 $('groups').innerHTML=groups.length?groups.map(g=>`<article class="group-card"><div class="group-icon">${icons[g.category]||'✨'}</div><h3>${escapeHtml(g.name)}</h3><p>${escapeHtml(g.category)} · گروه خصوصی</p></article>`).join(''):'<div class="empty">هنوز گروهی نساختی؛ اولین دایره‌ات را بساز ✨</div>';
 $('eventGroup').innerHTML=groups.map(g=>`<option value="${g.id}">${escapeHtml(g.name)}</option>`).join('');
}
function renderEvents(){
 if(!events.length){$('events').innerHTML='<div class="empty">هنوز قراری ثبت نشده. یک لحظه خوب برنامه‌ریزی کن 💫</div>';return}
 $('events').innerHTML=events.slice().sort((a,b)=>a.time.localeCompare(b.time)).map(e=>{
  const d=new Date(e.time),g=groups.find(x=>x.id===e.groupId);
  const day=Number.isNaN(d.getTime())?'—':d.toLocaleDateString('fa-IR',{day:'numeric'});
  const month=Number.isNaN(d.getTime())?'':d.toLocaleDateString('fa-IR',{month:'short'});
  return `<article class="event-card"><div class="date-chip"><b>${day}</b>${month}</div><div class="event-info"><h3>${escapeHtml(e.title)}</h3><p>${escapeHtml(g?.name||'گروه حذف‌شده')} · ${escapeHtml(e.place||'مکان مشخص نشده')}</p></div><div class="rsvp"><button class="${e.rsvp==='yes'?'chosen':''}" data-rsvp="${e.id}" data-value="yes">میام</button><button class="${e.rsvp==='maybe'?'chosen':''}" data-rsvp="${e.id}" data-value="maybe">شاید</button></div></article>`;
 }).join('');
 document.querySelectorAll('[data-rsvp]').forEach(b=>b.addEventListener('click',()=>{const e=events.find(x=>x.id===b.dataset.rsvp);if(e){e.rsvp=b.dataset.value;save();renderEvents()}}));
}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
$('addGroupBtn').onclick=()=>$('groupDialog').showModal();
$('groupForm').addEventListener('submit',e=>{e.preventDefault();const name=$('groupName').value.trim(),category=$('groupCategory').value;if(name){groups.push({id:crypto.randomUUID(),name,category});save();renderGroups()}$('groupDialog').close();$('groupForm').reset()});
$('addEventBtn').onclick=()=>{if(!groups.length){alert('اول یک گروه بساز');return}$('eventDialog').showModal()};
$('eventForm').addEventListener('submit',e=>{e.preventDefault();events.push({id:crypto.randomUUID(),title:$('eventTitle').value.trim(),groupId:$('eventGroup').value,time:$('eventTime').value,place:$('eventPlace').value.trim(),rsvp:'yes'});save();renderEvents();$('eventDialog').close();$('eventForm').reset()});
document.querySelectorAll('[data-pulse]').forEach(b=>b.onclick=()=>{$('pulseFeedback').textContent=`«${b.dataset.pulse}» انتخاب شد؛ ارسال واقعی پس از اتصال حساب‌ها فعال می‌شود.`});
$('profileBtn').onclick=$('navProfile').onclick=()=>$('profileDialog').showModal();
$('navGroups').onclick=()=>$('groups').scrollIntoView({behavior:'smooth',block:'center'});
$('navEvents').onclick=()=>$('events').scrollIntoView({behavior:'smooth',block:'center'});
renderGroups();renderEvents();
if('serviceWorker' in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
