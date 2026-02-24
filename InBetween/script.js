let players = [];
let deck = [];
let pool = 0;
let ante = 5;
let currentPlayerIndex = 0;
let playersPlayedThisCycle = 0;
let gameActive = false;

const suits = ["♠","♥","♦","♣"];
const values = [
  {name:"A",val:1},{name:"2",val:2},{name:"3",val:3},{name:"4",val:4},
  {name:"5",val:5},{name:"6",val:6},{name:"7",val:7},{name:"8",val:8},
  {name:"9",val:9},{name:"10",val:10},{name:"J",val:11},
  {name:"Q",val:12},{name:"K",val:13}
];

document.getElementById("startBtn").onclick = setupGame;

/* ================= GAME START ================= */

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
      active:true
    });
  }

  collectAnteAndDeal();
}

/* ================= INITIAL ANTE ================= */

function collectAnteAndDeal(){
  pool = 0;
  deck = buildDeck();
  shuffle(deck);

  players.forEach(p=>{
    if(!p.active) return;

    if(p.bankroll <=0){
      handleBankrupt(p);
    }

    if(p.active){
      p.bankroll -= ante;
      pool += ante;
      p.card1 = deck.pop();
      p.card2 = deck.pop();
    }
  });

  playersPlayedThisCycle = 0;
  currentPlayerIndex = getFirstActivePlayer();
  gameActive = true;

  updatePool();
  renderPlayers();
  highlightPlayer();
}

/* ================= NEW ROTATION (NO ANTE) ================= */

function dealNewCardsOnly(){
  deck = buildDeck();
  shuffle(deck);

  players.forEach(p=>{
    if(p.active){
      p.card1 = deck.pop();
      p.card2 = deck.pop();
    }
  });

  playersPlayedThisCycle = 0;
  currentPlayerIndex = getFirstActivePlayer();

  renderPlayers();
  highlightPlayer();
}

/* ================= TURN CONTROL ================= */

function nextTurn(){

  playersPlayedThisCycle++;
  let activeCount = players.filter(p=>p.active).length;

  if(playersPlayedThisCycle >= activeCount){
    // Everyone finished → NEW ROTATION (NO ANTE)
    setTimeout(()=>{
      dealNewCardsOnly();
    },500);
    return;
  }

  currentPlayerIndex = getNextActivePlayer(currentPlayerIndex);
  renderPlayers();
  highlightPlayer();
}

function getFirstActivePlayer(){
  return players.findIndex(p=>p.active);
}

function getNextActivePlayer(current){
  let next = current;
  do{
    next++;
    if(next >= players.length){
      next = 0;
    }
  } while(!players[next].active);
  return next;
}

/* ================= BET ================= */

function placeBet(i){
  if(i!==currentPlayerIndex || !gameActive) return;

  let bet=parseInt(document.getElementById("bet-"+i).value);
  let player=players[i];

  if(!bet || bet<=0 || bet>pool || bet>player.bankroll){
    alert("Invalid bet");
    return;
  }

  player.bankroll -= bet;

  const third=document.getElementById("thirdCardTop");

  let interval=setInterval(()=>{
    let temp=deck[Math.floor(Math.random()*deck.length)];
    third.innerHTML=temp.name+temp.suit;
  },100);

  setTimeout(()=>{
    clearInterval(interval);

    let card=deck.pop();
    third.innerHTML=card.name+card.suit;

    let min=Math.min(player.card1.val,player.card2.val);
    let max=Math.max(player.card1.val,player.card2.val);

    if(card.val>min && card.val<max){

      if(bet >= pool){
        // WIN ENTIRE POOL
        player.bankroll += pool + bet;
        player.wins += pool;
        pool = 0;
        updatePool();

        setTimeout(()=>{
          let again=confirm(player.name+" won entire pool! Continue with same players?");
          if(again){
            collectAnteAndDeal();  // NEW GAME CYCLE
          }else{
            location.reload();
          }
        },700);
        return;

      } else {
        player.bankroll += bet*2;
        player.wins += bet;
        pool -= bet;
      }

    }else if(card.val===min || card.val===max){
      player.bankroll -= bet;
      pool += bet*2;
      player.wins -= bet*2;
      checkImmediateBankrupt(player);

    }else{
      pool += bet;
      player.wins -= bet;
      checkImmediateBankrupt(player);
    }

    updatePool();
    nextTurn();

  },1500);
}

/* ================= SKIP ================= */

function skipTurn(i){
  if(i!==currentPlayerIndex || !gameActive) return;
  nextTurn();
}

/* ================= BANKRUPT ================= */

function handleBankrupt(player){
  let choice = prompt(
    player.name + " is bankrupt.\nEnter amount to top up OR type Q to quit:"
  );

  if(!choice || choice.toLowerCase()==="q"){
    player.active=false;
  }else{
    let amt=parseInt(choice);
    if(amt>0) player.bankroll+=amt;
    else player.active=false;
  }
}

function checkImmediateBankrupt(player){
  if(player.bankroll<=0){
    handleBankrupt(player);
  }
}

/* ================= RENDER ================= */

function renderPlayers(){
  const container=document.getElementById("playersContainer");
  container.innerHTML="";

  players.forEach((p,i)=>{
    if(!p.active) return;

    let winClass = p.wins>=0?"positive":"negative";
    let disabled = (i!==currentPlayerIndex)?"disabled":"";

    const div=document.createElement("div");
    div.className="player";
    div.id="player-"+i;

    div.innerHTML=`
      <h3>${p.name} 
      (<span class="${winClass}">
      ${p.wins>=0?"+":""}${p.wins}</span>)</h3>

      <div class="emoji-bank">💰 ${p.bankroll}</div>
      <div>Ante: ${ante}</div>

      <div class="cards">
        ${cardHTML(p.card1)}
        ${cardHTML(p.card2)}
      </div>

      <div class="bet-area">
        <input type="number" id="bet-${i}" 
          min="1" max="${Math.min(pool,p.bankroll)}" ${disabled}>
        <br>
        <button class="action-btn bet-btn" 
          onclick="placeBet(${i})" ${disabled}>BET</button>
        <button class="action-btn skip-btn" 
          onclick="skipTurn(${i})" ${disabled}>SKIP</button>
      </div>
    `;

    container.appendChild(div);
  });
}

function highlightPlayer(){
  document.querySelectorAll(".player").forEach(p=>p.classList.remove("active"));
  document.getElementById("player-"+currentPlayerIndex)?.classList.add("active");
}

/* ================= UTIL ================= */

function cardHTML(card){
  let color=(card.suit==="♥"||card.suit==="♦")?"red":"";
  return `<div class="card ${color}">${card.name}${card.suit}</div>`;
}

function buildDeck(){
  let d=[];
  suits.forEach(s=>{
    values.forEach(v=>{
      d.push({suit:s,name:v.name,val:v.val});
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

function updatePool(){
  document.getElementById("poolDisplay").innerText="Pool: "+pool;
}
