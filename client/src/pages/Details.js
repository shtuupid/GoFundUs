import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";

import Cart from "../components/Cart";
import { useStoreContext } from "../utils/GlobalState";
import {
  REMOVE_FROM_CART,
  UPDATE_CART_QUANTITY,
  ADD_TO_CART,
  UPDATE_CHARITIES,
} from "../utils/actions";
import { QUERY_CHARITIES } from "../utils/queries";
import { idbPromise } from "../utils/helpers";

function Detail() {
  const [state, dispatch] = useStoreContext();
  const { id } = useParams();

  const [currentCharity, setCurrentCharity] = useState({});

  const { loading, data } = useQuery(QUERY_CHARITIES);

  const { charities, cart } = state;

  useEffect(() => {
    // already in global store
    if (charities.length) {
      setCurrentProduct(charities.find((charity) => charity._id === id));
    }
    // retrieved from server
    else if (data) {
      dispatch({
        type: UPDATE_CHARITIES,
        charities: data.charities,
      });

      data.charities.forEach((charity) => {
        idbPromise("charities", "put", charity);
      });
    }
    // get cache from idb
    else if (!loading) {
      idbPromise("charities", "get").then((indexedCharities) => {
        dispatch({
          type: UPDATE_CHARITIES,
          charities: indexedCharities,
        });
      });
    }
  }, [charities, data, loading, dispatch, id]);

  const addToCart = () => {
    const itemInCart = cart.find((cartItem) => cartItem._id === id);
    if (itemInCart) {
      dispatch({
        type: UPDATE_CART_QUANTITY,
        _id: id,
        purchaseQuantity: parseInt(itemInCart.purchaseQuantity) + 1,
      });
      idbPromise("cart", "put", {
        ...itemInCart,
        purchaseQuantity: parseInt(itemInCart.purchaseQuantity) + 1,
      });
    } else {
      dispatch({
        type: ADD_TO_CART,
        charity: { ...currentCharity, purchaseQuantity: 1 },
      });
      idbPromise("cart", "put", { ...currentCharity, purchaseQuantity: 1 });
    }
  };

  const removeFromCart = () => {
    dispatch({
      type: REMOVE_FROM_CART,
      _id: currentCharity._id,
    });

    idbPromise("cart", "delete", { ...currentCharity });
  };

  return (
    <>
      {currentCharity && cart ? (
        <div className="container my-1">
          <Link to="/">← Back to Charity page</Link>

          <h2>{currentCharity.name}</h2>

          <p>{currentCharity.description}</p>

          <p>
            <strong>Price:</strong>${currentCharity.price}{" "}
            <button onClick={addToCart}>Add to Cart</button>
            <button
              disabled={!cart.find((p) => p._id === currentCharity._id)}
              onClick={removeFromCart}
            >
              Remove from Cart
            </button>
          </p>

          <img
            src={`/images/${currentCharity.image}`}
            alt={currentCharity.name}
          />
        </div>
      ) : null}
      {loading ? <img src={spinner} alt="loading" /> : null}
      <Cart />
    </>
  );
}

export default Detail;
