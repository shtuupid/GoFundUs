import React, { useEffect } from 'react';
import CharityItem from '../CharityItem';
import { useStoreContext } from '../../utils/GlobalState';
import { UPDATE_CHARITIES } from '../../utils/actions';
import { useQuery } from '@apollo/client';
import { QUERY_CHARITIES } from '../../utils/queries';
import { idbPromise } from '../../utils/helpers';
import spinner from '../../assets/spinner.gif';

function CharityList() {
    const [state, dispatch] = useStoreContext();

    const { currentCategory } = state;

    const { loading, data } = useQuery(QUERY_CHARITIES);

    useEffect(() => {
        if (data) {
            dispatch({
                type: UPDATE_CHARITIES,
                charities: data.charities,
            });
            data.charities.forEach((charity) => {
                idbPromise('charities', 'put', charity);
            });
        } else if (!loading) {
            idbPromise('charities', 'get').then((charity) => {
            dispatch({
                type: UPDATE_CHARITIES,
                charity: charities,
            });
        });
    }
}, [data, loading, dispatch]);

    function filterCharities() {
        if (!currentCategory) {
            return state.products;
        }
        
        return state.products.filter(
            (charity) => charity.category._id === currentCategory
            );
        }

    return (
        <div className="my-2">
            <h2>Our Charities:</h2>
            {state.charities.length ? (
            <div className="flex-row">
            {filterProducts().map((charity) => (
                <CharityItem
                    key={charity._id}
                    _id={charity._id}
                    image={charity.image}
                    name={charity.name}
                    price={charity.price}
                    quantity={charity.quantity}
                />
            ))}
            </div>
            ) : (
                <h3>You haven't supported any charities yet!</h3>
            )}
        </div>
    );
}

export default ProductList;
