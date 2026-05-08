export function createRoads(canvas) {
  return [
    { x: 0, y: 220, width: canvas.width, height: 80 },
    { x: 300, y: 0, width: 80, height: canvas.height },
    { x: 700, y: 0, width: 80, height: canvas.height },
    { x: 0, y: 520, width: canvas.width, height: 80 },
  ];
}

export function createBuildings() {
  return [
    { x: 40, y: 40, width: 180, height: 120 },
    { x: 400, y: 50, width: 180, height: 120 },
    { x: 850, y: 70, width: 220, height: 100 },

    { x: 80, y: 650, width: 220, height: 140 },
    { x: 500, y: 680, width: 180, height: 120 },
    { x: 900, y: 650, width: 240, height: 150 },
  ];
}