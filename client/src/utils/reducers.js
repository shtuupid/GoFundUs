import { useReducer } from 'react';
import {
    UPDATE_CHARITIES,
    ADD_TO_CART,
    UPDATE_CART_QUANTITY,
    REMOVE_FROM_CART,
    ADD_MULTIPLE_TO_CART,
    UPDATE_CATEGORIES,
    UPDATE_CURRENT_CATEGORY,
    CLEAR_CART,
    TOGGLE_CART,
    } from './actions';

export const reducer = (state, action) => {
    switch (action.type) {
        case UPDATE_CHARITIES:
        return {
            ...state,
            charities: [...action.charities],
        };
        case ADD_TO_CART:
            return {
            ...state,
            cartOpen: true,
            cart: [...state.cart, action.charity],
        };

        case ADD_MULTIPLE_TO_CART:
        return {
            ...state,
            cart: [...state.cart, ...action.charities],
        };


        case UPDATE_CART_QUANTITY:
            return {
                ...state,
                cartOpen: true,
                cart: state.cart.map((charity) => {
                    if (action._id === charity._id) {
                        charity.purchaseQuantity = action.purchaseQuantity;
                    }
                    return charity;
                    }),
            };

        case REMOVE_FROM_CART:
        let newState = state.cart.filter((charity) => {
            return charity._id !== action._id;
        });
        return {
            ...state,
            cartOpen: newState.length > 0,
            cart: newState,
        };

        case CLEAR_CART:
        return {
            ...state,
            cartOpen: false,
            cart: [],
        };

        case TOGGLE_CART:
        return {
            ...state,
            cartOpen: !state.cartOpen,
        };

        case UPDATE_CATEGORIES:
        return {
            ...state,
            categories: [...action.categories],
        };

        case UPDATE_CURRENT_CATEGORY:
        return {
            ...state,
            currentCategory: action.currentCategory,
        };

        default:
        return state;
    }
};

export function useCharityReducer(initialState) {
    return useReducer(reducer, initialState);
}
