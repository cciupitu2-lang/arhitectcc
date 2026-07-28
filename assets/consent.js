(() => {
  'use strict';
  const KEY = 'arhitectcc_consent_v1';
  const MAX_AGE_DAYS = 180;
  const banner = document.getElementById('cc-consent');
  const modal = document.getElementById('cc-modal');
  if (!banner || !modal) return;

  const analyticsToggle = document.getElementById('cc-analytics');
  const lang = () => document.documentElement.lang === 'en' ? 'en' : 'ro';
  const copy = {
    ro:{
      title:'Preferințe privind cookie-urile',
      text:'Folosim cookie-uri necesare pentru funcționarea site-ului și, numai cu acordul tău, cookie-uri de analiză pentru a înțelege cum este utilizat site-ul.',
      accept:'Acceptă toate', reject:'Refuză', preferences:'Preferințe', modalTitle:'Preferințe cookie',
      intro:'Poți modifica oricând alegerea din linkul „Setări cookie” din subsolul paginii.',
      necessary:'Cookie-uri necesare', necessaryDesc:'Necesare pentru funcționarea și securitatea de bază a site-ului. Nu pot fi dezactivate.', always:'Întotdeauna active',
      analytics:'Cookie-uri de analiză', analyticsDesc:'Permit Google Analytics să măsoare vizitele și utilizarea site-ului.', save:'Salvează preferințele', close:'Închide'
    },
    en:{
      title:'Cookie preferences',
      text:'We use necessary cookies for the website to function and, only with your consent, analytics cookies to understand how the website is used.',
      accept:'Accept all', reject:'Reject', preferences:'Preferences', modalTitle:'Cookie preferences',
      intro:'You can change your choice at any time using the “Cookie settings” link in the footer.',
      necessary:'Necessary cookies', necessaryDesc:'Required for the website’s basic operation and security. They cannot be disabled.', always:'Always active',
      analytics:'Analytics cookies', analyticsDesc:'Allow Google Analytics to measure visits and website usage.', save:'Save preferences', close:'Close'
    }
  };

  function translate(){
    const t=copy[lang()];
    document.querySelectorAll('[data-cc-i18n]').forEach(el=>{ const k=el.dataset.ccI18n; if(t[k]) el.textContent=t[k]; });
    modal.querySelector('.cc-close').setAttribute('aria-label',t.close);
  }
  function read(){
    try{
      const v=JSON.parse(localStorage.getItem(KEY));
      if(!v || !v.savedAt) return null;
      if(Date.now()-v.savedAt > MAX_AGE_DAYS*86400000){ localStorage.removeItem(KEY); return null; }
      return v;
    }catch(e){ return null; }
  }
  function updateGoogle(analytics){
    window.gtag = window.gtag || function(){ window.dataLayer.push(arguments); };
    window.gtag('consent','update',{
      analytics_storage: analytics ? 'granted':'denied',
      ad_storage:'denied', ad_user_data:'denied', ad_personalization:'denied',
      functionality_storage:'granted', security_storage:'granted'
    });
  }
  function save(analytics){
    localStorage.setItem(KEY,JSON.stringify({analytics:!!analytics,savedAt:Date.now()}));
    updateGoogle(!!analytics);
    banner.hidden=true; modal.hidden=true; document.body.style.overflow='';
  }
  function openPrefs(){
    const v=read(); analyticsToggle.checked=!!(v&&v.analytics);
    translate(); modal.hidden=false; document.body.style.overflow='hidden';
    modal.querySelector('.cc-close').focus();
  }
  function closePrefs(){ modal.hidden=true; document.body.style.overflow=''; }

  banner.querySelector('[data-cc-action="accept"]').addEventListener('click',()=>save(true));
  banner.querySelector('[data-cc-action="reject"]').addEventListener('click',()=>save(false));
  banner.querySelector('[data-cc-action="preferences"]').addEventListener('click',openPrefs);
  modal.querySelector('[data-cc-action="save"]').addEventListener('click',()=>save(analyticsToggle.checked));
  modal.querySelector('[data-cc-action="accept"]').addEventListener('click',()=>save(true));
  modal.querySelector('.cc-close').addEventListener('click',closePrefs);
  modal.addEventListener('click',e=>{if(e.target===modal) closePrefs();});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!modal.hidden) closePrefs();});
  document.querySelectorAll('[data-cc-open]').forEach(el=>el.addEventListener('click',openPrefs));

  const observer=new MutationObserver(translate);
  observer.observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
  translate();
  const saved=read();
  if(saved){ updateGoogle(saved.analytics); banner.hidden=true; }
  else { banner.hidden=false; }
})();
