import { useState } from 'react'
import { BUTTON_PRIMARY } from '../../styles/nodeStyles'
import { useGameStore } from '../../store/gameStore'
import { useLeadProgress } from '../../hooks/useLeadProgress'

// Rows are real buttons. They were <div onClick> with no role and no
// tabIndex, which made the three navigate leads — A1, B7, C8 — impossible
// to play with a keyboard or a screen reader. A1 is the only way into
// Thread A and B7 is on the only route to Thread B's answer, so the game
// could not be finished without a mouse.
const ROW = {
  display: 'flex', alignItems: 'center', gap: 6,
  width: '100%', textAlign: 'left', background: 'none', border: 0,
  paddingTop: 6, paddingBottom: 6,
  fontFamily: 'Share Tech Mono, monospace', fontSize: 12,
  cursor: 'pointer',
}

// Every file in the tree with the folder it sits in, in tree order. The
// list shows all of them the same way, so it never hints at which matter.
function flattenFiles(node, folder = '', out = []) {
  if (node.type === 'file') { out.push({ file: node, folder }); return out }
  const here = folder ? `${folder} / ${node.name}` : node.name
  for (const child of node.children ?? []) flattenFiles(child, here, out)
  return out
}

function FileTreeNode({ node, onOpen, openedFiles, depth = 0 }) {
  const [expanded, setExpanded] = useState(depth < 2)

  const indent = depth * 16

  if (node.type === 'file') {
    const isOpened = openedFiles.includes(node.name)
    return (
      <button
        type="button"
        onClick={() => onOpen(node)}
        aria-label={`${node.name}${isOpened ? ' — already read' : ''}`}
        style={{
          ...ROW,
          paddingLeft: indent + 8,
          color: isOpened ? '#6a9060' : '#8a8278',
          borderLeft: isOpened ? '1px solid #2a4020' : '1px solid transparent',
          marginLeft: 1,
        }}
        onMouseEnter={e => e.currentTarget.style.color = '#c8b890'}
        onMouseLeave={e => e.currentTarget.style.color = isOpened ? '#6a9060' : '#8a8278'}
      >
        {/* an opened file used to reuse ▸, the glyph for a shut folder */}
        <span aria-hidden="true" style={{ color: '#7e7a6d' }}>{isOpened ? '✓' : '·'}</span>
        {node.name}
      </button>
    )
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
        aria-label={`${node.name} folder`}
        style={{ ...ROW, paddingLeft: indent + 8, color: '#7a8898' }}
        onMouseEnter={e => e.currentTarget.style.color = '#c8b890'}
        onMouseLeave={e => e.currentTarget.style.color = '#7a8898'}
      >
        <span aria-hidden="true" style={{ color: '#4a6a88' }}>{expanded ? '▾' : '▸'}</span>
        {node.name}{node.type === 'folder' ? '/' : ''}
      </button>
      {expanded && node.children?.map(child => (
        <FileTreeNode
          key={child.name}
          node={child}
          onOpen={onOpen}
          openedFiles={openedFiles}
          depth={depth + 1}
        />
      ))}
    </div>
  )
}

// Most of the files on her laptop are not text. Their content was authored
// as "[Image] Maya and a tabby cat sitting on a couch." and printed raw, so
// opening a photograph showed the player a square bracket and a stage
// direction. Anything that opens with a [tag] is framed as what it is —
// a viewer window with a caption — and only the prose after it is read out.
const MEDIA = /^\[([^\]]+)\]\s*([\s\S]*)$/
const KIND_ICON = { photo: 'photo', image: 'photo', screenshot: 'screen', document: 'doc', 'pdf viewer': 'doc' }

function parseMedia(text) {
  const m = MEDIA.exec(text ?? '')
  if (!m) return null
  const inner = m[1]
  const split = inner.split(/\s+[—–-]\s+/)
  const kind = split[0].trim()
  const caption = split.slice(1).join(' — ').trim() || m[2].split('\n')[0].trim()
  const rest = split.length > 1 ? m[2] : m[2].split('\n').slice(1).join('\n')
  return { kind, caption, rest: rest.trim(), face: KIND_ICON[kind.toLowerCase()] ?? 'doc' }
}

