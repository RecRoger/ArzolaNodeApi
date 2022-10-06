import axios from 'axios'

const mainUrl = 'https://coderhouse-roger-node.herokuapp.com'

axios.defaults.baseUrl = mainUrl

export class ApiTests {

  time = new Date()
  
  tryGet = async (url) => {
    try {
      const {status, data} = await axios(`${mainUrl}/api/products${url}`)
      return {status, data}
    }catch (e) {
      throw e
    }
  }
  
  tryPost = async (url, datos) => {
    try {
      const {status, data} = await axios.post(`${mainUrl}/api/products${url}`, datos)
      return {status, data}
    }catch (e) {
      throw e
    }
  }
  
  tryDelete = async (url) => {
    try {
      const {status, data} = await axios.delete(`${mainUrl}/api/products${url}`)
      return {status, data}
    }catch (e) {
      throw e
    }
  }


  async getAll() {
    try {
      const list = await this.tryGet('/')
      return list
    } catch (err) {
      return null
    }
  }

  async getOne(id) {
    try {
      return await this.tryGet('/'+id)
    } catch (err) {
      return null
    }
  }

  async createOne(data) {
    try {
      return await this.tryPost(`/`,data)
    } catch (err) {
      return null
    }
  }

  async updateOne(data) {
    try {
      return await this.tryPost(`/${data.id}`,data)
    } catch (err) {
      return null
    }
  }

  async deleteOne(id) {
    try {
      return await this.tryDelete(`/${id}`)
    } catch (err) {
      return null
    }
  }
}
