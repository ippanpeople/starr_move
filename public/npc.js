const npcBox = document.getElementById('npc');
const npcImg = document.getElementById('npcimg');
const npcimages = ['/public/img/shin2.png', '/public/img/shin3.png', '/public/img/shin2.png', '/public/img/shin3.png', '/public/img/shin2.png', '/public/img/shin5.png', '/public/img/shin6.png', '/public/img/shin5.png', '/public/img/shin6.png', '/public/img/shin5.png'];
const npcx = [15, 14, 13, 12, 11, 11, 12, 13, 14, 15];
let currentImageIndex = 0;
let isMovingLeft = true;
let intervalId;

const stopInterval = () => {
    clearInterval(intervalId);
    console.log(intervalId);
    npcImg.src = '/public/img/shin.png';
};

const resumeInterval = () => {
    intervalId = setInterval(() => {
        const boxRect = npcBox.getBoundingClientRect();
        const boxLeft = boxRect.left / 24;
        npcImg.src = npcimages[currentImageIndex % npcimages.length];
        npcBox.style.left = npcx[currentImageIndex % npcimages.length] * 24 + 'px';
        console.log(currentImageIndex % npcimages.length);
        currentImageIndex++;
    }, 500);
};

npcBox.addEventListener('mouseover', stopInterval);
npcBox.addEventListener('mouseout', resumeInterval);
resumeInterval();