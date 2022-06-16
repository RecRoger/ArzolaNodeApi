import * as fs from 'fs';

export class FileManager {
    constructor(fileName, defaultContent) {
        this.fileName = fileName;
        try {
            fs.readFileSync(`./${this.fileName}.txt`, 'utf-8');
            console.log(`>> El archivo ${this.fileName}.txt ya existe`);
        } catch (err) {
            fs.writeFileSync(`./${this.fileName}.txt`, JSON.stringify(defaultContent) || '');
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
            return {id: id, ...obj}
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
