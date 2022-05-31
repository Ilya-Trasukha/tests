const canvas = document.getElementById('breakout');
const ctx = canvas.getContext('2d');
document.addEventListener('keydown', keyDownHandler);
document.addEventListener('keyup', keyUpHandler);
document.addEventListener("mousemove", mouseMoveHandler);
document.addEventListener("touchmove", touchMoveHandler);


let game = {
  requestId: null,
  timeoutId: null,
  leftKey: false,
  rightKey: false,
  on: false,
  music: true
}
let paddle = {
  height: 20,
  width: 100,
  get y() {
    return canvas.height - this.height;
  }
}
let ball = {
  radius: 10
}
let brick = {
  rows: 5,
  cols: 10,
  get width() {
    return canvas.width / this.cols;
  },
  height: 30
}
let brickField = [];
let images = {
  background: new Image(),
  ball: new Image(),
  paddle: new Image()
}
const noOfHighScores = 10;

function onImageLoad(e) {
  resetGame();
  initBricks();
  resetPaddle();
  render();
  ctx.font = '50px ArcadeClassic';
  ctx.fillStyle = 'lime';
  ctx.fillText('PRESS SPACE/START', canvas.width / 2 - 170, canvas.height / 2);
};
images.background.addEventListener('load', onImageLoad);
images.background.src = './images/background.png';
images.ball.src = './images/ball.png';
images.paddle.src = './images/paddle.png';

const sounds = {
  ballLost: new Audio('./sounds/balllost.mp3'),
  breakout: new Audio('./sounds/breakout.mp3'),
  brick: new Audio('./sounds/brick.mp3'),
  gameOver: new Audio('./sounds/gameover.mp3'),
  levelCompleted: new Audio('./sounds/levelcompleted.mp3'),
  music: new Audio('./sounds/music.mp3'),
  paddle: new Audio('./sounds/paddle.mp3')
}

function play() {
  cancelAnimationFrame(game.requestId);
  clearTimeout(game.timeoutId);
  game.on = true;

  resetGame();
  resetBall();
  resetPaddle();
  initBricks();

  sounds.breakout.play();
  // Start music after starting sound ends.
  setTimeout(() => game.music && sounds.music.play(), 2000);

  animate();
}

function resetGame() {
  game.speed = 7;
  game.score = 0;
  game.level = 1;
  game.lives = 3;
  game.time = {
    start: performance.now(),
    elapsed: 0,
    refreshRate: 16
  };
}

function initSounds() {
  sounds.music.loop = true;
  for (const [key] of Object.entries(sounds)) {
    sounds[key].volume = 0.5;
  }
}

function resetBall() {
  ball.x = canvas.width / 2;
  ball.y = canvas.height - paddle.height - 2 * ball.radius;
  ball.dx = game.speed * (Math.random() * 2 - 1); // Random trajectory
  ball.dy = -game.speed; // Up
}

function resetPaddle() {
  paddle.x = (canvas.width - paddle.width) / 2;
  paddle.dx = game.speed + 7;
}

function initBricks() {
  brickField = [];
  const topMargin = 30;
  const colors = ['red', 'orange', 'yellow', 'blue', 'green'];
  for (let row = 0; row < brick.rows; row++) {
    for (let col = 0; col < brick.cols; col++) {
      brickField.push({
        x: col * brick.width,
        y: row * brick.height + topMargin,
        height: brick.height,
        width: brick.width,
        color: colors[row],
        points: (5 - row) * 2,
        hitsLeft: row === 0 ? 2 : 1
      });
    }
  }
}

function animate(now = 0) {
  game.time.elapsed = now - game.time.start;
  if (game.time.elapsed > game.time.refreshRate) {
    game.time.start = now;
    render();
    update();
    detectCollision();
    detectBrickCollision();
    if (isLevelCompleted() || isGameOver()) return;
  }
  game.requestId = requestAnimationFrame(animate);
}

function render() {
  ctx.drawImage(images.background, 0, 0, canvas.width, canvas.height);
  ctx.drawImage(images.ball, ball.x, ball.y, 2 * ball.radius, 2 * ball.radius);
  ctx.drawImage(images.paddle, paddle.x, paddle.y, paddle.width, paddle.height);
  drawBricks();
  drawScore();
  drawLives();
}

