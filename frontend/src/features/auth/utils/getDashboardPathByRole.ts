export function getDashboardPathByRole(role: string): string {
  switch (role) {
    case "owner":
      return "/owner/dashboard";
    case "player":
      return "/player/dashboard";
    case "admin":
      return "/admin/dashboard";
    default:
      return "/";
  }
}