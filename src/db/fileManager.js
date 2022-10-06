import * as fs from 'fs';
import { logger } from '../commons/logger.js'

export class FileManager {
    constructor(fileName, defaultContent) {
        this.fileName = fileName;
        try {
            fs.readFileSync(`./src/db/${this.fileName}.txt`, 'utf-8');
            logger.info(`>> El archivo ${this.fileName}.txt ya existe`);
        } catch (err) {
            fs.writeFileSync(`./src/db/${this.fileName}.txt`, JSON.stringify(defaultContent) || '');
            logger.warn(`>> El archivo ${this.fileName}.txt fue creado correctamente`);
        }
    }
    
    async save(obj) {
        try {
            const data = await this.getAll();
            let id = data.length ? Number(data[data.length - 1].id) : 0;
            id++;
            data.push({id: id, ...obj});
            await fs.promises.writeFile(`./db/${this.fileName}.txt`, JSON.stringify(data))
            logger.info('> Nuevo elemento creado con el id ', id);
            return {id: id, ...obj}
        } catch (err) {
            logger.error('> No se ha podido crear el elemento');
            return null;
        }
    }

    async getAll() {
        try {
            const file = await fs.promises.readFile(`./db/${this.fileName}.txt`, 'utf-8');
            const data = JSON.parse(file);
            return data;
        }catch (err) {
            logger.error('> No se ha podido leer el archivo');
            throw err;
        }
    }

    async getById(id) {
        if(!id) {
            logger.warn('> id invalido: ', id);
            return null
        }
        try {
            const data = await this.getAll();
            const product = data.find(obj => obj.id === id);
            logger.info('> Con el id ', id, ' tenemos ', product)  
            return product;
        }catch (err) {
            logger.error('> No se ha podido leer el archivo', err);
            return null;
        }
    }

    async update(id, obj) {
        if(!id && id != 0) {
            logger.warn('> id invalido: ', id);
            return null
        }
        try {
            const products = await this.getAll();
            const product = products.find(obj => obj.id === id);
            logger.info('> Con el id ', id, ' tenemos ', product) 

            for(let key of Object.keys(obj)) {
                if(key != 'id')
                product[key] = obj[key]
            }
            await fs.promises.writeFile(`./db/${this.fileName}.txt`, JSON.stringify(products))
            return product;
        }catch (err) {
            logger.warn('> No se ha podido leer el archivo', err);
            return null;
        }
    }

    async deleteById(id) {
        if(!id){ 
            logger.warn('> Id invalido.');
            return null;
        }
        try {
            const data = await this.getAll();
            const newData = data.filter(obj => obj.id !== id);
            logger.info('> Eliminamos el elemento de id ', id);
            await fs.writeFileSync(`./db/${this.fileName}.txt`, JSON.stringify(newData));
            logger.info('> Elemento eliminado');
            return true
        }catch (err) {
            logger.error('> No se ha podido eliminar el elemento', err);
            return false
        }
    }
    
    async deleteAll() {
        try {
            logger.info('> Vaciamos la lista');
            await fs.writeFileSync(`./db/${this.fileName}.txt`, '[]');
            logger.info(`> Datos en el archivo ${this.fileName}.txt borrados exitosamente`);
        } catch (err) {
            logger.error(`> No se ha podido eliminar el contenido del archivo ${this.fileName}.txt`);
        }
    }
}
