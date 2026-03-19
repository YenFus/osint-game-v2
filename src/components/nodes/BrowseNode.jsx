import { useState } from 'react'
import { useDiscoveryFeedback } from '../DiscoveryFeedback'
import { useGameStore } from '../../store/gameStore'
import {
  BUTTON_PRIMARY, BUTTON_FLAG, BUTTON_FLAG_CORRECT, BUTTON_FLAG_WRONG, BUTTON_BACK,
  HEADER_BAR, FEEDBACK_SUCCESS, FEEDBACK_ERROR, COMPLETION_NOTE, FOOTER
} from '../../styles/nodeStyles'

// ── Reddit Profile variant ──────────────────────────────────────────────────
function RedditProfile({ content, onComplete }) {
  const { triggerDiscovery } = useDiscoveryFeedback()
  const { markWrongGuess, activePath } = useGameStore()
  const [tagged, setTagged] = useState([])
  const [feedback, setFeedback] = useState(null)
  const [wrongCount, setWrongCount] = useState(0)
  const [done, setDone] = useState(false)

  const required = new Set(content.requiredTagIds ?? [])

  const handleTag = (post) => {
    if (tagged.includes(post.id)) return
    if (required.has(post.id)) {
      const newTagged = [...tagged, post.id]
      setTagged(newTagged)
      setFeedback({ type: 'correct', text: post.correctFeedback ?? 'Flagged.' })
      const remaining = required.size - newTagged.filter(t => required.has(t)).length
      triggerDiscovery(remaining === 0 ? 'major' : 'minor')
      if (remaining === 0) {
        setTimeout(() => setDone(true), 900)
      }
    } else {
      const newWrongCount = wrongCount + 1
      setWrongCount(newWrongCount)
      setTagged(prev => [...prev, post.id])
      if (activePath) markWrongGuess(activePath)
      const hint = newWrongCount >= 2 && post.hintFeedback
      setFeedback({ type: 'wrong', text: hint ? post.hintFeedback : (post.wrongFeedback ?? 'Normal post. Keep reading.') })
    }
    setTimeout(() => setFeedback(null), 3000)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Reddit-style profile header */}
      <div style={{
        padding: '14px 20px', borderBottom: '1px solid #1a1a28',
        background: '#06060c',
        display: 'flex', gap: 16, alignItems: 'center',
      }}>
        <div style={{
          width: 40, height: 40, borderRadius: '50%',
          background: '#1a1a2a', border: '1px solid #2a2a38',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'Share Tech Mono, monospace', fontSize: 14, color: '#4a6a88',
        }}>
          {content.username?.[0]?.toUpperCase() ?? '?'}
        </div>
        <div>
          <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 12, color: '#9a9890' }}>
            u/{content.username}
          </div>
          <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 9, color: '#4a4840', marginTop: 3 }}>
            {content.karma?.toLocaleString()} karma · joined {content.joinDate}
          </div>
        </div>
        <div style={{ marginLeft: 'auto', fontFamily: 'Share Tech Mono, monospace', fontSize: 9, color: '#3a3830' }}>
          {tagged.filter(t => required.has(t)).length} / {content.requiredTagIds?.length ?? 0} flagged
        </div>
      </div>

      {/* Posts */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {content.posts.map(post => {
          const isTaggedCorrect = tagged.includes(post.id) && required.has(post.id)
          const isTaggedWrong = tagged.includes(post.id) && !required.has(post.id)
          return (
            <div key={post.id} style={{
              padding: '12px 20px', borderBottom: '1px solid #0e0e18',
              borderLeft: isTaggedCorrect ? '2px solid #2a5040' : '2px solid transparent',
              background: isTaggedCorrect ? '#08100c' : 'transparent',
              display: 'flex', gap: 12, alignItems: 'flex-start',
            }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 9, color: '#4a6a88', marginBottom: 4 }}>
                  {post.subreddit} · {post.date}
                </div>
                <p style={{
                  fontFamily: 'Share Tech Mono, monospace', fontSize: 11,
                  color: isTaggedWrong ? '#5a5868' : '#c0b8a8', lineHeight: 1.6, margin: 0,
                }}>
                  {post.text}
                </p>
              </div>
              <button
                onClick={() => handleTag(post)}
                disabled={tagged.includes(post.id)}
                style={{
                  flexShrink: 0,
                  fontFamily: 'Share Tech Mono, monospace', fontSize: 9, letterSpacing: '0.15em',
                  border: isTaggedCorrect ? '1px solid #2a5040' : '1px solid #2a2a38',
                  color: isTaggedCorrect ? '#4a9060' : '#5a5858',
                  background: 'none', padding: '3px 8px',
                  cursor: tagged.includes(post.id) ? 'default' : 'pointer',
                }}>
                {isTaggedCorrect ? '✓' : 'Flag'}
              </button>
            </div>
          )
        })}
      </div>

      {feedback && (
        <div style={{
          padding: '10px 20px', borderTop: '1px solid #1a1a28',
          fontFamily: 'Share Tech Mono, monospace', fontSize: 10,
          color: feedback.type === 'correct' ? '#5a9060' : '#7a4050',
          background: feedback.type === 'correct' ? '#08100c' : '#100808',
        }}>
          {feedback.text}
        </div>
      )}

      {done && (
        <div style={{ padding: '14px 20px', borderTop: '1px solid #1a1a28', background: '#08080c' }}>
          {content.completionNote && (
            <p style={{ fontFamily: 'Crimson Pro, serif', fontStyle: 'italic', fontSize: 13, color: '#7a7268', lineHeight: 1.7, margin: '0 0 12px' }}>
              {content.completionNote}
            </p>
          )}
          <button onClick={onComplete} style={BUTTON_PRIMARY}>
            Continue →
          </button>
        </div>
      )}
    </div>
  )
}

