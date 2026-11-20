/* ركن التلوين بالأرقام — سَعَة */
(function(){
"use strict";
const NS="http://www.w3.org/2000/svg";
const AR=n=>String(n).replace(/\d/g,d=>"٠١٢٣٤٥٦٧٨٩"[d]);
const store={get(k,d){try{const v=localStorage.getItem(k);return v==null?d:JSON.parse(v);}catch(e){return d;}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v));}catch(e){}}};

const CSS=`.cbn{display:grid;gap:12px;justify-items:center}
.cbn button{font:inherit;cursor:pointer}
.cbn-picks{display:flex;gap:8px;flex-wrap:wrap;justify-content:center}
.cbn-picks button,.cbn-actions button,.cbn-zoom button{border:1.5px solid var(--line,#ece6f4);background:#fff;color:var(--ink,#3a3350);border-radius:999px;padding:6px 16px;font-size:15px}
.cbn-picks button.on{background:var(--lav,#ece6fb);border-color:var(--lav-deep,#6b5bb5);color:var(--lav-deep,#6b5bb5);font-weight:700}
.cbn-st{margin:0;text-align:center;color:var(--muted,#6f6787);min-height:1.8em}
.cbn-stage{width:100%;max-width:460px;overflow:auto;border-radius:18px;border:1.5px solid var(--line,#ece6f4);background:#fff;-webkit-overflow-scrolling:touch}
.cbn-svg{display:block;width:100%;height:auto;touch-action:manipulation}
.cbn-svg path{cursor:pointer;transition:fill .25s}
.cbn-svg text{font-family:inherit;user-select:none}
.cbn-shake{animation:cbnShake .35s}
@keyframes cbnShake{0%,100%{opacity:1}50%{opacity:.35}}
.cbn-glow{animation:cbnGlow 1.4s}
@keyframes cbnGlow{50%{filter:drop-shadow(0 0 10px #ffd95a)}}
.cbn-zoom{display:flex;gap:8px;align-items:center;font-size:13.5px;color:var(--muted,#6f6787)}
.cbn-zoom button{padding:2px 14px;font-size:18px}
.cbn-pal{display:flex;gap:6px;flex-wrap:wrap;justify-content:center;max-width:520px}
.cbn-pal button{border:none;background:none;padding:3px;border-radius:50%}
.cbn-pal span{display:grid;place-items:center;width:36px;height:36px;border-radius:50%;border:1px solid #b9b4c6;font-weight:700;font-size:15px;color:#2C2C2A}
.cbn-pal button.on{outline:3px solid var(--lav-deep,#6b5bb5);outline-offset:1px}
.cbn-bar{display:flex;gap:14px;font-size:14.5px;color:var(--muted,#6f6787)}
.cbn-actions{display:flex;gap:8px;flex-wrap:wrap;justify-content:center}
.cbn-free,.cbn-save{background:var(--lav,#ece6fb)!important;font-weight:600}`;
(function(){const s=document.createElement("style");s.textContent=CSS;document.head.appendChild(s);})();

/* ---------- أدوات رسم الزخارف ---------- */
function pt(r,a){return [r*Math.cos(a),r*Math.sin(a)];}
function sector(r1,r2,a1,a2){const[x1,y1]=pt(r2,a1),[x2,y2]=pt(r2,a2),[x3,y3]=pt(r1,a2),[x4,y4]=pt(r1,a1);const lg=a2-a1>Math.PI?1:0;return `M${x1} ${y1}A${r2} ${r2} 0 ${lg} 1 ${x2} ${y2}L${x3} ${y3}A${r1} ${r1} 0 ${lg} 0 ${x4} ${y4}Z`;}
function petal(r1,r2,a1,a2){const am=(a1+a2)/2;const[x1,y1]=pt(r1,a1),[x2,y2]=pt(r1,a2),[cx,cy]=pt(r2*1.02,am),[tx,ty]=pt(r2,am);return `M${x1} ${y1}Q${cx} ${cy} ${tx} ${ty}Q${cx} ${cy} ${x2} ${y2}A${r1} ${r1} 0 0 0 ${x1} ${y1}Z`;}
function mandala(o){
  const regs=[];
  o.rings.forEach(([r1,r2,n,shape],ri)=>{for(let i=0;i<n;i++){
    const a1=-Math.PI/2+i*2*Math.PI/n,a2=a1+2*Math.PI/n,am=(a1+a2)/2;
    const isP=shape==="p",rm=isP?(r1+(r2-r1)*0.42):(r1+r2)/2;
    regs.push({d:isP?petal(r1,r2,a1,a2):sector(r1,r2,a1,a2),n:o.rule[ri][i%o.rule[ri].length],x:rm*Math.cos(am),y:rm*Math.sin(am)});
  }});
  return {view:"-205 -205 410 410",bg:"#ffffff",regions:regs,
    center:{r:o.rings[0][0],text:o.word,hidden:o.hidden,size:o.wsize||20},fs:o.fs,sw:o.sw};
}

