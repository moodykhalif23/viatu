export function LogoSvg({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 440 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="SoleVault"
      role="img"
    >
      <text
        x="0"
        y="50"
        fontFamily="'Geist', 'Inter', system-ui, sans-serif"
        fontSize="56"
        fontWeight="800"
        letterSpacing="-2"
        fill="currentColor"
      >
        SoleVault
      </text>
    </svg>
  );
}
