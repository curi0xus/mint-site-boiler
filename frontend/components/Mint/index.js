import React from "react";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import PageLayout from "../General/Layouts/Page";

const DynamicDapp = dynamic(() => import("./Dapp"), {
  suspense: true,
  ssr: false,
});

const MintPage = () => {
  return (
    <PageLayout>
      <Suspense fallback={`Loading...`}>
        <DynamicDapp />
      </Suspense>
    </PageLayout>
  );
};

export default MintPage;
