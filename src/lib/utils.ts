/**
 * cn — minimal className concatenator. Filters out falsy values.
 * Stand-in for the clsx/tailwind-merge combo that shadcn ships,
 * since this project doesn't use Tailwind.
 */
export function cn(...inputs: Array<string | undefined | null | false>): string {
  return inputs.filter(Boolean).join(" ");
}
