/**
 * Grayscale Filter
 * Applies CSS filter to make pages boring during flow
 * Enhanced for global browser control
 */
declare class GrayscaleFilter {
    private enabled;
    private intensity;
    private observer;
    enable(intensity?: number): void;
    disable(): void;
    setIntensity(intensity: number): void;
    toggle(): void;
    isEnabled(): boolean;
    getIntensity(): number;
    /**
     * Watch for dynamically added content and apply grayscale
     */
    private startWatching;
    private stopWatching;
    /**
     * Apply grayscale to a specific element and its children
     */
    private applyGrayscaleToElement;
}
export declare const grayscaleFilter: GrayscaleFilter;
export {};
//# sourceMappingURL=grayscale_filter.d.ts.map