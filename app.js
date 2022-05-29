const playSection = document.querySelector(".play-section");
const playBtn = document.querySelector(".play-btn");
const levelDisplay = document.querySelector(".level-display");
const gameArea = document.querySelector(".game-area");

playBtn.onclick = () => {
    playSection.classList.add("fadeOut");
    levelDisplay.classList.replace("fadeOut", "fadeIn");
    setTimeout(() => {
        levelDisplay.classList.replace("top-50", "top-0");
        levelDisplay.classList.replace("translate-middle", "translate-middle-x");
    }, 800);
    gameArea.classList.replace("fadeOut", "fadeIn");
}