/* TIP — hero: WebGL aurora, kinetic headline, language switcher */
(function(){
  /* ---------- WebGL aurora background ---------- */
  var canvas=document.getElementById('hero-gl');
  if(canvas&&window.WebGLRenderingContext){
    var gl=canvas.getContext('webgl',{antialias:false,alpha:false});
    if(gl){
      var vs='attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
      var fs=[
        'precision highp float;',
        'uniform vec2 r;uniform float t;uniform vec2 m;',
        'float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453123);}',
        'float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);',
        ' return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}',
        'float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*n(p);p*=2.03;a*=.5;}return v;}',
        'void main(){',
        ' vec2 uv=gl_FragCoord.xy/r;vec2 q=uv;q.x*=r.x/r.y;',
        ' float T=t*.05;',
        ' vec2 drift=vec2(fbm(q*1.4+T),fbm(q*1.4-T+7.3));',
        ' float f=fbm(q*1.8+drift*1.6+vec2(T*.8,-T*.5)+ (m-.5)*.35);',
        ' float f2=fbm(q*2.6-drift*1.2+vec2(-T*.6,T*.9));',
        ' vec3 cream=vec3(.976,.969,.957);',
        ' vec3 teal=vec3(.039,.49,.478);',
        ' vec3 tealSoft=vec3(.72,.868,.86);',
        ' vec3 gold=vec3(.788,.663,.38);',
        ' vec3 col=cream;',
        ' col=mix(col,tealSoft,smoothstep(.42,.78,f)*.55);',
        ' col=mix(col,teal,smoothstep(.62,.95,f)*.38);',
        ' col=mix(col,gold,smoothstep(.66,.98,f2)*.28);',
        ' float vig=smoothstep(1.25,.35,length(uv-vec2(.5,.42)));',
        ' col=mix(cream,col,vig);',
        ' float g=h(gl_FragCoord.xy+t);col+= (g-.5)*.028;',
        ' gl_FragColor=vec4(col,1.);}'
      ].join('\n');
      function sh(type,src){var s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);return s;}
      var prog=gl.createProgram();
      gl.attachShader(prog,sh(gl.VERTEX_SHADER,vs));
      gl.attachShader(prog,sh(gl.FRAGMENT_SHADER,fs));
      gl.linkProgram(prog);gl.useProgram(prog);
      var buf=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buf);
      gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),gl.STATIC_DRAW);
      var loc=gl.getAttribLocation(prog,'p');gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,2,gl.FLOAT,false,0,0);
      var uR=gl.getUniformLocation(prog,'r'),uT=gl.getUniformLocation(prog,'t'),uM=gl.getUniformLocation(prog,'m');
      var mx=.5,my=.5,tmx=.5,tmy=.5;
      window.addEventListener('pointermove',function(e){tmx=e.clientX/window.innerWidth;tmy=1-e.clientY/window.innerHeight;},{passive:true});
      function resize(){
        var d=Math.min(window.devicePixelRatio||1,1.5);
        canvas.width=canvas.clientWidth*d;canvas.height=canvas.clientHeight*d;
        gl.viewport(0,0,canvas.width,canvas.height);
      }
      window.addEventListener('resize',resize);resize();
      var reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      var t0=performance.now();
      (function frame(now){
        mx+=(tmx-mx)*.04;my+=(tmy-my)*.04;
        gl.uniform2f(uR,canvas.width,canvas.height);
        gl.uniform1f(uT,(now-t0)/1000);
        gl.uniform2f(uM,mx,my);
        gl.drawArrays(gl.TRIANGLES,0,3);
        if(!reduced)requestAnimationFrame(frame);
      })(t0);
    }
  }

  /* ---------- language data ---------- */
  var LANGS={
    en:{label:'EN',title:'Imagine Better',sub:'write our future',dir:'ltr',latin:true},
    es:{label:'ES',title:'Imagina mejor',sub:'escribe nuestro futuro',dir:'ltr',latin:true},
    fr:{label:'FR',title:'Imaginez mieux',sub:'\u00e9crivez notre avenir',dir:'ltr',latin:true},
    zh:{label:'\u4e2d\u6587',title:'\u60f3\u8c61\u66f4\u597d',sub:'\u4e66\u5199\u6211\u4eec\u7684\u672a\u6765',dir:'ltr',latin:false},
    hi:{label:'\u0939\u093f\u0902',title:'\u092c\u0947\u0939\u0924\u0930 \u0915\u0940 \u0915\u0932\u094d\u092a\u0928\u093e \u0915\u0930\u0947\u0902',sub:'\u0939\u092e\u093e\u0930\u093e \u092d\u0935\u093f\u0937\u094d\u092f \u0932\u093f\u0916\u0947\u0902',dir:'ltr',latin:false},
    ar:{label:'\u0639\u0631\u0628\u064a',title:'\u062a\u062e\u064a\u0651\u0644 \u0623\u0641\u0636\u0644',sub:'\u0627\u0643\u062a\u0628 \u0645\u0633\u062a\u0642\u0628\u0644\u0646\u0627',dir:'rtl',latin:false},
    ru:{label:'RU',title:'\u041f\u0440\u0435\u0434\u0441\u0442\u0430\u0432\u044c \u043b\u0443\u0447\u0448\u0435\u0435',sub:'\u043d\u0430\u043f\u0438\u0448\u0438 \u043d\u0430\u0448\u0435 \u0431\u0443\u0434\u0443\u0449\u0435\u0435',dir:'ltr',latin:false},
    asl:{label:'ASL',title:'Imagine Better',sub:'write our future',dir:'ltr',latin:true,asl:true}
  };

  var titleEl=document.getElementById('hero-title');
  var subEl=document.getElementById('hero-sub');
  var noteEl=document.getElementById('hero-lang-note');
  var hero=document.getElementById('hero');
  if(!titleEl)return;

  function buildTitle(lang){
    var d=LANGS[lang];
    titleEl.innerHTML='';
    titleEl.setAttribute('dir',d.dir);
    titleEl.classList.toggle('nonlatin',!d.latin);
    titleEl.classList.toggle('asl',!!d.asl);
    var words=d.title.split(' ');
    words.forEach(function(word,wi){
      var w=document.createElement('span');w.className='word';
      if(d.latin&&!d.asl){
        for(var i=0;i<word.length;i++){
          var l=document.createElement('span');l.className='ltr';l.textContent=word[i];
          l.style.transitionDelay=(wi*word.length+i)*28+'ms';
          w.appendChild(l);
        }
      }else if(d.asl){
        for(var j=0;j<word.length;j++){
          var t=document.createElement('span');t.className='asl-tile';t.textContent=word[j].toUpperCase();
          t.style.transitionDelay=(wi*word.length+j)*28+'ms';
          w.appendChild(t);
        }
      }else{
        var g=document.createElement('span');g.className='ltr whole';g.textContent=word;
        g.style.transitionDelay=wi*90+'ms';
        w.appendChild(g);
      }
      titleEl.appendChild(w);
      if(wi<words.length-1)titleEl.appendChild(document.createTextNode(' '));
    });
    subEl.textContent=d.sub;
    subEl.setAttribute('dir',d.dir);
    noteEl.textContent=d.asl?'ASL is a signed language \u2014 shown fingerspelled':'';
    requestAnimationFrame(function(){requestAnimationFrame(function(){titleEl.classList.add('ready');});});
  }

  // enter animation restart on language change
  function setLang(lang){
    titleEl.classList.remove('ready');
    subEl.classList.add('swap');
    setTimeout(function(){buildTitle(lang);subEl.classList.remove('swap');},260);
    document.querySelectorAll('.lang-chip').forEach(function(c){
      c.classList.toggle('on',c.getAttribute('data-lang')===lang);
    });
  }
  document.querySelectorAll('.lang-chip').forEach(function(c){
    c.addEventListener('click',function(){setLang(c.getAttribute('data-lang'));});
  });
  buildTitle('en');
  requestAnimationFrame(function(){titleEl.classList.add('ready');});

  /* ---------- ghost logo parallax ---------- */
  var ghost=document.querySelector('.hero-ghost');
  if(ghost){
    window.addEventListener('pointermove',function(e){
      var x=(e.clientX/window.innerWidth-.5)*26,y=(e.clientY/window.innerHeight-.5)*20;
      ghost.style.transform='translate(calc(-50% + '+x+'px), calc(-50% + '+y+'px))';
    },{passive:true});
  }

  /* ---------- scroll cue ---------- */
  var cue=document.querySelector('.hero-cue');
  cue&&cue.addEventListener('click',function(){
    var n=hero.nextElementSibling;
    window.scrollTo({top:n?n.getBoundingClientRect().top+window.pageYOffset:window.innerHeight,behavior:'smooth'});
  });
})();
