/**
 * Grayscale Filter
 * Applies CSS filter to make pages boring during flow
 * Enhanced for global browser control
 */

class GrayscaleFilter {
  private enabled = false;
  private intensity = 100; // 0-100%
  private observer: MutationObserver | null = null;

  enable(intensity: number = 100) {
    if (this.enabled && this.intensity === intensity) return;

    this.intensity = Math.max(0, Math.min(100, intensity));
    
    // Apply grayscale filter with smooth transition
    document.documentElement.style.filter = `grayscale(${this.intensity}%)`;
    document.documentElement.style.transition = 'filter 0.5s ease-in-out';
    
    // Add CSS class for additional styling
    document.documentElement.classList.add('flowstate-grayscale');
    
    this.enabled = true;

    // Watch for dynamic content changes
    this.startWatching();

    console.log(`FlowState: Grayscale mode enabled at ${this.intensity}%`);
  }

  disable() {
    if (!this.enabled) return;

    // Smooth transition back to normal
    document.documentElement.style.filter = 'grayscale(0%)';
    document.documentElement.style.transition = 'filter 0.5s ease-in-out';
    
    // Remove CSS class
    document.documentElement.classList.remove('flowstate-grayscale');
    
    this.enabled = false;
    this.intensity = 0;

    // Stop watching for changes
    this.stopWatching();

    console.log('FlowState: Grayscale mode disabled');
  }

  setIntensity(intensity: number) {
    if (this.enabled) {
      this.enable(intensity);
    }
  }

  toggle() {
    if (this.enabled) {
      this.disable();
    } else {
      this.enable();
    }
  }

  isEnabled(): boolean {
    return this.enabled;
  }

  getIntensity(): number {
    return this.intensity;
  }

  /**
   * Watch for dynamically added content and apply grayscale
   */
  private startWatching() {
    if (this.observer) return;

    this.observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as Element;
              // Apply grayscale to new elements
              this.applyGrayscaleToElement(element);
            }
          });
        }
      });
    });

    this.observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  private stopWatching() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  }

  /**
   * Apply grayscale to a specific element and its children
   */
  private applyGrayscaleToElement(element: Element) {
    if (element instanceof HTMLElement) {
      element.style.filter = `grayscale(${this.intensity}%)`;
      element.style.transition = 'filter 0.3s ease-in-out';
    }

    // Apply to all child elements
    const children = element.querySelectorAll('*');
    children.forEach((child) => {
      if (child instanceof HTMLElement) {
        child.style.filter = `grayscale(${this.intensity}%)`;
        child.style.transition = 'filter 0.3s ease-in-out';
      }
    });
  }
}

const filter = new GrayscaleFilter();

export const grayscaleFilter = filter;

export function applyGrayscaleFilter(intensity: number = 100) {
  filter.enable(intensity);
}

export function removeGrayscaleFilter() {
  filter.disable();
}
