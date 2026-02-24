/* ===============================
   IN-BETWEEN GAME – FINAL FIXED
================================= */

let players = [];
let currentPlayerIndex = 0;
let pool = 0;
let anteAmount = 0;
let deck = [];
let centerCard = null;
let roundActive = false;

/* ===============================
   CARD / DECK
================================= */

function createDeck() {
    const suits = ["♠", "♥", "♦", "♣"];
    const values = [1,2,3,4,5,6,7,8,9,10,11,12,13];
    let newDeck = [];

    for (let suit of suits) {
        for (let value of values) {
            newDeck.push({ value, suit });
        }
    }

    return shuffle(newDeck);
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function drawCard() {
    if (deck.length === 0) deck = createDeck();
    return deck.pop();
}

/* ===============================
   START GAME
================================= */

function startGame() {
    const numPlayers = parseInt(document.getElementById("numPlayers").value);
    anteAmount = parseInt(document.getElementById("anteAmount").value);

    if (!numPlayers || numPlayers < 1 || numPlayers > 10) {
        alert("1–10 players allowed.");
        return;
    }

    players = [];
    pool = 0;
    deck = createDeck();

    for (let i = 1; i <= numPlayers; i++) {
        let bankroll = 100;
        bankroll -= anteAmount;
        pool += anteAmount;

        players.push({
            name: `Player ${i}`,
            bankroll: bankroll,
            netGain: -anteAmount,
            card1: null,
            card2: null,
            currentBet: 0
        });
    }

    dealNewRound();
}

/* ===============================
   DEAL ROUND
================================= */

function dealNewRound() {
    deck = createDeck();
    centerCard = null;
    currentPlayerIndex = 0;
    roundActive = true;

    players.forEach(p => {
        p.card1 = drawCard();
        p.card2 = drawCard();
        p.currentBet = 0;
    });

    renderPlayers();
    enableActivePlayer();
}

/* ===============================
   BET LOGIC
================================= */

function handleBet(index) {
    if (index !== currentPlayerIndex) return;

    const betInput = document.getElementById(`bet-${index}`);
    const betAmount = parseInt(betInput.value);

    if (!betAmount || betAmount <= 0) {
        alert("Enter valid bet.");
        return;
    }

    const player = players[index];

    if (betAmount > player.bankroll) {
        alert("Not enough bankroll.");
        return;
    }

    // Deduct ONCE
    player.bankroll -= betAmount;
    player.currentBet = betAmount;
    pool += betAmount;

    renderPlayers();
    revealCenterCard(index);
}

function handleSkip(index) {
    if (index !== currentPlayerIndex) return;

    nextPlayer();
}

/* ===============================
   3RD CARD ANIMATION
================================= */

function revealCenterCard(index) {
    const display = document.getElementById("centerCard");
    let animationTime = 1500;
    let intervalSpeed = 80;

    let animation = setInterval(() => {
        let randomCard = drawCard();
        display.innerText = formatCard(randomCard);
    }, intervalSpeed);

    setTimeout(() => {
        clearInterval(animation);
        centerCard = drawCard();
        display.innerText = formatCard(centerCard);
        resolveBet(index);
    }, animationTime);
}

/* ===============================
   RESOLVE BET
================================= */

function resolveBet(index) {
    const player = players[index];

    const min = Math.min(player.card1.value, player.card2.value);
    const max = Math.max(player.card1.value, player.card2.value);

    if (centerCard.value > min && centerCard.value < max) {
        // WIN
        const payout = player.currentBet * 2;

        if (payout >= pool) {
            player.bankroll += pool;
            player.netGain += pool - player.currentBet;
            pool = 0;

            renderPlayers();

            setTimeout(() => {
                if (confirm(`${player.name} won the entire pool! Continue with same players? (-${anteAmount} ante each)`)) {
                    players.forEach(p => {
                        p.bankroll -= anteAmount;
                        p.netGain -= anteAmount;
                        pool += anteAmount;
                    });
                    dealNewRound();
                } else {
                    location.reload();
                }
            }, 500);

            return;
        }

        player.bankroll += payout;
        pool -= payout;
        player.netGain += player.currentBet;

    } else {
        // LOSE (already deducted)
        player.netGain -= player.currentBet;
    }

    player.currentBet = 0;

    checkBankrupt(index);
    nextPlayer();
}

/* ===============================
   BANKRUPT
================================= */

function checkBankrupt(index) {
    const player = players[index];

    if (player.bankroll <= 0) {
        let choice = prompt(`${player.name} is bankrupt. Enter top-up amount or type Q to quit:`);

        if (!choice) return;

        if (choice.toLowerCase() === "q") {
            players.splice(index, 1);
            if (players.length === 0) {
                alert("All players quit.");
                location.reload();
            }
        } else {
            let amount = parseInt(choice);
            if (!isNaN(amount) && amount > 0) {
                player.bankroll += amount;
            }
        }
    }
}

/* ===============================
   NEXT PLAYER / ROUND FLOW
================================= */

function nextPlayer() {
    if (players.length === 0) return;

    if (currentPlayerIndex >= players.length - 1) {
        // ROUND ENDS → new cards
        dealNewRound();
        return;
    }

    currentPlayerIndex++;
    enableActivePlayer();
}

/* ===============================
   UI
================================= */

function renderPlayers() {
    const container = document.getElementById("players");
    container.innerHTML = "";

    players.forEach((p, i) => {
        const netColor = p.netGain < 0 ? "red" : "#444";

        container.innerHTML += `
        <div class="player ${i === currentPlayerIndex ? "active" : ""}">
            <h3>${p.name} (<span style="color:${netColor}">${p.netGain}</span>)</h3>
            <p>Bankroll: ${p.bankroll}</p>
            <p>${formatCard(p.card1)} | ${formatCard(p.card2)}</p>
            <input id="bet-${i}" type="number" placeholder="Bet amount" ${i !== currentPlayerIndex ? "disabled" : ""}/>
            <button onclick="handleBet(${i})" ${i !== currentPlayerIndex ? "disabled" : ""}>BET</button>
            <button onclick="handleSkip(${i})" ${i !== currentPlayerIndex ? "disabled" : ""}>SKIP</button>
        </div>
        `;
    });

    document.getElementById("poolAmount").innerText = pool;
}

function enableActivePlayer() {
    renderPlayers();
}

function formatCard(card) {
    if (!card) return "";
    return `${card.value}${card.suit}`;
}
