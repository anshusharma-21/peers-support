import { db } from "./app.js";
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

const postsRef = collection(db, "forumPosts");
const forumLayout = document.getElementById("forumLayout");
const postsArea = document.getElementById("postsArea");


document.getElementById("postBtn").addEventListener("click", async () => {
  const title = document.getElementById("titleInput").value.trim();
  const content = document.getElementById("contentInput").value.trim();
  const category = document.getElementById("categoryInput").value;

  if (!title || !content || !category) {
    alert("Please fill all fields");
    return;
  }

  await addDoc(postsRef, {
    title, content, category,
    userName: "Anonymous",
    createdAt: serverTimestamp()
  });

  
  forumLayout.classList.remove("initial-view");
  forumLayout.classList.add("active-view");
  postsArea.style.display = "block";

  document.getElementById("titleInput").value = "";
  document.getElementById("contentInput").value = "";
});

const q = query(postsRef, orderBy("createdAt", "desc"));
onSnapshot(q, (snapshot) => {
  const container = document.getElementById("postsContainer");
  container.innerHTML = "";

  if (snapshot.empty) {
    forumLayout.classList.add("initial-view");
    postsArea.style.display = "none";
  } else {
    forumLayout.classList.remove("initial-view");
    forumLayout.classList.add("active-view");
    postsArea.style.display = "block";
  }

  snapshot.forEach((doc) => {
    const data = doc.data();
    const postId = doc.id;
    const div = document.createElement("div");
    div.className = "post-card";

    div.innerHTML = `
      <div class="post-user">
          <img src="https://ui-avatars.com/api/?name=User&background=FFB07C&color=fff">
          <div class="user-meta">
              <strong>${data.title}</strong>
              <span>Category: ${data.category}</span>
          </div>
      </div>
      <p>${data.content}</p>
      <div class="post-actions">
          <button class="action-btn">👍 Like</button>
          <button class="action-btn">💬 Comment</button>
      </div>
      <div class="reply-section">
          <input type="text" id="replyInput-${postId}" placeholder="Write a reply...">
          <button class="action-btn" onclick="addReply('${postId}')">Reply</button>
          <div id="replies-${postId}" style="margin-top:10px; font-size:0.9rem;"></div>
      </div>
    `;
    container.appendChild(div);
    loadReplies(postId);
  });
});


window.addReply = async (postId) => {
    const replyInput = document.getElementById(`replyInput-${postId}`);
    const text = replyInput.value.trim();
    if (!text) return;
    await addDoc(collection(db, "forumPosts", postId, "replies"), {
        text, userName: "Anonymous", createdAt: serverTimestamp()
    });
    replyInput.value = "";
};

function loadReplies(postId) {
    const qReplies = query(collection(db, "forumPosts", postId, "replies"), orderBy("createdAt", "asc"));
    onSnapshot(qReplies, (snapshot) => {
        const div = document.getElementById(`replies-${postId}`);
        div.innerHTML = "";
        snapshot.forEach(doc => {
            const p = document.createElement("p");
            p.innerHTML = `<strong>💬</strong> ${doc.data().text}`;
            div.appendChild(p);
        });
    });
}