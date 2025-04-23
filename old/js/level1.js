document.addEventListener("DOMContentLoaded", function () {
    const typewriterElement = document.getElementById("typewriter");
    const answersContainer = document.getElementById("answers");
    const music = new Audio("../assets/audio/level1.mp3");

    let fadeInterval;

    // 🎵 Function: **Start Background Music (Looping)**
    function startMusic() {
        music.loop = true;
        music.volume = 1.0; // Default volume (adjust if needed)
        music.play().catch(error => console.log("🔇 Autoplay blocked:", error));
    }

    // 🎵 Function: **Smooth Fade-Out Before Redirecting**
    function fadeOutMusicAndRedirect() {
        let fadeDuration = 5000; // 5 seconds fade duration
        let fadeStep = 50; // Reduce volume every 50ms
        let fadeAmount = music.volume / (fadeDuration / fadeStep);

        fadeInterval = setInterval(() => {
            if (music.volume > fadeAmount) {
                music.volume -= fadeAmount; // Reduce volume gradually
            } else {
                clearInterval(fadeInterval);
                music.pause();
                music.currentTime = 0;
                window.location.href = "../pages/result.html"; // Redirect AFTER fade-out
            }
        }, fadeStep);
    }

    // ✅ **Ensure Music Plays When the Page Loads**
    startMusic();

    // ✅ **Ensure Music Stops and Fades Out When Transitioning**
    function showResult() {
        const resultData = calculateResult();

        if (!resultData || typeof resultData !== "object" || !resultData.title || !resultData.subtitle) {
            console.error("Invalid result data:", resultData);
            return;
        }

        localStorage.setItem("mbtiResult", JSON.stringify(resultData));

        fadeOutMusicAndRedirect(); // Start fade out before moving to result page
    }

    const questions = [
        {
            text: "You wake up. You don’t remember falling asleep.",
            options: [
                { text: "☽ The sky is blank. I check the settings. They're gone.", scores: { N: 1, F: 1 } },
                { text: "☽ My reflection is here before me. Unacceptable.", scores: { I: 1, N: 1 } },
                { text: "☽ A door with no handle. It knocks. I whisper, \"Not today.\"", scores: { N: 1, P: 1 } },
                { text: "☽ A crab in a tuxedo. He nods. I nod back. Respect.", scores: { S: 1, J: 1 } }
            ]
        },
        {
            text: "You hear a soft humming sound. Where is it coming from?",
            options: [
                { text: "☽ The flowers are singing. Pretty sure it’s the Wii Sports theme.", scores: { N: 1, F: 1 } },
                { text: "☽ The sky is whispering into my bones. I did not sign up this.", scores: { N: 1, T: 1 } },
                { text: "☽ The ground is breathing. I respect its privacy.", scores: { S: 1, J: 1 } },
                { text: "☽ The hum is getting closer. I start humming back.", scores: { I: 1, P: 1 } }
            ]
        },
        {
            text: "The dream is shifting. You must move forward. How do you proceed?",
            options: [
                { text: "☽ Through a tunnel of light. Either salvation or a Windows XP moment.", scores: { N: 1, P: 1 } },
                { text: "☽ I salute the red flag. ‘Lead the way, captain.’", scores: { N: 1, F: 1 } },
                { text: "☽ I put my hands on my hips and say, \"This is above my pay grade.\"", scores: { N: 1, J: 1 } },
                { text: "☽ Down. Just… down. My free trial of standing has ended.", scores: { S: 1, T: 1 } }
            ]
        },
        {
            text: "The air crackles with static. A message forms in your mind:",
            options: [
                { text: "☽ Achievement unlocked: Congratulations! You played yourself.", scores: { S: 1, J: 1 } },
                { text: "☽ Your existence trial has ended. Please subscribe to continue", scores: { I: 1, N: 1 } },
                { text: "☽ I wink at the void. ‘This is fine.’ It isn’t.", scores: { T: 1, P: 1 } },
                { text: "☽ Reality.exe has stopped responding? Just remind me later.", scores: { N: 1, J: 1 } }
            ]
        },
        {
            text: "You see a door with a flickering sign that says \"EXIT\". What do you do?",
            options: [
                { text: "☽ Open it. If this is a trap, at least it’s a well-organized one.", scores: { E: 1, P: 1 } },
                { text: "☽ I lick the sign. Tastes like existential dread.", scores: { S: 1, J: 1 } },
                { text: "☽ Walk past it. I'm smarter than this.", scores: { N: 1, T: 1 } },
                { text: "☽ Accept my fate. If the simulation is crashing, so be it.", scores: { I: 1, F: 1 } }
            ]
        },
        {
            text: "A voice whispers: \"Choose carefully.\"",
            options: [
                { text: "☽ The sky is glitching. Either reality is breaking or my Wi-Fi is acting up again.", scores: { N: 1, P: 1 } },
                { text: "☽ The dream is lagging. I smack it like an old TV and hope for the best.", scores: { F: 1, J: 1 } },
                { text: "☽ Wrong path? Joke’s on you, I’m not even on a path.", scores: { T: 1, P: 1 } },
                { text: "☽ Choices? Didn’t know we had those.", scores: { I: 1, N: 1 } }
            ]
        },
        {
            text: "You hear static. It is growing louder. Do you…",
            options: [
                { text: "☽ Run. No plan. Just vibes.", scores: { E: 1, P: 1 } },
                { text: "☽ Hide. If I can’t see the problem, the problem can’t see me.", scores: { I: 1, J: 1 } },
                { text: "☽ Smile at the static. Maybe it’ll smile back.", scores: { N: 1, F: 1 } },
                { text: "☽ Yeah, yeah… whatever.", scores: { S: 1, T: 1 } }
            ]
        },
        {
            text: "You wake up. Again.",
            options: [
                { text: "☽ The sky is upside down. Pretty sure that’s illegal.", scores: { N: 1, F: 1 } },
                { text: "☽ A mirror. My reflection waves. I do not.", scores: { I: 1, N: 1 } },
                { text: "☽ A staircase leading down. I hear boss music. Cool.", scores: { S: 1, J: 1 } },
                { text: "☽ The door doesn’t jiggle, jiggle— it locks.", scores: { T: 1, P: 1 } }
            ]            
        },
        {
            text: "The dream is collapsing. What do you do?",
            options: [
                { text: "☽ Try to hold it together. I mean, what else am I doing?", scores: { J: 1, F: 1 } },
                { text: "☽ Nah, let it collapse, I’m bored anyway.", scores: { P: 1, N: 1 } },
                { text: "☽ I accept whatever is about to happen. Destiny, baby.", scores: { S: 1, T: 1 } },
                { text: "☽ Pretend it’s not happening and see if that works.", scores: { I: 1, P: 1 } }
            ]
        },
        {
            text: " Are you still here, bro?",
            options: [
                { text: "☽ Yes, but only physically.", scores: { J: 1, S: 1 } },
                { text: "☽ No, I left three questions ago.", scores: { P: 1, N: 1 } },
                { text: "☽ I never was.", scores: { I: 1, T: 1 } },
                { text: "☽ \"Here\" is relative.", scores: { N: 1, F: 1 } }
            ]
        }
    ];

    let currentQuestion = 0;
    let scores = { I: 0, E: 0, N: 0, S: 0, T: 0, F: 0, P: 0, J: 0 };

    function displayQuestion() {
        if (!typewriterElement || !answersContainer) {
            console.error("Missing DOM elements for displaying questions.");
            return;
        }

        typewriterElement.innerHTML = "";
        answersContainer.innerHTML = "";

        if (currentQuestion >= questions.length) {
            showResult();
            return;
        }

        let textIndex = 0;
        function typeWriter() {
            if (textIndex < questions[currentQuestion].text.length) {
                typewriterElement.innerHTML += questions[currentQuestion].text.charAt(textIndex);
                textIndex++;
                setTimeout(typeWriter, 50);
            } else {
                loadAnswers(questions[currentQuestion].options);
            }
        }
        typeWriter();
    }

    function loadAnswers(options) {
        answersContainer.innerHTML = "";
        options.forEach((option, i) => {
            let button = document.createElement("button");
            button.classList.add("answer-button", "hidden");
            button.textContent = option.text;
            button.onclick = () => {
                updateScores(option.scores);
                nextQuestion();
            };
            answersContainer.appendChild(button);
            setTimeout(() => {
                button.classList.remove("hidden");
                button.classList.add("show");
            }, i * 500);
        });
    }

    function updateScores(optionScores) {
        Object.keys(optionScores).forEach(key => {
            scores[key] += optionScores[key];
        });
    }

    function nextQuestion() {
        currentQuestion++;
        displayQuestion();
    }

    function calculateResult() {
        let mbti = "";
        mbti += scores.I > scores.E ? "I" : "E";
        mbti += scores.N > scores.S ? "N" : "S";
        mbti += scores.T > scores.F ? "T" : "F";
        mbti += scores.P > scores.J ? "P" : "J";

        const mbtiToPersona = {
            "INFJ": { 
                title: "SG01 – The Moonlit Oracle", 
                subtitle: "A soft glow in the night, whispering dreams into the stars.",
            },
            "ENFJ": { 
                title: "SG02 – The Starlit Lantern", 
                subtitle: "A heart as warm as candlelight, guiding lost souls home."
            },
            "INFP": { 
                title: "SG03 – The Misty Bloomlet", 
                subtitle: "A gentle breeze carrying forgotten wishes across the sky."
            },
            "ENFP": { 
                title: "SG04 – The Time Skipper", 
                subtitle: "Dancing between seconds, leaving sparkles in every step."
            },
            "INTP": { 
                title: "SM05 – The Cosmic Buble", 
                subtitle: "A floating thought wrapped in a nebula of curiosity."
            },
            "ENTP": { 
                title: "SM06 – The Mischievous Star", 
                subtitle: "A shooting star that refuses to follow the map of the sky."
            },
            "ISFP": { 
                title: "SM07 – The Gentle Whisper", 
                subtitle: "A heart full of soft melodies and pressed flowers."
            },
            "ISTP": { 
                title: "SM08 – The Quiet Moonfox", 
                subtitle: "A shadow that dances under moonlight, silent yet playful."
            },
            "ESFP": { 
                title: "DG09 – The Playful Comet", 
                subtitle: "A spark of joy that races through the universe, laughing all the way."
            },
            "ESFJ": { 
                title: "DG10 – The Melody Weaver", 
                subtitle: "A song that drifts through dreams, stitching hearts together."
            },
            "ESTP": { 
                title: "DG11 – The Starbound Adventurer", 
                subtitle: "A fearless traveler, leaping from one celestial mystery to another."
            },
            "ESTJ": { 
                title: "DG12 – The Celestial Compass", 
                subtitle: "A steady hand guiding constellations into perfect harmony."
            },
            "INTJ": { 
                title: "DM13 – The Nocturne Fern", 
                subtitle: "A quiet thinker staring into the endless wonder of the cosmos."
            },
            "ENTJ": { 
                title: "DM14 – The Cosmic Weaver", 
                subtitle: "A mastermind weaving destiny’s threads into a grand design."
            },
            "ISTJ": { 
                title: "DM15 – The Lunar Sentinel", 
                subtitle: "A watchful guardian who stands unwavering through the tides of time."
            },
            "ISFJ": { 
                title: "DM16 – The Dream’s Guardian", 
                subtitle: "A gentle presence ensuring the stars don’t forget to twinkle."
            }
        };  

        return mbtiToPersona[mbti] || { title: "🌠 The Dream Ends… For Now.", subtitle: "The echoes fade, but the journey is never truly over." };
    }

    function showResult() {
        const resultData = calculateResult(); // Get MBTI result object
    
        if (!resultData || typeof resultData !== "object" || !resultData.title || !resultData.subtitle) {
            console.error("Invalid result data:", resultData);
            return;
        }
    
        // ✅ Fix: Convert resultData to JSON string before storing
        localStorage.setItem("mbtiResult", JSON.stringify(resultData));
        console.log("MBTI result stored successfully:", JSON.stringify(resultData));
    
        window.location.href = "result.html"; // Redirect to result page
    }  

    displayQuestion();
});
