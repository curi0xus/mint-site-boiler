import React from "react";
import Link from "next/link";
import { Header as GrommetHeader, Text, Anchor } from "grommet";

const Header = () => {
  return (
    <GrommetHeader background="brand">
      <Link href={"/"}>
        {/* <Text>Home</Text> */}
        <Anchor>Home</Anchor>
      </Link>
      <Link href={"/about"}>
        {/* <Text>About</Text> */}
        <Anchor>About</Anchor>
      </Link>
      <Link href={"/mint"}>
        {/* <Text>Mint</Text> */}
        <Anchor>Mint</Anchor>
      </Link>
    </GrommetHeader>
  );
};

export default Header;
