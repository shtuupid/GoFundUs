import { gql } from '@apollo/client';

export const QUERY_CHARITIES = gql`
    query getCharities($category: ID) {
        charities(category: $category) {
            _id
            name
            description
            price
            quantity
            image
            category {
            _id
            }
        }
    } 
`;

export const QUERY_CHECKOUT = gql`
    query getCheckout($charities: [ID]!) {
        checkout(charities: $charities) {
            session
        }
    }
`;

export const QUERY_ALL_CHARITIES = gql`
    {
        charities {
            _id
            name
            description
            price
            quantity
            category {
            name
            }
        }
    }
`;

export const QUERY_CATEGORIES = gql`
    {
        categories {
            _id
            name
        }
    }
`;

export const QUERY_USER = gql`
    {
        user {
            firstName
            lastName
            orders {
                _id
                purchaseDate
                charities {
                    _id
                    name
                    description
                    price
                    quantity
                    image
                }
            }
        }
    }
`;
