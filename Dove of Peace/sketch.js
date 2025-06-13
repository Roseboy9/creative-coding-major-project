// Constants for the artwork's effective top and bottom points in its original 900x900 space
// These are determined by the geometry of the bird and the olive branch.
const ARTWORK_LOCAL_MIN_Y = -10; 
const ARTWORK_LOCAL_MAX_Y = 800;
const BIRD_CENTER_LOCAL_X = 450;
const BIRD_CENTER_LOCAL_Y = 425;

/**
 * These global variables define the core components and transformations
 * managed by sketch.js, setting up the overall canvas and main artwork.
 */
let bird;   // This variable will hold our Bird object.
let bg;     // This variable will hold our Background object, responsible for the dots.
let baseScaleFactor; // This holds the base scaling factor for the artwork to fit the window.
let baseOffsetX;     // This holds the base X-offset to centre the artwork.
let baseOffsetY;     // This holds the base Y-offset to centre the artwork.
let artworkEffectiveWidth; // This variable stores the calculated effective width of the artwork after base scaling.
let artworkEffectiveHeight; // This variable stores the calculated effective height of the artwork after base scaling.

/**
 * This p5.js global function will hold an off-screen graphics buffer.
 * We need this buffer to draw parts of our artwork independently
 * before processing them for effects like pixelation.
 */
let pGraphics; 

/**
 * The Bird class defines the properties and drawing logic for the dove artwork.
 * It encapsulates the colours and methods required to render the bird.
 */
class Bird {
    /**
     * Initialises a new Bird instance.
     * scaleFactor: The scale of the bird relative to its original size.
     * offsetX: The X-offset for positioning the bird on the canvas.
     * offsetY: The Y-offset for positioning the bird on the canvas.
     */
    constructor(scaleFactor = 1, offsetX = 0, offsetY = 0) {
        this.scaleFactor = scaleFactor; // Scale relative to canvas size
        this.offsetX = offsetX; // Offset to centre the bird
        this.offsetY = offsetY; // Offset to centre the bird
        this.colors = { // Original group code comment kept
            pale: [233, 230, 226], // #E9E6E2
            black: [0, 0, 0], // #000000
            ghost: [220, 220, 220], // #DCDCDC
            white: [240, 234, 226], // #F0EAE2
            cream: [249, 249, 249], // #F9F9F9
            greylight: [234, 234, 234], // #EAEAEA
            grey: [221, 221, 221], // #DDDDDD
        };
    }

    /**
     * This method applies necessary transformations (translation and scaling)
     * to the graphics context before drawing the bird's shapes. This allows
     * us to position and size the bird correctly.
     * {p5.Graphics|object} g: The graphics context to apply transformations to (e.g., main canvas or pGraphics).
     */
    applyTransform(g) {
        g.push();
        g.translate(this.offsetX, this.offsetY);
        g.scale(this.scaleFactor);
        g.noStroke(); // Set once for all shapes in the bird to prevent outlines.
    }

