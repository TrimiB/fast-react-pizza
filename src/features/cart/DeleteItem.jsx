import Button from '../../ui/Button';
import { deleteItem } from './cartSlice';
import { useDispatch } from 'react-redux';

function DeleteItem({ pizzaId }) {
  const dispatch = useDispatch();
  return (
    <Button type='small' onClick={() => dispatch(deleteItem(pizzaId))}>
      delete
    </Button>
  );
}

export default DeleteItem;
