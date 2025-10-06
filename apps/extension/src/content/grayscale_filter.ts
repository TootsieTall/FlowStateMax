const GRAYSCALE_FILTER_ID = 'flowstate-grayscale-filter'

export function applyGrayscaleFilter() {
  // Check if filter already exists
  if (document.getElementById(GRAYSCALE_FILTER_ID)) {
    return
  }

  // Create style element
  const style = document.createElement('style')
  style.id = GRAYSCALE_FILTER_ID
  style.textContent = `
    html {
      filter: grayscale(100%) !important;
      -webkit-filter: grayscale(100%) !important;
    }
    
    /* Preserve some color for important UI elements */
    img[src*="logo"],
    .flowstate-preserve-color {
      filter: none !important;
      -webkit-filter: none !important;
    }
  `

  document.head.appendChild(style)
  console.log('FlowState: Grayscale filter applied')
}

export function removeGrayscaleFilter() {
  const filter = document.getElementById(GRAYSCALE_FILTER_ID)
  if (filter) {
    filter.remove()
    console.log('FlowState: Grayscale filter removed')
  }
}