import { auth, db } from './app.js';

import { 
  createUserWithEmailAndPassword, 
  updateProfile, 
  signOut 
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

import { 
  doc, 
  setDoc, 
  serverTimestamp 
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

const signupBtn = document.getElementById('signupBtn');

signupBtn.addEventListener('click', async function() {

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();

  if (!name || !email || !password) {
    alert("Sweetheart, please fill all the fields so we can get to know you! ✨");
    return;
  }

  try {
  
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    
    await updateProfile(user, {
      displayName: name
    });

   
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      name: name,
      email: email,
      createdAt: serverTimestamp()
    });

    
    localStorage.setItem("user_real_name", name);

    
    alert(`Yay! Welcome to the family, ${name}! Your account is ready. 🌸`);

    
    await signOut(auth);

    window.location = "login.html";

  } catch (error) {
    
    if (error.code === 'auth/email-already-in-use') {
      alert("This email is already registered. Try logging in instead");
    } else {
      alert("Oops! Something went wrong: " + error.message);
    }
  }

});