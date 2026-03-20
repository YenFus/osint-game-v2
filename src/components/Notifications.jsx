import { useEffect, useRef } from 'react'
import { useGameStore } from '../store/gameStore'
import { useAudio } from '../hooks/useAudio'

// Icon indicators for color independence (WCAG 2.1)
const NOTIFICATION_CONFIG = {
  info: {
    icon: 'ℹ',
    borderColor: 'border-[#2a4060]',
    iconColor: 'text-[#4a90d9]',
  },
  success: {
    icon: '✓',
    borderColor: 'border-[#2a5040]',
    iconColor: 'text-[#5a9060]',
  },
  error: {
    icon: '✗',
    borderColor: 'border-[#4a2030]',
    iconColor: 'text-[#8a5060]',
  },
  warning: {
    icon: '⚠',
    borderColor: 'border-[#4a3020]',
    iconColor: 'text-[#a07040]',
  },
}

export default function Notifications() {
  const notifications = useGameStore(s => s.notifications)
  const { playSFX } = useAudio()
  const prevLengthRef = useRef(0)

  // Play a sound whenever a new notification appears
  useEffect(() => {
    if (notifications.length > prevLengthRef.current) {
      const newest = notifications[notifications.length - 1]
      if (newest?.type === 'error' || newest?.type === 'warning') {
        playSFX('error')
      } else {
        playSFX('notification')
      }
    }
    prevLengthRef.current = notifications.length
  }, [notifications, playSFX])

  if (!notifications.length) return null

  return (
    <div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 items-center pointer-events-none"
      role="status"
      aria-live="polite"
      aria-label="Notifications"
    >
      {notifications.map((n) => {
        const config = NOTIFICATION_CONFIG[n.type] || NOTIFICATION_CONFIG.info
        return (
          <div
            key={n.id}
            className={`
              fade-in
              font-mono text-xs text-[#c8c0b0]
              border ${config.borderColor}
              bg-[#0a0a0f] bg-opacity-95
              px-5 py-2.5
              max-w-md text-center
              leading-relaxed
              flex items-center gap-3
            `}
          >
            <span className={`${config.iconColor} text-sm`} aria-hidden="true">{config.icon}</span>
            <span>{n.msg}</span>
          </div>
        )
      })}
    </div>
  )
}
