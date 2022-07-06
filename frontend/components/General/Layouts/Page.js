import React from "react";
import ContainerLayout from "./Container";
import Header from "components/General/Header";
import { Footer } from "grommet";

const PageLayout = ({ children }) => {
  return (
    <div>
      <Header />
      <ContainerLayout>{children}</ContainerLayout>
      <Footer background="brand">One two</Footer>
    </div>
  );
};

export default PageLayout;
