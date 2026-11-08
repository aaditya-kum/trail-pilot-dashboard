export const parseDate = (value) => {
  if (!value) return null;

  const date = new Date(`${String(value).slice(0, 10)}T00:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
};

export const formatDate = (value) => {
  const date = parseDate(value);
  return date ? date.toLocaleDateString("en-IN") : "—";
};
