const playSection = document.querySelector(".play-section");
const playBtn = document.querySelector(".play-btn");

playBtn.onclick = () => {
    playSection.classList.add("fadeOut");
}