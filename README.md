# Flappy Bird NBU

This project is a lightweight browser game inspired by the classic **Flappy Bird**.
It is implemented using the [p5.js](https://p5js.org/) library to handle
drawing and animation, keeping the gameplay logic similar to the original
vanilla implementation.
This version adds a distant city skyline, grassy plains and glossy 3D pipes for extra polish.

## Gameplay

* Press `Space`, `ArrowUp` or click to make the bird flap upward.
* Avoid the green pipes that scroll from right to left.
* Each time you successfully pass a set of pipes, your score increases.
* Press `P` or use the on-screen button to pause and resume the game.
* The game restarts automatically when the bird collides with a pipe or the
  ground.
* When paused a short tune plays until the game is resumed.
* Background clouds move across the sky and are rendered with round overlapping
  circles for a more natural look. Pipe speed has been increased for a faster
  game pace and colors of the pipes change as your score grows.
* Simple sound effects are generated with the Web Audio API for flapping,
  scoring, winning milestones and losing.

## How to Run

Open `index.html` in a modern web browser. The game starts immediately.
Use keyboard or mouse input to control the bird as described above.

## Exit Code

A minimal example for stopping the animation loop can be found in
`EXIT_CODE.js`. Calling `exitGame()` from that file cancels the animation
frame used by the game loop.

---

This repository contains only the basic game files and does not require
additional dependencies.

## Recent Updates

* Bird now also loses when touching the ground.
* Score display is black and uses an even larger font for better visibility.
* A short melody plays while the game is paused.

Latest changes introduced in commit `142741e`.
