let players = [];
let pool = 0;
let deck = [];
let currentPlayerIndex = 0;

const suits = ["♠", "♥", "♦", "♣"];
const values = [
  { name: "A", value: 14 },
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
  pool = ante * numPlayers;
  currentPlayerIndex = 0;

  createDeck();
  shuffleDeck();

  for (let i = 0; i < numPlayers; i++) {
    const name = prompt(`Enter name for Player ${i + 1}`);
    players.push({
      name: name || `Player ${i + 1}`,
      card1: null,
      card2: null
    });
  }

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
      <div class="playerCard">
        <h3>${p.name}</h3>
        <div class="cards">
          ${formatCard(p.card1)} &nbsp; ${formatCard(p.card2)}
        </div>
      </div>
    `;
  });
}

function formatCard(card) {
  return `${card.name}${card.suit}`;
}

function updatePool() {
  document.getElementById("poolAmount").innerText = pool;
}

function startTurn() {
  const player = players[currentPlayerIndex];

  document.getElementById("turnArea").innerHTML = `
    <div class="turnBox">
      <h3>${player.name}'s Turn</h3>
      <label>Bet Amount (max ${pool}):</label>
      <input type="number" id="betAmount" min="1" max="${pool}">
      <br><br>
      <button onclick="resolveTurn()">Bet</button>
      <button onclick="skipTurn()" style="background:#64748b;">Skip</button>
    </div>
  `;
}

function skipTurn() {
  document.getElementById("turnArea").innerHTML = `
    <div class="turnBox">
      <h3>${players[currentPlayerIndex].name} Skipped ⏭</h3>
      <button onclick="nextTurn()">Next</button>
    </div>
  `;
}

function resolveTurn() {
  const bet = parseInt(document.getElementById("betAmount").value);
  const player = players[currentPlayerIndex];

  if (!bet || bet <= 0 || bet > pool) {
    alert("Invalid bet.");
    return;
  }

  const thirdCard = deck.pop();
  const min = Math.min(player.card1.value, player.card2.value);
  const max = Math.max(player.card1.value, player.card2.value);

  let resultMessage = "";

  if (thirdCard.value > min && thirdCard.value < max) {
    pool -= bet;
    resultMessage = "WIN 🎉";
  } else if (thirdCard.value === min || thirdCard.value === max) {
    pool += bet * 2;
    resultMessage = "DOUBLE LOSS 💀";
  } else {
    pool += bet;
    resultMessage = "LOSE ❌";
  }

  updatePool();

  document.getElementById("turnArea").innerHTML = `
    <div class="turnBox">
      <h3>${player.name}</h3>
      <p>Third Card: ${formatCard(thirdCard)}</p>
      <h2>${resultMessage}</h2>
      <button onclick="nextTurn()">Next</button>
    </div>
  `;
}

function nextTurn() {
  currentPlayerIndex++;

  if (currentPlayerIndex >= players.length) {
    startNewRound();
    return;
  }

  startTurn();
}

function startNewRound() {
  currentPlayerIndex = 0;

  document.getElementById("turnArea").innerHTML = `
    <div class="turnBox">
      <h2>New Round 🎴</h2>
      <p>Dealing new cards...</p>
    </div>
  `;

  setTimeout(() => {
    dealTwoCards();
    renderPlayers();
    startTurn();
  }, 1500);
}
