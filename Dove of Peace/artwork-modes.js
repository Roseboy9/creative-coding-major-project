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

/**
 * This function initialises the `activeBirds` array, which holds the single
 * bird instance currently being animated. It clears any previous birds and
 * sets up the new bird's initial position based on the `currentMode`.
 */
function initializeBirdsForMode() {
    /**
     * Step 1: Clear existing bird instances.
     * We start with a clean slate to ensure only one active bird.
     */
    activeBirds = []; 

    /**
     * Step 2: Add a new bird instance based on the current mode.
     * In 'zoom' mode, the bird starts centred. In 'float' or 'pixelate' mode,
     * the bird starts off-screen to the left to begin its autonomous journey.
     */
    if (currentMode === 'zoom') {
        activeBirds.push(new Bird(baseScaleFactor, baseOffsetX, baseOffsetY));
    } else if (currentMode === 'float' || currentMode === 'pixelate') { 
        activeBirds.push(new Bird(baseScaleFactor, -artworkEffectiveWidth, baseOffsetY)); 
    } 

    /**
     * Step 3: Reset the Perlin noise offset.
     * We reset the bobbing noise offset to a random value to ensure
     * a varied and consistent bobbing pattern each time a mode is entered.
     */
    bobbingNoiseOffset = random(1000); 
}

/**
 * This is the main initialisation function for all the advanced modes' logic.
 * It is called once from the `setup()` function in `sketch.js` when the program starts.
 */
function initializeAdvancedModes() {
    // First, we set up all the base transformations for the artwork.
    updateTransformsLogic(); 
    // Then, we initiallise the bird's state according to the starting mode.
    initializeBirdsForMode(); 
}

/**
 * This function handles canvas resizing events. It's called from `windowResized()` in `sketch.js`.
 * It recalculates transformations and reinitialises elements to adapt to the new window size.
 */
function handleResize() {
    /**
     * Step 1: Recalculate base scaling and offsets.
     * This ensures the artwork scales correctly with the new window dimensions.
     */
    updateTransformsLogic(); 
    /**
     * Step 2: Reinitialise background dots.
     * This ensures the background dots are distributed correctly across the new canvas size.
     */
    bg.resize(); 
    /**
     * Step 3: Re-initialise bird for the active mode.
     * This correctly positions the bird relative to the new canvas size.
     */
    initializeBirdsForMode(); 
    /**
     * Step 4: Recreate the off-screen graphics buffer.
     * The `pGraphics` buffer needs to match the new canvas dimensions for accurate drawing.
     */
    pGraphics = createGraphics(width, height); 
}

/**
 * This function renders the artwork based on the `currentMode`.
 * It contains the core drawing and animation logic for each distinct mode.
 * This is called repeatedly from the `draw()` function in `sketch.js`.
 */
