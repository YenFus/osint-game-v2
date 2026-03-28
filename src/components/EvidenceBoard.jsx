import { useState, useRef } from 'react'
import { useGameStore } from '../store/gameStore'

const PATH_META = {
  A: { label: 'Digital Trail', color: '#4a90d9' },
  B: { label: 'Private Notes', color: '#c0392b' },
  C: { label: 'Public Record', color: '#d4a017' },
}

export function EvidenceBoard() {
  const [isOpen, setIsOpen] = useState(false)
  const evidence = useGameStore(s => s.evidence)
  const updateEvidencePosition = useGameStore(s => s.updateEvidencePosition)
  
  const [draggingId, setDraggingId] = useState(null)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const boardRef = useRef(null)

  const handlePointerDown = (e, item) => {
    setDraggingId(item.id)
    const rect = e.currentTarget.getBoundingClientRect()
    // Calculate click offset relative to the card's top-left
    setOffset({ x: e.clientX - rect.left, y: e.clientY - rect.top })
    e.target.setPointerCapture(e.pointerId)
  }

  const handlePointerMove = (e) => {
    if (!draggingId || !boardRef.current) return
    const boardRect = boardRef.current.getBoundingClientRect()
    
    // Calculate new position
    let newX = e.clientX - boardRect.left - offset.x
    let newY = e.clientY - boardRect.top - offset.y
    
    // Clamp to board bounds
    newX = Math.max(0, Math.min(newX, boardRect.width - 250))
    newY = Math.max(0, Math.min(newY, boardRect.height - 150))
    
    updateEvidencePosition(draggingId, newX, newY)
  }

  const handlePointerUp = (e) => {
    if (!draggingId) return
    e.target.releasePointerCapture(e.pointerId)
    setDraggingId(null)
  }

  if (!isOpen) {
    const hasEvidence = evidence.length > 0
    return (
      <button
        className={`fixed bottom-6 left-6 z-40 font-mono text-sm px-4 py-3 border-2 transition-all flex items-center gap-3 ${hasEvidence ? 'cursor-pointer hover:bg-[#1a1505] backdrop-blur-sm' : 'opacity-50 hover:opacity-100 bg-[#0a0a0e] hover:bg-[#1a1a28]'}`}
        style={{
          borderColor: hasEvidence ? '#b8860b' : '#3a3a48', color: hasEvidence ? '#d4a84b' : '#6a6a78', 
          background: hasEvidence ? 'rgba(20, 15, 5, 0.85)' : undefined,
          boxShadow: hasEvidence ? '0 4px 12px rgba(0,0,0,0.5)' : 'none'
        }}
        onClick={() => setIsOpen(true)}
      >
        <span className={`flex items-center justify-center rounded-full w-5 h-5 text-[10px] font-bold ${hasEvidence ? 'bg-[#c0392b] text-white' : 'bg-[#2a2a38] text-[#5a5a68]'}`}>
          {evidence.length}
        </span>
        Evidence Board
      </button>
    )
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#08080e] overflow-hidden flex flex-col crt">
      {/* Header */}
      <div className="shrink-0 p-4 border-b border-[#1a1a28] flex justify-between items-center bg-[#050508] relative z-10">
        <div>
           <div className="font-mono text-[10px] text-[#8a6040] tracking-[0.3em] uppercase mb-1">
             Maya's Investigation
           </div>
           <h2 className="font-serif text-2xl text-[#e8dcc8] tracking-widest uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
             Evidence Board
           </h2>
        </div>
        <button 
          onClick={() => setIsOpen(false)} 
          className="px-4 py-2 border border-[#3a3a48] text-[#a0a098] font-mono text-sm hover:bg-[#1a1a28] hover:text-white transition-all uppercase tracking-wider"
        >
          Close Board
        </button>
      </div>
      
      {/* Canvas */}
      <div 
        ref={boardRef}
        className="flex-1 relative bg-opacity-20 select-none overflow-hidden touch-none"
        style={{
          backgroundImage: 'radial-gradient(#2a2a38 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}
        onPointerMove={handlePointerMove}
      >
         {evidence.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center font-mono text-sm text-[#4a4040]">
              No evidence collected yet.
            </div>
         )}

         {/* Draggable Evidence Cards */}
         {evidence.map(item => {
           const meta = PATH_META[item.path] || { color: '#888' }
           return (
             <div
               key={item.id}
               className="absolute w-64 p-4 border active:cursor-grabbing backdrop-blur-md transition-shadow"
               style={{
                 left: item.x ?? 100, 
                 top: item.y ?? 100,
                 borderColor: meta.color,
                 background: 'rgba(12, 12, 16, 0.95)',
                 boxShadow: draggingId === item.id 
                    ? `0 0 20px ${meta.color}40, 0 10px 30px rgba(0,0,0,0.8)` 
                    : '0 4px 12px rgba(0,0,0,0.5)',
                 zIndex: draggingId === item.id ? 50 : 10,
                 cursor: draggingId === item.id ? 'grabbing' : 'grab'
               }}
               onPointerDown={(e) => handlePointerDown(e, item)}
               onPointerUp={handlePointerUp}
               onPointerCancel={handlePointerUp}
             >
                <div className="flex justify-between items-start mb-2 border-b pb-2" style={{ borderColor: `${meta.color}30` }}>
                  <div className="text-[10px] font-mono tracking-widest uppercase leading-tight pr-2" style={{ color: meta.color }}>
                    {item.title}
                  </div>
                  {item.timestamp && (
                    <div className="text-[9px] font-mono text-[#5a5a68] shrink-0">
                      {item.timestamp}
                    </div>
                  )}
                </div>
                
                <div className="text-xs font-serif leading-relaxed text-[#d8d0c0] pointer-events-none mb-3 line-clamp-6">
                  {item.text}
                </div>
                
                {item.source && (
                  <div className="text-[9px] font-mono text-[#6a6a78] uppercase pointer-events-none">
                    SRC // {item.source}
                  </div>
                )}
                
                {/* Visual Pin */}
                <div 
                  className="absolute top-2 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full shadow-md"
                  style={{ background: meta.color, boxShadow: `0 2px 4px rgba(0,0,0,0.5), inset 0 1px 2px rgba(255,255,255,0.3)` }}
                />
             </div>
           )
         })}
      </div>
      
      {/* Footer Info */}
      <div className="shrink-0 p-3 bg-[#0a0a12] border-t border-[#1a1a28] flex justify-between items-center text-[#5a5048] font-mono text-xs">
         <span>DRAG CARDS TO ORGANIZE LEADS</span>
         <span>{evidence.length} CLUES COMPILED</span>
      </div>
    </div>
  )
}
