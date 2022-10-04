import { Hit } from "./Hit";

export const Hits = ({ hits, title, icon, type }) => {
  return (
    hits.length >= 1 && (
      <div
        style={{
          borderTop: "none",
          borderBottom: "none",
        }}
      >
        <h2
          style={{
            borderTop: "none",
            borderLeft: "none",
            borderRight: "none",
          }}
          className={
            "sticky top-0 z-10 mb-3 flex items-center border-b border-solid border-gray-200 bg-white px-5 pt-5 pb-4 text-base font-semibold text-black lg:px-7 lg:pt-4 lg:pb-3"
          }
        >
          <div className={"mr-2 flex text-primary"}>{icon}</div>
          {title}
        </h2>
        <ul>
          {hits.map((hit) => (
            <Hit key={hit.objectID} hit={hit} type={type} />
          ))}
        </ul>
      </div>
    )
  );
};
