import React from "react";
import CheckBoxContainer from "../../_components/check-container";
import FinalScoreDialog from "../../_components/final-score-dialog";
import Banner from "../../_components/client-banner";

export default function page() {
  //   const gameResults = {
  //     playerOne: {
  //       name: "PLAYER NAME",
  //       score: 90,
  //     },
  //     playerTwo: {
  //       name: "OPPONENTE",
  //       score: 11,
  //     },
  //     winner: "me" as "me" | "opponent",
  //   };
  return (
    <div>
      <main className="h-dvh flex flex-col bg-center last-of-type:[&>*]:flex-grow">
        <div className="fixed container-blured z-30 h-fit inset-0 top-0">
          <Banner />
        </div>
        <FinalScoreDialog />
        <CheckBoxContainer />
      </main>
    </div>
  );
}
