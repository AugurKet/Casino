let players = [];
let pool = 0;
let ante = 5;
let deck = [];
let currentPlayer = 0;

const suits = ["♠","♥","♦","♣"];
const values = [
["A",1],["2",2],["3",3],["4",4],["5",5],
["6",6],["7",7],["8",8],["9",9],
["10",10],["J",11],["Q",12],["K",13]
];

/* =========================
   SOUND ENGINE (SAFE LAYER)
========================= */

const SFX = {
    deal: document.getElementById("sfx-deal"),
    flip: document.getElementById("sfx-flip"),
    win: document.getElementById("sfx-win"),
    lose: document.getElementById("sfx-lose"),
    click: document.getElementById("sfx-click"),
    alert: document.getElementById("sfx-alert")
};

function playSound(sound){
    if(!sound) return;
    sound.currentTime = 0;
    sound.play().catch(()=>{});
}

// Unlock iOS audio on first interaction
document.addEventListener("click", ()=>{
    Object.values(SFX).forEach(a=>{
        a.volume=0;
        a.play().then(()=>{
            a.pause();
            a.currentTime=0;
            a.volume=1;
        }).catch(()=>{});
    });
},{once:true});

/* ======================= */

function createDeck(){
    deck=[];
    for(let s of suits){
        for(let v of values){
            deck.push({name:v[0],val:v[1],suit:s});
        }
    }
    deck.sort(()=>Math.random()-0.5);
}

function draw(){
    if(deck.length===0) createDeck();
    return deck.pop();
}

function renderCard(c){
    const color=(c.suit==="♥"||c.suit==="♦")?"red":"black";
    return `
    <div class="playing-card ${color}">
        <div class="corner top">${c.name}${c.suit}</div>
        <div class="center">${c.suit}</div>
        <div class="corner bottom">${c.name}${c.suit}</div>
    </div>`;
}

/* ======================= */

function startGame(){

    playSound(SFX.click);

    const n=parseInt(document.getElementById("numPlayers").value);
    ante=parseInt(document.getElementById("ante").value);

    players=[];
    pool=0;
    currentPlayer=0;
    createDeck();

    for(let i=1;i<=n;i++){
        let name=prompt("Player "+i+" name?");
        if(!name) name="Player "+i;

        pool+=ante;

        players.push({
            name,
            bankroll:100-ante,
            net:-ante,
            c1:draw(),
            c2:draw()
        });
    }

    playSound(SFX.deal);

    updatePool();
    renderPlayers();
}

/* ======================= */

function renderPlayers(){
    const area=document.getElementById("players");
    area.innerHTML="";

    players.forEach((p,i)=>{
        const maxBet=Math.min(Math.floor(p.bankroll/2),pool);
        const div=document.createElement("div");
        div.className="player-card";
        if(i===currentPlayer) div.classList.add("active");

        div.innerHTML=`
        <h3>${p.name} (${p.net>=0?"+":""}${p.net})</h3>
        <div>Bankroll: ${p.bankroll}</div>
        <div class="cards">${renderCard(p.c1)}${renderCard(p.c2)}</div>
        <input type="number" id="bet-${i}" placeholder="Max ${maxBet}" min="1" max="${maxBet}">
        <br><br>
        <button onclick="bet(${i})">BET</button>
        <button onclick="nextTurn()">SKIP</button>
        `;
        area.appendChild(div);
    });
}

/* ======================= */

function bet(i){

    playSound(SFX.click);

    if(i!==currentPlayer) return;

    const p=players[i];
    let amt=parseInt(document.getElementById(`bet-${i}`).value);
    const maxBet=Math.min(Math.floor(p.bankroll/2),pool);

    if(!amt||amt<1||amt>maxBet){ alert("Invalid bet"); return;}

    const third=draw();
    showThirdCard(third);

    const low=Math.min(p.c1.val,p.c2.val);
    const high=Math.max(p.c1.val,p.c2.val);

    if(third.val>low && third.val<high){
        p.bankroll+=amt;
        p.net+=amt;
        pool-=amt;
        playSound(SFX.win);
    }else{
        p.bankroll-=amt;
        p.net-=amt;
        pool+=amt;
        playSound(SFX.lose);
    }

    updatePool();

    if(p.bankroll <= 10){

        playSound(SFX.alert);

        setTimeout(()=>{
            let choice = confirm(
                p.name + " has low bankroll ($" + p.bankroll + ").\n\nOK = Top Up +100\nCancel = Quit Game"
            );

            if(choice){
                p.bankroll += 100;
                renderPlayers();
            } else {
                players.splice(i,1);

                if(players.length <= 1){
                    alert("Game Over!");
                    return;
                }

                if(currentPlayer >= players.length){
                    currentPlayer = 0;
                }

                renderPlayers();
            }
        },500);
        return;
    }

    if(pool<=0){
        setTimeout(()=>{
            if(confirm("Pool empty. Restart with same players?")){
                restartWithSamePlayers();
            }
        },500);
        return;
    }

    nextTurn();
}

/* ======================= */

function nextTurn(){
    currentPlayer++;
    if(currentPlayer>=players.length){
        newRound();
        return;
    }
    renderPlayers();
}

/* ======================= */

function newRound(){
    createDeck();
    players.forEach(p=>{
        p.c1=draw();
        p.c2=draw();
    });
    currentPlayer=0;

    playSound(SFX.deal);

    renderPlayers();
}

/* ======================= */

function restartWithSamePlayers(){

    playSound(SFX.click);

    pool = 0;
    createDeck();

    players.forEach(p=>{
        if(p.bankroll >= ante){
            p.bankroll -= ante;
            p.net -= ante;
            pool += ante;
            p.c1 = draw();
            p.c2 = draw();
        }
    });

    currentPlayer = 0;

    playSound(SFX.deal);

    updatePool();
    renderPlayers();
}

/* ======================= */

function showThirdCard(card){

    playSound(SFX.flip);

    const area=document.getElementById("thirdCard");
    area.innerHTML=`<div class="flip">${renderCard(card)}</div>`;
}

/* ======================= */

function updatePool(){
    document.getElementById("pool").innerText="Pool: $"+pool;
}
