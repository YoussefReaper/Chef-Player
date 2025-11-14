const AudioCtx = window.AudioContext || window.webkitAudioContext;
let ctx, muted = false;
const soundEffects = {
    click() {beep(440, .06, .02)},
    ok() {beep(720, .09, .02); setTimeout(() => beep(880, .09, .02), 80)},
    fail() { noise(180); setTimeout(() => beep(160, .08, .08), 40)},
    tick() {beep(600, .02, .004)},
    bonus() {arpeggio([880, 1100, 1400], 60)}
};

function ensureCtx() {
    if (!ctx) ctx = new AudioCtx()
}
function beep(freq=440, dur=.08, vol=.04) {
    if(muted) return;
    ensureCtx();
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = 'sine';
    o.frequency.value = freq;
    g.gain.value = vol;
    o.connect(g); g.connect(ctx.destination);
    o.start();
    o.stop(ctx.currentTime + dur);
}
function noise(dur=200) {
    if(muted) return;
    ensureCtx();
    const bufferSize = ctx.sampleRate * (dur/1000);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for(let i = 0; i< bufferSize; i++) {
        data[i] = (Math.random() * 2 -1)*0.2;
    }
    const src = ctx.createBufferSource();
    src.buffer = buffer;
    const g = ctx.createGain();
    g.gain.value = 0.3;
    src.connect(g);
    g.connect(ctx.destination);
    src.start();
    src.stop(ctx.currentTime + dur/1000);
}
function arpeggio(freqs, gap) {
    freqs.forEach((f, i) => {
        setTimeout(()=> beep(f, .07, .03), i*gap)
    });
}

