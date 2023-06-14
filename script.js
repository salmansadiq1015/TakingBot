const sendInput = document.querySelector(".chat-input textarea");
const sendChatbtn = document.querySelector(".chat-input span");
const chatBox = document.querySelector(".chatbox");
let userMessage;

const API_KEY = "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";

const createChatLi = (message, className) => {
  // Creating a chat message
  const chatLi = document.createElement("li");
  chatLi.classList.add("chat", className);
  let chatContent =
    className === "outgoing"
      ? `<p>${message}</p><i class="fa-solid fa-user user"></i>`
      : `<i class="fa-solid fa-robot fa-beat-fade"></i><p></p>`;
  chatLi.innerHTML = chatContent;
  chatLi.querySelector("p").textContent = message;
  return chatLi;
};

// BotAI
const generateResponse = (incomingChatLI) => {
  const API_URL = "https://api.openai.com/v1/chat/completions";
  const messageElement = incomingChatLI.querySelector("p");
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: userMessage }],
    }),
  };
  fetch(API_URL, requestOptions)
    .then((res) => res.json())
    .then((data) => {
      messageElement.textContent = data.choices[0].message.content;
    })
    .catch((error) => {
      console.log(error);
      messageElement.textContent =
        "Oops! Something went wrong. Please try again😥" + error;
    })
    .finally(() => chatBox.scrollTo(0, chatBox.scrollHeight));
};

const handleChat = () => {
  userMessage = sendInput.value.trim();
  if (!userMessage) return;

  //   Append the user message in chatBox
  chatBox.appendChild(createChatLi(userMessage, "outgoing"));
  chatBox.scrollTo(0, chatBox.scrollHeight);
  setTimeout(() => {
    const incomingChatLI = createChatLi("Thinking...", "incoming");
    chatBox.appendChild(incomingChatLI);
    chatBox.scrollTo(0, chatBox.scrollHeight);
    generateResponse(incomingChatLI);
  }, 600);
};

sendChatbtn.addEventListener("click", handleChat);