/* ---------- الصور ---------- */
const KIDS_COLS={1:["#bfe3f7","أزرق"],2:["#ffd95a","أصفر"],3:["#9fd67a","أخضر"],4:["#f7a8c4","وردي"],5:["#c8a07a","بني"],6:["#c9b8f0","بنفسجي"]};
function heartPath(cx,cy,s){return `M${cx} ${cy+s*0.9}C${cx-s*1.4} ${cy+s*0.1} ${cx-s*1.1} ${cy-s*0.9} ${cx} ${cy-s*0.35}C${cx+s*1.1} ${cy-s*0.9} ${cx+s*1.4} ${cy+s*0.1} ${cx} ${cy+s*0.9}Z`;}
function flower(cx,cy,r,petalN,centerN){
  const out=[];for(let i=0;i<5;i++){const a=-Math.PI/2+i*2*Math.PI/5,x=cx+r*Math.cos(a),y=cy+r*Math.sin(a);out.push({d:`M${x-r*0.75} ${y}a${r*0.75} ${r*0.75} 0 1 0 ${r*1.5} 0a${r*0.75} ${r*0.75} 0 1 0 ${-r*1.5} 0Z`,n:petalN,x:x+(x-cx)*0.3,y:y+(y-cy)*0.3+4,fs:11});}
  out.push({d:`M${cx-r*0.6} ${cy}a${r*0.6} ${r*0.6} 0 1 0 ${r*1.2} 0a${r*0.6} ${r*0.6} 0 1 0 ${-r*1.2} 0Z`,n:centerN,x:cx,y:cy+4,fs:11});
  return out;
}
const PICS={
 kids:[
  {id:"heart",name:"قلبٌ في الحديقة",cols:KIDS_COLS,build(){return {view:"0 0 320 250",bg:"#ffffff",fs:15,sw:1.6,regions:[
    {d:"M0 0H320V170H0Z",n:1,x:40,y:30},
    {d:"M234 50a28 28 0 1 0 56 0a28 28 0 1 0 -56 0Z",n:2,x:262,y:50},
    {d:"M150 50c0-14 18-20 26-10c6-14 30-12 30 4c14 0 16 20 0 20H160c-12 0-16-14-10-14Z",n:6,x:180,y:52},
    {d:"M0 170C80 150 240 150 320 170V250H0Z",n:3,x:40,y:228},
    {d:"M70 172h14v-50h-14Z",n:5,x:77,y:158},
    {d:"M77 60c-30 0-42 30-28 48c-14 16 6 34 28 26c22 8 42-10 28-26c14-18 2-48-28-48Z",n:3,x:77,y:100},
    {d:heartPath(170,128,52),n:4,x:170,y:140,fs:20},
    ...flower(255,195,17,6,2),...flower(130,208,15,4,2)
  ]};}},
  {id:"rainbow",name:"قوس الرحمن",cols:KIDS_COLS,build(){
    const bands=[[6,140,124],[4,124,108],[2,108,92],[3,92,76],[1,76,60]];
    const regs=[{d:"M0 0H320V250H0Z",n:1,x:30,y:30}];
    bands.forEach(([n,r2,r1])=>{const cx=160,cy=200;regs.push({d:`M${cx-r2} ${cy}A${r2} ${r2} 0 0 1 ${cx+r2} ${cy}H${cx+r1}A${r1} ${r1} 0 0 0 ${cx-r1} ${cy}Z`,n,x:cx,y:cy-(r1+r2)/2+5,fs:13});});
    regs.push({d:"M0 200C90 186 230 186 320 200V250H0Z",n:3,x:160,y:232});
    regs.push({d:"M8 196c-6-22 22-30 30-16c8-18 40-14 38 6c18 0 18 22 0 22H18c-12 0-14-12-10-12Z",n:6,x:44,y:198});
    regs.push({d:"M242 196c-6-22 22-30 30-16c8-18 40-14 38 6c18 0 18 22 0 22H252c-12 0-14-12-10-12Z",n:6,x:278,y:198});
    regs.push({d:"M262 40a20 20 0 1 0 40 0a20 20 0 1 0 -40 0Z",n:2,x:282,y:40});
    regs.push({d:heartPath(160,176,14),n:4,x:160,y:180,fs:11});
    return {view:"0 0 320 250",bg:"#ffffff",fs:15,sw:1.6,regions:regs};}}
 ],
 mid:[
  {id:"rose",name:"زخرفة «تسامح»",cols:{1:["#AFA9EC"],2:["#ED93B1"],3:["#97C459"],4:["#FAC775"],5:["#85B7EB"],6:["#F5C4B3"]},
   build(){return mandala({word:"تسامح",fs:12,sw:1.2,rings:[[38,70,8,"s"],[70,110,8,"p"],[110,150,16,"s"],[150,195,16,"p"]],
     rule:[[1,2],[3,4],[5,6,5,2],[4,1,3,1]]});}},
  {id:"star",name:"نجمة العفو",cols:{1:["#CECBF6"],2:["#7F77DD"],3:["#F4C0D1"],4:["#9FE1CB"],5:["#FAC775"],6:["#B5D4F4"],7:["#F5C4B3"]},
   build(){return mandala({word:"عفو",fs:11,sw:1.1,rings:[[40,72,6,"s"],[72,108,12,"p"],[108,140,12,"s"],[140,168,24,"p"],[168,195,24,"s"]],
     rule:[[1,3],[2],[4,5],[6,3],[7,1,7,5]]});}}
 ],
 old:[
  {id:"rose",name:"زخرفة «تسامح»",cols:{1:["#CECBF6"],2:["#7F77DD"],3:["#F4C0D1"],4:["#D4537E"],5:["#C0DD97"],6:["#639922"],7:["#FAC775"],8:["#BA7517"],9:["#B5D4F4"],10:["#378ADD"]},
   build(){return mandala({word:"تسامح",fs:8,sw:0.8,rings:[[38,62,12,"s"],[62,88,12,"p"],[88,114,24,"s"],[114,140,24,"p"],[140,168,24,"s"],[168,195,48,"p"]],
     rule:[[1,2],[3,4,3],[5,6],[7,8,7],[9,10,9,2],[1,3,5,7,9,3]]});}},
  {id:"hidden",name:"الكلمة المخفية",cols:{1:["#CECBF6"],2:["#7F77DD"],3:["#F4C0D1"],4:["#D4537E"],5:["#9FE1CB"],6:["#1D9E75"],7:["#FAC775"],8:["#BA7517"],9:["#B5D4F4"],10:["#378ADD"]},
   build(){return mandala({word:"والعافين عن الناس",hidden:true,wsize:11,fs:7,sw:0.7,rings:[[56,80,8,"s"],[80,104,16,"p"],[104,126,16,"s"],[126,150,32,"p"],[150,172,32,"s"],[172,195,64,"p"]],
     rule:[[2,1],[3,4,3,4],[5,6],[7,8,7,8],[9,10],[1,3,5,7]]});}}
 ]
};
const FREE=["#ffffff","#fde2e4","#fad2e1","#e2ece9","#bee1e6","#cddafd","#dfe7fd","#fff1c1","#ffd6a5","#caffbf","#9bf6ff","#bdb2ff","#ffc6ff","#f4a261","#e76f51","#2a9d8f","#264653","#6d597a"];

