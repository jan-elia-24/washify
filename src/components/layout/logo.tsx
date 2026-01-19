export function Logo() {
  return (
    <div className="flex items-center gap-3 group">
      <svg
        width="36"
        height="36"
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="transition-all group-hover:scale-110"
      >
        <defs>
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#667eea" />
            <stop offset="100%" stopColor="#764ba2" />
          </linearGradient>
        </defs>
        
        {/* Elegant cirkel-ram */}
        <circle
          cx="18"
          cy="18"
          r="16"
          stroke="url(#logoGradient)"
          strokeWidth="2"
          fill="none"
          opacity="0.3"
        />
        
        {/* Stiliserad W-form - nu med fast gradient */}
        <path
          d="M12 12L15 24L18 16L21 24L24 12"
          stroke="url(#logoGradient)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        
        {/* Accent-prick */}
        <circle
          cx="18"
          cy="26"
          r="1.5"
          fill="url(#logoGradient)"
        />
      </svg>
      
      <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
        Washify
      </span>
    </div>
  );
}