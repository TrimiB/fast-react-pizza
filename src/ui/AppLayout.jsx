import Header from './Header';
import Loading from './Loading';
import CartOverview from '../features/cart/CartOverview';
import { Outlet, useNavigation } from 'react-router-dom';

function AppLayout() {
  const navigation = useNavigation();
  const isloading = navigation.state === 'loading';

  return (
    <div className='layout'>
      {isloading && <Loading />}

      <Header />

      <main>
        <Outlet />
      </main>

      <CartOverview />
    </div>
  );
}

export default AppLayout;
