import {PfDropdown} from '@profabric/react-components';
import styled from 'styled-components';
const StyledDropdown = styled(PfDropdown)`
  border: none;
  width: 100%;
  display: flex;
  padding: 0;
  justify-content: center;
  align-items: center;
  --pf-dropdown-menu-min-width: 14.625rem;
  --pf-dropdown-border: none;
  --pf-dropdown-menu-margin-top: 0px;

  .menu {
    background-color: #454d55;
  }

  .dropdown-item {
    padding: 0.5rem 1rem;
  }

  .nothing-found {
    color: #c2c7d0;
    padding: 0.25rem 0.5rem;
  }

  .list-group {
    .list-group-item {
      padding: 0.5rem 0.75rem;
      cursor: pointer;
    }

    .search-path {
      font-size: 80%;
      color: #adb5bd;
    }
  }
`;

export default StyledDropdown;