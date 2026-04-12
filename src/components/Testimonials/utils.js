/**
 * Derives initials from a full name.
 * - "Mahdi Heraki"     → "MH"
 * - "Archana"          → "AR"
 * - "  John  Doe  "   → "JD"
 */
export function getInitials(name = "") {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * Deterministically picks a bg color per name for visual variety.
 */
const PALETTE = [
  "#16a34a", "#0284c7", "#7c3aed", "#db2777",
  "#d97706", "#0891b2", "#dc2626", "#4f46e5",
];
export function getAvatarColor(name = "") {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return PALETTE[Math.abs(hash) % PALETTE.length];
}
