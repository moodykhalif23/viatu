export function PayPalIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="PayPal"
    >
      <text
        x="50"
        y="23"
        textAnchor="middle"
        fontSize="20"
        fontWeight="bold"
        fontFamily="Arial, sans-serif"
      >
        <tspan fill="#003087">Pay</tspan>
        <tspan fill="#009CDE">Pal</tspan>
      </text>
    </svg>
  );
}
