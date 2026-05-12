export const pickupPoint = {
  x: 500,
  y: 300,
  width: 40,
  height: 40,
};

export const dropoffPoint = {
  x: 900,
  y: 500,
  width: 40,
  height: 40,
};

export let hasOrder = false;

export function setHasOrder(value) {
  hasOrder = value;
}

export function movePointToRandomPosition(point, canvas) {
  point.x = Math.random() * (canvas.width - point.width);
  point.y = Math.random() * (canvas.height - point.height);
}