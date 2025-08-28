function stopSpin(){
  if (!spinning) return;
  spinning = false;
  clearInterval(spinTimer);
  reelWrap.classList.remove('spinning');
  toggleBtn.textContent = 'START';

  const file = FILES[currentIndex];
  const name = filenameWithoutExt(file);

  if(name === TARGET){
    coins += 10;
    msgEl.textContent = `🎯 Perfect! red-apple — +10 coins`;
    msgEl.className = 'msg win';
    pulse(reelWrap, '#00d664');
    playSound(coinSound); // ✅ success sound
  } else {
    coins -= 10;
    msgEl.textContent = `❌ Missed (${name}). −10 coins`;
    msgEl.className = 'msg lose';
    pulse(reelWrap, '#ff5c7c');
    playSound(errorSound); // ❌ error sound
  }

  coinsEl.textContent = coins;

  if(coins >= WIN_SCORE){
    setTimeout(() => {
      showWin();
      playSound(winSound); // 🏆 win sound
    }, 250);
  }
}
