import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
} from "@mui/material";
import TableSkeleton from "./TableSkeleton/TableSkeleton.jsx";

const DataTable = ({
  columns,
  rows,
  loading,
  error,
  emptyMessage = "No data found",
  getRowId = (row) => row.id,
}) => (
  <Box sx={{ p: { xs: 2, sm: 2.5 } }}>
    <TableContainer
      sx={{
        overflowX: "auto",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
      }}
    >
      <Table
      // sx={{
      //   minWidth: { xs: 550, sm: 850 },
      // }}
      >
        <TableHead
          sx={{
            "& th:first-of-type": { borderTopLeftRadius: 8 },
            "& th:last-of-type": { borderTopRightRadius: 8 },
          }}
        >
          <TableRow
            sx={{
              "& th": {
                bgcolor: "#f3f5f9",
                color: "#1e293b",
                fontWeight: 700,
                borderBottom: "1px solid #dfe4ec",
              },
            }}
          >
            {columns.map((column) => (
              <TableCell key={column.id} align={column.align}>
                {column.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody
          sx={{
            "& tr:last-child td:first-of-type": { borderBottomLeftRadius: 8 },
            "& tr:last-child td:last-of-type": { borderBottomRightRadius: 8 },
          }}
        >
          {loading && <TableSkeleton columns={columns.length} rows={5} />}
          {!loading && error && (
            <TableRow>
              <TableCell colSpan={columns.length}>
                Unable to load data: {error}
              </TableCell>
            </TableRow>
          )}
          {!loading && !error && rows.length === 0 && (
            <TableRow>
              <TableCell colSpan={columns.length}>{emptyMessage}</TableCell>
            </TableRow>
          )}
          {!loading &&
            !error &&
            rows.map((row) => (
              <TableRow
                key={getRowId(row)}
                hover
                sx={{
                  "& td": { borderBottomColor: "divider", py: 1.75 },
                  "&:hover td": { bgcolor: "#f8fafc" },
                }}
              >
                {columns.map((column) => (
                  <TableCell key={column.id} align={column.align}>
                    {column.render
                      ? column.render(row[column.id], row)
                      : (row[column.id] ?? "—")}
                  </TableCell>
                ))}
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  </Box>
);

export default DataTable;
