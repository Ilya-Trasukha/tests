(function () {
  window.onhashchange = SwitchToStateFromURLHash;
  let SPAStateH = {};
  let spa = document.getElementById('spa');

  function SwitchToStateFromURLHash() {
    let URLHash = window.location.hash;
    let StateJSON = decodeURIComponent(URLHash.substr(1));
    if (StateJSON !== "") {
      SPAStateH = JSON.parse(StateJSON);
    } else {
      SPAStateH = {
        pagename: 'main'
      };
    }
    let PageHTML = "";
    switch (SPAStateH.pagename) {
      case 'main':
        PageHTML += header.render();
        PageHTML += menu.render();
        break;
      case 'rules':
        PageHTML += header.render();
        PageHTML += rules.render();
        break;
      case 'controls':
        PageHTML += header.render();
        PageHTML += controls.render();
        break;
      case 'about':
        PageHTML += header.render();
        PageHTML += about.render();
        break;
      case 'play':
        PageHTML += Game.render();
        break;
    }
    spa.innerHTML = PageHTML;
    document.getElementById('button-home').addEventListener('click', SwitchToMainPage);
    document.getElementById('play').addEventListener('click', SwitchToGamePage);
    document.getElementById('rules').addEventListener('click', SwitchToRulesPage);
    document.getElementById('controls').addEventListener('click', SwitchToControlsPage);
    document.getElementById('about').addEventListener('click', SwitchToAboutPage);
  }

  function SwitchToState(NewStateH) {
    location.hash = encodeURIComponent(JSON.stringify(NewStateH));
  }

  function SwitchToMainPage() {
    SwitchToState({
      pagename: 'main'
    });
  }

  function SwitchToGamePage() {
    SwitchToState({
      pagename: 'play'
    });
    location.reload();
  }

  function SwitchToRulesPage() {
    SwitchToState({
      pagename: 'rules'
    });
  }

  function SwitchToControlsPage() {
    SwitchToState({
      pagename: 'controls'
    });
  }

  function SwitchToAboutPage() {
    SwitchToState({
      pagename: 'about'
    });
  }
  SwitchToStateFromURLHash();
})();