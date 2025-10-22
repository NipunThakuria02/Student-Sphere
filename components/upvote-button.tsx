'use client'

import { Button } from './ui/button'
import { motion } from 'framer-motion'

interface UpvoteButtonProps {
  upvotes: number
  userVote?: 'up' | null
  onVote: (type: 'up') => void
  size?: 'sm' | 'md'
}

// Custom upvote SVG icon
const UpvoteIcon = ({ className, isUpvoted }: { className?: string; isUpvoted: boolean }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 6L8 10H10V16H14V10H16L12 6Z"
      fill={isUpvoted ? '#d4a574' : 'currentColor'}
      stroke={isUpvoted ? '#d4a574' : 'currentColor'}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M6 20H18"
      stroke={isUpvoted ? '#d4a574' : 'currentColor'}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
)

export function UpvoteButton({ 
  upvotes, 
  userVote, 
  onVote, 
  size = 'md' 
}: UpvoteButtonProps) {
  const isSmall = size === 'sm'
  const isUpvoted = userVote === 'up'

  const handleVote = () => {
    onVote('up')
  }

  return (
    <div className={`flex flex-col items-center gap-2 ${isSmall ? 'scale-90' : ''}`}>
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          variant="ghost"
          size="sm"
          className={`
            p-2 h-auto rounded-full transition-all duration-300 glass-hover relative overflow-hidden group
            ${isUpvoted 
              ? 'bg-gradient-to-r from-[#d4a574]/30 to-[#e6c794]/20 border border-[#d4a574]/50 shadow-lg shadow-[#d4a574]/20' 
              : 'hover:bg-white/10 border border-transparent hover:border-[#d4a574]/30 text-muted-foreground hover:text-[#d4a574]'
            }
          `}
          onClick={handleVote}
        >
          <UpvoteIcon 
            className={`
              transition-all duration-300 
              ${isSmall ? 'w-4 h-4' : 'w-6 h-6'}
            `}
            isUpvoted={isUpvoted}
          />
          
          {isUpvoted && (
            <motion.div
              className="absolute inset-0 rounded-full bg-gradient-to-r from-[#d4a574]/20 to-[#e6c794]/20"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
            />
          )}
        </Button>
      </motion.div>
      
      <motion.span 
        className={`
          font-medium transition-colors duration-300 min-w-[2rem] text-center
          ${isUpvoted ? 'text-[#d4a574] font-semibold' : upvotes > 0 ? 'text-[#d4a574]' : 'text-muted-foreground'}
          ${isSmall ? 'text-sm' : 'text-base'}
        `}
        key={upvotes}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        {upvotes > 0 ? `+${upvotes}` : upvotes}
      </motion.span>
    </div>
  )
}
