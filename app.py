from flask import Flask, request, jsonify, render_template
from forefront import ForefrontClient

app = Flask(__name__)

# Initialize Forefront Client
ff = ForefrontClient(api_key="your_token_from_forefront_api")

messages = []  # Store conversation history

def CustomChatGPT(user_input):
    messages.append({"role": "user", "content": user_input})
    
    response = ff.chat.completions.create(
        model="mistralai/Mistral-7B-v0.1",
        messages=messages
    )

    ChatGPT_reply = response.choices[0].message['content']
    ChatGPT_reply = ChatGPT_reply.replace("<|im_end|>", "").replace("<|im_start|>", "").strip()


    messages.append({"role": "assistant", "content": ChatGPT_reply})
    return ChatGPT_reply

# API Route for Chatbot
@app.route('/chat', methods=['POST'])
def chat():
    data = request.json
    user_input = data.get("message", "")
    
    if not user_input:
        return jsonify({"error": "Empty message"}), 400

    bot_response = CustomChatGPT(user_input)
    return jsonify({"response": bot_response})

# Route to serve frontend
@app.route('/')
def index():
    return render_template("index.html")

if __name__ == '__main__':
    app.run(debug=True)

