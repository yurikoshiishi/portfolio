const PORT = process.env.PORT || 3000;
export const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://yurikoshiishi.com"
    : `http://localhost:${PORT}`;