function renderArtwork() {
    /**
     * Step 1: Check if the current mode is 'zoom'.
     * If so, we apply mouse-driven zoom and corresponding background effects.
     */
    if (currentMode === 'zoom') {
        /**
         * Step 1.1: Calculate background transparency for trailing effect.
         * The background's alpha changes based on the zoom level, creating a subtle trail.
         */
        let backgroundAlpha = map(zoomScale, 0.5, maxAllowedZoomScale, 5, 50); 
        background(0, 0, 0, backgroundAlpha); 

        /**
         * Step 1.2: Update zoom scale based on mouse Y-position.
         * The target zoom smoothly follows the mouse's vertical position,
         * with constraints to keep the artwork visible.
         */
        targetZoomScale = map(abs(mouseY - height / 2), 0, height / 2, 2, 0.5); 
        targetZoomScale = constrain(targetZoomScale, 0.5, maxAllowedZoomScale); 
        zoomScale = lerp(zoomScale, targetZoomScale, easing);

        /**
         * Step 1.3: Draw background with inverse zoom.
         * We push/pop transformations to apply scaling relative to the canvas centre,
         * ensuring the background moves complementarily to the bird's zoom.
         */
        push();
        translate(width / 2, height / 2); 
        scale(zoomScale);                 
        translate(-width / 2, -height / 2); 
        bg.draw();                        
        pop();

        /**
         * Step 1.4: Ensure the bird's properties are set for zoom mode.
         * We make sure the active bird's scale and offset align with the base values.
         */
        if (activeBirds.length === 0) {
            activeBirds.push(new Bird(baseScaleFactor, baseOffsetX, baseOffsetY));
        }
        activeBirds[0].scaleFactor = baseScaleFactor; 
        activeBirds[0].offsetX = baseOffsetX;
        activeBirds[0].offsetY = baseOffsetY;

        /**
         * Step 1.5: Draw the bird (with integrated olive branch) in zoom mode.
         * These elements are also scaled relative to the canvas centre.
         */
        push();
        translate(width / 2, height / 2); 
        scale(zoomScale);                 
        translate(-width / 2, -height / 2); 
        
        activeBirds[0].draw(); 
        // Removed separate drawOliveBranch call as it's now part of Bird.draw()
        pop();

    } else if (currentMode === 'float' || currentMode === 'pixelate') {
        /**
         * Step 2: Handle 'float' and 'pixelate' modes.
         * These modes share autonomous movement and a normal background.
         */
        let currentBird = activeBirds[0]; 

        /**
         * Step 2.1: Draw the background normally.
         * The background always maintains its normal appearance in these modes,
         * independent of the bird's special effects.
         */
        background(0, 0, 0, 50); 
        push();
        translate(width / 2, height / 2);
        scale(1); 
        translate(-width / 2, -height / 2);
        bg.draw();                        
        pop();

        /**
         * Step 2.2: Apply autonomous horizontal movement.
         * The bird continuously drifts from left to right, wrapping around the screen.
         */
        currentBird.offsetX += autonomousHorizontalSpeed; 
        if (currentBird.offsetX > width) { 
            currentBird.offsetX = -artworkEffectiveWidth; 
        }

        /**
         * Step 2.3: Apply vertical bobbing using Perlin noise.
         * The bird's vertical position undulates organically, making its movement more natural.
         */
        let bobbingOffset = map(noise(bobbingNoiseOffset), 0, 1, -autonomousBobbingRange, autonomousBobbingRange);
        bobbingNoiseOffset += bobbingNoiseScale; 

        currentBird.offsetY = lerp(currentBird.offsetY, baseOffsetY + bobbingOffset, easing * 2);
        currentBird.scaleFactor = baseScaleFactor; // Ensure the bird maintains its base size.

        /**
         * Step 2.4: Constrain vertical position.
         * We prevent the bird from moving too far off the top or bottom of the screen.
         */
        currentBird.offsetY = constrain(currentBird.offsetY, 
                                0 - (ARTWORK_LOCAL_MIN_Y * baseScaleFactor), 
                                height - (ARTWORK_LOCAL_MAX_Y * baseScaleFactor)); 

        /**
         * Step 2.5: Apply specific rendering for 'pixelate' mode.
         * If in 'pixelate' mode, we use an off-screen buffer for the split-screen effect.
         */
        if (currentMode === 'pixelate') {
            /**
             * Step 2.5.1: Clear the off-screen buffer.
             * This ensures we start with a clean buffer for each frame.
             */
            pGraphics.clear(); 

            /**
             * Step 2.5.2: Draw the smooth bird (with integrated olive branch) to the off-screen buffer.
             * The combined artwork is rendered normally onto `pGraphics` before any pixelation.
             */
            currentBird.draw(pGraphics); 
            // Removed separate drawOliveBranch call as it's now part of Bird.draw()

            /**
             * Step 2.5.3: Define the screen split point.
             * The screen is divided vertically in half for the effect.
             */
            let midX = width / 2;

            /**
             * Step 2.5.4: Draw the left half normally.
             * The left side of the artwork is copied directly from the smooth buffer.
             */
            image(pGraphics, 0, 0, midX, height, 0, 0, midX, height);

            /**
             * Step 2.5.5: Draw the right half pixelated and glitched.
             * We iterate through pixel blocks on the right side, sample colours from the buffer,
             * and draw new rectangles with random offsets and sizes for the glitch effect.
             */
            noStroke(); // Ensure no outlines for the pixel blocks.
            for (let x = floor(midX); x < width; x += pixelSize) {
                for (let y = 0; y < height; y += pixelSize) {
                    let c = pGraphics.get(x, y); 
                    // Only draw a pixel block if there's actual artwork content (not transparent).
                    if (alpha(c) > 0) { 
                        fill(c);
                        let gx = x + random(-glitchRange, glitchRange);
                        let gy = y + random(-glitchRange, glitchRange);
                        let gw = pixelSize + random(-glitchRange, glitchRange);
                        let gh = pixelSize + random(-glitchRange, glitchRange);
                        rect(gx, gy, gw, gh);
                    }
                }
            }
        } else { 
            /**
             * Step 2.6: Draw normally for 'float' mode.
             * If not in 'pixelate' mode, the bird (with olive branch) is drawn smoothly.
             */
            currentBird.draw(); 
            // Removed separate drawOliveBranch call as it's now part of Bird.draw()
        }
    }
}

/**
 * This function handles key press events to switch between the different display modes.
 * It is called from the `keyPressed()` function in `sketch.js`.
 * @param {string} inputKey The key that was pressed.
 */
function handleKeyPress(inputKey) {
    /**
     * Step 1: Check for 'M' key press.
     * This key cycles the display mode between 'zoom' and 'float' (or 'pixelate' back to 'zoom').
     */
    if (inputKey === 'm' || inputKey === 'M') { 
        if (currentMode === 'zoom') {
            currentMode = 'float';
        } else if (currentMode === 'float' || currentMode === 'pixelate') { 
            currentMode = 'zoom';
        }
        /**
         * Step 1.1: Reset zoom and reinitialise birds.
         * We reset the zoom state and re-initialise the bird's starting position
         * to match the newly selected mode.
         */
        zoomScale = 1; 
        targetZoomScale = 1;
        initializeBirdsForMode(); 
        return false; // Prevent default browser action (like scrolling).
    } else if (inputKey === 'p' || inputKey === 'P') { 
        /**
         * Step 2: Check for 'P' key press.
         * This key toggles the 'pixelate' effect on/off, but only if we are currently in 'float' mode.
         */
        if (currentMode === 'float') {
            currentMode = 'pixelate';
        } else if (currentMode === 'pixelate') {
            currentMode = 'float';
        }
        // If not in float mode, 'P' does nothing as per design.
        return false; 
    }
    // Return false for any unhandled key press to prevent default browser actions.
    return false; 
}