const tableRef = useRef<HTMLTableElement | null>(null);

const handleCellKeyDown = (
  event: React.KeyboardEvent<HTMLTableCellElement>
) => {
  const currentCell = event.currentTarget;

  const rowIndex = Number(currentCell.dataset.rowIndex);
  const colIndex = Number(currentCell.dataset.colIndex);

  let nextRow = rowIndex;
  const nextCol = colIndex;

  if (event.key === "ArrowDown") {
    nextRow = rowIndex + 1;
  } else if (event.key === "ArrowUp") {
    nextRow = rowIndex - 1;
  } else {
    return;
  }

  event.preventDefault();

  const nextCell = tableRef.current?.querySelector<HTMLTableCellElement>(
    `[data-row-index="${nextRow}"][data-col-index="${nextCol}"]`
  );

  nextCell?.focus();
};