// ── Forum Archive variant ───────────────────────────────────────────────────
function ForumArchive({ content, onComplete }) {
  const { triggerDiscovery } = useDiscoveryFeedback()
  const { markWrongGuess, activePath } = useGameStore()
  const [tagged, setTagged] = useState([])
  const [feedback, setFeedback] = useState(null)
  const [done, setDone] = useState(false)

  const required = new Set(content.requiredTagIds ?? [])

  const handleTag = (post) => {
    if (tagged.includes(post.id)) return
    if (required.has(post.id)) {
      const newTagged = [...tagged, post.id]
      setTagged(newTagged)
      setFeedback({ type: 'correct', text: post.correctFeedback ?? 'Marked.' })
      const remaining = required.size - newTagged.filter(t => required.has(t)).length
      triggerDiscovery(remaining === 0 ? 'major' : 'minor')
      if (remaining === 0) {
        setTimeout(() => setDone(true), 900)
      }
    } else {
      setTagged(prev => [...prev, post.id])
      if (activePath) markWrongGuess(activePath)
      setFeedback({ type: 'wrong', text: post.wrongFeedback ?? 'Nothing unusual here.' })
    }
    setTimeout(() => setFeedback(null), 3000)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Forum header */}
      <div style={{
        padding: '10px 20px', borderBottom: '1px solid #1a1a28',
        fontFamily: 'Share Tech Mono, monospace', fontSize: 9,
        color: '#4a4840', letterSpacing: '0.2em', textTransform: 'uppercase',
        display: 'flex', justifyContent: 'space-between',
      }}>
        <span>{content.forumName ?? 'Forum Archive'}</span>
        <span>{tagged.filter(t => required.has(t)).length} / {content.requiredTagIds?.length ?? 0} flagged</span>
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        {content.posts.map(post => {
          const isTaggedCorrect = tagged.includes(post.id) && required.has(post.id)
          const isTaggedWrong = tagged.includes(post.id) && !required.has(post.id)
          return (
            <div key={post.id} style={{
              padding: '14px 20px', borderBottom: '1px solid #0e0e18',
              borderLeft: isTaggedCorrect ? '2px solid #2a5040' : '2px solid transparent',
              display: 'flex', gap: 12, alignItems: 'flex-start',
            }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', gap: 10, marginBottom: 5, alignItems: 'baseline' }}>
                  <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 10, color: '#5a6a78' }}>
                    {post.username}
                  </span>
                  {post.threadTitle && (
                    <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 9, color: '#3a4048' }}>
                      in: {post.threadTitle}
                    </span>
                  )}
                  <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 9, color: '#2a2a30', marginLeft: 'auto' }}>
                    {post.date}
                  </span>
                </div>
                <p style={{
                  fontFamily: 'Share Tech Mono, monospace', fontSize: 11,
                  color: isTaggedWrong ? '#5a5868' : '#c0b8a8', lineHeight: 1.65, margin: 0,
                }}>
                  {post.text}
                </p>
              </div>
              <button
                onClick={() => handleTag(post)}
                disabled={tagged.includes(post.id)}
                style={{
                  flexShrink: 0,
                  fontFamily: 'Share Tech Mono, monospace', fontSize: 9, letterSpacing: '0.15em',
                  border: isTaggedCorrect ? '1px solid #2a5040' : '1px solid #2a2a38',
                  color: isTaggedCorrect ? '#4a9060' : '#5a5858',
                  background: 'none', padding: '3px 8px',
                  cursor: tagged.includes(post.id) ? 'default' : 'pointer',
                }}>
                {isTaggedCorrect ? '✓' : 'Flag'}
              </button>
            </div>
          )
        })}
      </div>

      {feedback && (
        <div style={{
          padding: '10px 20px', borderTop: '1px solid #1a1a28',
          fontFamily: 'Share Tech Mono, monospace', fontSize: 10,
          color: feedback.type === 'correct' ? '#5a9060' : '#7a4050',
          background: feedback.type === 'correct' ? '#08100c' : '#100808',
        }}>
          {feedback.text}
        </div>
      )}

      {done && (
        <div style={{ padding: '14px 20px', borderTop: '1px solid #1a1a28', background: '#08080c' }}>
          {content.completionNote && (
            <p style={{ fontFamily: 'Crimson Pro, serif', fontStyle: 'italic', fontSize: 13, color: '#7a7268', lineHeight: 1.7, margin: '0 0 12px' }}>
              {content.completionNote}
            </p>
          )}
          <button onClick={onComplete} style={BUTTON_PRIMARY}>
            Continue →
          </button>
        </div>
      )}
    </div>
  )
}

