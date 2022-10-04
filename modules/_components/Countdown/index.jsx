import { useCountdown } from "../../../hooks/useCountdown";

export const Countdown = ({ item }) => {
  const [days, hours, minutes, seconds] = useCountdown(item);

  return `${hours}:${minutes}:${seconds}`;
};
