type ClassValue = string | false | null | undefined;

/**
 * Joins truthy class names with a space, dropping falsy values.
 * Lets callers write `cx(base, isActive && active)` without trailing spaces.
 */
export function cx(...classes: ClassValue[]): string {
  return classes.filter(Boolean).join(' ');
}
