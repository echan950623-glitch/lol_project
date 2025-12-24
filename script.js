const bgVideo = document.getElementById('bg-video');
const trophyBox = document.getElementById('trophy-box');
const trophyText = document.getElementById('trophy-text');
const navBar = document.querySelector('nav');   
const bgm = document.getElementById("bgm");
const speakerIcon = document.getElementById("speaker-icon");
const hintText = document.querySelector('.hint');

// 取得四段電影字幕元素
const cineTexts = [
    document.getElementById('cine-text-1'),
    document.getElementById('cine-text-2'),
    document.getElementById('cine-text-3'),
    document.getElementById('cine-text-4')
];

/* BGM 音樂控制 */
bgm.volume = 0.3;
let isPlaying = false;

speakerIcon.addEventListener("click", function () {
    if (isPlaying) {
        bgm.pause();
        speakerIcon.src = "./main_images/audio-off.png";
        isPlaying = false;
    } else {
        bgm.play();
        speakerIcon.src = "./main_images/audio-on.png";
        isPlaying = true;
    }
});

/* 滾動動畫邏輯 (嚴格序列化：影片->文字依序->獎盃) */
window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    const spacer = document.querySelector('.scroll-spacer');
    const spacerHeight = spacer ? spacer.offsetHeight : document.body.scrollHeight;
    const windowHeight = window.innerHeight;

    let totalProgress = scrollY / (spacerHeight - windowHeight);
    totalProgress = Math.min(Math.max(totalProgress, 0), 1);

    //提示字隱藏
    if (scrollY > 10) {
        hintText.classList.add('hide');
    }else {
        hintText.classList.remove('hide');
    }
    
    // 影片背景動畫
    let videoOpacity = 1;
   
    if (totalProgress < 0.70) {
        videoOpacity = 1 - (totalProgress * 0.5);
    } else {
        videoOpacity = 0.5 - ((totalProgress - 0.70) * 5); 
    }
    videoOpacity = Math.min(Math.max(videoOpacity, 0), 1);
    
    bgVideo.style.opacity = videoOpacity;
    bgVideo.style.transform = `scale(${1 - totalProgress * 0.1})`;


    // 字幕動畫

    const peaks = [0.15, 0.30, 0.45, 0.60]; 
    const range = 0.05;

    cineTexts.forEach((text, index) => {
        if (!text) return;

        const peak = peaks[index];
        const dist = Math.abs(totalProgress - peak);
        
        let opacity = 0;
        if (dist < range) {
            opacity = 1 - (dist / range);
        } else {
            opacity = 0;
        }
        
        const moveY = (totalProgress - peak) * 50;

        text.style.opacity = opacity;
        text.style.transform = `translate(-50%, calc(-50% - ${moveY}px))`;
    });


    // C. 獎盃動畫
    
    let currentOpacity = 0;
    let currentScale = 0.8;
    let currentY = 300;

    // 定義時間軸
    const trophyStart = 0.70;
    const trophyEnd = 0.90;

    if (totalProgress < trophyStart) {
        currentOpacity = 0;
    } else if (totalProgress >= trophyStart && totalProgress <= trophyEnd) {
        let tProgress = (totalProgress - trophyStart) / (trophyEnd - trophyStart);

        if (tProgress < 0.3) {
            currentOpacity = tProgress / 0.3;
            currentY = 300 - (currentOpacity * 300);
        } else {
            currentOpacity = 1;
            currentY = 0;
        }
        currentScale = 0.8 + (tProgress * 0.2); 

    } else {
        let exitProgress = (totalProgress - trophyEnd) / 0.1;
        
        currentOpacity = 1 - exitProgress;
        currentScale = 1.0 + (exitProgress * 0.1); 
        currentY = 0 - (exitProgress * 150);
    }

    trophyBox.style.opacity = currentOpacity;
    trophyBox.style.transform = `translate(-50%, -50%) scale(${currentScale}) translateY(${currentY}px)`;
    
    // 導覽列
    if (totalProgress > 0.75) {
        navBar.classList.add('show');
    } else {
        navBar.classList.remove('show');
    }

    // 獎盃標題
    if (totalProgress > 0.80 && totalProgress < 0.95) {
        trophyText.style.opacity = 1;
    } else {
        trophyText.style.opacity = 0;
    }
});

// 初始化
window.dispatchEvent(new Event('scroll'));