// ==================== REPORTS MODULE - STYLE CONSTANTS ====================
// Centralized style constants for better performance and maintainability

export const GLASS_STYLES = {
  card: {
    background: "rgba(255, 255, 255, 0.05)",
    backdropFilter: "blur(12px)",
    border: "1px solid rgba(255, 255, 255, 0.15)",
    boxShadow: "0 2px 8px 0 rgba(0, 0, 0, 0.1), inset 0 1px 1px 0 rgba(255, 255, 255, 0.1)",
  },
  cardHover: {
    background: "rgba(255, 255, 255, 0.08)",
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  input: {
    background: "rgba(255, 255, 255, 0.12)",
    backdropFilter: "blur(16px)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    boxShadow: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(255, 255, 255, 0.05)",
  },
  inputHover: {
    background: "rgba(255, 255, 255, 0.15)",
    borderColor: "rgba(255, 255, 255, 0.25)",
  },
  button: {
    background: "rgba(59, 130, 246, 0.2)",
    backdropFilter: "blur(16px)",
    border: "1px solid rgba(59, 130, 246, 0.35)",
    boxShadow: "0 4px 12px 0 rgba(59, 130, 246, 0.25), inset 0 1px 1px 0 rgba(255, 255, 255, 0.15)",
  },
  buttonHover: {
    background: "rgba(59, 130, 246, 0.3)",
    borderColor: "rgba(59, 130, 246, 0.45)",
    boxShadow: "0 6px 20px 0 rgba(59, 130, 246, 0.35), inset 0 1px 1px 0 rgba(255, 255, 255, 0.2)",
    transform: "translateY(-1px)",
  },
  buttonSuccess: {
    background: "rgba(34, 197, 94, 0.2)",
    borderColor: "rgba(34, 197, 94, 0.35)",
    boxShadow: "0 4px 12px 0 rgba(34, 197, 94, 0.25), inset 0 1px 1px 0 rgba(255, 255, 255, 0.15)",
  },
  avatar: {
    width: '40px',
    height: '40px',
    minWidth: '40px',
    minHeight: '40px',
    flexShrink: 0,
    borderRadius: '50%',
    backdropFilter: "blur(8px)",
  },
  selected: {
    background: "rgba(59, 130, 246, 0.25)",
    backdropFilter: "blur(16px)",
    border: "1px solid rgba(59, 130, 246, 0.3)",
    boxShadow: "0 2px 4px 0 rgba(59, 130, 246, 0.2), inset 0 1px 1px 0 rgba(255, 255, 255, 0.15)",
  },
  paginationButton: {
    background: "rgba(59, 130, 246, 0.25)",
    backdropFilter: "blur(8px)",
    border: "1px solid rgba(59, 130, 246, 0.3)",
    boxShadow: "0 2px 4px 0 rgba(59, 130, 246, 0.2), inset 0 1px 1px 0 rgba(255, 255, 255, 0.15)",
  },
  paginationButtonInactive: {
    background: "rgba(255, 255, 255, 0.05)",
    backdropFilter: "blur(8px)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
  },
} as const;

export const AVATAR_STYLE = {
  ...GLASS_STYLES.avatar,
  background: "rgba(255, 255, 255, 0.1)",
} as const;




