const moves = [
    {id:'crack_egg', label:'Crack Egg', image:'moves/cracked_eggs.webp', type:'tap', cost:1, rarity:"common"},
    {id:'add_cheese', label:'Add Cheese', image:'moves/cheese.webp', type:'tap', cost:3, rarity:"common"},
    {id:'add_tomato', label:'Add Tomato', image:'moves/tomato.webp', type:'tap', cost: 1, rarity:"common"},
    {id: 'add_bread', label:'Add Bread', image:'moves/bread.webp', type:'tap', cost:1, rarity:"common"},
    {id: 'add_rice', label:'Add Rice', image:'moves/rice.webp', type:'tap', cost:2, rarity:"common"},
    {id:'add_sauce',label:'Add Sauce', image:'moves/sauce.webp', type:'tap', cost:2, rarity:"common"},
    {id: 'add_meat', label:'Add Meat', image:'moves/meat.webp', type:'tap', cost:8, rarity:"rare"},
    {id:'add_milk',label:'Add Milk', image:'moves/milk.webp', type:'tap', cost: 2, rarity:"common"},
    {id: 'add_chickpeas', label:'Add Chickpeas', image:'moves/chickpeas.webp', type:'tap', cost:4, rarity:"common"},
    {id: 'add_garlic', label:'Add Garlic', image:'moves/garlic.webp', type:'tap', cost:2, rarity:"common"},
    {id: 'add_onion', label:'Add Onion', image: 'moves/onion.webp', type:'tap', cost:2, rarity:"common"},
    {id: 'add_pasta', label:'Add Pasta', image:'moves/pasta.webp', type:'tap', cost:3, rarity:"common"},
    {id: 'add_oil', label:'Pour Oil', image: 'moves/oil.webp', type: 'tap', cost:5, rarity:"common"},
    {id: 'add_herbs', label:'Add Herbs', image:'moves/herbs.webp',type:'tap', cost:1, rarity:"common"},
    {id:'stir',label:'Stir (Hold)',image:'moves/stir.gif',type: 'hold', holdTime:2.5},
    {id:'fry',label:'Fry (Hold)',image:'moves/fry.gif',type:'hold',holdTime:3.5},
    {id:'cook',label:'Cook (Hold)',image:'moves/cook.gif',type:'hold',holdTime:4.0},
    {id: 'bake',label:'Bake (Hold)',image:'moves/bake.gif',type:'hold',holdTime:5.0},
    {id:'flip',label:'Flip',image:'moves/flip.gif',type:'tap'},
    {id:'serve',label:'Serve',image:'moves/serve.gif',type:'tap'}
];
const whatToCook = [
    {
        name:'Cheesy Omelette', image:'food/chessyomlet.webp',
        baseTime:25,
        steps:[
        {action:'crack_egg', text:'Crack two eggs (tap twice)', needed:2},
        {action:'add_cheese', text:'Add cheese'},
        {action:'stir', text:'Stir until smooth (hold ~2.5s)', holdTime:2.5, tolerance:0.6},
        {action:'cook', text:'Cook until golden (hold ~4s)', holdTime:4.0, tolerance:0.8},
        {action:'flip', text:'Flip once'},
        {action:'serve', text:'Serve it'}
        ],
        reward:120
    },
    {
        name:'Tomato Toast', image:'food/tomatotoast.webp',
        baseTime:18,
        steps:[
        {action:'add_bread', text:'Toast the bread'},
        {action:'cook', text:'Lightly toast (hold ~2.5s)', holdTime:2.5, tolerance:0.6},
        {action:'add_tomato', text:'Add tomatoes'},
        {action:'serve', text:'Serve it'}
        ],
        reward:90
    },
    {
        name:'Cheesy Tomato Scramble', image:'food/cheesyscramble.webp',
        baseTime:24,
        steps:[
        {action:'crack_egg', text:'Crack two eggs (tap twice)', needed:2},
        {action:'stir', text:'Stir (hold ~2.5s)', holdTime:2.5, tolerance:0.6},
        {action:'add_tomato', text:'Add tomatoes'},
        {action:'add_cheese', text:'Add cheese'},
        {action:'cook', text:'Cook (hold ~3.5s)', holdTime:3.5, tolerance:0.7},
        {action:'serve',text:'Serve it'}
        ],
        reward:140
    },
    {
        name:'Koshary', image:'food/koshary.webp',
        baseTime: 30,
        steps:[
            {action:'add_rice', text:'Add rice'},
            {action:'add_pasta', text:'Now for pasta'},
            {action:'add_chickpeas', text:'Add Chickpeas'},
            {action:'add_onion',text:'Add onions'},
            {action:'add_sauce',text:'Pour spicy tomato sauce'},
            {action: 'stir', text:'Mix all', holdTime:3.0},
            {action:'serve', text:'Serve it'}
        ],
        reward: 200
    },
    {
        name:'Taamiya (Flafel)', image:'food/falafel.webp',
        baseTime:26,
        steps:[
            {action:'add_chickpeas',text:'Mash chickpeas twice', needed:2},
            {action:'add_garlic',text:'Add garlic'},
            {action:'add_herbs',text:'Now some additional herbs'},
            {action:'stir',text:'Stir mix (hold for 2.5s)', holdTime:2.5},
            {action:'fry',text:'Throw in the boiling oil (hold 3.5s)', holdTime:3.5},
            {action:'serve',text:'Serve it'}
        ],
        reward:180
    },
    {
        name:'Fool Medames', image:'food/fool.webp',
        baseTime:25,
        steps:[
            {action: 'add_chickpeas', text:'Add fava beans (twice)', needed: 2},
            {action: 'add_oil',text:'Pour olive oil'},
            {action:'add_garlic', text:'Add minced garlic'},
            {action:'add_tomato',text:'Add chopped tomato'},
            {action:'stir', text:'MIX (2.5s)', holdTime:2.5},
            {action:'cook',text:'Simmer (4s)', holdTime:4.0},
            {action:'serve',text:'Serve it now'}
        ],
        reward: 160
    },
    {
        name:'Mahshi (Stuffed grape leaves)', image:'food/mahshi.webp',
        baseTime:35,
        steps: [
            {action: 'add_rice', text:'Add rice'},
            {action: 'add_onion', text:'Add chopped onion'},
            {action:'add_herbs', text:'some magical herbs'},
            {action:'add_tomato', text:'add tomato'},
            {action: 'stir', text:'Mix filling 2.5s', holdTime:2.5},
            {action:'add_meat', text:'Add minced meat'},
            {action:'bake', text:'Bake grape leaves 5s', holdTime: 5.0},
            {action:'serve',text:'Serve warm'}
        ],
        reward: 250
    },
    {
        name:'Molokhia',image:'food/molokhia.webp',
        baseTime:28,
        steps: [
            {action:'add_oil', text:'Heat oil'},
            {action:'add_garlic', text:'Add garlic'},
            {action:'stir',text:'Stir quickly 2s', holdTime:2.0},
            {action:'add_herbs', text:'Add molokhia leaves (aka herbs)'},
            {action:'cook', text:'Cook for 4s', holdTime:4.0},
            {action:'serve', text:'Serve'}
        ],
        reward:220
    },
    {
        name:'Shawarma Sandwich', image:'food/shawarma.webp',
        baseTime: 26,
        steps: [
            {action: 'add_meat', text:'Add meat'},
            {action:'cook', text:'Cook meat 4s', holdTime: 4.0},
            {action:'add_onion', text:'Add onions'},
            {action:'add_tomato',text:'Add tomato'},
            {action:'add_herbs', text:'Mix it with herbs'},
            {action:'add_bread', text:'Wrap in bread'},
            {action:'serve', text:'Shawarma ready! serve it'}
        ],
        reward:190
    },
    {
        name:'Roz Bel Laban (rice pudding)', image:'food/rice_pudding.webp',
        baseTime: 24,
        steps: [
            {action: 'add_rice', text:'Add rice'},
            {action: 'add_milk', text:'Add two cups of milk', needed: 2},
            {action:'stir',text:'Stir constantly 3s', holdTime:3.0},
            {action: 'cook', text:'Simmer gently 3.5s', holdTime: 3.5},
            {action:'add_herbs', text:'Sprinkle cinnamon'},
            {action: 'serve', text:'SERVE IT'}
        ],
        reward:170
    }
];
const customers = [
    {
        name: 'Omar the Hungry',
        personality: "Very Patient",
        emoji: '😋',
        patience: 1.3,
        tipMultiplier: 1.1,
        hates: [],
        loves: ["meat", "rice"]
    },
    {
        name: "Nadia the Fit",
        personality: "Healthy Eater",
        emoji: '🥗',
        patience: 1.0,
        tipMultiplier: 1.2,
        hates: ["add_cheese", "add_oil"],
        loves: ["add_tomato", "add_onion"]
    },
    {
        name: "Mahmoud the Angry",
        personality: "Short Temper",
        emoji: '😠',
        patience: 0.8,
        tipMultiplier: 1.4,
        hates: ["add_milk"],
        loves: ["fry", "add_meat"]
    },
    {
        name: "Sara the Rich",
        personality: "Bougie",
        emoji: '👑',
        patience: 1.1,
        tipMultiplier: 1.8,
        hates:[],
        loves: ["add_herbs", "bake"]
    },
    {
        name: "Youssef the Chaos Lover",
        personality: "Unpredictable",
        emoji: '🤪',
        patience: 1.0,
        tipMultiplier: 1.0,
        hates: [],
        loves: []
    }
];let mode = "recipe";
let freeCookActions = [];
let points = 0;
let streak = 1;
let high = Number(localStorage.getItem('chef-high')||0);
let currentList = null;
let stepIndex = 0;
let timerId = null;
let leftTime = 0;
let baseTime = 0;
let multiTapCounter = 0;
let active=false;
let money=100;
let orderQueue = [];
let maxOrders = 3;
let currentCustomer = null;
const elpoints = document.getElementById('points');
const elHigh = document.getElementById('high');
elHigh.textContent = high;
const elstreak = document.getElementById('streak');
const elStart = document.getElementById('startBtn');
const elSteps = document.getElementById('steps');
const elmoves = document.getElementById('moves');
const elTime = document.getElementById('leftTime');
const elBar = document.getElementById('timeBar');
const elPan = document.getElementById('pan');
const elBubbles = document.getElementById('bubbles');
const elRecipeName = document.getElementById('recipeName');
const elRecipeEmoji = document.getElementById('recipeEmoji');
const elMute = document.getElementById('mute');
const elMoney = document.getElementById('money');
function updateMoney() {
    elMoney.textContent = money;
}
updateMoney();
function informer(msg) {
    const t = document.createElement('div');
    t.className = 'toast';
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(function() {
        t.remove()
    }, 1600);
}
function bubbles() {
    for(let i=0; i<5;i++) {
        const b = document.createElement('div');
        b.className = 'bubble';
        b.style.left = (10 + Math.random() * 80 + '%');
        b.style.bottom = '10px';
        elBubbles.appendChild(b);
        setTimeout(() => b.remove(), 1200);
    }
}

