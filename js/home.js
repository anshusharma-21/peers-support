
import { auth } from "./app.js";
import { 
  onAuthStateChanged, 
  signOut 
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";


onAuthStateChanged(auth, function(user) {
  if (!user) {
    
    window.location = "login.html";
  } else {
   
    const localName = localStorage.getItem("user_real_name");
    const displayName = user.displayName || localName || ""; 
    
    const userNameElement = document.getElementById("userName");
    if (userNameElement) {
        userNameElement.innerText = displayName;
    }
  }
});


const buttons = [
  { id: "privateChatBtn", path: "chat.html" },
  { id: "groupChatBtn", path: "groups.html" },
  { id: "forumBtn", path: "forum.html" },
  { id: "resourcesBtn", path: "resources.html" }
];

buttons.forEach(btn => {
  const element = document.getElementById(btn.id);
  if (element) {
    element.addEventListener("click", () => {
      window.location = btn.path;
    });
  }
});


const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", async function() {
    try {
      await signOut(auth);
     
      window.location = "login.html";
    } catch (error) {
      console.error("Logout Error:", error);
    }
  });
}