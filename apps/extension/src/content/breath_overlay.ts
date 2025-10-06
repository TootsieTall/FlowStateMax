interface BreathOverlayOptions {
  onClose: () => void
  onContinue: () => void
}

export function createBreathOverlay(appName: string, options: BreathOverlayOptions) {
  // Create overlay container
  const overlay = document.createElement('div')
  overlay.id = 'flowstate-breath-overlay'
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.95);
    z-index: 999999;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  `

  // Create content
  const content = document.createElement('div')
  content.style.cssText = `
    text-align: center;
    color: white;
  `

  // Breathing circle
  const circle = document.createElement('div')
  circle.style.cssText = `
    width: 120px;
    height: 120px;
    margin: 0 auto 40px;
    border-radius: 50%;
    background: #1976D2;
    animation: breathe 10s ease-in-out infinite;
  `

  // Add keyframe animation
  const style = document.createElement('style')
  style.textContent = `
    @keyframes breathe {
      0%, 100% { transform: scale(0.8); opacity: 0.6; }
      50% { transform: scale(1.3); opacity: 1; }
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .fade-in-btn {
      animation: fadeIn 0.5s ease-out forwards;
    }
  `
  document.head.appendChild(style)

  // Text
  const title = document.createElement('h2')
  title.textContent = 'Take a Deep Breath'
  title.style.cssText = `
    font-size: 28px;
    font-weight: bold;
    margin-bottom: 10px;
  `

  const subtitle = document.createElement('p')
  subtitle.textContent = `You tried to open ${appName}`
  subtitle.style.cssText = `
    font-size: 16px;
    opacity: 0.8;
    margin-bottom: 40px;
  `

  // Buttons container
  const buttonsContainer = document.createElement('div')
  buttonsContainer.style.cssText = `
    display: flex;
    flex-direction: column;
    gap: 12px;
    opacity: 0;
  `

  // Go back button
  const backButton = document.createElement('button')
  backButton.textContent = '✓ Go Back (Build Focus)'
  backButton.style.cssText = `
    padding: 14px 32px;
    background: white;
    color: #333;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  `
  backButton.onmouseover = () => {
    backButton.style.background = '#f0f0f0'
  }
  backButton.onmouseout = () => {
    backButton.style.background = 'white'
  }
  backButton.onclick = () => {
    document.body.removeChild(overlay)
    options.onClose()
  }

  // Continue button
  const continueButton = document.createElement('button')
  continueButton.textContent = 'Open Anyway'
  continueButton.style.cssText = `
    padding: 14px 32px;
    background: transparent;
    color: white;
    border: 2px solid white;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  `
  continueButton.onmouseover = () => {
    continueButton.style.background = 'rgba(255, 255, 255, 0.1)'
  }
  continueButton.onmouseout = () => {
    continueButton.style.background = 'transparent'
  }
  continueButton.onclick = () => {
    document.body.removeChild(overlay)
    options.onContinue()
  }

  // Assemble
  buttonsContainer.appendChild(backButton)
  buttonsContainer.appendChild(continueButton)

  content.appendChild(circle)
  content.appendChild(title)
  content.appendChild(subtitle)
  content.appendChild(buttonsContainer)

  overlay.appendChild(content)
  document.body.appendChild(overlay)

  // Show buttons after 5 seconds (one breath cycle)
  setTimeout(() => {
    buttonsContainer.style.opacity = '1'
    buttonsContainer.classList.add('fade-in-btn')
  }, 5000)
}