function renderWhatToDo() {
    elmoves.innerHTML = '';
    moves.forEach(a => {
        const btn = document.createElement('button');
        btn.className = 'action';
        btn.dataset.id=a.id;
        btn.dataset.type=a.type;
        btn.innerHTML = `<div>${a.label}</div>`;
        btn.style.backgroundImage = `url(${a.image})`;
        btn.style.backgroundSize = 'cover';
        btn.style.backgroundPosition = 'center';
        btn.style.backgroundRepeat = 'no-repeat';

        if (a.type==='tap') {
            btn.addEventListener('click', function(){
                if (!active) return;
                soundEffects.click();
                doAction(a.id);
            });
        } else {
            let holdStart =0;
            let raf=null;
            let bar=null;
            const startHold = () => {
                if (!active) return;
                soundEffects.click();
                btn.classList.add('holding');
                holdStart=performance.now();
                bar=document.createElement('div');
                bar.style.cssText = `
                width: 100%;
                background: #ffe;
                border-radius: 10px;
                margin-top: 8px;
                height: 8px;
                overflow:hidden;`;
                const fill = document.createElement('div');
                fill.style.cssText="height: 100%; width: 0%; background:linear-gradient(90deg,#6ecbff,#57d657)";
                bar.appendChild(fill);
                btn.appendChild(bar);
                const tick = () => {
                    const t = (performance.now() - holdStart) / 1000;
                    const target = (findCurrentHoldTimeFor(a.id)||a.holdTime||2.5);
                    fill.style.width = Math.min(100, (t/target)*100) + '%';
                    raf=requestAnimationFrame(tick);
                };
                raf=requestAnimationFrame(tick);
            };
            const endHold = (e) => {
                if (!holdStart) return;
                cancelAnimationFrame(raf);
                raf=null;
                const seconds=(performance.now()-holdStart)/1000;
                holdStart=0;
                setTimeout(()=> {
                    btn.classList.remove('holding');
                    bar && bar.remove();
                }, 50);
                doAction(a.id, seconds);
            };
            btn.addEventListener('mousedown', startHold);
            btn.addEventListener('touchstart', startHold, {passive:true});
            window.addEventListener('mouseup', endHold);
            window.addEventListener('touchend', endHold);
        }
        elmoves.appendChild(btn);
    });
}
function findCurrentHoldTimeFor(actionId) {
    if (!currentList) return null;
    const step=currentList.steps[stepIndex];
    if(step){
        if (step.action===actionId) {
            if (step.holdTime) {
                return step.holdTime;
            }
        }
    } 
    return null;
}
function generateOrder() {
    if(orderQueue.length >= maxOrders) return;
    const recipe = structuredClone(whatToCook[Math.floor(Math.random()*whatToCook.length)]);
    const customer=customers[Math.floor(Math.random()*customers.length)];
    orderQueue.push({
        recipe,
        customer,
        patience: recipe.baseTime * customer.patience,
        startedAt: performance.now()
    });
    renderOrders();
}function renderOrders(){
    const panel = document.getElementById("ordersPanel");
    panel.innerHTML='';
    for (let index = orderQueue.length - 1; index >= 0; index--) {
        const order = orderQueue[index];
        let card = document.createElement('div');
        card.className = "order-card";
        card.innerHTML = `
            <div>${order.customer.emoji} ${order.customer.name}</div>
            <strong>${order.recipe.name}</strong>
            <div class="order-timer">
                <div class="order-timer-fill" id="orderTimer${index}"></div>
            </div>
        `;
        panel.appendChild(card);
    }
}function updateOrderTimers() {
    const now = performance.now();
    orderQueue.forEach((order, index)=>{
        let elapsed= (now-order.startedAt)/1000;
        let left = Math.max(0, order.patience - elapsed);
        let bar = document.getElementById(`orderTimer${index}`);
        if(bar){
            bar.style.width = ((left / order.patience)*100)+"%";
        }
        if(left<=0){
            informer(`${order.customer.emoji} ${order.customer.name} LEFT angrily!`);
            orderQueue.splice(index, 1);
            renderOrders();
        }
    });

    requestAnimationFrame(updateOrderTimers);
}
requestAnimationFrame(updateOrderTimers);
function renderSteps() {
    elSteps.innerHTML = '';
    currentList.steps.forEach((s, i) => {
        const d=document.createElement('div');
        d.className = 'step';
        d.dataset.i = i;
        const tag = document.createElement('div');
        tag.className = 'tag';
        tag.textContent = (s.action || '').replace('_', ' ');
        const txt=document.createElement('div');
        txt.textContent = s.text || s.action;
        d.appendChild(tag);
        d.appendChild(txt);
        if(i<stepIndex) d.classList.add('ok');
        if(i===stepIndex) d.style.outline = '3px solid #6ecbff66';
        elSteps.appendChild(d);
    });
}
function markFail() {
    const node=elSteps.querySelector(`[data-i="${stepIndex}"]`);
    node && node.classList.add('fail');
}
function startGame() {
    hideFinishButton();
    if (active) return;
    if (orderQueue.length === 0) {
        generateOrder();
        generateOrder();
    }
    const order = orderQueue.shift();
    currentList = order.recipe;
    currentCustomer = order.customer;
    points=0;
    streak=1;
    updateHud();
    startCookingOrder(order);
    active=true;
    soundEffects.ok();
}
function startCookingOrder(order){
    currentList = order.recipe;
    currentCustomer = order.customer;
    stepIndex = 0;
    multiTapCounter = 0;
    baseTime = Math.floor(
        Math.max(10, currentList.baseTime * currentCustomer.patience)
    );
    leftTime = baseTime;
    elRecipeName.textContent = currentList.name;
    elRecipeEmoji.textContent = currentCustomer.emoji;
    elPan.style.backgroundImage = `url(${currentList.image})`;
    renderSteps();
    startTimer();
}
function endRecipe(success) {
    stopTimer();
    if (success) {
        const timeBonus = Math.floor(leftTime * 3);
        let gainedRaw = currentList.reward + timeBonus;
        let gained = Math.floor(gainedRaw * streak * (currentCustomer.tipMultiplier || 1));
        points += gained;
        money += Math.floor(gained*0.6);
        updateMoney();
        streak = Math.min(10, streak+1);
        soundEffects.bonus();
        bubbles();
        informer(`Perfect! +${gained} (time bonus ${timeBonus}, streak x${streak-1})`);
        updateHud();
        setTimeout(startNextOrder, 1200);
    } else {
        soundEffects.fail();
        markFail();
        informer('Recipe failed! New order coming in...');
        streak = 1;
        updateHud();
        setTimeout(startNextOrder, 1200);
    }
}
function startNextOrder() {
    if (orderQueue.length < maxOrders) {
        generateOrder();
    }
    renderOrders();
    if (orderQueue.length === 0) {
        return; 
    }
    const next = orderQueue.shift();
    currentList = next.recipe;
    currentCustomer = next.customer;
    startCookingOrder(next);
}
function updateHud(){
    elpoints.textContent = points;
    elstreak.textContent = 'x'+streak;
    if (points>high) {
        high = points;
        localStorage.setItem('chef-high', String(high));
        elHigh.textContent = high;
    }
}
function startTimer() {
    stopTimer();
    const startedAt = performance.now();
    const tick= () => {
        const elapsed = (performance.now()-startedAt) / 1000;
        const left = Math.max(0, leftTime - elapsed);
        elTime.textContent = left.toFixed(1);
        elBar.style.width = (left/baseTime)*100 + '%';
        if (!active) return;
        if(left <= 0) {
            leftTime = 0;
            elTime.textContent = '0.0';
            elBar.style.width= '0%';
            endRecipe(false);
            return;
        }
        timerId = requestAnimationFrame(tick);
    };
    timerId = requestAnimationFrame(tick);
}

