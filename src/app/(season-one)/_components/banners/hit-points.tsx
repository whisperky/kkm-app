import React, { useEffect } from 'react'
import { AnimationManager } from './utils';
const classNames = {
  enter: ["animate__bounceIn"],
  exit: ["animate__bounceOutLeft", "animate__slow"],
}

export default function HitPoints() {
  const animateRef = React.useRef<HTMLDivElement>(null)
  const animationManager = new AnimationManager(animateRef, classNames);

  useEffect(() => {
    const animationInterval = setInterval(() => {
      animationManager.initializeAnimation();
    }, 1800);
    return () => clearInterval(animationInterval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className='bg-[#AB6AEE] h-12 items-center relative py-2 flex justify-center text-white'>
      <div ref={animateRef} className='animate__animated text-base font-made-tommy #font-sans font-bold leading-3'>
        <b className='text-[#330067]'>NAME</b> HAS JUST HIT <b className='text-[#FFC700]'>100,000</b> POINTS!
      </div>
    </div>
  )
}
