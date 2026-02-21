let players = [];
let pool = 0;
let deck = [];
let currentPlayerIndex = 0;
let anteAmount = 0;

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
      deck.push({ suit, name: val.name, value: val.value });
    });
  });
}

function shuffleDeck() {
  deck.sort(() => Math.random() - 0.5);
}

function playSound(id) {
  const sound = document.getElementById(id);
  sound.currentTime = 0;
  sound.play();
}

function startGame() {
  const numPlayers = parseInt(document.getElementById("numPlayers").value);
  anteAmount = parseInt(document.getElementById("ante").value);

  players = [];
  pool = anteAmount * numPlayers;
  currentPlayerIndex = 0;

  createDeck();
  shuffleDeck();

  for (let i = 0; i < numPlayers; i++) {
    const name = prompt(`Enter name for Player ${i + 1}`);
    players.push({
      name: name || `Player ${i + 1}`,
      total: 0,
      card1: null,
      card2: null
    });
  }

  document.getElementById("setup").classList.add("hidden");
  document.getElementById("game").classList.remove("hidden");

  dealNewRound();
}

function dealNewRound() {
  if (deck.length < players.length * 3) {
    createDeck();
    shuffleDeck();
  }

  players.forEach(p => {
    p.card1 = deck.pop();
    p.card2 = deck.pop();
  });

  renderPlayers();
  updatePool();
  currentPlayerIndex = 0;
  startTurn();
}

function renderPlayers() {
  const area = document.getElementById("playersArea");
  area.innerHTML = "";

  players.forEach(p => {
    const totalDisplay = p.total >= 0 ? `(+${p.total})` : `(${p.total})`;

    area.innerHTML += `
      <div class="playerCard">
        <h3>${p.name} ${totalDisplay}</h3>
        <div class="cards">
          <span class="card">${formatCard(p.card1)}</span>
          <span class="card">${formatCard(p.card2)}</span>
        </div>
      </div>
    `;
  });

  playSound("dealSound");
}

function formatCard(card) {
  return `${card.name}${card.suit}`;
}

function updatePool() {
  document.getElementById("poolAmount").innerText = pool;
}

function startTurn() {
  if (currentPlayerIndex >= players.length) {
    setTimeout(() => {
      dealNewRound();
    }, 1500);
    return;
  }

  const player = players[currentPlayerIndex];

  document.getElementById("turnArea").innerHTML = `
    <div class="turnBox" id="swipeBox">
      <h3>${player.name}'s Turn</h3>
      <label>Bet (max ${pool})</label>
      <input type="number" id="betAmount" min="1" max="${pool}">
      <button onclick="resolveTurn()">Confirm Bet</button>
      <p>Swipe Up = Max Bet | Swipe Down = Min Bet</p>
    </div>
  `;

  addSwipe();
}

function addSwipe() {
  const box = document.getElementById("swipeBox");
  let startY = 0;

  box.addEventListener("touchstart", e => {
    startY = e.touches[0].clientY;
  });

  box.addEventListener("touchend", e => {
    let endY = e.changedTouches[0].clientY;
    if (startY - endY > 50) {
      document.getElementById("betAmount").value = pool;
    }
    if (endY - startY > 50) {
      document.getElementById("betAmount").value = 1;
    }
  });
}

function resolveTurn() {
  const bet = parseInt(document.getElementById("betAmount").value);
  const player = players[currentPlayerIndex];

  if (!bet || bet <= 0 || bet > pool) {
    alert("Invalid bet");
    return;
  }

  const thirdCard = deck.pop();
  const min = Math.min(player.card1.value, player.card2.value);
  const max = Math.max(player.card1.value, player.card2.value);

  let resultClass = "";
  let resultText = "";

  if (thirdCard.value > min && thirdCard.value < max) {
    pool -= bet;
    player.total += bet;
    resultClass = "resultWin";
    resultText = "WIN 🎉";
    playSound("winSound");
  } else if (thirdCard.value === min || thirdCard.value === max) {
    pool += bet * 2;
    player.total -= bet * 2;
    resultClass = "resultDouble";
    resultText = "DOUBLE LOSS 💀";
    playSound("loseSound");
  } else {
    pool += bet;
    player.total -= bet;
    resultClass = "resultLose";
    resultText = "LOSE ❌";
    playSound("loseSound");
  }

  updatePool();

  document.getElementById("turnArea").innerHTML = `
    <div class="turnBox">
      <p>Third Card: ${formatCard(thirdCard)}</p>
      <h2 class="${resultClass}">${resultText}</h2>
    </div>
  `;

  renderPlayers();

  setTimeout(() => {
    currentPlayerIndex++;
    startTurn();
  }, 1500);
}
