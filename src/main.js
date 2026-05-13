import { player, keys } from "./player.js";
import {
  pickupPoint,
  dropoffPoint,
  hasOrder,
  setHasOrder,
  movePointToRandomRoad,
} from "./delivery.js";
import {
  createRoads,
  createBuildings,
  createStreetLights,
} from "./map.js";
import { cars } from "./traffic.js";
import { chargingStations } from "./chargingStations.js";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
let money = 0;
let battery = 100;
let gameOver = false;
let collisionCooldown = 0;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const roads = createRoads(canvas);
const buildings = createBuildings();
const streetLights = createStreetLights();

function drawBackground() {
  ctx.fillStyle = "#0f172a";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawRoads() {
  ctx.fillStyle = "#334155";

  roads.forEach((road) => {
    ctx.fillRect(road.x, road.y, road.width, road.height);
  });
}

function drawRoadLines() {
  ctx.strokeStyle = "#facc15";
  ctx.lineWidth = 4;

  roads.forEach((road) => {
    ctx.beginPath();

    if (road.width > road.height) {
      ctx.moveTo(road.x, road.y + road.height / 2);
      ctx.lineTo(road.x + road.width, road.y + road.height / 2);
    } else {
      ctx.moveTo(road.x + road.width / 2, road.y);
      ctx.lineTo(road.x + road.width / 2, road.y + road.height);
    }

    ctx.stroke();
  });
}

function drawBuildings() {
  ctx.fillStyle = "#1e293b";

  buildings.forEach((building) => {
    ctx.fillRect(
      building.x,
      building.y,
      building.width,
      building.height
    );
  });
}

function drawStreetLights() {
  streetLights.forEach((light) => {

    // Pole
    ctx.fillStyle = "#94a3b8";
    ctx.fillRect(light.x, light.y, 8, 30);

    // Light
    ctx.fillStyle = "#fde68a";
    ctx.beginPath();
    ctx.arc(light.x + 4, light.y, 10, 0, Math.PI * 2);
    ctx.fill();
  });
}

function drawCars() {

  cars.forEach((car) => {

    ctx.fillStyle = "#ef4444";

    ctx.fillRect(
      car.x,
      car.y,
      car.width,
      car.height
    );

  });

}

function drawChargingStations() {

  chargingStations.forEach((station) => {

    ctx.fillStyle = "#3b82f6";

    ctx.fillRect(
      station.x,
      station.y,
      station.width,
      station.height
    );

    // Lightning symbol
    ctx.fillStyle = "white";

    ctx.font = "24px Arial";

    ctx.fillText(
      "⚡",
      station.x + 8,
      station.y + 28
    );

  });

}

function updateCars() {

  cars.forEach((car) => {

    if (car.direction === "right") {
      car.x += car.speed;

      if (car.x > canvas.width) {
        car.x = -car.width;
      }
    }

    if (car.direction === "left") {
      car.x -= car.speed;

      if (car.x + car.width < 0) {
        car.x = canvas.width;
      }
    }

  });

}

function checkCarCollision() {

  if (collisionCooldown > 0) {
    collisionCooldown--;
    return;
  }

  cars.forEach((car) => {

    const collision =
      player.x < car.x + car.width &&
      player.x + player.width > car.x &&
      player.y < car.y + car.height &&
      player.y + player.height > car.y;

    if (collision) {

      battery -= 20;

      collisionCooldown = 60;

      if (battery < 0) {
        battery = 0;
      }

      if (player.direction === "right") {
        player.x -= 40;
      }

      if (player.direction === "left") {
        player.x += 40;
      }

      if (player.direction === "up") {
        player.y += 40;
      }

      if (player.direction === "down") {
        player.y -= 40;
      }

    }

  });

}

function checkChargingStationCollision() {

  chargingStations.forEach((station) => {

    const collision =
      player.x < station.x + station.width &&
      player.x + player.width > station.x &&
      player.y < station.y + station.height &&
      player.y + player.height > station.y;

    if (collision) {

      battery += 0.4;

      if (battery > 100) {
        battery = 100;
      }

    }

  });

}

function isCollidingWithBuilding(x, y) {

  return buildings.some((building) => {

    return (
      x < building.x + building.width &&
      x + player.width > building.x &&
      y < building.y + building.height &&
      y + player.height > building.y
    );

  });

}

function drawPlayer() {
  ctx.fillStyle = "#22c55e";
  ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawDeliveryPoints() {

  // Pickup point
  ctx.fillStyle = "#22c55e";
  ctx.fillRect(
    pickupPoint.x,
    pickupPoint.y,
    pickupPoint.width,
    pickupPoint.height
  );

  // Dropoff point
  if (hasOrder) {
    ctx.fillStyle = "#ef4444";

    ctx.fillRect(
      dropoffPoint.x,
      dropoffPoint.y,
      dropoffPoint.width,
      dropoffPoint.height
    );
  }
}

function drawTitle() {
  ctx.fillStyle = "white";

  ctx.font = "32px Arial";
  ctx.fillText("Oslo Night Delivery", 50, 60);

  ctx.font = "24px Arial";
  ctx.fillText(`Money: ${money} NOK`, 50, 100);
  ctx.fillText(`Battery: ${Math.floor(battery)}%`, 50, 130);
}

function drawGameOver() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "white";

  ctx.font = "64px Arial";
  ctx.fillText("GAME OVER", canvas.width / 2 - 200, canvas.height / 2);

  ctx.font = "32px Arial";
  ctx.fillText(
    `Final Money: ${money} NOK`,
    canvas.width / 2 - 140,
    canvas.height / 2 + 60
  );

  ctx.font = "24px Arial";
  ctx.fillText(
    "Press R to restart",
    canvas.width / 2 - 110,
    canvas.height / 2 + 120
  );
}

function updatePlayer() {

  if (battery <= 0) {
    battery = 0;
    gameOver = true;
    return;
  }

  let nextX = player.x;
  let nextY = player.y;

  if (keys["w"]) {
    nextY -= player.speed;
    player.direction = "up";
  }

  if (keys["s"]) {
    nextY += player.speed;
    player.direction = "down";
  }

  if (keys["a"]) {
    nextX -= player.speed;
    player.direction = "left";
  }

  if (keys["d"]) {
    nextX += player.speed;
    player.direction = "right";
  }

  if (!isCollidingWithBuilding(nextX, nextY)) {
    player.x = nextX;
    player.y = nextY;
  }

  const isMoving =
    keys["w"] ||
    keys["s"] ||
    keys["a"] ||
    keys["d"];

  if (isMoving && battery > 0) {
    battery -= 0.05;
  }

  // Screen boundaries
  if (player.x < 0) {
    player.x = 0;
  }

  if (player.y < 0) {
    player.y = 0;
  }

  if (player.x + player.width > canvas.width) {
    player.x = canvas.width - player.width;
  }

  if (player.y + player.height > canvas.height) {
    player.y = canvas.height - player.height;
  }
}

function checkDeliveryCollision() {

  // Pickup collision
  const pickupCollision =
    player.x < pickupPoint.x + pickupPoint.width &&
    player.x + player.width > pickupPoint.x &&
    player.y < pickupPoint.y + pickupPoint.height &&
    player.y + player.height > pickupPoint.y;

  if (pickupCollision && !hasOrder) {

    setHasOrder(true);

   movePointToRandomRoad(dropoffPoint, roads);
  }

  // Dropoff collision
  const dropoffCollision =
    player.x < dropoffPoint.x + dropoffPoint.width &&
    player.x + player.width > dropoffPoint.x &&
    player.y < dropoffPoint.y + dropoffPoint.height &&
    player.y + player.height > dropoffPoint.y;

  if (dropoffCollision && hasOrder) {

    money += 100;

    battery += 20;

    if (battery > 100) {
      battery = 100;
    }

    setHasOrder(false);

    movePointToRandomRoad(pickupPoint, roads);
  }
}

function restartGame() {
  money = 0;
  battery = 100;
  gameOver = false;
  collisionCooldown = 0;

  player.x = 120;
  player.y = 260;
  player.direction = "right";

  movePointToRandomRoad(pickupPoint, roads);
  movePointToRandomRoad(dropoffPoint, roads);
  setHasOrder(false);
}

function gameLoop() {
  drawBackground();

  drawRoads();
  drawRoadLines();
  drawBuildings();
  drawStreetLights();
  drawCars();
  drawChargingStations();

  if (!gameOver) {
  updatePlayer();
  updateCars();
  checkDeliveryCollision();
  checkCarCollision();
  checkChargingStationCollision();
}

  drawTitle();
  drawDeliveryPoints();
  drawPlayer();

  if (gameOver) {
    drawGameOver();
  }

  requestAnimationFrame(gameLoop);
}

window.addEventListener("keydown", (event) => {
  if (gameOver && event.key.toLowerCase() === "r") {
    restartGame();
  }
});

gameLoop();