function FileBody({ file }) {
  const media = parseMedia(file.content)
  if (!media) {
    return (
      <pre className={`nv-text ${file.handwritten ? 'hand-note' : ''}`}>{file.content}</pre>
    )
  }
  return (
    <>
      <figure className={`nv-media nv-media-${media.face}`}>
        <div className="nv-plate" aria-hidden="true">
          <span className="nv-kind">{media.kind}</span>
        </div>
        <figcaption className="nv-cap">{media.caption}</figcaption>
      </figure>
      {media.rest && <pre className={`nv-text ${file.handwritten ? 'hand-note' : ''}`}>{media.rest}</pre>}
    </>
  )
}

export function NavigateNode({ content, onComplete, nodeId = null }) {
  const [openedFiles, setOpenedFiles] = useLeadProgress(nodeId, 'opened', [])
  const [activeFile, setActiveFile] = useState(null)

  const handleOpen = (file) => {
    setActiveFile(file)
    setOpenedFiles(prev => prev.includes(file.name) ? prev : [...prev, file.name])
    // a file that spells out the surname is the reveal, wherever it is read
    if (file.revealsName) useGameStore.getState().flagNameSeen()
  }

  const allRequired = content.requiredFiles.every(f => openedFiles.includes(f))
  const requiredLeft = content.requiredFiles.filter(f => !openedFiles.includes(f))

  // Stack vertically on mobile, side-by-side on desktop
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 640

  return (
    <div style={{
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      gap: 0,
      flex: 1,
      minHeight: 0,
      overflow: 'hidden',
    }}>
      {/* File tree panel */}
      <div style={{
        width: isMobile ? '100%' : 240,
        flexShrink: 0,
        borderRight: isMobile ? 'none' : '1px solid #1a1a28',
        borderBottom: isMobile ? '1px solid #1a1a28' : 'none',
        background: '#08080e',
        overflowY: 'auto',
        paddingTop: 8,
        paddingBottom: 8,
        maxHeight: isMobile ? 200 : 'unset',
      }}>
        <div style={{
          fontFamily: 'Share Tech Mono, monospace', fontSize: 12,
          color: '#7e7a6d', letterSpacing: '0.3em', textTransform: 'uppercase',
          padding: '8px 12px 12px',
        }}>
          File System
        </div>
        <FileTreeNode
          node={content.root}
          onOpen={handleOpen}
          openedFiles={openedFiles}
        />
      </div>

      {/* File content panel */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, minHeight: 0 }}>
        {activeFile ? (
          <div className="nv-desk">
            <article className="nv-sheet">
              <div className="nv-name">{activeFile.name}</div>
              <FileBody file={activeFile} />
            </article>
          </div>
        ) : (
          // An empty reading pane used to be 850×690 of flat black with
          // "Select a file to read" floating in the middle of it. The pane
          // now shows the screen as Thomas found it.
          // The reading pane was ~860×690 of near-empty screen until a file
          // was chosen. It now lists everything on the drive, the way a
          // desktop's list view would — a second, roomier way in.
          <div className="nv-desk nv-list">
            <p className="nv-idle-line">{content.idleNote ?? 'The screen is still on. Nothing is open.'}</p>
            <div className="nv-listhead" aria-hidden="true">
              <span>Name</span><span>Where</span>
            </div>
            <ul className="nv-rows">
              {flattenFiles(content.root).map(({ file, folder }) => {
                const read = openedFiles.includes(file.name)
                return (
                  <li key={`${folder}/${file.name}`}>
                    <button type="button" className={`nv-row ${read ? 'read' : ''}`}
                      onClick={() => handleOpen(file)}
                      aria-label={`${file.name}, in ${folder}${read ? ', already read' : ''}`}>
                      <span className="nm">{read ? '✓ ' : ''}{file.name}</span>
                      <span className="wh">{folder}</span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
        )}

        {/* Footer */}
        <div style={{
          borderTop: '1px solid #1a1a28', padding: '10px 16px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexShrink: 0,
        }}>
          {!allRequired ? (
            <div style={{
              fontFamily: 'Share Tech Mono, monospace', fontSize: 12,
              color: '#857a68', letterSpacing: '0.05em',
            }}>
              {/* how many files still matter — not which ones. Naming them
                  turned three leads into "click the two we told you about". */}
              {requiredLeft.length} {requiredLeft.length === 1 ? 'file' : 'files'} here still matter{requiredLeft.length === 1 ? 's' : ''}
            </div>
          ) : (
            <button onClick={onComplete} style={BUTTON_PRIMARY}>
              Continue →
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
