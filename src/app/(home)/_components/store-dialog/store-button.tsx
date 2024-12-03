"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Store from "@/_assets/store/store.png";
import StoreBlur from "@/_assets/store/store_blur.png";
import StoreModal from ".";

export const StoreButton = () => {
  // Common motion properties
  const motionProps = {
    initial: { x: 100, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  };

  return (
    <div className="cursor-pointer">
      <motion.div
        className="absolute right-0 top-[calc(40vh-82px)] -mr-2"
        {...motionProps}
        transition={{
          ...motionProps.transition,
          delay: 0.2,
        }}
      >
        <Image
          src={StoreBlur}
          alt="Store blur effect"
          width={107}
          height={163}
        />
      </motion.div>
      <motion.div
        className="absolute right-0 top-[calc(40vh-47px)] -mr-2"
        {...motionProps}
        whileHover={{ scale: 1.05 }}
      >
        <StoreModal>
          <div className="relative">
            <Image src={Store} alt="Store icon" width={72} height={94} />
            <span className="text-white text-[12px] font-bold absolute bottom-5 right-[10px] text-right select-none">
              Store
            </span>
          </div>
        </StoreModal>
      </motion.div>
    </div>
  );
};
