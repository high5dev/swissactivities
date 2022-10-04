export const RefinementHeader = ({ title, icon }) => {
  return (
    <h2
      style={{
        borderTop: "none",
        borderLeft: "none",
        borderRight: "none",
      }}
      className={`mb-5 flex items-center border-b border-solid border-gray-200 pb-1 text-lg font-medium text-gray-900`}
    >
      <span className={`mr-2 flex scale-75 text-xl`}>{icon}</span>
      {title}
    </h2>
  );
};
