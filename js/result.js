document.addEventListener("DOMContentLoaded", function () {
    console.log("🚀 result.js loaded!");

    let restartButton = document.getElementById("restart-button");

    if (restartButton) {
        restartButton.addEventListener("click", function () {
            console.log("🔄 Redirecting to home...");
            window.location.href = "../pages/home.html"; // Adjust path if needed
        });
    }

    // ✅ Retrieve MBTI result from localStorage
    let storedResult = localStorage.getItem("mbtiResult");
    console.log("📌 Stored MBTI result (raw):", storedResult);

    let resultData;
    try {
        resultData = storedResult ? JSON.parse(storedResult) : null;
        console.log("✅ Parsed MBTI result:", resultData);
    } catch (error) {
        console.error("❌ Error parsing MBTI result:", error);
        resultData = null;
    }

    // ✅ Check if resultData is valid
    if (!resultData || typeof resultData !== "object" || !resultData.title || !resultData.subtitle) {
        console.warn("⚠️ Invalid or missing MBTI result data. Using default values.");
        resultData = {
            title: "The Dream Judges You",
            subtitle: "The stars whisper, but their words are unclear.",
            image: "default.png"
        };
    }

    console.log("🎯 Final MBTI result to display:", resultData);

    // ✅ Get DOM elements
    let resultText = document.getElementById("result-text");
    let titleElement = document.getElementById("mbti-title");
    let subtitleElement = document.getElementById("mbti-subtitle");
    let imageElement = document.getElementById("mbti-image"); 

    // ✅ Hide the title and subtitle
    if (titleElement) titleElement.classList.add("hidden");
    if (subtitleElement) subtitleElement.classList.add("hidden");

    if (!titleElement || !subtitleElement || !imageElement) {
        console.error("❌ MBTI result elements not found in the DOM.");
        return;
    }

    // Set chaotic, cursed text above the result image
    const cursedTexts = [
        "The dream saw you. It knows. Accept your fate.",
        "You’ve been labeled. No take-backs.",
        "This is you now. Deal with it.",
        "You belong to the dream. Too late to run.",
        "Your result is real. Even if it’s wrong.",
        "The dream whispered your name. Now it won’t stop.",
        "You’re categorized. Hope you like it.",
        "Something decided this for you. Hope it’s right.",
        "Your fate has been sealed. No refunds." 
    ];

    function typeWriterEffect(element, text, speed, callback) {
        let index = 0;
        function type() {
            if (index < text.length) {
                element.innerHTML += text.charAt(index);
                index++;
                setTimeout(type, speed);
            } else if (callback) {
                setTimeout(callback, 500);
            }
        }
        element.innerHTML = "";
        type();
    }

    // ✅ Display a random cursed text
    let randomText = cursedTexts[Math.floor(Math.random() * cursedTexts.length)];
    typeWriterEffect(resultText, randomText, 60); // Adjust speed if needed

    // ✅ Update title & subtitle
    titleElement.textContent = resultData.title;
    subtitleElement.textContent = resultData.subtitle;

    // ✅ Extract MBTI type (first 4 characters)
    let mbtiType = resultData.title.substring(0, 4).toUpperCase();
    console.log("🔍 Extracted MBTI Type:", mbtiType);

    // ✅ Define valid MBTI types and their images
    const validMBTIs = [
        resultData.title.substring(0, 4).toUpperCase()
    ];

    let imagePath;
    
    if (validMBTIs.includes(mbtiType)) {
        imagePath = `../assets/images/${mbtiType}.png`;
    } else {
        imagePath = "../assets/images/logo.png"; // Fallback image
    }

    console.log("🖼️ Final Image Path:", imagePath);
    imageElement.src = imagePath;
    imageElement.alt = resultData.title;
    imageElement.style.width = "auto";
    imageElement.style.height = "100%";
    imageElement.style.objectFit = "contain"; // Ensures the image does not resize due to text


    // ✅ Error handling for missing image
    imageElement.onerror = function () {
        console.warn("⚠️ Image not found, switching to default.");
        imageElement.src = "../assets/images/logo.png";
    };

    console.log("✅ Result displayed successfully!");
});

