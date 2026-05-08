export const player = {
  x: 100,
  y: 100,
  width: 32,
  height: 32,
  speed: 4,
};

export const keys = {};

window.addEventListener("keydown", (event) => {
  keys[event.key.toLowerCase()] = true;
});

window.addEventListener("keyup", (event) => {
  keys[event.key.toLowerCase()] = false;
});