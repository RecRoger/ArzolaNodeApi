import { strict as assert } from 'assert'
import { ApiTests } from './testClass.js';

describe("Api Product Tests", () => {
 
  let test;
  
  beforeEach(() => {
    test = new ApiTests()
    console.log(test.time)
  });

  it('#Should list products ', async () => {
    const resp = await test.getAll() 
    assert.equal(resp.data.length, 11)
  })

  it('#Should get One ', async () => {
    const resp = await test.getOne('4') 
    assert.equal(resp.data.name, 'Set de tenis')
    assert.equal(resp.data.price, 1650)
  })

  it('#Should create one ', async () => {
    const newItem = {
      "name": "Nuevo",
      "description": "Producto",
      "price": 150,
      "stock": "10",
      "thumbnail": "https://cdn-icons-png.flaticon.com/512/1524/1524539.png"
    }
    const resp = await test.createOne(newItem) 
    assert.equal(resp.data.name, 'Nuevo')
    assert.equal(resp.data.price, 150)
  })

  it('#Should update one ', async () => {
    const updatedItem = {
      "id": 12,
      "name": "Viejo",
      "description": "Producto editado",
      "price": "125",
        "stock": "9",
        "thumbnail": "https://cdn-icons-png.flaticon.com/512/1524/1524539.png"
      }
    const resp = await test.updateOne(updatedItem) 
    assert.equal(resp.data.name, 'Viejo')
    assert.equal(resp.data.price, 125)
  })

  it('#Should delete one', async () => {
    const resp = await test.deleteOne(12)
    assert.equal(resp.data.id, 12)
    assert.equal(resp.data.msg, 'Deleted')
  })

})