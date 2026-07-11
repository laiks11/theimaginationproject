/* TIP — shared interactions */
(function(){
  // nav scrolled state
  var nav=document.querySelector('.nav');
  function onScroll(){nav&&nav.classList.toggle('scrolled',window.scrollY>24);}
  window.addEventListener('scroll',onScroll,{passive:true});onScroll();

  // drawer
  var burger=document.querySelector('.burger'),scrim=document.querySelector('.scrim');
  function toggleDrawer(force){document.body.classList.toggle('drawer-open',force);}
  burger&&burger.addEventListener('click',function(){toggleDrawer();});
  scrim&&scrim.addEventListener('click',function(){toggleDrawer(false);});
  document.addEventListener('keydown',function(e){if(e.key==='Escape')toggleDrawer(false);});

  // reveal on scroll
  var io=new IntersectionObserver(function(es){
    es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});
  },{threshold:.14,rootMargin:'0px 0px -40px 0px'});
  document.querySelectorAll('.reveal,.reveal-line').forEach(function(el){io.observe(el);});

  // stagger children marked data-stagger
  document.querySelectorAll('[data-stagger]').forEach(function(g){
    Array.prototype.forEach.call(g.children,function(c,i){c.style.transitionDelay=(i*90)+'ms';});
  });

  // accordion
  document.querySelectorAll('.acc-item>button').forEach(function(btn){
    btn.addEventListener('click',function(){
      var item=btn.parentElement,body=item.querySelector('.acc-body'),open=item.classList.contains('open');
      var parent=item.parentElement;
      parent.querySelectorAll('.acc-item.open').forEach(function(o){
        o.classList.remove('open');o.querySelector('.acc-body').style.maxHeight='0px';
      });
      if(!open){item.classList.add('open');body.style.maxHeight=body.scrollHeight+'px';}
    });
  });

  // counters
  var cio=new IntersectionObserver(function(es){
    es.forEach(function(e){
      if(!e.isIntersecting)return;cio.unobserve(e.target);
      var el=e.target,target=parseFloat(el.getAttribute('data-count')),suffix=el.getAttribute('data-suffix')||'';
      var t0=null;
      function step(t){
        if(!t0)t0=t;var p=Math.min((t-t0)/1600,1);p=1-Math.pow(1-p,3);
        var v=Math.round(target*p);
        el.childNodes[0].nodeValue=(el.hasAttribute('data-plain')||target<=2100)?String(v):v.toLocaleString();
        if(p<1)requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
      if(suffix&&!el.querySelector('i')){var i=document.createElement('i');i.textContent=suffix;el.appendChild(i);}
    });
  },{threshold:.5});
  document.querySelectorAll('[data-count]').forEach(function(el){el.childNodes[0].nodeValue='0';cio.observe(el);});

  // footer year
  var y=document.getElementById('year');if(y)y.textContent=new Date().getFullYear();

  // scroll-driven ink fill
  var inks=document.querySelectorAll('[data-ink]');
  inks.forEach(function(el){
    var walker=document.createTreeWalker(el,NodeFilter.SHOW_TEXT),nodes=[];
    while(walker.nextNode())nodes.push(walker.currentNode);
    nodes.forEach(function(n){
      if(!n.nodeValue.trim())return;
      var frag=document.createDocumentFragment();
      n.nodeValue.split(/(\s+)/).forEach(function(part){
        if(/^\s+$/.test(part)||part===''){frag.appendChild(document.createTextNode(part));return;}
        var s=document.createElement('span');s.className='w';s.textContent=part;frag.appendChild(s);
      });
      n.parentNode.replaceChild(frag,n);
    });
  });
  function inkTick(){
    inks.forEach(function(el){
      var r=el.getBoundingClientRect(),vh=window.innerHeight;
      var p=(vh*.82-r.top)/(r.height+vh*.28);p=Math.max(0,Math.min(1,p));
      var ws=el.querySelectorAll('.w'),n=Math.round(ws.length*p);
      ws.forEach(function(w,i){w.classList.toggle('on',i<n);});
    });
  }
  if(inks.length){window.addEventListener('scroll',inkTick,{passive:true});inkTick();}
})();
