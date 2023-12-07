function login() {

  const form = {
    email: document.querySelector("#email"),
    password: document.querySelector("#password"),
    submit: document.querySelector("#connexion"),
    messages: document.getElementById("form-messages"),
  };

  let button = form.submit.addEventListener("click", (e) => {
    e.preventDefault();
    const url = 'http://localhost:5678/api/users/login';

    fetch(url, {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify({
        email: form.email.value,
        password: form.password.value,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if ((data.error) || (data.message)) {
          const alert = document.getElementById('alert');
          alert.innerHTML = "Veuillez verifier votre email ou votre mot de passe";
          alert.style.display = "block";
          setTimeout(function () { alert.style.display = "none"; }, 30000);
         
        } else {
          localStorage.setItem('auth', JSON.stringify(data));
          window.location = "homepageedit.html";
        }


      })
      .catch((error) => {
        console.error('Error:', error);
      });
  });
}
