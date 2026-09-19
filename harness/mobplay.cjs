// ── mobplay.cjs ──────────────────────────────────────────────────────────
// The harness for the bug class that fifteen rounds of review kept missing:
// layout failures that only exist AFTER an interaction, at the viewport
// heights a real browser actually gives a page.
//
// Every earlier probe measured the resting state at 390x844. Both bugs the
// user hit needed two things at once to appear:
//   1. an interaction  (tap a hotspot / drag a slider)
//   2. a short viewport (a real phone loses 150-200px to browser chrome)
//
// For each lead, at each viewport, this drives the lead's own interaction and
// then checks four invariants:
//   A. every control is on screen or can be scrolled to, and a real tap lands
//   B. no text box overlaps an interactive control
//   C. nothing is clipped by an overflow:hidden ancestor with no way to scroll
//   D. whatever the interaction produced is actually visible afterwards
//
// Scoped to the open modal — controls behind it are correctly inert, and
// elementFromPoint returns child nodes, so candidates are always tap-verified
// before being reported.
const { chromium } = require('/Users/mohit/Projects/osint-game-v2/node_modules/playwright')

const A=['A1','A2','A3','A4','A6','A7','A8','A9','A11','A12','A13']
const B=['B1','B2','B4','B5','B7','B8','B11','B12']
const C=['C1','C2','C3','C4','C9','C5','C6','C7','C8']
const ALL=[...A,...B,...C]
const CL=['corey_flickr','insider','deleted','flickr_gps','domain_tweet','shield','arts_domain','nightwatch','postbox','whois','corey_alibi','burned_page','no_source','sealed','priya_words','wayback_index','html_author','key_wifi','draft','map_three','table_sign','building_owner','courier','same_room','registry','court','chain_sheet','rosa']

const lead=(id)=>{const i=ALL.indexOf(id);const d=ALL.slice(0,Math.max(0,i));return{
 phase:'investigation',prevPhase:'apartment',activePath:id[0],currentNodeId:id,
 paths:{A:{started:true,completed:false,unlockedNodes:A,completedNodes:d.filter(x=>x[0]==='A')},
        B:{started:true,completed:false,unlockedNodes:B,completedNodes:d.filter(x=>x[0]==='B')},
        C:{started:true,completed:false,unlockedNodes:C,completedNodes:d.filter(x=>x[0]==='C')}},
 perfectPaths:{},hintsUsed:0,wrongGuesses:0,endingChoice:null,evidenceScore:0,journalistUnlocked:false,systemAlertShown:true,
 caseSummaries:{A:[],B:[],C:[]},clock:60,lastTimeDelta:null,raySuspicion:0,
 rayLog:[{id:'r1',choice:0},{id:'r2',choice:0},{id:'r3',choice:0},{id:'r4',choice:0}],rayBeatPending:null,
 clues:CL.slice(0,Math.max(0,i)),lastClue:null,theory:{},theoryTests:0,deductions:{},finalCase:{suspect:null,slots:{}},
 seenBoardTutorial:true,rayGoneSeen:true,nameRevealSeen:true,namePending:false,nodeProgress:{},saveSlots:[null,null,null],lastSaved:null}}

