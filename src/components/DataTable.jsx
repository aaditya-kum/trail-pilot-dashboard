import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import BouncingLoader from "./BouncingLoader/BouncingLoader.jsx";

const DataTable = ({
  columns,
  rows,
  loading,
  error,
  emptyMessage = "No data found",
  getRowId = (row) => row.id,
}) => (
  <TableContainer
    sx={{
      width: "100%",
      maxWidth: "100%",
      boxSizing: "border-box",
      overflowX: "auto",
      p: { xs: 2, sm: 3 },
    }}
  >
    <Table
      sx={{
        width: "100%",
        minWidth: { xs: 850, sm: 700 },
        tableLayout: "auto",
        borderCollapse: "separate",
        borderSpacing: 0,
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        overflow: "hidden",
      }}
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
        {loading && (
          <TableRow>
            <TableCell colSpan={columns.length} sx={{ p: 0 }}>
              <BouncingLoader minHeight="180px" size="small" />
            </TableCell>
          </TableRow>
        )}
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
);

export default DataTable;
