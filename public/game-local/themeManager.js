const btnManager = document.getElementById("theme-selector");
const bodyEl = document.querySelector("body");

let mathchingEmoji = ["🌚", "🌞",]
let index = 0;
btnManager.onclick = () => {
    bodyEl.classList.toggle("light");
    btnManager.textContent = mathchingEmoji[index];
    index++;
    index %= 2;
}