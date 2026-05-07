/**
 * cn — minimal className concatenator. Filters out falsy values.
 * Stand-in for the clsx/tailwind-merge combo that shadcn ships,
 * since this project doesn't use Tailwind.
 */
export function cn(...inputs: Array<string | undefined | null | false>): string {
  return inputs.filter(Boolean).join(" ");
}

/**
 * Prefix a root-relative asset path with Vite's BASE_URL so it resolves
 * correctly under both local dev (/) and GitHub Pages project subpath (/website/).
 * Pass-through for empty strings.
 */
export function assetUrl(path: string): string {
  if (!path) return path;
  return `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;
}
