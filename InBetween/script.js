let players = [];
let pool = 0;
let deck = [];
let currentPlayerIndex = 0;

const STARTING_BANKROLL = 100;
const PLAYER_BOX_COLOR = "#355E3B"; // Hunter Green

const suits = ["♠", "♥", "♦", "♣"];
const values = [
  { name: "A", value: 1 },
  { name: "2", value: 2 },
  { name: "3", value: 3 },
  { name: "4", value: 4 },
  { name: "5", value: 5 },
  { name: "6", value: 6 },
  { name: "7", value: 7 },
  { name: "8", value: 8 },
  { name: "9", value: 9 },
  { name: "10", value: 10 },
  { name: "J", value: 11 },
  { name: "Q", value: 12 },
  { name: "K", value: 13 }
];

function createDeck() {
  deck = [];
  suits.forEach(suit => {
    values.forEach(val => {
      deck.push({ suit: suit, name: val.name, value: val.value });
    });
  });
}

function shuffleDeck() {
  deck.sort(() => Math.random() - 0.5);
}

function dealTwoCards() {
  if (deck.length < players.length * 3) {
    createDeck();
    shuffleDeck();
  }

  players.forEach(player => {
    player.card1 = deck.pop();
    player.card2 = deck.pop();
  });
}

function startGame() {
  const numPlayers = parseInt(document.getElementById("numPlayers").value);
  const ante = parseInt(document.getElementById("ante").value);

  players = [];
  pool = 0;
  currentPlayerIndex = 0;

  createDeck();
  shuffleDeck();

  for (let i = 0; i < numPlayers; i++) {
    const name = prompt(`Enter name for Player ${i + 1}`);
    players.push({
      name: name || `Player ${i + 1}`,
      bankroll: STARTING_BANKROLL,
      card1: null,
      card2: null
    });
  }

  // Deduct ante
  players.forEach(p => {
    p.bankroll -= ante;
    pool += ante;
  });

  dealTwoCards();

  document.getElementById("setup").classList.add("hidden");
  document.getElementById("game").classList.remove("hidden");

  renderPlayers();
  updatePool();
  startTurn();
}

function renderPlayers() {
  const area = document.getElementById("playersArea");
  area.innerHTML = "";

  players.forEach(p => {
    area.innerHTML += `
      <div class="playerCard" style="background:${PLAYER_BOX_COLOR};">
        <h3 style="color:black; font-weight:bold;">${p.name}</h3>
        <div style="font-size:18px;">💰 ${p.bankroll}</div>
        <div class="cards">
          ${formatCard(p.card1)} &nbsp; ${formatCard(p.card2)}
        </div>
      </div>
    `;
  });
}

function formatCard(card) {
  const color = (card.suit === "♥" || card.suit === "♦") ? "red" : "black";
  return `<span style="color:${color}; font-weight:bold; font-size:22px;">
            ${card.name}${card.suit}
          </span>`;
}

function updatePool() {
  document.getElementById("poolAmount").innerHTML =
    `<span style="font-size:40px; font-weight:bold;">${pool}</span>`;
}

function startTurn() {

  const player = players[currentPlayerIndex];

  // Bankruptcy check
  if (player.bankroll <= 0) {
    const topUp = confirm(`${player.name} has no money. Top up?`);
    if (topUp) {
      const amount = parseInt(prompt("Enter top-up amount:"));
      if (amount && amount > 0) {
        player.bankroll += amount;
        renderPlayers();
      }
    } else {
      moveToNextPlayer();
      return;
    }
  }

  document.getElementById("turnArea").innerHTML = `
    <div class="turnBox">
      <h3>${player.name}'s Turn</h3>
      <p>💰 ${player.bankroll}</p>
      <label>Bet Amount (max ${Math.min(pool, player.bankroll)}):</label>
      <input type="number" id="betAmount" min="1" max="${Math.min(pool, player.bankroll)}">
      <br><br>
      <button onclick="resolveTurn()">Bet</button>
      <button onclick="skipTurn()" style="background:#64748b;">Skip</button>
    </div>
  `;
}

function skipTurn() {
  moveToNextPlayer();
}

function resolveTurn() {
  const bet = parseInt(document.getElementById("betAmount").value);
  const player = players[currentPlayerIndex];

  if (!bet || bet <= 0 || bet > pool || bet > player.bankroll) {
    alert("Invalid bet.");
    return;
  }

  const thirdCard = deck.pop();
  const min = Math.min(player.card1.value, player.card2.value);
  const max = Math.max(player.card1.value, player.card2.value);

  let resultMessage = "";

  if (thirdCard.value > min && thirdCard.value < max) {

    if (bet === pool) {
      player.bankroll += pool;
      renderPlayers();

      document.getElementById("turnArea").innerHTML = `
        <div class="turnBox">
          <h2>${player.name} WON THE ENTIRE POOL! 🏆</h2>
          <p>Winning Card: ${formatCard(thirdCard)}</p>
          <button onclick="newGameSamePlayers()">Same Players</button>
          <button onclick="newGameNewPlayers()">New Players</button>
        </div>
      `;
      return;
    }

    pool -= bet;
    player.bankroll += bet;
    resultMessage = "WIN 🎉";

  } else if (thirdCard.value === min || thirdCard.value === max) {
    pool += bet * 2;
    player.bankroll -= bet * 2;
    resultMessage = "DOUBLE LOSS 💀";
  } else {
    pool += bet;
    player.bankroll -= bet;
    resultMessage = "LOSE ❌";
  }

  updatePool();
  renderPlayers();

  document.getElementById("turnArea").innerHTML = `
    <div class="turnBox">
      <h3>${player.name}</h3>
      <p>Third Card: ${formatCard(thirdCard)}</p>
      <h2>${resultMessage}</h2>
      <button onclick="moveToNextPlayer()">NEXT</button>
    </div>
  `;
}

function moveToNextPlayer() {
  currentPlayerIndex++;

  if (currentPlayerIndex >= players.length) {
    startNewRound();
  } else {
    startTurn();
  }
}

function startNewRound() {
  currentPlayerIndex = 0;

  document.getElementById("turnArea").innerHTML = `
    <div class="turnBox">
      <h2>New Round 🎴</h2>
      <button onclick="continueRound()">Continue</button>
    </div>
  `;
}

function continueRound() {
  dealTwoCards();
  renderPlayers();
  startTurn();
}

// === End Game Options ===

function newGameSamePlayers() {
  const ante = parseInt(document.getElementById("ante").value);
  pool = 0;

  players.forEach(p => {
    p.bankroll -= ante;
    pool += ante;
  });

  dealTwoCards();
  currentPlayerIndex = 0;
  renderPlayers();
  updatePool();
  startTurn();
}

function newGameNewPlayers() {
  document.getElementById("game").classList.add("hidden");
  document.getElementById("setup").classList.remove("hidden");
}
