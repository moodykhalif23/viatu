export function MpesaIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="M-Pesa"
    >
      <rect width="120" height="40" rx="6" fill="#00A651" />
      <text
        x="60"
        y="27"
        textAnchor="middle"
        fill="white"
        fontSize="18"
        fontWeight="bold"
        fontFamily="Arial, sans-serif"
        letterSpacing="1"
      >
        M-PESA
      </text>
    </svg>
  );
}
