import React from "react";
import { HeaderContainer } from "./Header.style";
const Header = ({ children }: { children: JSX.Element }) => {
  return <HeaderContainer>{children}</HeaderContainer>;
};

export default Header;
