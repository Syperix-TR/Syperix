(function(){'use strict';
document.documentElement.classList.add('js');
var navToggle=document.getElementById('navToggle');
var barNav=document.getElementById('barNav');
if(navToggle&&barNav){
function closeNav(){barNav.classList.remove('is-open');navToggle.setAttribute('aria-expanded','false');}
function openNav(){barNav.classList.add('is-open');navToggle.setAttribute('aria-expanded','true');}
navToggle.addEventListener('click',function(){if(barNav.classList.contains('is-open')){closeNav();}else{openNav();}});
barNav.addEventListener('click',function(e){if(e.target&&e.target.closest('a')){closeNav();}});
document.addEventListener('keydown',function(e){if(e.key==='Escape'&&barNav.classList.contains('is-open')){closeNav();}});
}
if('IntersectionObserver' in window){
var sections=document.querySelectorAll('main section[id]');
var barLinks=document.querySelectorAll('.bar-nav a');
var titles={about:'Hakkında',team:'Ekip',projects:'Projeler',rnd:'Ar-Ge',achievements:'Kayıt',supporters:'Destek',contact:'İletişim'};
var activeObserver=new IntersectionObserver(function(entries){entries.forEach(function(entry){if(entry.isIntersecting){barLinks.forEach(function(a){a.classList.remove('is-active');});var target=document.querySelector('.bar-nav a[href=\"#'+entry.target.id+'\"]');if(target){target.classList.add('is-active');}document.title='Syperix - '+(titles[entry.target.id]||'Ar-Ge Takımı');}});},{rootMargin:'-45% 0px -50% 0px'});
sections.forEach(function(s){activeObserver.observe(s);});
}
var revealSelectors=['.sec-head','.about-lead','.about-text','.fields li','.roster tbody tr','.sheet','.dossier li','.log li','.support-row','.support-cta','.reach > div','.paper'];
var revealElements=[];
revealSelectors.forEach(function(sel){var nodes=document.querySelectorAll(sel);Array.prototype.forEach.call(nodes,function(el){el.classList.add('reveal');revealElements.push(el);});});
var prefersReduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if('IntersectionObserver' in window && !prefersReduced){
var revealObserver=new IntersectionObserver(function(entries,obs){entries.forEach(function(entry){if(entry.isIntersecting){entry.target.classList.add('is-in');obs.unobserve(entry.target);}});},{threshold:0.12});
revealElements.forEach(function(el){revealObserver.observe(el);});
}else{
revealElements.forEach(function(el){el.classList.add('is-in');});
}
var hero=document.getElementById('top');
var out=document.getElementById('xhOut');
if(hero&&out){
var rafId=null;
function onMove(e){if(e.pointerType!=='mouse'){return;}var rect=hero.getBoundingClientRect();var x=e.clientX-rect.left;var y=e.clientY-rect.top;function update(){hero.style.setProperty('--x',x+'px');hero.style.setProperty('--y',y+'px');out.textContent='X '+String(Math.round(x)).padStart(3,'0')+' \u00b7 Y '+String(Math.round(y)).padStart(3,'0');hero.classList.add('is-live');rafId=null;}
if(rafId===null){rafId=requestAnimationFrame(update);}
}
function onLeave(){if(rafId!==null){cancelAnimationFrame(rafId);rafId=null;}hero.classList.remove('is-live');}
hero.addEventListener('pointermove',onMove);
hero.addEventListener('pointerleave',onLeave);
}
var contactForm=document.getElementById('contactForm');
if(contactForm){
var sendButton=contactForm.querySelector('button.send');
var originalText=sendButton?sendButton.textContent:null;
var toast=document.getElementById('toast');
var toastTimer=null;
function showToast(msg,ms){if(!toast){return;}toast.textContent=msg;toast.classList.add('show');if(toastTimer){clearTimeout(toastTimer);}toastTimer=setTimeout(function(){toast.classList.remove('show');},ms);}
contactForm.addEventListener('submit',function(e){e.preventDefault();if(!sendButton){return;}sendButton.disabled=true;sendButton.textContent='Gönderiliyor...';var action=contactForm.action;if(typeof action!=='string'||!action){sendButton.disabled=false;sendButton.textContent=originalText||'';return;}fetch(action,{method:'POST',body:new FormData(contactForm),headers:{Accept:'application/json'}}).then(function(resp){if(resp.ok){contactForm.reset();showToast('Mesajınız gönderildi. Teşekkürler.',4000);}else{return resp.json().then(function(data){var msg='Mesaj gönderilemedi. Lütfen tekrar deneyin.';if(data&&Array.isArray(data.errors)){msg=data.errors.map(function(e){return e.message;}).join(', ');}showToast(msg,5000);});}}).catch(function(){showToast('Bağlantı hatası. Lütfen tekrar deneyin.',5000);}).finally(function(){sendButton.disabled=false;sendButton.textContent=originalText||'';});});
}
})();