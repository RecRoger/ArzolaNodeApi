let productList = [];
let cartId = localStorage.getItem('cartId');

const cartElement = document.getElementById('cartList');
const cartBtn = document.getElementById('cartBtn');

(async ()=> {
    getAllProducts();
    if(cartId) {
        getAllCart()
    }
})()

async function getAllProducts() {
    const response = await fetch('/api/products')
    productList = await response.json();

    const tableElement = document.getElementById('productTable')
    if(productList.length) {
        tableElement.innerHTML = ''
        let tableTemplate = ''
        productList.forEach(item => {
            tableTemplate += `
            <tr>
                <th scope="row">${item.id}</th>
                <td>
                    <img src="${item.thumbnail}" style="height: 50px; width: 50px" class="img-thumbnail">
                </td>
                <td>${item.name}</td>
                <td>${item.price}$</td>
                <td class="col-2">
                    <div class="d-flex">
                        <button class="btn btn-secondary me-2" onclick="showDetail(${item.id})"><i class="fa fa-info"></i></button>
                        <button class="btn btn-dark" onclick="addToCart(${item.id})"><i class="fa fa-cart-plus"></i></button>
                    </div>
                </td>
            </tr>
            `
        });
        tableElement.innerHTML = tableTemplate                  
    } else {
        tableElement.innerHTML = '<tr> <td colspan="5" class="text-center"> No hay elementos</td> </tr>'
    }
}

async function showDetail(id) {
    const response = await fetch('/api/products/' + id)
    product = await response.json();
    if(product.id) {
        Swal.fire({
            title: `<strong>${product.name}</strong>`,
            imageUrl: product.thumbnail,
            imageWidth: 300,
            imageHeight: 300,
            html:
              `<p>${product.description}</p>
              <p>Preco: ${product.price}$ <br>
              ${product.stock} elementos en stock</p>`,
            showCloseButton: true,
            showCancelButton: false,
            confirmButtonText:
              'Añadir al Carrito',
        })
    }
}

async function getAllCart(){
    const response = await fetch('/api/cart/'+cartId)
    const cartList = await response.json();
    if(cartList?.length) {
        cartElement.innerHTML = ''
        cartList.forEach(product=> {
            displayCartItem(product)
        })
        cartBtn.innerHTML = `
            <button id="flushBtn" class="btn btn-sm btn-dark mt-3" onclick="flushCart()">Vaciar Carrito</button>
        `
    }
}

async function addToCart(id) {
    const product = productList.find(item=> item.id === id)
    if(!cartId) {
        const response = await fetch('/api/cart',{
            method: 'POST',
            body: JSON.stringify({
               id
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        })
        newCart = await response.json();
        if(newCart.id) {
            cartBtn.innerHTML = `
                <button id="flushBtn" class="btn btn-sm btn-dark mt-3" onclick="flushCart()" >Vaciar Carrito</button>
            `
            cartId = newCart.id
            cartElement.innerHTML = ''
        }
    } else {
        const response = await fetch('/api/cart/'+cartId+'/products',{
            method: 'POST',
            body: JSON.stringify({
               id
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        })
        newCart = await response.json();
    }
    if(newCart.id) {
        localStorage.setItem('cartId', newCart.id);
        displayCartItem(product)
        Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: product.name + ' añadido al carrito',
            showConfirmButton: false,
            timer: 3000
        });
    } else {
        Swal.fire({
            position: 'top-end',
            title: 'Error!',
            text: 'No se pudo añadir el producto',
            icon: 'error',
            showConfirmButton: false,
            timer: 3000
        })
    }
}

function displayCartItem(data) {
    let cartList = cartElement.innerHTML;
    cartList += `<li class="list-group-item">${data.name} <i class="float-end fa fa-trash text-danger ms-4" onclick="removeFromCart(${data.id})"></i></li>`
    cartElement.innerHTML = cartList
}

function removeFromCart(productId) {
    const product = productList.find(item=> item.id === productId)

    Swal.fire({
        title: 'Seguro que deseas eliminar '+product.name+' de lista de compras?',
        showCancelButton: true,
        confirmButtonText: 'Eliminar',
    }).then(async (result) => {
        if (result.isConfirmed) {
        
            const response = await fetch('/api/cart/'+cartId+'/products/'+productId, {
                method: 'DELETE'
            })
            edition = await response.json();

            if(edition?.id) {        
                if(edition.msg === 'Deleted') {
                    Swal.fire({
                        position: 'top-end',
                        icon: 'success',
                        title: 'Lista de compras vaciada',
                        showConfirmButton: false,
                        timer: 3000
                    })
                    cartElement.innerHTML = '<li class="list-group-item">Aun no hay elementos</li>';
                    cartBtn.innerHTML = ``
                    localStorage.removeItem('cartId');
                    cartId = null
                } else {
                    getAllCart();
                    Swal.fire({
                        position: 'top-end',
                        icon: 'success',
                        title: 'Producto eliminado',
                        showConfirmButton: false,
                        timer: 3000
                    });
                }


            } else {
                Swal.fire({
                    position: 'top-end',
                    title: 'Error!',
                    text: 'No se pudo eliminar el producto',
                    icon: 'error',
                    showConfirmButton: false,
                    timer: 3000
                })
            }
        }
    })
}

function flushCart() {

    Swal.fire({
        title: 'Seguro que deseas vaciar la lista de compras?',
        showCancelButton: true,
        confirmButtonText: 'Vaciar',
    }).then(async (result) => {
        if (result.isConfirmed) {
            
            const response = await fetch('/api/cart/'+cartId, {
                method: 'DELETE'
            })
            edition = await response.json();

            if(edition?.id) {        
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: 'Lista de compras vaciada',
                    showConfirmButton: false,
                    timer: 3000
                })
                cartElement.innerHTML = '<li class="list-group-item">Aun no hay elementos</li>';
                cartBtn.innerHTML = ``
                localStorage.removeItem('cartId');
                cartId = null

            } else {
                Swal.fire({
                    position: 'top-end',
                    title: 'Error!',
                    text: 'No se pudo vaciar el carrito',
                    icon: 'error',
                    showConfirmButton: false,
                    timer: 3000
                })
            }
        }
    })
    
    
}