    /**
     * This internal method draws all the raw geometric shapes that form the bird.
     * It directly draws to the provided graphics context 'g' without applying
     * any translation or scaling, as those are handled by `applyTransform`.
     * It also now includes the olive branch drawing.
     * {p5.Graphics|object} g: The graphics context to draw shapes onto.
     */
    _drawShapes(g) {
        g.noStroke();
        // Head
        g.fill(this.colors.pale);
        g.beginShape();
        g.vertex(570, 100); g.vertex(610, 98); g.vertex(750, 150); g.vertex(660, 210); g.vertex(650, 250); g.vertex(520, 300);
        g.endShape(CLOSE);
        // Eye
        g.fill(this.colors.black);
        g.ellipse(605, 140, 35, 35);
        // Nape
        g.fill(this.colors.ghost);
        g.beginShape();
        g.vertex(450, 200); g.vertex(520, 300); g.vertex(570, 100);
        g.endShape(CLOSE);
        // Neck
        g.fill(this.colors.ghost);
        g.beginShape();
        g.vertex(650, 250); g.vertex(520, 300); g.vertex(680, 400);
        g.endShape(CLOSE);
        // Body
        g.fill(this.colors.greylight);
        g.beginShape(); g.vertex(450, 200); g.vertex(520, 300); g.vertex(340, 330); g.endShape(CLOSE);
        g.fill(this.colors.grey);
        g.beginShape(); g.vertex(340, 330); g.vertex(220, 455); g.vertex(432, 530); g.endShape(CLOSE);
        g.fill(this.colors.cream);
        g.beginShape(); g.vertex(220, 455); g.vertex(340, 330); g.vertex(100, 300); g.endShape(CLOSE);
        g.fill(this.colors.greylight);
        g.beginShape(); g.vertex(680, 400); g.vertex(650, 500); g.vertex(520, 300); g.endShape(CLOSE);
        g.fill(this.colors.white);
        g.beginShape(); g.vertex(340, 330); g.vertex(520, 300); g.vertex(650, 500); g.vertex(445, 560); g.endShape(CLOSE);
        // Wing
        g.fill(this.colors.pale);
        g.beginShape(); g.vertex(340, 330); g.vertex(230, 200); g.vertex(433, 220); g.endShape(CLOSE);
        g.fill(this.colors.cream);
        g.beginShape(); g.vertex(230, 200); g.vertex(100, 50); g.vertex(340, 80); g.endShape(CLOSE);
        g.fill(this.colors.grey);
        g.beginShape(); g.vertex(340, 80); g.vertex(450, 200); g.vertex(433, 220); g.vertex(230, 200); g.endShape(CLOSE);
        // Tail
        g.fill(this.colors.white);
        g.beginShape(); g.vertex(220, 455); g.vertex(100, 630); g.vertex(80, 550); g.vertex(0, 520); g.vertex(181, 405); g.endShape(CLOSE);
        // Feather
        g.fill(this.colors.ghost);
        g.beginShape(); g.vertex(445, 560); g.vertex(500, 800); g.vertex(150, 800); g.vertex(170, 760); g.vertex(350, 700); g.endShape(CLOSE);
        g.fill(this.colors.white);
        g.beginShape(); g.vertex(170, 760); g.vertex(350, 700); g.vertex(350, 501); g.vertex(300, 483); g.endShape(CLOSE);
        g.fill(this.colors.greylight);
        g.beginShape(); g.vertex(350, 700); g.vertex(350, 501); g.vertex(432, 530); g.vertex(445, 560); g.endShape(CLOSE);

        /**
         * Step 2.7: Draw the olive branch.
         * The olive branch is drawn here so it is always with the bird
         * and inherits the same transformations.
         */
        this._drawOliveBranch(g);
    }

    /**
     * This is the main draw method for the Bird class. It applies the necessary
     * transformations and then calls the internal method to draw all the shapes.
     * {p5.Graphics|object} graphics: The p5 graphics context to draw onto (defaults to the main canvas).
     */
    draw(graphics = window) { 
        this.applyTransform(graphics);
        this._drawShapes(graphics); // Call the internal drawing method, which now includes the olive branch.
        graphics.pop();
    }

    /**
     * This internal method draws the olive branch.
     * Its coordinates are relative to the bird's own local drawing space,
     * ensuring it stays attached.
     * {p5.Graphics|object} g: The graphics context to draw onto.
     */
    _drawOliveBranch(g) {
        g.stroke(34, 139, 34); // Olive green
        g.strokeWeight(8);
        g.noFill();
        // These coordinates are relative to the bird's internal (0,0) drawing space.
        // Positioned near the bird's beak.
        let centerX = 752; // Original group code comment kept
        let centerY = 180; // Original group code comment kept
        g.bezier(
            centerX, centerY + 80,
            centerX + 30, centerY - 25,
            centerX - 50, centerY - 120,
            centerX, centerY - 155
        );

        // Leaves
        g.noStroke();
        g.fill(34, 139, 34);
        g.push();
        g.translate(centerX - 3, centerY - 150);
        g.rotate(radians(-35));
        _drawLeafShapes(g, 80); // Call internal leaf drawing helper
        g.pop();
        g.push();
        g.translate(centerX + 5, centerY - 20);
        g.rotate(radians(-20));
        _drawLeafShapes(g, 80);
        g.pop();
        g.push();
        g.translate(centerX - 81, centerY - 105);
        g.rotate(radians(30));
        _drawLeafShapes(g, 80);
        g.pop();
    }
}

/**
 * The Background class manages the collection of floating dots that constitute the background.
 */
