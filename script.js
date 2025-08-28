/*
  📂 Setup
  Put your fruit images inside an `images/` folder next to this HTML file.
  Put your sounds inside a `sounds/` folder next to this HTML file.
  Sounds needed: right.mp3, wrong.mp3, win.mp3
*/

const IMAGE_PATH = 'images/';
const SOUND_PATH = 'sounds/';

const FILES = [
  'avocado.png','bell-pepper.png','blueberries.png','cherries.png','coconut.png',
  'ear-of-corn.png','grapes.png','hot-pepper.png','kiwi-fruit.png','lemon.png',
  'mango.png','melon.png','olive.png','onion.png','peach.png','pear.png',
  'pineapple.png','potato.png','red-apple.png','strawberry.png','tangerine.png',
  'tomato.png','watermelon.png'
];

const TARGET = 'red-apple';
const WIN_SCORE = 100;

const img = document.getElementById('fruitImg');
const coinsEl = document.getElementById('coins');
const msgEl = document.getElementById('message');
const toggleBtn = document.getElementById('toggleBtn');
const resetBtn = document.getElementById('resetBtn');
const reelWrap = document.getElementById('reelWrap');
const overlay = document.getElementById('overlay');
const playAgain = document.getElementById('playAgain');
const closeModal = document.getElementById('closeModal');

let coins = 0;
let spinning = true;
let spinTimer = null;
let currentIndex = 0;

// 🎵 Load sounds
const sounds = {
  right: new Audio(SOUND_PATH + 'coin.wav'),
  wrong: new Audio(SOUND_PATH + 'error.wav'),
  win: new Audio(SOUND_PATH + 'win.wav')
};

// Preload images
const preloadImages = (files) => files.map(f => { const i = new Image(); i.src = IMAGE_PATH + f; return i; });
preloadImages(FILES);

function filenameWithoutExt(name){
  const n = name.toLowerCase();
  const dot = n.lastIndexOf('.');
  return dot > -1 ? n.slice(0, dot) : n;
}

function setFruitByIndex(i){
  currentIndex = (i + FILES.length) % FILES.length;
  const file = FILES[currentIndex];
  img.src = IMAGE_PATH + file;
  const altLabel = filenameWithoutExt(file).replaceAll('-', ' ');
  img.alt = altLabel;
}

function randomIndex(){
  return Math.floor(Math.random() * FILES.length);
}

function startSpin(){
  if (spinning) return;
  spinning = true;
  reelWrap.classList.add('spinning');
  msgEl.textContent = 'Spinning… try to stop on red-apple!';
  msgEl.className = 'msg';
  toggleBtn.textContent = 'STOP';
  scheduleSpin();
}

function scheduleSpin(){
  clearInterval(spinTimer);
  spinTimer = setInterval(() => {
    setFruitByIndex(randomIndex());
    img.style.transform = 'scale(1.02)';
    setTimeout(()=>{ img.style.transform = 'scale(1)'; }, 80);
  }, 600);
}

function stopSpin(){
  if (!spinning) return;
  spinning = false;
  clearInterval(spinTimer);
  reelWrap.classList.remove('spinning');
  toggleBtn.textContent = 'START';

  const file = FILES[currentIndex];
  const name = filenameWithoutExt(file);

  if (name === TARGET){
    coins += 10;
    msgEl.textContent = '🎯 Perfect! red-apple — +10 coins';
    msgEl.className = 'msg win';
    pulse(reelWrap, '#00d664');

    // 🔊 Play right sound
    sounds.right.currentTime = 0;
    sounds.right.play();
  } else {
    coins -= 10;
    msgEl.textContent = `❌ Missed (${name}). −10 coins`;
    msgEl.className = 'msg lose';
    pulse(reelWrap, '#ff5c7c');

    // 🔊 Play wrong sound
    sounds.wrong.currentTime = 0;
    sounds.wrong.play();
  }

  coinsEl.textContent = coins;

  if (coins >= WIN_SCORE){
    setTimeout(()=>{ 
      showWin(); 
      // 🔊 Play win sound
      sounds.win.currentTime = 0;
      sounds.win.play();
    }, 250);
  }
}

function pulse(el, color){
  el.animate([
    { boxShadow: '0 0 0 0px ' + color },
    { boxShadow: '0 0 0 18px ' + color + '00' }
  ], { duration: 380, easing: 'ease-out' });
}

function showWin(){ overlay.classList.add('show'); }
function hideWin(){ overlay.classList.remove('show'); }

function resetScore(){
  coins = 0; coinsEl.textContent = coins;
  msgEl.textContent = 'Score reset. Target red-apple to earn +10!';
  msgEl.className = 'msg';
}

// Accessibility
document.addEventListener('keydown', (e)=>{
  if (e.code === 'Space' || e.code === 'Enter'){
    e.preventDefault();
    spinning ? stopSpin() : startSpin();
  }
});

toggleBtn.addEventListener('click', ()=>{ spinning ? stopSpin() : startSpin(); });
resetBtn.addEventListener('click', resetScore);
playAgain.addEventListener('click', ()=>{ hideWin(); resetScore(); startSpin(); });
closeModal.addEventListener('click', hideWin);
overlay.addEventListener('click', (e)=>{ if(e.target === overlay) hideWin(); });

// Init
setFruitByIndex(randomIndex());
scheduleSpin();
