import {useEffect, useRef, useState} from 'react';
import {NavLink} from 'react-router-dom';
import StyledDropdown from '@components/sidebar-search/StyledDropdown';
import Menu from '@app/modules/main/menu-sidebar/Menu';

export const SidebarSearch = () => {
  const [searchText, setSearchText] = useState('');
  const [foundMenuItems, setFoundMenuItems] = useState([]);
  const dropdown = useRef(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    setFoundMenuItems([]);
    if (searchText) {
      setFoundMenuItems(findMenuItems(Menu));
    } else {
      setSearchText('');
      setFoundMenuItems([]);
    }
  }, [searchText]);

  useEffect(() => {
    if (foundMenuItems && foundMenuItems.length > 0) {
      setIsDropdownOpen(true);
    } else {
      setIsDropdownOpen(false);
    }
  }, [foundMenuItems]);

  const handleIconClick = () => {
    setSearchText('');
    setIsDropdownOpen(false);
  };

  const handleMenuItemClick = () => {
    setSearchText('');
    setIsDropdownOpen(false);
  };

  const findMenuItems = (menu, results = []) => {
    for (const menuItem of menu) {
      if (menuItem.name.includes(searchText) && menuItem.path) {
        results.push(menuItem);
      }
      if (menuItem.children) {
        return findMenuItems(menuItem.children, results);
      }
    }
    return results;
  };

  const boldString = (str, substr) => {
    return str.replaceAll(
      substr,
      `<strong class="text-light">${substr}</strong>`
    );
  };

  return (
    <StyledDropdown
      ref={dropdown}
      isOpen={isDropdownOpen}
      hide-arrow
      openOnButtonClick={false}
    >
      <div slot="button">
        <div className="input-group">
          <input
            className="form-control form-control-sidebar"
            type="text"
            placeholder="Search"
            aria-label="Search"
            value={searchText}
            onInput={(e) => setSearchText((e.target).value)}
          />
          <div className="input-group-append">
            <button
              type="button"
              className="btn btn-sidebar"
              onClick={() => handleIconClick()}
            >
              <i
                className={`fas ${searchText.length === 0 && 'fa-search'} ${
                  searchText.length > 0 && 'fa-times'
                } fa-fw`}
              />
            </button>
          </div>
        </div>
      </div>
      <div className="menu" slot="menu">
        {foundMenuItems && foundMenuItems.length === 0 && (
          <div className="nothing-found">No Element found</div>
        )}
        {foundMenuItems.length > 0 && (
          <div className="list-group">
            {foundMenuItems &&
              foundMenuItems.map((menuItem) => (
                <NavLink
                  key={menuItem.name + menuItem.path}
                  className="list-group-item"
                  to={menuItem.path}
                  onClick={() => handleMenuItemClick()}
                >
                  <div
                    className="search-title"
                    dangerouslySetInnerHTML={{
                      __html: boldString(menuItem.name, searchText)
                    }}
                  />
                  <div className="search-path">{menuItem.name}</div>
                </NavLink>
              ))}
          </div>
        )}
      </div>
    </StyledDropdown>
  );
};