class Background {
    /**
     * Initialises a new Background instance.
     * numDots: The number of dots in the background.
     */
    constructor(numDots = 300) {
        this.numDots = numDots;
        this.dots = [];
        this.initializeDots(); // Original group code comment kept
    }

    //Initialise dots with random positions and velocities
    initializeDots() { // Original group code comment kept
        this.dots = [];
        for (let i = 0; i < this.numDots; i++) {
            this.dots.push({
                x: random(width),
                y: random(height),
                size: random(2, 6),
                speed: p5.Vector.random2D().mult(random(0.3, 1))
            });
        }
    }

    // Update and draw dots
    /**
     * This method updates the position of each background dot and draws them onto the specified graphics context.
     * It also handles resetting dots that move off-screen.
     * {p5.Graphics|object} graphics: The p5 graphics context to draw onto (defaults to the main canvas).
     */
    draw(graphics = window) { 
        graphics.fill(255, 255, 255, 60); // Semi-transparent white
        for (let d of this.dots) {
            graphics.circle(d.x, d.y, d.size);
            d.x += d.speed.x;
            d.y += d.speed.y; 

            // Reset dot if it moves off-screen
            if (d.x < -50 || d.x > width + 50 || d.y < -50 || d.y > height + 50) {
                d.x = random(width);
                d.y = random(height);
                d.speed = p5.Vector.random2D().mult(random(0.3, 1));
            }
        }
    }

    // Reinitialize dots on canvas resize
    resize() { // Original group code comment kept
        this.initializeDots();
    }
}

/**
 * This internal helper function draws the geometric shapes for a single leaf.
 * It's designed to be called within drawing functions that handle translation and rotation.
 * length: The length of the leaf.
 * {p5.Graphics|object} g: The graphics context to draw onto.
 */
function _drawLeafShapes(g, length) { 
    g.beginShape();
    g.vertex(0, 0);
    g.bezierVertex(length * 0.25, -length * 0.5, length * 0.50, -length * 0.5, length, 0);
    g.bezierVertex(length * 0.75, length * 0.5, length * 0.25, length * 0.5, 0, 0); 
    g.endShape(CLOSE);
}

// Main draw method to render the olive branch (This function is now unused, as its logic moved to Bird class)
/**
 * This function previously rendered the olive branch artwork. Its drawing logic
 * has now been moved into the Bird class (`Bird._drawOliveBranch`) to ensure
 * the olive branch is always drawn as part of the bird. This function is no longer called.
 * scaleFactor: The scaling factor for the olive branch.
 * offsetX: The X-offset for positioning.
 * offsetY: The Y-offset for positioning.
 * {p5.Graphics|object} graphics: The p5 graphics context to draw onto (defaults to the main canvas).
 */
function drawOliveBranch(scaleFactor, offsetX, offsetY, graphics = window) { 
    // This function's content has been moved to Bird._drawOliveBranch.
    // It remains here as a stub to avoid errors if any old calls exist.
    // Its arguments are now unused.
}

/**
 * The p5.js setup() function. This runs once when the program starts.
 * It initialises the canvas, background elements, and the off-screen buffer.
 * It then calls the primary initialisation function for the advanced modes.
 */
function setup() {
    createCanvas(windowWidth, windowHeight);
    rectMode(CENTER);
    bg = new Background(300); // Initialise our background object.
    pGraphics = createGraphics(width, height); // Initialise the off-screen graphics buffer.

    // Delegate initial setup for advanced modes to artwork-modes.js.
    initializeAdvancedModes(); 
}

/**
 * The p5.js draw() function. This runs repeatedly, creating the animation loop.
 * It delegates the main rendering logic to the advanced modes file.
 */
function draw() {
    // We delegate the actual rendering logic to `renderArtwork` in artwork-modes.js.
    renderArtwork();
}

/**
 * The p5.js windowResized() function. This runs automatically when the browser window is resized.
 * It adjusts the canvas size and delegates further resizing logic.
 */
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    // Delegate further resize handling to `handleResize` in artwork-modes.js.
    handleResize(); 
}

/**
 * The p5.js keyPressed() function. This runs once every time a key is pressed.
 * It delegates key press handling to the advanced modes file.
 */
function keyPressed() {
    // Delegate key press handling to `handleKeyPress` in artwork-modes.js.
    handleKeyPress(key);
}
