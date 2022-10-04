const Heading = ({ level, children, refs }) => {
  if (children.length < 1) {
    return null;
  }

  const heading = children[0].props.value;
  let anchor = typeof heading === "string" ? heading.toLowerCase() : "";

  anchor = anchor.replace(/[^a-zA-Z0-9 ]/g, "");
  anchor = anchor.replace(/ /g, "-");

  switch (level) {
    case 1:
      return (
        <h1 ref={refs[anchor]} id={anchor}>
          {children}
        </h1>
      );
    case 2:
      return (
        <h2 ref={refs[anchor]} id={anchor}>
          {children}
        </h2>
      );
    case 3:
      return (
        <h3 ref={refs[anchor]} id={anchor}>
          {children}
        </h3>
      );

    default:
      return <h4 ref={refs[anchor]}>{children}</h4>;
  }
};

export default Heading;
