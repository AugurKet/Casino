let chips = 500;
let bet = 0;
let deck = [];
let playerHands = [[]];
let dealerHand = [];
let currentHandIndex = 0;
let gameActive = false;
let insuranceBet = 0;

const suits = ["♠","♥","♦","♣"];
const values = [
  {name:"A", val:11},{name:"2", val:2},{name:"3", val:3},
  {name:"4", val:4},{name:"5", val:5},{name:"6", val:6},
  {name:"7", val:7},{name:"8", val:8},{name:"9", val:9},
  {name:"10", val:10},{name:"J", val:10},
  {name:"Q", val:10},{name:"K", val:10}
];

function saveChips(){ localStorage.setItem("bjNeonChips", chips); }
function loadChips(){
  const saved = localStorage.getItem("bjNeonChips");
  if(saved) chips = parseInt(saved);
  updateChips();
}

function updateChips(){
  document.getElementById("chips").innerText = chips;
  saveChips();
}

function createDeck(){
  deck=[];
  for(let s of suits)
    for(let v of values)
      deck.push({suit:s,name:v.name,val:v.val});
  deck.sort(()=>Math.random()-0.5);
}

function draw(hand){
  hand.push(deck.pop());
}

function score(hand){
  let s=0, aces=0;
  hand.forEach(c=>{ s+=c.val; if(c.name==="A") aces++; });
  while(s>21 && aces>0){ s-=10; aces--; }
  return s;
}

function render(){
  renderHand(playerHands[currentHandIndex], "playerCards");
  renderHand(dealerHand,"dealerCards");
  document.getElementById("playerScore").innerText = score(playerHands[currentHandIndex]);
  document.getElementById("dealerScore").innerText = gameActive ? "?" : score(dealerHand);
}

function renderHand(hand,id){
  const el=document.getElementById(id);
  el.innerHTML="";
  hand.forEach(c=>{
    const d=document.createElement("div");
    d.className="card";
    d.innerText=c.name+c.suit;
    el.appendChild(d);
  });
}

function addBet(value){
  if(gameActive) return;
  if(chips>=value){
    bet+=value;
    chips-=value;
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
  if(bet===0) return alert("Place a bet!");
  gameActive=true;
  createDeck();
  playerHands=[[]];
  dealerHand=[];
  currentHandIndex=0;
  insuranceBet=0;

  draw(playerHands[0]);
  draw(dealerHand);
  draw(playerHands[0]);
  draw(dealerHand);

  document.getElementById("splitBtn").disabled =
    playerHands[0][0].name!==playerHands[0][1].name;

  document.getElementById("insuranceBtn").disabled =
    dealerHand[0].name!=="A";

  toggleButtons(true);
  render();
}

function hit(){
  draw(playerHands[currentHandIndex]);
  render();
  if(score(playerHands[currentHandIndex])>21) nextHand();
}

function stand(){ nextHand(); }

function nextHand(){
  if(currentHandIndex < playerHands.length-1){
    currentHandIndex++;
    render();
  }else{
    dealerTurn();
  }
}

function dealerTurn(){
  while(score(dealerHand)<17) draw(dealerHand);
  gameActive=false;
  render();
  settle();
  toggleButtons(false);
}

function settle(){
  let dealerScore=score(dealerHand);
  playerHands.forEach(hand=>{
    let s=score(hand);
    if(s>21){}
    else if(dealerScore>21 || s>dealerScore){
      chips+=bet*2;
      document.getElementById("message").innerText="🎉 You Win!";
    }
    else if(s===dealerScore){
      chips+=bet;
      document.getElementById("message").innerText="Push!";
    }
    else{
      document.getElementById("message").innerText="Dealer Wins";
    }
  });
  updateChips();
}

function split(){
  if(chips<bet) return;
  chips-=bet;
  updateChips();
  const first=playerHands[0][0];
  const second=playerHands[0][1];
  playerHands=[[first],[second]];
  draw(playerHands[0]);
  draw(playerHands[1]);
  document.getElementById("splitBtn").disabled=true;
  render();
}

function insurance(){
  if(chips<bet/2) return;
  insuranceBet=bet/2;
  chips-=insuranceBet;
  updateChips();
  document.getElementById("insuranceBtn").disabled=true;
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
document.getElementById("splitBtn").onclick=split;
document.getElementById("insuranceBtn").onclick=insurance;

loadChips();
