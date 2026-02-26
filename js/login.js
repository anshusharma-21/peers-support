
import { auth } from './app.js';
import { signInWithEmailAndPassword, 
       
 } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";


const loginBtn = document.getElementById('loginBtn');

loginBtn.addEventListener('click', async () => {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  if (!email || !password) {
    alert("Please enter email and password");
    return;
  }

  try {
    await signInWithEmailAndPassword(auth, email, password);
    alert('Logged in successfully!');
    window.location = 'home.html'; 
  } catch (error) {
    alert(error.message);
  }
});