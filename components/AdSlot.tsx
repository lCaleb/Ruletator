type AdSlotProps = {
  variant?: "small" | "large" | "compact";
};

export function AdSlot({ variant = "small" }: AdSlotProps) {
  const sizeClass =
    variant === "compact" ? "min-h-[120px]" : variant === "large" ? "min-h-[280px]" : "min-h-[250px]";

  return (
    <aside
      className={`grid place-items-center rounded border border-sky-200 bg-sky-200 px-4 text-center text-blue-900 ${sizeClass}`}
    >
      <div>
        <p className={variant === "compact" ? "text-sm" : "text-lg"}>ideas que se quedan</p>
        <strong className={variant === "compact" ? "rounded bg-blue-800 px-2 py-1 text-base text-white" : "rounded bg-blue-800 px-2 py-1 text-xl text-white"}>
          contigo.
        </strong>
      </div>
    </aside>
  );
}
