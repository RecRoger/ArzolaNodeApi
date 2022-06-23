(async ()=> {
    await getAllProducts()
})()

let productList = [];

const nameInput = document.getElementById('name');
const descriptionInput = document.getElementById('description');
const priceInput = document.getElementById('price');
const stockInput = document.getElementById('stock');
const thumbnailInput = document.getElementById('thumbnail');

const formTitleElement = document.getElementById('form-title');
const formButtonElement = document.getElementById('form-button');

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
                        <button class="btn btn-secondary me-2" onclick="setEdition(${item.id})"><i class="fa fa-edit"></i></button>
                        <button class="btn btn-dark" onclick="deleteElement(${item.id})"><i class="fa fa-trash"></i></button>
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

async function createNew() {
    if( nameInput.value &&
        descriptionInput.value &&
        priceInput.value &&
        stockInput.value &&
        thumbnailInput.value) {
            const response = await fetch('/api/products',{
                method: 'POST',
                body: JSON.stringify({
                    name: nameInput.value,
                    description: descriptionInput.value,
                    price: priceInput.value,
                    stock: stockInput.value,
                    thumbnail: thumbnailInput.value,
                }),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                },
            })
            edition = await response.json();

            if(edition?.id) {        
                unsetEdition();
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: 'Producto creado correctamente',
                    showConfirmButton: false,
                    timer: 3000
                });
                getAllProducts();

            } else {
                Swal.fire({
                    position: 'top-end',
                    title: 'Error!',
                    text: 'No se pudo crear el producto',
                    icon: 'error',
                    showConfirmButton: false,
                    timer: 3000
                })
            }
        }
}

function deleteElement(id) {
    
    const product = productList.find(item=> item.id === id)
    Swal.fire({
        title: 'Seguro que deseas eliminar ' + product.name,
        showCancelButton: true,
        confirmButtonText: 'Eliminar',
    }).then(async (result) => {
        if (result.isConfirmed) {
            
            const response = await fetch('/api/products/'+id, {
                method: 'DELETE'
            })
            edition = await response.json();

            if(edition?.id) {        
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: 'Producto eliminado',
                    showConfirmButton: false,
                    timer: 3000
                })
                getAllProducts()
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

async function setEdition(id) {
    const response = await fetch('/api/products/' + id)
    product = await response.json();
    if(product.id) {
        formTitleElement.innerHTML = 'Editar Producto <i class="fa fa-times float-end" onclick="unsetEdition()"></i>'
        formButtonElement.innerHTML = '<button type="button" class="btn btn-dark mt-3" onclick="editProduct('+id+')">Confirmar Edicion</button>'

        nameInput.value = product.name;
        descriptionInput.value = product.description;
        priceInput.value = product.price;
        stockInput.value = product.stock;
        thumbnailInput.value = product.thumbnail;
    }
}

function unsetEdition() {
    nameInput.value = null;
    descriptionInput.value = null;
    priceInput.value = null;
    stockInput.value = null;
    thumbnailInput.value = null;

    formTitleElement.innerText = 'Nuevo Producto'
    formButtonElement.innerHTML = '<button type="button" class="btn btn-dark mt-3" onclick="createNew()">Crear nuevo producto</button>'
}

async function editProduct(id) {
    if( nameInput.value &&
        descriptionInput.value &&
        priceInput.value &&
        stockInput.value &&
        thumbnailInput.value) {
            const response = await fetch('/api/products/'+id,{
                method: 'POST',
                body: JSON.stringify({
                    id: id,
                    name: nameInput.value,
                    description: descriptionInput.value,
                    price: priceInput.value,
                    stock: stockInput.value,
                    thumbnail: thumbnailInput.value,
                }),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                },
            })
            edition = await response.json();

            if(edition?.id) {        
                unsetEdition();
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: 'Producto editado correctamente',
                    showConfirmButton: false,
                    timer: 3000
                });
                getAllProducts();
            } else {
                Swal.fire({
                    position: 'top-end',
                    title: 'Error!',
                    text: 'No se pudo editar el producto',
                    icon: 'error',
                    showConfirmButton: false,
                    timer: 3000
                })
            }
        }
}

