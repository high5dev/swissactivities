import { Text } from "../../_components/Text";

export const Author = ({ item }) => {
  return (
    <div className={`flex items-center`}>
      <div
        className={`mr-2 flex h-6 w-6 items-center justify-center rounded-full bg-blue/10 text-xs font-semibold uppercase text-blue`}
      >
        {item._embedded.author[0].name[0]}
      </div>
      <Text className={`!text-xs`}>{item._embedded.author[0].name}</Text>
    </div>
  );
};
