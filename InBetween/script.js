let players = [];
let currentPlayerIndex = 0;
let pool = 0;
let deck = [];
let gameActive = false;
let ANTE = 5;

const suits = ["♠","♥","♦","♣"];
const values = ["A","2","3","4","5","6","7","8","9","10","J","Q","K"];

function getCardValue(v){
  if(v==="A") return 1;
  if(["J","Q","K"].includes(v)) return 10;
  return parseInt(v);
}

function createDeck(){
  deck=[];
  for(let s of suits){
    for(let v of values){
      deck.push(v+s);
    }
  }
  deck.sort(()=>Math.random()-0.5);
}

function drawCard(){
  if(deck.length===0) createDeck();
  return deck.pop();
}

/* ===== SETUP ===== */

function setupPlayers(){
  const count=parseInt(prompt("Enter number of players (2-10):"));
  if(!count||count<2||count>10) return alert("Invalid number");

  ANTE=parseInt(prompt("Enter Ante amount:"));
  if(!ANTE||ANTE<=0) return alert("Invalid ante");

  players=[];
  for(let i=0;i<count;i++){
    const name=prompt("Enter name for Player "+(i+1));
    players.push({
      name:name||("Player"+(i+1)),
      bankroll:100,
      total:0,
      card1:null,
      card2:null
    });
  }

  startRound();
}

/* ===== ROUND ===== */

function startRound(){
  pool=0;
  players.forEach(p=>{
    p.bankroll-=ANTE;
    pool+=ANTE;
  });

  currentPlayerIndex=0;
  gameActive=true;
  createDeck();
  renderPlayers();
  updatePool();
  nextTurn();
}

/* ===== RENDER ===== */

function renderPlayers(){
  const container=document.getElementById("playersContainer");
  container.innerHTML="";

  players.forEach((p,i)=>{
    const div=document.createElement("div");
    div.className="player-box";
    div.id="player-"+i;

    div.innerHTML=`
      <h3>${p.name} (${p.total>=0?"+":""}${p.total})</h3>
      <div>🪙 ${p.bankroll}</div>
      <div>Ante: ${ANTE}</div>
      <div class="cards-row">
        ${renderCard(p.card1)}
        ${renderCard(p.card2)}
      </div>
      <input class="bet-input" id="bet-${i}" type="number" min="1" placeholder="Bet">
      <br>
      <button onclick="placeBet(${i})">Bet</button>
    `;
    container.appendChild(div);
  });
}

function renderCard(card){
  if(!card) return "";
  const suit=card.slice(-1);
  const val=card.slice(0,-1);
  const red=(suit==="♥"||suit==="♦");

  return `
  <div class="card ${red?"red":"black"}">
    <div class="top">${val}</div>
    <div class="center">${suit}</div>
    <div class="bottom">${val}</div>
  </div>`;
}

/* ===== TURN ===== */

function nextTurn(){
  if(!gameActive) return;

  players.forEach((_,i)=>{
    document.getElementById("player-"+i)?.classList.remove("active-turn");
  });

  const player=players[currentPlayerIndex];
  const box=document.getElementById("player-"+currentPlayerIndex);
  box.classList.add("active-turn");

  player.card1=drawCard();
  player.card2=drawCard();
  renderPlayers();
}

/* ===== BET ===== */

function placeBet(index){
  if(index!==currentPlayerIndex) return;

  const player=players[index];
  const bet=parseInt(document.getElementById("bet-"+index).value);
  if(!bet||bet<=0||bet>player.bankroll) return alert("Invalid bet");

  spinThirdCard((third)=>{
    resolveBet(player,bet,third);
  });
}

/* ===== SPIN EFFECT ===== */

function spinThirdCard(callback){
  const box=document.getElementById("thirdCard");
  box.className="card large";

  let interval=setInterval(()=>{
    const rand=values[Math.floor(Math.random()*values.length)]
      +suits[Math.floor(Math.random()*suits.length)];
    box.innerHTML=renderCard(rand);
  },60);

  setTimeout(()=>{
    clearInterval(interval);
    const real=drawCard();
    box.innerHTML=renderCard(real);
    callback(real);

    setTimeout(()=>{
      box.className="card back large";
      box.innerHTML="";
    },1000);

  },1500);
}

/* ===== RESOLVE ===== */

function resolveBet(player,bet,thirdCard){
  const v1=getCardValue(player.card1.slice(0,-1));
  const v2=getCardValue(player.card2.slice(0,-1));
  const min=Math.min(v1,v2);
  const max=Math.max(v1,v2);
  const v3=getCardValue(thirdCard.slice(0,-1));

  if(v3>min && v3<max){
    player.bankroll+=bet;
    player.total+=bet;
    pool-=bet;
  }else{
    player.bankroll-=bet;
    player.total-=bet;
    pool+=bet;
  }

  updatePool();
  renderPlayers();

  currentPlayerIndex=(currentPlayerIndex+1)%players.length;
  setTimeout(nextTurn,1000);
}

function updatePool(){
  document.getElementById("poolDisplay").innerText="Pool: "+pool;
}
