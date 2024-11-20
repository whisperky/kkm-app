"use client";

import React, { useContext, useMemo } from "react";
import Slider from "react-slick";
import {
  ImageStarRiseIcon,
  ImageStarVerifiedIcon,
} from "@/src/_components/icons";
import { GeneralContext } from "@/src/app/general-context";
import FreeogDialog from "../free-og-nft-dialog/dialog";
import ClaimNFTDialog from "../free-og-nft-dialog/claim-nft-dialog";
import useActions from "@/src/_hooks/useAction";

export default function NFTSection() {
  const { completionStatus } = useContext(GeneralContext);
  const { saveAction } = useActions();
  const count = useMemo(
    () =>
      completionStatus?.bonuses?.filter(
        (one) =>
          one?.status === "active" &&
          [
            "follow_twitter",
            "telegram_community",
            "invite_3_friends",
          ]?.includes(one?.bonusName)
      )?.length || 0,
    [completionStatus?.bonuses]
  );
  const claimedNft = useMemo(() => Number(count) || 0, [count]);

  const freeOGNFTSlide = (
    <div key="freeOGNFT" className="px-4">
      <div className="w-full border-2 border-[#5F3F5733] bg-[rgba(233,_194,_161,_1)] text-golden-brown rounded-2xl contain-content font-semibold">
        <div className="p-3 pb-2">
          <div className="flex gap-2 items-center justify-between">
            <div className="flex items-center pb-1">
              <ImageStarRiseIcon className="translate-y-1" />
              <div>Free OG NFT Challenge</div>
            </div>
            <span>{claimedNft}/3</span>
          </div>
          <div className="bg-gradient-to-b from-golden-brown to-[#886670] h-fit w-full p-[.07rem] rounded-full contain-content mt-1">
            <div className="h-3 w-full rounded-full contain-content bg-[#A98A87] shadow-[inset_0_3px_1px_#0003]">
              <div
                className="h-full bg-gradient-to-b from-purple from-[55%] to-[80%] to-[#9381F2] z-10 shadow-[3px_0_1px_#0003]"
                style={{
                  width: `${claimedNft < 3 ? (claimedNft / 3) * 100 : 100}%`,
                }}
              />
            </div>
          </div>
        </div>
        <FreeogDialog>
          <button
            className="bg-golden-brown text-white text-sm w-full p-1 px-4"
            onClick={() => saveAction("home_ogNFT_seeMore_click")}
          >
            See More
          </button>
        </FreeogDialog>
      </div>
    </div>
  );

  return (
    <ClaimNFTDialog>
      {({ claimable, setOpenModal }) => {
        const secondSlide = (
          <div key="claimNFT" className="px-4">
            <div className="w-full border-2 border-[#5F3F5733] flex flex-col justify-between bg-[rgba(233,_194,_161,_1)] text-golden-brown rounded-2xl contain-content font-semibold">
              <div className="px-2 py-1">
                <div className="flex gap-2 items-center justify-between">
                  <div className="flex items-center pb-1">
                    <ImageStarVerifiedIcon />
                    <div className="leading-[0.75rem] ml-1 pt-3">
                      Claim your
                      <br />
                      <b className="text-lg">Free Welcome NFT!</b>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setOpenModal?.(true);
                  saveAction("home_welcomeNFT_claimNow_click");
                }}
                className="bg-[#20AA58] shadow-[0_0.15rem] shadow-[#2C7C4C] text-white w-full p-2 px-4"
              >
                Claim Now!
              </button>
            </div>
          </div>
        );
        const slides = [
          freeOGNFTSlide,
          ...(claimable && claimedNft >= 3 ? [secondSlide] : []),
        ];

        const settings = {
          dots: true,
          infinite: slides.length > 1,
          speed: 800,
          slidesToShow: 1,
          slidesToScroll: 1,
          touchThreshold: 10,
          autoplay: true,
          arrows: false,
          appendDots: (dots: React.ReactNode[]) => (
            <div
              style={{
                position: "relative",
                top: "-5px",
              }}
            >
              <ul
                style={{
                  margin: "0px",
                  padding: "0px",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                {dots.map((dot, index) => (
                  <li
                    key={index}
                    style={{
                      margin: 0,
                    }}
                  >
                    {dot}
                  </li>
                ))}
              </ul>
            </div>
          ),
        };

        return <Slider {...settings}>{slides}</Slider>;
      }}
    </ClaimNFTDialog>
  );
}
