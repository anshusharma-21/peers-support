import { db } from "./app.js";
import { 
    collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, getDocs 
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

const usersList = document.getElementById("usersList");
const chatBox = document.getElementById("chatBox");
const messageInput = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");

let selectedUserId = null;
let isInitialLoad = true; 


if (Notification.permission !== "granted") {
    Notification.requestPermission();
}


async function loadUsers() {
    const querySnapshot = await getDocs(collection(db, "users"));
    usersList.innerHTML = "";
    querySnapshot.forEach((doc) => {
        const user = doc.data();
        if (user.name !== "Anshu") {
            const div = document.createElement("div");
            div.className = "user-item";
            div.innerText = user.name;
            div.onclick = () => {
                document.querySelectorAll('.user-item').forEach(el => el.classList.remove('active'));
                div.classList.add('active');
                
               
                const dot = document.querySelector(".notification-dot");
                if (dot) dot.style.display = "none";

                selectedUserId = doc.id;
                isInitialLoad = true; 
                loadMessages(doc.id);
            };
            usersList.appendChild(div);
        }
    });
}

function loadMessages(chatId) {
    const q = query(collection(db, "chats", chatId, "messages"), orderBy("createdAt"));
    
    onSnapshot(q, (snapshot) => {
        chatBox.innerHTML = "";

        snapshot.docChanges().forEach((change) => {
            if (change.type === "added") {
                const data = change.doc.data();
                
                
                if (!isInitialLoad && data.sender !== "Anshu") {
                   
                    new Notification(`AuraAlly: Message from ${data.sender}`, {
                        body: data.text,
                        icon: "https://img.icons8.com/ios/50/speech-bubble--v1.png"
                    });
                    
                  
                    const dot = document.querySelector(".notification-dot");
                    if (dot) dot.style.display = "block";
                }
            }
        });

        snapshot.forEach((doc) => {
            const data = doc.data();
            const isMine = data.sender === "Anshu";
            const wrapper = document.createElement("div");
            wrapper.className = isMine ? "message-wrapper my-msg" : "message-wrapper other-msg";
            
            wrapper.innerHTML = `
                <div class="message-bubble ${isMine ? 'sent' : 'received'}">
                    <p>${data.text}</p>
                </div>
            `;
            chatBox.appendChild(wrapper);
        });

        isInitialLoad = false; 
        chatBox.scrollTop = chatBox.scrollHeight;
    });
}


sendBtn.onclick = async () => {
    const text = messageInput.value.trim();
    if (!text || !selectedUserId) return;

    try {
        await addDoc(collection(db, "chats", selectedUserId, "messages"), {
            text: text,
            sender: "Anshu",
            createdAt: serverTimestamp()
        });
        messageInput.value = "";
        messageInput.focus();
    } catch (e) {
        console.error("Error sending message: ", e);
    }
};

loadUsers();