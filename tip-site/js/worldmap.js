/* TIP — world atlas: learn mode (hover data) + country guessing game. Requires d3-geo, topojson-client, TIP_GEO, TIP_I18N. */
(function(){
var mapEl=document.getElementById('atlas-map'),panel=document.getElementById('atlas-panel');
if(!mapEl)return;
var t=function(k){return window.TIP_I18N?TIP_I18N.t(k):k;};
var GEO=window.TIP_GEO.data,ALIAS=window.TIP_GEO.aliases,SOV=window.TIP_GEO.sov;
var REGIONS={World:null,g_af:'AF',g_as:'AS',g_eu:'EU',g_am:'AM',g_oc:'OC'};
var svg,paths={},countries=[];
var mode='learn';
var game={on:false,region:'World',style:'type',score:0,total:0,time:90,target:null,timer:null,done:false};
var hovered=null;

function norm(s){return s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();}

fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json').then(function(r){return r.json();}).then(function(topo){
  var feats=topojson.feature(topo,topo.objects.countries).features.filter(function(f){return f.properties.name!=='Antarctica';});
  var W=960,H=520;
  var proj=d3.geoNaturalEarth1().fitSize([W,H],{type:'FeatureCollection',features:feats});
  var geoPath=d3.geoPath(proj);
  svg=document.createElementNS('http://www.w3.org/2000/svg','svg');
  svg.setAttribute('viewBox','0 0 '+W+' '+H);
  svg.setAttribute('class','atlas-svg');
  feats.forEach(function(f){
    var name=f.properties.name;
    var p=document.createElementNS('http://www.w3.org/2000/svg','path');
    p.setAttribute('d',geoPath(f));
    p.setAttribute('class','cty');
    p.setAttribute('data-name',name);
    svg.appendChild(p);
    paths[name]=p;
    countries.push(name);
    p.addEventListener('pointerenter',function(){onHover(name);});
    p.addEventListener('pointerleave',function(){onHover(null);});
    p.addEventListener('click',function(){onHover(name);});
  });
  var EXTRA={"Tuvalu":[179.19,-8.52]};
  Object.keys(EXTRA).forEach(function(name){
    if(paths[name])return;
    var xy=proj(EXTRA[name]);
    var c=document.createElementNS('http://www.w3.org/2000/svg','circle');
    c.setAttribute('cx',xy[0]);c.setAttribute('cy',xy[1]);c.setAttribute('r',2.6);
    c.setAttribute('class','cty');c.setAttribute('data-name',name);
    svg.appendChild(c);paths[name]=c;countries.push(name);
    c.addEventListener('pointerenter',function(){onHover(name);});
    c.addEventListener('pointerleave',function(){onHover(null);});
    c.addEventListener('click',function(){onHover(name);});
  });
  mapEl.appendChild(svg);
  renderPanel();
}).catch(function(){
  mapEl.innerHTML='<p style="padding:40px;color:#3f5a58;font-size:15px;">Map data could not load — check your connection.</p>';
});

function info(name){var d=GEO[name];return d?{i:d[0],l:d[1],r:d[2]}:null;}
function onHover(name){
  if(hovered&&paths[hovered])paths[hovered].classList.remove('hov');
  hovered=name;
  if(name&&paths[name]&&mode==='learn')paths[name].classList.add('hov');
  if(mode==='learn')renderPanel();
}

/* ---------- panel rendering ---------- */
function el(html){var d=document.createElement('div');d.innerHTML=html;return d.firstElementChild;}
function fmt(v){return v==null?'—':v+'%';}
function bar(v,cls){return '<div class="a-bar"><div class="a-fill '+(cls||'')+'" style="width:'+(v||0)+'%"></div></div>';}

