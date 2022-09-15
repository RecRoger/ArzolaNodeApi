const titleElement = document.getElementById('welcome-title')
const userButton = document.getElementById('userDropdown')
const userElement = document.getElementById('usrSession')
const sessionActionElement = document.getElementById('usrBtns')
let signImage = null

var userData;

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

function getUserData() {
    return userData
}

(()=> {
    const session = getSessionCookie();
    if(session) {
        setSessionInterface()
    }
})()

async function setSessionInterface(logout) {
    const usernameInput = document.getElementById('username')
    const session = getSessionCookie();
    if(!logout) {
        const response = await fetch('/api/users/' + session)
        userData = await response.json();
        titleElement.innerText = 'Bienvenido ' + userData.name
        userElement.innerHTML = `
        <div class="d-flex align-items-center mb-3">
            <img src="${userData.image}" style="height: 50px; width: 50px">
            <h5 class="ms-2">${userData.username}</h5>
        </div>
        `
        sessionActionElement.innerHTML = `
        <button class="btn btn-link" onclick="checkUserData()">Datos de usuario</button>
        <button class="btn btn-dark" onclick="logout()">Cerrar sesión</button>
        `
        userButton.innerHTML = `<i class="fa fa-user-check"></i>`
        
        const navbarElement = document.getElementById('app-navbar')
        if (navbarElement && userData.role === 'admin'){
            navbarElement.innerHTML += `
                <li class="nav-item ms-auto" id="adminSectionTab">
                    <a class="nav-link" href="./products">Editar Productos</a>
                </li>`
        }
        if(usernameInput) {
            usernameInput.value = userData.username
            usernameInput.setAttribute('readonly', true)
        }
    } else {
        titleElement.innerText = 'Bienvenido'
        userElement.innerHTML = `<h5>No se iniciado sesion</h5>`
        sessionActionElement.innerHTML = `<a href="/login">
        <button class="btn btn-primary">Iniciar sesion / Registrarse</button>
        </a>`
        userButton.innerHTML = `<i class="fa fa-user"></i>`
        document.getElementById('adminSectionTab').remove()
        if(usernameInput) {
            usernameInput.value = ''
            usernameInput.setAttribute('readonly', false)
        }
    }
}

async function login() {
    const username = document.getElementById('loginUsername').value
    const password = document.getElementById('loginPassword').value

    if(username && password) {

        try {
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
        } catch(e) {
            console.error('>>>> El error', e)
            Swal.fire({
                position: 'top-end',
                icon: 'error',
                title: 'Ha ocurrido un error',
                text: 'Probablemente las credenciales no sean las correctas',
                showConfirmButton: false,
                timer: 3000
            });
        }
    }
}

async function logout() {
    const name = userData.name;
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
    const phone = document.getElementById('signPhone').value
    const address = document.getElementById('signAddress').value
    const confirmPassword = document.getElementById('confirmPassword').value

    if(name && email && username && password && confirmPassword) {

        try {
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
                    image: signImage,
                    phone,
                    address,
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
        } catch(e) {
            console.error('>>>> El error', e)
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

function fileChange() {
    const target = document.getElementById('signImage')
    if (target.files) {
      // this.applyForm.get('file').setValue(target.files[0]);
      var reader = new FileReader();
      reader.onload = (event) => {
        signImage = event.target.result;
      }
      reader.readAsDataURL(target.files[0]);
    }
}

function checkUserData() {
    Swal.fire({
        title: '<strong>Datos de usuario</strong>',
        imageUrl: userData.image,
        imageHeight: 300,
        html:
          `<ul class="list-group list-group-flush">
            <li class="list-group-item d-flex justify-content-between align-items-start">
                <div class="ms-2 me-auto text-start">
                    <div class="fw-bold">Nombre: </div>
                    ${userData.name}
                </div>
            </li>
            <li class="list-group-item d-flex justify-content-between align-items-start">
                <div class="ms-2 me-auto text-start">
                    <div class="fw-bold">Email: </div>
                    ${userData.email}
                </div>
            </li>
            <li class="list-group-item d-flex justify-content-between align-items-start">
                <div class="ms-2 me-auto text-start">
                    <div class="fw-bold">Usuario: </div>
                    ${userData.username}
                </div>
            </li>
            <li class="list-group-item d-flex justify-content-between align-items-start">
                <div class="ms-2 me-auto text-start">
                    <div class="fw-bold">Telefono: </div>
                    ${userData.phone}
                </div>
            </li>
            <li class="list-group-item d-flex justify-content-between align-items-start">
                <div class="ms-2 me-auto text-start">
                    <div class="fw-bold">Direccion: </div>
                    ${userData.address}
                </div>
            </li>
          </ul>`,
        showCloseButton: true,
        showCancelButton: false,
        focusConfirm: false,
      })
}

