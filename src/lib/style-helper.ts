function notNullish<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}

function filterNonNullish<T>(items: (T | null | undefined)[]) {
  return items.filter(notNullish);
}

export function joinClassNames(...names: (string | null | undefined)[]) {
  return names
    .filter(notNullish)
    .map((name) => name.trim())
    .join(" ");
}
