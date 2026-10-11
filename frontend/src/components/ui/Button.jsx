import clsx from "clsx";

export default function Button({ className, variant = "primary", ...rest }) {
  return (
    <button
      {...rest}
      className={clsx(
        "rounded-xl px-4 py-2.5 text-sm font-medium transition-all active:scale-[0.98] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",
        variant === "primary" && "text-white shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40",
        variant === "ghost" && "glass hover:brightness-110",
        className
      )}
      style={
        variant === "primary"
          ? { background: "linear-gradient(135deg,#f97316,#ef4444)" }
          : undefined
      }
    />
  );
}