// SIGNUP
const signupForm = document.getElementById('signupForm');
if(signupForm){
    signupForm.addEventListener('submit', (e)=>{
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        let users = JSON.parse(localStorage.getItem('users')) || {};
        if(users[username]){
            alert('Username already exists!');
        } else {
            users[username] = password;
            localStorage.setItem('users', JSON.stringify(users));
            alert('Account created!');
            window.location.href = 'login.html';
        }
    });
}

// LOGIN
const loginForm = document.getElementById('loginForm');
if(loginForm){
    loginForm.addEventListener('submit', (e)=>{
        e.preventDefault();
        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;

        let users = JSON.parse(localStorage.getItem('users')) || {};
        if(users[username] && users[username] === password){
            localStorage.setItem('loggedInUser', username);
            window.location.href = 'dashboard.html';
        } else {
            alert('Invalid username or password!');
        }
    });
}
