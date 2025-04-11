import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuGroup,
  MenuDivider,
  Button,
  Avatar,
  Text,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import React, { useEffect } from "react";
import { GrLogout } from "react-icons/gr";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loadUser } from "../../redux/AuthReducer/action.js"; // Updated import
import { ShowCoupon } from "../Coupon/ShowCoupon";
import { CgProfile } from "react-icons/cg";
import { MdOutlineFavoriteBorder } from "react-icons/md";
import { BsCartCheck } from "react-icons/bs";
import { RiCoupon3Line } from "react-icons/ri";
import { getLocalData } from "../../utils/localStorage";

const Profile = ({ colorMode }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth); // Updated state access
  const userId = getLocalData("userId");

  useEffect(() => {
    if (userId && (!user || user?.userId !== userId)) {
      dispatch(loadUser(userId));
    }
  }, [dispatch, userId, user]);

  const logoutHandler = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userInfo");
    navigate("/");
    window.location.reload();
  };

  return (
    <div>
      <Menu>
        <MenuButton
          p="0"
          borderRadius="50%"
          bg="none"
          color="black"
          as={Button}
          colorScheme="none"
          rightIcon={<ChevronDownIcon ml="-15px" fontSize="20px" />}
        >
          <Avatar
            size="sm"
            name={user?.name || ""}
            src={user?.description || ""}
          />
          <Text
            fontSize="xs"
            color={colorMode === "dark" ? "white" : "black"}
          >
            {user?.name || ""}
          </Text>
        </MenuButton>
        <MenuList>
          <MenuGroup>
            <MenuItem fontWeight="bold">{user?.name || ""}</MenuItem>
            <MenuDivider />
            {user ? (
              <MenuItem onClick={() => navigate("/account")}>
                <Avatar
                  size="xs"
                  name={user?.name || ""}
                  src={user?.description || ""}
                />
                <Text fontSize="sm">{user?.email || ""}</Text>
              </MenuItem>
            ) : (
              <MenuItem onClick={() => navigate("/account")}>
                <CgProfile /> My Account
              </MenuItem>
            )}
            <MenuItem>
              <RiCoupon3Line />
              <ShowCoupon />
            </MenuItem>
            <MenuItem onClick={() => navigate("/wishlist")}>
              <MdOutlineFavoriteBorder color="red" />
              Wishlist
            </MenuItem>
            <MenuItem onClick={() => navigate("/cart")}>
              <BsCartCheck color="blue" />
              Cart
            </MenuItem>
            <MenuItem onClick={logoutHandler}>
              <GrLogout />
              Logout
            </MenuItem>
          </MenuGroup>
        </MenuList>
      </Menu>
    </div>
  );
};

export default Profile;