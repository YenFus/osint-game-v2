// ─────────────────────────────────────────────────────────────────
// ENDING — built from the case the player assembled:
//   suspect · the three clues and how strong each was · Ray's
//   suspicion (replies + hours taken) · the final choice.
// ─────────────────────────────────────────────────────────────────

import { useState, useEffect, useMemo } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { useGameStore } from '../store/gameStore'
import {
  CLUES, FINAL_SLOTS, DEDUCTIONS, START_MISSING_MINUTES,
  evaluateCase, effectiveSuspicion, rayMood, rayDeadline, clockLabel, RAY_ALARM_THRESHOLD, WRONG_SUSPECTS,
} from '../data/caseData'
import { GAME_DATA } from '../data/gameData'
// the ending is built out of the board's material, so it needs its styles
import '../styles/board.css'
import { assetCssUrl } from '../assetUrl'

const LENA = 'In a storage unit Ray rented off Route 9, investigators found Lena Vasquez\'s camera and phone. Eleven months after she vanished, her family finally had an answer. Not the one they had prayed for.'

const ENDINGS = {
  perfect: {
    stamp: 'CHARGED', label: 'The Right Call', color: '#5aa070', afterCall: 4,
    status: 'FOUND ALIVE', ray: 'ARRESTED',
    sub: 'Three sources. One name. You did it the way she would have.',
    outcome: 'Patrol cars reach Maya\'s street while Ray is still leaning on the buzzer. By morning the warrant covers a storage unit off Route 9. Maya is inside — dehydrated, frightened, alive.',
    coda: '"Your daughter built a case I could take to a judge in the middle of the night. You finished it the same way. That\'s why she\'s alive."',
    attrib: '— Detective Dana Okafor, Millhaven PD',
    lena: true,
  },
  journalist: {
    stamp: 'CHARGED', label: 'The Public Record', color: '#6a8ad0', afterCall: 6,
    status: 'FOUND ALIVE', ray: 'ARRESTED — CASE MADE PUBLIC',
    sub: 'You gave Maya\'s work to the people who knew how to use it.',
    outcome: 'Okafor moves within the hour. Rosa\'s story goes live the moment Ray is in cuffs — there\'s no quiet way to shelve it now. Maya is found before dawn.',
    coda: '"She understood that evidence has to survive scrutiny. Every source checked out. She was right about everything. The story is hers."',
    attrib: '— Rosa Velasquez, Pacific Reporter',
    lena: true,
  },
  fled: {
    stamp: 'AT LARGE', label: 'He Ran', color: '#a0a050', afterCall: 19,
    status: 'FOUND ALIVE', ray: 'FLED — ARRESTED',
    sub: 'The case was airtight. Ray was already spooked.',
    outcome: 'Ray stops buzzing before the patrol cars turn the corner. He\'d read something in your silence. It takes a state-wide alert and nineteen hours to find the second location.',
    coda: '"The case you gave us was flawless. But he knew you were coming. With someone like him, you don\'t let them know you know."',
    attrib: '— Detective Dana Okafor, Millhaven PD',
    lena: true,
  },
  partial: {
    stamp: 'CHARGED', label: 'Enough', color: '#9a9a60', afterCall: 30,
    status: 'FOUND ALIVE', ray: 'ARRESTED',
    sub: 'Not airtight. But enough to start.',
    outcome: 'Okafor believes you. A judge needs more. It takes until the next afternoon to fill the gaps you left. Ray is picked up at a motel in Grants Pass.',
    coda: '"You gave us a name and part of a case. We did the rest. It just took time she didn\'t have to spare."',
    attrib: '— Detective Dana Okafor, case review',
    lena: true,
  },
  thin: {
    stamp: 'OPEN', label: 'The Thin File', color: '#a08060', afterCall: 9 * 24,
    status: 'FOUND ALIVE', ray: 'ARRESTED (DELAYED)',
    sub: 'You knew. You couldn\'t prove it.',
    outcome: 'Okafor writes the name down. Without evidence that holds there\'s no warrant — only questions Ray answers politely at his door. A tip from the storage company finds Maya nine days later.',
    coda: '"Everything we needed was in her apartment. Her files. Her notebook. Her board. Someone just had to hand it to us in a form we could use."',
    attrib: '— Detective Dana Okafor, post-case debrief',
    lena: false,
  },
  tipoff: {
    stamp: 'OPEN', label: 'Too Close', color: '#c04040', afterCall: 6 * 24,
    status: 'FOUND ALIVE', ray: 'FLED — ARRESTED LATER',
    sub: 'You needed him to know you knew. He did.',
    outcome: 'He reads your face before you finish the sentence. Forty minutes later the storage unit is empty. Maya is found six days later, near the Nevada line.',
    coda: '"She wrote it in capitals: don\'t call him. I understand why you went down those stairs. I\'d have wanted to as well."',
    attrib: '— Detective Dana Okafor, Millhaven PD',
    lena: false,
  },
  gone: {
    stamp: 'AT LARGE', label: 'Head Start', color: '#b08050', afterCall: 3 * 24,
    status: 'FOUND ALIVE', ray: 'ARRESTED AT THE BORDER',
    sub: 'The case was strong. Ray was already on the road.',
    outcome: 'Ray was on I-5 north when you called. A trooper stops him at the border that afternoon. Maya isn\'t in the car — it takes three more days to find the cabin.',
    coda: '"Your case was good. If we\'d had it six hours earlier, we\'d have caught him with her."',
    attrib: '— Detective Dana Okafor, Millhaven PD',
    lena: true,
  },
  lost: {
    stamp: 'UNSOLVED', label: 'Still Missing', color: '#7a5a6a', afterCall: null,
    status: 'STILL MISSING', ray: 'ARRESTED — SILENT',
    sub: 'He left before dawn. Nobody could stop him.',
    outcome: 'By the time anyone is looking for him his phone is in the Columbia River. He\'s picked up at the border eleven days later, alone, and says nothing.',
    coda: '"Every piece of it was in her apartment. We just needed it sooner."',
    attrib: '— Detective Dana Okafor, Millhaven PD',
    lena: false,
  },
  thin_unknown: {
    stamp: 'OPEN', label: 'A Name You Didn\'t Have', color: '#a08060', afterCall: 9 * 24,
    status: 'FOUND ALIVE', ray: 'IDENTIFIED LATER',
    sub: 'You had an account. You never had a person.',
    outcome: 'Okafor subpoenas the registrar. The answer comes back nine days later with a name on it: Raymond T. Callahan — the man who was at your table every Christmas. Maya is found that evening.',
    coda: '"You were three quarters of the way there. The quarter you were missing was his name."',
    attrib: '— Detective Dana Okafor, Millhaven PD',
    lena: false,
  },
  lost_unknown: {
    stamp: 'UNSOLVED', label: 'Still Missing', color: '#7a5a6a', afterCall: null,
    status: 'STILL MISSING', ray: 'IDENTIFIED — GONE',
    sub: 'A handle isn\'t a man. He was gone before anyone could put a name to it.',
    outcome: 'The registrar answers eleven days after Ray drives out of Millhaven. By then his house is empty. He is picked up at the border, alone, and says nothing at all.',
    coda: '"Everything we needed was in her apartment. We just needed the name sooner."',
    attrib: '— Detective Dana Okafor, Millhaven PD',
    lena: false,
  },
  traced: {
    stamp: 'CHARGED', label: 'The Registrar Answered', color: '#9a9a60', afterCall: 20,
    status: 'FOUND ALIVE', ray: 'ARRESTED',
    sub: 'You couldn\'t say his name. The paperwork said it for you.',
    outcome: 'You hand over everything and let Okafor draw the line you wouldn\'t. The registrar confirms it inside two hours. They take him at a motel outside Grants Pass.',
    coda: '"You had all of it. You just couldn\'t make yourself say the name — and I have seen that before, Mr. Reyes. It cost you a night."',
    attrib: '— Detective Dana Okafor, Millhaven PD',
    lena: true,
  },
  wrongman: {
    stamp: 'NO CHARGES', label: 'The Wrong Man', color: '#8a4a4a', afterCall: 11 * 24,
    status: 'FOUND ALIVE', ray: 'FREE — FOR NOW',
    sub: 'Someone wanted you chasing the wrong man. It worked twice.',
    outcome: 'Police spend two days on a man the records had already cleared. Maya is found eleven days later, after an anonymous tip.',
    coda: '"Somebody spent a year pushing that forum at other men. Your daughter saw through it. We didn\'t."',
    attrib: '— Detective Dana Okafor, case review',
    lena: false,
  },
}

