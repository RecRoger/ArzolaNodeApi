import { buildSchema } from 'graphql'
import { graphqlHTTP } from 'express-graphql'

import {
  getAllProducts,
  getOneProduct,
  updateProduct,
  deleteProduct,
  createProduct,
} from '../controllers/products.graphql.controller.js'

const schema = buildSchema(`
  input ProductInput {
    name: String
    description: String
    price: Int
    stock: Int
    thumbnail: String
  }
  type Product {
    id: String
    name: String
    description: String
    price: Int
    stock: Int
    thumbnail: String
    timestamp: String
  }
  type Query {
    getAllProducts: [Product]
    getOneProduct(id: ID!): Product
  }
  type Mutation {
    createProduct(data: ProductInput!): Product
    updateProduct(id: ID!, data: ProductInput!): Product
    deleteProduct(id: ID!): Product
  }
`)

export const graphqlMiddleware = graphqlHTTP({
  schema: schema,
  rootValue: {
    getAllProducts,
    getOneProduct,
    createProduct,
    updateProduct,
    deleteProduct,
  },
  graphiql: true,
})