import { useState, useEffect } from 'react';

const useNow = (): number => {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    let id: number;

    const tick = () => {
      setNow(Date.now());
      id = requestAnimationFrame(tick);
    };

    tick();

    return () => cancelAnimationFrame(id);
  }, []);

  return now;
};

export {
  useNow,
}
