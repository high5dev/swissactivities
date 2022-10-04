import { toISO } from "../../../utils/dates/toISO";
import { Text } from "../../_components/Text";

export const Date = ({ item }) => {
  return (
    <Text className={`!text-xs`}>{toISO(item.date, { dateString: true })}</Text>
  );
};
