// The Imagination Project — shared interactions
(function(){
  // reveal on scroll
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});},{threshold:.12});
  document.querySelectorAll('.reveal').forEach(function(el){io.observe(el);});

  // TOC scroll-spy
  var toc=document.getElementById('toc');
  if(toc){
    var hero=document.querySelector('[data-hero]')||document.querySelector('.hero');
    var chips=[].slice.call(toc.querySelectorAll('a'));
    var secs=chips.map(function(c){return document.querySelector(c.getAttribute('href'));});
    var onScroll=function(){
      var y=window.pageYOffset;
      var trigger=hero?hero.offsetHeight-120:400;
      if(y>trigger){toc.classList.add('show');}else{toc.classList.remove('show');}
      var activeIdx=-1;
      secs.forEach(function(s,i){if(s&&s.getBoundingClientRect().top<=200){activeIdx=i;}});
      chips.forEach(function(c,i){c.classList.toggle('active',i===activeIdx);});
    };
    window.addEventListener('scroll',onScroll,{passive:true});onScroll();
  }

  // FAQ accordion
  document.querySelectorAll('.faq-q').forEach(function(q){
    q.addEventListener('click',function(){q.parentElement.classList.toggle('open');});
  });

  // Get Involved dropdown (tap/click for touch devices)
  document.querySelectorAll('.has-menu>.navlink').forEach(function(t){
    t.addEventListener('click',function(e){
      if(window.matchMedia('(hover:none)').matches){e.preventDefault();t.parentElement.classList.toggle('open');}
    });
  });

  // mobile nav toggle
  var tgl=document.getElementById('navToggle');
  if(tgl){tgl.addEventListener('click',function(){document.body.classList.toggle('nav-open');});}

  // filter chips (events)
  document.querySelectorAll('[data-filter] .chip').forEach(function(c){
    c.addEventListener('click',function(){
      c.parentElement.querySelectorAll('.chip').forEach(function(x){x.classList.remove('on');});
      c.classList.add('on');
    });
  });

  // full-bleed hero: ghost TIP watermark + scroll-down arrow
  document.querySelectorAll('.page-hero, .hero, .ehead').forEach(function(hero){
    var light=hero.classList.contains('ehead');
    if(!hero.querySelector('.ghost-logo, .hero-ghost, .ghost-mark')){
      var g=document.createElement('img');
      g.className='hero-ghost';g.alt='';g.setAttribute('aria-hidden','true');
      g.src=light?'assets/logo-mark-navy-flat.png':'assets/logo-ghost-cream.png';
      hero.appendChild(g);
    }
    if(!hero.querySelector('.hero-arrow')){
      var a=document.createElement('button');
      a.type='button';a.className='hero-arrow';a.setAttribute('aria-label','Scroll to content');
      a.innerHTML='<svg viewBox="0 0 24 24"><path d="M5 8.5l7 7 7-7"/></svg>';
      a.addEventListener('click',function(){
        var n=hero.nextElementSibling;
        while(n&&n.offsetHeight===0)n=n.nextElementSibling;
        var top=n?n.getBoundingClientRect().top+window.pageYOffset-70:hero.offsetHeight;
        window.scrollTo({top:top,behavior:'smooth'});
      });
      hero.appendChild(a);
    }
  });
})();
