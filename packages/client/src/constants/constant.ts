export const BACK_BASE_URL = "http://localhost:5000";

export const MAXIMUM_OF_USERS = 8;
export const USER_OPTIONS = Array.from(
  Array(MAXIMUM_OF_USERS - 1),
  (_, index) => index + 2
);

export const ROUND_OPTIONS = Array.from(
  Array(4),
  (_, index) => 5 * (index + 1)
);
