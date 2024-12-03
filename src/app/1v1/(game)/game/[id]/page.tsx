import React from "react";
import FinalScoreDialog from "../../_components/final-score-dialog";
import Banner from "../../_components/client-banner";
import { BoxContextProvider } from "../../_context/boxContext";
import CheckBoxContainer2 from "../../_components/check-container2";

export default function page() {
  return (
    <div>
      <main className="h-dvh flex flex-col bg-center last-of-type:[&>*]:flex-grow">
        <div className="fixed container-blured z-30 h-fit inset-0 top-0">
          <Banner />
        </div>
        <BoxContextProvider>
          <FinalScoreDialog />
          <CheckBoxContainer2 />
        </BoxContextProvider>
      </main>
    </div>
  );
}
