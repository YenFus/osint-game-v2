// ─────────────────────────────────────────────────────────────────
// CASE BOARD — the investigation hub
//
// A lamp-lit corkboard. Each thread is a branching column of pinned
// leads (rows = how deep in the trail) above three deduction slots.
// Finished leads drop clues into the drawer. The player pencils a
// clue into each slot, then tests the whole theory: the board only
// says how many pins hold, and every failed test costs Maya time.
// Two closed threads — and Maya's unsent draft — open THE SUSPECT.
// Meanwhile Ray is leaving town, and the more nervous he gets, the
// sooner he goes.
// ─────────────────────────────────────────────────────────────────

import { useState, useEffect, useLayoutEffect, useRef, useMemo, useCallback } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { useGameStore } from '../../store/gameStore'
import { GAME_DATA } from '../../data/gameData'
import { LEAD_META, withMeta } from '../../data/leadMeta'
import {
  CLUES, DEDUCTIONS, FINAL_SLOTS, suspectsFor, THREAD_INFO as THREADS, WRONG_THEORY_COST,
  clockLabel, missingLabel, durationLabel, effectiveSuspicion, rayMood, rayDeadline, pinComplete, HINT_COST,
  NAME_CLUES,
} from '../../data/caseData'
import { PolaroidArt } from './PolaroidArt'
import { GalleryPlate } from './ScenePlate'
import { useAudio } from '../../hooks/useAudio'
import { useModalFocus } from '../../hooks/useModalFocus'
import '../../styles/board.css'

const THREAD_KEYS = ['A', 'B', 'C']

function tilt(id, range = 5) {
  let h = 0
  for (const c of id) h = (h * 31 + c.charCodeAt(0)) | 0
  return (((Math.abs(h) % 1000) / 1000) * 2 - 1) * range
}

// How deep each lead sits in its thread's unlock graph (static)
const DEPTHS = Object.fromEntries(THREAD_KEYS.map(k => {
  const nodes = GAME_DATA[k].nodes
  const depth = { [nodes[0].id]: 0 }
  const queue = [nodes[0].id]
  while (queue.length) {
    const id = queue.shift()
    const n = nodes.find(x => x.id === id)
    for (const u of n?.unlocks ?? []) {
      if (depth[u] === undefined) { depth[u] = depth[id] + 1; queue.push(u) }
    }
  }
  return [k, depth]
}))

// ── Header HUD ────────────────────────────────────────────────────
// The +N min float is keyed by the delta's timestamp: each new delta
// remounts it and its CSS animation plays once, then rests invisible.
function ClockHUD({ clock, lastTimeDelta }) {
  const [mountedAt] = useState(() => Date.now())
  const float = lastTimeDelta && lastTimeDelta.at >= mountedAt ? lastTimeDelta : null
  const penalty = float && float.reason !== 'lead'
  const label = { hint: ' · hint', wrong: ' · wrong', theory: ' · theory failed' }[float?.reason] ?? ''
  return (
    <div className="hud-clock" aria-live="polite">
      <div key={`t-${float?.at ?? 0}`} className={`t ${penalty ? 'tick' : ''}`}>{clockLabel(clock)}</div>
      <div className="m">Maya missing {missingLabel(clock)}</div>
      {float && (
        <span key={`f-${float.at}`} className={`hud-float ${penalty ? '' : 'lead'}`} style={{ top: 38 }}>
          +{float.amount} min{label}
        </span>
      )}
    </div>
  )
}

// Until a record puts a surname to the handle, this chip is a deadline and
// nothing more. Naming the man in the HUD from minute one gave the case away
// before the player had worked anything out.
function RayChip({ suspicion, active, minutesLeft, gone, named }) {
  if (!active) return null
  const mood = rayMood(suspicion)
  const alarm = minutesLeft < 90 || (named && suspicion >= 50)
  return (
    <div className={`ray-chip ${alarm ? 'alarm' : ''}`}
      title={named
        ? "Ray says he's leaving for Seattle. The more nervous he gets, the sooner he goes."
        : 'Whoever he is, he is watching this case too. He will not sit still all night.'}>
      <span className="dot" style={{ background: named ? mood.color : '#b0a070', color: named ? mood.color : '#b0a070' }} />
      <span>
        {/* once he's gone his mood is not news */}
        {named ? (gone ? 'Ray' : `Ray · ${mood.label}`) : 'Tonight'}
        <span className="dl">
          {gone
            ? (named ? 'has left town' : 'he has moved')
            : `${named ? 'leaves' : 'runs out'} in ${durationLabel(minutesLeft)}`}
        </span>
      </span>
    </div>
  )
}

