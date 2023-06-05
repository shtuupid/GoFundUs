import React, { createContext, useContext } from "react";
import { useCharityReducer } from './reducers'

const StoreContext = createContext();
const { Provider } = StoreContext;

export const StoreProvider = ({ value = [], ...props }) => {
    const [state, dispatch] = useCharityReducer({
        charities: [],
        cart: [],
        cartOpen: false,
        categories: [],
        currentCategory: '',
    });

    return <Provider value={[state, dispatch]} {...props} />;
};

export const useStoreContext = () => {
    return useContext(StoreContext);
};

