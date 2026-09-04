
  (function(){
    
    const btn = document.querySelector('.menu-btn');
    const nav = document.getElementById('main-nav');
    if (btn && nav) {
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
    }
    
      const statsCard = document.querySelector('.hero-card');
      const statValues = statsCard ? [...statsCard.querySelectorAll('.about-stat-value')] : [];
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      let animationRun = 0;
    
      function animateStat(element, target, duration, runId) {
        return new Promise((resolve) => {
          if (reduceMotion) {
            element.textContent = `${target}${element.dataset.suffix}`;
            resolve();
            return;
          }
    
          const startTime = performance.now();
    
          function updateStat(currentTime) {
            if (runId !== animationRun) {
              resolve();
              return;
            }
    
            const progress = Math.min((currentTime - startTime) / duration, 1);
            element.textContent = `${Math.floor(progress * target)}${element.dataset.suffix}`;
    
            if (progress < 1) {
              window.requestAnimationFrame(updateStat);
            } else {
              resolve();
            }
          }
    
          window.requestAnimationFrame(updateStat);
        });
      }
    
      async function startStatsCounter() {
        const runId = ++animationRun;
    
        statValues.forEach((value) => {
          value.textContent = `0${value.dataset.suffix}`;
        });
    
        for (const value of statValues) {
          await animateStat(value, Number(value.dataset.target), 1200, runId);
          if (runId !== animationRun) return;
          await new Promise((resolve) => window.setTimeout(resolve, 180));
        }
      }
    
      if (statsCard && statValues.length) {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) startStatsCounter();
          });
        }, { threshold: 0.45 });
    
        observer.observe(statsCard);
      }
  })();
