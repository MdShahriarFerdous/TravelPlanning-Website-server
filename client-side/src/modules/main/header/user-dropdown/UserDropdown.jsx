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
    dispatch(logout());
  };

  const navigateToProfile = (event) => {
    event.preventDefault();
    setDropdownOpen(false);
    navigate("/dashboard");
  };

  const { email, username } = useSelector((state) => state.auth.userInfo);

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
            {username}
            <small>
              <span>{email}</span>
            </small>
          </p>
        </UserHeader>
        <UserFooter>
          <p className="text-center">
            <button
              type="button"
              className="btn btn-default btn-flat"
              onClick={logOutBtn}
            >
              Sign Out
            </button>
          </p>
        </UserFooter>
      </div>
    </StyledDropdown>
  );
};

export default UserDropdown;
