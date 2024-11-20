import { useState, useEffect } from 'react';

const useScreenWidthRatio = (width: number): number => {
  const [widthRatio, setWidthRatio] = useState<number>(1);

  useEffect(() => {
    const updateWidthRatio = (): void => {
      const screenWidth: number = window.innerWidth;
      const ratio: number = screenWidth / width;
      setWidthRatio(ratio);
    };

    updateWidthRatio();

    window.addEventListener('resize', updateWidthRatio);

    return (): void => {
      window.removeEventListener('resize', updateWidthRatio);
    };
  }, [width]);

  return widthRatio;
};

export default useScreenWidthRatio;
