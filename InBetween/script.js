let players = [];
let pool = 0;
let deck = [];
let currentPlayerIndex = 0;
let anteAmount = 0;

const suits = ["♠","♥","♦","♣"];
const values = [
  {name:"A",value:1},
  {name:"2",value:2},{name:"3",value:3},{name:"4",value:4},
  {name:"5",value:5},{name:"6",value:6},{name:"7",value:7},
  {name:"8",value:8},{name:"9",value:9},{name:"10",value:10},
  {name:"J",value:11},{name:"Q",value:12},{name:"K",value:13}
];

function createDeck(){
  deck=[];
  suits.forEach(s=>{
    values.forEach(v=>{
      deck.push({suit:s,name:v.name,value:v.value});
    });
  });
}

function shuffleDeck(){
  deck.sort(()=>Math.random()-0.5);
}

function startGame(){

  const numPlayers = parseInt(document.getElementById("numPlayers").value) || 2;
  anteAmount = parseInt(document.getElementById("ante").value) || 1;

  players = [];
  pool = 0;

  createDeck();
  shuffleDeck();

  for(let i=0;i<numPlayers;i++){
    const name = prompt(`Enter name for Player ${i+1}`) || `Player ${i+1}`;

    players.push({
      name: name,
      bankroll: anteAmount * 5,
      total: 0,
      card1: null,
      card2: null
    });
  }

  // collect ante safely
  players.forEach(p=>{
    if(p.bankroll >= anteAmount){
      p.bankroll -= anteAmount;
      pool += anteAmount;
    }
  });

  updatePool(); // 🔥 ensure pool displays immediately

  document.getElementById("setup").classList.add("hidden");
  document.getElementById("game").classList.remove("hidden");

  dealNewRound();
}
  players.forEach(p=>{
    p.bankroll-=anteAmount;
    pool+=anteAmount;
  });

  document.getElementById("setup").classList.add("hidden");
  document.getElementById("game").classList.remove("hidden");

  dealNewRound();
}

function dealNewRound(){

  if(pool<=0){
    endGame();
    return;
  }

  if(deck.length<players.length*3){
    createDeck();
    shuffleDeck();
  }

  players.forEach(p=>{
    p.card1=deck.pop();
    p.card2=deck.pop();
  });

  renderPlayers();
  updatePool();
  currentPlayerIndex=0;
  startTurn();
}

function renderPlayers(){
  const area=document.getElementById("playersArea");
  area.innerHTML="";

  players.forEach(p=>{
    const totalDisplay=p.total>=0?`(+${p.total})`:`(${p.total})`;
    area.innerHTML+=`
      <div class="playerCard">
        <h3>${p.name} ${totalDisplay}</h3>
        <div>💰 ${p.bankroll}</div>
        <div class="cards">
          ${formatCard(p.card1)} ${formatCard(p.card2)}
        </div>
      </div>
    `;
  });
}

function formatCard(c){
  return `${c.name}${c.suit}`;
}

function updatePool(){
  document.getElementById("poolAmount").innerText=pool;
}

function startTurn(){

  if(currentPlayerIndex>=players.length){
    setTimeout(dealNewRound,1500);
    return;
  }

  const player=players[currentPlayerIndex];

  if(player.bankroll<=0){
    const topUp=confirm(`${player.name} is bankrupt. Top up?`);
    if(topUp){
      const amt=parseInt(prompt("Top up amount:"));
      if(amt>0) player.bankroll+=amt;
    }
  }

  document.getElementById("turnArea").innerHTML=`
    <div class="turnBox">
      <h3>${player.name}'s Turn</h3>
      <label>Bet (max ${Math.min(pool,player.bankroll)})</label>
      <input type="number" id="betAmount" min="1" max="${Math.min(pool,player.bankroll)}">
      <button onclick="resolveTurn()">Bet</button>
      <button onclick="skipTurn()">Skip</button>
    </div>
  `;
}

function skipTurn(){
  currentPlayerIndex++;
  startTurn();
}

function resolveTurn(){

  const bet=parseInt(document.getElementById("betAmount").value);
  const player=players[currentPlayerIndex];

  if(!bet||bet<=0||bet>pool||bet>player.bankroll){
    alert("Invalid bet");
    return;
  }

  const third=deck.pop();
  const min=Math.min(player.card1.value,player.card2.value);
  const max=Math.max(player.card1.value,player.card2.value);

  let result="";

  if(third.value>min&&third.value<max){
    pool-=bet;
    player.bankroll+=bet;
    player.total+=bet;
    result="WIN 🎉";
  }
  else if(third.value===min||third.value===max){
    pool+=bet*2;
    player.bankroll-=bet*2;
    player.total-=bet*2;
    result="DOUBLE LOSS 💀";
  }
  else{
    pool+=bet;
    player.bankroll-=bet;
    player.total-=bet;
    result="LOSE ❌";
  }

  updatePool();
  renderPlayers();

  document.getElementById("turnArea").innerHTML=`
    <div class="turnBox">
      <p>Third Card: ${formatCard(third)}</p>
      <h2>${result}</h2>
    </div>
  `;

  setTimeout(()=>{
    currentPlayerIndex++;
    startTurn();
  },1500);
}

function endGame(){

  const samePlayers=confirm("Pool empty! Play again with SAME players?");
  if(samePlayers){
    pool=0;
    players.forEach(p=>{
      if(p.bankroll>=anteAmount){
        p.bankroll-=anteAmount;
        pool+=anteAmount;
      }
    });
    dealNewRound();
  }
  else{
    location.reload();
  }
}
