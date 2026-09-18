import { Component } from 'react'

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
    // Try to go back to menu
    if (this.props.onReset) {
      this.props.onReset()
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="fixed inset-0 bg-[#08080e] flex items-center justify-center p-8">
          <div className="max-w-md text-center">
            {/* Error icon */}
            <div className="mb-6">
              <svg width="64" height="64" viewBox="0 0 64 64" className="mx-auto">
                <circle cx="32" cy="32" r="28" fill="none" stroke="#c0392b" strokeWidth="2" />
                <path d="M32 18 L32 38" stroke="#c0392b" strokeWidth="3" strokeLinecap="round" />
                <circle cx="32" cy="46" r="3" fill="#c0392b" />
              </svg>
            </div>

            {/* Error message */}
            <h2
              className="text-xl font-bold text-[#e8dcc8] mb-3 uppercase tracking-wider"
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
            >
              Something Went Wrong
            </h2>

            <p className="text-[#7a7268] text-sm mb-6 font-mono">
              The case file wouldn&apos;t open. Your saved investigation is usually
              still there — try returning to the menu first.
            </p>

            {/* Error details (dev only) */}
            {import.meta.env.DEV && this.state.error && (
              <pre className="text-left text-[12px] text-red-800 bg-[#0a0608] p-3 mb-6 overflow-auto max-h-32 border border-red-900/30">
                {this.state.error.toString()}
              </pre>
            )}

            {/* Reset button */}
            <div className="flex flex-wrap gap-3 justify-center">
              <button
                onClick={this.handleReset}
                className="font-mono text-sm text-[#c0392b] border border-[#c0392b] px-6 py-3 hover:bg-[#c0392b] hover:text-white transition-colors cursor-pointer tracking-widest uppercase"
              >
                Return to Menu
              </button>
              {/* if the save itself is what broke, the menu can't fix it */}
              <button
                onClick={() => {
                  try {
                    localStorage.removeItem('maya-game-v3-storage')
                  } catch { /* private mode — nothing to clear */ }
                  window.location.reload()
                }}
                className="font-mono text-sm text-[#7a7268] border border-[#3a3a48] px-6 py-3 hover:text-[#c8c0b0] hover:border-[#5a5a68] transition-colors cursor-pointer tracking-widest uppercase"
              >
                Clear saved data
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
