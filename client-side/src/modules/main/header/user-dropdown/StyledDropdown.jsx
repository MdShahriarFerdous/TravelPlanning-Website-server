import styled from "styled-components";
import { PfDropdown } from "@profabric/react-components";
const StyledDropdown = styled(PfDropdown)`
  border: none;
  width: 3rem;
  justify-content: center;
  align-items: center;
  --pf-dropdown-menu-min-width: 280px;

  .dropdown-item {
    padding: 0.5rem 1rem;
  }

  .text-sm {
    margin-bottom: 0;
  }
  .dropdown-divider {
    margin: 0;
  }
`;

export default StyledDropdown;
