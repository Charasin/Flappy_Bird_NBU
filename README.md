# Flappy Bird NBU

This project is a lightweight browser game inspired by the classic **Flappy Bird**.
It is implemented using the [p5.js](https://p5js.org/) library to handle
drawing and animation, keeping the gameplay logic similar to the original
vanilla implementation.

## Gameplay

* Press `Space`, `ArrowUp` or click to make the bird flap upward.
* Avoid the green pipes that scroll from right to left.
* Each time you successfully pass a set of pipes, your score increases.
* The game restarts automatically when the bird collides with a pipe or the
  ground.
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
