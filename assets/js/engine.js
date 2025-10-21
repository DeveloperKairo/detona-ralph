const state = {
  view:{
    squares: document.querySelectorAll(".square"),
    timeLeft: document.querySelector("#timeleft"),
    score: document.querySelector("#score"),
    lives: document.querySelector("#lives"),
    restartButton: document.querySelector("#btn-restart"),
  },
  values:{
    gameVelocity: 1000,
    hitPosition: null,
    result: 0,
    currentTime: 60,
    lives: 3,
  },
  actions:{
    timerId: null,
    countDownTimerId: null,
  }
};

function gameOver(){
  clearInterval(state.actions.countDownTimerId);
  clearInterval(state.actions.timerId);
  playSound("gameover.mp3");
  showModal();
}

function showModal(){
  const modal = document.getElementById("gameover-modal");
  const score = document.getElementById("final-score");
  score.textContent = `Seu resultado foi: ${state.values.result}`;
  modal.classList.remove("hidden");
}

function countDown(){
  state.values.currentTime--;
  state.view.timeLeft.textContent = state.values.currentTime;
  if (state.values.currentTime <= 0){
    gameOver();
  }
}

function playSound(audioName){
  let audio = new Audio(`./assets/audios/${audioName}`);
  audio.volume = 0.2;
  audio.play();
}

function randomSquare(){
  state.view.squares.forEach((square) => {
    square.classList.remove("enemy");
  });
  let randomNumber = Math.floor(Math.random() * state.view.squares.length);
  let randomSquare = state.view.squares[randomNumber];
  randomSquare.classList.add("enemy");
  state.values.hitPosition = randomSquare.id;
}

function updateLives(){
  state.view.lives.textContent = `x${state.values.lives}`;
}

function addListenerHitBox(){
  state.view.squares.forEach((square) => {
    square.addEventListener("mousedown", () => {
      if(square.id === state.values.hitPosition){
        state.values.result++;
        state.view.score.textContent = state.values.result;
        state.values.hitPosition = null;
        playSound("hit.m4a");
      } else {
        if (state.values.lives > 0){
          state.values.lives--;
          updateLives();
          if (state.values.lives === 0){
            gameOver();
          }
        }
      }
    });
  });
}

function addListenerNewGame(){
  state.view.restartButton.addEventListener("click", resetGame);
}

function resetGame(){
  state.values.currentTime = 60;
  state.values.lives = 3;
  state.values.result = 0;
  state.view.score.textContent = 0;
  state.view.timeLeft.textContent = 60;
  updateLives();
  document.getElementById("gameover-modal").classList.add("hidden");
  state.view.squares.forEach(sq => sq.classList.remove("enemy"));
  state.values.hitPosition = null;
  clearInterval(state.actions.countDownTimerId);
  clearInterval(state.actions.timerId);
  state.actions.timerId = setInterval(randomSquare, state.values.gameVelocity);
  state.actions.countDownTimerId = setInterval(countDown, 1000);
}

function startGameTimers() {
  state.actions.timerId = setInterval(randomSquare, state.values.gameVelocity);
  state.actions.countDownTimerId = setInterval(countDown, 1000);
}

function init() {
  updateLives();
  state.view.score.textContent = 0;
  state.view.timeLeft.textContent = 60;
  addListenerHitBox();
  addListenerNewGame();
  startGameTimers();
}

init();
