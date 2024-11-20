"use client";

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/src/_components/ui/dialog";
import React, { useContext, useEffect, useMemo, useState } from "react";
import ProtectionCard from "./task-card";
import { BoxContent, BoxMain } from "@/src/_components/shared/board-structure";
import moment from "moment";
import { useGetProtections } from "@/services/koko";
import { GeneralContext } from "@/src/app/general-context";
import Slider from "react-slick";
import useScreenHeightRatio from "@/src/_hooks/use-screen-height-ratio";

const tasksPerWeek = [
  [
    { title: "3 Min.", day: 1 },
    { title: "1 Min.", day: 2 },
    { title: "1 Min.", day: 3 },
    { title: "3 Min.", day: 4 },
    { title: "1 Min.", day: 5 },
    { title: "1 Min.", day: 6 },
    { title: "5 Min. Point Protection ", day: 7 },
  ],
  [
    { title: "4 Min.", day: 8 },
    { title: "2 Min.", day: 9 },
    { title: "2 Min.", day: 10 },
    { title: "4 Min.", day: 11 },
    { title: "2 Min.", day: 12 },
    { title: "2 Min.", day: 13 },
    { title: "7 Min.", day: 14 },
  ],
  [
    { title: "6 Min.", day: 15 },
    { title: "3 Min.", day: 16 },
    { title: "3 Min.", day: 17 },
    { title: "6 Min.", day: 18 },
    { title: "3 Min.", day: 19 },
    { title: "3 Min.", day: 20 },
    { title: "9 Min.", day: 21 },
  ],
  [
    { title: "8 Min.", day: 22 },
    { title: "4 Min.", day: 23 },
    { title: "4 Min.", day: 24 },
    { title: "8 Min.", day: 25 },
    { title: "4 Min.", day: 26 },
    { title: "4 Min.", day: 27 },
    { title: "12 Min.", day: 28 },
  ],
];

function getEndOfTheDay() {
  return moment.duration(moment().utc().endOf("day").diff(moment().utc()));
}

export default function ProtectionBoard() {
  const { sessionId } = useContext(GeneralContext);
  const heightRatio = useScreenHeightRatio(762);
  const [open, setOpen] = useState(true);
  const [duration, setDuration] = useState(getEndOfTheDay());
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const hours = useMemo(() => Math.floor(duration.asHours()), [duration]);
  const minutes = useMemo(() => Math.floor(duration.minutes()), [duration]);
  const seconds = useMemo(() => Math.floor(duration.seconds()), [duration]);

  const { data, refetch } = useGetProtections({ sessionId });

  useEffect(() => {
    const timer = setInterval(() => setDuration(getEndOfTheDay()), 1000);
    return () => clearInterval(timer);
  }, []);

  const sliderSettings = {
    dots: false,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    touchThreshold: 10,
    arrows: false,
    afterChange: (index: number) => setActiveSlideIndex(index),
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const currentWeekDisplay = activeSlideIndex + 1;
  return (
    <Dialog open={open} onOpenChange={setOpen} modal={false}>
      <DialogContent
        title={
          <p className="flex flex-col leading-6">
            <small>daily point</small>
            <span>Protection</span>
          </p>
        }
        containerClassName="text-[#5F3F57] text-lg font-[700] h-full flex flex-col"
        topImageClassName="z-10 h-[110px] min-w-42"
        onInteractOutside={(e) => e.preventDefault()}
        tabBarModal={true}
        heightRatio={heightRatio}
      >
        <BoxMain
          className="p-4 pt-6 h-full from-[#ffe3c2] to-[#ffe3c2] rounded-t-3xl"
          hideClose={true}
        >
          <DialogTitle className="text-center pt-5 pb-2 px-2 text-[#745061] text-base whitespace-nowrap">
            Activate daily to protect your Kokos!
          </DialogTitle>
          <div className="pb-1 text-[#745061] font-bold text-xs leading-[17.54px] flex justify-between">
            <h3>
              Next Reward: {hours}h {minutes}m {seconds}s
            </h3>
            <h3>{currentWeekDisplay}/4</h3>
          </div>
          <BoxContent
            className={`bg-[#D1A995] mt-0 py-0 pb-2 px-0 h-full rounded-xl rounded-b-none overflow-auto flex-col w-full`}
          >
            <Slider {...sliderSettings}>
              {tasksPerWeek.map((weekTasks, weekIndex) => (
                <div
                  key={weekIndex}
                  className="bg-[#D1A995] grid-cols-3 !grid rounded-md px-2 justify-between"
                >
                  {weekTasks.map((task, idx) => (
                    <ProtectionCard
                      key={idx}
                      task={{
                        ...task,
                        received:
                          (data?.data?.prev?.[0]?.currentDay || 0) >=
                            task.day ||
                          data?.data?.current?.[0]?.currentDay === task.day,
                        collectable:
                          (data?.data?.prev?.[0]?.currentDay || 0) + 1 ===
                          task.day,
                      }}
                      refresh={refetch}
                      className={idx === 6 ? "col-span-3" : ""}
                    />
                  ))}
                </div>
              ))}
            </Slider>
          </BoxContent>
          <div className="bg-[#745061] rounded-b-xl flex justify-center items-center py-3 space-x-2">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div
                key={idx}
                className={`rounded-full h-2 w-2 border-2 ${
                  idx === activeSlideIndex
                    ? "border-white bg-[#745061]"
                    : "bg-white border-white"
                }`}
              />
            ))}
          </div>
        </BoxMain>
      </DialogContent>
    </Dialog>
  );
}