const SUSPECT_NAME = { corey: 'Corey Marsh', pryce: 'Owen Pryce', unknown: 'stillwater_m', ray: 'Ray Callahan' }

function deriveEnding(evaluation, choice, suspicion, gone) {
  const { suspect, caseAgainstRay: strength } = evaluation
  const wrongMan = WRONG_SUSPECTS.includes(suspect)
  if (choice === 'confront') return wrongMan ? 'wrongman' : 'tipoff'
  if (wrongMan) return 'wrongman'
  const traceable = evaluation.strength >= 2.5 && evaluation.namesSomeone
  if (gone) {
    if (suspect !== 'ray') return traceable ? 'gone' : 'lost_unknown'
    return strength >= 2.5 ? 'gone' : 'lost'
  }
  if (suspect !== 'ray') return traceable ? 'traced' : 'thin_unknown'
  if (strength >= 2.5) {
    if (suspicion >= RAY_ALARM_THRESHOLD) return 'fled'
    return choice === 'journalist' ? 'journalist' : 'perfect'
  }
  if (strength >= 1.5) return 'partial'
  return 'thin'
}

function buildCall(type, evaluation, choice, gone) {
  const lines = []
  const you = (text) => lines.push({ who: 'You', text })
  const ok = (text) => lines.push({ who: 'Okafor', text })
  const pause = (text) => lines.push({ who: null, text })

  if (choice === 'confront') {
    pause('Ray is leaning against his car under the streetlight. He smiles when he sees you.')
    lines.push({ who: 'Ray', text: '"Tom. Christ, you look terrible. Any news?"' })
    const wrong = WRONG_SUSPECTS.includes(evaluation.suspect)
    you(wrong ? `"Ray. I think I know who did it. ${SUSPECT_NAME[evaluation.suspect]}."` : '"stillwater_m, Ray."')
    pause(wrong ? 'Something in his face relaxes.' : 'Nothing moves in his face. That\'s how you know.')
    lines.push({ who: 'Ray', text: wrong ? '"Then tell the police, Tom. Go on."' : '"I don\'t know what she told you, but—"' })
    if (!wrong) { you('"Where is she?"'); pause('He gets in the car.') }
    return lines
  }

  // A man with nobody circled cannot open by saying he knows who took her.
  you(evaluation.suspect
    ? '"Detective Okafor. This is Thomas Reyes. Maya Reyes is my daughter. I know who took her."'
    : '"Detective Okafor. This is Thomas Reyes. Maya Reyes is my daughter. I have been working all night and I need somebody to look at what I have."')
  ok(evaluation.suspect ? '"Go ahead, Mr. Reyes."' : '"I am listening, Mr. Reyes. Take it slowly."')
  if (evaluation.suspect === 'corey') {
    you('"Corey Marsh. Lena Vasquez\'s ex. He was stalking her — Maya had it on file."')
    ok('"Corey Marsh was cleared last year. Timestamped photos from his shop in Tigard, both nights. Who pointed you at him?"')
    pause('You don\'t have an answer.')
    return lines
  }
  if (evaluation.suspect === 'pryce') {
    you('"Owen Pryce. He ran that arts night. He wouldn\'t give anyone the guest list."')
    ok('"Mr. Pryce was on a stage in front of four hundred people at a quarter to eight, introducing her. It is in the programme you have in your hand. Who has been pointing you at these men?"')
    pause('You don\'t have an answer.')
    return lines
  }
  if (evaluation.suspect === 'unknown') {
    you('"There\'s an account. stillwater_m. He knew things about Lena nobody should have known. Maya was onto him."')
    ok('"A username. Do you have a name?"')
    pause('You don\'t say it. Thirty years. You can\'t make yourself say it.')
  } else if (!evaluation.suspect) {
    // Nobody circled. He has a phone in his hand and nothing to say into it.
    you('"I have been at this all night and I do not have a name for you."')
    ok('"Then tell me what you do have, Mr. Reyes, and let me decide what it is worth."')
  } else {
    you(gone ? '"Ray Callahan. He left town a few hours ago. He said Seattle. I don\'t believe him."' : '"Ray Callahan. He\'s outside my daughter\'s building right now."')
    ok('"...Callahan. What do you have?"')
  }
  const LEAD_IN = {
    who: 'Who\'s behind the account — ',
    there: 'Where he was the night Lena vanished — ',
    before: 'And why I believe it — ',
  }
  const MISSING = {
    who: 'I can\'t prove it\'s his account.',
    there: 'I can\'t put him at the arts night.',
    before: 'I don\'t have anything showing he\'s done this before.',
  }
  const EMPTY_LINES = [
    '"Nothing on who. All right."',
    '"And nothing putting him at the hall."',
    '"And nothing showing a pattern. Mr. Reyes — I believe you. I cannot act on belief."',
  ]
  evaluation.perSlot.forEach((p, i) => {
    // `spoken`, not `title` — see caseData's CLUES
    you(p.clueId ? `"${LEAD_IN[p.slot.id]}${CLUES[p.clueId]?.spoken ?? CLUES[p.clueId].title}."` : `"${MISSING[p.slot.id]}"`)
    // three identical "You have nothing for this" lines read as a bug
    ok(p.clueId ? `"${p.reaction}"` : EMPTY_LINES[i] ?? `"${p.reaction}"`)
  })
  if (evaluation.suspect === 'unknown') {
    ok('"All of this is real work, Mr. Reyes. But you have handed me an account, not a man. One of those records has a name printed on it."')
    if (evaluation.namesSomeone) pause('You look down at the registrar printout in your hand. You cannot make yourself say it.')
  } else if (WRONG_SUSPECTS.includes(evaluation.suspect)) {
    ok(`"And none of it points at ${SUSPECT_NAME[evaluation.suspect]}. It points at whoever registered that domain."`)
  }
  if (gone && type === 'gone') ok('"That\'s enough for a warrant. I\'m putting out an alert on his car now. Every road north."')
  else if (type === 'perfect' || type === 'journalist' || type === 'fled') ok('"That\'s enough. Don\'t open the door. Don\'t answer him. We\'re coming."')
  else if (type === 'partial') ok('"It\'s a start. I can\'t get a warrant on this alone tonight — but I can start pulling. Stay put."')
  else ok('"I\'ll note the name. But I need something I can put in front of a judge."')
  if (choice === 'journalist') lines.push({ who: 'Rosa', text: '"Mr. Reyes — I\'ve been waiting for this since Thursday. Maya said she was close. I have everything. It\'s ready when you are."' })
  return lines
}

