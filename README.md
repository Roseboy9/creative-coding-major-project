## User Instructions

My variation of our team’s group artwork offers diverse user experiences through a series of interactive and autonomous modes. You can switch between these states using specific keyboard inputs:

- **Initial State (Zoom Mode – Default):**
    - **How it works:** When the artwork first loads, it defaults to _Zoom Mode_. In this mode, the central artwork (the dove and olive branch) responds to the vertical position of your mouse. 
    - **Interaction:** Move your mouse vertically (Y-axis) across the screen. The dove and olive branch will smoothly scale in or out depending on how close your mouse is to the vertical centre of the canvas. Moving the mouse closer to the centre zooms out, while moving it towards the top or bottom edges zooms in.
- **‘M’ Key (Toggle Float Mode):** 
    - **How it works:** Press the ‘M’ key (either uppercase or lowercase) to cycle between the available modes. If you are in _Zoom Mode_, pressing ‘M’ switches you to _Float Mode_. If you are in _Float Mode_ or _Pixelate_ & _Glitch Mode_, pressing ‘M’ returns you to _Zoom Mode_. 
    - **Interaction:** In _Float Mode_, the dove and olive branch become autonomous, continuously floating horizontally from left to right across the screen. When they move completely off the right edge, they seamlessly reappear from the far left, creating an endless loop. They also exhibit a natural, organic bobbing motion.
- **‘P’ Key (Toggle Pixelate & Glitch Effect):** 
    - **How it works:** This mode is an extension of _Float Mode_. You must first be in _Float Mode_ (by pressing ‘M’) to activate this effect. Press the ‘P’ key (or ‘p’) to toggle the _Pixelate_ & _Glitch_ visual effect on or off. 
    - **Interaction:** The dove and olive branch continue their autonomous horizontal floating and organic bobbing motion, as in _Float Mode_, but with an added split-screen visual transformation. When they are in the left half of the screen, they retain their normal, smooth appearance. However, once any part crosses the horizontal centre into the right half, that portion becomes pixelated and exhibits a subtle, randomised glitch effect. The background dots and overall canvas background remain smooth and unaffected, ensuring the visual transformation is focused solely on the main subject.

These three states are adapted from class exercises in Week 7 _(Object-Oriented Programming)_ and Week 10 _(Easing & Transformation)_.

## Overview of Approach
My primary method of variation is user input (mouse and keyboard), with a distinct inclusion of Perlin noise and reliance on time-based animation for core movement.
- **Mouse Interaction:** In _Zoom Mode_, the vertical position of the mouse (mouseY) directly controls the scaling factor of the main artwork. 
- **Keyboard Interaction (‘M’ and ‘P’ keys):** These keys toggle between the different interactive and autonomous display modes. 
- **Time (frameCount):** The continuous horizontal drifting motion of the dove in both _Float_ and _Pixelate_ & _Glitch_ modes is achieved by incrementally updating its X-position in each animation frame. 
- **Perlin Noise (noise()):** The organic up-and-down bobbing motion of the dove in _Float_ and _Pixelate_ & _Glitch_ modes is generated using Perlin noise, providing a natural, non-repetitive undulating movement.

I focused on dynamically altering the movement (horizontal drift, vertical bobbing), overall size (zoom), and visual rendering style (smooth vs. pixelated/glitched) of the central dove and olive branch. The background dots also contribute to the animation by providing consistent movement and, in Zoom Mode, a complementary scaling effect.

My individual variation stands out from Shuyao’s and Shannon’s through its multi-layered, interactive, and spatially aware dynamism. Unlike Shuyao’s focus on audio-driven particle animation or Shannon’s use of time triggers for discrete animation events, my approach centres on providing a multi-mode user experience where the primary artwork’s behaviour is directly controlled by user input. My piece uniquely features autonomous yet organically bobbing movement (via Perlin noise) and a conditional, split-screen transformation that pixelates and glitches the dove only when it crosses a specific spatial boundary—a level of targeted, real-time visual complexity not present in simpler, single-input or event-driven animations.

