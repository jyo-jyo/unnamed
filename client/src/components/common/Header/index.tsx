import React from "react";
import { HeaderContainer } from "@components/common/Header/Header.style";
const Header = ({ children }: { children: JSX.Element }) => {
  return <HeaderContainer>{children}</HeaderContainer>;
};

export default Header;
