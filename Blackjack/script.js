let deck = [];
let playerHand = [];
let dealerHand = [];
let chips = 500;
let bet = 0;
let dealerHidden = true;
let gameActive = false;

const suits = ["♠","♥","♦","♣"];
const values = [
  {name:"A", val:11},
  {name:"2", val:2},
  {name:"3", val:3},
  {name:"4", val:4},
  {name:"5", val:5},
  {name:"6", val:6},
  {name:"7", val:7},
  {name:"8", val:8},
  {name:"9", val:9},
  {name:"10", val:10},
  {name:"J", val:10},
  {name:"Q", val:10},
  {name:"K", val:10}
];

function init() {
  const saved = localStorage.getItem("blackjackChips");
  if (saved) chips = parseInt(saved);
  updateChips();
}

function saveChips() {
  localStorage.setItem("blackjackChips", chips);
}

function createDeck() {
  deck = [];
  for (let suit of suits) {
    for (let value of values) {
      deck.push({suit, name:value.name, val:value.val});
    }
  }
  deck.sort(() => Math.random() - 0.5);
}

function drawCard(hand) {
  const card = deck.pop();
  hand.push(card);
  return card;
}

function calculateScore(hand) {
  let score = 0;
  let aces = 0;
  for (let card of hand) {
    score += card.val;
    if (card.name === "A") aces++;
  }
  while (score > 21 && aces > 0) {
    score -= 10;
    aces--;
  }
  return score;
}

function render() {
  renderHand(playerHand, "playerCards", false);
  renderHand(dealerHand, "dealerCards", dealerHidden);
  document.getElementById("playerScore").innerText = calculateScore(playerHand);
  document.getElementById("dealerScore").innerText =
    dealerHidden ? "?" : calculateScore(dealerHand);
}

function renderHand(hand, elementId, hideSecond) {
  const container = document.getElementById(elementId);
  container.innerHTML = "";
  hand.forEach((card, index) => {
    const cardDiv = document.createElement("div");
    cardDiv.className = "card";

    const front = document.createElement("div");
    front.className = "card-inner front";
    front.innerText = card.name + card.suit;

    const back = document.createElement("div");
    back.className = "card-inner back";
    back.innerText = "🂠";

    cardDiv.appendChild(front);
    cardDiv.appendChild(back);

    if (hideSecond && index === 1) {
      cardDiv.classList.add("flipped");
    }

    container.appendChild(cardDiv);
  });
}

function updateChips() {
  document.getElementById("chips").innerText = chips;
  saveChips();
}

function startGame() {
  if (gameActive) return;

  bet = parseInt(document.getElementById("betAmount").value);
  if (bet > chips || bet <= 0) return alert("Invalid Bet");

  chips -= bet;
  updateChips();

  playerHand = [];
  dealerHand = [];
  dealerHidden = true;
  gameActive = true;

  createDeck();

  drawCard(playerHand);
  drawCard(dealerHand);
  drawCard(playerHand);
  drawCard(dealerHand);

  render();

  if (calculateScore(playerHand) === 21) {
    dealerHidden = false;
    chips += bet * 2.5;
    updateChips();
    document.getElementById("message").innerText = "🃏 BLACKJACK! 3:2 Payout!";
    gameActive = false;
    return;
  }

  toggleButtons(true);
  document.getElementById("message").innerText = "";
}

function hit() {
  drawCard(playerHand);
  render();
  if (calculateScore(playerHand) > 21) endGame();
}

function stand() {
  dealerHidden = false;
  render();
  dealerPlay();
}

function dealerPlay() {
  let interval = setInterval(() => {
    if (calculateScore(dealerHand) < 17) {
      drawCard(dealerHand);
      render();
    } else {
      clearInterval(interval);
      endGame();
    }
  }, 700);
}

function doubleDown() {
  if (chips < bet) return;
  chips -= bet;
  bet *= 2;
  updateChips();
  hit();
  if (calculateScore(playerHand) <= 21) stand();
}

function endGame() {
  toggleButtons(false);
  dealerHidden = false;
  render();

  let playerScore = calculateScore(playerHand);
  let dealerScore = calculateScore(dealerHand);
  let msg = "";

  if (playerScore > 21) {
    msg = "💥 Bust! Dealer Wins";
  } else if (dealerScore > 21 || playerScore > dealerScore) {
    chips += bet * 2;
    msg = "🎉 You Win!";
  } else if (playerScore === dealerScore) {
    chips += bet;
    msg = "🤝 Push!";
  } else {
    msg = "😢 Dealer Wins";
  }

  updateChips();
  document.getElementById("message").innerText = msg;
  gameActive = false;
}

function toggleButtons(state) {
  document.getElementById("hitBtn").disabled = !state;
  document.getElementById("standBtn").disabled = !state;
  document.getElementById("doubleBtn").disabled = !state;
}

document.getElementById("dealBtn").addEventListener("click", startGame);
document.getElementById("hitBtn").addEventListener("click", hit);
document.getElementById("standBtn").addEventListener("click", stand);
document.getElementById("doubleBtn").addEventListener("click", doubleDown);

init();
