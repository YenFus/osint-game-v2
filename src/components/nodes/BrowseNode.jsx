import { useState } from 'react'
import { useDiscoveryFeedback } from '../discoveryContext'
import { EvidenceMap } from '../board/EvidenceMap'
import { useLeadProgress } from '../../hooks/useLeadProgress'
import { useGameStore } from '../../store/gameStore'
import { wrongCost } from '../../data/caseData'
import { BUTTON_PRIMARY } from '../../styles/nodeStyles'
import { plateSrc } from '../../data/photoPlates'

function PhotoThumb({ filename, height }) {
  const src = plateSrc(filename)
  return (
    <div style={{ height, background: '#111', overflow: 'hidden', border: '6px solid #e8e0cc', borderBottomWidth: 14 }}>
      {src && (
        <img src={src} alt=""
          style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'saturate(0.85) brightness(0.92)' }} />
      )}
    </div>
  )
}

// ── Reddit Profile variant ──────────────────────────────────────────────────
function RedditProfile({ content, onComplete, nodeId }) {
  const { triggerDiscovery } = useDiscoveryFeedback()
  const { markWrongGuess, activePath } = useGameStore()
  const [tagged, setTagged] = useLeadProgress(nodeId, 'tagged', [])
  const [feedback, setFeedback] = useState(null)
  const [wrongCount, setWrongCount] = useLeadProgress(nodeId, 'wrong', 0)
  const required = new Set(content.requiredTagIds ?? [])
  const [done, setDone] = useState(() => [...required].every(t => tagged.includes(t)))

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
      if (activePath) markWrongGuess(activePath, newWrongCount)
      const hint = newWrongCount >= 2 && post.hintFeedback
      const body = hint ? post.hintFeedback : (post.wrongFeedback ?? 'Normal post. Keep reading.')
      setFeedback({ type: 'wrong', text: `${body} (+${wrongCost(newWrongCount)} min)` })
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
          <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 12, color: '#7e7a6d', marginTop: 3 }}>
            {content.karma?.toLocaleString()} karma · joined {content.joinDate}
          </div>
        </div>
        <div style={{ marginLeft: 'auto', fontFamily: 'Share Tech Mono, monospace', fontSize: 12, color: '#3a3830' }}>
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
                <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 12, color: '#7aa0c8', marginBottom: 5 }}>
                  {post.subreddit} · {post.date}
                </div>
                <p style={{
                  fontFamily: 'Share Tech Mono, monospace', fontSize: 13.5,
                  color: isTaggedWrong ? '#6a6878' : '#d8cfbf', lineHeight: 1.65, margin: 0,
                }}>
                  {post.text}
                </p>
              </div>
              <button
                onClick={() => handleTag(post)}
                disabled={tagged.includes(post.id)}
                style={{
                  flexShrink: 0,
                  fontFamily: 'Share Tech Mono, monospace', fontSize: 12, letterSpacing: '0.15em',
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
          fontFamily: 'Share Tech Mono, monospace', fontSize: 13,
          color: feedback.type === 'correct' ? '#7ac090' : feedback.type === 'info' ? '#d0c4a8' : '#e08a90',
          background: feedback.type === 'correct' ? '#08100c' : feedback.type === 'info' ? '#12121a' : '#160a0c',
        }}>
          {feedback.text}
        </div>
      )}

      {done && (
        <div style={{ padding: '14px 20px 80px', borderTop: '1px solid #1a1a28', background: '#08080c', flexShrink: 0 }}>
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
function ForumArchive({ content, onComplete, nodeId }) {
  const { triggerDiscovery } = useDiscoveryFeedback()
  const { markWrongGuess, activePath } = useGameStore()
  const [tagged, setTagged] = useLeadProgress(nodeId, 'tagged', [])
  const [wrongCount, setWrongCount] = useLeadProgress(nodeId, 'wrong', 0)
  const [feedback, setFeedback] = useState(null)
  const required = new Set(content.requiredTagIds ?? [])
  const [done, setDone] = useState(() => [...required].every(t => tagged.includes(t)))

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
      setWrongCount(wrongCount + 1)
      if (activePath) markWrongGuess(activePath, wrongCount + 1)
      setFeedback({ type: 'wrong', text: `${post.wrongFeedback ?? 'Nothing unusual here.'} (+${wrongCost(wrongCount + 1)} min)` })
    }
    setTimeout(() => setFeedback(null), 3000)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Forum header */}
      <div style={{
        padding: '10px 20px', borderBottom: '1px solid #1a1a28',
        fontFamily: 'Share Tech Mono, monospace', fontSize: 12,
        color: '#7e7a6d', letterSpacing: '0.2em', textTransform: 'uppercase',
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
                  <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 12, color: '#5a6a78' }}>
                    {post.username}
                  </span>
                  {post.threadTitle && (
                    <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 12, color: '#3a4048' }}>
                      in: {post.threadTitle}
                    </span>
                  )}
                  <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 12, color: '#2a2a30', marginLeft: 'auto' }}>
                    {post.date}
                  </span>
                </div>
                <p style={{
                  fontFamily: 'Share Tech Mono, monospace', fontSize: 13.5,
                  color: isTaggedWrong ? '#6a6878' : '#d8cfbf', lineHeight: 1.7, margin: 0,
                }}>
                  {post.text}
                </p>
              </div>
              <button
                onClick={() => handleTag(post)}
                disabled={tagged.includes(post.id)}
                style={{
                  flexShrink: 0,
                  fontFamily: 'Share Tech Mono, monospace', fontSize: 12, letterSpacing: '0.15em',
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
          fontFamily: 'Share Tech Mono, monospace', fontSize: 13,
          color: feedback.type === 'correct' ? '#7ac090' : feedback.type === 'info' ? '#d0c4a8' : '#e08a90',
          background: feedback.type === 'correct' ? '#08100c' : feedback.type === 'info' ? '#12121a' : '#160a0c',
        }}>
          {feedback.text}
        </div>
      )}

      {done && (
        <div style={{ padding: '14px 20px 80px', borderTop: '1px solid #1a1a28', background: '#08080c', flexShrink: 0 }}>
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
function FlickrAlbums({ content, onComplete, nodeId }) {
  const { triggerDiscovery } = useDiscoveryFeedback()
  const { markWrongGuess, activePath } = useGameStore()
  const [activeAlbum, setActiveAlbum] = useState(null)
  const [activePhoto, setActivePhoto] = useState(null)
  const [tagged, setTagged] = useLeadProgress(nodeId, 'tagged', [])
  const [wrongCount, setWrongCount] = useLeadProgress(nodeId, 'wrong', 0)
  const required = new Set(content.requiredPhotoIds ?? [])
  const [done, setDone] = useState(() => [...required].every(t => tagged.includes(t)))
  const [feedback, setFeedback] = useState(null)

  const handleTagPhoto = (photo) => {
    if (tagged.includes(photo.id)) return
    if (photo.neutral) {
      setTagged(prev => prev.includes(photo.id) ? prev : [...prev, photo.id])
      setFeedback({ type: 'info', text: photo.wrongFeedback ?? 'Noted. No time lost.' })
      setTimeout(() => setFeedback(null), 3200)
      return
    }
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
      setWrongCount(wrongCount + 1)
      if (activePath) markWrongGuess(activePath, wrongCount + 1)
      setFeedback({ type: 'wrong', text: `${photo.wrongFeedback ?? 'No unusual metadata here.'} (+${wrongCost(wrongCount + 1)} min)` })
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
          <button onClick={() => { setFeedback(null); setActivePhoto(null) }} style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 12, color: '#5a5858', background: 'none', border: 'none', cursor: 'pointer', letterSpacing: '0.15em' }}>
            ← Back
          </button>
          <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 12, color: '#3a3a48', letterSpacing: '0.15em' }}>
            {activePhoto.filename}
          </span>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Photo preview area — displays filename as simulated image */}
          {/* the photo, and where its metadata says it was taken */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'stretch' }}>
            <div style={{ flex: '1 1 300px', maxWidth: 420 }}>
              <PhotoThumb filename={activePhoto.filename} height={220} />
            </div>
            {activePhoto.place && (
              <div style={{ flex: '1 1 300px', minWidth: 260 }}>
                <EvidenceMap
                  place={activePhoto.place}
                  /* only confirmed flags drop a pin — a wrong flag shouldn't
                     draw the map's conclusion for you */
                  flagged={content.albums.flatMap(a => a.photos)
                    .filter(p => tagged.includes(p.id) && required.has(p.id)).map(p => p.place)}
                  height={220}
                />
              </div>
            )}
          </div>
          {/* metadata, as chips you scan rather than a list you read */}
          {activePhoto.exif && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {Object.entries(activePhoto.exif).map(([k, v]) => (
                <span key={k} style={{
                  fontFamily: 'Share Tech Mono, monospace', fontSize: 12, lineHeight: 1.35,
                  border: '1px solid #2a3a4a', background: '#0c1219', padding: '5px 10px', color: '#e4dac8',
                }}>
                  <span style={{ color: '#7aa0c8' }}>{k}:</span> {v}
                </span>
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
              fontFamily: 'Share Tech Mono, monospace', fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase',
              border: tagged.includes(activePhoto.id) && required.has(activePhoto.id) ? '1px solid #2a5040' : '1px solid #2a2a38',
              color: tagged.includes(activePhoto.id) && required.has(activePhoto.id) ? '#4a9060' : '#5a5858',
              background: 'none', padding: '6px 14px', cursor: tagged.includes(activePhoto.id) ? 'default' : 'pointer',
            }}
          >
            {tagged.includes(activePhoto.id) && required.has(activePhoto.id) ? '✓ Flagged' : 'Flag this photo'}
          </button>
          {feedback && (
            <div style={{
              padding: '10px 14px', fontFamily: 'Share Tech Mono, monospace', fontSize: 12,
              color: feedback.type === 'correct' ? '#7ac090' : feedback.type === 'info' ? '#d0c4a8' : '#e08a90',
              background: feedback.type === 'correct' ? '#08100c' : feedback.type === 'info' ? '#12121a' : '#160a0c',
              border: `1px solid ${feedback.type === 'correct' ? '#2a5040' : feedback.type === 'info' ? '#3a3a48' : '#5a2a2a'}`,
            }}>
              {feedback.text}
            </div>
          )}
        </div>
        {done && (
          <div style={{ padding: '14px 20px 80px', borderTop: '1px solid #1a1a28', background: '#08080c', flexShrink: 0 }}>
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

  if (activeAlbum) {
    const album = content.albums.find(a => a.id === activeAlbum)
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div style={{ padding: '8px 20px', borderBottom: '1px solid #1a1a28', display: 'flex', gap: 12, alignItems: 'center' }}>
          <button onClick={() => setActiveAlbum(null)} style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 12, color: '#5a5858', background: 'none', border: 'none', cursor: 'pointer', letterSpacing: '0.15em' }}>← Albums</button>
          <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 12, color: '#3a3a48', letterSpacing: '0.15em' }}>{album.name}</span>
          <span style={{ marginLeft: 'auto', fontFamily: 'Share Tech Mono, monospace', fontSize: 12, color: '#2a2a38' }}>{tagged.filter(t => required.has(t)).length}/{content.requiredPhotoIds?.length} flagged</span>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px 20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
            {album.photos.map(photo => {
              const isTaggedCorrect = tagged.includes(photo.id) && required.has(photo.id)
              return (
                <button
                  key={photo.id}
                  onClick={() => { setFeedback(null); setActivePhoto(photo) }}
                  style={{
                    background: 'transparent', border: `2px solid ${isTaggedCorrect ? '#d4a84b' : 'transparent'}`, padding: 0,
                    cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 4, position: 'relative', textAlign: 'left',
                  }}
                >
                  <PhotoThumb filename={photo.filename} height={110} />
                  <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 12, color: '#8a8a98', padding: '0 4px 4px' }}>{photo.filename}</span>
                  {isTaggedCorrect && (
                    <div style={{ position: 'absolute', top: 8, right: 10, fontFamily: 'Share Tech Mono, monospace', fontSize: 12, color: '#f0c860', background: '#1a1408', padding: '1px 6px' }}>✓ flagged</div>
                  )}
                </button>
              )
            })}
          </div>
        </div>
        {done && (
          <div style={{ padding: '14px 20px 80px', borderTop: '1px solid #1a1a28', background: '#08080c', flexShrink: 0 }}>
            {content.completionNote && (<p style={{ fontFamily: 'Crimson Pro, serif', fontStyle: 'italic', fontSize: 13, color: '#7a7268', lineHeight: 1.7, margin: '0 0 12px' }}>{content.completionNote}</p>)}
            <button onClick={onComplete} style={BUTTON_PRIMARY}>Continue →</button>
          </div>
        )}
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ padding: '10px 20px', borderBottom: '1px solid #1a1a28', fontFamily: 'Share Tech Mono, monospace', fontSize: 12, color: '#6a8aa8', letterSpacing: '0.2em', textTransform: 'uppercase', display: 'flex', justifyContent: 'space-between' }}>
        <span>Flickr — {content.username}</span>
        <span>{tagged.filter(t => required.has(t)).length}/{content.requiredPhotoIds?.length} flagged</span>
      </div>
      {/* A photo archive should look like one: every album opens as a
          contact sheet, not as a row of text above 500px of black. */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 20px 20px' }}>
        {content.albums.map(album => (
          <section key={album.id} style={{ marginBottom: 22 }}>
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
              fontFamily: 'Share Tech Mono, monospace', padding: '0 0 8px',
              borderBottom: '1px solid #1a1a28', marginBottom: 12,
            }}>
              <span style={{ fontSize: 13, color: '#b0b0c0', letterSpacing: '0.06em' }}>{album.name}</span>
              <span style={{ fontSize: 12, color: '#6a6a78' }}>{album.photos.length} photos</span>
            </div>
            <div style={{
              display: 'grid', gap: 12,
              gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 268px), 1fr))',
            }}>
              {album.photos.map(photo => {
                const ok = tagged.includes(photo.id) && required.has(photo.id)
                const no = tagged.includes(photo.id) && !required.has(photo.id)
                return (
                  <button key={photo.id}
                    onClick={() => { setActiveAlbum(album.id); setActivePhoto(photo) }}
                    aria-label={`Open ${photo.filename}`}
                    style={{
                      padding: 0, cursor: 'pointer', background: 'transparent',
                      border: ok ? '2px solid #d0201a' : '2px solid transparent',
                      opacity: no ? 0.5 : 1, textAlign: 'left', minHeight: 44,
                    }}>
                    <PhotoThumb filename={photo.filename} height={182} />
                    <div style={{
                      fontFamily: 'Share Tech Mono, monospace', fontSize: 12,
                      color: ok ? '#e8c870' : '#8a94a4', padding: '6px 2px 0',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>
                      {ok ? '✓ ' : ''}{photo.filename}
                    </div>
                  </button>
                )
              })}
            </div>
          </section>
        ))}
      </div>
      {done && (
        <div style={{ padding: '14px 20px 24px', borderTop: '1px solid #1a1a28', background: '#08080c', flexShrink: 0 }}>
          {content.completionNote && (<p style={{ fontFamily: 'Crimson Pro, serif', fontStyle: 'italic', fontSize: 15, color: '#a09888', lineHeight: 1.7, margin: '0 0 12px' }}>{content.completionNote}</p>)}
          <button onClick={onComplete} style={BUTTON_PRIMARY}>Continue →</button>
        </div>
      )}
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
          <button onClick={() => setActiveEmail(null)} style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 12, color: '#5a5858', background: 'none', border: 'none', cursor: 'pointer', letterSpacing: '0.15em' }}>← {activeFolder}</button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 12, color: '#c0b8a8', marginBottom: 8 }}>{activeEmail.subject}</div>
            {activeEmail.from && <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 12, color: '#7e7a6d', marginBottom: 4 }}>From: {activeEmail.from}</div>}
            {activeEmail.to && <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 12, color: '#7e7a6d', marginBottom: 4 }}>To: {activeEmail.to}</div>}
            {activeEmail.date && <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 12, color: '#3a3830', marginBottom: 12 }}>{activeEmail.date}</div>}
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
          <div style={{ padding: '14px 20px 80px', borderTop: '1px solid #1a1a28', background: '#08080c', flexShrink: 0 }}>
            {content.completionNote && (<p style={{ fontFamily: 'Crimson Pro, serif', fontStyle: 'italic', fontSize: 13, color: '#7a7268', lineHeight: 1.7, margin: '0 0 12px' }}>{content.completionNote}</p>)}
            <button onClick={onComplete} style={BUTTON_PRIMARY}>Continue →</button>
          </div>
        )}
      </div>
    )
  }

  // Mobile-friendly Gmail layout
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
      <div style={{ padding: '10px 16px', borderBottom: '1px solid #1a1a28', fontFamily: 'Share Tech Mono, monospace', fontSize: 12, color: '#7d7b7b', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
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
                <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 12, color: '#7a7a8f' }}>
                  {email.date}
                </span>
              </div>
              <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 14, color: isRead ? '#5a5868' : '#9a9aa8' }}>
                {email.subject}
              </div>
              <div style={{ fontFamily: 'Crimson Pro, serif', fontSize: 13, color: '#7c7c8e', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
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
function RecordsViewer({ content, onComplete, nodeId }) {
  const { triggerDiscovery } = useDiscoveryFeedback()
  const { markWrongGuess, activePath } = useGameStore()
  // A single result is not a search — it is the document. Skip the list.
  const [activeRecord, setActiveRecord] = useState(
    () => (content.records?.length === 1 ? content.records[0] : null))
  const [tagged, setTagged] = useLeadProgress(nodeId, 'tagged', [])
  const [wrongCount, setWrongCount] = useLeadProgress(nodeId, 'wrong', 0)
  const required = new Set(content.requiredTagIds ?? [])
  const [done, setDone] = useState(() => [...required].every(t => tagged.includes(t)))
  const [feedback, setFeedback] = useState(null)

  const handleTag = (item) => {
    if (tagged.includes(item.id)) return
    if (required.has(item.id)) {
      const newTagged = [...tagged, item.id]
      setTagged(newTagged)
      setFeedback({ type: 'correct', text: item.correctFeedback ?? 'Noted.' })
      // the line that puts a surname to the handle stops everything
      if (item.revealsName) useGameStore.getState().flagNameSeen()
      const remaining = required.size - newTagged.filter(t => required.has(t)).length
      triggerDiscovery(remaining === 0 ? 'major' : 'minor')
      if (remaining === 0) {
        setTimeout(() => setDone(true), 900)
      }
    } else {
      setTagged(prev => [...prev, item.id])
      setWrongCount(wrongCount + 1)
      if (activePath) markWrongGuess(activePath, wrongCount + 1)
      setFeedback({ type: 'wrong', text: `${item.wrongFeedback ?? 'Not relevant to the investigation.'} (+${wrongCost(wrongCount + 1)} min)` })
    }
    setTimeout(() => setFeedback(null), 3000)
  }

  if (activeRecord) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* With one record there is nothing to go back to, and the sheet
            below already carries this title — the bar was a third copy of
            the same line (lead heading, breadcrumb, document head), which
            costs 40px on desktop and a tenth of the screen on a phone. */}
        {content.records?.length > 1 && (
          <div style={{ padding: '8px 20px', borderBottom: '1px solid #1a1a28', display: 'flex', gap: 12, alignItems: 'center' }}>
            <button onClick={() => setActiveRecord(null)} style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 12, color: '#5a5858', background: 'none', border: 'none', cursor: 'pointer', letterSpacing: '0.15em', minHeight: 32 }}>← Results</button>
            <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 12, color: '#3a3a48', letterSpacing: '0.15em' }}>{activeRecord.title}</span>
          </div>
        )}
        <div className="doc-scroll" style={{ flex: 1, overflowY: 'auto', padding: '22px 20px 28px' }}>
         <div className="doc-sheet">
          <div className="doc-head">
            <span className="doc-seal" aria-hidden="true" />
            <div>
              <div className="doc-court">{content.systemName ?? 'Public Record'}</div>
              <div className="doc-title">{activeRecord.title}</div>
            </div>
          </div>
          {activeRecord.fields && Object.entries(activeRecord.fields).map(([k, v]) => (
            <div key={k} className="doc-field">
              <span className="k">{k}</span>
              <span className="v">{v}</span>
            </div>
          ))}
          {activeRecord.body && (
            <pre className="doc-body">{activeRecord.body}</pre>
          )}
          {activeRecord.taggable && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
              <div className="doc-tagcue">Flag what matters</div>
              {activeRecord.taggable.map(item => {
                const isTaggedCorrect = tagged.includes(item.id) && required.has(item.id)
                const isTaggedWrong = tagged.includes(item.id) && !required.has(item.id)
                return (
                  <div key={item.id} className={`doc-tag ${isTaggedCorrect ? 'ok' : ''} ${isTaggedWrong ? 'no' : ''}`}>
                    <p>{item.text}</p>
                    <button
                      onClick={() => handleTag(item)}
                      disabled={tagged.includes(item.id)}
                      className="doc-flag"
                    >
                      {isTaggedCorrect ? '✓' : 'Flag'}
                    </button>
                  </div>
                )
              })}
            </div>
          )}
         </div>
          {feedback && (
            <div style={{ padding: '10px 14px', marginTop: 14, fontFamily: 'Share Tech Mono, monospace', fontSize: 12, color: feedback.type === 'correct' ? '#7ac090' : feedback.type === 'info' ? '#d0c4a8' : '#e08a90', background: feedback.type === 'correct' ? '#08100c' : feedback.type === 'info' ? '#12121a' : '#160a0c', border: `1px solid ${feedback.type === 'correct' ? '#2a5040' : feedback.type === 'info' ? '#3a3a48' : '#5a2a2a'}` }}>
              {feedback.text}
            </div>
          )}
        </div>
        {done && (
          <div style={{ padding: '14px 20px 80px', borderTop: '1px solid #1a1a28', background: '#08080c', flexShrink: 0 }}>
            {content.completionNote && (<p style={{ fontFamily: 'Crimson Pro, serif', fontStyle: 'italic', fontSize: 13, color: '#7a7268', lineHeight: 1.7, margin: '0 0 12px' }}>{content.completionNote}</p>)}
            <button onClick={onComplete} style={BUTTON_PRIMARY}>Continue →</button>
          </div>
        )}
      </div>
    )
  }

  // A multi-record search is the drawer the document came out of. It used
  // to be two rows of terminal text above ~570px of black — the same void
  // the single-record case was fixed for. Each hit is now a physical
  // jacket on the same cream stock as the sheet it opens, so opening one
  // is a continuous move rather than a change of medium.
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="rec-head">
        <span>{content.systemName ?? 'Records Search'}</span>
        <span>
          {required.size > 0
            ? `${tagged.filter(t => required.has(t)).length} / ${required.size} flagged`
            : `${content.records?.length ?? 0} results`}
        </span>
      </div>
      <div className="rec-drawer">
        <div className="rec-grid">
          {content.records?.map((record, i) => {
            // The jacket, not its contents. This used to print five fields on
            // the card, which meant the registry handed over the name it took
            // ten leads to earn before the player had opened anything.
            const fields = record.fields ? Object.entries(record.fields).slice(0, 2) : []
            return (
              <button key={i} onClick={() => { setFeedback(null); setActiveRecord(record) }}
                className="rec-card" aria-label={`Open ${record.title}`}>
                <span className="rec-tab" aria-hidden="true" />
                <span className="rec-seal" aria-hidden="true" />
                <span className="rec-no">{String(i + 1).padStart(2, '0')}</span>
                <span className="rec-title">{record.title}</span>
                {record.summary && <span className="rec-sum">{record.summary}</span>}
                {fields.map(([k, v]) => (
                  <span key={k} className="rec-field"><i>{k}</i>{v}</span>
                ))}
                {/* what you have already taken out of this jacket */}
                {(() => {
                  const need = (record.taggable ?? []).map(t => t.id).filter(id => required.has(id))
                  if (!need.length) return null
                  const got = need.filter(id => tagged.includes(id)).length
                  return (
                    <span className={`rec-flagged ${got === need.length ? 'all' : ''}`}>
                      {got === need.length ? '✓ nothing left in here' : `${got} / ${need.length} flagged`}
                    </span>
                  )
                })()}
                <span className="rec-open">Open the file →</span>
              </button>
            )
          })}
        </div>
        <p className="rec-foot">
          {content.records?.length === 1 ? 'One record on file.' : `${content.records?.length ?? 0} records on file. Nothing else matched.`}
        </p>
      </div>
      {/* Finishing a lead inside a record and then stepping back to the list
          used to look exactly like never having started it. */}
      {done && (
        <div style={{ padding: '14px 20px 24px', borderTop: '1px solid #1a1a28', background: '#08080c', flexShrink: 0 }}>
          {content.completionNote && (<p style={{ fontFamily: 'Crimson Pro, serif', fontStyle: 'italic', fontSize: 13, color: '#7a7268', lineHeight: 1.7, margin: '0 0 12px' }}>{content.completionNote}</p>)}
          <button onClick={onComplete} style={BUTTON_PRIMARY}>Continue →</button>
        </div>
      )}
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

export function BrowseNode({ content, onComplete, onJournalistUnlock, onCinematicTrigger, nodeId = null }) {
  const Variant = VARIANTS[content.variant] ?? RecordsViewer
  return (
    <Variant
      content={content}
      nodeId={nodeId}
      onComplete={onComplete}
      onJournalistUnlock={onJournalistUnlock}
      onCinematicTrigger={onCinematicTrigger}
    />
  )
}
