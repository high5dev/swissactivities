import {
  useMemo,
  useState,
  useEffect,
  useCallback,
} from 'react';

import { WindowService } from '../utils';

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  const handleResize = useCallback(() => {
    setIsMobile(WindowService.isMobile);
  }, [setIsMobile]);

  useEffect(() => {
    WindowService.addListener('resize', handleResize);
    handleResize();
    return () => WindowService.removeListener('resize', handleResize);
  }, [handleResize]);

  return useMemo(() => isMobile, [isMobile]);
};

export default useIsMobile;
