/**
 * @since latest
 * @see "utils.ts" fadeIn
 */
export interface CustomKeyframeAnimationOptions extends KeyframeAnimationOptions {
    onComplete?: () => void,
    displayVisible?: "block" | "flex" | "inline" | "inline-block"
}