import { useCallback } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {toggleSidebarMenu} from "@app/features/ui/uiSlice";
import UserDropdown from "@app/modules/main/header/user-dropdown/UserDropdown";

const Header = () => {
  const dispatch = useDispatch();
  const navbarVariant = useSelector((state) => state.ui.navbarVariant);
  const headerBorder = useSelector((state) => state.ui.headerBorder);

  const handleToggleMenuSidebar = () => {
    dispatch(toggleSidebarMenu());
  };

  const getContainerClasses = useCallback(() => {
    let classes = `main-header navbar navbar-expand ${navbarVariant}`;
    if (headerBorder) {
      classes = `${classes} border-bottom-0`;
    }
    return classes;
  }, [navbarVariant, headerBorder]);

  return (
    <nav className={getContainerClasses()}>
      <ul className="navbar-nav">
        <li className="nav-item">
          <button
            onClick={handleToggleMenuSidebar}
            type="button"
            className="nav-link"
          >
            <i className="fas fa-bars" />
          </button>
        </li>
        <li className="nav-item d-none d-sm-inline-block">
          <Link to="/" className="nav-link">
            Home
          </Link>
        </li>
        <li className="nav-item d-none d-sm-inline-block">
          <Link to="/" className="nav-link">
            Contact
          </Link>
        </li>
      </ul>
      <ul className="navbar-nav ml-auto">
        <UserDropdown />
      </ul>
    </nav>
  );
};

export default Header;
