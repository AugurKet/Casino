const questions = [

/* =======================
   1️⃣ FUNDAMENTALS (20)
======================= */

{
category:"Fundamentals",
q:"What is the strongest starting hand in Texas Hold'em?",
o:["AA","KK","AKs","QQ"],
a:0,
ex:"Pocket Aces (AA) is mathematically the strongest starting hand preflop."
},
{
category:"Fundamentals",
q:"Which position acts last postflop?",
o:["UTG","CO","BTN","SB"],
a:2,
ex:"The Button (BTN) always acts last postflop, giving maximum information advantage."
},
{
category:"Fundamentals",
q:"What does 'equity' mean?",
o:["Pot size","Chance to win at showdown","Bet sizing","Stack depth"],
a:1,
ex:"Equity is your percentage chance of winning the pot if all cards are dealt."
},
{
category:"Fundamentals",
q:"What beats a straight?",
o:["Two Pair","Set","Flush","Trips"],
a:2,
ex:"A flush ranks above a straight in hand rankings."
},
{
category:"Fundamentals",
q:"What is a 'set'?",
o:["Three of a kind using pocket pair","Any trips","Two pair","Straight"],
a:0,
ex:"A set is specifically when you have a pocket pair and hit one card on board."
},
{
category:"Fundamentals",
q:"Why is position important?",
o:["You bluff more","You see opponents act first","You bet bigger","You win automatically"],
a:1,
ex:"Acting later gives information advantage, improving decision quality."
},
{
category:"Fundamentals",
q:"What is 'effective stack'?",
o:["Biggest stack at table","Smallest stack in hand","Total chips in play","Blind size"],
a:1,
ex:"Effective stack is the smaller stack between players involved."
},
{
category:"Fundamentals",
q:"What is fold equity?",
o:["Pot odds","Chance opponent folds","Showdown equity","Stack advantage"],
a:1,
ex:"Fold equity is the probability your opponent folds to your bet."
},
{
category:"Fundamentals",
q:"What does 'range' mean?",
o:["One hand","All hands player can have","Board texture","Pot size"],
a:1,
ex:"A range is the full set of possible hands an opponent may hold."
},
{
category:"Fundamentals",
q:"Which is a speculative hand?",
o:["AA","AKo","76s","KK"],
a:2,
ex:"Suited connectors like 76s rely on implied odds and board development."
},

/* 10 more fundamentals */

{
category:"Fundamentals",
q:"Which position is tightest in full ring?",
o:["UTG","BTN","CO","BB"],
a:0,
ex:"UTG acts first preflop and must play tighter ranges."
},
{
category:"Fundamentals",
q:"What is an overpair?",
o:["Pair above board top card","Two pair","Trips","Full house"],
a:0,
ex:"An overpair is when your pocket pair is higher than any board card."
},
{
category:"Fundamentals",
q:"What dominates AJo?",
o:["AQo","ATs","KQo","99"],
a:0,
ex:"AQo dominates AJo because it has better kicker when ace hits."
},
{
category:"Fundamentals",
q:"What is a blocker?",
o:["Small bet","Card reducing opponent combos","Slowplay","Check"],
a:1,
ex:"Holding a card reduces the combinations opponent can have."
},
{
category:"Fundamentals",
q:"6-max ranges are generally?",
o:["Tighter","Wider","Same as full ring","Random"],
a:1,
ex:"With fewer players, opening ranges expand significantly."
},
{
category:"Fundamentals",
q:"What does 100bb mean?",
o:["$100","100 chips","100 big blinds deep","Pot size"],
a:2,
ex:"100bb refers to stack depth relative to big blind."
},
{
category:"Fundamentals",
q:"Trips differ from set because?",
o:["Trips use one hole card","Set uses pocket pair","Trips weaker","No difference"],
a:1,
ex:"Set requires pocket pair; trips may use one hole card."
},
{
category:"Fundamentals",
q:"Kicker matters when?",
o:["Flush","Straight","Same pair strength","Full house"],
a:2,
ex:"When both players have same pair, kicker determines winner."
},
{
category:"Fundamentals",
q:"Implied odds relate to?",
o:["Current pot","Future potential winnings","Stack size only","Blind structure"],
a:1,
ex:"Implied odds consider future money you can win."
},
{
category:"Fundamentals",
q:"Which hand has best raw equity vs random?",
o:["AA","AKs","QQ","JJ"],
a:0,
ex:"AA has highest equity against a random hand."
},

/* =======================
   2️⃣ PREFLOP (20)
======================= */

{
category:"Preflop",
q:"Who has widest opening range?",
o:["UTG","MP","CO","BTN"],
a:3,
ex:"Button opens widest due to positional advantage."
},
{
category:"Preflop",
q:"UTG should open?",
o:["Wide","Tight","Any two suited","Any pair"],
a:1,
ex:"UTG plays tightest because acts first."
},
{
category:"Preflop",
q:"Best 3-bet bluff candidate?",
o:["A5s","72o","K2o","J4o"],
a:0,
ex:"A5s has blocker + playability."
},
{
category:"Preflop",
q:"QQ vs UTG open 100bb?",
o:["Fold","Call/3bet","All-in","Check"],
a:1,
ex:"QQ is strong vs UTG but not always all-in."
},
{
category:"Preflop",
q:"Cold calling too much causes?",
o:["Stronger range","Reverse implied odds","More bluffs","Balance"],
a:1,
ex:"You risk dominated situations."
},

/* Remaining 15 Preflop */

{
category:"Preflop",
q:"Standard open size cash game?",
o:["1bb","2-3bb","5bb","All-in"],
a:1,
ex:"2-3bb is standard open size."
},
{
category:"Preflop",
q:"Facing 3bet OOP with marginal hand?",
o:["Call always","Fold often","Jam always","Min-raise"],
a:1,
ex:"OOP realization poor; fold more."
},
{
category:"Preflop",
q:"Squeeze means?",
o:["Cold call","3bet after raise+call","Open shove","Limp"],
a:1,
ex:"Squeeze exploits dead money."
},
{
category:"Preflop",
q:"SB vs BTN strategy?",
o:["Passive","Aggressive 3bet","Fold all","Limp always"],
a:1,
ex:"SB defends aggressively vs BTN steals."
},
{
category:"Preflop",
q:"AK vs 4bet 100bb deep?",
o:["Fold always","Call/5bet depending","Always shove","Limp"],
a:1,
ex:"AK strong but depends on opponent."
},
{
category:"Preflop",
q:"Open limp in cash usually?",
o:["Optimal","Weak strategy","GTO approved","Standard"],
a:1,
ex:"Open limping often suboptimal in cash."
},
{
category:"Preflop",
q:"Which benefits most from position?",
o:["AA","72o","Marginal hands","KK"],
a:2,
ex:"Marginal hands gain from positional control."
},
{
category:"Preflop",
q:"3bet for value includes?",
o:["QQ+ AK","Any suited","Small pairs","Broadways only"],
a:0,
ex:"Strong linear value range."
},
{
category:"Preflop",
q:"Calling 3bet with small pairs aims to?",
o:["Bluff","Set mine","Hit straight","Hit flush only"],
a:1,
ex:"Set mining relies on implied odds."
},
{
category:"Preflop",
q:"Effective stacks 20bb change strategy?",
o:["No","More shoving","More limping","More calling"],
a:1,
ex:"Short stacks increase shove frequency."
},
{
category:"Preflop",
q:"BTN steal frequency generally?",
o:["Low","High","Zero","Same as UTG"],
a:1,
ex:"BTN steals frequently."
},
{
category:"Preflop",
q:"Which hand 4bet bluff candidate?",
o:["A5s","J2o","K4o","98o"],
a:0,
ex:"Blockers make A5s good 4bet bluff."
},
{
category:"Preflop",
q:"Flatting AA preflop usually?",
o:["Standard","Trap sometimes","Always bad","Always good"],
a:1,
ex:"Can trap but risks multiway pot."
},
{
category:"Preflop",
q:"Range vs range thinking starts?",
o:["River","Turn","Flop","Preflop"],
a:3,
ex:"Preflop defines range structure."
},
{
category:"Preflop",
q:"ICM affects preflop by?",
o:["Widening ranges","Tightening ranges near bubble","No effect","Doubling bets"],
a:1,
ex:"ICM pressure tightens ranges."
},

/* =======================
   3️⃣ POSTFLOP (20)
======================= */

{
category:"Postflop",
q:"Dry board example?",
o:["A72 rainbow","JT9 two-tone","876 two-tone","KQJ"],
a:0,
ex:"A72 rainbow has few draws."
},
{
category:"Postflop",
q:"Wet board means?",
o:["Few draws","Many draws possible","No flush","Paired board"],
a:1,
ex:"Wet boards contain many draw combos."
},
{
category:"Postflop",
q:"Cbet frequency higher on?",
o:["Connected board","Paired dry board","Wet board","Monotone"],
a:1,
ex:"Dry boards favor preflop raiser."
},
{
category:"Postflop",
q:"Double barrel means?",
o:["Two players","Bet flop & turn","Two pots","Overbet"],
a:1,
ex:"Barreling continues aggression."
},
{
category:"Postflop",
q:"Check-raise often represents?",
o:["Weakness","Strength or balanced bluff","Fold","Call"],
a:1,
ex:"Check-raise polarized."
},

/* 15 more concise */

{
category:"Postflop",
q:"Floating means?",
o:["Bluff raise","Call flop with plan to bluff later","All-in","Check back"],
a:1,
ex:"Float delays bluff to later street."
},
{
category:"Postflop",
q:"Overbet polarizes range?",
o:["No","Yes","Sometimes never","Only river"],
a:1,
ex:"Overbets represent nuts or bluffs."
},
{
category:"Postflop",
q:"Protection bet prevents?",
o:["Equity realization","Bluffing","Stacking","Rake"],
a:0,
ex:"Prevents opponent from seeing free cards."
},
{
category:"Postflop",
q:"Value bet targets?",
o:["Better hands","Worse hands","Bluffs","Air"],
a:1,
ex:"Value bets get called by worse."
},
{
category:"Postflop",
q:"Semi-bluff has?",
o:["Zero equity","Some equity","Only nuts","Only air"],
a:1,
ex:"Semi-bluffs have draw potential."
},
{
category:"Postflop",
q:"Paired board favors?",
o:["Caller always","Raiser range often","Blinds","Short stack"],
a:1,
ex:"Raiser often has overpairs."
},
{
category:"Postflop",
q:"Turn card changes?",
o:["Nothing","Equity distribution","Blinds","Stack depth"],
a:1,
ex:"Turn can shift nut advantage."
},
{
category:"Postflop",
q:"Pot control aims to?",
o:["Max pot","Reduce pot with marginal hand","Bluff","Jam"],
a:1,
ex:"Controls variance with medium strength."
},
{
category:"Postflop",
q:"Thin value bet means?",
o:["Big bet","Small value bet","Jam","Bluff"],
a:1,
ex:"Target marginal worse hands."
},
{
category:"Postflop",
q:"River bet sizing depends on?",
o:["Stack only","Range advantage","Random","Mood"],
a:1,
ex:"Sizing aligns with range strategy."
},
{
category:"Postflop",
q:"Check back flop with strong hand sometimes to?",
o:["Give up","Trap","Fold","Tilt"],
a:1,
ex:"Induce bluffs later."
},
{
category:"Postflop",
q:"Board texture influences?",
o:["Nothing","Range interaction","Dealer","Blind size"],
a:1,
ex:"Texture affects range advantage."
},
{
category:"Postflop",
q:"Bluff works best against?",
o:["Calling station","Tight players","Anyone","Short stack"],
a:1,
ex:"Tight players fold more."
},
{
category:"Postflop",
q:"Polarized range means?",
o:["Middle strength","Strong or weak","Only nuts","Only air"],
a:1,
ex:"Polarized = extremes."
},
{
category:"Postflop",
q:"Merged range means?",
o:["Mixed strengths","Only nuts","Only bluffs","Air"],
a:0,
ex:"Merged contains many medium strength hands."
},

/* =======================
   4️⃣ MATH (20)
======================= */

{
category:"Math",
q:"Pot $100, bet $50. Pot odds?",
o:["2:1","3:1","1:1","1.5:1"],
a:0,
ex:"You call 50 to win 150 total → 3:1 payout, 2:1 odds ratio."
},
{
category:"Math",
q:"Flush draw flop equity approx?",
o:["9%","18%","36%","50%"],
a:2,
ex:"9 outs ≈ 36% by river."
},
{
category:"Math",
q:"Open-ended straight draw outs?",
o:["4","6","8","12"],
a:2,
ex:"8 outs for OESD."
},
{
category:"Math",
q:"Rule of 4 applies on?",
o:["Turn","Flop","River","Preflop"],
a:1,
ex:"Multiply outs ×4 on flop."
},
{
category:"Math",
q:"Implied odds high when?",
o:["Deep stacks","Short stacks","Heads up only","No draws"],
a:0,
ex:"Deep stacks allow future winnings."
},

/* 15 more concise math */

{
category:"Math",
q:"1 outer river probability approx?",
o:["2%","10%","20%","50%"],
a:0,
ex:"1/46 ≈ 2%."
},
{
category:"Math",
q:"Break-even bluff frequency formula?",
o:["Bet/(Pot+Bet)","Pot/Bet","Stack size","Equity"],
a:0,
ex:"Bluff needs folds equal to bet/(pot+bet)."
},
{
category:"Math",
q:"EV positive when?",
o:["Win% × pot > cost","Random","Stack bigger","Any time"],
a:0,
ex:"Expected value positive if weighted win exceeds cost."
},
{
category:"Math",
q:"If need 25% equity, minimum odds?",
o:["3:1","1:3","4:1","1:4"],
a:0,
ex:"25% equity equals 3:1 pot odds."
},
{
category:"Math",
q:"Combo count AA?",
o:["4","6","12","16"],
a:1,
ex:"AA has 6 combinations."
},
{
category:"Math",
q:"AK offsuit combos?",
o:["4","6","12","16"],
a:2,
ex:"AKo has 12 combos."
},
{
category:"Math",
q:"Flush draw turn to river equity?",
o:["9%","18%","36%","50%"],
a:1,
ex:"9 outs ≈ 18% on one card."
},
{
category:"Math",
q:"Pot $200 bet $100, equity needed?",
o:["25%","33%","50%","66%"],
a:1,
ex:"Call 100 to win 300 total → 33%."
},
{
category:"Math",
q:"Two overcards flop equity approx?",
o:["6%","12%","24%","40%"],
a:2,
ex:"6 outs ≈ 24% by river."
},
{
category:"Math",
q:"Reverse implied odds risk with?",
o:["Nut draws","Dominated hands","AA","Short stack"],
a:1,
ex:"Dominated hands lose big pots."
},
{
category:"Math",
q:"Fold equity increases with?",
o:["Small bet","Large bet","Check","Call"],
a:1,
ex:"Bigger bets create more fold pressure."
},
{
category:"Math",
q:"All-in equity calculator calculates?",
o:["Exact probability","Stack size","Mood","Dealer bias"],
a:0,
ex:"Computes precise showdown equity."
},
{
category:"Math",
q:"If bluffing half pot, need folds?",
o:["25%","33%","50%","66%"],
a:1,
ex:"Half pot bet requires 33% folds."
},
{
category:"Math",
q:"Combinatorics helps with?",
o:["Counting combos","Bet sizing","Position","Dealer"],
a:0,
ex:"Used to count hand combinations."
},
{
category:"Math",
q:"Variance in poker means?",
o:["Skill","Short-term luck swings","Blinds","Stack depth"],
a:1,
ex:"Variance reflects short-term randomness."
},

/* =======================
   5️⃣ ADVANCED (20)
======================= */

{
category:"Advanced",
q:"Exploitative play means?",
o:["Follow GTO always","Adjust to opponent leaks","Random","Overbet always"],
a:1,
ex:"Exploit strategy deviates to punish mistakes."
},
{
category:"Advanced",
q:"GTO aims to?",
o:["Exploit","Be unexploitable","Max variance","Tilt"],
a:1,
ex:"Game Theory Optimal avoids being exploited."
},
{
category:"Advanced",
q:"Against calling station?",
o:["Bluff more","Value bet more","Fold everything","Slowplay"],
a:1,
ex:"Stations call too much → value bet."
},
{
category:"Advanced",
q:"Against nit?",
o:["Bluff more","Value thin less","Call wide","Never bet"],
a:0,
ex:"Nits overfold → bluff profitable."
},
{
category:"Advanced",
q:"ICM strongest near?",
o:["Early stage","Bubble","Deep cash","Rebuy"],
a:1,
ex:"ICM pressure peaks near bubble."
},

/* 15 more concise */

{
category:"Advanced",
q:"Range advantage means?",
o:["More nuts in range","More chips","More bluffs","Dealer edge"],
a:0,
ex:"Range has more strong combos."
},
{
category:"Advanced",
q:"Nut advantage means?",
o:["Top possible hands","Bluff frequency","Stack size","Blind level"],
a:0,
ex:"Having more nut combos."
},
{
category:"Advanced",
q:"Balancing range prevents?",
o:["Exploitability","Winning","Bluffing","Value betting"],
a:0,
ex:"Balance avoids being readable."
},
{
category:"Advanced",
q:"Overfolding opponent means?",
o:["Bluff less","Bluff more","Call more","Jam less"],
a:1,
ex:"Exploit by increasing bluffs."
},
{
category:"Advanced",
q:"Underbluffing opponent means?",
o:["Hero call more","Fold more","Bluff more","Jam always"],
a:1,
ex:"They lack bluffs → fold more."
},
{
category:"Advanced",
q:"Polar strategy used on?",
o:["River often","Preflop only","Turn only","Never"],
a:0,
ex:"River play often polarized."
},
{
category:"Advanced",
q:"Equilibrium means?",
o:["Balanced state","Random","Stack size","Bluff only"],
a:0,
ex:"No player gains by deviating."
},
{
category:"Advanced",
q:"Meta-game refers to?",
o:["Table dynamics","Board texture","Dealer position","Blinds"],
a:0,
ex:"Long-term adjustments & history."
},
{
category:"Advanced",
q:"Image tight means?",
o:["Bluff less effective","Bluff more effective","No effect","Lose more"],
a:1,
ex:"Tight image increases fold equity."
},
{
category:"Advanced",
q:"Table selection impacts?",
o:["Winrate","Luck","Dealer","Blinds"],
a:0,
ex:"Better games increase profit."
},
{
category:"Advanced",
q:"Short stack tournament play emphasizes?",
o:["ICM","Deep bluffing","Slowplay","Speculative hands"],
a:0,
ex:"ICM critical short-stacked."
},
{
category:"Advanced",
q:"Solver outputs aim to?",
o:["Approximate GTO","Exploit","Tilt","Cashout"],
a:0,
ex:"Solvers approximate optimal strategy."
},
{
category:"Advanced",
q:"Population tendency means?",
o:["General player leak","Stack size","Blinds","Rake"],
a:0,
ex:"Common tendencies in pool."
},
{
category:"Advanced",
q:"Thin river value best vs?",
o:["Loose caller","Nit","Aggro reg","Short stack"],
a:0,
ex:"Loose players call wider."
},
{
category:"Advanced",
q:"Balanced bluff:value river ratio often near?",
o:["1:1 in pot-size bet","10:1","All value","All bluff"],
a:0,
ex:"Pot-sized bet equilibrium near 1:1."
}

];
