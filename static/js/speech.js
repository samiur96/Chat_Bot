// Text-to-Speech
const synth = window.speechSynthesis;

const textToSpeech = (string) => {
    let voice = new SpeechSynthesisUtterance(string);
    voice.lang = "en-US";
    voice.volume = 1;
    voice.rate = 1;
    voice.pitch = 1;
    synth.speak(voice);
};

// Send Message Function
async function sendMessage() {
    let userMessage = document.getElementById("message").value.trim();
    if (!userMessage) return;

    let chatBox = document.getElementById("chat-box");

    // Append user message
    let userDiv = document.createElement("div");
    userDiv.classList.add("message", "user");
    userDiv.innerHTML = `<b>You:</b> ${userMessage}`;
    chatBox.appendChild(userDiv);

    document.getElementById("message").value = ""; // Clear input

    // Send message to backend
    try {
        let response = await fetch("/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: userMessage })
        });

        let data = await response.json();

        // Append bot response
        let botDiv = document.createElement("div");
        botDiv.classList.add("message", "bot");
        botDiv.innerHTML = `<b>Bot:</b> ${data.response}`;
        chatBox.appendChild(botDiv);

        // Play bot response using text-to-speech
        textToSpeech(data.response);

        // Auto-scroll to latest message
        chatBox.scrollTop = chatBox.scrollHeight;
    } catch (error) {
        console.error("Error:", error);
    }
}
