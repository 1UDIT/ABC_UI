export function getLast24HoursFilter() {
  const now = new Date();
  const last24 = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  const toDateTimeLocal = (date: Date) => {
    const pad = (n: number) => String(n).padStart(2, "0");

    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
      date.getDate()
    )}`;
  };

  return {
    from: toDateTimeLocal(last24),
    to: toDateTimeLocal(now),
  };
}