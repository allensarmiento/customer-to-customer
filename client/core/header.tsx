import Link from 'next/link';
import { APP_TITLE } from '../config/app';
import { ClientRoutes } from '../config/routes';

const userLinks = (currentUser) => {
  return [
    !currentUser && { label: 'Sign In', href: `${ClientRoutes.auth}/signin` },
    !currentUser && { label: 'Sign Up', href: `${ClientRoutes.auth}/signup` },

    currentUser && { label: 'Sell', href: `${ClientRoutes.items}/new` },
    currentUser && { label: 'My Orders', href: ClientRoutes.orders },
    currentUser && { label: 'Sign Out', href: `${ClientRoutes.auth}/signout` },
  ];
};

const Header = ({ currentUser }) => {
  const links = userLinks(currentUser)
    .filter((linkConfig) => linkConfig)
    .map(({ label, href }) => {
      return (
        <li key={href} className="nav-item">
          <Link href={href}>
            <a className="nav-link">{label}</a>
          </Link>
        </li>
      );
    });

  return (
    <nav className="navbar navbar-light bg-light">
      <Link href={ClientRoutes.home}>{APP_TITLE}</Link>
      <div className="d-flex justify-content-end">
        <ul className="nav d-flex align-items-center">
          {links}
        </ul>
      </div>
    </nav>
  );
};

export default Header;
