let players = [];
let deck = [];
let pool = 0;
let ante = 5;
let currentPlayerIndex = 0;
let gameActive = false;

const suits = ["♠","♥","♦","♣"];
const values = [
  {name:"A",val:1},{name:"2",val:2},{name:"3",val:3},{name:"4",val:4},
  {name:"5",val:5},{name:"6",val:6},{name:"7",val:7},{name:"8",val:8},
  {name:"9",val:9},{name:"10",val:10},{name:"J",val:11},
  {name:"Q",val:12},{name:"K",val:13}
];

document.getElementById("startBtn").onclick = setupGame;

function setupGame(){
  let num = parseInt(prompt("How many players? (2-10)"));
  if(num <2 || num>10) return;

  ante = parseInt(prompt("Enter Ante amount:"));
  if(ante <=0) ante = 5;

  players = [];
  for(let i=0;i<num;i++){
    let name = prompt("Player "+(i+1)+" name:");
    players.push({
      name:name,
      bankroll:100,
      wins:0,
      card1:null,
      card2:null
    });
  }

  startRound();
}

function startRound(){
  pool = 0;
  deck = buildDeck();
  shuffle(deck);

  players.forEach(p=>{
    if(p.bankroll <=0){
      let top = confirm(p.name+" is bankrupt. Top up 100?");
      if(top) p.bankroll = 100;
    }

    p.bankroll -= ante;
    pool += ante;

    p.card1 = deck.pop();
    p.card2 = deck.pop();
  });

  updatePool();
  renderPlayers();
  currentPlayerIndex = 0;
  gameActive = true;
  highlightPlayer();
}

function buildDeck(){
  let d=[];
  suits.forEach(s=>{
    values.forEach(v=>{
      d.push({suit:s, name:v.name, val:v.val});
    });
  });
  return d;
}

function shuffle(a){
  for(let i=a.length-1;i>0;i--){
    let j=Math.floor(Math.random()*(i+1));
    [a[i],a[j]]=[a[j],a[i]];
  }
}

function renderPlayers(){
  const container=document.getElementById("playersContainer");
  container.innerHTML="";

  players.forEach((p,i)=>{
    const div=document.createElement("div");
    div.className="player";
    div.id="player-"+i;

    div.innerHTML=`
      <h3>${p.name} (${p.wins>=0?"+":""}${p.wins})</h3>
      <div class="emoji-bank">💰 ${p.bankroll}</div>
      <div>Ante: ${ante}</div>

      <div class="cards">
        ${cardHTML(p.card1)}
        ${cardHTML(p.card2)}
      </div>

      <div class="bet-area">
        <input type="number" id="bet-${i}" placeholder="Bet" min="1" max="${pool}">
        <br>
        <button onclick="placeBet(${i})">Bet</button>
        <button onclick="skipTurn(${i})">Skip</button>
      </div>
    `;

    container.appendChild(div);
  });
}

function cardHTML(card){
  let color=(card.suit==="♥"||card.suit==="♦")?"red":"";
  return `<div class="card ${color}">${card.name}${card.suit}</div>`;
}

function highlightPlayer(){
  document.querySelectorAll(".player").forEach(p=>p.classList.remove("active"));
  document.getElementById("player-"+currentPlayerIndex)?.classList.add("active");
}

function skipTurn(i){
  if(i!==currentPlayerIndex || !gameActive) return;
  nextPlayer();
}

function placeBet(i){
  if(i!==currentPlayerIndex || !gameActive) return;

  let bet=parseInt(document.getElementById("bet-"+i).value);
  if(!bet || bet<=0 || bet>pool) return alert("Invalid bet");

  let player=players[i];

  // rapid animation
  const third=document.getElementById("thirdCardTop");
  let interval=setInterval(()=>{
    let temp=deck[Math.floor(Math.random()*deck.length)];
    third.className="card";
    third.innerHTML=temp.name+temp.suit;
  },100);

  setTimeout(()=>{
    clearInterval(interval);

    let card=deck.pop();
    third.innerHTML=card.name+card.suit;

    let min=Math.min(player.card1.val,player.card2.val);
    let max=Math.max(player.card1.val,player.card2.val);

    if(card.val>min && card.val<max){
      player.bankroll+=pool;
      player.wins+=pool;
      pool=0;
      updatePool();
      gameActive=false;

      setTimeout(()=>{
        let again=confirm(player.name+" won entire pool! Play again with same players?");
        if(again){
          startRound();
        }else{
          location.reload();
        }
      },800);

    }else if(card.val===min || card.val===max){
      player.bankroll-=bet*2;
      pool+=bet*2;
      player.wins-=bet*2;
      nextPlayer();
    }else{
      pool+=bet;
      player.wins-=bet;
      nextPlayer();
    }

    updatePool();
    renderPlayers();
    highlightPlayer();

    setTimeout(()=>{
      third.className="card back";
      third.innerHTML="";
    },1200);

  },1500);
}

function nextPlayer(){
  currentPlayerIndex++;
  if(currentPlayerIndex>=players.length){
    currentPlayerIndex=0;
  }
  highlightPlayer();
}

function updatePool(){
  document.getElementById("poolDisplay").innerText="Pool: "+pool;
}
