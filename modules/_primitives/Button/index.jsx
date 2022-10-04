export const Button = ({ className, href, children, as, ...rest }) => {
  return href || as === 'a' ? (
    <a {...rest} href={href} className={className}>
      {children}
    </a>
  ) : as === "div" ? (
    <div {...rest} className={className}>
      {children}
    </div>
  ) : as === "submit" ? (
    <input type="submit" className={className} />
  ) : (
    <button {...rest} className={className}>
      {children}
    </button>
  );
};

export default Button;
