function checkLogin() {
    const auth = localStorage.getItem('auth');
    if (auth !== null) { 
        return true;
    }

    return false;
}

function logout() {
    localStorage.removeItem('auth');
        
    window.location = "login.html";
}