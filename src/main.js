import { player, keys } from "./player.js";
import { deliveryPoint } from "./delivery.js";
import { createRoads, createBuildings } from "./map.js";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
let money = 0;
let battery = 100;
let gameOver = false;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const roads = createRoads(canvas);
const buildings = createBuildings();

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

function drawPlayer() {
  ctx.fillStyle = "#22c55e";
  ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawDeliveryPoint() {
  ctx.fillStyle = "#facc15";
  ctx.fillRect(
    deliveryPoint.x,
    deliveryPoint.y,
    deliveryPoint.width,
    deliveryPoint.height
  );
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

  if (keys["w"]) {
    player.y -= player.speed;
  }

  if (keys["s"]) {
    player.y += player.speed;
  }

  if (keys["a"]) {
    player.x -= player.speed;
  }

  if (keys["d"]) {
    player.x += player.speed;
  }

  const isMoving = keys["w"] || keys["s"] || keys["a"] || keys["d"];

  if (isMoving && battery > 0) {
    battery -= 0.05;
  }

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
  const collision =
    player.x < deliveryPoint.x + deliveryPoint.width &&
    player.x + player.width > deliveryPoint.x &&
    player.y < deliveryPoint.y + deliveryPoint.height &&
    player.y + player.height > deliveryPoint.y;

  if (collision) {
    money += deliveryPoint.reward;

    battery += 15;

    if (battery > 100) {
  battery = 100;
}
    
    deliveryPoint.x = Math.random() * (canvas.width - deliveryPoint.width);

    deliveryPoint.y = Math.random() * (canvas.height - deliveryPoint.height);
  }
}

function restartGame() {
  money = 0;
  battery = 100;
  gameOver = false;

  player.x = 100;
  player.y = 100;

  deliveryPoint.x = 500;
  deliveryPoint.y = 300;
}

window.addEventListener("keydown", (event) => {
  if (gameOver && event.key.toLowerCase() === "r") {
    restartGame();
  }
});

function gameLoop() {
  drawBackground();
  drawRoads();
  drawRoadLines();
  drawBuildings();

  if (!gameOver) {
    updatePlayer();
    checkDeliveryCollision();
  }

  drawTitle();
  drawDeliveryPoint();
  drawPlayer();

  if (gameOver) {
    drawGameOver();
  }

  requestAnimationFrame(gameLoop);
}

gameLoop();