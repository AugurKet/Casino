let chips = 500;
let bet = 0;
let deck = [];
let playerHands = [];
let playerBets = [];
let handResults = [];
let dealerHand = [];
let currentHand = 0;
let gameActive = false;
let holeHidden = true;

const suits = ["♠","♥","♦","♣"];
const values = [
{name:"A",val:11},{name:"2",val:2},{name:"3",val:3},
{name:"4",val:4},{name:"5",val:5},{name:"6",val:6},
{name:"7",val:7},{name:"8",val:8},{name:"9",val:9},
{name:"10",val:10},{name:"J",val:10},
{name:"Q",val:10},{name:"K",val:10}
];

const winSound = document.getElementById("winSound");
const loseSound = document.getElementById("loseSound");
const blackjackSound = document.getElementById("blackjackSound");
const chipSound = document.getElementById("chipSound");

function updateChips(){
  document.getElementById("chips").innerText = chips;
}

function createDeck(){
  deck=[];
  for(let i=0;i<6;i++){
    for(let s of suits)
      for(let v of values)
        deck.push({suit:s,name:v.name,val:v.val});
  }
  deck.sort(()=>Math.random()-0.5);
}

function draw(hand){ hand.push(deck.pop()); }

function score(hand){
  let s=0, aces=0;
  hand.forEach(c=>{ s+=c.val; if(c.name==="A") aces++; });
  while(s>21 && aces>0){ s-=10; aces--; }
  return s;
}

function render(){
  renderDealer();
  renderPlayers();
}

function renderDealer(){
  const el=document.getElementById("dealerCards");
  el.innerHTML="";
  dealerHand.forEach((c,i)=>{
    const d=document.createElement("div");
    d.className="card";
    if(holeHidden && i===1){
      d.classList.add("back");
      d.innerText="🂠";
    } else {
      d.innerText=c.name+c.suit;
    }
    el.appendChild(d);
  });

  document.getElementById("dealerScore").innerText =
    holeHidden ? "?" : score(dealerHand);
}

function renderPlayers(){
  const area=document.getElementById("playerArea");
  area.innerHTML="";

  playerHands.forEach((hand,i)=>{
    const handDiv=document.createElement("div");
    handDiv.className="hand";
    if(i===currentHand && gameActive)
      handDiv.classList.add("active");

    const cardsDiv=document.createElement("div");
    cardsDiv.className="cards";

    hand.forEach(c=>{
      const d=document.createElement("div");
      d.className="card";
      d.innerText=c.name+c.suit;
      cardsDiv.appendChild(d);
    });

    const scoreDiv=document.createElement("div");
    scoreDiv.className="hand-score";
    scoreDiv.innerText="Score: "+score(hand);

    const resultDiv=document.createElement("div");
    resultDiv.className="hand-result";
    resultDiv.innerText=handResults[i] || "";

    handDiv.appendChild(cardsDiv);
    handDiv.appendChild(scoreDiv);
    handDiv.appendChild(resultDiv);

    area.appendChild(handDiv);
  });
}

function startGame(){
  if(bet===0) return alert("Place bet first");

  createDeck();
  playerHands=[[ ]];
  playerBets=[bet];
  handResults=[""];
  dealerHand=[];
  currentHand=0;
  holeHidden=true;
  gameActive=true;
  document.getElementById("message").innerText="";

  draw(playerHands[0]);
  draw(dealerHand);
  draw(playerHands[0]);
  draw(dealerHand);

  chips -= bet;
  updateChips();

  document.getElementById("splitBtn").disabled =
    playerHands[0][0].name!==playerHands[0][1].name;

  render();

  if(score(playerHands[0])===21){
    holeHidden=false;
    render();
    chips += bet*2.5;
    blackjackSound.play();
    handResults[0]="BLACKJACK!";
    updateChips();
    gameActive=false;
  }

  toggleButtons(true);
}

function hit(){
  draw(playerHands[currentHand]);
  render();
  if(score(playerHands[currentHand])>21){
    handResults[currentHand]="Bust";
    nextHand();
  }
}

function stand(){ nextHand(); }

function doubleDown(){
  if(chips<playerBets[currentHand]) return;
  chips -= playerBets[currentHand];
  playerBets[currentHand]*=2;
  draw(playerHands[currentHand]);
  if(score(playerHands[currentHand])>21)
    handResults[currentHand]="Bust";
  nextHand();
}

function split(){
  if(playerHands.length>1) return;
  if(chips<bet) return;

  chips -= bet;
  updateChips();

  const [c1,c2]=playerHands[0];
  playerHands=[[c1],[c2]];
  playerBets=[bet,bet];
  handResults=["",""];

  draw(playerHands[0]);
  draw(playerHands[1]);

  render();
}

function nextHand(){
  if(currentHand<playerHands.length-1){
    currentHand++;
    render();
  } else {
    dealerTurn();
  }
}

function dealerTurn(){
  holeHidden=false;

  while(score(dealerHand)<17){
    draw(dealerHand);
  }

  render();
  settle();
}

function settle(){
  gameActive=false;
  toggleButtons(false);

  let dealerScore=score(dealerHand);

  playerHands.forEach((hand,i)=>{
    let s=score(hand);
    let b=playerBets[i];

    if(s>21){
      handResults[i]="Lose";
      loseSound.play();
    }
    else if(dealerScore>21 || s>dealerScore){
      chips+=b*2;
      handResults[i]="Win";
      winSound.play();
    }
    else if(s===dealerScore){
      chips+=b;
      handResults[i]="Push";
    }
    else{
      handResults[i]="Lose";
      loseSound.play();
    }
  });

  updateChips();
  render();
}

function toggleButtons(state){
  ["hitBtn","standBtn","doubleBtn","splitBtn"]
  .forEach(id=>document.getElementById(id).disabled=!state);
}

document.querySelectorAll(".chip")
.forEach(c=>{
  c.onclick=()=>{
    if(gameActive) return;
    chipSound.play();
    document.querySelectorAll(".chip")
      .forEach(x=>x.classList.remove("selected"));
    c.classList.add("selected");
    bet=parseInt(c.dataset.value);
    document.getElementById("betDisplay").innerText=bet;
  }
});

document.getElementById("clearBet").onclick=()=>{
  if(gameActive) return;
  bet=0;
  document.getElementById("betDisplay").innerText=0;
  document.querySelectorAll(".chip")
    .forEach(x=>x.classList.remove("selected"));
};

document.getElementById("dealBtn").onclick=startGame;
document.getElementById("hitBtn").onclick=hit;
document.getElementById("standBtn").onclick=stand;
document.getElementById("doubleBtn").onclick=doubleDown;
document.getElementById("splitBtn").onclick=split;

updateChips();
