import * as fs from 'fs';

export class FileManager {
    constructor(fileName) {
        this.fileName = fileName;
        try {
            fs.readFileSync(`./${this.fileName}.txt`, 'utf-8');
            console.log(`>> El archivo ${this.fileName}.txt ya existe`);
        } catch (err) {
            const defaultProducts = [
                new ProductData ('Pelotas', 350, 'https://upload.wikimedia.org/wikipedia/commons/4/48/Basketball.jpeg'),
                new ProductData ('Malla de Volleyball', 530.75, 'https://us.123rf.com/450wm/npaveln/npaveln1603/npaveln160300021/53521768-volley-ball-illustration-net-.jpg'),
                new ProductData ('Baston de Jockey', 245, 'https://m.media-amazon.com/images/I/317KUxBbizL.jpg'),
                new ProductData ('Raqueta de Tenis', 280.50, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1h3bJLhziWwoFVIKOC3K_YS4h7xdWSlSgY_-poGlM3JkvushXW_snhiYcJ7K1LPHWZLc&usqp=CAU'),
                new ProductData ('Tabla de surf', 725, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7WkgTCIfOybKveA2-S5tgVEK2f4RqqjbUqoHNR8UeGuzPxu6WG8VlIrdMDq__NaTuWbo&usqp=CAU')
            ].map((prod, index) => ({id: index+1, ...prod}))
            fs.writeFileSync(`./${this.fileName}.txt`, JSON.stringify(defaultProducts));
            console.log(`>> El archivo ${this.fileName}.txt fue creado correctamente`);
        }
    }
    
    async save(obj) {
        try {
            const data = await this.getAll();
            let id = data.length ? Number(data[data.length - 1].id) : 1;
            id++;
            data.push({id: id, ...obj});
            await fs.promises.writeFile(`./${this.fileName}.txt`, JSON.stringify(data))
            console.log('> Nuevo elemento creado con el id ', id);
            return id
        } catch (err) {
            console.log('> No se ha podido crear el elemento');
            return null;
        }
    }

    async getAll() {
        try {
            const file = await fs.promises.readFile(`./${this.fileName}.txt`, 'utf-8');
            const data = JSON.parse(file);
            return data;
        }catch (err) {
            console.log('> No se ha podido leer el archivo');
            throw err;
        }
    }

    async getById(id) {
        if(!id) {
            console.log('> id invalido: ', id);
            return null
        }
        try {
            const data = await this.getAll();
            const product = data.find(obj => obj.id === id);
            console.log('> Con el id ', id, ' tenemos ', product)  
            return product;
        }catch (err) {
            console.log('> No se ha podido leer el archivo', err);
            return null;
        }
    }

    async update(id, obj) {
        if(!id && id != 0) {
            console.log('> id invalido: ', id);
            return null
        }
        try {
            const products = await this.getAll();
            const product = products.find(obj => obj.id === id);
            console.log('> Con el id ', id, ' tenemos ', product) 

            for(let key of Object.keys(obj)) {
                if(key != 'id')
                product[key] = obj[key]
            }
            await fs.promises.writeFile(`./${this.fileName}.txt`, JSON.stringify(products))
            return product;
        }catch (err) {
            console.log('> No se ha podido leer el archivo', err);
            return null;
        }
    }

    async deleteById(id) {
        if(!id){ 
            console.log('> Id invalido.');
            return null;
        }
        try {
            const data = await this.getAll();
            const newData = data.filter(obj => obj.id !== id);
            console.log('> Eliminamos el elemento de id ', id);
            await fs.writeFileSync(`./${this.fileName}.txt`, JSON.stringify(newData));
            console.log('> Elemento eliminado');
        }catch (err) {
            console.log('> No se ha podido eliminar el elemento', err);
        }
    }
    
    async deleteAll() {
        try {
            console.log('> Vaciamos la lista');
            await fs.writeFileSync(`./${this.fileName}.txt`, '[]');
            console.log(`> Datos en el archivo ${this.fileName}.txt borrados exitosamente`);
        } catch (err) {
            console.log(`> No se ha podido eliminar el contenido del archivo ${this.fileName}.txt`);
        }
    }
}

export class ProductData {
    constructor(title, price, thumbnail) {
        this.title = title;
        this.price = price;
        this.thumbnail = thumbnail;
    }
}
