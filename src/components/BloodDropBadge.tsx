interface BloodDropBadgeProps {
  type: string;
}

export function BloodDropBadge({ type }: BloodDropBadgeProps) {
  return (
    <div className="blood-badge-container" title={`Grupo Sanguíneo: ${type}`}>
      <svg
        viewBox="0 0 32 42"
        className="blood-drop-svg"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M16 2.5 C16 2.5, 3 17, 3 27 C3 34.5 8.8 40 16 40 C23.2 40 29 34.5 29 27 C29 17, 16 2.5, 16 2.5 Z"
          fill="rgba(37, 51, 86, 0.95)"
          stroke="#ffffff"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
      </svg>
      <span className="blood-drop-text">{type}</span>
    </div>
  );
}

export default BloodDropBadge;