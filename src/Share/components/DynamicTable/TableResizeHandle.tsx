import type { Header } from "@tanstack/react-table";

type TableResizeHandleProps<TData> = {
  header: Header<TData, unknown>;
};

export function TableResizeHandle<TData>({
  header,
}: TableResizeHandleProps<TData>) {
  if (!header.column.getCanResize()) return null;

  return (
    <div
      onMouseDown={header.getResizeHandler()}
      onTouchStart={header.getResizeHandler()}
      className={`absolute right-0 top-0 h-full w-1 cursor-col-resize touch-none select-none 
        bg-slate-500/30 hover:bg-blue-400
        ${header.column.getIsResizing() ? "bg-blue-400" : ""}
      `}
    />
  );
}