## Technical Overview
My code animates the group artwork through a modular, object-oriented design and distinct control flow. The project is organised into two _.js_ files: _sketch.js_ handles the p5.js setup and drawing delegation, while _artwork-modes.js_ contains mode logic and advanced animations. This separation promotes code organisation and maintainability, aligning with semester topics on _Programming Libraries (p5.js)_ and _Advanced Topics – OOP, Prototypes, Classes_.

From the group code, the main visual components—_Bird and Background_—are implemented as classes, encapsulating properties and behaviours. In my variation, the Bird class was refactored with an internal *_drawShapes(g)* method, allowing its form to be drawn to any graphics context, including an off-screen buffer.

I introduced mode management to drive the artwork’s interactivity. A *currentMode* variable tracks the active display state. The *keyPressed()* function, which calls *handleKeyPress()* in *artwork-modes.js*, uses conditionals (*if/else if* statements) to update currentMode based on ‘M’ and ‘P’ key presses. The *draw()* loop (calling *renderArtwork()* in *artwork-modes.js*) also uses conditionals to execute specific rendering and animation logic for the active mode.

Distinct animations are used for movement and visual effects. In *Float* and *Pixelate* modes, autonomous movement occurs as *currentBird.offsetX* increments each frame, with seamless looping by resetting its position off-screen. This leverages JavaScript functions and operators, and the continuous nature of *draw()*. For vertical bobbing, bobbingOffset is derived from noise(*bobbingNoiseOffset*), with *bobbingNoiseOffset* incrementing slowly to create a non-repeating, organic oscillation. The *lerp()* function (from Easing and Transformations) smooths *bird.offsetY* towards this target. In *Zoom Mode*, *targetZoomScale* is calculated by mapping *mouseY*, and *zoomScale* interpolates towards this target using *lerp()*, creating a responsive zoom effect.

The Split-Screen Pixelation and Glitch effect uses an off-screen graphics buffer (*pGraphics*) created with *createGraphics()* in p5.js. Although this is a core technique from programming libraries such as p5.js, it was beyond the scope of this semester’s coursework. The smooth dove and olive branch are first drawn onto *pGraphics*. Then, in the *draw()* loop, the left half of *pGraphics* is copied directly to the main canvas using *image()*. For the right half, I iterate through *pixelSize* square blocks. For each block, *pGraphics.get(x, y)* samples the colour. If the sampled pixel has colour content, I draw a *rect()* on the main canvas using that colour, with random() displacement and size variation to create the glitch effect.

Finally, I retain the group’s *windowResized()* logic, now delegated to *handleResize()* in *artwork-modes.js*, to adjust canvas size and recalculate base scaling and offsets. This ensures the artwork maintains proportions and responsiveness across different screen sizes.

## External References
My design principles were primarily based on standard practices within the p5.js library and JavaScript, as taught during semester lectures and tutorials. However, the *createGraphics()* function—fundamental to the *Split-Screen Pixelation* and *Glitch* effect—was sourced from the p5.js Reference documentation (specifically, the entry for *createGraphics()*). This function was not explicitly covered in class lectures.

It played a crucial role in my project by enabling the creation of an off-screen rendering canvas (a graphics buffer). This capability was essential for the following reasons:
1.	**Selective Effects:**
It allowed me to draw the dove and olive branch smoothly onto this hidden buffer first. I could then process and manipulate the pixels from this buffer exclusively for the right half of the screen—applying pixelation and glitch effects—without affecting the background or requiring complex masking techniques.
2.	**Maintaining Background Integrity:**
Without *createGraphics()*, achieving the effect of a glitched dove on a normal background, with a clearly defined dividing line, would have been significantly more complex or potentially impossible to render efficiently in real time. This function enabled me to isolate the visual transformation to only the main subject, preserving the integrity of the background and enhancing the overall clarity of the effect.