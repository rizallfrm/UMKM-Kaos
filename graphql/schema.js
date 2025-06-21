import { gql } from 'apollo-server-micro';

export const typeDefs = gql`
  type Product {
    id: ID!
    name: String!
    description: String!
    price: Float!
    imageUrl: String!
    sizes: [String!]!
    colors: [String!]!
    createdAt: String!
  }

  type User {
    id: ID!
    email: String!
    name: String!
    role: String!
  }

  type Query {
    products: [Product!]!
    product(id: ID!): Product
    users: [User!]!
  }

  type Mutation {
    createProduct(
      name: String!
      description: String!
      price: Float!
      imageUrl: String!
      sizes: [String!]!
      colors: [String!]!
    ): Product!
    updateProduct(
      id: ID!
      name: String
      description: String
      price: Float
      imageUrl: String
      sizes: [String]
      colors: [String]
    ): Product!
    deleteProduct(id: ID!): Boolean
  }
`;