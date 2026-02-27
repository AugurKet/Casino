const wheel = document.getElementById("wheel");
const ball = document.getElementById("ball");
const resultText = document.getElementById("result");
const spinBtn = document.getElementById("spinBtn");

const numbers = [
  0,32,15,19,4,21,2,25,17,34,6,
  27,13,36,11,30,8,23,10,5,24,
  16,33,1,20,14,31,9,22,18,29,
  7,28,12,35,3,26
];

const segmentAngle = 360 / numbers.length;

spinBtn.addEventListener("click", () => {

  spinBtn.disabled = true;

  // 1️⃣ Pick winning number first
  const winningIndex = Math.floor(Math.random() * numbers.length);
  const winningNumber = numbers[winningIndex];

  // 2️⃣ Calculate exact stopping angle
  const stopAngle = (360 * 5) + (360 - winningIndex * segmentAngle);

  // 3️⃣ Spin wheel
  wheel.style.transform = `rotate(${stopAngle}deg)`;

  // 4️⃣ Ball animation
  ball.style.transition = "transform 4s ease-out";
  ball.style.transform = `rotate(${720}deg)`;

  // 5️⃣ Show result after animation
  setTimeout(() => {
    resultText.innerText = "Winning Number: " + winningNumber;
    spinBtn.disabled = false;
  }, 4000);

});
