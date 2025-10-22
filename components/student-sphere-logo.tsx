'use client'

import { motion } from 'framer-motion'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showText?: boolean
  animated?: boolean
  className?: string
}

export function StudentSphereLogo({ 
  size = 'md', 
  showText = true,
  animated = true,
  className = '' 
}: LogoProps) {
  const sizeClasses = {
    sm: { container: 'h-8', icon: 'w-8 h-8', text: 'text-sm' },
    md: { container: 'h-10', icon: 'w-10 h-10', text: 'text-base' },
    lg: { container: 'h-12', icon: 'w-12 h-12', text: 'text-lg' },
    xl: { container: 'h-20', icon: 'w-20 h-20', text: 'text-3xl' }
  }

  const { container, icon, text } = sizeClasses[size]

  return (
    <div className={`flex items-center gap-3 ${container} ${className}`}>
      <div className={`relative ${icon} flex-shrink-0`}>
        <motion.div
          className="w-full h-full"
          animate={animated ? { rotate: [0, 360] } : {}}
          transition={animated ? { 
            duration: 30, 
            repeat: Infinity, 
            ease: "linear" 
          } : {}}
        >
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg">
            {/* Outer ring */}
            <circle
              cx="50"
              cy="50"
              r="48"
              fill="none"
              stroke="url(#outerGradient)"
              strokeWidth="4"
            />
            
            {/* Inner circle background */}
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="url(#innerGradient)"
              className="drop-shadow-sm"
            />
            
            {/* Globe/Sphere in center */}
            <circle
              cx="50"
              cy="45"
              r="18"
              fill="url(#sphereGradient)"
            />
            
            {/* Globe lines */}
            <g stroke="#1a1625" strokeWidth="1" fill="none" opacity="0.6">
              <ellipse cx="50" cy="45" rx="18" ry="9" />
              <ellipse cx="50" cy="45" rx="18" ry="15" />
              <line x1="32" y1="45" x2="68" y2="45" />
              <line x1="50" y1="27" x2="50" y2="63" />
            </g>
            
            {/* Graduation cap */}
            <g>
              <polygon 
                points="30,30 40,28 35,25 25,27" 
                fill="#d4a574"
              />
              <rect x="34" y="30" width="2" height="8" fill="#d4a574" />
              <circle cx="35" cy="38" r="1.5" fill="#e6c794" />
            </g>
            
            {/* Books */}
            <g>
              <rect x="15" y="60" width="12" height="8" rx="1" fill="#e6c794" />
              <rect x="16" y="61" width="10" height="6" rx="0.5" fill="#d4a574" />
              <line x1="17" y1="63" x2="25" y2="63" stroke="#1a1625" strokeWidth="0.5" />
              <line x1="17" y1="65" x2="25" y2="65" stroke="#1a1625" strokeWidth="0.5" />
            </g>
            
            {/* Pen/Pencil */}
            <g>
              <rect x="73" y="32" width="2" height="12" rx="1" fill="#8b7355" />
              <polygon points="73,30 75,30 74,28" fill="#d4a574" />
            </g>
            
            <defs>
              <radialGradient id="outerGradient">
                <stop offset="0%" stopColor="#e6c794" />
                <stop offset="100%" stopColor="#d4a574" />
              </radialGradient>
              <radialGradient id="innerGradient">
                <stop offset="0%" stopColor="#f5f1e8" />
                <stop offset="100%" stopColor="#e6c794" />
              </radialGradient>
              <radialGradient id="sphereGradient">
                <stop offset="0%" stopColor="#e6c794" />
                <stop offset="50%" stopColor="#d4a574" />
                <stop offset="100%" stopColor="#8b7355" />
              </radialGradient>
            </defs>
          </svg>
        </motion.div>
      </div>
      
      {showText && (
        <div className="flex flex-col leading-tight">
          <span className={`font-bold gradient-text ${text}`}>Student</span>
          <span className={`font-bold gradient-text-accent ${text} -mt-1`}>Sphere</span>
        </div>
      )}
    </div>
  )
}

export const NightSandsLogo = StudentSphereLogo