function stopTimer() {
    if (timerId) {
        cancelAnimationFrame(timerId);
        timerId = null;
    }
}

function showFinishButton() {
    document.getElementById('finishFreeCook').style.display = 'block';
}
function hideFinishButton() {
    document.getElementById("finishFreeCook").style.display = "none";
}
function doAction(actionId, holdSeconds=null) {
    if (!active) {
        informer("Select a mode");
        return;
    }
    else if (!currentList && mode !== "free") return;
    let cost = (moves.find(money => money.id === actionId)?.cost) || 0;
    money -= cost;
    if(money <0) {
        money = 0;
        informer("You're broke bro.");
        return;
    }
    updateMoney()
    if (mode === 'free') {
        freeCookActions.push({
            id: actionId,
            held: holdSeconds
        });
        soundEffects.ok();
        informer("Added: " + actionId.replace('_', ' '));
        return;
    }

    if (stepIndex >= currentList.steps.length) return;

    if (Math.random() < 0.06) {
        informer('A rat stole some time!');
        leftTime = Math.max(0, leftTime - 2);
    }

    const step = currentList.steps[stepIndex];
    if (!step) return;

    if (step.action !== actionId) {
        soundEffects.fail();
        markFail();
        informer(`Wrong step! Needed "${step.action.replace('_',' ')}"`);
        endRecipe(false);
        return;
    }

    if (step.needed) {
        multiTapCounter++;
        if (multiTapCounter < step.needed) {
            soundEffects.tick();
            updateStepProgressHint(step, `(${multiTapCounter}/${step.needed})`);
            return;
        }
        multiTapCounter = 0;
    }

    if (step.holdTime) {
        if (holdSeconds == null) {
            endRecipe(false);
            return;
        }
        const tol = step.tolerance ?? 0.6;
        const diff = Math.abs(holdSeconds - step.holdTime);
        if (diff > tol) {
            soundEffects.fail();
            markFail();
            informer("You over/undercooked it!");
            endRecipe(false);
            return;
        }
    }

    soundEffects.ok();
    stepIndex++;
    renderSteps();

    points += 5 * streak;
    updateHud();

    if (Math.random() < 0.08) {
        informer("Lucky Boost! +2s");
        leftTime = Math.min(baseTime, leftTime + 2);
    }if (stepIndex >= currentList.steps.length) {
        informer(`${currentList.name} is completed!`);
        endRecipe(true);
    }
}
function analyzeFreeCook(actions) {
    let a = actions.map(x => x.id);
    const has = x => a.includes(x);
    const count = x => a.filter(v => v === x).length;
    if(has("add_onion")) {
        if(has("add_tomato")) {
            if(has("cook")) {
                if (has("add_herbs")){
                    return "Shorbet Ads, warm on cold nights...";
                }
            }
        }
    }
    if(has("add_meat")) {
        if(has("add_onion")) {
            if(has("add_bread")){
                if (has("fry")) {
                    return "Alexandrian KEBDA!";
                }
            }
        }
    }
    if(has("add_meat")){
        if(has("add_bread")){
            if(has("cook")){
                return "Hot hawawshi, crunchy!";
            }
        }
    }
    if(has("add_rice")) {
        if(has("add_bread")){
            if(has("add_meat")) {
                return "Fatta, rich and filling!";
            }
        }
    }
    if(has("add_rice")){
        if(has("add_onion")){
            if(has("add_oil")){
                return "Sayadeya Rice, I love it!";
            }
        }
    }
    if(has("add_bread")){
        if(has("add_sauce")){
            if(has("add_cheese")){
                return "YOU MADE A PIZZA!!! MAMA MIA MA BOI";
            }
        }
    }
    if(has("add_pasta")){
        if(has("add_sauce")){
            if(has("cook")){
                return "Italian Spaghetti! Approved🤌👌";
            }
        }
    }
    if(has("add_meat")) {
        if(has("cook")) {
            if(!has("add_tomato")) {
                return "Steak, Gordon Ramsay is proud of you!";
            }
        }
    }
    if (actions.length >= 12) {
        return "This isn't a dish anymore... this is a CRIME";
    }
    if(has("add_bread")) {
        if (actions.length == 1) {
            return "Bread? just bread? bro is going through it. RIP";
        }
    }
    if(has("add_milk")) {
        if (has("add_meat")) {
            return "Meat with milk? bro who raised you?? EWW";
        }
    }
    if(has("add_oil")) {
        if(has("add_milk")) {
            return "Oil + Milk, perfect duo for a potion for instant diarrhea.";
        }
    }
    if(has("cook")) {
        if(has("fry")) {
            if(has("bake")) {
                return "You just destroyed all nutrients in the food, congrats!";
            }
        }
    }
    if (has("add_tomato")){
        if(has("add_onion")){
            if(has("add_herbs")){
                if(has("add_meat")){
                    return "Healthy vegetarian mix!";
                }
            }
        }
    }
    if(has("add_rice")) {
        if(has("add_pasta")) {
            if(has("add_bread")){
                return "CARB OVERLOAD! Your pancreas quit its job.";
            }
        }
    }
    if(has("crack_egg")) {
        if(has("add_sauce")) {
            return "Cursed Omelette. Why tho?";
        }
    }
    if(has("add_bread")) {
        if(actions.length === 2) {
            return "This is the saddest sandwich known to mankind.";
        }
    }
    if (has("add_milk")) {
        if(has("add_tomato")){
            if(has("add_garlic")){
                return "This soup looks confused.... like your life.";
            }
        }
    }
    if (has("add_rice")) {
        if (has("add_pasta")) {
            if (has("add_sauce")) {
                return "Delicious Koshary!";
            }
        }
    }
    if (count("add_chickpeas") >= 2) {
        if(has("fry")){
            return "Tasty Falafel!";
        }
    }
    if (has("add_oil")) {
        if (has("add_garlic")) {
            if (has("add_herbs")) {
                return "Yummy Molokhia!";
            }
        }
    }
    if (has("crack_egg")) {
        if (has("add_cheese")) {
            if(has("cook")) {
                return "Scrumptious Omelette!";
            }
        }
    }
    if(has("add_bread")) {
        if(has("add_tomato")) {
            return "Simple Tomato Toast!";
        }
    }
    if(count("cook") >= 3) {
        return "you've burned the whole kitchen, call the firefighters!";
    }
    if (count("crack_egg") >= 3) {
        return "That's too many eggs... are you a body builder?";
    }
    if (count("add_meat") >= 2) {
        return "bro, your budget isn't that high to put so much meat...";
    }
    if(count("stir")>= 2) {
        return "Bro, just use a blender... bruh";
    }
    if(count("add_cheese") >= 3) {
        return "Nice cheese... now where is the food?";
    }
    if(count("add_tomato") >= 4) {
        return "Okay okay, in that case, I think it's better to stop cooking at all";
    }
    if(actions.length <= 1) {
        return "Nothing? You didn't cook anything dummy!";
    }
    return "Idk what is that, perhaps new invention?"
}

