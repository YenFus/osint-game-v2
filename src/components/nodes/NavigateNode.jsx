import { useState } from 'react'
import { BUTTON_PRIMARY } from '../../styles/nodeStyles'

function FileTreeNode({ node, onOpen, openedFiles, depth = 0 }) {
  const [expanded, setExpanded] = useState(depth < 2)

  const indent = depth * 16

  if (node.type === 'file') {
    const isOpened = openedFiles.includes(node.name)
    return (
      <div
        onClick={() => onOpen(node)}
        style={{
          paddingLeft: indent + 8,
          paddingTop: 5, paddingBottom: 5,
          fontFamily: 'Share Tech Mono, monospace', fontSize: 11,
          color: isOpened ? '#6a9060' : '#8a8278',
          cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
          borderLeft: isOpened ? '1px solid #2a4020' : '1px solid transparent',
          marginLeft: 1,
        }}
        onMouseEnter={e => e.currentTarget.style.color = '#c8b890'}
        onMouseLeave={e => e.currentTarget.style.color = isOpened ? '#6a9060' : '#8a8278'}
      >
        <span style={{ color: '#4a4840' }}>{isOpened ? '▸' : '·'}</span>
        {node.name}
        {isOpened && <span style={{ color: '#4a6a40', fontSize: 9 }}>✓</span>}
      </div>
    )
  }

  return (
    <div>
      <div
        onClick={() => setExpanded(!expanded)}
        style={{
          paddingLeft: indent + 8,
          paddingTop: 5, paddingBottom: 5,
          fontFamily: 'Share Tech Mono, monospace', fontSize: 11,
          color: '#7a8898', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
        }}
        onMouseEnter={e => e.currentTarget.style.color = '#c8b890'}
        onMouseLeave={e => e.currentTarget.style.color = '#7a8898'}
      >
        <span style={{ color: '#4a6a88' }}>{expanded ? '▾' : '▸'}</span>
        {node.name}{node.type === 'folder' ? '/' : ''}
      </div>
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

export function NavigateNode({ content, onComplete }) {
  const [openedFiles, setOpenedFiles] = useState([])
  const [activeFile, setActiveFile] = useState(null)

  const handleOpen = (file) => {
    setActiveFile(file)
    setOpenedFiles(prev => prev.includes(file.name) ? prev : [...prev, file.name])
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
          fontFamily: 'Share Tech Mono, monospace', fontSize: 9,
          color: '#4a4840', letterSpacing: '0.3em', textTransform: 'uppercase',
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
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {activeFile ? (
          <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
            <div style={{
              fontFamily: 'Share Tech Mono, monospace', fontSize: 9,
              color: '#4a6a88', letterSpacing: '0.3em', textTransform: 'uppercase',
              marginBottom: 12,
            }}>
              {activeFile.name}
            </div>
            <pre style={{
              fontFamily: activeFile.handwritten ? 'Crimson Pro, serif' : 'Share Tech Mono, monospace',
              fontStyle: activeFile.handwritten ? 'italic' : 'normal',
              fontSize: activeFile.handwritten ? 14 : 12,
              color: '#c0b8a8', lineHeight: 1.8,
              whiteSpace: 'pre-wrap', margin: 0,
            }}>
              {activeFile.content}
            </pre>
          </div>
        ) : (
          <div style={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'Share Tech Mono, monospace', fontSize: 11,
            color: '#3a3838', letterSpacing: '0.1em',
          }}>
            Select a file to read
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
              fontFamily: 'Share Tech Mono, monospace', fontSize: 11,
              color: '#7a7060', letterSpacing: '0.05em',
            }}>
              Open: {requiredLeft.map(f => f.split('.')[0]).join(', ')}
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
