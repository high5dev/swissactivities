import { useEffect } from "react";
import { disableBodyLock, enableBodyLock } from "../../../utils/bodylock";

export const BodyLock = () => {
  useEffect(() => {
    enableBodyLock();

    return () => disableBodyLock();
  }, []);

  return null;
};