function updateStepProgressHint(step, text) {
    const node=elSteps.querySelector(`[data-i="${stepIndex}"]`);
    if (node){
        node.querySelector('.tag').textContent = `${(step.action||'').replace('_',' ')} ${text}`;
    }         
}
elStart.addEventListener('click', () => {
    ensureCtx();
    startGame();
    active = true;
});
const elFree = document.getElementById('freeCookBtn');
elFree.addEventListener('click', () => {
    if (active) return;
    ensureCtx();
    mode = 'free';
    freeCookActions = [];
    active = true;
    currentCustomer = null;
    elRecipeName.textContent = 'Free Cook Mode'
    elSteps.innerHTML = "<div style='opacity:0.7'>Add any ingredients you want.<br>When you're done, press FINISH.</div>";
    elTime.textContent = 'infinte';
    elBar.style.width = '100%';
    elPan.style.backgroundImage = "";
    informer("Free Cook Mode! Go crazy chef");
    showFinishButton();
});
elMute.addEventListener('click', () => {
    muted = !muted; elMute.textContent = muted ? 'Muted' : 'Mute';
    elMute.classList.toggle('muted', muted);
});

renderWhatToDo();
elTime.textContent = '-';
elBar.style.width = '100%';
elRecipeName.textContent = 'Press start to receive your first order!';