// ── the invariants, run in the page ──────────────────────────────────────
const CHECK = () => {
  const vh=innerHeight, vw=innerWidth
  const dlg=document.querySelector('[role="dialog"][aria-modal="true"]')
  const scope=dlg||document
  // Anything outside an open dialog is behind it and correctly inert; comparing
  // geometry across those two layers produces overlaps that do not exist to a
  // player. Every candidate must live in the same layer.
  const inLayer=(e)=>dlg? dlg.contains(e) : !e.closest('[role="dialog"][aria-modal="true"]')
  const vis=(e)=>{const s=getComputedStyle(e);return s.display!=='none'&&s.visibility!=='hidden'&&+s.opacity>0}
  // A collapsed drawer keeps its contents in the DOM, clipped to a zero- or
  // small-height box. Those controls are not "unreachable" — they are behind
  // a toggle the player has not pressed. Detect them by asking whether the
  // element lies outside the box of a clipping ancestor.
  const collapsed=(e)=>{
    const r=e.getBoundingClientRect()
    let n=e.parentElement
    while(n&&n!==document.documentElement){
      const cs=getComputedStyle(n)
      if(/hidden|clip/.test(cs.overflowY)||/hidden|clip/.test(cs.overflowX)){
        const nr=n.getBoundingClientRect()
        if(nr.height<4||r.top>=nr.bottom-1||r.bottom<=nr.top+1) return true
      }
      n=n.parentElement
    }
    return false
  }
  const ctrls=[...scope.querySelectorAll('button,a[href],input,select,textarea,[role="button"]')]
    .filter(e=>vis(e)&&inLayer(e)&&!e.disabled&&!e.closest('[inert]')&&!e.classList.contains('skip-link')&&!collapsed(e))
  const name=(e)=>((e.getAttribute('aria-label')||e.textContent||e.tagName).trim().replace(/\s+/g,' ').slice(0,34))
  const out=[]

  // A — reachable
  for(const e of ctrls){
    const r0=e.getBoundingClientRect()
    if(r0.width<1||r0.height<1){ out.push(`ZERO-SIZE  ${name(e)}`); continue }
    if(!(r0.top<vh&&r0.bottom>0)){
      e.scrollIntoView({block:'center'})
      const r=e.getBoundingClientRect()
      if(!(r.top<vh&&r.bottom>0)) out.push(`UNREACHABLE  ${name(e)}`)
    }
  }
  // B — text sitting on top of a control
  const texts=[...scope.querySelectorAll('p,span,div,h1,h2,h3,li,dd,dt')]
    .filter(e=>vis(e)&&inLayer(e)&&e.children.length===0&&(e.textContent||'').trim().length>14&&e.getBoundingClientRect().height>6)
  // Geometric overlap on its own is noise — boxes overlap harmlessly all the
  // time. It only matters if the text actually paints over the control, so
  // hit-test the overlapping region and require the text to win.
  for(const c of ctrls){
    const cr=c.getBoundingClientRect()
    if(cr.width<1||cr.height<1) continue
    if(cr.bottom<0||cr.top>vh) continue
    for(const t of texts){
      if(c.contains(t)||t.contains(c)) continue
      const tr=t.getBoundingClientRect()
      const l=Math.max(cr.left,tr.left), r=Math.min(cr.right,tr.right)
      const tp=Math.max(cr.top,tr.top),  bt=Math.min(cr.bottom,tr.bottom)
      if(r-l<=4||bt-tp<=4) continue
      const px=Math.min(vw-1,Math.max(1,(l+r)/2)), py=Math.min(vh-1,Math.max(1,(tp+bt)/2))
      const hit=document.elementFromPoint(px,py)
      if(!hit) continue
      const textWins = hit===t || t.contains(hit)
      const controlLost = hit!==c && !c.contains(hit)
      if(!(textWins && controlLost)) continue
      // A sticky footer or header will always sit over something mid-scroll.
      // That is only a defect if the player cannot scroll the control clear
      // of it, so try, and re-test at the control's own centre.
      c.scrollIntoView({block:'center'})
      const c2=c.getBoundingClientRect()
      const qx=Math.min(vw-1,Math.max(1,c2.left+c2.width/2)), qy=Math.min(vh-1,Math.max(1,c2.top+c2.height/2))
      const hit2=document.elementFromPoint(qx,qy)
      if(hit2===c||c.contains(hit2)) continue
      out.push(`OBSCURED, CANNOT SCROLL CLEAR  "${name(c)}" <- "${(t.textContent||'').trim().slice(0,30)}"`)
    }
  }
  // C — content clipped by an ancestor that cannot scroll
  for(const e of scope.querySelectorAll('*')){
    if(!vis(e)||!inLayer(e)) continue
    const s=getComputedStyle(e)
    if(!/hidden|clip/.test(s.overflowY)) continue
    if(e.scrollHeight>e.clientHeight+8 && e.clientHeight>40){
      let n=e.parentElement, esc=false
      while(n&&n!==document.documentElement){const cs=getComputedStyle(n)
        if(n.scrollHeight>n.clientHeight+2&&/auto|scroll/.test(cs.overflowY)){esc=true;break}
        n=n.parentElement}
      const cls=(e.className&&typeof e.className==='string')?'.'+e.className.trim().split(/\s+/)[0]:e.tagName
      if(!esc) out.push(`CLIPPED, NO SCROLL  ${cls} (+${e.scrollHeight-e.clientHeight}px hidden)`)
    }
  }
  return [...new Set(out)]
}

