/* =========================================
   IN-BETWEEN – MACAO EDITION
   Hunter Green + Neon Green theme ready
   Max bet = min(floor(bankroll/2), pool)
   Top up when bankroll <= 1
========================================= */

let players = [];
let pool = 0;
let ante = 5;
let currentPlayerIndex = 0;
let deck = [];

const suits = ["♠", "♥", "♦", "♣"];
const values = [
  { name: "A", val: 1 },
  { name: "2", val: 2 },
  { name: "3", val: 3 },
  { name: "4", val: 4 },
  { name: "5", val: 5 },
  { name: "6", val: 6 },
  { name: "7", val: 7 },
  { name: "8", val: 8 },
  { name: "9", val: 9 },
  { name: "10", val: 10 },
  { name: "J", val: 11 },
  { name: "Q", val: 12 },
  { name: "K", val: 13 }
];

/* =========================
   INITIALIZATION
========================= */

function createDeck() {
  deck = [];
  for (let s of suits) {
    for (let v of values) {
      deck.push({ suit: s, name: v.name, val: v.val });
    }
  }
  deck.sort(() => Math.random() - 0.5);
}

function drawCard() {
  if (deck.length === 0) createDeck();
  return deck.pop();
}

/* =========================
   CARD RENDERING
========================= */

function renderCard(card) {
  const isRed = card.suit === "♥" || card.suit === "♦";

  return `
    <div class="playing-card ${isRed ? "red" : "black"}">
      <div class="corner top">
        ${card.name}${card.suit}
      </div>
      <div class="center">
        ${card.suit}
      </div>
      <div class="corner bottom">
        ${card.name}${card.suit}
      </div>
    </div>
  `;
}

/* =========================
   START GAME
========================= */

function startGame() {
  const numPlayers = parseInt(document.getElementById("numPlayers").value);
  ante = parseInt(document.getElementById("ante").value);

  players = [];
  pool = 0;

  createDeck();

  for (let i = 1; i <= numPlayers; i++) {
    let name = prompt("Enter name for Player " + i);
    if (!name) name = "Player " + i;

    pool += ante;

    players.push({
      name,
      bankroll: 100 - ante,
      net: -ante,
      c1: drawCard(),
      c2: drawCard()
    });
  }

  updatePool();
  renderPlayers();
}

/* =========================
   RENDER PLAYERS
========================= */

function renderPlayers() {
  const container = document.getElementById("players");
  container.innerHTML = "";

  players.forEach((p, index) => {
    const maxBet = Math.min(Math.floor(p.bankroll / 2), pool);

    const div = document.createElement("div");
    div.className = "player-card";
    if (index === currentPlayerIndex) div.classList.add("active");

    div.innerHTML = `
      <h3>${p.name} 
        <span class="${p.net >= 0 ? "plus" : "minus"}">
          (${p.net >= 0 ? "+" : ""}${p.net})
        </span>
      </h3>
      <div class="bankroll">Bankroll: ${p.bankroll}</div>
      <div class="cards">
        ${renderCard(p.c1)}
        ${renderCard(p.c2)}
      </div>
      <input type="number" id="bet-${index}" 
             placeholder="Max ${maxBet}" 
             min="1" max="${maxBet}">
      <div class="btn-row">
        <button onclick="placeBet(${index})">BET</button>
        <button onclick="skipTurn()">SKIP</button>
      </div>
    `;

    container.appendChild(div);
  });
}

/* =========================
   BET LOGIC
========================= */

function placeBet(index) {
  const player = players[index];
  const betInput = document.getElementById(`bet-${index}`);
  let bet = parseInt(betInput.value);

  const maxBet = Math.min(Math.floor(player.bankroll / 2), pool);

  if (!bet || bet < 1 || bet > maxBet) {
    alert("Invalid bet.");
    return;
  }

  const thirdCard = drawCard();

  showThirdCard(thirdCard);

  const low = Math.min(player.c1.val, player.c2.val);
  const high = Math.max(player.c1.val, player.c2.val);

  if (thirdCard.val > low && thirdCard.val < high) {
    player.bankroll += bet;
    player.net += bet;
    pool -= bet;
  } else {
    player.bankroll -= bet;
    player.net -= bet;
    pool += bet;
  }

  if (player.bankroll <= 1) {
    const topUp = confirm(player.name + " has low funds. Top up 100?");
    if (topUp) {
      player.bankroll += 100;
    }
  }

  updatePool();
  nextTurn();
}

function skipTurn() {
  nextTurn();
}

function nextTurn() {
  currentPlayerIndex++;
  if (currentPlayerIndex >= players.length) {
    currentPlayerIndex = 0;
  }
  renderPlayers();
}

/* =========================
   THIRD CARD DISPLAY
========================= */

function showThirdCard(card) {
  const area = document.getElementById("thirdCard");
  area.innerHTML = renderCard(card);
}

/* =========================
   POOL UPDATE
========================= */

function updatePool() {
  document.getElementById("pool").innerText = "Pool: $" + pool;
}