const keyMap = {
    KeyQ: 'crack_egg',
    KeyW: 'add_cheese',
    KeyE: 'add_tomato',
    KeyR: 'add_bread',
    KeyA: 'stir',
    KeyS: 'cook',
    KeyD: 'flip'
};
let holdStartAt = null;
let holdAction = null;
document.addEventListener('keydown', (e) => {
    const id = keyMap[e.code];
    if (!id) return;
    const def=moves.find(a=> a.id===id);
    if (def?.type === 'tap') {
        doAction(id);
        return;
    }
    if (def?.type === 'hold' && !holdStartAt) {
        holdStartAt = performance.now();
        holdAction = id;
    }
});
document.getElementById('finishFreeCook').addEventListener('click', function() {
    if (mode !== 'free') return;
    const name = analyzeFreeCook(freeCookActions);
    const rating = evaluateDish(freeCookActions);
    showDishReview(name, rating);
    money += Math.floor(rating.rating*10);
    updateMoney();
    active = false;
    soundEffects.bonus();
    points += freeCookActions.length * 5;
    updateHud();
    mode="recipe";
    hideFinishButton();
    elRecipeName.textContent = 'Press start to receive your first order!';
    elSteps.innerHTML = '';
    elPan.style.backgroundImage = '';
});
document.addEventListener('keyup', (e) => {
    const id = keyMap[e.code];
    if (!id) return;
    const def=moves.find(a=> a.id===id);
    if (def?.type === 'hold' && holdStartAt && holdAction === id) {
        const heldFor = (performance.now() - holdStartAt) / 1000;
        holdStartAt = null;
        holdAction = null;
        doAction(id, heldFor);
    }
});
function evaluateDish(actions) {
    let a = actions.map(x=>x.id);
    const has = x => a.includes(x);
    const count = x => a.filter(v => v ===x).length;

    let synergy = 0;
    let flavors = [];
    let cuisine = 'Unknown';
    let cursedName=null;

    if (has('add_sauce') || has("add_tomato")) flavors.push("Savory");
    if (has("add_cheese")|| has("add_milk")) flavors.push('Creamy');
    if(has("add_garlic")||has("add_onion")) flavors.push("Sharp");
    if(has("add_meat")||has("fry")) flavors.push('Smoky');
    if(has("add_herbs")) flavors.push('Herbal');
    if( has("add_oil")) flavors.push("Rich");
    if(has("add_rice")&&has("add_pasta")) synergy -= 1;
    if(has("add_meat")&&has("cook")) synergy +=2;
    if(has("add_tomato")&&has("add_onion")) synergy += 2;
    if(has("add_oil")&&has("fry")) synergy += 1;
    if(has("add_milk")&&has("add_meat")) synergy -= 3;
    if (has("add_milk")&&has("add_tomato")) synergy -=2;
    if(count("cook")>=3) synergy -=4;
    if(count("add_cheese") >= 3) synergy -=1;
    if(actions.length >= 10) synergy -=5;
    if(currentCustomer) {
        currentCustomer.loves.forEach(x => {
            if (a.includes(x)) synergy += 1;
        });
        currentCustomer.hates.forEach(x => {
            if (a.includes(x)) synergy -= 2;
        });
    }
    if(has("add_rice")&&has("add_pasta")&&has("add_chickpeas")) cuisine = "Egyptian";
    if(has("add_oil")&&has("add_garlic")&&has("add_herbs")) cuisine = "Egyptian";
    if(has("add_bread")&&has("add_cheese")&&has("add_sauce")) cuisine = "Italian";
    if(has("add_pasta")&&has("add_sauce")) cuisine = "Italian";
    if(has("add_meat")&&has("add_herbs")) cuisine = "Middle Eastern";
    if (synergy <= -5) {
        cursedName = cursedDishName();
    }
    let rating = Math.max(1, Math.min(5, Math.floor((synergy + 5)/2)));

    return {
        synergy,
        flavors: flavors.join(", "),
        cuisine,
        rating,
        cursedName
    };
}function cursedDishName(){
    const names = [
        "The Forbidden Stew",
        "Diarrhea Destroyer",
        "Nightmare Omelette",
        "Toxic Mahshi",
        "Radioactive Pasta",
        "The Unholy Mix",
        "Chef's Regret",
        "Hospital Visit Special",
        "Stomach Exploder 3000"
    ];
    return names[Math.floor(Math.random()*names.length)];
}function showDishReview(name, rating){
    const box = document.getElementById("dishReview");
    document.getElementById("reviewTitle").textContent = name;
    document.getElementById("reviewStars").textContent = "⭐".repeat(rating.rating);
    document.getElementById("reviewFlavor").textContent = "Flavors: " + rating.flavors;
    document.getElementById("reviewCuisine").textContent = 'Cuisine: ' + rating.cuisine;
    document.getElementById("reviewSynergy").textContent = 'Synergy Score: ' + rating.synergy;
    if(rating.cursedName) {
        document.getElementById("reviewName").textContent = "Cursed Name: " + rating.cursedName;
    } else {
        document.getElementById("reviewName").textContent = "";
    }
    box.classList.remove("hidden");
}
document.getElementById("closeReview").addEventListener('click', () => {
    document.getElementById("dishReview").classList.add("hidden");
});