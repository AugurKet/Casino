const canvas = document.getElementById("wheelCanvas");
const ctx = canvas.getContext("2d");

const numbers = [
  0,32,15,19,4,21,2,25,17,34,6,
  27,13,36,11,30,8,23,10,5,24,
  16,33,1,20,14,31,9,22,18,29,
  7,28,12,35,3,26
];

const redNumbers = [
  1,3,5,7,9,12,14,16,18,19,
  21,23,25,27,30,32,34,36
];

let balance = 1000;
let selectedChip = 10;
let currentBet = null;
let spinning = false;

const balanceEl = document.getElementById("balance");
const resultEl = document.getElementById("result");
const ball = document.getElementById("ball");
const numberInput = document.getElementById("numberInput");

/* --------------------------
   CHIP SELECTION
--------------------------- */

document.querySelectorAll(".chip").forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll(".chip")
      .forEach(b => b.classList.remove("active"));

    btn.classList.add("active");
    selectedChip = parseInt(btn.dataset.value);
  };
});

/* --------------------------
   BET SELECTION
--------------------------- */

document.querySelectorAll(".bet").forEach(btn => {
  btn.onclick = () => {

    document.querySelectorAll(".bet")
      .forEach(b => b.classList.remove("active"));

    btn.classList.add("active");
    currentBet = btn.dataset.bet;

    // Enable number input only if Single Number selected
    if (currentBet === "number") {
      numberInput.disabled = false;
    } else {
      numberInput.disabled = true;
    }
  };
});

numberInput.disabled = true;

/* --------------------------
   DRAW WHEEL
--------------------------- */

function drawWheel(rotation = 0) {

  const radius = canvas.width / 2;
  const arc = (2 * Math.PI) / numbers.length;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();
  ctx.translate(radius, radius);
  ctx.rotate(rotation);

  ctx.textAlign = "right";
  ctx.textBaseline = "middle";
  ctx.font = "bold 14px Arial";

  for (let i = 0; i < numbers.length; i++) {

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, radius, i * arc, (i + 1) * arc);

    ctx.fillStyle =
      numbers[i] === 0 ? "green"
      : redNumbers.includes(numbers[i]) ? "red"
      : "black";

    ctx.fill();

    ctx.save();
    ctx.rotate(i * arc + arc / 2);
    ctx.fillStyle = "white";
    ctx.fillText(numbers[i], radius - 25, 0);
    ctx.restore();
  }

  ctx.restore();

  ctx.beginPath();
  ctx.arc(radius, radius, 40, 0, Math.PI * 2);
  ctx.fillStyle = "#333";
  ctx.fill();
}

drawWheel();

/* --------------------------
   SPIN LOGIC (SNAP CORRECT)
--------------------------- */

document.getElementById("spinBtn").onclick = () => {

  if (spinning || !currentBet) return;

  if (balance < selectedChip) {
    alert("Not enough balance!");
    return;
  }

  spinning = true;
  balance -= selectedChip;
  balanceEl.innerText = balance;

  const winningIndex = Math.floor(Math.random() * numbers.length);
  const winningNumber = numbers[winningIndex];

  const arc = (2 * Math.PI) / numbers.length;
  const pointerOffset = Math.PI / 2;

  const finalRotation =
    pointerOffset -
    (winningIndex * arc) -
    (arc / 2);

  const totalRotation = finalRotation + (Math.PI * 12);

  const spinTime = 5000;
  let start = null;

  function animate(timestamp) {

    if (!start) start = timestamp;

    let progress = timestamp - start;
    let percent = Math.min(progress / spinTime, 1);

    let ease = 1 - Math.pow(1 - percent, 3);
    let currentRotation = totalRotation * ease;

    drawWheel(currentRotation);
    ball.style.transform = `rotate(${-currentRotation * 2}rad)`;

    if (percent < 1) {
      requestAnimationFrame(animate);
    } else {

      // Snap exactly
      drawWheel(finalRotation);
      ball.style.transform = `rotate(${-finalRotation * 2}rad)`;

      finish(winningNumber);
    }
  }

  requestAnimationFrame(animate);
};

/* --------------------------
   RESULT LOGIC
--------------------------- */

function finish(number) {

  spinning = false;
  let win = false;
  let payout = 0;

  if (currentBet === "red" && redNumbers.includes(number)) win = true;
  if (currentBet === "black" && !redNumbers.includes(number) && number !== 0) win = true;
  if (currentBet === "even" && number % 2 === 0 && number !== 0) win = true;
  if (currentBet === "odd" && number % 2 === 1) win = true;

  if (currentBet === "number") {
    const input = parseInt(numberInput.value);
    if (input === number) {
      win = true;
      payout = selectedChip * 36;
    }
  }

  if (win) {
    if (currentBet !== "number") payout = selectedChip * 2;
    balance += payout;
    resultEl.innerText = "🎉 WIN! Number: " + number;
  } else {
    resultEl.innerText = "❌ Lose! Number: " + number;
  }

  balanceEl.innerText = balance;
}
