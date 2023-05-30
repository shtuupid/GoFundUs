const { gql } = require('apollo-server-express');

const typeDefs = gql`
    type Category {
        _id: ID
        name: String
    }

    type Charity {
        _id: ID
        name: String
        description: String
        image: String
        quantity: Int
        price: Float
        category: Category
    }

    type Order {
        _id: ID
        purchaseDate: String
        charities: [Charity]
    }

    type User {
        _id: ID
        firstName: String
        lastName: String
        email: String
        orders: [Order]
    }

    type Checkout {
        session: ID
    }

    type Auth {
        token: ID
        user: User
    }

    type Query {
        categories: [Category]
        charities(category: ID, name: String): [Charity]
        charity(_id: ID!): Charity
        user: User
        order(_id: ID!): Order
        checkout(charities: [ID]!): Checkout
    }

    type Mutation {
        addUser(firstName: String!, lastName: String!, email: String!, password: String!): Auth
        addOrder(charities: [ID]!): Order
        updateUser(firstName: String, lastName: String, email: String, password: String): User
        updateCharity(_id: ID!, quantity: Int!): Charity
        login(email: String!, password: String!): Auth
    }
    `;

module.exports = typeDefs;
