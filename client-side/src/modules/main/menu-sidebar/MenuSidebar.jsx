import { useSelector } from "react-redux";
import MenuItem from "@components/menu-item/MenuItem";
import { Link } from "react-router-dom";
import Menu from "@modules/main/menu-sidebar/Menu";
import Brand from "@modules/main/menu-sidebar/Brand";
import UserImage from "@modules/main/menu-sidebar/UserImage";

const MenuSidebar = () => {
  const sidebarSkin = useSelector((state) => state.ui.sidebarSkin);
  const menuItemFlat = useSelector((state) => state.ui.menuItemFlat);
  const menuChildIndent = useSelector((state) => state.ui.menuChildIndent);
  return (
    <aside className={`main-sidebar elevation-4 ${sidebarSkin}`}>
      <Link to="/" className="brand-link">
        <Brand
          src="/img/logo.jpg"
          alt="AdminLTE Logo"
          width={33}
          height={33}
          rounded
        />
        <span className="brand-text font-weight-light">{ import.meta.env.VITE_PROJECT_NAME } Admin</span>
      </Link>
      <div className="sidebar">
        <nav className="mt-2" style={{ overflowY: "hidden" }}>
          <ul
            className={`nav nav-pills nav-sidebar flex-column${
              menuItemFlat ? " nav-flat" : ""
            }${menuChildIndent ? " nav-child-indent" : ""}`}
            role="menu"
          >
            {Menu.map((menuItem) => (
              <MenuItem
                key={menuItem.name + menuItem.path}
                menuItem={menuItem}
              />
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default MenuSidebar;
