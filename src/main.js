import { player } from "./player.js";

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

function gameLoop() {
  drawBackground();
  drawTitle();
  drawPlayer();

  requestAnimationFrame(gameLoop);
}

gameLoop();