// ── Lead cards ────────────────────────────────────────────────────
function LeadCard({ node, done, zooming, onOpen }) {
  const card = node.card ?? { kind: 'index', scene: 'document' }
  const kindClass = card.kind === 'polaroid' ? 'lead-polaroid'
    : card.kind === 'photo' ? 'lead-photo-kind'
      : card.kind === 'note' ? 'lead-note' : 'lead-index'
  return (
    <button
      className={`lead-card ${kindClass} ${done ? 'done' : ''} ${zooming ? 'zooming' : ''}`}
      style={{ '--tilt': `${tilt(node.id)}deg` }}
      data-yarn={`lead-${node.id}`}
      onClick={onOpen}
      aria-label={`${done ? 'Review' : 'Open'} lead: ${node.title}`}
    >
      <span className={`pin ${done ? 'gold' : ''}`} />
      {(card.kind === 'polaroid' || card.kind === 'photo') && (
        <div className="lead-img">
          {card.kind === 'photo'
            ? <div className="cb-crowd"><GalleryPlate /></div>
            : <PolaroidArt scene={card.scene} />}
        </div>
      )}
      <div className="lead-title">{node.title}</div>
      {card.kind !== 'note' && <div className="lead-tool">{node.tool}</div>}
      {!done && <span className="lead-new">NEW</span>}
      {done && <span className="stamp">✓</span>}
    </button>
  )
}

// A lead that needs something from another thread first says so on its face,
// rather than being a card that refuses to open.
function LockedCard({ node }) {
  return (
    <div className="lead-locked" style={{ '--tilt': `${tilt(node.id)}deg` }} data-yarn={`lead-${node.id}`}>
      <span className="pin" style={{ filter: 'grayscale(1) brightness(0.6)' }} />
      <div className="q">?</div>
      <div className="type" style={{ fontSize: 12, color: '#c8b898', marginBottom: 4 }}>{node.title}</div>
      <div className="hand">{node.requiresCompleted.hint}</div>
    </div>
  )
}

// ── One question on the board ─────────────────────────────────────
// A slot holds a pencilled clue until the thread's theory is tested. Paired
// questions need two clues that only mean something together.
function DedSlot({ ded, confirmed, pencilled, armed, onPin, hintShown, onHint }) {
  const [over, setOver] = useState(false)
  const solved = !!confirmed
  const pins = (() => {
    const v = confirmed ?? pencilled
    return v ? (Array.isArray(v) ? v : [v]) : []
  })()
  const isPair = !!ded.pairAnswer
  const full = solved || (isPair ? pins.length === 2 : pins.length === 1)
  return (
    <div
      className={`ded-slot ${solved ? 'solved' : pins.length ? 'pencilled' : ''} ${armed && !full ? 'armed' : ''} ${over ? 'over' : ''}`}
      data-yarn={`ded-${ded.id}`}
      role={solved ? undefined : 'button'}
      tabIndex={solved ? undefined : 0}
      aria-label={solved
        ? `${ded.question} — confirmed`
        : `${ded.question}. ${pins.length ? `Pencilled: ${pins.map(p => CLUES[p]?.title).join(' and ')}.` : 'Empty.'}${isPair ? ' Needs two clues.' : ''}`}
      onClick={() => !solved && onPin(ded)}
      onKeyDown={(e) => { if (!solved && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); onPin(ded) } }}
      onDragOver={(e) => { if (!solved) { e.preventDefault(); setOver(true) } }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        e.preventDefault(); setOver(false)
        const id = e.dataTransfer.getData('text/plain')
        if (id && !solved) onPin(ded, id)
      }}
    >
      {pins.length > 0 && <span className={`pin ${solved ? '' : 'gold'}`} />}
      {!solved && (
        <div className="ded-q hand">
          {ded.question}
          {isPair && <span className="pair-badge">needs 2</span>}
        </div>
      )}
      {pins.map(id => (
        <div key={id} className="ded-clue">
          <span className="clip" aria-hidden="true" /> {CLUES[id]?.title}
          {!solved && (
            <button className="unpin" aria-label={`Unpin ${CLUES[id]?.title}`}
              onClick={(e) => { e.stopPropagation(); onPin(ded, id) }}>×</button>
          )}
        </div>
      ))}
      {solved && <div className="ded-reveal hand" title={ded.question}>{ded.reveal}</div>}
      {!solved && (
        <>
          <div className="ded-empty">
            {full ? 'Pencilled in'
              : armed ? (isPair && pins.length === 1 ? '▸ Pin the second clue' : '▸ Pin the selected clue here')
                : (isPair ? 'Two clues that only mean something together' : 'Needs a clue')}
          </div>
          {isPair && ded.hintLine && (hintShown
            ? <div className="ded-empty hint">{ded.hintLine}</div>
            : (
              <button className="ded-hint" onClick={(e) => { e.stopPropagation(); onHint(ded) }}>
                What goes here? · +{HINT_COST} min
              </button>
            ))}
        </>
      )}
    </div>
  )
}

