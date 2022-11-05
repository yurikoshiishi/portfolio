import { format, parseISO } from "date-fns";

export function formatISO(iso: string) {
  const date = parseISO(iso);
  return format(date, "MMMM do, yyyy");
}
