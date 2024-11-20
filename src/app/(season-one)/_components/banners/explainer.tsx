import React, { useEffect, useState } from 'react';
import 'animate.css';

export default function Explainer() {
    const [activeIndex, setActiveIndex] = useState(0);
    const childrenCount = 3;
    useEffect(() => {
        const animationInterval = setInterval(() => {
            setActiveIndex((prevIndex) => (prevIndex + 1) % childrenCount);
        }, 3000);

        return () => clearInterval(animationInterval);
    }, []);

    return (
        <div className='h-12 items-center bg-[#2DA0F0]   relative flex justify-center text-white'>
            <div className={`animate__animated ${activeIndex === 0 ? 'animate__slideInUp flex' : 'hidden'} py-2  text-base font-made-tommy #font-sans font-bold leading-3`}>
                <b className='text-[#003153]'>📝 GAME EXPLAINER</b>
            </div>
            <div className={`animate__animated ${activeIndex === 1 ? 'animate__slideInUp flex items-center' : 'hidden'} py-2  bg-[#055790] w-full h-full items-center justify-center text-base font-made-tommy #font-sans font-bold leading-3`}>
                YOUR COCONUTS ARE
                <b className='text-[#5DD75A] flex pl-1 gap-x-1 items-center'>
                    GREEN
                    <div className="outline text-xs flex items-center p-0.5 outline-2 -outline-offset-2 rounded-full outline-[#25a825] bg-[#25a825]/20">
                        🥥
                    </div>
                </b>
            </div>
            <div className={`animate__animated ${activeIndex === 2 ? 'animate__slideInUp flex items-center' : 'hidden'} py-2  bg-[#055790] w-full h-full items-center justify-center text-base font-made-tommy #font-sans font-bold leading-3`}>
                ENEMY COCONUTS ARE
                <b className='text-[#EF5454] flex pl-1 gap-x-1 items-center'>
                    RED
                    <div className="outline text-xs flex items-center p-0.5 outline-2 -outline-offset-2 rounded-full outline-[#EF5454] bg-[#EF5454]/20">
                        🥥
                    </div>
                </b>
            </div>
        </div>
    );
}
