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
var titles={about:'Hakkında',team:'Ekip',projects:'Projeler',rnd:'Ar-Ge',achievements:'Başarılar',supporters:'Destek',contact:'İletişim'};
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

// ============ TEAM MEMBER MODAL ============
var teamData = [
  {
    no: '01',
    name: 'Tuğrul Murathan Tapar',
    role: 'Takım Kaptanı',
    dept: 'Elektrik-Elektronik, Ar-Ge',
    grade: '11. Sınıf',
    linkedin: 'https://linkedin.com/in/tuğrul-murathan-tapar',
    github: 'https://github.com/TugrulMurathanTapar'
  },
  {
    no: '02',
    name: 'Kaan Asaf Karip',
    role: 'Yazılım',
    dept: 'Yazılım Geliştirme',
    grade: '9. Sınıf',
    linkedin: null,
    github: null
  },
  {
    no: '03',
    name: 'Alperen Gülşen',
    role: 'Yazılım, Yapay Zeka',
    dept: 'Yazılım Geliştirme',
    grade: '11. Sınıf',
    linkedin: 'https://linkedin.com/in/alperengulsen',
    github: 'https://github.com/yanwela'
  },
  {
    no: '04',
    name: 'Bekir Okumuş',
    role: 'Tasarım & Mekatronik',
    dept: 'Tasarım, Mekatronik',
    grade: '10. Sınıf',
    linkedin: null,
    github: null
  },
  {
    no: '05',
    name: 'Ahmet Efe Kurulay',
    role: 'Tasarım',
    dept: 'Tasarım, Görsel İletişim',
    grade: '11. Sınıf',
    linkedin: null,
    github: null
  }
];

var teamModal = document.getElementById('teamModal');
var modalBackdrop = document.getElementById('modalBackdrop');
var modalClose = document.getElementById('modalClose');
var teamRows = document.querySelectorAll('.team-row');

function openTeamModal(index) {
  var data = teamData[index];
  if (!data || !teamModal) return;

  document.getElementById('modalMemberNo').textContent = data.no;
  document.getElementById('modalMemberGrade').textContent = data.grade;
  document.getElementById('modalMemberName').textContent = data.name;
  document.getElementById('modalMemberRole').textContent = data.role;
  document.getElementById('modalMemberDept').textContent = data.dept;

  var linkedinBox = document.getElementById('modalLinkedinBox');
  if (data.linkedin) {
    linkedinBox.innerHTML = '<a href="' + data.linkedin + '" target="_blank" rel="noopener" class="modal-link-btn linkedin"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg> ' + data.linkedin.replace('https://', '') + '</a>';
  } else {
    linkedinBox.innerHTML = '<span class="modal-link-disabled"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg> Bilgi Yok</span>';
  }

  var githubBox = document.getElementById('modalGithubBox');
  if (data.github) {
    githubBox.innerHTML = '<a href="' + data.github + '" target="_blank" rel="noopener" class="modal-link-btn github"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22"/></svg> ' + data.github.replace('https://', '') + '</a>';
  } else {
    githubBox.innerHTML = '<span class="modal-link-disabled"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg> Bilgi Yok</span>';
  }

  teamModal.classList.add('is-active');
  teamModal.setAttribute('aria-hidden', 'false');
}

function closeTeamModal() {
  if (!teamModal) return;
  teamModal.classList.remove('is-active');
  teamModal.setAttribute('aria-hidden', 'true');
}

if (teamRows) {
  teamRows.forEach(function(row) {
    row.addEventListener('click', function() {
      var idx = parseInt(row.getAttribute('data-member'), 10);
      openTeamModal(idx);
    });
    row.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        var idx = parseInt(row.getAttribute('data-member'), 10);
        openTeamModal(idx);
      }
    });
  });
}

if (modalClose) modalClose.addEventListener('click', closeTeamModal);
if (modalBackdrop) modalBackdrop.addEventListener('click', closeTeamModal);

document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape' && teamModal && teamModal.classList.contains('is-active')) {
    closeTeamModal();
  }
});

})();