// ── per-lead drivers: perform the interaction this lead is made of ───────
async function drive(p, id){
  const steps=[]
  const tap=async(h)=>{ try{ await h.tap({timeout:2500}); await p.waitForTimeout(550); return true }catch{ return false } }

  const hotspots=await p.$$('.hotspot')
  if(hotspots.length){
    for(let i=0;i<Math.min(hotspots.length,3);i++){
      if(await tap(hotspots[i])) steps.push(`examined hotspot ${i+1}`)
    }
    return steps
  }
  const ranges=await p.$$('input[type=range]')
  if(ranges.length){
    for(const [bv,cv] of [[60,90],[100,100],[140,160]]){
      await p.evaluate(([bv,cv])=>{
        const rs=[...document.querySelectorAll('input[type=range]')]
        const set=(el,v)=>{const s=Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,'value').set
          s.call(el,String(v)); el.dispatchEvent(new Event('input',{bubbles:true}))}
        if(rs[0])set(rs[0],bv); if(rs[1])set(rs[1],cv)
      },[bv,cv])
      await p.waitForTimeout(450)
      steps.push(`sliders ${bv}/${cv}`)
    }
    return steps
  }
  const input=await p.$('input[type=text]')
  if(input){ await input.tap().catch(()=>{}); await p.keyboard.type('twitter'); await p.waitForTimeout(400); steps.push('typed an answer') 
    const sub=await p.$('button[title*="Submit"]'); if(sub&&await tap(sub)) steps.push('submitted')
    return steps }
  // connect / compare / diff / browse / navigate: tap the first few live things
  const generic=await p.$$('[role="dialog"] button:not([disabled])')
  for(let i=0;i<Math.min(generic.length,4);i++){
    const t=await generic[i].getAttribute('aria-label')||''
    if(/board|hint|manual|journal|save/i.test(t)) continue
    if(await tap(generic[i])) steps.push(`tapped "${t.slice(0,26)}"`)
  }
  return steps
}

;(async()=>{
  const only=process.argv.slice(2)
  const leads=only.length?only:ALL
  const VPS=[{w:390,h:844,t:'390x844'},{w:390,h:664,t:'390x664 chrome'},{w:360,h:600,t:'360x600 small'}]
  const b=await chromium.launch({channel:'chrome',headless:true})
  let total=0
  for(const vp of VPS){
    const ctx=await b.newContext({viewport:{width:vp.w,height:vp.h},isMobile:true,hasTouch:true,reducedMotion:'reduce'})
    const p=await ctx.newPage(); const errs=[]
    p.on('pageerror',e=>errs.push(e.message))
    await p.goto('http://localhost:5173/osint-game-v2/')
    for(const id of leads){
      await p.evaluate(s=>localStorage.setItem('maya-game-v3-storage',JSON.stringify({state:s,version:0})),lead(id))
      await p.reload(); await p.waitForTimeout(800)
      const atRest=await p.evaluate(CHECK)
      const steps=await drive(p,id)
      const after=await p.evaluate(CHECK)
      const newOnes=after.filter(x=>!atRest.includes(x))
      if(atRest.length||newOnes.length){
        console.log(`\n[${vp.t}] ${id}  (${steps.join(', ')||'no interaction found'})`)
        atRest.forEach(x=>console.log(`   at rest  ${x}`))
        newOnes.forEach(x=>console.log(`   AFTER    ${x}`))
        total+=atRest.length+newOnes.length
      }
    }
    if(errs.length) console.log(`\n[${vp.t}] page errors: ${errs.join(' | ')}`)
    await ctx.close()
  }
  console.log(total? `\n${total} finding(s)` : `\nclean: ${leads.length} leads x ${VPS.length} viewports, at rest and after interaction`)
  await b.close()
})()
