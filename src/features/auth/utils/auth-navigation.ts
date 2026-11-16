export const AUTH_RETURN_PATH_KEY = "compiler-auth-return-path";

export function getSafeReturnPath(value: unknown): string {
  if (
    typeof value === "string" &&
    value.startsWith("/") &&
    !value.startsWith("//")
  ) {
    return value;
  }

  return "/";
}
