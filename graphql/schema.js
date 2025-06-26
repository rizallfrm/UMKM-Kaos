import { gql } from "apollo-server-micro";

export const typeDefs = gql`
  type Review {
    id: ID!
    productId: ID!
    userId: ID!
    userName: String!
    rating: Int! 
    comment: String!
    createdAt: String!
    userAvatar: String
  }

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
    averageRating: Float
    reviewCount: Int
    reviews: [Review!]!
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
    products(
      limit: Int
      orderBy: String
      orderDirection: String
      search: String
    ): [Product!]!
    product(id: ID!): Product
    featuredProducts(limit: Int = 4): [Product!]!
    users: [User!]!
    user(id: ID!): User
    me: User
    getProductReviews(productId: ID!): [Review!]!
    productCount: Int!
    userCount: Int!
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
    addProductReview(productId: ID!, rating: Int!, comment: String!): Review!
    login(email: String!, password: String!): AuthPayload!
    register(email: String!, name: String!, password: String!): AuthPayload!
    forgotPassword(email: String!): Boolean
    resetPassword(token: String!, newPassword: String!): Boolean
  }

  type Subscription {
    productCreated: Product!
    productUpdated: Product!
    productDeleted: ID!
    userCreated: User!
    userUpdated: User!
    userDeleted: ID!
  }
`;


