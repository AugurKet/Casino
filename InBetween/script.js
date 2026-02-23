/* ================================
   IN-BETWEEN VIP EDITION
   High-End Macau Lounge Version
================================ */

let players = [];
let currentPlayerIndex = 0;
let pool = 0;
let deck = [];
let gameActive = false;

/* ================================
   CARD + DECK
================================ */

const suits = ["♠", "♥", "♦", "♣"];
const values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

function getCardValue(val) {
  if (val === "A") return 1; // A = 1
  if (["J", "Q", "K"].includes(val)) return 10;
  return parseInt(val);
}

function createDeck() {
  deck = [];
  for (let s of suits) {
    for (let v of values) {
      deck.push(v + s);
    }
  }
  deck.sort(() => Math.random() - 0.5);
}

function drawCard() {
  if (deck.length === 0) createDeck();
  return deck.pop();
}

/* ================================
   START GAME
================================ */

function startGame() {
  const namesInput = document.getElementById("playerNames").value.trim();
  if (!namesInput) return alert("Enter player names");

  const names = namesInput.split(",").map(n => n.trim());

  players = names.map(name => ({
    name,
    bankroll: 100,
    totalWinLoss: 0,
    card1: null,
    card2: null
  }));

  pool = 0;
  gameActive = true;
  currentPlayerIndex = 0;

  createDeck();
  renderPlayers();
  nextTurn();
}

/* ================================
   RENDERING
================================ */

function renderPlayers() {
  const container = document.getElementById("playersContainer");
  container.innerHTML = "";

  players.forEach((p, index) => {
    const div = document.createElement("div");
    div.className = "player-box";
    div.id = "player-" + index;

    div.innerHTML = `
      <h3>${p.name} (${p.totalWinLoss >= 0 ? "+" : ""}${p.totalWinLoss})</h3>
      <div>🪙 ${p.bankroll}</div>
      <div class="cards-row" id="cards-${index}"></div>
      <div class="bet-box">
        <input class="bet-input" id="bet-${index}" type="number" min="1" placeholder="Bet">
        <button onclick="placeBet(${index})">Bet</button>
      </div>
    `;

    container.appendChild(div);
  });
}

/* ================================
   CARD RENDER
================================ */

function renderCard(card) {
  const suit = card.slice(-1);
  const value = card.slice(0, -1);
  const isRed = suit === "♥" || suit === "♦";

  return `
    <div class="playing-card ${isRed ? "red" : "black"}">
      <div class="top">${value}</div>
      <div class="center">${suit}</div>
      <div class="bottom">${value}</div>
    </div>
  `;
}

/* ================================
   TURN CONTROL
================================ */

function nextTurn() {
  if (!gameActive) return;

  if (players.length === 0) return;

  if (currentPlayerIndex >= players.length) {
    currentPlayerIndex = 0;
  }

  players.forEach((_, i) => {
    document.getElementById("player-" + i)?.classList.remove("active-turn");
  });

  const playerBox = document.getElementById("player-" + currentPlayerIndex);
  playerBox.classList.add("active-turn");

  dealInitialCards();
}

function dealInitialCards() {
  const player = players[currentPlayerIndex];

  player.card1 = drawCard();
  player.card2 = drawCard();

  const cardsDiv = document.getElementById("cards-" + currentPlayerIndex);
  cardsDiv.innerHTML = renderCard(player.card1) + renderCard(player.card2);
}

/* ================================
   BETTING
================================ */

function placeBet(index) {
  if (!gameActive) return;
  if (index !== currentPlayerIndex) return;

  const player = players[index];
  const betInput = document.getElementById("bet-" + index);
  const bet = parseInt(betInput.value);

  if (!bet || bet <= 0 || bet > player.bankroll)
    return alert("Invalid bet");

  spinThirdCard(() => {
    resolveBet(player, bet);
  });
}

/* ================================
   THIRD CARD SPIN + REVEAL
================================ */

function spinThirdCard(callback) {
  const wrapper = document.getElementById("thirdCard");
  if (!wrapper) return;

  let spinInterval = setInterval(() => {
    const randomCard = values[Math.floor(Math.random() * values.length)] +
      suits[Math.floor(Math.random() * suits.length)];

    wrapper.innerHTML = renderCard(randomCard);
  }, 60);

  setTimeout(() => {
    clearInterval(spinInterval);
    const realCard = drawCard();
    wrapper.innerHTML = renderCard(realCard);
    callback(realCard);
  }, 1500);
}

/* ================================
   RESOLVE BET
================================ */

function resolveBet(player, bet) {
  const val1 = getCardValue(player.card1.slice(0, -1));
  const val2 = getCardValue(player.card2.slice(0, -1));

  const min = Math.min(val1, val2);
  const max = Math.max(val1, val2);

  const thirdCard = drawCard();
  const thirdVal = getCardValue(thirdCard.slice(0, -1));

  if (thirdVal > min && thirdVal < max) {
    player.bankroll += bet;
    player.totalWinLoss += bet;
    pool -= bet;
  } else {
    player.bankroll -= bet;
    player.totalWinLoss -= bet;
    pool += bet;
  }

  checkBankruptcy(player);
  checkPoolWin(player);

  renderPlayers();

  currentPlayerIndex++;
  setTimeout(nextTurn, 1200);
}

/* ================================
   BANKRUPTCY HANDLING
================================ */

function checkBankruptcy(player) {
  if (player.bankroll <= 0) {
    const topUp = confirm(`${player.name} is bankrupt! Top up 100?`);
    if (topUp) {
      player.bankroll = 100;
    } else {
      players = players.filter(p => p !== player);
    }
  }
}

/* ================================
   POOL WIN CHECK
================================ */

function checkPoolWin(player) {
  if (pool <= 0) return;

  if (pool >= players.length * 100) {
    alert(`${player.name} wins entire pool!`);
    gameActive = false;

    const replay = confirm("Play again with same players?");
    if (replay) {
      players.forEach(p => {
        p.bankroll = 100;
        p.totalWinLoss = 0;
      });
      pool = 0;
      gameActive = true;
      currentPlayerIndex = 0;
      createDeck();
      renderPlayers();
      nextTurn();
    }
  }
}
