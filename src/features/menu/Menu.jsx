import { getMenu } from '../../services/apiRestaurant';
import { useLoaderData } from 'react-router-dom';
import MenuItem from './MenuItem';

function Menu() {
  const menu = useLoaderData();
  // console.log(menu);
  return (
    <ul className='divide-y divide-stone-200 px-2'>
      {menu.map((pizza) => {
        return <MenuItem pizza={pizza} key={pizza.id} />;
      })}
    </ul>
  );
}

/**
 * A Loader that asynchronously retrieves the menu data from the API and returns it.
 * @returns {Promise<any>} The menu data from the API.
 */
export async function menuLoader() {
  const menu = await getMenu();
  return menu;
}

export default Menu;