/* ---------- الواجهة ---------- */
function mount(root){
  const level=root.dataset.level, key="saaa_cbn_"+level, pics=PICS[level], timed=level!=="kids";
  let picIdx=0,sel=null,free=false,model,regEls=[],state,t0=0,tick=null;
  root.innerHTML=`
   <div class="cbn-picks" role="group" aria-label="اختاري الصورة">${pics.map((p,i)=>`<button type="button" data-i="${i}">${p.name}</button>`).join("")}</div>
   <p class="cbn-st" aria-live="polite"></p>
   <div class="cbn-stage"><svg class="cbn-svg" role="img" aria-label="صورة للتلوين"></svg></div>
   ${level!=="kids"?`<div class="cbn-zoom"><button type="button" data-z="1" aria-label="تكبير">＋</button><button type="button" data-z="-1" aria-label="تصغير">－</button><span>كبّري الصورة لتلوين الأجزاء الصغيرة</span></div>`:""}
   <div class="cbn-pal" role="group" aria-label="الألوان"></div>
   <div class="cbn-bar"><span class="cbn-prog"></span>${timed?'<span class="cbn-time"></span>':""}</div>
   <div class="cbn-actions">
     <button type="button" class="cbn-free" hidden>🎨 لوّنيها بألوانك</button>
     <button type="button" class="cbn-save" hidden>⬇️ احفظي الصورة</button>
     <button type="button" class="cbn-reset">↺ ابدئي من جديد</button>
   </div>`;
  const $=s=>root.querySelector(s), svg=$(".cbn-svg"), st=$(".cbn-st"), pal=$(".cbn-pal");
  let zoom=1;
  root.querySelectorAll("[data-z]").forEach(b=>b.onclick=()=>{zoom=Math.min(3,Math.max(1,zoom+(+b.dataset.z)*0.5));svg.style.width=(zoom*100)+"%";});

  function saveState(){const all=store.get(key,{});all[pics[picIdx].id]=state;store.set(key,all);}
  function load(i){
    picIdx=i;sel=null;free=false;zoom=1;svg.style.width="100%";
    root.querySelectorAll(".cbn-picks button").forEach((b,j)=>b.classList.toggle("on",j===i));
    const P=pics[i];model=P.build();
    state=store.get(key,{})[P.id]||{fills:{},secs:0,done:false};
    svg.setAttribute("viewBox",model.view);svg.innerHTML="";
    const g=document.createElementNS(NS,"g");g.setAttribute("stroke","#5F5E5A");g.setAttribute("stroke-width",model.sw||1);g.setAttribute("stroke-linejoin","round");
    const tg=document.createElementNS(NS,"g");tg.setAttribute("class","cbn-nums");tg.setAttribute("text-anchor","middle");tg.setAttribute("fill","#5F5E5A");tg.style.pointerEvents="none";
    regEls=model.regions.map((r,k)=>{
      const el=document.createElementNS(NS,"path");el.setAttribute("d",r.d);el.dataset.n=r.n;el.dataset.k=k;
      el.setAttribute("fill",state.fills[k]||"#fff");g.appendChild(el);
      const t=document.createElementNS(NS,"text");t.setAttribute("x",r.x);t.setAttribute("y",r.y+(r.fs?0:(model.fs||12)*0.35));t.setAttribute("font-size",r.fs||model.fs||12);t.textContent=AR(r.n);t.dataset.k=k;
      if(state.fills[k])t.style.display="none";tg.appendChild(t);
      el.addEventListener("click",()=>hit(el,k));return el;});
    svg.appendChild(g);svg.appendChild(tg);
    if(model.center){const c=model.center;
      const cc=document.createElementNS(NS,"circle");cc.setAttribute("r",c.r);cc.setAttribute("fill","#fff");cc.setAttribute("stroke","#5F5E5A");cc.setAttribute("stroke-width",model.sw||1);svg.appendChild(cc);
      const w=document.createElementNS(NS,"text");w.setAttribute("class","cbn-word");w.setAttribute("text-anchor","middle");w.setAttribute("y",c.size*0.35);w.setAttribute("font-size",c.size);w.setAttribute("fill","#3C3489");w.setAttribute("font-weight","700");
      w.textContent=(c.hidden&&!state.done)?"؟":c.text;svg.appendChild(w);}
    renderPal();prog(false);
    st.textContent=state.done?"اكتملت الصورة 🌸 تسامحي مع نفسك وأطلقي العنان لإبداعك بألوانك":(level==="kids"?"اختاري لونًا، ثم اضغطي على الأشكال التي تحمل رقمه":"اختاري لونًا، ثم اضغطي على الأجزاء التي تحمل رقمه");
    stopTimer();
  }
  function renderPal(){
    const cols=free?FREE.map(c=>[c,c]):Object.entries(pics[picIdx].cols).map(([n,c])=>[n,c[0],c[1]]);
    pal.innerHTML=cols.map(([n,c,label])=>`<button type="button" data-n="${n}" aria-label="${free?"لون":("رقم "+AR(n)+(label?" "+label:""))}"><span style="background:${c}">${free?"":AR(n)}</span></button>`).join("");
    pal.querySelectorAll("button").forEach(b=>b.onclick=()=>{sel=b.dataset.n;pal.querySelectorAll("button").forEach(x=>x.classList.toggle("on",x===b));
      if(!free)st.textContent=`اضغطي على الأجزاء رقم ${AR(sel)}`;});
  }
  function hit(el,k){
    if(!sel){st.textContent="اختاري لونًا أولًا 🎨";return;}
    if(free){el.setAttribute("fill",sel);state.fills[k]=sel;saveState();return;}
    if(state.fills[k])return;
    if(el.dataset.n!==sel){st.textContent=`هذا الجزء رقمه ${AR(el.dataset.n)}`;el.classList.remove("cbn-shake");void el.getBBox();el.classList.add("cbn-shake");return;}
    startTimer();
    const c=pics[picIdx].cols[sel][0];el.setAttribute("fill",c);state.fills[k]=c;
    const t=svg.querySelector(`.cbn-nums text[data-k="${k}"]`);if(t)t.style.display="none";
    saveState();prog(true);
  }
  function startTimer(){if(!timed||tick||state.done)return;t0=Date.now()-state.secs*1000;tick=setInterval(()=>{state.secs=Math.round((Date.now()-t0)/1000);showTime();},1000);}
  function stopTimer(){clearInterval(tick);tick=null;showTime();}
  function fmt(s){return AR(Math.floor(s/60))+":"+AR(String(s%60).padStart(2,"0"));}
  function showTime(){const el=$(".cbn-time");if(!el)return;const best=store.get(key+"_best",{})[pics[picIdx].id];el.textContent="⏱ "+fmt(state.secs||0)+(best?` · أفضل وقت ${fmt(best)}`:"");}
  function prog(fresh){
    const d=Object.keys(state.fills).length, n=regEls.length;
    $(".cbn-prog").textContent=`لوّنتِ ${AR(Math.min(d,n))} من ${AR(n)}`;
    const done=state.done||d>=n;
    $(".cbn-free").hidden=!done;$(".cbn-save").hidden=!done;
    if(done&&fresh&&!state.done){
      state.done=true;stopTimer();saveState();
      if(timed){const b=store.get(key+"_best",{}),id=pics[picIdx].id;if(!b[id]||state.secs<b[id]){b[id]=state.secs;store.set(key+"_best",b);}showTime();}
      const w=svg.querySelector(".cbn-word");if(w&&model.center)w.textContent=model.center.text;
      st.textContent=model.center&&model.center.hidden?`ظهرت الكلمة: «${model.center.text}» 🌸`:"أحسنتِ! اكتملت الصورة 🌸";
      svg.classList.add("cbn-glow");setTimeout(()=>svg.classList.remove("cbn-glow"),1400);
      try{window.cbnDone&&window.cbnDone(pics[picIdx].name,state.secs||0);}catch(e){}
    }
  }
  $(".cbn-free").onclick=()=>{free=!free;sel=null;$(".cbn-free").textContent=free?"🔢 العودة للأرقام":"🎨 لوّنيها بألوانك";
    svg.querySelector(".cbn-nums").style.display="none";renderPal();
    st.textContent=free?"تسامحي مع نفسك وأطلقي العنان لإبداعك 🎨 اختاري أي لون واضغطي على أي جزء":"الصورة مكتملة 🌸";};
  $(".cbn-reset").onclick=()=>{state={fills:{},secs:0,done:false};saveState();load(picIdx);};
  $(".cbn-save").onclick=savePng;
  root.querySelectorAll(".cbn-picks button").forEach(b=>b.onclick=()=>{stopTimer();load(+b.dataset.i);});

  function savePng(){
    const clone=svg.cloneNode(true);clone.setAttribute("xmlns",NS);
    const nums=clone.querySelector(".cbn-nums");if(nums)nums.remove();
    clone.querySelectorAll("text").forEach(t=>t.setAttribute("font-family","Tahoma, Arial, sans-serif"));
    const vb=model.view.split(" ").map(Number),W=1200,H=Math.round(W*vb[3]/vb[2]);
    clone.setAttribute("width",W);clone.setAttribute("height",H);clone.removeAttribute("style");
    const url=URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(clone)],{type:"image/svg+xml"}));
    const img=new Image();img.onload=()=>{const cv=document.createElement("canvas");cv.width=W;cv.height=H+80;const x=cv.getContext("2d");
      x.fillStyle="#fff";x.fillRect(0,0,W,H+80);x.drawImage(img,0,0,W,H);
      x.fillStyle="#6f6787";x.font="32px Tahoma, Arial";x.textAlign="center";x.direction="rtl";x.fillText("سَعَة · مساحةٌ لقلوبٍ تتّسع للعفو والتسامح",W/2,H+52);
      URL.revokeObjectURL(url);
      cv.toBlob(b=>{const a=document.createElement("a");a.href=URL.createObjectURL(b);a.download="سعة-تلوين.png";document.body.appendChild(a);a.click();a.remove();},"image/png");};
    img.src=url;
  }
  load(0);
}
document.querySelectorAll(".cbn[data-level]").forEach(mount);
})();
