document.addEventListener("DOMContentLoaded", function () {
    lucide.createIcons();
    const userInput = document.getElementById("userInput");
    const sendButton = document.getElementById("sendButton");
    const micButton = document.getElementById("micButton");
    const pauseButton = document.getElementById("pauseButton");
    const chatArea = document.getElementById("chatArea");

    let isSpeaking = false;

    function addMessage(content, sender) {
        const message = document.createElement("div");
        message.classList.add("message", sender, "fade-in");

        const contentWrapper = document.createElement("div");
        contentWrapper.classList.add("message-content");
        contentWrapper.innerHTML = content
            .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
            .replace(/\n/g, "<br>");

        message.appendChild(contentWrapper);
        chatArea.appendChild(message);
        chatArea.scrollTop = chatArea.scrollHeight;

        if (sender === "assistant") {
            speakText(content);
        }
    }

    function speakText(text) {
        if (typeof responsiveVoice === "undefined") {
            console.error("ResponsiveVoice no está cargado.");
            return;
        }

        const cleanedText = text
            .replace(/\*\*(.*?)\*\*/g, "$1")
            .replace(/[*/#]/g, "")
            .replace(/\./g, "")
            .replace(/\n/g, " ")
            .replace(/\s+/g, " ");

        const language = detectLanguage(cleanedText);

        responsiveVoice.speak(cleanedText.trim(), language, {
            rate: 1,
            pitch: 1,
            volume: 1,
            onstart: function () {
                console.log("Iniciando lectura...");
                isSpeaking = true;
                pauseButton.innerHTML = `<i data-lucide="pause" class="btn-icon"></i>`;
                lucide.createIcons();
            },
            onend: function () {
                console.log("Lectura completada.");
                isSpeaking = false;
                pauseButton.innerHTML = `<i data-lucide="play" class="btn-icon"></i>`;
                lucide.createIcons();
            }
        });
    }

    function detectLanguage(text) {
        const languagePatterns = [
            { regex: /\b(pel[ií]cula|director|actor|actriz|cine|filme|taquilla|estreno|género|drama|comedia|tráiler|premio|festival)\b|[ñáéíóúü¿¡]/i, voice: "Spanish Female" },
            { regex: /\b(movie|film|director|actor|actress|cinema|box office|trailer|award|genre|release|drama|comedy|festival|premiere)\b/i, voice: "US English Female" },
            { regex: /\b(film|réalisateur|acteur|actrice|cinéma|bande-annonce|prix|festival|genre|drame|comédie|sortie|primé)\b|[éàèùâêîôûëïüçœæ]/i, voice: "French Female" },
            { regex: /\b(Film|Regisseur|Schauspieler|Schauspielerin|Kino|Trailer|Preis|Festival|Genre|Drama|Komödie|Veröffentlichung)\b|[äöüß]/i, voice: "Deutsch Female" },
            { regex: /\b(电影|导演|演员|电影院|票房|预告片|奖项|节日|类型|剧情|喜剧|首映)\b/, voice: "Chinese Female" },
            { regex: /\b(映画|監督|俳優|女優|映画館|予告編|賞|フェスティバル|ジャンル|ドラマ|コメディ|公開)\b/, voice: "Japanese Female" },
            { regex: /\b(영화|감독|배우|여배우|극장|예고편|수상|페스티벌|장르|드라마|코미디|개봉)\b/, voice: "Korean Female" },
            { regex: /\b(фильм|режиссер|актер|актриса|кино|трейлер|премия|фестиваль|жанр|драма|комедия|премьера)\b/i, voice: "Russian Female" }
        ];

        for (const lang of languagePatterns) {
            if (lang.regex.test(text)) {
                console.log(`Detectado: ${lang.voice}`);
                return lang.voice;
            }
        }

        return "US English Female";
    }

    async function sendMessage() {
        const question = userInput.value.trim();
        if (question === "") return;

        addMessage(question, "user");
        userInput.value = "";
        if (/^(hola|buenas|hey|holi)/i.test(question)) {
            addMessage("Hola, ¿qué película quieres que te recomiende?", "assistant");
            return;
        } 
        const loadingMessage = document.createElement("div");
        loadingMessage.classList.add("message", "assistant", "fade-in", "loading");

        const contentWrapper = document.createElement("div");
        contentWrapper.classList.add("message-content");
        contentWrapper.innerHTML = `<span class="loading-dots">Procesando</span>`;

        loadingMessage.appendChild(contentWrapper);
        chatArea.appendChild(loadingMessage);
        chatArea.scrollTop = chatArea.scrollHeight;

        try {
            const response = await fetch("https://magicloops.dev/api/loop/201851fc-acc2-452d-8c35-c77626d5f549/run", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ question })
            });

            const data = await response.json();

            if (chatArea.contains(loadingMessage)) {
                chatArea.removeChild(loadingMessage);
            }

            const aiMessage = data.respuesta || "No se obtuvo respuesta.";
            addMessage(aiMessage, "assistant");

        } catch (error) {
            if (chatArea.contains(loadingMessage)) {
                chatArea.removeChild(loadingMessage);
            }
            addMessage("❌ Error al obtener la respuesta. Inténtalo de nuevo.", "assistant");
        }
    }

    sendButton.addEventListener("click", sendMessage);
    userInput.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            sendMessage();
        }
    });

    let recognition;
    if ("webkitSpeechRecognition" in window) {
        recognition = new webkitSpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = "es-ES";
    } else {
        console.error("Tu navegador no soporta reconocimiento de voz.");
    }

    micButton.addEventListener("click", () => {
        if (!recognition) return;

        recognition.start();
        micButton.disabled = true;
        micButton.classList.add("listening");
        micButton.innerHTML = `<i data-lucide="mic-off" class="btn-icon"></i>`;

        recognition.onresult = function (event) {
            const transcript = event.results[0][0].transcript;
            userInput.value = transcript;
            micButton.disabled = false;
            micButton.classList.remove("listening");
            micButton.innerHTML = `<i data-lucide="mic" class="btn-icon"></i>`;
            lucide.createIcons();
        };

        recognition.onerror = function (event) {
            console.error("Error de reconocimiento de voz:", event.error);
            micButton.disabled = false;
            micButton.classList.remove("listening");
            micButton.innerHTML = `<i data-lucide="mic" class="btn-icon"></i>`;
            lucide.createIcons();
        };

        recognition.onend = function () {
            micButton.disabled = false;
            micButton.classList.remove("listening");
            micButton.innerHTML = `<i data-lucide="mic" class="btn-icon"></i>`;
            lucide.createIcons();
        };
    });

    pauseButton.addEventListener("click", () => {
        if (isSpeaking && typeof responsiveVoice !== "undefined") {
            responsiveVoice.cancel();
            isSpeaking = false;
            pauseButton.innerHTML = `<i data-lucide="play" class="btn-icon"></i>`;
            lucide.createIcons();
            console.log("Voz detenida.");
        }
    });
});