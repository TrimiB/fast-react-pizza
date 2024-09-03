import { useDispatch, useSelector } from 'react-redux';
import Button from '../../ui/Button';
import { formatCurrency } from '../../utilities/helpers';
import { addItem, getCart, getCurrentQuantityById } from '../cart/cartSlice';
import DeleteItem from '../cart/DeleteItem';
import UpdateItemQuantity from '../cart/UpdateItemQuantity';

function MenuItem({ pizza }) {
  const dispatch = useDispatch();

  const { id, name, unitPrice, ingredients, soldOut, imageUrl } = pizza;
  const cart = useSelector(getCart);
  const isInCart = cart.some((item) => item.pizzaId === id);

  const currentQuantity = useSelector(getCurrentQuantityById(id));

  function handleAddToCart() {
    if (soldOut) return;

    /**
     * Checks if the current pizza is already in the cart, and if so, increases the quantity of the existing item instead of adding a new one.
     */
    // if (cart.some((item) => item.pizzaId === id))
    //   return dispatch(increaseItemQuantity(id));

    /**
     * Creates a new item object with the specified properties and adds it to the cart.
     *
     * @param {string} name - The name of the pizza item.
     * @param {string} id - The unique identifier of the pizza item.
     * @param {number} unitPrice - The price of the pizza item.
     * @returns {void}
     */
    const newItem = {
      name,
      pizzaId: id,
      quantity: 1,
      unitPrice,
      totalPrice: unitPrice * 1,
    };
    dispatch(addItem(newItem));
  }

  return (
    <li className='flex gap-4 py-2'>
      <img
        src={imageUrl}
        alt={name}
        className={`h-24 ${soldOut ? 'opacity-70 grayscale' : ''}`}
      />
      <div className='flex grow flex-col py-0.5'>
        <p className='font-medium'>{name}</p>
        <p className='text-sm capitalize italic text-stone-500'>
          {ingredients.join(', ')}
        </p>
        <div className='mt-auto flex items-center justify-between'>
          {!soldOut ? (
            <p className='text-sm'>{formatCurrency(unitPrice)}</p>
          ) : (
            <p className='text-sm font-medium uppercase text-stone-500'>
              Sold out
            </p>
          )}

          {isInCart && (
            <div className='flex items-center gap-3 sm:gap-8'>
              <UpdateItemQuantity
                pizzaId={id}
                currentQuantity={currentQuantity}
              />{' '}
              <DeleteItem pizzaId={id} />{' '}
            </div>
          )}

          {!soldOut && !isInCart && (
            <Button type='small' onClick={handleAddToCart}>
              Add to Cart
            </Button>
          )}
        </div>
      </div>
    </li>
  );
}

export default MenuItem;
