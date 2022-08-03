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

    if(username && password) {
        const response = await fetch('/api/users/login',{
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
        } else if (session?.message == "No user") {
            Swal.fire({
                position: 'top-end',
                icon: 'error',
                title: 'Usuario inexistente',
                text: 'El usuario no existe, sé bienvenido a registrarte',
                showConfirmButton: false,
                timer: 3000
            });
        }
    }
}

async function logout() {
    const name = getSessionCookie();
    const response = await fetch('/api/users/logout',{
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

async function signin() {
    const name = document.getElementById('signName').value
    const email = document.getElementById('signMail').value
    const username = document.getElementById('signUsername').value
    const password = document.getElementById('signPassword').value
    const confirmPassword = document.getElementById('confirmPassword').value

    if(name && email && username && password && confirmPassword) {

        if(password !== confirmPassword) {
            Swal.fire({
                position: 'top-end',
                icon: 'error',
                title: 'Las contraseñas no son iguales',
                showConfirmButton: false,
                timer: 3000
            });
            return null
        }
        const response = await fetch('/api/users/signup',{
            method: 'POST',
            body: JSON.stringify({
                name,
                email,
                username,
                password,
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        })
        signup = await response.json();
        
        if(signup?.signin) {
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Usuario Creado',
                text: 'Usuario creado exitosamente. Inicia sesion para disfrutar de la aplicación',
                showConfirmButton: false,
                timer: 3000
            });
        } else {
            Swal.fire({
                position: 'top-end',
                icon: 'error',
                title: 'No se ha podido crear el usuario',
                showConfirmButton: false,
                timer: 3000
            });
        }
    }

}

