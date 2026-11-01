const SEL='.league-card,.side-card,.competition-card,.news-card,.lead-story,.mini-story,.fa-dock-item,.fa-trust-cell,.fetan-favorites-entry,.fetan-final-cta,.competition-module,.article-body,.detail-card,.fa-footer,.fa-pulse';
export function initReveal(){
  if(typeof IntersectionObserver==='undefined'||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return()=>{};
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('fa-in');io.unobserve(e.target)}}),{threshold:.06,rootMargin:'0px 0px -5% 0px'});
  const seen=new WeakSet();
  const scan=()=>{let i=0;document.querySelectorAll(SEL).forEach(el=>{if(seen.has(el))return;seen.add(el);el.classList.add('fa-reveal');el.style.transitionDelay=(i++%5)*60+'ms';io.observe(el)})};
  scan();
  const mo=new MutationObserver(scan);mo.observe(document.body,{childList:true,subtree:true});
  return()=>{io.disconnect();mo.disconnect()};
}
