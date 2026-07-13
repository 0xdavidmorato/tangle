"use client";

interface NodeIconProps {
  readonly clusterIndex: number;
  readonly nodeIndex: number;
  readonly size: number;
}

export function NodeIcon({
  clusterIndex,
  nodeIndex,
  size,
}: NodeIconProps) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  if (nodeIndex > 0) {
    const variant = (nodeIndex - 1) % 4;
    return (
      <g className="node-icon" transform={`scale(${size / 24})`}>
        {variant === 0 ? (
          <>
            <path {...common} d="M-7 -9h10l5 5v13H-7z" />
            <path {...common} d="M3-9v5h5M-3 1h7M-3 5h7" />
          </>
        ) : null}
        {variant === 1 ? (
          <>
            <path {...common} d="M0-10 9 0 0 10-9 0Z" />
            <circle cx="0" cy="0" r="2.4" fill="currentColor" />
          </>
        ) : null}
        {variant === 2 ? (
          <>
            <path {...common} d="M-5 2a7 7 0 1 1 10 0c-2 2-2 3-2 4h-6c0-1 0-2-2-4Z" />
            <path {...common} d="M-3 9h6M0-11v-3M-10-6l-3-2M10-6l3-2" />
          </>
        ) : null}
        {variant === 3 ? (
          <>
            <circle {...common} cx="0" cy="0" r="9" />
            <path {...common} d="m-4 3 2-6 6-2-2 6Z" />
          </>
        ) : null}
      </g>
    );
  }

  return (
    <g className="node-icon" transform={`scale(${size / 24})`}>
      {clusterIndex === 0 ? (
        <>
          <rect {...common} x="-8" y="-9" width="16" height="18" rx="1" />
          <path {...common} d="M-3 9V4h6v5M-4-5h2M2-5h2M-4-1h2M2-1h2" />
        </>
      ) : null}
      {clusterIndex === 1 ? (
        <>
          <path {...common} d="M-9 8V-8M-9 8H9" />
          <path {...common} d="m-6 4 4-5 4 2 6-7" />
          <path {...common} d="M5-6h3v3" />
        </>
      ) : null}
      {clusterIndex === 2 ? (
        <>
          <circle {...common} cx="0" cy="-5" r="4" />
          <path {...common} d="M-8 9c1-6 4-9 8-9s7 3 8 9Z" />
        </>
      ) : null}
      {clusterIndex === 3 ? (
        <text
          x="0"
          y="7"
          textAnchor="middle"
          fill="currentColor"
          fontSize="22"
          fontWeight="600"
        >
          €
        </text>
      ) : null}
      {clusterIndex === 4 ? (
        <>
          <path {...common} d="m-8 1 5 5L9-8" />
          <path {...common} d="M-9-7h4M-7-9v4M6 4h4M8 2v4" />
        </>
      ) : null}
      {clusterIndex === 5 ? (
        <>
          <path {...common} d="M-2-5 1-8a5 5 0 0 1 7 7L5 2M2 5l-3 3a5 5 0 0 1-7-7l3-3M-4 4 4-4" />
        </>
      ) : null}
    </g>
  );
}
