let shuffled = [];
let index = 0;
let score = 0;
let categoryScore = {};
let timer;
let timeLeft = 15;
let answered = false;

function startQuiz(){
document.getElementById("start-screen").classList.add("hidden");
document.getElementById("quiz-screen").classList.remove("hidden");

shuffled = [...questions].sort(()=>0.5-Math.random());
index = 0;
score = 0;
categoryScore = {};
showQuestion();
}

function showQuestion(){
answered = false;

if(index >= shuffled.length){
showResults();
return;
}

let current = shuffled[index];

document.getElementById("progress").innerText = 
`Question ${index+1} / ${questions.length}`;

document.getElementById("question").innerText = current.q;

let optionsDiv = document.getElementById("options");
optionsDiv.innerHTML = "";

current.o.forEach((opt,i)=>{
let btn = document.createElement("button");
btn.innerText = opt;
btn.classList.add("option-btn");
btn.onclick = ()=>selectAnswer(i);
optionsDiv.appendChild(btn);
});

document.getElementById("explanation").innerHTML = "";
document.getElementById("next-btn").classList.add("hidden");

startTimer();
}

function selectAnswer(choice){

if(answered) return;
answered = true;

clearInterval(timer);

let current = shuffled[index];
let buttons = document.querySelectorAll(".option-btn");

buttons.forEach((btn,i)=>{
btn.disabled = true;

if(i === current.a){
btn.classList.add("correct");
}

if(i === choice && choice !== current.a){
btn.classList.add("wrong");
}
});

if(choice === current.a){
score++;
categoryScore[current.category] = 
(categoryScore[current.category]||0)+1;
}

document.getElementById("explanation").innerHTML =
`<strong>Explanation:</strong> ${current.ex}`;

document.getElementById("next-btn").classList.remove("hidden");
}

function nextQuestion(){
index++;
showQuestion();
}

function startTimer(){
timeLeft = 15;
document.getElementById("timer").innerText = `Time: ${timeLeft}`;

timer = setInterval(()=>{
timeLeft--;
document.getElementById("timer").innerText = `Time: ${timeLeft}`;

if(timeLeft<=0){
clearInterval(timer);
autoReveal();
}
},1000);
}

function autoReveal(){
if(answered) return;

answered = true;

let current = shuffled[index];
let buttons = document.querySelectorAll(".option-btn");

buttons.forEach((btn,i)=>{
btn.disabled = true;
if(i === current.a){
btn.classList.add("correct");
}
});

document.getElementById("explanation").innerHTML =
`<strong>Time's up!</strong><br>${current.ex}`;

document.getElementById("next-btn").classList.remove("hidden");
}

function showResults(){

document.getElementById("quiz-screen").classList.add("hidden");
document.getElementById("result-screen").classList.remove("hidden");

let level="";

if(score>=90) level="🦈 Shark";
else if(score>=75) level="💼 Pro Regular";
else if(score>=60) level="🎯 Thinking Player";
else if(score>=40) level="🎲 Gambler";
else level="🃏 Calling Station";

let output=`<h3>Overall: ${score}/${questions.length}</h3><br>`;

["Fundamentals","Preflop","Postflop","Math","Advanced"]
.forEach(cat=>{
output+=`${cat}: ${categoryScore[cat]||0}/20<br>`;
});

output+=`<br><strong>Level: ${level}</strong>`;

document.getElementById("results").innerHTML = output;
}

function restart(){
location.reload();
}
