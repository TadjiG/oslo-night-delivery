const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

function drawBackground() {
  ctx.fillStyle = "#0f172a";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawTitle() {
  ctx.fillStyle = "white";
  ctx.font = "40px Arial";
  ctx.fillText("Oslo Night Delivery", 50, 80);

  ctx.font = "20px Arial";
  ctx.fillText("First playable build coming soon...", 50, 120);
}

function gameLoop() {
  drawBackground();
  drawTitle();

  requestAnimationFrame(gameLoop);
}

gameLoop();