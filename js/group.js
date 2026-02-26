import { db } from "./app.js";
import { 
    collection, addDoc, query, orderBy, onSnapshot, serverTimestamp 
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";



const groupsGrid = document.querySelector(".groups-grid");


if (groupsGrid) {
    const groupsRef = collection(db, "groups");
    const qGroups = query(groupsRef, orderBy("createdAt", "desc"));

    onSnapshot(qGroups, (snapshot) => {
       snapshot.docChanges().forEach((change) => {
            if (change.type === "added") {
                const data = change.doc.data();
                const groupId = data.name.toLowerCase().replace(/\s+/g, '-');
                
                const card = document.createElement("div");
                card.className = "group-card";
                card.innerHTML = `
                    <div class="group-icon-circle" style="background: #e7f5ff;">
                        <img src="https://img.icons8.com/ios/50/conference-call.png">
                    </div>
                    <h3>${data.name}</h3>
                    <p>${data.description || "A new community circle."}</p>
                    <button onclick="joinGroup('${groupId}')" class="join-btn">Join Circle</button>
                `;
                groupsGrid.appendChild(card);
            }
        });
    });
}


window.toggleCreateModal = function() {
    const modal = document.getElementById('createGroupModal');
    if (modal) {
        modal.style.display = (modal.style.display === "flex") ? "none" : "flex";
    }
};


window.createNewGroup = async function() {
    const nameInput = document.getElementById('newGroupName');
    const descInput = document.getElementById('newGroupDesc');
    const name = nameInput.value.trim();
    const description = descInput.value.trim();

    if (!name) return alert("Please enter a group name");

    try {
        await addDoc(collection(db, "groups"), {
            name: name,
            description: description,
            createdAt: serverTimestamp(),
            createdBy: "Anshu" 
        });

        alert("Group created successfully!");
        nameInput.value = "";
        descInput.value = "";
        window.toggleCreateModal();
    } catch (e) {
        console.error("Error saving group: ", e);
    }
};


const urlParams = new URLSearchParams(window.location.search);
const topic = urlParams.get("topic");

if (topic) {
    document.getElementById("topicName").innerText = topic.charAt(0).toUpperCase() + topic.slice(1) + " Group";

    const messagesRef = collection(db, "groups", topic, "messages");

    if (Notification.permission !== "granted") { Notification.requestPermission(); }

    const sendBtn = document.getElementById("sendBtn");
    if (sendBtn) {
        sendBtn.addEventListener("click", async () => {
            const input = document.getElementById("messageInput");
            const message = input.value.trim();
            if (message === "") return;

            try {
                await addDoc(messagesRef, {
                    text: message,
                    sender: "Anshu", 
                    createdAt: serverTimestamp()
                });
                input.value = "";
            } catch (e) { console.error("Error adding document: ", e); }
        });
    }

    const q = query(messagesRef, orderBy("createdAt"));
    let isInitialLoad = true;

    onSnapshot(q, (snapshot) => {
        const messagesDiv = document.getElementById("messages");
        if (!messagesDiv) return;
        
        messagesDiv.innerHTML = "";

        snapshot.forEach((doc) => {
            const data = doc.data();
            const wrapper = document.createElement("div");
            const isMine = data.sender === "Anshu"; 
            
            wrapper.className = isMine ? "message-wrapper my-msg" : "message-wrapper other-msg";

            const time = data.createdAt ? new Date(data.createdAt.toDate()).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : "";

            wrapper.innerHTML = `
                <div class="message-bubble ${isMine ? 'sent' : 'received'}">
                    <span class="sender-name">${data.sender}</span>
                    <p>${data.text}</p>
                    <span class="msg-time">${time}</span>
                </div>
            `;
            messagesDiv.appendChild(wrapper);

            if (!isInitialLoad && !isMine) {
                new Notification(`AuraAlly - ${topic}`, { body: data.text });
            }
        });

        isInitialLoad = false;
        setTimeout(() => { messagesDiv.scrollTop = messagesDiv.scrollHeight; }, 100);
    });
}