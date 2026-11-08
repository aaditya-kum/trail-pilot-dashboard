import { Box, Pagination as MuiPagination, Typography } from "@mui/material";

const Pagination = ({
  page = 1,
  count,
  pageSize = 10,
  totalItems = 0,
  onPageChange,
  onChange,
  siblingCount = 1,
  boundaryCount = 1,
  showSummary = true,
}) => {
  const pageCount =
    typeof count === "number"
      ? count
      : Math.ceil(Math.max(totalItems, 0) / Math.max(pageSize, 1));
  const handlePageChange = onPageChange || onChange;

  if (!handlePageChange || pageCount <= 0) return null;

  const firstItem = totalItems === 0 ? 0 : (page - 1) * pageSize + 1;
  const lastItem = Math.min(page * pageSize, totalItems);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 2,
        px: { xs: 2, sm: 2.5 },
        pb: 2.5,
        flexWrap: "wrap",
      }}
    >
      {showSummary && totalItems > 0 && (
        <Typography variant="body2" color="text.secondary">
          Showing {firstItem}-{lastItem} of {totalItems}
        </Typography>
      )}
      {pageCount > 1 && (
        <MuiPagination
          count={pageCount}
          page={page}
          onChange={(_, nextPage) => handlePageChange(nextPage)}
          color="primary"
          siblingCount={siblingCount}
          boundaryCount={boundaryCount}
          size="medium"
        />
      )}
    </Box>
  );
};

export default Pagination;
