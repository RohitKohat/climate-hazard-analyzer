import clsx from "clsx";

export default function Card({ className, children, ...rest }) {
  return (
    <div {...rest} className={clsx("glass rounded-2xl p-5 relative overflow-hidden", className)}>
      {children}
    </div>
  );
}