function lessons(type, evaluation, suspicion, clues) {
  const out = []
  if (evaluation.suspect === 'corey') out.push('Corey Marsh has an alibi on his own Flickr. The forum account that accused him is the one to follow.')
  if (evaluation.suspect === 'pryce') out.push('Owen Pryce was on stage at 7:45, in the programme. The account that nudged you towards him is the one to follow.')
  if (evaluation.suspect === 'unknown') {
    out.push(evaluation.namesSomeone
      ? 'You handed over a record with his name printed on it — and still circled an account instead of a man. Name him.'
      : 'You had a username, not a person. The WHOIS record, the business registry or the site\'s source code would have given you a name.')
  }
  if (evaluation.suspect === 'ray') {
    evaluation.perSlot.forEach(p => {
      if (p.weight >= 1) return
      const best = Object.entries(p.slot.weights).filter(([, w]) => w >= 1).map(([id]) => id)
      const have = best.filter(id => clues.includes(id))
      out.push(have.length
        ? `${p.slot.label}: you had "${CLUES[have[0]].title}" — it would have held.`
        : `${p.slot.label}: you never found ${best.map(id => `"${CLUES[id].title}"`).join(' or ')}.`)
    })
  }
  if (type === 'gone' || type === 'lost') out.push('Ray left before you made the call. Failed theories, hints and careless texts all brought his departure closer.')
  else if (suspicion >= RAY_ALARM_THRESHOLD) out.push('Ray was alarmed. What you texted him told him you were close.')
  if (type === 'tipoff') out.push('Maya\'s draft said it plainly: "Please don\'t call anyone."')
  return out
}

