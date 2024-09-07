/* eslint-disable react-refresh/only-export-components */
import Button from '../../ui/Button';
import EmptyCart from '../cart/EmptyCart';
import { formatCurrency } from '../../utilities/helpers';
import { createOrder } from '../../services/apiRestaurant';
import { clearCart, getCart, getTotalCartPrice } from '../cart/cartSlice';
import { Form, redirect, useActionData, useNavigation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import store from '../../store';
import { useState } from 'react';
import { fetchAddress } from '../user/userSlice';

// https://uibakery.io/regex-library/phone-number
const isValidPhone = (str) =>
  /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(
    str,
  );

function CreateOrder() {
  const [withPriority, setWithPriority] = useState(false);
  const userName = useSelector((state) => state.user.userName);
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';

  const formErrors = useActionData();

  const cart = useSelector(getCart);
  const totalCartprice = useSelector(getTotalCartPrice);
  const priorityPrice = withPriority ? totalCartprice * 0.2 : 0;
  const totalPrice = totalCartprice + priorityPrice;
  const dispatch = useDispatch();

  if (!cart.length) return <EmptyCart />;

  return (
    <div className='px-4 py-6'>
      <h2 className='mb-8 text-xl font-semibold'>Ready to order? Let's go!</h2>

      <button onClick={() => dispatch(fetchAddress())}>get my location</button>

      {/* <Form method='POST' action='/order/new'> */}
      <Form method='POST'>
        <div className='mb-5 flex flex-col gap-2 sm:flex-row sm:items-center'>
          <label className='sm:basis-40'>First Name</label>
          <input
            className='input grow'
            type='text'
            name='customer'
            required
            defaultValue={userName}
          />
        </div>

        <div className='mb-5 flex flex-col gap-2 sm:flex-row sm:items-center'>
          <label className='sm:basis-40'>Phone number</label>
          <div className='grow'>
            <input className='input w-full' type='tel' name='phone' required />
            {formErrors?.phone && (
              <p className='mt-2 w-96 rounded-md bg-red-100 p-3 text-xs text-red-700'>
                {formErrors.phone}
              </p>
            )}
          </div>
        </div>

        <div className='mb-5 flex flex-col gap-2 sm:flex-row sm:items-center'>
          <label className='sm:basis-40'>Address</label>
          <div className='grow'>
            <input
              className='input w-full'
              type='text'
              name='address'
              required
            />
          </div>
        </div>

        <div className='mb-5 flex items-center gap-5'>
          <input
            className='h-6 w-6 accent-yellow-400 focus:outline-none focus:ring focus:ring-yellow-500 focus:ring-opacity-50 focus:ring-offset-2'
            type='checkbox'
            name='priority'
            id='priority'
            value={withPriority}
            onChange={(e) => setWithPriority(e.target.checked)}
          />
          <label htmlFor='priority' className='font-medium'>
            Please piroritise my order (20% increase).
          </label>
        </div>

        <div>
          <input type='hidden' name='cart' value={JSON.stringify(cart)} />

          <Button type='primary' disabled={isSubmitting}>
            {isSubmitting
              ? 'Placing Order...'
              : `Order now for ${formatCurrency(totalPrice)}`}
          </Button>
        </div>
      </Form>
    </div>
  );
}

/**
 * Handles the creation of a new order.
 *
 * @param {Object} request - The request object containing the form data.
 * @returns {Promise<Object>} - The created order object, or an object containing validation errors.
 */
export async function createOrderAction({ request }) {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  const order = {
    ...data,
    cart: JSON.parse(data.cart),
    priority: data.priority === 'true',
  };

  const errors = {};

  if (!isValidPhone(order.phone))
    errors.phone =
      'This does not look like a valid phone number. Pleas enter your real phone number.';
  if (Object.keys(errors).length > 0) return errors;

  // If everything is okay, create new order and redirect
  const newOrder = await createOrder(order);

  store.dispatch(clearCart());

  // 3. On success, redirect to /order/${id}
  return redirect(`/order/${newOrder.id}`);
  // return 'Hello';
}

export default CreateOrder;
