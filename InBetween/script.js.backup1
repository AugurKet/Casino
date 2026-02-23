// ================================
// IN-BETWEEN MULTIPLAYER (ENHANCED)
// ================================

let players = [];
let pool = 0;
let deck = [];
let currentPlayerIndex = 0;
let anteAmount = 0;
let revealInterval = null;

const suits = ["♠","♥","♦","♣"];
const values = [
  {name:"A",value:1},
  {name:"2",value:2},{name:"3",value:3},{name:"4",value:4},
  {name:"5",value:5},{name:"6",value:6},{name:"7",value:7},
  {name:"8",value:8},{name:"9",value:9},{name:"10",value:10},
  {name:"J",value:11},{name:"Q",value:12},{name:"K",value:13}
];

// ---------- DECK ----------

function createDeck(){
  deck = [];
  suits.forEach(s=>{
    values.forEach(v=>{
      deck.push({suit:s,name:v.name,value:v.value});
    });
  });
}

function shuffleDeck(){
  for(let i = deck.length - 1; i > 0; i--){
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
}

// ---------- START ----------

function startGame(){

  const numPlayers = parseInt(document.getElementById("numPlayers").value);
  anteAmount = parseInt(document.getElementById("ante").value);

  if(!numPlayers || numPlayers < 2 || numPlayers > 10){
    alert("Players must be between 2–10");
    return;
  }

  if(!anteAmount || anteAmount <= 0){
    alert("Ante must be at least 1");
    return;
  }

  players = [];
  pool = 0;
  currentPlayerIndex = 0;

  createDeck();
  shuffleDeck();

  for(let i=0;i<numPlayers;i++){
    const name = prompt(`Enter name for Player ${i+1}`) || `Player ${i+1}`;
    players.push({
      name: name,
      bankroll: 100,
      total: 0,
      card1: null,
      card2: null
    });
  }

  collectAnte();

  document.getElementById("setup").classList.add("hidden");
  document.getElementById("game").classList.remove("hidden");

  dealNewRound();
}

function collectAnte(){
  players.forEach(p=>{
    if(p.bankroll >= anteAmount){
      p.bankroll -= anteAmount;
      pool += anteAmount;
    }
  });
}

// ---------- DEAL ----------

function dealNewRound(){

  if(pool === 0){
    endGame();
    return;
  }

  if(deck.length < players.length * 3){
    createDeck();
    shuffleDeck();
  }

  players.forEach(p=>{
    p.card1 = deck.pop();
    p.card2 = deck.pop();
  });

  renderPlayers();
  updatePool();

  currentPlayerIndex = 0;
  startTurn();
}

// ---------- RENDER ----------

function renderPlayers(){

  const area = document.getElementById("playersArea");
  area.innerHTML = "";

  players.forEach((p,index)=>{

    const totalDisplay = p.total >= 0 ? `(+${p.total})` : `(${p.total})`;

    const bgColor = index === currentPlayerIndex
      ? "#39FF14"   // Neon Green
      : "#355E3B";  // Hunter Green

    area.innerHTML += `
      <div class="playerCard" style="background-color:${bgColor}; transition:0.3s;">
        <h3>${p.name} ${totalDisplay}</h3>
        <div>💰 ${p.bankroll}</div>
        <div class="cards">
          ${formatCard(p.card1)} ${formatCard(p.card2)}
        </div>
      </div>
    `;
  });
}

function formatCard(c){
  return `${c.name}${c.suit}`;
}

function updatePool(){
  document.getElementById("poolAmount").innerText = pool;
}

// ---------- TURN ----------

function startTurn(){

  if(currentPlayerIndex >= players.length){
    setTimeout(dealNewRound, 1500);
    return;
  }

  renderPlayers();

  const player = players[currentPlayerIndex];

  if(player.bankroll <= 0){
    immediateTopUp(player);
  }

  const maxBet = Math.min(pool, player.bankroll);

  document.getElementById("turnArea").innerHTML = `
    <div style="display:flex; justify-content:center; gap:20px;">
      <div class="turnBox" style="width:420px;">
        <h3>${player.name}'s Turn</h3>
        <label>Bet (max ${maxBet})</label>
        <input type="number" id="betAmount" min="1" max="${maxBet}" style="width:120px;">
        <button onclick="resolveTurn()">Bet</button>
        <button onclick="skipTurn()">Skip</button>
      </div>

      <div class="turnBox" id="revealBox" style="width:150px; display:flex; align-items:center; justify-content:center; font-size:28px;">
        ?
      </div>
    </div>
  `;
}

function skipTurn(){
  currentPlayerIndex++;
  startTurn();
}

// ---------- BANKRUPT ----------

function immediateTopUp(player){
  const topUp = confirm(`${player.name} is bankrupt. Top up now?`);
  if(topUp){
    const amt = parseInt(prompt("Enter top-up amount:"));
    if(amt && amt > 0){
      player.bankroll += amt;
    }
  }
}

// ---------- RESOLVE ----------

function resolveTurn(){

  const bet = parseInt(document.getElementById("betAmount").value);
  const player = players[currentPlayerIndex];
  const maxBet = Math.min(pool, player.bankroll);

  if(!bet || bet <= 0 || bet > maxBet){
    alert("Invalid bet.");
    return;
  }

  const third = deck.pop();

  const revealBox = document.getElementById("revealBox");

  // Fast spinning animation
  revealInterval = setInterval(()=>{
    const randomCard = deck[Math.floor(Math.random()*deck.length)];
    revealBox.innerText = formatCard(randomCard);
  }, 50);

  setTimeout(()=>{

    clearInterval(revealInterval);
    revealBox.innerText = formatCard(third);

    const min = Math.min(player.card1.value, player.card2.value);
    const max = Math.max(player.card1.value, player.card2.value);

    let resultText = "";

    if(third.value > min && third.value < max){
      pool -= bet;
      player.bankroll += bet;
      player.total += bet;
      resultText = "WIN 🎉";
    }
    else if(third.value === min || third.value === max){
      pool += bet * 2;
      player.bankroll -= bet * 2;
      player.total -= bet * 2;
      resultText = "DOUBLE LOSS 💀";
    }
    else{
      pool += bet;
      player.bankroll -= bet;
      player.total -= bet;
      resultText = "LOSE ❌";
    }

    if(player.bankroll <= 0){
      immediateTopUp(player);
    }

    updatePool();
    renderPlayers();

    if(pool === 0){
      setTimeout(endGame,1500);
      return;
    }

    setTimeout(()=>{
      currentPlayerIndex++;
      startTurn();
    },1500);

  },1500);
}

// ---------- END GAME ----------

function endGame(){

  const samePlayers = confirm("Pool empty! Play again with SAME players?");

  if(samePlayers){
    pool = 0;
    collectAnte();
    dealNewRound();
  } else {
    location.reload();
  }
}
