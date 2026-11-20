export function RustEmblem({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <circle
        cx="16"
        cy="16"
        r="10.5"
        stroke="currentColor"
        strokeWidth="2.5"
      />
      <path
        d="M16 2.5V6M16 26V29.5M2.5 16H6M26 16H29.5M6.45 6.45L8.95 8.95M23.05 23.05L25.55 25.55M25.55 6.45L23.05 8.95M8.95 23.05L6.45 25.55"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M12.2 20.5V11.5H16.6C18.45 11.5 19.6 12.5 19.6 14.1C19.6 15.35 18.85 16.25 17.6 16.55L19.9 20.5H17.35L15.35 16.8H14.4V20.5H12.2ZM14.4 15H16.3C17.05 15 17.45 14.65 17.45 14.1C17.45 13.55 17.05 13.2 16.3 13.2H14.4V15Z"
        fill="currentColor"
      />
    </svg>
  );
}
