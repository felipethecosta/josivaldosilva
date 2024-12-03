export const VALID_TOKEN = "JzdWIiOiIxMjM4NTY3ODkwIiwibmFtZSI6Ikpva";

export function validateToken(token: string) {
  return token === VALID_TOKEN;
}
