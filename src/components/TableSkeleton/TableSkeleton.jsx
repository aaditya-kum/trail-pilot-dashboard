import { Skeleton, TableCell, TableRow } from "@mui/material";

const TableSkeleton = ({ columns, rows = 5 }) =>
  Array.from({ length: rows }).map((_, rowIndex) => (
    <TableRow key={`skeleton-row-${rowIndex}`}>
      {Array.from({ length: columns }).map((__, columnIndex) => (
        <TableCell
          key={`skeleton-cell-${rowIndex}-${columnIndex}`}
          sx={{ py: 1.75 }}
        >
          <Skeleton
            variant="text"
            width={columnIndex === 0 ? "70%" : "85%"}
            height={24}
          />
        </TableCell>
      ))}
    </TableRow>
  ));

export default TableSkeleton;
