const typewriterElement = document.querySelector(".intro-text");
const button = document.getElementById("start-quiz");
const music = new Audio("assets/audio/intro.mp3");
music.loop = false;
music.volume = 0.6;

let fadeInterval;
let chaosTimeout;
let glitchSound; // Declare glitch sound globally

function isMobileDevice() {
    return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
}

if (!isMobileDevice()) {
    // ✅ Play music ONLY on desktop/laptop
    music.play().catch(error => console.warn("🔇 Music blocked:", error));
} else {
    console.log("📵 Music disabled on mobile.");
}

// Function: Typewriter Effect
function typeWriter(textArray, index = 0, letterIndex = 0, currentText = "") {
    if (index < textArray.length) {
        if (textArray[index] === "") {
            currentText += "<br><br>";
            setTimeout(() => typeWriter(textArray, index + 1, 0, currentText), 1200);
        } else {
            if (letterIndex < textArray[index].length) {
                currentText += textArray[index].charAt(letterIndex);
                typewriterElement.innerHTML = currentText;
                setTimeout(() => typeWriter(textArray, index, letterIndex + 1, currentText), 100);
            } else {
                currentText += "<br><br>";
                setTimeout(() => typeWriter(textArray, index + 1, 0, currentText), 1200);
            }
        }
    } else {
        setTimeout(() => {
            button.classList.add("show");
        }, 1000);
    }
}

// Function: Start Music & Fade Out After 60 Seconds
function startMusic() {
    music.play().catch(error => console.log("Autoplay blocked:", error));

    setTimeout(() => {
        fadeInterval = setInterval(() => {
            if (music.volume > 0.05) {
                music.volume -= 0.05;
            } else {
                music.pause();
                music.currentTime = 0;
                clearInterval(fadeInterval);
            }
        }, 250);
    }, 55000);
}

// 🎵 Function: **Smooth Fade-Out Before Transition**
function fadeOutMusicAndRedirect() {
    if (fadeInterval) clearInterval(fadeInterval); // Stop existing fade if any

    fadeInterval = setInterval(() => {
        if (music.volume > 0.05) {
            music.volume -= 0.05;
        } else {
            clearInterval(fadeInterval);
            music.pause();
            music.currentTime = 0;
            window.location.href = "/pages/level1.html"; // Redirect ONLY after fade out
        }
    }, 200); // Gradual fade every 200ms
}

// Function: Trigger Chaos Mode (Windows 95 Errors + Hide Everything Else)
function triggerChaos() {
    document.body.classList.add("horror-mode");

    // Hide top bars (both top and bottom)
    document.querySelectorAll(".top-bar").forEach(bar => bar.style.display = "none");

    // Hide the main intro container text
    document.querySelector(".intro-container").classList.add("horror-intro-container");
    typewriterElement.classList.add("horror-text");

    // Remove "Step Forward" button
    button.style.display = "none";

    // Remove "Escape Now" button if exists
    let escapeButton = document.querySelector(".escape-button");
    if (escapeButton) escapeButton.remove();

    // Play glitch sound **(LOOPING)**
    glitchSound = new Audio("glitch.mp3");
    glitchSound.loop = true; // Make glitch sound loop forever
    glitchSound.volume = 0.8; // Slightly louder for effect
    glitchSound.play();

    // Create chaotic error windows
    spawnErrorWindows();
}

// Function: Create Multiple Error Windows
function spawnErrorWindows() {
    let errorMessages = [
        "💀 SYSTEM FAILURE: Too many echoes detected.",
        "👁️ UNKNOWN ERROR: Reality is destabilizing.",
        "404: Your sanity was not found.",
        "🚨 CRITICAL WARNING: Time loop activated.",
        "🔄 Processing… Processing… ERROR.",
        "Your choices are meaningless.",
        "👤 Who are you again?",
        "ERROR: This was never a dream."
    ];

    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            createErrorWindow(errorMessages[Math.floor(Math.random() * errorMessages.length)]);
        }, i * 700);
    }
}

// Function: Create Error Windows (Now Clicking Fix It Works!)
function createErrorWindow(text) {
    let errorWindow = document.createElement("div");
    errorWindow.classList.add("error-window");
    errorWindow.innerHTML = `
        <div class="error-header">Windows 95</div>
        <p>${text}</p>
        <button class="fix-button">Fix It</button>
    `;
    document.body.appendChild(errorWindow);

    // Random positioning
    errorWindow.style.top = `${Math.random() * 50 + 20}%`;
    errorWindow.style.left = `${Math.random() * 50 + 20}%`;

    // Clicking "Fix It" redirects the player & stops glitch sound
    errorWindow.querySelector(".fix-button").addEventListener("click", () => {
        glitchSound.pause(); // Stop glitch sound when fixed
        glitchSound.currentTime = 0; // Reset audio
        window.location.href = "quizz.html";
    });
}

// Start Typewriter Effect & Music on Page Load
window.onload = function () {
    setTimeout(() => {
        typewriterElement.classList.add("show-text");
        typeWriter([
            "A journey through echoes, fleeting stars, and the spaces between.",
            "",
            "Drifting between waking and sleep, the world shifts—soft, uncertain, waiting for your touch.",
            "",
            "There is no map to follow. No fixed path.",
            "",
            "Only whispers, memories, and a story only you can unfold."
        ]);
        startMusic();
    }, 300);

    // Start Chaos Timer (1m 15s)
    chaosTimeout = setTimeout(triggerChaos, 75000);
};

// Button Click → **Smooth Music Fade Out & Redirect**
button.addEventListener("click", function () {
    clearTimeout(chaosTimeout);
    fadeOutMusicAndRedirect();
});
