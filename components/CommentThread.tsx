'use client'

import { useState } from 'react'

interface User {
  id: string
  name: string | null
  image: string | null
}

interface Comment {
  id: string
  content: string
  createdAt: string
  voteScore: number
  user: User
  replies?: Comment[]
}

interface CommentThreadProps {
  comment: Comment
  onReply?: (commentId: string, content: string) => void
  onVote?: (commentId: string, value: number) => void
  depth?: number
}

export default function CommentThread({ 
  comment, 
  onReply, 
  onVote,
  depth = 0 
}: CommentThreadProps) {
  const [isReplying, setIsReplying] = useState(false)
  const [replyContent, setReplyContent] = useState('')
  const [userVote, setUserVote] = useState<number>(0)
  const [currentScore, setCurrentScore] = useState(comment.voteScore)

  const handleVote = async (value: number) => {
    const newVote = userVote === value ? 0 : value
    const scoreDelta = newVote - userVote
    
    setUserVote(newVote)
    setCurrentScore(currentScore + scoreDelta)
    
    if (onVote) {
      onVote(comment.id, value)
    }
  }

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!replyContent.trim()) return

    if (onReply) {
      await onReply(comment.id, replyContent)
      setReplyContent('')
      setIsReplying(false)
    }
  }

  const formatDate = (date: string) => {
    const now = new Date()
    const commentDate = new Date(date)
    const diffMs = now.getTime() - commentDate.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return commentDate.toLocaleDateString()
  }

  const maxDepth = 5

  return (
    <div className={`${depth > 0 ? 'ml-8 mt-4' : 'mt-4'}`}>
      <div className="flex space-x-3">
        <img
          src={comment.user.image || '/default-avatar.png'}
          alt={comment.user.name || 'User'}
          className="w-8 h-8 rounded-full flex-shrink-0"
        />
        
        <div className="flex-1 bg-gray-50 rounded-lg p-3">
          <div className="flex items-center space-x-2 mb-2">
            <span className="font-medium text-sm text-gray-900">
              {comment.user.name || 'Anonymous'}
            </span>
            <span className="text-xs text-gray-500">
              {formatDate(comment.createdAt)}
            </span>
          </div>
          
          <p className="text-gray-700 text-sm mb-2">{comment.content}</p>
          
          <div className="flex items-center space-x-4 text-xs">
            <div className="flex items-center space-x-1">
              <button
                onClick={() => handleVote(1)}
                className={`p-1 rounded hover:bg-gray-200 ${
                  userVote === 1 ? 'text-indigo-600' : 'text-gray-500'
                }`}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" />
                </svg>
              </button>
              <span className={`font-medium ${
                userVote === 1 ? 'text-indigo-600' : userVote === -1 ? 'text-red-600' : 'text-gray-700'
              }`}>
                {currentScore}
              </span>
              <button
                onClick={() => handleVote(-1)}
                className={`p-1 rounded hover:bg-gray-200 ${
                  userVote === -1 ? 'text-red-600' : 'text-gray-500'
                }`}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </button>
            </div>
            
            {depth < maxDepth && (
              <button
                onClick={() => setIsReplying(!isReplying)}
                className="text-gray-500 hover:text-indigo-600 font-medium"
              >
                Reply
              </button>
            )}
          </div>

          {isReplying && (
            <form onSubmit={handleReply} className="mt-3">
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Write a reply..."
                className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                rows={2}
              />
              <div className="flex justify-end space-x-2 mt-2">
                <button
                  type="button"
                  onClick={() => setIsReplying(false)}
                  className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700"
                >
                  Reply
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {comment.replies && comment.replies.length > 0 && (
        <div>
          {comment.replies.map((reply) => (
            <CommentThread
              key={reply.id}
              comment={reply}
              onReply={onReply}
              onVote={onVote}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}
