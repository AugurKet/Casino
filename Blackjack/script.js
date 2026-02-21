let chips = 500;
let bet = 0;
let deck = [];
let playerHand = [];
let dealerHand = [];
let gameActive = false;
let insuranceBet = 0;
let holeHidden = true;

const suits = ["♠","♥","♦","♣"];
const values = [
{name:"A",val:11},{name:"2",val:2},{name:"3",val:3},
{name:"4",val:4},{name:"5",val:5},{name:"6",val:6},
{name:"7",val:7},{name:"8",val:8},{name:"9",val:9},
{name:"10",val:10},{name:"J",val:10},
{name:"Q",val:10},{name:"K",val:10}
];

const bgMusic = document.getElementById("bgMusic");
const winSound = document.getElementById("winSound");
const loseSound = document.getElementById("loseSound");
const blackjackSound = document.getElementById("blackjackSound");
const chipSound = document.getElementById("chipSound");

function saveChips(){ localStorage.setItem("bjNeonChips",chips); }
function loadChips(){
  const saved=localStorage.getItem("bjNeonChips");
  if(saved) chips=parseInt(saved);
  updateChips();
}
function updateChips(){
  document.getElementById("chips").innerText=chips;
  saveChips();
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
  renderHand(playerHand,"playerCards",false);
  renderHand(dealerHand,"dealerCards",holeHidden);
  document.getElementById("playerScore").innerText=score(playerHand);
  document.getElementById("dealerScore").innerText=holeHidden?"?":score(dealerHand);
}

function renderHand(hand,id,hideHole){
  const el=document.getElementById(id);
  el.innerHTML="";
  hand.forEach((c,i)=>{
    const d=document.createElement("div");
    d.className="card";
    if(hideHole && i===1){
      d.classList.add("back");
      d.innerText="🂠";
    } else {
      d.innerText=c.name+c.suit;
    }
    el.appendChild(d);
  });
}

function addBet(v){
  if(gameActive) return;
  if(chips>=v){
    chipSound.play();
    bet+=v;
    chips-=v;
    updateChips();
    document.getElementById("betDisplay").innerText=bet;
  }
}

function clearBet(){
  if(gameActive) return;
  chips+=bet;
  bet=0;
  updateChips();
  document.getElementById("betDisplay").innerText=0;
}

function startGame(){
  if(bet===0) return alert("Place bet first");
  bgMusic.play();
  createDeck();
  playerHand=[];
  dealerHand=[];
  holeHidden=true;
  gameActive=true;

  draw(playerHand);
  draw(dealerHand);
  draw(playerHand);
  draw(dealerHand);

  render();

  if(score(playerHand)===21){
    holeHidden=false;
    render();
    chips+=bet*2.5;
    blackjackSound.play();
    document.getElementById("message").innerText="BLACKJACK! 3:2 Payout!";
    updateChips();
    gameActive=false;
  }

  toggleButtons(true);
}

function hit(){
  draw(playerHand);
  render();
  if(score(playerHand)>21) endGame();
}

function stand(){
  holeHidden=false;
  render();
  while(score(dealerHand)<17) draw(dealerHand);
  endGame();
}

function endGame(){
  toggleButtons(false);
  gameActive=false;
  holeHidden=false;
  render();

  let p=score(playerHand);
  let d=score(dealerHand);

  if(p>21){
    loseSound.play();
    document.getElementById("message").innerText="Bust!";
  }
  else if(d>21 || p>d){
    winSound.play();
    chips+=bet*2;
    document.getElementById("message").innerText="You Win!";
  }
  else if(p===d){
    chips+=bet;
    document.getElementById("message").innerText="Push";
  }
  else{
    loseSound.play();
    document.getElementById("message").innerText="Dealer Wins";
  }

  updateChips();
}

function toggleButtons(state){
  ["hitBtn","standBtn","doubleBtn","splitBtn","insuranceBtn"]
  .forEach(id=>document.getElementById(id).disabled=!state);
}

document.querySelectorAll(".chip")
.forEach(c=>c.onclick=()=>addBet(parseInt(c.dataset.value)));

document.getElementById("clearBet").onclick=clearBet;
document.getElementById("dealBtn").onclick=startGame;
document.getElementById("hitBtn").onclick=hit;
document.getElementById("standBtn").onclick=stand;

loadChips();