export default function EndingPage() {
  const st = useGameStore(useShallow(s => ({
    finalCase: s.finalCase, endingChoice: s.endingChoice, raySuspicion: s.raySuspicion, clock: s.clock,
    paths: s.paths, deductions: s.deductions, hintsUsed: s.hintsUsed, wrongGuesses: s.wrongGuesses, clues: s.clues,
  })))
  const evaluation = useMemo(() => evaluateCase(st.finalCase), [st.finalCase])
  const suspicion = effectiveSuspicion(st.raySuspicion)
  const gone = st.clock >= rayDeadline(suspicion)
  const type = deriveEnding(evaluation, st.endingChoice, suspicion, gone)
  const ending = ENDINGS[type]
  const call = buildCall(type, evaluation, st.endingChoice, gone)
  const tips = lessons(type, evaluation, suspicion, st.clues)

  const totalHours = ending.afterCall === null ? null : Math.round((START_MISSING_MINUTES + st.clock) / 60 + ending.afterCall)
  const afterLabel = ending.afterCall === null
    ? null
    : ending.afterCall < 48
      ? `found ${ending.afterCall} hours after your call`
      : `found ${Math.round(ending.afterCall / 24)} days after your call`
  const leads = Object.values(st.paths).reduce((n, p) => n + p.completedNodes.length, 0)
  const totalLeads = ['A', 'B', 'C'].reduce((n, k) => n + GAME_DATA[k].nodes.length, 0)
  const deds = Object.keys(st.deductions).length
  const totalDeds = Object.values(DEDUCTIONS).flat().length

  const [showCall, setShowCall] = useState(true)
  const [phase, setPhase] = useState('reveal')
  useEffect(() => {
    if (phase !== 'reveal') return undefined
    const go = () => setPhase('details')
    const t = setTimeout(go, 5200)
    // the plate says "press any key", so honour that and not just Enter/Space
    const onKey = (e) => { if (!e.metaKey && !e.ctrlKey && !e.altKey) go() }
    window.addEventListener('keydown', onKey)
    return () => { clearTimeout(t); window.removeEventListener('keydown', onKey) }
  }, [phase])

  const restart = () => {
    useGameStore.getState().resetGame()
    useGameStore.setState({ phase: 'menu' })
  }

  if (phase === 'reveal') {
    return (
      <div className="fixed inset-0 flex items-center justify-center p-6"
        style={{ background: `radial-gradient(circle at center, ${ending.color}26 0%, #08080e 70%)` }}>
        {/* the whole plate is the control: clicking anywhere works, and it is a real
            button so Enter, Space and a screen reader all reach the epilogue too */}
        <button type="button" className="end-reveal-skip" autoFocus onClick={() => setPhase('details')}>
          Maya Reyes — {ending.status}{afterLabel ? `, ${afterLabel}` : ''}. Continue to the case file.
        </button>
        <div className="text-center end-reveal-plate" aria-hidden="true" style={{ animation: 'fadeUp 1.4s ease forwards' }}>
          <div className="font-mono text-xs tracking-[0.4em] uppercase mb-5" style={{ color: ending.color }}>Maya Reyes</div>
          <h1 className="font-black uppercase tracking-tight mb-4"
            style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 'clamp(2.4rem, 9vw, 6.5rem)', color: ending.color, textShadow: `0 0 60px ${ending.color}55` }}>
            {ending.status}
          </h1>
          {afterLabel && (
            <div className="font-mono text-xs tracking-[0.3em] uppercase text-[#8a8a88] mb-3">{afterLabel}</div>
          )}
          <div className="font-mono text-sm tracking-[0.2em] uppercase text-[#9a9a98]">
            {totalHours === null ? 'Missing since Monday' : `Missing ${totalHours} hours in total`} · {evaluation.suspect === 'ray' ? 'Ray Callahan' : 'The man who took her'}: <span style={{ color: ending.color }}>{ending.ray}</span>
          </div>
          <div className="end-reveal-cue font-mono text-xs mt-12">Press any key to continue</div>
        </div>
      </div>
    )
  }

  const mood = rayMood(suspicion)

  return (
    <div className="end-root" style={{ '--cork': assetCssUrl('art/cork-surface.jpg') }}>
      <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-12 flex flex-col gap-8 relative">

        {/* the file, closed and stamped — not a score */}
        <div className="end-file">
          <span className="end-stamp" style={{ color: ending.color }}>{ending.stamp}</span>
          <div className="kicker">Millhaven PD · case 2025-0310</div>
          <h1 className="verdict">{ending.label}</h1>
          <p className="sub">{ending.sub}</p>
          <div className="filed">
            <span>{st.endingChoice === 'confront' ? 'Filed by D. Okafor' : 'Filed by T. Reyes'}</span>
            <span>{clockLabel(st.clock)}</span>
          </div>
        </div>

        {/* taken → you called → found */}
        <div className="border border-[#2a2a38] bg-[#0b0b12] p-5">
          <div className="flex items-center gap-2 text-center">
            {[
              ['MON 07:52', 'taken', '#e04a3a'],
              [clockLabel(st.clock), st.endingChoice === 'confront' ? 'you went down' : 'you called', '#c0a060'],
              [totalHours === null ? '—' : `+${ending.afterCall < 48 ? `${ending.afterCall}h` : `${Math.round(ending.afterCall / 24)}d`}`, totalHours === null ? 'never found' : 'found', ending.color],
            ].map(([big, small, color], i) => (
              <div key={small} className="flex-1 flex items-center gap-2">
                {i > 0 && <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg,#2a2a38,#7a7a8f)' }} />}
                <div className="shrink-0">
                  <div className="font-mono text-base" style={{ color }}>{big}</div>
                  <div className="font-mono text-[12px] tracking-[0.2em] uppercase text-[#6a6a78]">{small}</div>
                </div>
                {i < 2 && <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg,#7a7a8f,#2a2a38)' }} />}
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="font-mono text-xs text-[#7a7a88] tracking-[0.2em] uppercase mb-3">What happened</div>
          <p className="text-lg leading-relaxed text-[#d8d0c0]" style={{ fontFamily: "'Crimson Pro', serif" }}>{ending.outcome}</p>
          {ending.lena && <p className="text-base leading-relaxed text-[#9a9088] italic mt-4" style={{ fontFamily: "'Crimson Pro', serif" }}>{LENA}</p>}
        </div>

        <div className="border border-[#2a2a38] bg-[#0b0b12] p-5 sm:p-7">
          <button
            onClick={() => setShowCall(v => !v)}
            className="w-full flex items-center justify-between font-mono text-xs text-[#9a9aa8] tracking-[0.2em] uppercase mb-4"
          >
            <span>{showCall ? '▾' : '▸'} {st.endingChoice === 'confront' ? 'Outside the building' : 'The call'} — {call.length} lines</span>
            <span style={{ color: '#c0a060' }}>{showCall ? 'hide' : 'read it'}</span>
          </button>
          <div className="space-y-3" hidden={!showCall}>
            {call.map((l, i) => l.who ? (
              <div key={i} className="flex gap-4">
                <span className="font-mono text-xs shrink-0 w-16 pt-1" style={{ color: l.who === 'You' ? '#c0a060' : l.who === 'Ray' ? '#d05040' : l.who === 'Rosa' ? '#6a8ad0' : '#7a9ab0' }}>{l.who}</span>
                <p className="text-base italic leading-relaxed text-[#d0c8b8]" style={{ fontFamily: "'Crimson Pro', serif" }}>{l.text}</p>
              </div>
            ) : (
              <p key={i} className="text-sm italic text-[#7a7268] pl-20" style={{ fontFamily: "'Crimson Pro', serif" }}>{l.text}</p>
            ))}
          </div>
        </div>

        <div className="pl-5 py-2" style={{ borderLeft: `3px solid ${ending.color}` }}>
          <blockquote className="text-lg italic leading-relaxed" style={{ fontFamily: "'Crimson Pro', serif", color: '#e0d4bc' }}>{ending.coda}</blockquote>
          <div className="font-mono text-xs text-[#6a6a78] mt-2">{ending.attrib}</div>
        </div>

        <div className="border border-[#2a2a38] p-5 sm:p-7">
          <div className="font-mono text-xs text-[#7a7a88] tracking-[0.2em] uppercase mb-5">Your investigation</div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 text-center">
            {[
              [totalHours === null ? '—' : `${totalHours}h`, totalHours === null ? 'Still missing' : 'Maya missing'],
              [`${Math.floor(st.clock / 60)}h ${st.clock % 60}m`, 'You spent'],
              [`${deds}/${totalDeds}`, 'Deductions'],
              [`${leads}/${totalLeads}`, 'Leads examined'],
            ].map(([v, k]) => (
              <div key={k}>
                <div className="text-3xl font-black" style={{ fontFamily: "'Barlow Condensed', sans-serif", color: '#e8e0d0' }}>{v}</div>
                <div className="font-mono text-[12px] text-[#7a7a88] mt-1">{k}</div>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-5 border-t border-[#1a1a28] grid sm:grid-cols-2 gap-4 font-mono text-xs">
            <div>
              <div className="text-[#7a7a88] mb-2">
                CASE STRENGTH · {evaluation.strength.toFixed(1)} / 3
                <span className="block text-[12px] mt-0.5" style={{ color: evaluation.suspect === 'ray' ? '#6a9a70' : '#c08060' }}>
                  {/* The records you hand over are strong or they are not; who you
                      accused is a separate question, and naming the wrong man does
                      not make the paperwork weaker — it makes it point elsewhere. */}
                  {evaluation.suspect === 'ray' ? 'against Ray Callahan'
                    : WRONG_SUSPECTS.includes(evaluation.suspect)
                      ? `— and none of it points at ${SUSPECT_NAME[evaluation.suspect]}, who you named`
                      : evaluation.namesSomeone
                        ? '— and one of these records carries a name you did not say'
                        : '— but you never named a man'}
                </span>
              </div>
              {FINAL_SLOTS.map((slot, i) => {
                const p = evaluation.perSlot[i]
                return (
                  <div key={slot.id} className="flex items-center gap-2 mb-1.5">
                    <span className="w-16 text-[#9a9aa8]">{slot.label}</span>
                    <span className="flex-1 h-1.5 bg-[#1a1a28]"><span className="block h-full" style={{ width: `${p.weight * 100}%`, background: p.weight >= 1 ? '#5aa070' : p.weight > 0 ? '#b0a050' : '#6a2a2a' }} /></span>
                    <span className="w-40 truncate text-[#b0a898]">{p.clueId ? CLUES[p.clueId].title : '—'}</span>
                  </div>
                )
              })}
            </div>
            <div className="text-[#9a9aa8] space-y-1.5">
              <div>HOW WORRIED RAY GOT: <span style={{ color: mood.color }}>{mood.label.toUpperCase()}</span></div>
              <div>HINTS BOUGHT: {st.hintsUsed}</div>
              <div>WRONG GUESSES: {st.wrongGuesses}</div>
            </div>
          </div>
        </div>

        {tips.length > 0 && (
          <div className="border border-dashed border-[#3a3a48] p-5 sm:p-6">
            <div className="font-mono text-xs text-[#9a9aa8] tracking-[0.2em] uppercase mb-3">What would have changed it</div>
            <ul className="space-y-2">
              {tips.map((t, i) => <li key={i} className="text-base text-[#b8b0a0]" style={{ fontFamily: "'Crimson Pro', serif" }}>— {t}</li>)}
            </ul>
            {/* The letter grades are gone — this line used to advertise them. */}
            <p className="font-mono text-[12px] text-[#6a6a78] mt-4">{Object.keys(ENDINGS).length} endings. Two of them get her home the same night.</p>
          </div>
        )}

        <div className="border-t border-[#1a1a28] pt-6 pb-4 flex flex-col sm:flex-row items-center justify-between gap-5">
          <div className="font-mono text-xs text-[#7c7c8e]">What Maya Knew — thank you for playing</div>
          <button onClick={restart} className="font-mono text-sm tracking-[0.15em] uppercase border-2 px-8 py-3 min-h-[48px] hover:bg-[#1a1a28]" style={{ borderColor: '#c0a060', color: '#e0c890' }}>
            ← Play again
          </button>
        </div>
      </div>
    </div>
  )
}
