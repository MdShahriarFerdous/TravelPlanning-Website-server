import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import StyledDropdown from "@modules/main/header/user-dropdown/StyledDropdown";
import StyledSmallUserImage from "@modules/main/header/user-dropdown/StyledSmallUserImage";
import StyledBigUserImage from "@modules/main/header/user-dropdown/StyledBigUserImage";
import UserHeader from "@modules/main/header/user-dropdown/UserHeader";
import UserFooter from "@modules/main/header/user-dropdown/UserFooter";
import { logout } from "@app/features/auth/authSlice";

const UserDropdown = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const logOutBtn = async (event) => {
    event.preventDefault();
    setDropdownOpen(false);
    localStorage.removeItem("userToken");
    dispatch(logout())
  };

  const navigateToProfile = (event) => {
    event.preventDefault();
    setDropdownOpen(false);
    navigate("/dashboard");
  };

  return (
    <StyledDropdown isOpen={dropdownOpen} hideArrow>
      <StyledSmallUserImage
        slot="button"
        src={"/img/default-profile.png"}
        fallbackSrc="/img/default-profile.png"
        alt="User"
        width={25}
        height={25}
        rounded
      />
      <div slot="menu">
        <UserHeader className=" bg-primary">
          <StyledBigUserImage
            src={"/img/default-profile.png"}
            fallbackSrc="/img/default-profile.png"
            alt="User"
            width={90}
            height={90}
            rounded
          />
          <p>
            admin@example.com
            <small>
              <span>Member since </span>
              <span> 23 June 1995 </span>
            </small>
          </p>
        </UserHeader>
        <UserFooter>
          <button
            type="button"
            className="btn btn-default btn-flat"
            onClick={navigateToProfile}
          >
            Profile
          </button>
          <button
            type="button"
            className="btn btn-default btn-flat float-right"
            onClick={logOutBtn}
          >
            Sign Out
          </button>
        </UserFooter>
      </div>
    </StyledDropdown>
  );
};

export default UserDropdown;