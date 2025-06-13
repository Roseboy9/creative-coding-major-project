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
function updateTransformsLogic() {
    /**
     * Step 1: Calculate the base scaling factor.
     * We determine how much to scale the artwork so it initially fits well within the window.
     * The artwork's original design space is 900x900 units.
     */
    baseScaleFactor = min(windowWidth, windowHeight) / 900; 

    /**
     * Step 2: Calculate the base offsets for centering.
     * These offsets ensure the artwork is positioned in the centre of the canvas
     * after applying its initial scale. The bird's internal centre is (450, 425).
     */
    baseOffsetX = windowWidth / 2 - (BIRD_CENTER_LOCAL_X * baseScaleFactor); 
    baseOffsetY = windowHeight / 2 - (BIRD_CENTER_LOCAL_Y * baseScaleFactor); 
    
    /**
     * Step 3: Calculate the artwork's effective dimensions.
     * These dimensions reflect the artwork's actual width and height on the canvas
     * after the base scaling has been applied.
     */
    artworkEffectiveWidth = 900 * baseScaleFactor; 
    artworkEffectiveHeight = (ARTWORK_LOCAL_MAX_Y - ARTWORK_LOCAL_MIN_Y) * baseScaleFactor;

    /***
     * Step 4: Calculate the maximum allowed zoom scale.
     * This calculation ensures that when the user zooms in (in 'zoom' mode),
     * the artwork does not go completely off-screen. We find the limiting
     * factor from both top and bottom edges relative to the canvas centre.
     */
    let artworkCanvasTopY = baseOffsetY + ARTWORK_LOCAL_MIN_Y * baseScaleFactor;
    let artworkCanvasBottomY = baseOffsetY + ARTWORK_LOCAL_MAX_Y * baseScaleFactor;
    let distFromCentreToTop = artworkCanvasTopY - height / 2;
    let distFromCentreToBottom = artworkCanvasBottomY - height / 2;
    let maxZoomTopConstraint = (distFromCentreToTop < 0) ? (height / 2) / abs(distFromCentreToTop) : Infinity;
    let maxZoomBottomConstraint = (distFromCentreToBottom > 0) ? (height / 2) / abs(distFromCentreToBottom) : Infinity;
    
    maxAllowedZoomScale = min(maxZoomTopConstraint, maxZoomBottomConstraint);
    maxAllowedZoomScale = constrain(maxAllowedZoomScale, 1, 2.5); // Cap the zoom to a reasonable maximum.

    /**
     * Step 5: Initialise or update the main Bird object.
     * We ensure our global `bird` object reflects the newly calculated base transformations.
     */
    if (!bird) {
        bird = new Bird(baseScaleFactor, baseOffsetX, baseOffsetY);
    } else {
        bird.scaleFactor = baseScaleFactor;
        bird.offsetX = baseOffsetX;
        bird.offsetY = baseOffsetY;
    }
}

