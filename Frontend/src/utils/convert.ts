export const formatDate = (date: string | Date | null | undefined): string => {
  if (!date) return ""; // handle null or undefined

  const d = new Date(date);
  if (isNaN(d.getTime())) return ""; // handle invalid date

  const year = d.getFullYear();
  const month = d.getMonth() + 1; // months are 0-indexed
  const day = d.getDate();

  return `${year}-${month}-${day}`;
};
