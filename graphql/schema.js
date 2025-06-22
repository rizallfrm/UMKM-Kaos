import { gql } from "apollo-server-micro";

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
    updatedAt: String!
  }

  type User {
    id: ID!
    email: String!
    name: String!
    role: String!
    createdAt: String!
    updatedAt: String!
    lastLogin: String
    isActive: Boolean!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
    # Product Queries
    products(
      limit: Int
      orderBy: String
      orderDirection: String
      search: String
    ): [Product!]!
    product(id: ID!): Product
    featuredProducts(limit: Int = 4): [Product!]!

    # User Queries
    users: [User!]!
    user(id: ID!): User
    me: User

    # Analytics
    productCount: Int!
    userCount: Int!
  }

  type Mutation {
    # Product Mutations
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

    # User Mutations
    createUser(
      email: String!
      name: String!
      role: String = "user"
      password: String!
    ): User!
    updateUser(
      id: ID!
      email: String
      name: String
      role: String
      isActive: Boolean
    ): User!
    deleteUser(id: ID!): Boolean
    changePassword(currentPassword: String!, newPassword: String!): Boolean

    # Auth Mutations
    login(email: String!, password: String!): AuthPayload!
    register(email: String!, name: String!, password: String!): AuthPayload!
    forgotPassword(email: String!): Boolean
    resetPassword(token: String!, newPassword: String!): Boolean
  }

  type Subscription {
    # Real-time updates
    productCreated: Product!
    productUpdated: Product!
    productDeleted: ID!
    userCreated: User!
    userUpdated: User!
    userDeleted: ID!
  }
`;