function renderPanel(){
  if(mode==='learn'){
    var name=hovered,d=name?info(name):null;
    panel.innerHTML=
      '<p class="a-label">'+t('tab_learn')+'</p>'+
      (name?
        '<h3 class="a-cty">'+name+'</h3>'+
        (d&&d.i!=null?
          '<div class="a-metric"><span>'+t('map_int')+'</span><b>'+fmt(d.i)+'</b>'+bar(d.i,'')+'</div>'+
          '<div class="a-metric"><span>'+t('map_lit')+'</span><b>'+fmt(d.l)+'</b>'+bar(d.l,'gold')+'</div>'
          :'<p class="a-hint">'+t('map_nodata')+'</p>')
        :'<p class="a-hint">'+t('map_hint')+'</p>'+
         '<div class="a-metric ghosted"><span>'+t('map_int')+'</span><b>··%</b>'+bar(0)+'</div>'+
         '<div class="a-metric ghosted"><span>'+t('map_lit')+'</span><b>··%</b>'+bar(0)+'</div>');
    return;
  }
  /* guess mode */
  if(!game.on){
    var regs=Object.keys(REGIONS).map(function(k){
      var lbl=k==='World'?t('g_world'):t(k);
      return '<button type="button" class="a-chip'+(game.region===k?' on':'')+'" data-reg="'+k+'">'+lbl+'</button>';
    }).join('');
    panel.innerHTML=
      '<p class="a-label">'+t('tab_guess')+'</p>'+
      (game.done?'<h3 class="a-cty">'+t('g_end')+'</h3><p class="a-score-big">'+game.score+' / '+game.total+'</p>':'')+
      '<p class="a-sub">'+t('g_region')+'</p><div class="a-chips">'+regs+'</div>'+
      '<p class="a-sub">'+t('g_mode')+'</p><div class="a-chips">'+
        '<button type="button" class="a-chip'+(game.style==='type'?' on':'')+'" data-style="type">'+t('g_type')+'</button>'+
        '<button type="button" class="a-chip'+(game.style==='mc'?' on':'')+'" data-style="mc">'+t('g_mc')+'</button>'+
        '<button type="button" class="a-chip'+(game.style==='free'?' on':'')+'" data-style="free">'+t('g_free')+'</button>'+
      '</div>'+
      '<button type="button" class="btn btn-solid a-start">'+(game.done?t('g_again'):t('g_start'))+' <span class="arr">→</span></button>';
    panel.querySelectorAll('[data-reg]').forEach(function(b){b.addEventListener('click',function(){game.region=b.getAttribute('data-reg');renderPanel();});});
    panel.querySelectorAll('[data-style]').forEach(function(b){b.addEventListener('click',function(){game.style=b.getAttribute('data-style');renderPanel();});});
    panel.querySelector('.a-start').addEventListener('click',startGame);
    return;
  }
  /* playing */
  var head='<div class="a-hud"><span>'+t('g_score')+' <b>'+game.score+'/'+game.total+'</b></span><span class="a-clock">'+fmtTime(game.time)+'</span></div>'+
    '<div class="a-timebar"><div style="width:'+(game.time/game.max*100)+'%"></div></div>'+
    '<p class="a-sub" style="margin-top:18px;">'+(game.style==='free'?t('g_free_prompt'):t('g_prompt'))+'</p>';
  if(game.style==='free'){
    panel.innerHTML=head+
      '<form class="a-form"><input type="text" class="a-input" placeholder="'+t('g_ph')+'" autocomplete="off" />'+
      '<div class="a-row"><button type="submit" class="btn btn-solid a-sm">'+t('g_guess')+'</button>'+
      '<button type="button" class="btn a-sm a-stop">'+t('g_stop')+'</button></div></form>';
    var ff=panel.querySelector('.a-form'),fi=panel.querySelector('.a-input');
    fi.focus();
    ff.addEventListener('submit',function(e){
      e.preventDefault();
      var guess=norm(fi.value||'');if(!guess)return;
      var ali=ALIAS[guess],name=null,p=pool();
      for(var i=0;i<p.length;i++){if(norm(p[i])===guess||(ali&&p[i]===ali)){name=p[i];break;}}
      if(name){
        if(!game.found[name]){
          game.found[name]=1;game.score++;updateHud();
          paths[name].classList.add('found');
          if(navigator.vibrate)navigator.vibrate(15);
          if(game.score>=game.total){endGame();return;}
        }
        fi.value='';
      }else{fi.classList.remove('shake');void fi.offsetWidth;fi.classList.add('shake');fi.select();}
    });
    panel.querySelector('.a-stop').addEventListener('click',endGame);
    return;
  }
  if(game.style==='type'){
    panel.innerHTML=head+
      '<form class="a-form"><input type="text" class="a-input" data-t-ph="g_ph" placeholder="'+t('g_ph')+'" autocomplete="off" />'+
      '<div class="a-row"><button type="submit" class="btn btn-solid a-sm">'+t('g_guess')+'</button>'+
      '<button type="button" class="btn a-sm a-skip">'+t('g_skip')+'</button></div></form>';
    var form=panel.querySelector('.a-form'),input=panel.querySelector('.a-input');
    input.focus();
    form.addEventListener('submit',function(e){
      e.preventDefault();
      if(game.locked)return;
      var guess=norm(input.value||'');if(!guess)return;
      var target=norm(game.target),ali=ALIAS[guess];
      if(guess===target||(ali&&norm(ali)===target)){good();}
      else{miss(input);}
    });
    panel.querySelector('.a-skip').addEventListener('click',skip);
  }else{
    var opts=mcOptions();
    panel.innerHTML=head+'<div class="a-opts">'+opts.map(function(o){return '<button type="button" class="a-opt" data-n="'+o.replace(/"/g,'&quot;')+'">'+o+'</button>';}).join('')+'</div>'+
      '<button type="button" class="btn a-sm a-skip" style="margin-top:14px;">'+t('g_skip')+'</button>';
    panel.querySelectorAll('.a-opt').forEach(function(b){
      b.addEventListener('click',function(){
        if(game.locked)return;
        if(b.getAttribute('data-n')===game.target){b.classList.add('good');good();}
        else{b.classList.add('bad');
          var g=panel.querySelector('.a-opt[data-n="'+game.target.replace(/"/g,'\\"')+'"]');
          if(g)g.classList.add('good');
          miss();}
      });
    });
    panel.querySelector('.a-skip').addEventListener('click',skip);
  }
}

function pool(){
  var reg=REGIONS[game.region];
  return countries.filter(function(n){if(SOV.indexOf(n)<0||!paths[n])return false;var d=GEO[n];return d&&(!reg||d[2]===reg);});
}
function mcOptions(){
  var p=pool().filter(function(n){return n!==game.target;});
  var opts=[game.target];
  while(opts.length<4&&p.length){opts.push(p.splice(Math.floor(Math.random()*p.length),1)[0]);}
  return opts.sort(function(){return Math.random()-.5;});
}
function fmtTime(s){return s>=60?Math.floor(s/60)+':'+('0'+s%60).slice(-2):s+'s';}
function startGame(){
  game.on=true;game.done=false;game.score=0;game.total=pool().length;game.locked=false;
  game.max=game.style==='free'?600:90;game.time=game.max;game.found={};
  if(svg)svg.querySelectorAll('.found').forEach(function(p){p.classList.remove('found');});
  clearInterval(game.timer);
  game.timer=setInterval(function(){
    game.time--;
    var c=panel.querySelector('.a-clock'),tb=panel.querySelector('.a-timebar>div');
    if(c)c.textContent=fmtTime(game.time);
    if(tb)tb.style.width=(game.time/game.max*100)+'%';
    if(game.time<=0)endGame();
  },1000);
  if(game.style==='free'){renderPanel();}else{next();}
}
function next(){
  game.locked=false;
  if(paths[game.target])paths[game.target].classList.remove('target','good-flash','bad-flash');
  var p=pool();if(!p.length){endGame();return;}
  var prev=game.target;
  do{game.target=p[Math.floor(Math.random()*p.length)];}while(p.length>1&&game.target===prev);
  paths[game.target].classList.add('target');
  renderPanel();
}
function updateHud(){var h=panel.querySelector('.a-hud b');if(h)h.textContent=game.score+'/'+game.total;}
function good(){
  if(game.locked)return;game.locked=true;
  game.score++;updateHud();
  if(navigator.vibrate)navigator.vibrate(20);
  var tp=paths[game.target];if(tp){tp.classList.add('good-flash');}
  setTimeout(next,420);
}
function miss(input){
  if(game.locked)return;game.locked=true;
  if(navigator.vibrate)navigator.vibrate([15,50,15]);
  if(input){input.classList.remove('shake');void input.offsetWidth;input.classList.add('shake');}
  var tp=paths[game.target];if(tp){tp.classList.remove('target');tp.classList.add('bad-flash');}
  panel.querySelectorAll('input,button').forEach(function(x){x.disabled=true;});
  var f=panel.querySelector('.a-form');
  (f||panel).insertAdjacentHTML(f?'afterend':'beforeend','<p class="a-reveal">'+t('g_was')+': <b>'+game.target+'</b></p>');
  setTimeout(next,1500);
}
function skip(){miss();}
function endGame(){
  clearInterval(game.timer);
  if(paths[game.target])paths[game.target].classList.remove('target');
  game.on=false;game.done=true;renderPanel();
}

/* ---------- tabs + fullscreen ---------- */
var tabL=document.getElementById('tab-learn'),tabG=document.getElementById('tab-guess'),shell=document.getElementById('atlas-shell');
function setMode(m){
  mode=m;
  if(hovered&&paths[hovered]){paths[hovered].classList.remove('hov');hovered=null;}
  tabL.classList.toggle('on',m==='learn');tabG.classList.toggle('on',m==='guess');
  if(m==='learn'){endGameQuiet();}
  renderPanel();
}
function endGameQuiet(){clearInterval(game.timer);if(paths[game.target])paths[game.target].classList.remove('target');game.on=false;game.done=false;}
tabL.addEventListener('click',function(){setMode('learn');});
tabG.addEventListener('click',function(){setMode('guess');});
var fsBtn=document.getElementById('atlas-fs');
function fsFallbackOff(){shell.classList.remove('fs-fallback');document.body.style.overflow='';}
fsBtn.addEventListener('click',function(){
  if(document.fullscreenElement){document.exitFullscreen();return;}
  if(shell.classList.contains('fs-fallback')){fsFallbackOff();return;}
  var used=false;
  try{
    if(shell.requestFullscreen){
      var p=shell.requestFullscreen();used=true;
      if(p&&p.catch)p.catch(function(){shell.classList.add('fs-fallback');document.body.style.overflow='hidden';});
    }
  }catch(e){used=false;}
  if(!used){shell.classList.add('fs-fallback');document.body.style.overflow='hidden';}
});
document.addEventListener('keydown',function(e){if(e.key==='Escape')fsFallbackOff();});
window.TIPAtlas={onLang:function(){renderPanel();}};
})();
