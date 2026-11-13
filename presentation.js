'use strict';
document.querySelectorAll('[data-jump-feature]').forEach(a=>a.addEventListener('click',()=>{document.querySelector('[data-feature="'+a.dataset.jumpFeature+'"]').click()}));
const backTop=document.querySelector('.back-top');const updateScroll=()=>backTop.classList.toggle('visible',window.scrollY>650);addEventListener('scroll',updateScroll,{passive:true});updateScroll();
const sectionLinks=[...document.querySelectorAll('#navigation a')];const observer=new IntersectionObserver(entries=>{for(const e of entries)if(e.isIntersecting)sectionLinks.forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+e.target.id))},{rootMargin:'-15% 0px -60% 0px'});document.querySelectorAll('#studio,#creation,#univers,#questions').forEach(s=>observer.observe(s));
