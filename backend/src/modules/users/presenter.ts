export const presentUser = <T extends { passwordHash: string }>(
  user: T
): Omit<T, "passwordHash"> => {
  // Remove sensitive hash before returning user data downstream
  const { passwordHash: _ignored, ...rest } = user;
  void _ignored;
  return rest;
};
