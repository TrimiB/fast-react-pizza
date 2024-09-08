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
  const formErrors = useActionData();
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const {
    userName,
    status: addressStatus,
    position,
    address,
    error: errorAddress,
  } = useSelector((state) => state.user);
  const isLoadingAddress = addressStatus === 'loading';

  const isSubmitting = navigation.state === 'submitting';

  const cart = useSelector(getCart);
  const totalCartprice = useSelector(getTotalCartPrice);
  const priorityPrice = withPriority ? totalCartprice * 0.2 : 0;
  const totalPrice = totalCartprice + priorityPrice;

  if (!cart.length) return <EmptyCart />;

  return (
    <div className='px-4 py-6'>
      <h2 className='mb-8 text-xl font-semibold'>
        Ready to order? Let&apos;s go!
      </h2>

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

        <div className='relative mb-5 flex flex-col gap-2 sm:flex-row sm:items-center'>
          <label className='sm:basis-40'>Address</label>
          <div className='grow'>
            <input
              className='input w-full'
              type='text'
              name='address'
              disabled={isLoadingAddress}
              defaultValue={address}
              required
            />
            {addressStatus === 'error' && (
              <p className='mt-2 rounded-md bg-red-100 p-3 text-xs text-red-700'>
                {errorAddress}
              </p>
            )}
          </div>
          {!position.latitude && !position.longitude && (
            <span className='sm: absolute right-0 top-8 z-50 sm:top-[-5px] md:right-[6px] md:top-[5px]'>
              <Button
                disabled={isLoadingAddress}
                type='small'
                onClick={(e) => {
                  e.preventDefault();
                  dispatch(fetchAddress());
                }}>
                get my location
              </Button>
            </span>
          )}
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
          <input
            type='hidden'
            name='position'
            value={
              position.longitude && position.latitude
                ? `${position.latitude},${position.longitude}`
                : ''
            }
          />

          <Button type='primary' disabled={isSubmitting || isLoadingAddress}>
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
 * Action function for creating a new order.
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
