<<<<<<< HEAD
import React, { useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { useStoreContext } from '../../utils/GlobalState';
import {
  UPDATE_CATEGORIES,
  UPDATE_CURRENT_CATEGORY,
} from '../../utils/actions';
import { QUERY_CATEGORIES } from '../../utils/queries';
import { idbPromise } from '../../utils/helpers';

function CategoryMenu() {
  const [state, dispatch] = useStoreContext();

  const { categories } = state;

  const { loading, data: categoryData } = useQuery(QUERY_CATEGORIES);

  useEffect(() => {
    if (categoryData) {
      dispatch({
        type: UPDATE_CATEGORIES,
        categories: categoryData.categories,
      });
      categoryData.categories.forEach((category) => {
        idbPromise('categories', 'put', category);
      });
    } else if (!loading) {
      idbPromise('categories', 'get').then((categories) => {
        dispatch({
          type: UPDATE_CATEGORIES,
          categories: categories,
        });
      });
    }
  }, [categoryData, loading, dispatch]);

  const handleClick = (id) => {
    dispatch({
      type: UPDATE_CURRENT_CATEGORY,
      currentCategory: id,
    });
  };

  return (
    <div>
      <h2>Choose a Category:</h2>
      {categories.map((item) => (
        <button
          key={item._id}
          onClick={() => {
            handleClick(item._id);
          }}
        >
          {item.name}
        </button>
      ))}
    </div>
  );
}

export default CategoryMenu;
=======
export function pluralize(name, count) {
    if (count === 1) {
        return name;
    }
    return name + 's';
}

export function idbPromise(storeName, method, object) {
    return new Promise((resolve, reject) => {
        const request = window.indexedDB.open('gofundus', 1);
        let db, tx, store;
        request.onupgradeneeded = function(e) {
            const db = request.result;
            db.createObjectStore('charities', { keyPath: '_id' });
            db.createObjectStore('categories', { keyPath: '_id' });
            db.createObjectStore('cart', { keyPath: '_id' });
        };
        
        request.onerror = function(e) {
            console.log('There was an error');
        };

        request.onsuccess = function(e) {
            db = request.result;
            tx = db.transaction(storeName, 'readwrite');
            store = tx.objectStore(storeName);
            db.onerror = function(e) {
                console.log('error', e);
            };
            switch (method) {
                case 'put':
                store.put(object);
                resolve(object);
                break;
                case 'get':
                const all = store.getAll();
                all.onsuccess = function() {
                    resolve(all.result);
                };
                break;
                case 'delete':
                store.delete(object._id);
                break;
                default:
                console.log('No valid method');
                break;
            }
            
            tx.oncomplete = function() {
                db.close();
            };
        };
    });
}
>>>>>>> bd48fc4296c52600e5eeb20602bcadf27aa631be
