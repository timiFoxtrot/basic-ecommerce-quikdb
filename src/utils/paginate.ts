export const paginate = <T>(
  records: T[],
  page: number,
  pageSize: number
): {
  data: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
} | null => {
  const total = records.length;
  const totalPages = Math.ceil(total / pageSize);
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const data = records.slice(startIndex, endIndex);

  if (page > totalPages) return null;

  return {
    data,
    page,
    pageSize,
    total,
    totalPages,
  };
};
