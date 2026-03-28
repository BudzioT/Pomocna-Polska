export type Role = "SEEKER" | "VOLUNTEER" | "BOTH";

/** Can the user browse other people's help requests (feed/map) */
export function canViewFeed(role: Role | string | undefined): boolean {
  return role === "VOLUNTEER" || role === "BOTH";
}

/** Can the user create a new help request */
export function canRequestHelp(role: Role | string | undefined): boolean {
  return role === "SEEKER" || role === "BOTH";
}

export function roleLabel(role: Role | string | undefined): string {
  switch (role) {
    case "SEEKER":
      return "Szukający pomocy";
    case "VOLUNTEER":
      return "Wolontariusz";
    case "BOTH":
      return "Wolontariusz i szukający pomocy";
    default:
      return "Użytkownik";
  }
}

export function roleIcon(role: Role | string | undefined): string {
  switch (role) {
    case "SEEKER":
      return "front_hand";
    case "VOLUNTEER":
      return "favorite";
    case "BOTH":
      return "volunteer_activism";
    default:
      return "person";
  }
}

/** Determine role from seeker/volunteer booleans */
export function resolveRole(seeker: boolean, volunteer: boolean): Role {
  if (seeker && volunteer) return "BOTH";
  if (volunteer) return "VOLUNTEER";
  return "SEEKER";
}
