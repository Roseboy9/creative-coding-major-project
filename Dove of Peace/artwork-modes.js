/**
 * This file manages the different interactive and autonomous modes of the artwork.
 * It defines global variables for mode control, animation parameters, and special effects.
 */

/**
 * This variable tracks the currently active display mode.
 * Possible values include: 'zoom', 'float', and 'pixelate'.
 */
let currentMode = 'zoom'; 

/**
 * These variables control the interactive zoom effect in 'zoom' mode.
 */
let zoomScale = 1;      // This holds the current zoom level of the artwork.
let targetZoomScale = 1; // This holds the target zoom level, which `zoomScale` interpolates towards.
const easing = 0.05;    // This smoothing factor makes transitions fluid.

/**
 * These variables control the autonomous movement (horizontal drift and bobbing)
 * in 'float' and 'pixelate' modes.
 */
const autonomousBobbingRange = 50; // This defines the maximum vertical displacement for the bobbing motion.
const autonomousBobbingSpeed = 0.03; // This speed multiplier affects the frequency of the bobbing.
const autonomousHorizontalSpeed = 1; // This constant determines how fast the artwork drifts horizontally.

/**
 * These variables are dedicated to generating the organic, non-repetitive
 * bobbing motion using Perlin noise.
 */
let bobbingNoiseOffset = 0; // This acts as a 'time' input for the Perlin noise function.
const bobbingNoiseScale = 0.02; // This scales the noise offset, controlling the "speed" or "frequency" of the bobbing.

/**
 * These variables control the pixelation and glitch effects in 'pixelate' mode.
 */
const pixelSize = 25; // This sets the size of each pixel block for the effect.
const glitchRange = 5; // This determines the maximum random offset and size variation for glitching.

/**
 * These global variables define limits and manage the active bird instance.
 */
let maxAllowedZoomScale; // Maximum zoom factor to keep artwork on screen.
let activeBirds = [];    // This array holds the single Bird object currently being animated.

/**
 * This function calculates and updates global artwork variables, including
 * the base scaling factors, offsets, effective dimensions, and the maximum
 * allowed zoom level. It is essential for responsive behaviour.
 */