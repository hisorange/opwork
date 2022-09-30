import React from "react";
import { RecoilRoot } from "recoil";
import IndexPage from "../pages/index.page";

export default function RootComponent() {
  return (
    <RecoilRoot>
      <IndexPage />
    </RecoilRoot>
  );
}
