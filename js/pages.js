const header = {
  render() {
    return `      
      <header class="header">
        <div class="home-button">
          <div class="button-home" id="button-home"><a href="#"></a></div>
        </div>
      </header>
    `;
  }
};
const menu = {
  render() {
    return `
      <div class="content">        
        <h1>Breakout <br> game</h1>     
          <nav class="main">
            <input type="button" value="Play" class="main_button_play" id="play">
            <input type="button" value="Rules" class="main_button" id="rules">
            <input type="button" value="Controls" class="main_button" id="controls">
            <input type="button" value="About" class="main_button" id="about">
          </nav>
      </div>
    `;
  }
};
const rules = {
  render() {
    return `
      <section class="rules">
        <h2>Rules:</h2>
          <div class="rules_cont">
            <p>In Breakout, a layer of bricks lines the top third of the screen and the goal is <br> to destroy them all by repeatedly bouncing a ball off a paddle into them.</p>
            <p>If the player's paddle misses the ball's rebound, they will lose a turn.<br>
            The player has three turns to try to clear  screen of bricks</p>  
          </div>      
      </section>
    `;
  }
};
const controls = {
  render() {
    return `
      <section class="controls">
      <h2>How To Play:</h2>
        <div class="controls_cont">
          <p>Play with Arrow keys or Mouse</p>
          <p>Music mute: M</p>
          <p>Volume: ↑ ↓</p>
          <p>Start: Space</p>
          <input type="button" value="Play" class="button_play" id="play"> 
        </div>      
      </section>
    `;
  }
};
const about = {
  render() {
    return `
      <section class="about">
        <h2>About:</h2>
        <div class="about_cont">
          <p>Made in China</p>
          <p>by Ilya Trasukha</p>
          <p>copyright © 2022</p>
          <p>All rights reserved</p>  
        </div>      
      </section>
    `;
  }
};

const Game = {
  render() {
    return `
      <div class="top">
        <div class="home-button">
          <div class="button-home" id="button-home"><a href="#"></a></div>
        </div>
      </div>
      <div class="scores">
        <h2>HIGH SCORES</h2>
        <ol id="highScores"></ol>
      </div>
        <button id="run-button" onclick="play()">START</button>
        <canvas id="breakout" width="800" height="600" style="cursor: none"></canvas>
    `;
  }
};