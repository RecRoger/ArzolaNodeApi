// import { FileManager } from "../db/fileManager.js";
import { productsCollection } from '../models/products.model.js'


/** IMPLEMENTACION VIEJA CON Files 
 * 
 export class ProductData {
     constructor(name, description, price, stock, thumbnail) {
         this.name = name;
         this.description = description;
         this.price = price;
         this.stock = stock;
         this.thumbnail = thumbnail;
         this.timestamp = Date.now()
     }
 }
 const defaultProducts = [
     new ProductData("Ropa deportiva","Combos de ropa deportiva de excelente calidad",2500,150,"https://cdn-icons-png.flaticon.com/128/7367/7367400.png"),
     new ProductData("Tablas de surf","Tablas de todas las medidas para surfistas amateurs y profecionales",3500,80,"https://cdn-icons-png.flaticon.com/128/7992/7992707.png"),
     new ProductData("Articulos de caceria","Todo lo necesario para la practica de caceria deportiva",2300,180,"https://cdn-icons-png.flaticon.com/128/7993/7993795.png"),
     new ProductData("Set de tenis","Raqueta de tenis profesional con set de pelotas",1650,230,"https://cdn-icons-png.flaticon.com/128/625/625322.png"),
     new ProductData("Set de baseball","Bate de baseball con guante y bate de madera.",1250,130,"https://cdn-icons-png.flaticon.com/128/7998/7998823.png"),
     new ProductData("Calsado deportivo","Calsado deportivo, especializados para corredores",650,200,"https://cdn-icons-png.flaticon.com/128/933/933635.png"),
     new ProductData("Productos de musculacion","Mejora tu dieta y gana masa muscular con nutritivos productos de musculacion",300,220,"https://cdn-icons-png.flaticon.com/128/639/639284.png"),
     new ProductData("Mancuernas","Pesas de diferentes pesos para trabajar musculacion",180,300,"https://cdn-icons-png.flaticon.com/128/882/882150.png"),
     new ProductData("Pelotas y balones","Set de pelotas de diferenmtes deportes a eleccion (futball, bascket, rugby)",460,350,"https://cdn-icons-png.flaticon.com/128/857/857492.png"),
     new ProductData("Indumentaria submarina","Todo lo necesario para emprender una incursion subacuatica (gafas y snorkel)",380,150,"https://cdn-icons-png.flaticon.com/128/7999/7999560.png"),
     new ProductData("Mat de Yoga","Esterilla de poliuretano para la practica de ejercicios en suelo",1100,250,"https://cdn-icons-png.flaticon.com/128/3048/3048342.png"),
 ].map((prod, index) => ({id: (index + 1).toString(), ...prod}))
 export const productFile = new FileManager('products', defaultProducts);
*/


export const GetAllProducts = async (req, res) => {
    console.log('> Consultar todos los elemento')
    try {

        // const insert = await productsCollection.insertMany(defaultProducts)

        let items = await productsCollection.find({}, { 
            id: 1,
            name: 1,
            price: 1,
            thumbnail: 1,
        });
        return res.status(200).json(items)
        
        // let items = await productFile.getAll();
        // return res.status(200).json(items.map(item=> ({
        //     id: item.id, name: item.name, price: item.price, thumbnail: item.thumbnail
        // })))


    } catch (e){
        return res.status(400).json({msg: 'ERROR', error: e})
        // throw e
    }
}
export const GetOneProduct =  async (req, res) => {
    const id = Number(req.params.id)
    console.log('> Consultar elemento get', id)

    try {
        let items = await productsCollection.find({id: id}, { 
            _v: 0,
        });
        return res.status(200).json(items[0])

    } catch (e) {
        return res.status(200).json({error: "No Item", e})
    }

    // let item = await productFile.getById(id);
    // return res.status(200).json(item || {error: "No Item"})
}

export const UpdateProduct = async (req, res) => {
    const id = Number(req.params.id)
    const data = req.body
    console.log('> Actualizar elemento', id, data)
    
    try {
        let edition = await productsCollection.updateOne({id: id}, { 
            $set: data
        });
        if (edition.acknowledged) {
            let items = await productsCollection.find({id: id}, { 
                _v: 0,
            });
            return res.status(200).json(items[0])
        }
        return res.status(200).json({error: "No Item"})

    } catch (e) {
        return res.status(200).json({error: "No Item", e})
    }


    // let item = await productFile.update(id, data);
    // return res.status(200).json(item)
}
export const DeleteProduct = async (req, res) => {
    const id = Number(req.params.id)
    console.log('> Eliminar elemento', id)
    try {
        // let edition = await productFile.deleteById(id);

        let edition = await productsCollection.deleteOne({id: id});
        
        return res.status(200).json((edition.acknowledged && {id, msg: 'Deleted'}) || {'error': 'no delete'})
    } catch (err) {
        return res.status(404).json({'error': err})
    }
}
export const CreateProduct =  async (req, res) => {
    const data = req.body
    console.log('> Añadir elemento', data.name)
    
    if(!data?.name) {
        return res.status(400).json({error: "No Item"})
    }

    try {
        // let edition = await productFile.deleteById(id);
        const id = await productsCollection.count()
        let newId = await productsCollection.insertMany([{id: (id +1).toString() , ...data, timestamp: new Date()}]);
        
        // let newId = await productFile.save(data);
        return res.status(200).json(newId[0] || {error: "No Item"})
        
        // let newId = await productFile.save(data);
        // return res.status(200).json(newId && {id: newId, ...data} || {error: "No Item"})
    } catch (err) {
        return res.status(404).json({'error': err})
    }
}