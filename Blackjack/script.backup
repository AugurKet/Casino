let chips = 500;
let bet = 0;
let deck = [];
let playerHands = [[]];
let playerBets = [];
let dealerHand = [];
let currentHand = 0;
let gameActive = false;
let insuranceBet = 0;
let holeHidden = true;
let musicStarted = false;

const suits = ["♠","♥","♦","♣"];
const values = [
  {name:"A",val:11},{name:"2",val:2},{name:"3",val:3},
  {name:"4",val:4},{name:"5",val:5},{name:"6",val:6},
  {name:"7",val:7},{name:"8",val:8},{name:"9",val:9},
  {name:"10",val:10},{name:"J",val:10},{name:"Q",val:10},{name:"K",val:10}
];

const bgMusic = document.getElementById("bgMusic");
const winSound = document.getElementById("winSound");
const loseSound = document.getElementById("loseSound");
const blackjackSound = document.getElementById("blackjackSound");
const chipSound = document.getElementById("chipSound");

function startMusic(){
  if(!musicStarted){
    bgMusic.volume=0.3;
    bgMusic.play().catch(()=>{});
    musicStarted=true;
  }
}

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
  renderHand(playerHands[currentHand],"playerCards",false);
  renderHand(dealerHand,"dealerCards",holeHidden);
  document.getElementById("playerScore").innerText=score(playerHands[currentHand]);
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
    startMusic();
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
  document.querySelectorAll(".chip").forEach(c=>c.classList.remove("selected"));
}

function startGame(){
  if(bet===0) return alert("Place bet first");
  createDeck();
  playerHands=[[]];
  playerBets=[bet];
  dealerHand=[];
  currentHand=0;
  holeHidden=true;
  gameActive=true;
  insuranceBet = 0;
  document.getElementById("message").innerText="";

  draw(playerHands[0]);
  draw(dealerHand);
  draw(playerHands[0]);
  draw(dealerHand);

  document.getElementById("splitBtn").disabled =
    playerHands[0][0].name!==playerHands[0][1].name;

  document.getElementById("insuranceBtn").disabled =
    dealerHand[0].name!=="A";

  render();

  if(score(playerHands[0])===21){
    holeHidden=false;
    render();
    chips += bet * 2.5;
    blackjackSound.play();
    document.getElementById("message").innerText="BLACKJACK!";
    updateChips();
    gameActive=false;
  }

  toggleButtons(true);
}

function hit(){
  draw(playerHands[currentHand]);
  render();
  if(score(playerHands[currentHand])>21){
    document.getElementById("message").innerText="BUST!";
    nextHand();
  }
}

function stand(){ nextHand(); }

function doubleDown(){
  if(chips < playerBets[currentHand]) return;
  chips -= playerBets[currentHand];
  playerBets[currentHand] *= 2;
  draw(playerHands[currentHand]);
  nextHand();
}

function split(){
  if(chips < playerBets[0]) return;
  chips -= playerBets[0];
  const [c1,c2] = playerHands[0];
  playerHands = [[c1],[c2]];
  playerBets = [bet, bet];
  draw(playerHands[0]);
  draw(playerHands[1]);
  document.getElementById("splitBtn").disabled = true;
  render();
}

function insurance(){
  if(chips < bet/2) return;
  insuranceBet = bet/2;
  chips -= insuranceBet;
  updateChips();
  document.getElementById("insuranceBtn").disabled = true;
}

function nextHand(){
  if(currentHand < playerHands.length-1){
    currentHand++;
    render();
  } else {
    dealerTurn();
  }
}

function dealerTurn(){
  holeHidden=false;
  render();
  while(score(dealerHand)<17) draw(dealerHand);
  settleInsurance();
  settle();
}

function settleInsurance(){
  if(dealerHand[0].name === "A" && score(dealerHand) === 21 && insuranceBet > 0){
    chips += insuranceBet * 3;
    winSound.play();
  }
  insuranceBet = 0;
}

function settle(){
  gameActive=false;
  toggleButtons(false);
  let dealerScore=score(dealerHand);

  playerHands.forEach((hand,i)=>{
    let s=score(hand);
    let b = playerBets[i];
    if(s>21){
      loseSound.play();
    }
    else if(dealerScore>21 || s>dealerScore){
      chips += b*2;
      winSound.play();
    }
    else if(s===dealerScore){
      chips += b;
    } else {
      loseSound.play();
    }
  });

  updateChips();
}

function toggleButtons(state){
  ["hitBtn","standBtn","doubleBtn","splitBtn","insuranceBtn"]
  .forEach(id=>document.getElementById(id).disabled=!state);
}

document.querySelectorAll(".chip")
.forEach(c=>{
  c.onclick=()=>{
    document.querySelectorAll(".chip").forEach(x=>x.classList.remove("selected"));
    c.classList.add("selected");
    addBet(parseInt(c.dataset.value));
  }
});

document.getElementById("clearBet").onclick=clearBet;
document.getElementById("dealBtn").onclick=startGame;
document.getElementById("hitBtn").onclick=hit;
document.getElementById("standBtn").onclick=stand;
document.getElementById("doubleBtn").onclick=doubleDown;
document.getElementById("splitBtn").onclick=split;
document.getElementById("insuranceBtn").onclick=insurance;

loadChips();