function update() {
  ball.x += ball.dx;
  ball.y += ball.dy;
  if (game.rightKey) {
    paddle.x += paddle.dx;
    if (paddle.x + paddle.width > canvas.width) {
      paddle.x = canvas.width - paddle.width;
    }
  }
  if (game.leftKey) {
    paddle.x -= paddle.dx;
    if (paddle.x < 0) {
      paddle.x = 0;
    }
  }
}

function drawBricks() {
  brickField.forEach((brick) => {
    if (brick.hitsLeft) {
      ctx.fillStyle = brick.color;
      ctx.fillRect(brick.x, brick.y, brick.width, brick.height);
      ctx.strokeRect(brick.x, brick.y, brick.width, brick.height);
    }
  });
}

function drawScore() {
  ctx.font = '24px ArcadeClassic';
  ctx.fillStyle = 'white';
  const {
    level,
    score
  } = game;
  ctx.fillText(`Level: ${level}`, 5, 23);
  ctx.fillText(`Score: ${score}`, canvas.width / 2 - 50, 23);
}

function drawLives() {
  if (game.lives > 2) {
    ctx.drawImage(images.paddle, canvas.width - 150, 9, 40, 13);
  }
  if (game.lives > 1) {
    ctx.drawImage(images.paddle, canvas.width - 100, 9, 40, 13);
  }
  if (game.lives > 0) {
    ctx.drawImage(images.paddle, canvas.width - 50, 9, 40, 13);
  }
}

function detectCollision() {
  const hitTop = () => ball.y < 0;
  const hitLeftWall = () => ball.x < 0;
  const hitRightWall = () => ball.x + ball.radius * 2 > canvas.width;
  const hitPaddle = () =>
    ball.y + 2 * ball.radius > canvas.height - paddle.height &&
    ball.y + ball.radius < canvas.height &&
    ball.x + ball.radius > paddle.x &&
    ball.x + ball.radius < paddle.x + paddle.width;
  if (hitLeftWall()) {
    ball.dx = -ball.dx;
    ball.x = 0;
  }
  if (hitRightWall()) {
    ball.dx = -ball.dx;
    ball.x = canvas.width - 2 * ball.radius;
  }
  if (hitTop()) {
    ball.dy = -ball.dy;
    ball.y = 0;
  }
  if (hitPaddle()) {
    ball.dy = -ball.dy;
    ball.y = canvas.height - paddle.height - 2 * ball.radius;
    sounds.paddle.play();
    // TODO change this logic to angles with sin/cos
    // Change x depending on where on the paddle the ball bounces.
    // Bouncing ball more on one side draws ball a little to that side.
    const drawingConst = 5
    const paddleMiddle = 2;
    const algo = (((ball.x - paddle.x) / paddle.width) * drawingConst);
    ball.dx = ball.dx + algo - paddleMiddle;
  }
}

function detectBrickCollision() {
  let directionChanged = false;
  const isBallInsideBrick = (brick) =>
    ball.x + 2 * ball.radius > brick.x &&
    ball.x < brick.x + brick.width &&
    ball.y + 2 * ball.radius > brick.y &&
    ball.y < brick.y + brick.height;
  brickField.forEach((brick) => {
    if (brick.hitsLeft && isBallInsideBrick(brick)) {
      sounds.brick.currentTime = 0;
      sounds.brick.play();
      brick.hitsLeft--;
      if (brick.hitsLeft === 1) {
        brick.color = 'darkgray';
      }
      game.score += brick.points;
      if (!directionChanged) {
        directionChanged = true;
        detectCollisionDirection(brick);
      }
    }
  });
}

function detectCollisionDirection(brick) {
  const hitFromLeft = () => ball.x + 2 * ball.radius - ball.dx <= brick.x;
  const hitFromRight = () => ball.x - ball.dx >= brick.x + brick.width;

  if (hitFromLeft() || hitFromRight()) {
    ball.dx = -ball.dx;
  } else { // Hit from above or below
    ball.dy = -ball.dy;
  }
}