// ── A thread ──────────────────────────────────────────────────────
// Leads are laid out in rows by how deep they sit in the trail, so the board
// reads as a branching trail rather than a list. A closed thread folds itself
// away: what it proved stays on the board, the leads tuck out of sight.
function ThreadColumn({ pathKey, paths, deductions, theory, selectedClue, shaking, focused, zoomingId, hintedDeds, onOpenLead, onPin, onTest, onDedHint }) {
  const nodes = GAME_DATA[pathKey].nodes.map(withMeta)
  const st = paths[pathKey]
  const unlocked = st.unlockedNodes.map(id => nodes.find(n => n.id === id)).filter(Boolean)
  const hidden = nodes.length - unlocked.length
  const deds = DEDUCTIONS[pathKey]
  const pinnedCount = deds.filter(d => pinComplete(d, theory[d.id])).length
  const rows = []
  unlocked.forEach(node => {
    const depth = DEPTHS[pathKey][node.id] ?? 0
    ;(rows[depth] ??= []).push(node)
  })
  const [manualOpen, setManualOpen] = useState(null)
  const folded = st.completed && (manualOpen ?? false) === false

  return (
    <section id={`thread-${pathKey}`} className={`cb-thread ${focused ? 'focus' : ''} ${shaking ? 'shake' : ''} ${folded ? 'folded' : ''}`} aria-label={THREADS[pathKey].title}>
      <header className="thread-head" data-yarn={`thread-${pathKey}`}>
        <span className="pin" />
        <div className="hand">{THREADS[pathKey].title}</div>
        <div className="type">{THREADS[pathKey].sub}</div>
        <div className="thread-count">{st.completedNodes.length}/{nodes.length} leads examined</div>
        {!st.completed && (
          <button className="jump-theory"
            onClick={() => document.getElementById(`theory-${pathKey}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })}>
            ↓ theory ({DEDUCTIONS[pathKey].filter(d => pinComplete(d, theory[d.id])).length}/3)
          </button>
        )}
        {st.completed && <span className="stamp stamp-closed">CLOSED</span>}
        {st.completed && (
          <button className="thread-fold" aria-expanded={!folded}
            onClick={() => setManualOpen(folded)}>
            {folded ? `▸ show ${st.completedNodes.length} leads` : '▾ hide leads'}
          </button>
        )}
      </header>

      {!folded && (
        <div className="thread-leads">
          {rows.filter(Boolean).map((row, i) => (
            <div key={i} className="lead-row">
              {row.map(node => {
                const req = node.requiresCompleted
                return req && !paths[req.path]?.completedNodes?.includes(req.nodeId)
                  ? <LockedCard key={node.id} node={node} />
                  : (
                    <LeadCard key={node.id} node={node}
                      done={st.completedNodes.includes(node.id)}
                      zooming={zoomingId === node.id}
                      onOpen={() => onOpenLead(pathKey, node.id)} />
                  )
              })}
            </div>
          ))}
          {hidden > 0 && <div className="lead-ghost">+{hidden} more to uncover…</div>}
        </div>
      )}

      <div className="thread-deds" id={`theory-${pathKey}`}>
        <div className="ded-title hand">{st.completed ? 'What this thread proves' : 'Your theory'}</div>
        {deds.map(ded => (
          <DedSlot key={ded.id} ded={ded}
            confirmed={deductions[ded.id]}
            pencilled={theory[ded.id]}
            armed={!!selectedClue}
            onPin={(d, clueId) => onPin(d, clueId)}
            hintShown={hintedDeds.includes(ded.id)}
            onHint={(d) => onDedHint(pathKey, d)} />
        ))}
        {!st.completed && (
          <button className="test-btn" disabled={pinnedCount < deds.length} onClick={() => onTest(pathKey)}>
            {pinnedCount < deds.length ? `Pin all three to test (${pinnedCount}/3)` : `Test this theory · wrong costs ${WRONG_THEORY_COST} min`}
          </button>
        )}
      </div>
    </section>
  )
}

// The ring Thomas draws round a face when he has decided.
function CircleMark() {
  return (
    <svg className="circle" viewBox="0 0 180 200" preserveAspectRatio="none" aria-hidden="true">
      <path d="M92 8 C150 6 176 60 172 110 C168 168 120 196 80 192 C30 188 6 140 8 96 C10 44 50 12 102 14" />
    </svg>
  )
}

// ── The call you are about to make ────────────────────────────────
function SuspectSection({ closedCount, hasDraft, finalCase, selectedClue, onSuspect, onSlot, onPresent, clues }) {
  if (closedCount < 2 || !hasDraft) {
    return (
      <section className="cb-suspect locked" data-yarn="suspect">
        <h3>THE SUSPECT</h3>
        <div className="hand" style={{ fontSize: 24, color: '#e8d6b0' }}>Who took Maya?</div>
        <p className="type" style={{ fontSize: 12, color: '#b8a888', marginTop: 8 }}>
          {closedCount < 2
            ? `Close two threads to open this part of the board. (${closedCount}/2)`
            : 'The threads point somewhere. But Maya knew first — she would have tried to tell you. Find what she wrote.'}
        </p>
      </section>
    )
  }
  const filled = FINAL_SLOTS.filter(s => finalCase.slots[s.id]).length
  const ready = finalCase.suspect && filled > 0
  return (
    <section className="cb-suspect fade-in" data-yarn="suspect">
      <span className="pin" />
      <h3>THE SUSPECT</h3>
      <div className="hand" style={{ fontSize: 24, color: '#f4e6c8', textAlign: 'center' }}>
        Circle who took her. Then pick what you'll hand the police — one clue per question.
      </div>
      <div className="suspect-row">
        {suspectsFor(clues).map(s => (
          <button
            key={s.id}
            className="suspect-card"
            style={{ '--tilt': `${tilt(s.id, 4)}deg` }}
            onClick={() => onSuspect(s.id)}
            aria-pressed={finalCase.suspect === s.id}
          >
            <div className="lead-img"><PolaroidArt scene={s.scene} /></div>
            <div className="nm">{s.name}</div>
            <div className="tg">{s.tag}</div>
            {finalCase.suspect === s.id && <CircleMark />}
          </button>
        ))}
      </div>
      <div className="final-slots">
        {FINAL_SLOTS.map(slot => {
          const clueId = finalCase.slots[slot.id]
          return (
            <button key={slot.id}
              className={`final-slot ${clueId ? 'filled' : ''} ${!clueId && selectedClue ? 'armed' : ''}`}
              onClick={() => onSlot(slot.id, clueId)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault()
                const id = e.dataTransfer.getData('text/plain')
                if (id) onSlot(slot.id, null, id)
              }}
            >
              {clueId && <span className="pin" />}
              <div className="lbl">{slot.label}</div>
              <div className="qq">{slot.question}</div>
              {clueId
                ? <><div className="val"><span className="clip" aria-hidden="true" /> {CLUES[clueId].title}</div><div className="rm">click to unpin</div></>
                : <div className="ded-empty">{selectedClue ? '▸ Pin selected clue' : 'Empty'}</div>}
            </button>
          )
        })}
      </div>
      <p className="type" style={{ textAlign: 'center', fontSize: 12, color: '#c8b898', marginTop: 14 }}>
        Nothing here tells you if you're right. You can keep investigating — but the night is going.
      </p>
      <button className="present-btn" disabled={!ready} onClick={onPresent}>
        {ready ? 'Make the call →' : finalCase.suspect ? 'Pin at least one clue' : 'Circle a suspect'}
      </button>
    </section>
  )
}

// ── The string between the pins ───────────────────────────────────
// Measured from the DOM after layout, so the yarn follows the cards wherever
// they end up — and re-measures when the board resizes or the fonts land.
function YarnLayer({ edges }) {
  const svgRef = useRef(null)
  const [lines, setLines] = useState([])
  const seen = useRef(new Set())

  useLayoutEffect(() => {
    const host = svgRef.current?.parentElement
    if (!host) return undefined
    let frame = 0
    const measure = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const box = host.getBoundingClientRect()
        const anchor = (key) => {
          const el = host.querySelector(`[data-yarn="${key}"]`)
          if (!el) return null
          const r = el.getBoundingClientRect()
          return { x: r.left - box.left + r.width / 2, y: r.top - box.top + 2 }
        }
        const first = seen.current.size === 0
        const next = edges.map(([from, to, kind]) => {
          const p = anchor(from), q = anchor(to)
          const key = `${from}>${to}`
          return p && q ? { key, kind, p, q, fresh: !first && !seen.current.has(key) } : null
        }).filter(Boolean)
        next.forEach(l => seen.current.add(l.key))
        setLines(next)
      })
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(host)
    window.addEventListener('resize', measure)
    const onLoad = () => measure()
    window.addEventListener('load', onLoad)
    document.fonts?.ready?.then(measure).catch(() => {})
    return () => {
      cancelAnimationFrame(frame)
      ro.disconnect()
      window.removeEventListener('resize', measure)
      window.removeEventListener('load', onLoad)
    }
  }, [edges])

  return (
    <svg ref={svgRef} className="cb-yarn" aria-hidden="true">
      {lines.map(l => {
        const dist = Math.hypot(l.q.x - l.p.x, l.q.y - l.p.y)
        const mx = (l.p.x + l.q.x) / 2
        const my = (l.p.y + l.q.y) / 2 + Math.min(46, dist * 0.14)
        return (
          <path key={l.key} className={`yarn yarn-${l.kind} ${l.fresh ? 'fresh' : ''}`}
            d={`M${l.p.x} ${l.p.y} Q${mx} ${my} ${l.q.x} ${l.q.y}`} />
        )
      })}
    </svg>
  )
}

// ── The drawer of everything you have found ───────────────────────
function ClueDrawer({ clues, selected, onSelect, freshId, usedClues }) {
  const [open, setOpen] = useState(false)
  return (
    <aside className={`cb-drawer ${open ? 'open' : ''}`} aria-label="Clues">
      <button className="drawer-toggle" onClick={() => setOpen(o => !o)}>
        <span>Clues ({clues.length}){selected ? ' · 1 selected' : ''}</span>
        <span style={{ fontFamily: 'Share Tech Mono', fontSize: 14 }}>{open ? '▾' : '▴'}</span>
      </button>
      <div className="drawer-head">
        <div className="hand">Clues</div>
        <div className="sub">{clues.length} collected · select one, then click a question — or drag it</div>
      </div>
      <div className="drawer-list">
        {clues.length === 0 && (
          <div className="drawer-empty">
            Nothing yet.<br />Open a lead on the board.<br />What you learn lands here.
          </div>
        )}
        {[...clues].reverse().map(id => {
          const clue = CLUES[id]
          if (!clue) return null
          const sel = selected === id
          return (
            <button key={id}
              className={`clue-card ${sel ? 'sel' : ''} ${freshId === id ? 'fresh' : ''}`}
              draggable
              onDragStart={(e) => { e.dataTransfer.setData('text/plain', id); onSelect(id) }}
              onClick={() => onSelect(sel ? null : id)}
              aria-pressed={sel}
            >
              <div className="th"><PolaroidArt scene={clue.scene} /></div>
              <div style={{ minWidth: 0 }}>
                <div className="tt">{clue.title}</div>
                <div className="src">{clue.source}</div>
                {sel && <div className="dt">{clue.detail}</div>}
                {usedClues.has(id) && <div className="used">on the board</div>}
              </div>
            </button>
          )
        })}
      </div>
      <div className="drawer-tip">
        Not every clue answers something. A theory is only tested when all three of a thread's questions are pinned.
      </div>
    </aside>
  )
}

// ── Tutorial ──────────────────────────────────────────────────────
const TUT = [
  { h: 'Your wall.', p: 'Twenty-three years of stories, and every one started like this: a wall, some pins, some string. This is Maya\'s case now. Yours too.' },
  { h: 'Leads.', p: 'Each pinned card is a lead from her apartment — her laptop, her burned notebook, her corkboard. Open one to investigate. Finishing a lead can uncover new ones.' },
  { h: 'Theories.', p: 'Leads drop clues into the drawer. Pencil a clue under each of a thread\'s three questions, then test the theory. The board only tells you how many pins hold. Not every clue is an answer.' },
  { h: 'The clock.', p: 'Maya has been gone almost 59 hours. Wrong flags, failed theories and hints all cost time. And your oldest friend will be texting. Choose your words.' },
]
function BoardTutorial({ onDone }) {
  const [i, setI] = useState(0)
  const step = TUT[i]
  const ref = useRef(null)
  useModalFocus(ref)
  return (
    <div ref={ref} className="cb-tut" role="dialog" aria-modal="true" aria-label="How the board works">
      <div className="card">
        <span className="pin" />
        <div className="hand">{step.h}</div>
        <p>{step.p}</p>
        <div className="row">
          <button className="skip" onClick={onDone}>Skip</button>
          <span className="dots">{i + 1} / {TUT.length}</span>
          <button onClick={() => (i + 1 < TUT.length ? setI(i + 1) : onDone())}>{i + 1 < TUT.length ? 'Next' : 'Begin'}</button>
        </div>
      </div>
    </div>
  )
}

function RayGoneCard({ onDone }) {
  const ref = useRef(null)
  useModalFocus(ref)
  return (
    <div ref={ref} className="cb-tut" role="alertdialog" aria-modal="true" aria-label="Ray has left">
      <div className="card" style={{ background: '#1a0c0a', color: '#f0d8c8' }}>
        <div className="type" style={{ fontSize: 12, letterSpacing: '0.3em', color: '#e04a3a' }}>NEW MESSAGE · RAY</div>
        <p style={{ color: '#f4e6d8', fontFamily: '-apple-system, sans-serif', fontSize: 17 }}>"Heading out now. Talk when I'm back, Tom. Hang in there."</p>
        <p style={{ color: '#c8a898' }}>His phone goes straight to voicemail after that. You can still make the call. But he has a head start now.</p>
        <div className="row"><span /><span /><button onClick={onDone}>Keep going</button></div>
      </div>
    </div>
  )
}

// Drag the board around with the mouse, like pushing a big sheet of cork
function usePan(ref) {
  useEffect(() => {
    const el = ref.current
    if (!el) return
    let start = null
    const down = (e) => {
      if (e.pointerType !== 'mouse' || e.button !== 0) return
      if (e.target.closest('button, [role=button], a, input, .cb-drawer')) return
      start = { x: e.clientX, y: e.clientY, left: el.scrollLeft, top: el.scrollTop }
      el.classList.add('panning')
    }
    const move = (e) => {
      if (!start) return
      el.scrollLeft = start.left - (e.clientX - start.x)
      el.scrollTop = start.top - (e.clientY - start.y)
    }
    const up = () => { start = null; el.classList.remove('panning') }
    el.addEventListener('pointerdown', down)
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
    return () => {
      el.removeEventListener('pointerdown', down)
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
    }
  }, [ref])
}

// ── Main ──────────────────────────────────────────────────────────
export function CaseBoard({ onOpenLead, onSave, onJournal, onApartment, onPresent }) {
  const s = useGameStore(useShallow(st => ({
    paths: st.paths, deductions: st.deductions, theory: st.theory, clues: st.clues, lastClue: st.lastClue,
    finalCase: st.finalCase, clock: st.clock, lastTimeDelta: st.lastTimeDelta,
    raySuspicion: st.raySuspicion, rayLog: st.rayLog, activePath: st.activePath,
    seenBoardTutorial: st.seenBoardTutorial, rayGoneSeen: st.rayGoneSeen, nameRevealSeen: st.nameRevealSeen,
  })))
  const pinTheory = useGameStore(st => st.pinTheory)
  const testTheory = useGameStore(st => st.testTheory)
  const setFinalSuspect = useGameStore(st => st.setFinalSuspect)
  const setFinalSlot = useGameStore(st => st.setFinalSlot)
  const markBoardTutorialSeen = useGameStore(st => st.markBoardTutorialSeen)
  const markRayGoneSeen = useGameStore(st => st.markRayGoneSeen)
  const buyHint = useGameStore(st => st.buyHint)
  const { playSFX } = useAudio()

  const [selectedClue, setSelectedClue] = useState(null)
  const [shakeThread, setShakeThread] = useState(null)
  const [hintedDeds, setHintedDeds] = useState([])
  const [voice, setVoice] = useState(null)
  const [banner, setBanner] = useState(null)
  const [zoomingId, setZoomingId] = useState(null)
  const corkRef = useRef(null)
  const viewportRef = useRef(null)
  const [mountedAt] = useState(() => Date.now())
  const voiceTimer = useRef(null)
  usePan(viewportRef)

  const closedCount = THREAD_KEYS.filter(k => s.paths[k].completed).length
  const suspicion = effectiveSuspicion(s.raySuspicion)
  const deadline = rayDeadline(suspicion)
  const minutesLeft = deadline - s.clock
  const gone = minutesLeft <= 0
  // Has any record put a surname to the handle yet? Until one has, the board
  // does not tell the player that the clock and the friend are the same man.
  const named = s.clues.some(id => NAME_CLUES.includes(id))
  const hasDraft = s.clues.includes('draft')

  const say = useCallback((text, kind = 'good', who = 'Thomas', ms) => {
    clearTimeout(voiceTimer.current)
    setVoice({ text, kind, who, at: Date.now() })
    voiceTimer.current = setTimeout(() => setVoice(null), ms ?? (kind === 'bad' ? 3800 : 5600))
  }, [])
  useEffect(() => () => clearTimeout(voiceTimer.current), [])

  const clueToast = s.lastClue && s.lastClue.at >= mountedAt ? s.lastClue.id : null

  useEffect(() => {
    if (!s.activePath) return
    document.getElementById(`thread-${s.activePath}`)?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  }, [s.activePath])

  const usedClues = useMemo(() => new Set([
    ...Object.values(s.deductions), ...Object.values(s.theory), ...Object.values(s.finalCase.slots),
  ]), [s.deductions, s.theory, s.finalCase.slots])

  const edges = useMemo(() => {
    const out = []
    const sourceOf = (clueId) => Object.keys(LEAD_META).find(id =>
      LEAD_META[id].clue === clueId && s.paths[id[0]]?.completedNodes.includes(id))
    for (const k of THREAD_KEYS) {
      const nodes = GAME_DATA[k].nodes
      const st = s.paths[k]
      for (const id of st.completedNodes) {
        const n = nodes.find(x => x.id === id)
        for (const u of n?.unlocks ?? []) {
          if (st.unlockedNodes.includes(u)) out.push([`lead-${id}`, `lead-${u}`, 'lead'])
        }
      }
      for (const d of DEDUCTIONS[k]) {
        const confirmed = s.deductions[d.id]
        const pencil = s.theory[d.id]
        const src = sourceOf(confirmed ?? pencil)
        if (src) out.push([`lead-${src}`, `ded-${d.id}`, confirmed ? 'ded' : 'theory'])
      }
      if (st.completed) out.push([`thread-${k}`, 'poster', 'closed'])
    }
    if (closedCount >= 2 && hasDraft) out.push(['poster', 'suspect', 'closed'])
    // The case against one man: every clue you're handing over, strung across
    // the whole board from the lead it came from to THE SUSPECT.
    if (closedCount >= 2 && hasDraft) {
      for (const clueId of Object.values(s.finalCase.slots)) {
        const src = sourceOf(clueId)
        if (src) out.push([`lead-${src}`, 'suspect', 'case'])
      }
    }
    return out
  }, [s.paths, s.deductions, s.theory, s.finalCase.slots, closedCount, hasDraft])

  const handleOpen = (pathKey, nodeId) => {
    playSFX('click')
    setZoomingId(nodeId)
    setTimeout(() => { setZoomingId(null); onOpenLead(pathKey, nodeId) }, 300)
  }

  const handleDedHint = (pathKey, ded) => {
    if (hintedDeds.includes(ded.id)) return
    buyHint(pathKey)
    setHintedDeds(prev => [...prev, ded.id])
    playSFX('click')
  }

  const handlePin = (ded, droppedClue) => {
    const clueId = droppedClue ?? selectedClue
    const current = s.theory[ded.id]
    if (!clueId) {
      if (current) { pinTheory(ded.id, null); playSFX('click') }
      else say('Pick a clue from the drawer first — then pin it to the question it answers.', 'bad', 'Board')
      return
    }
    // Clicking the × on a pinned chip passes that clue back: unpin it
    if (droppedClue && !selectedClue) {
      const pins = Array.isArray(current) ? current : current ? [current] : []
      if (pins.includes(droppedClue)) {
        pinTheory(ded.id, ded.pairAnswer ? droppedClue : null)
        playSFX('click')
        return
      }
    }
    playSFX('pin')
    pinTheory(ded.id, clueId)
    setSelectedClue(null)
  }

  const handleTest = (pathKey) => {
    const result = testTheory(pathKey)
    if (result.incomplete) return
    if (result.ok) {
      playSFX('deduction')
      const reveals = DEDUCTIONS[pathKey].map(d => d.reveal).join('  ')
      say(reveals, 'good', 'Thomas', 9000)
      const nowClosed = THREAD_KEYS.filter(k => useGameStore.getState().paths[k].completed).length
      setTimeout(() => {
        playSFX('stamp')
        setBanner({
          big: 'THREAD CLOSED',
          sm: nowClosed >= 2
            ? (useGameStore.getState().clues.includes('draft') ? 'It all points one way. Look at the bottom of the board.' : 'It all points one way. But Maya knew first. Find what she wrote.')
            : THREADS[pathKey].title,
        })
        setTimeout(() => setBanner(null), 2800)
      }, 700)
    } else {
      playSFX('error')
      setTimeout(() => playSFX('tick'), 180)
      setShakeThread(pathKey)
      setTimeout(() => setShakeThread(null), 520)
      const n = result.correct
      const words = ['None of them hold', 'One holds. Two don\'t', 'Two hold. One doesn\'t']
      say(`${words[n]}. Something here is wrong.  (+${WRONG_THEORY_COST} min)`, 'bad', 'Thomas', 4500)
    }
  }

  const handleFinalSlot = (slotId, currentClue, droppedClue) => {
    const clueId = droppedClue ?? selectedClue
    if (currentClue && !droppedClue && !selectedClue) { setFinalSlot(slotId, null); return }
    if (!clueId) { say('Select a clue from the drawer, then click this slot.', 'bad', 'Board'); return }
    playSFX('pin')
    setFinalSlot(slotId, clueId)
    setSelectedClue(null)
  }

  const handleSuspect = (id) => {
    playSFX('pin')
    setFinalSuspect(id)
    if (id === 'ray') say('Ray. Thirty years. He held my hand at the hospital the night Elena died.', 'good')
  }

  return (
    <div className="cb-root crt">
      <div className="cb-head">
        <button className="cb-btn" onClick={onApartment}>← Apartment</button>
        <div className="cb-title">
          <h1 className="hand" style={{ font: 'inherit', margin: 0 }}>Where is Maya?</h1>
          <div className="type">Case board · {closedCount}/3 threads closed</div>
        </div>
        <RayChip suspicion={suspicion} active={s.rayLog.length > 0} minutesLeft={minutesLeft} gone={gone} named={named} />
        <ClockHUD clock={s.clock} lastTimeDelta={s.lastTimeDelta} />
        <button className="cb-btn" onClick={onJournal}>Journal</button>
        <button className="cb-btn" onClick={onSave} title="Save (Ctrl/Cmd+S)">Save</button>
      </div>

      {/* On a phone the three threads stack into one very long scroll with
          no way back to the top of another one. These are that way back. */}
      <nav className="cb-jump" aria-label="Jump to a thread">
        {THREAD_KEYS.map(k => {
          const st = s.paths[k]
          const total = GAME_DATA[k].nodes.length
          return (
            <button key={k} type="button"
              className={s.activePath === k ? 'on' : ''}
              onClick={() => document.getElementById(`thread-${k}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>
              {k}<span className="n">{st.completedNodes.length}/{total}</span>
            </button>
          )
        })}
        <button type="button"
          onClick={() => document.querySelector('.cb-suspect')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>
          Suspect
        </button>
      </nav>

      <div className="cb-body">
        <div className="cb-viewport" ref={viewportRef}>
          <div className="cb-frame">
            <div className="cb-cork" ref={corkRef}>
              <YarnLayer edges={edges} />

              <div className="cb-poster-row">
                <div className="cb-poster" data-yarn="poster">
                  <span className="pin" />
                  <div className="ph"><PolaroidArt scene="maya" /></div>
                  <div className="big">MISSING</div>
                  <div className="nm">MAYA REYES, 24</div>
                  <div className="hand">last call: Mon 7:52am</div>
                </div>
                {s.rayLog.length > 0 && (
                  <div className="cb-sticky" style={{ '--tilt': '4deg' }}>
                    <span className="pin gold" />
                    <div className="hand">{named ? 'Ray → Seattle' : 'Before it\'s light'}</div>
                    <div className="hand big">{gone ? 'GONE' : clockLabel(deadline)}</div>
                    <div className="type">{gone ? 'phone off' : (named ? 'says he\'s leaving' : 'then he is gone')}</div>
                  </div>
                )}
              </div>

              <div className="cb-threads">
                {THREAD_KEYS.map(k => (
                  <ThreadColumn
                    key={k}
                    pathKey={k}
                    paths={s.paths}
                    deductions={s.deductions}
                    theory={s.theory}
                    selectedClue={selectedClue}
                    shaking={shakeThread === k}
                    focused={s.activePath === k}
                    zoomingId={zoomingId}
                    hintedDeds={hintedDeds}
                    onOpenLead={handleOpen}
                    onPin={handlePin}
                    onTest={handleTest}
                    onDedHint={handleDedHint}
                  />
                ))}
              </div>

              <SuspectSection
                closedCount={closedCount}
                clues={s.clues}
                hasDraft={hasDraft}
                finalCase={s.finalCase}
                selectedClue={selectedClue}
                onSuspect={handleSuspect}
                onSlot={handleFinalSlot}
                onPresent={onPresent}
              />
            </div>
          </div>
        </div>

        <ClueDrawer
          clues={s.clues}
          selected={selectedClue}
          onSelect={(id) => { if (id) playSFX('click'); setSelectedClue(id) }}
          freshId={clueToast}
          usedClues={usedClues}
        />
      </div>

      {zoomingId && <div className="cb-zoomfade" />}

      {voice && (
        <div key={voice.at} className={`cb-voice ${voice.kind === 'bad' ? 'bad' : ''}`} role="status">
          <div className="who">{voice.who}</div>
          <div className="hand">{voice.text}</div>
        </div>
      )}

      {banner && (
        <div className="cb-banner" aria-live="assertive">
          <div className="inner">
            <div className="big">{banner.big}</div>
            <div className="sm">{banner.sm}</div>
          </div>
        </div>
      )}

      {clueToast && CLUES[clueToast] && !(named && !s.nameRevealSeen) && (
        <div key={s.lastClue.at} className="clue-toast" role="status">
          <div className="k">New clue</div>
          <div className="lead-img"><PolaroidArt scene={CLUES[clueToast].scene} /></div>
          <div className="tt">{CLUES[clueToast].title}</div>
          <div className="hand">In your drawer. It may answer something — or nothing.</div>
        </div>
      )}

      {!s.seenBoardTutorial && <BoardTutorial onDone={markBoardTutorialSeen} />}
      {s.seenBoardTutorial && gone && !s.rayGoneSeen && s.nameRevealSeen && <RayGoneCard onDone={markRayGoneSeen} />}
    </div>
  )
}
