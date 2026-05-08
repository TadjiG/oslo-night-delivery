import { player, keys } from "./player.js";
import { deliveryPoint } from "./delivery.js";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
let money = 0;
let battery = 100;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

function drawBackground() {
  ctx.fillStyle = "#0f172a";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
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

function updatePlayer() {
    if (battery <= 0) {
  battery = 0;
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

  // Keep player inside the screen
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

function gameLoop() {
  drawBackground();

  updatePlayer();
  checkDeliveryCollision();

  drawTitle();
  drawDeliveryPoint();
  drawPlayer();

  requestAnimationFrame(gameLoop);
}

gameLoop();