/* ======================================
   IN-BETWEEN GAME – CLEAN FINAL ENGINE
====================================== */

let players = [];
let pool = 0;
let ante = 0;
let deck = [];
let currentPlayer = 0;
let centerCard = null;

/* ================= DECK ================= */

function createDeck() {
    const suits = ["♠","♥","♦","♣"];
    let d = [];
    for (let s of suits) {
        for (let v = 1; v <= 13; v++) {
            d.push({value:v, suit:s});
        }
    }
    return shuffle(d);
}

function shuffle(arr) {
    for (let i = arr.length-1; i>0; i--) {
        const j = Math.floor(Math.random()*(i+1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function drawCard() {
    if (deck.length === 0) deck = createDeck();
    return deck.pop();
}

/* ================= START GAME ================= */

function startGame() {

    const numPlayers = parseInt(document.getElementById("numPlayers").value);
    ante = parseInt(document.getElementById("anteAmount").value);

    if (!numPlayers || numPlayers < 1 || numPlayers > 10) {
        alert("Players must be 1–10");
        return;
    }

    if (!ante || ante <= 0) {
        alert("Invalid ante");
        return;
    }

    players = [];
    pool = 0;
    deck = createDeck();
    currentPlayer = 0;

    for (let i=1; i<=numPlayers; i++) {
        let bankroll = 100 - ante;
        pool += ante;

        players.push({
            name: "Player " + i,
            bankroll: bankroll,
            net: -ante,
            c1: null,
            c2: null
        });
    }

    dealNewRound();
}

/* ================= DEAL ROUND ================= */

function dealNewRound() {

    deck = createDeck();
    centerCard = null;
    currentPlayer = 0;

    players.forEach(p => {
        p.c1 = drawCard();
        p.c2 = drawCard();
    });

    render();
    checkLowBankroll();
}

/* ================= PLAYER TURN ================= */

function handleBet(i) {

    if (i !== currentPlayer) return;

    let player = players[i];
    let input = document.getElementById("bet-"+i);
    let bet = parseInt(input.value);

    if (!bet || bet <= 0) {
        alert("Invalid bet");
        return;
    }

    let maxBet = Math.floor(player.bankroll/2);

    if (bet > maxBet) {
        alert("Max bet is " + maxBet);
        return;
    }

    player.bankroll -= bet;
    pool += bet;

    animateCenterCard(() => {
        resolveBet(player, bet);
    });
}

function handleSkip(i) {
    if (i !== currentPlayer) return;
    nextPlayer();
}

/* ================= CENTER CARD ================= */

function animateCenterCard(callback) {

    const display = document.getElementById("centerCard");

    let interval = setInterval(() => {
        let temp = drawCard();
        display.innerText = format(temp);
    }, 80);

    setTimeout(() => {
        clearInterval(interval);
        centerCard = drawCard();
        display.innerText = format(centerCard);
        callback();
    }, 1500);
}

/* ================= RESOLVE ================= */

function resolveBet(player, bet) {

    const low = Math.min(player.c1.value, player.c2.value);
    const high = Math.max(player.c1.value, player.c2.value);

    if (centerCard.value === player.c1.value ||
        centerCard.value === player.c2.value) {

        // DOUBLE LOSS
        player.bankroll -= bet;
        pool += bet;
        player.net -= bet * 2;

    } else if (centerCard.value > low &&
               centerCard.value < high) {

        // WIN
        player.bankroll += bet;
        pool -= bet;
        player.net += bet;

        if (pool === 0) {
            render();
            setTimeout(handleEntirePoolWin, 500);
            return;
        }

    } else {

        // NORMAL LOSS
        player.net -= bet;
    }

    render();
    nextPlayer();
}

/* ================= ROUND FLOW ================= */

function nextPlayer() {

    currentPlayer++;

    if (currentPlayer >= players.length) {
        dealNewRound();  // new cards, pool untouched
        return;
    }

    render();
    checkLowBankroll();
}

/* ================= ENTIRE POOL ================= */

function handleEntirePoolWin() {

    if (confirm("Pool empty. Continue same players?")) {

        players.forEach(p => {
            p.bankroll -= ante;
            p.net -= ante;
            pool += ante;
        });

        dealNewRound();

    } else {
        location.reload();
    }
}

/* ================= BANKROLL CHECK ================= */

function checkLowBankroll() {

    let p = players[currentPlayer];

    if (p.bankroll <= 1) {

        let choice = prompt(
            p.name + " bankroll too low. Enter top-up amount or Q to quit:"
        );

        if (!choice) return;

        if (choice.toLowerCase() === "q") {
            players.splice(currentPlayer,1);

            if (players.length === 0) {
                alert("All players quit.");
                location.reload();
                return;
            }

            if (currentPlayer >= players.length)
                currentPlayer = 0;

        } else {
            let amt = parseInt(choice);
            if (!isNaN(amt) && amt > 0) {
                p.bankroll += amt;
            }
        }
    }

    render();
}

/* ================= UI ================= */

function render() {

    const container = document.getElementById("players");
    container.innerHTML = "";

    players.forEach((p,i)=>{

        let netColor = p.net < 0 ? "red" : "#333";

        container.innerHTML += `
        <div class="player ${i===currentPlayer?"active":""}">
            <h3>${p.name} 
            (<span style="color:${netColor}">${p.net}</span>)</h3>
            <p>Bankroll: ${p.bankroll}</p>
            <p>${format(p.c1)} | ${format(p.c2)}</p>

            <input id="bet-${i}" type="number"
            ${i!==currentPlayer?"disabled":""}
            placeholder="Max ${Math.floor(p.bankroll/2)}">

            <button ${i!==currentPlayer?"disabled":""}
            onclick="handleBet(${i})">BET</button>

            <button ${i!==currentPlayer?"disabled":""}
            onclick="handleSkip(${i})">SKIP</button>
        </div>`;
    });

    document.getElementById("poolAmount").innerText = pool;
}

/* ================= FORMAT ================= */

function format(card) {
    return card.value + card.suit;
}
