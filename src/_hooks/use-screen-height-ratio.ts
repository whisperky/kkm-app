import { useState, useEffect } from 'react';

const useScreenHeightRatio = (height: number): number => {
  const [heightRatio, setHeightRatio] = useState<number>(1);

  useEffect(() => {
    const updateHeightRatio = (): void => {
      const screenHeight: number = window.innerHeight;
      const ratio: number = screenHeight / height;
      setHeightRatio(ratio);
    };

    updateHeightRatio();

    window.addEventListener('resize', updateHeightRatio);

    return (): void => {
      window.removeEventListener('resize', updateHeightRatio);
    };
  }, [height]);

  return heightRatio;
};

export default useScreenHeightRatio;
