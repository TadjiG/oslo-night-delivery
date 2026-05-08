import { player, keys } from "./player.js";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

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

function drawTitle() {
  ctx.fillStyle = "white";
  ctx.font = "32px Arial";
  ctx.fillText("Oslo Night Delivery", 50, 60);
}

function updatePlayer() {
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

function gameLoop() {
  drawBackground();

  updatePlayer();

  drawTitle();
  drawPlayer();

  requestAnimationFrame(gameLoop);
}

gameLoop();