function keyDownHandler(e) {
  if (!game.on && e.key === ' ') {
    play();
  }
  if (game.on && (e.key === 'm' || e.key === 'M')) {
    game.music = !game.music;
    game.music ? sounds.music.play() : sounds.music.pause();
  }
  if (e.key === 'ArrowUp') {
    volumeUp();
  }
  if (e.key === 'ArrowDown') {
    volumeDown();
  }
  if (e.key === 'ArrowRight') {
    game.rightKey = true;
  } else if (e.key === 'ArrowLeft') {
    game.leftKey = true;
  }
}

function keyUpHandler(e) {
  if (e.key === 'ArrowRight') {
    game.rightKey = false;
  } else if (e.key === 'ArrowLeft') {
    game.leftKey = false;
  }
}

function mouseMoveHandler(e) {
  const mouseX = e.clientX - canvas.getBoundingClientRect().bottom;
  const isInsideCourt = () => mouseX > 0 && mouseX < canvas.width;
  if (isInsideCourt()) {
    paddle.x = mouseX - paddle.width / 2;
  }
}

function touchMoveHandler(e) {
  const touchX = e.touches[0].clientX - canvas.getBoundingClientRect().top;
  const isInsideCourt = () => touchX > 0 && touchX < canvas.width;
  if (isInsideCourt()) {
    paddle.x = touchX - paddle.width / 2;
  }
}

function isLevelCompleted() {
  const levelComplete = brickField.every((b) => b.hitsLeft === 0);
  if (levelComplete) {
    initNextLevel();
    resetBall();
    resetPaddle();
    initBricks();
    game.timeoutId = setTimeout(() => {
      animate();
      sounds.music.play();
    }, 3000);
    return true;
  }
  return false;
}

function initNextLevel() {
  game.level++;
  game.speed++;
  sounds.music.pause();
  sounds.levelCompleted.play();
  ctx.font = '50px ArcadeClassic';
  ctx.fillStyle = 'yellow';
  ctx.fillText(`LEVEL ${game.level}!`, canvas.width / 2 - 80, canvas.height / 2);
}

function isGameOver() {
  const isBallLost = () => ball.y - ball.radius > canvas.height;

  if (isBallLost()) {
    game.lives -= 1;
    sounds.ballLost.play();
    if (game.lives === 0) {
      gameOver();
      return true;
    }
    resetBall();
    resetPaddle();
  }
  return false;
}

function gameOver() {
  game.on = false;
  sounds.music.pause();
  sounds.currentTime = 0;
  sounds.gameOver.play();
  ctx.font = '50px ArcadeClassic';
  ctx.fillStyle = 'red';
  ctx.fillText('GAME OVER', canvas.width / 2 - 100, canvas.height / 2);
  checkHighScore(game.score);
}

function showHighScores() {
  const highScores = JSON.parse(localStorage.getItem('highScores')) || [];
  const highScoreList = document.getElementById('highScores');

  highScoreList.innerHTML = highScores
    .map((score) => `<li>${score.score} - ${score.name}`)
    .join('');
}

function checkHighScore(score) {
  const highScores = JSON.parse(localStorage.getItem('highScores')) || [];
  const lowestScore = highScores[noOfHighScores - 1] ?.score ?? 0;

  if (score > lowestScore) {
    const name = prompt('You got a highscore! Enter name:');
    if (name === null) {
      showHighScores();
      return;
    } else {
      const newScore = {
        score,
        name
      };
      saveHighScore(newScore, highScores);
      showHighScores();
    }
  }
}

function saveHighScore(score, highScores) {
  highScores.push(score);
  highScores.sort((a, b) => b.score - a.score);
  highScores.splice(NO_OF_HIGH_SCORES);
  localStorage.setItem('highScores', JSON.stringify(highScores));
}

function volumeDown() {
  if (sounds.music.volume >= 0.1) {
    for (const [key] of Object.entries(sounds)) {
      sounds[key].volume -= 0.1;
    }
  }
}


function volumeUp() {
  if (sounds.music.volume <= 0.9) {
    for (const [key] of Object.entries(sounds)) {
      sounds[key].volume += 0.1;
    }
  }
}

initSounds();
showHighScores();