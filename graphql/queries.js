import { gql } from "@apollo/client";

export const GET_PRODUCTS = gql`
  query GetProducts {
    products {
      id
      name
      description
      price
      imageUrl
      sizes
      colors
    }
  }
`;

export const GET_PRODUCT = gql`
  query GetProduct($id: ID!) {
    product(id: $id) {
      id
      name
      description
      price
      imageUrl
      sizes
      colors
      averageRating
      reviewCount
      reviews {
        id
        userName
        rating
        comment
        createdAt
      }
    }
  }
`;
export const CREATE_PRODUCT = gql`
  mutation CreateProduct(
    $name: String!
    $description: String!
    $price: Float!
    $imageUrl: String!
    $sizes: [String!]!
    $colors: [String!]!
  ) {
    createProduct(
      name: $name
      description: $description
      price: $price
      imageUrl: $imageUrl
      sizes: $sizes
      colors: $colors
    ) {
      id
      name
    }
  }
`;

export const UPDATE_PRODUCT = gql`
  mutation UpdateProduct(
    $id: ID!
    $name: String
    $description: String
    $price: Float
    $imageUrl: String
    $sizes: [String]
    $colors: [String]
  ) {
    updateProduct(
      id: $id
      name: $name
      description: $description
      price: $price
      imageUrl: $imageUrl
      sizes: $sizes
      colors: $colors
    ) {
      id
      name
    }
  }
`;

export const DELETE_PRODUCT = gql`
  mutation DeleteProduct($id: ID!) {
    deleteProduct(id: $id)
  }
`;

export const GET_USERS = gql`
  query GetUsers {
    users {
      id
      name
      email
      role
    }
  }
`;

export const UPDATE_USER = gql`
  mutation UpdateUser($id: ID!, $name: String, $email: String, $role: String) {
    updateUser(id: $id, name: $name, email: $email, role: $role) {
      id
      name
      email
      role
    }
  }
`;

export const DELETE_USER = gql`
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id)
  }
`;

export const GET_FEATURED_PRODUCTS = gql`
  query GetFeaturedProducts(
    $limit: Int
    $orderBy: String
    $orderDirection: String
  ) {
    products(
      limit: $limit
      orderBy: $orderBy
      orderDirection: $orderDirection
    ) {
      id
      name
      description
      price
      imageUrl
    }
  }
`;

export const GET_PRODUCT_REVIEWS = gql`
  query GetProductReviews($productId: ID!) {
    getProductReviews(productId: $productId) {
      id
      userId
      userName
      rating
      comment
      createdAt
      userAvatar
    }
  }
`;

export const ADD_PRODUCT_REVIEW = gql`
  mutation AddProductReview($productId: ID!, $rating: Int!, $comment: String!) {
    addProductReview(
      productId: $productId
      rating: $rating
      comment: $comment
    ) {
      id
      userId
      userName
      rating
      comment
      createdAt
    }
  }
`;
