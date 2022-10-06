import axios from 'axios'

const mainUrl = 'https://coderhouse-roger-node.herokuapp.com'
axios.defaults.baseUrl = mainUrl

async function tryGet(url) {
  try {
    const {status, data} = await axios(`${mainUrl}/api/products${url}`)
    return {status, data}
  }catch (e) {
    throw e
  }
}

async function tryPost(url, datos) {
  try {
    const {status, data} = await axios.post(`${mainUrl}/api/products${url}`, datos)
    return {status, data}
  }catch (e) {
    throw e
  }
}

async function tryDelete(url) {
  try {
    const {status, data} = await axios.delete(`${mainUrl}/api/products${url}`)
    return {status, data}
  }catch (e) {
    throw e
  }
}

console.log('>> Bienvenido al cliente de pruebas de la Api Productos de Coderhouse-Roger-Api')
console.log('>> Se realizarán peticiones con Axios rapidamente al CRUD de Productos')
console.log('-----------')

console.log('-- START --')
console.log('-----------')
console.log("> GET to 'api/products/', GetAllProducts", await tryGet('/'))
console.log("> GET to 'api/products/:id' con id: 1, GetOneProduct", await tryGet('/1'))

const post = await tryPost('/',{
  "name": "Nuevo",
  "description": "Producto",
  "price": "150",
  "stock": "10",
  "thumbnail": "https://cdn-icons-png.flaticon.com/512/1524/1524539.png"
})
console.log("> POST to 'api/products/', CreateProduct", post)
const update = await tryPost(`/${post.data.id}`,{
  "id": post.data.id,
  "name": "Viejo",
  "description": "Producto editado",
  "price": "125",
    "stock": "9",
    "thumbnail": "https://cdn-icons-png.flaticon.com/512/1524/1524539.png"
  })
console.log(`> POST to 'api/products/:id' con id:${post.data.id}, UpdateProduct`, update)

console.log(`> DELETE to 'api/products/:id' con id: ${post.data.id}, DeleteProduct `, await tryDelete(`/${post.data.id}`))

console.log('-----------')

console.log('--- END ---')
console.log('-----------')