// ── Flickr Albums variant ───────────────────────────────────────────────────
function FlickrAlbums({ content, onComplete }) {
  const { triggerDiscovery } = useDiscoveryFeedback()
  const { markWrongGuess, activePath } = useGameStore()
  const [activeAlbum, setActiveAlbum] = useState(null)
  const [activePhoto, setActivePhoto] = useState(null)
  const [tagged, setTagged] = useState([])
  const [done, setDone] = useState(false)
  const [feedback, setFeedback] = useState(null)

  const required = new Set(content.requiredPhotoIds ?? [])

  const handleTagPhoto = (photo) => {
    if (tagged.includes(photo.id)) return
    if (required.has(photo.id)) {
      const newTagged = [...tagged, photo.id]
      setTagged(newTagged)
      setFeedback({ type: 'correct', text: photo.correctFeedback ?? 'Photo flagged.' })
      const remaining = required.size - newTagged.filter(t => required.has(t)).length
      triggerDiscovery(remaining === 0 ? 'major' : 'minor')
      if (remaining === 0) {
        setTimeout(() => setDone(true), 900)
      }
    } else {
      setTagged(prev => [...prev, photo.id])
      if (activePath) markWrongGuess(activePath)
      setFeedback({ type: 'wrong', text: photo.wrongFeedback ?? 'No unusual metadata here.' })
    }
    setTimeout(() => setFeedback(null), 3000)
  }

  if (activePhoto) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div style={{
          padding: '8px 20px', borderBottom: '1px solid #1a1a28',
          display: 'flex', gap: 12, alignItems: 'center',
        }}>
          <button onClick={() => setActivePhoto(null)} style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 9, color: '#5a5858', background: 'none', border: 'none', cursor: 'pointer', letterSpacing: '0.15em' }}>
            ← Back
          </button>
          <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 9, color: '#3a3a48', letterSpacing: '0.15em' }}>
            {activePhoto.filename}
          </span>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Photo preview area — displays filename as simulated image */}
          <div style={{
            height: 180, background: '#0c0c16', border: '1px solid #1a1a28',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'Share Tech Mono, monospace', fontSize: 9, color: '#2a2a38',
          }}>
            [{activePhoto.filename}]
          </div>
          {/* EXIF data */}
          {activePhoto.exif && (
            <div>
              <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 9, color: '#4a6a88', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 10 }}>
                Metadata
              </div>
              {Object.entries(activePhoto.exif).map(([k, v]) => (
                <div key={k} style={{ display: 'flex', gap: 12, fontFamily: 'Share Tech Mono, monospace', fontSize: 10, marginBottom: 5 }}>
                  <span style={{ color: '#4a4848', width: 120, flexShrink: 0 }}>{k}</span>
                  <span style={{ color: '#9a9088' }}>{v}</span>
                </div>
              ))}
            </div>
          )}
          {activePhoto.caption && (
            <p style={{ fontFamily: 'Crimson Pro, serif', fontStyle: 'italic', fontSize: 13, color: '#7a7268', lineHeight: 1.7, margin: 0 }}>
              {activePhoto.caption}
            </p>
          )}
          <button
            onClick={() => handleTagPhoto(activePhoto)}
            disabled={tagged.includes(activePhoto.id)}
            style={{
              alignSelf: 'flex-start',
              fontFamily: 'Share Tech Mono, monospace', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase',
              border: tagged.includes(activePhoto.id) && required.has(activePhoto.id) ? '1px solid #2a5040' : '1px solid #2a2a38',
              color: tagged.includes(activePhoto.id) && required.has(activePhoto.id) ? '#4a9060' : '#5a5858',
              background: 'none', padding: '6px 14px', cursor: tagged.includes(activePhoto.id) ? 'default' : 'pointer',
            }}
          >
            {tagged.includes(activePhoto.id) && required.has(activePhoto.id) ? '✓ Flagged' : 'Flag this photo'}
          </button>
          {feedback && (
            <div style={{
              padding: '10px 14px', fontFamily: 'Share Tech Mono, monospace', fontSize: 10,
              color: feedback.type === 'correct' ? '#5a9060' : '#7a4050',
              background: feedback.type === 'correct' ? '#08100c' : '#100808',
              border: `1px solid ${feedback.type === 'correct' ? '#1a3028' : '#3a1a1a'}`,
            }}>
              {feedback.text}
            </div>
          )}
        </div>
        {done && (
          <div style={{ padding: '14px 20px', borderTop: '1px solid #1a1a28', background: '#08080c' }}>
            {content.completionNote && (
              <p style={{ fontFamily: 'Crimson Pro, serif', fontStyle: 'italic', fontSize: 13, color: '#7a7268', lineHeight: 1.7, margin: '0 0 12px' }}>
                {content.completionNote}
              </p>
            )}
            <button onClick={onComplete} style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase', border: '1px solid #2a4060', color: '#4a90d9', background: 'none', padding: '8px 18px', cursor: 'pointer' }}>
              Continue →
            </button>
          </div>
        )}
      </div>
    )
  }

  if (activeAlbum) {
    const album = content.albums.find(a => a.id === activeAlbum)
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div style={{ padding: '8px 20px', borderBottom: '1px solid #1a1a28', display: 'flex', gap: 12, alignItems: 'center' }}>
          <button onClick={() => setActiveAlbum(null)} style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 9, color: '#5a5858', background: 'none', border: 'none', cursor: 'pointer', letterSpacing: '0.15em' }}>← Albums</button>
          <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 9, color: '#3a3a48', letterSpacing: '0.15em' }}>{album.name}</span>
          <span style={{ marginLeft: 'auto', fontFamily: 'Share Tech Mono, monospace', fontSize: 9, color: '#2a2a38' }}>{tagged.filter(t => required.has(t)).length}/{content.requiredPhotoIds?.length} flagged</span>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px 20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
            {album.photos.map(photo => {
              const isTaggedCorrect = tagged.includes(photo.id) && required.has(photo.id)
              return (
                <div
                  key={photo.id}
                  onClick={() => setActivePhoto(photo)}
                  style={{
                    height: 100, background: '#0c0c16', border: `1px solid ${isTaggedCorrect ? '#2a5040' : '#1a1a28'}`,
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexDirection: 'column', gap: 4,
                    position: 'relative',
                  }}
                >
                  <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 8, color: '#2a2a38' }}>{photo.filename}</span>
                  {isTaggedCorrect && (
                    <div style={{ position: 'absolute', top: 4, right: 4, fontFamily: 'Share Tech Mono, monospace', fontSize: 8, color: '#4a9060' }}>✓</div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
        {done && (
          <div style={{ padding: '14px 20px', borderTop: '1px solid #1a1a28', background: '#08080c' }}>
            {content.completionNote && (<p style={{ fontFamily: 'Crimson Pro, serif', fontStyle: 'italic', fontSize: 13, color: '#7a7268', lineHeight: 1.7, margin: '0 0 12px' }}>{content.completionNote}</p>)}
            <button onClick={onComplete} style={BUTTON_PRIMARY}>Continue →</button>
          </div>
        )}
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ padding: '10px 20px', borderBottom: '1px solid #1a1a28', fontFamily: 'Share Tech Mono, monospace', fontSize: 9, color: '#4a6a88', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
        Flickr — {content.username}
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {content.albums.map(album => (
          <div key={album.id} onClick={() => setActiveAlbum(album.id)} style={{
            padding: '12px 16px', border: '1px solid #1a1a28', cursor: 'pointer',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            fontFamily: 'Share Tech Mono, monospace',
          }}>
            <span style={{ fontSize: 11, color: '#8a8890' }}>{album.name}</span>
            <span style={{ fontSize: 9, color: '#3a3830' }}>{album.photos.length} photos →</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Gmail variant ───────────────────────────────────────────────────────────
function GmailClient({ content, onComplete, onCinematicTrigger }) {
  const { triggerDiscovery } = useDiscoveryFeedback()
  const [activeFolder, setActiveFolder] = useState(content.folders?.[0]?.name ?? 'Inbox')
  const [activeEmail, setActiveEmail] = useState(null)
  const [readEmails, setReadEmails] = useState([])
  const [done, setDone] = useState(false)

  const folder = content.folders.find(f => f.name === activeFolder)

  const handleOpen = (email) => {
    setActiveEmail(email)
    if (!readEmails.includes(email.subject)) {
      const newRead = [...readEmails, email.subject]
      setReadEmails(newRead)
      if (email.isTarget) {
        triggerDiscovery('major')
        setTimeout(() => {
          if (email.triggersCinematic && onCinematicTrigger) {
            onCinematicTrigger()
          } else {
            setDone(true)
          }
        }, 800)
      }
      if (email.isJournalistClue && content.onJournalistUnlock) {
        content.onJournalistUnlock()
      }
    }
  }

  if (activeEmail) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div style={{ padding: '8px 20px', borderBottom: '1px solid #1a1a28', display: 'flex', gap: 12, alignItems: 'center' }}>
          <button onClick={() => setActiveEmail(null)} style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 9, color: '#5a5858', background: 'none', border: 'none', cursor: 'pointer', letterSpacing: '0.15em' }}>← {activeFolder}</button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 12, color: '#c0b8a8', marginBottom: 8 }}>{activeEmail.subject}</div>
            {activeEmail.from && <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 9, color: '#4a4840', marginBottom: 4 }}>From: {activeEmail.from}</div>}
            {activeEmail.to && <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 9, color: '#4a4840', marginBottom: 4 }}>To: {activeEmail.to}</div>}
            {activeEmail.date && <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 9, color: '#3a3830', marginBottom: 12 }}>{activeEmail.date}</div>}
          </div>
          <pre style={{
            fontFamily: activeEmail.handwritten ? 'Crimson Pro, serif' : 'Share Tech Mono, monospace',
            fontStyle: activeEmail.handwritten ? 'italic' : 'normal',
            fontSize: activeEmail.handwritten ? 14 : 11,
            color: '#a0988a', lineHeight: 1.8, whiteSpace: 'pre-wrap', margin: 0,
          }}>
            {activeEmail.body}
          </pre>
        </div>
        {done && (
          <div style={{ padding: '14px 20px', borderTop: '1px solid #1a1a28', background: '#08080c' }}>
            {content.completionNote && (<p style={{ fontFamily: 'Crimson Pro, serif', fontStyle: 'italic', fontSize: 13, color: '#7a7268', lineHeight: 1.7, margin: '0 0 12px' }}>{content.completionNote}</p>)}
            <button onClick={onComplete} style={BUTTON_PRIMARY}>Continue →</button>
          </div>
        )}
      </div>
    )
  }

  // NEW FEATURE: Mobile-friendly Gmail layout
  return (
    <div className="gmail-layout" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Folder tabs - horizontal on mobile */}
      <div className="gmail-sidebar" style={{
        display: 'flex', flexWrap: 'wrap', gap: 6,
        borderBottom: '1px solid #1a1a28', background: '#06060c', padding: '10px 16px',
      }}>
        {content.folders.map(f => (
          <button
            key={f.name}
            onClick={() => setActiveFolder(f.name)}
            className="gmail-folder"
            style={{
              padding: '10px 16px', cursor: 'pointer',
              fontFamily: 'Share Tech Mono, monospace', fontSize: 13,
              color: activeFolder === f.name ? '#a0b0d8' : '#7a7888',
              background: activeFolder === f.name ? '#1a1a28' : 'transparent',
              border: activeFolder === f.name ? '1px solid #3a4080' : '1px solid #2a2a38',
              borderRadius: 4,
              minHeight: 44,
            }}
          >
            {f.name}
          </button>
        ))}
      </div>

      {/* Email list header */}
      <div style={{ padding: '10px 16px', borderBottom: '1px solid #1a1a28', fontFamily: 'Share Tech Mono, monospace', fontSize: 12, color: '#6a6868', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
        {activeFolder} · {folder?.emails?.length ?? 0} messages
      </div>

      {/* Email list */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {folder?.emails?.map((email, i) => {
          const isRead = readEmails.includes(email.subject)
          return (
            <button
              key={i}
              onClick={() => handleOpen(email)}
              style={{
                width: '100%', textAlign: 'left',
                padding: '14px 16px', borderBottom: '1px solid #0e0e18',
                cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 5,
                background: 'transparent',
                opacity: isRead ? 0.6 : 1,
                border: 'none',
                minHeight: 44,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 13, color: isRead ? '#5a5868' : '#a0a0b8' }}>
                  {email.from ?? email.to ?? '(draft)'}
                </span>
                <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 11, color: '#4a4a58' }}>
                  {email.date}
                </span>
              </div>
              <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 14, color: isRead ? '#5a5868' : '#9a9aa8' }}>
                {email.subject}
              </div>
              <div style={{ fontFamily: 'Crimson Pro, serif', fontSize: 13, color: '#5a5a68', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                {email.preview}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ── Generic Records/Search variant ─────────────────────────────────────────
function RecordsViewer({ content, onComplete }) {
  const { triggerDiscovery } = useDiscoveryFeedback()
  const { markWrongGuess, activePath } = useGameStore()
  const [activeRecord, setActiveRecord] = useState(null)
  const [tagged, setTagged] = useState([])
  const [done, setDone] = useState(false)
  const [feedback, setFeedback] = useState(null)

  const required = new Set(content.requiredTagIds ?? [])

  const handleTag = (item) => {
    if (tagged.includes(item.id)) return
    if (required.has(item.id)) {
      const newTagged = [...tagged, item.id]
      setTagged(newTagged)
      setFeedback({ type: 'correct', text: item.correctFeedback ?? 'Noted.' })
      const remaining = required.size - newTagged.filter(t => required.has(t)).length
      triggerDiscovery(remaining === 0 ? 'major' : 'minor')
      if (remaining === 0) {
        setTimeout(() => setDone(true), 900)
      }
    } else {
      setTagged(prev => [...prev, item.id])
      if (activePath) markWrongGuess(activePath)
      setFeedback({ type: 'wrong', text: item.wrongFeedback ?? 'Not relevant to the investigation.' })
    }
    setTimeout(() => setFeedback(null), 3000)
  }

  if (activeRecord) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div style={{ padding: '8px 20px', borderBottom: '1px solid #1a1a28', display: 'flex', gap: 12, alignItems: 'center' }}>
          <button onClick={() => setActiveRecord(null)} style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 9, color: '#5a5858', background: 'none', border: 'none', cursor: 'pointer', letterSpacing: '0.15em' }}>← Results</button>
          <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 9, color: '#3a3a48', letterSpacing: '0.15em' }}>{activeRecord.title}</span>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          {activeRecord.fields && Object.entries(activeRecord.fields).map(([k, v]) => (
            <div key={k} style={{ display: 'flex', gap: 16, fontFamily: 'Share Tech Mono, monospace' }}>
              <span style={{ fontSize: 9, color: '#4a4848', width: 140, flexShrink: 0, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{k}</span>
              <span style={{ fontSize: 11, color: '#9a9088', lineHeight: 1.6 }}>{v}</span>
            </div>
          ))}
          {activeRecord.body && (
            <pre style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 11, color: '#9a9088', lineHeight: 1.7, whiteSpace: 'pre-wrap', margin: 0 }}>
              {activeRecord.body}
            </pre>
          )}
          {activeRecord.taggable && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
              <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 9, color: '#4a6a88', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                Tag relevant facts:
              </div>
              {activeRecord.taggable.map(item => {
                const isTaggedCorrect = tagged.includes(item.id) && required.has(item.id)
                const isTaggedWrong = tagged.includes(item.id) && !required.has(item.id)
                return (
                  <div key={item.id} style={{
                    display: 'flex', gap: 12, alignItems: 'flex-start',
                    padding: '10px 12px', border: isTaggedCorrect ? '1px solid #2a5040' : '1px solid #1a1a28',
                    background: isTaggedCorrect ? '#08100c' : 'transparent',
                  }}>
                    <p style={{ flex: 1, fontFamily: 'Share Tech Mono, monospace', fontSize: 11, color: isTaggedWrong ? '#3a3848' : '#9a9288', lineHeight: 1.6, margin: 0 }}>
                      {item.text}
                    </p>
                    <button
                      onClick={() => handleTag(item)}
                      disabled={tagged.includes(item.id)}
                      style={{
                        flexShrink: 0, fontFamily: 'Share Tech Mono, monospace', fontSize: 9, letterSpacing: '0.15em',
                        border: isTaggedCorrect ? '1px solid #2a5040' : '1px solid #2a2a38',
                        color: isTaggedCorrect ? '#4a9060' : '#5a5858',
                        background: 'none', padding: '3px 8px',
                        cursor: tagged.includes(item.id) ? 'default' : 'pointer',
                      }}
                    >
                      {isTaggedCorrect ? '✓' : 'Flag'}
                    </button>
                  </div>
                )
              })}
            </div>
          )}
          {feedback && (
            <div style={{ padding: '10px 14px', fontFamily: 'Share Tech Mono, monospace', fontSize: 10, color: feedback.type === 'correct' ? '#5a9060' : '#7a4050', background: feedback.type === 'correct' ? '#08100c' : '#100808', border: `1px solid ${feedback.type === 'correct' ? '#1a3028' : '#3a1a1a'}` }}>
              {feedback.text}
            </div>
          )}
        </div>
        {done && (
          <div style={{ padding: '14px 20px', borderTop: '1px solid #1a1a28', background: '#08080c' }}>
            {content.completionNote && (<p style={{ fontFamily: 'Crimson Pro, serif', fontStyle: 'italic', fontSize: 13, color: '#7a7268', lineHeight: 1.7, margin: '0 0 12px' }}>{content.completionNote}</p>)}
            <button onClick={onComplete} style={BUTTON_PRIMARY}>Continue →</button>
          </div>
        )}
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ padding: '10px 20px', borderBottom: '1px solid #1a1a28', fontFamily: 'Share Tech Mono, monospace', fontSize: 9, color: '#4a6a88', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
        {content.systemName ?? 'Records Search'} · {content.records?.length ?? 0} results
      </div>
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {content.records?.map((record, i) => (
          <div key={i} onClick={() => setActiveRecord(record)} style={{
            padding: '12px 20px', borderBottom: '1px solid #0e0e18',
            cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 4,
          }}>
            <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 11, color: '#8a90a8' }}>{record.title}</span>
            {record.summary && <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 9, color: '#4a4a58' }}>{record.summary}</span>}
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Dispatcher ──────────────────────────────────────────────────────────────
const VARIANTS = {
  'reddit-profile': RedditProfile,
  'forum': ForumArchive,
  'flickr': FlickrAlbums,
  'gmail': GmailClient,
  'records': RecordsViewer,
  'news-archive': RecordsViewer,
  'court': RecordsViewer,
  'search': RecordsViewer,
}

export function BrowseNode({ content, onComplete, onJournalistUnlock, onCinematicTrigger }) {
  const Variant = VARIANTS[content.variant] ?? RecordsViewer
  return (
    <Variant
      content={content}
      onComplete={onComplete}
      onJournalistUnlock={onJournalistUnlock}
      onCinematicTrigger={onCinematicTrigger}
    />
  )
}
