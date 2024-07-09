import { Link } from 'react-router-dom';
import SearchOrder from '../features/order/searchOrder';

function Header() {
  return (
    <header>
      <Link to='/'>Fast React Fizza Co.</Link>
      <SearchOrder />
      <p>Kurt</p>
    </header>
  );
}

export default Header;
