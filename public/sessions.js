const titleElement = document.getElementById('welcome-title')
const userButton = document.getElementById('userDropdown')
const userElement = document.getElementById('usrSession')
const sessionActionElement = document.getElementById('usrBtns')


// funcion para lectura de cookieParser, Ctrl+C/Ctrl+V de internet
function getSessionCookie() {
    let name = "chSession=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
}

(()=> {
    const session = getSessionCookie();
    if(session) {
        setSessionInterface()
    }
})()

function setSessionInterface(logout) {
    const session = getSessionCookie();
    if(!logout) {
        titleElement.innerText = 'Bienvenido ' + session
        userElement.innerHTML = `<h5>Usuario: ${session}</h5>`
        sessionActionElement.innerHTML = `<button class="btn btn-dark" onclick="logout()">Cerrar sesión</button>`
        userButton.innerHTML = `<i class="fa fa-user-check"></i>`
    } else {
        titleElement.innerText = 'Bienvenido'
        userElement.innerHTML = `<h5>No se iniciado sesion</h5>`
        sessionActionElement.innerHTML = `<a href="/login">
        <button class="btn btn-primary">Iniciar sesion / Registrarse</button>
        </a>`
        userButton.innerHTML = `<i class="fa fa-user"></i>`
    }
}

async function login() {
    const username = document.getElementById('loginUsername').value
    const password = document.getElementById('loginPassword').value

    const response = await fetch('/api/session/login',{
        method: 'POST',
        body: JSON.stringify({
            username,
            password,
        }),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
    })
    session = await response.json();
    if(session?.login) {
        window.location.href = '/'
    }
}

async function logout() {
    const name = getSessionCookie();
    const response = await fetch('/api/session/logout',{
        method: 'POST',
    })
    session = await response.json();
    if(session && !session.login) {
        Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Hasta luego ' + name,
            text: 'Estaremos esperando tu próxima visita',
            showConfirmButton: false,
            timer: 3000
        });
        setSessionInterface(true)
    }
}

function signin() {
    alert('signin')
}

