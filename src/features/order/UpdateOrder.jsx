import { useFetcher } from 'react-router-dom';
import Button from '../../ui/Button';
import { updateOrder } from '../../services/apiRestaurant';

function UpdateOrder() {
  const fetcher = useFetcher();

  return (
    <fetcher.Form method='PATCH' className='text-right'>
      <Button type='primary'>Make priority</Button>
    </fetcher.Form>
  );
}

export default UpdateOrder;

/**
 * Action function for updating an order.
 * Updates an order by setting its priority to true.
 *
 * @param {Object} params - The parameters for the update operation.
 * @param {string} params.orderId - The ID of the order to update.
 * @returns {Promise<null>} - A promise that resolves to null when the update is complete.
 */
export async function action({ request, params }) {
  const data = { priority: true };
  await updateOrder(params.orderId, data);
  return null;
}
