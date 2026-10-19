export function Logo({ size = 36 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
      className="block"
    >
      <rect
        x="1.5"
        y="1.5"
        width="45"
        height="45"
        rx="13"
        fill="#0d1c42"
        stroke="#fcf1d0"
        strokeOpacity="0.9"
        strokeWidth="1.5"
      />
      <text
        x="24"
        y="31"
        textAnchor="middle"
        fontSize="18"
        fontWeight="600"
        fill="#fcf1d0"
      >
        MF
      </text>
    </svg>
  );
}