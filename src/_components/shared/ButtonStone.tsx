import Image from "next/image";
import ButtonStoneImage from "@/_assets/button-stone.png";
import { PropsWithChildren } from "react";
import Head from "next/head";
import { BREAKPOINTS } from "@/src/_utils/deviceUtils";

const BUTTON_SIZES = {
  sm: { width: 60, height: 68 },
  md: { width: 70, height: 78 },
  lg: { width: 80, height: 88 },
};

type Props = { screenWidth?: number };

export const ButtonStone = ({
  children,
  screenWidth = BREAKPOINTS.lg,
  ...props
}: React.ComponentProps<"button"> & PropsWithChildren & Props) => {
  const getOptimalButtonSize = () => {
    if (screenWidth <= BREAKPOINTS.sm) return BUTTON_SIZES.sm;
    if (screenWidth <= BREAKPOINTS.md) return BUTTON_SIZES.md;
    return BUTTON_SIZES.lg;
  };

  const buttonSize = getOptimalButtonSize();

  return (
    <>
      <Head>
        <link
          rel="preload"
          href={ButtonStoneImage.src}
          as="image"
          type="image/png"
          media={`(max-width: ${BREAKPOINTS.md}px)`}
        />
      </Head>
      <button
        {...props}
        className="relative h-[78px] flex items-center justify-center"
      >
        <Image
          priority
          className={`absolute h-full w-full`}
          alt="Button Stone"
          src={ButtonStoneImage}
          width={buttonSize.width}
          height={buttonSize.height}
          sizes={`
            (max-width: ${BREAKPOINTS.sm}px) ${BUTTON_SIZES.sm.width}px,
            (max-width: ${BREAKPOINTS.md}px) ${BUTTON_SIZES.md.width}px,
            ${BUTTON_SIZES.lg.width}px
          `}
          placeholder="blur"
          blurDataURL={ButtonStoneImage.blurDataURL}
        />
        <div className="z-10 [">{children}</div>
      </button>
    </>
  );
};
