
  (function(){
    
    const btn = document.querySelector('.menu-btn');
    const nav = document.getElementById('main-nav');
    if(!btn || !nav) return;
    btn.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      btn.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', String(open));
    });
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) {
        nav.classList.remove('open');
        btn.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
      }
    });
  })();
