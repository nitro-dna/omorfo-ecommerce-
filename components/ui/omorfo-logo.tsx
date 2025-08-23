interface OmorfoLogoProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export function OmorfoLogo({ className = '', size = 'md' }: OmorfoLogoProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  }

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Circular outline */}
        <circle
          cx="50"
          cy="50"
          r="48"
          stroke="currentColor"
          strokeWidth="1"
          fill="none"
        />
        
        {/* Flower icon */}
        <g transform="translate(50, 35)">
          {/* Main flower petals */}
          <path
            d="M-8 -5 Q-4 -12 0 -8 Q4 -12 8 -5 Q6 2 0 0 Q-6 2 -8 -5"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="none"
          />
          <path
            d="M-6 -3 Q-2 -10 2 -6 Q6 -10 10 -3 Q8 4 2 2 Q-4 4 -6 -3"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="none"
          />
          <path
            d="M-4 -1 Q0 -8 4 -4 Q8 -8 12 -1 Q10 6 4 4 Q-2 6 -4 -1"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="none"
          />
          
          {/* Stem */}
          <path
            d="M0 0 L0 15"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="none"
          />
          
          {/* Leaves */}
          <path
            d="M0 8 Q-6 6 -4 10 Q-2 14 0 12"
            stroke="currentColor"
            strokeWidth="1"
            fill="none"
          />
          <path
            d="M0 8 Q6 6 4 10 Q2 14 0 12"
            stroke="currentColor"
            strokeWidth="1"
            fill="none"
          />
        </g>
        
        {/* Text "ómorfo" */}
        <text
          x="50"
          y="75"
          textAnchor="middle"
          fill="currentColor"
          fontSize="12"
          fontFamily="Inter, system-ui, sans-serif"
          fontWeight="400"
        >
          ómorfo
        </text>
      </svg>
    </div>
  )
}

