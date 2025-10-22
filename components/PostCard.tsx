'use client'

import { MessageCircle, Share2, Flag, Clock } from 'lucide-react'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Card, CardContent } from './ui/card'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { UpvoteButton } from './upvote-button'
import { motion } from 'framer-motion'

interface PostCardProps {
  post: {
    id: string
    title: string
    description: string
    author: {
      name: string
      image?: string
      year?: string
      branch?: string
    }
    category: string
    subject?: string
    upvotes: number
    commentCount: number
    createdAt: string
    userVote?: 'up' | null
  }
  onPostClick: (id: string) => void
  onVote: (id: string, type: 'up') => void
  onReport: (id: string) => void
}

export function PostCard({ post, onPostClick, onVote, onReport }: PostCardProps) {
  const timeAgo = new Date(post.createdAt).toLocaleDateString()
  const netScore = post.upvotes

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ scale: 1.01 }}
    >
      <Card className="glass glass-hover hover:shadow-lg transition-all duration-300 cursor-pointer border-0 hover:border-[#d4a574]/40">
        <CardContent className="p-0">
          <div className="flex gap-3 p-4">
            {/* Upvote Section */}
            <div className="flex-shrink-0 pt-1">
              <UpvoteButton
                upvotes={post.upvotes}
                userVote={post.userVote}
                onVote={(type) => onVote(post.id, type)}
                size="sm"
              />
            </div>

            {/* Main Content */}
            <div className="flex-1 min-w-0">
              {/* Header */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2 text-sm text-[#e6c794]">
                  <Avatar className="w-6 h-6">
                    <AvatarImage src={post.author.image || undefined} />
                    <AvatarFallback className="bg-[#d4a574] text-[#1a1625] text-xs">
                      {post.author.name?.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium text-foreground">{post.author.name}</span>
                  {post.author.year && post.author.branch && (
                    <>
                      <span>•</span>
                      <span>{post.author.year} {post.author.branch}</span>
                    </>
                  )}
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{timeAgo}</span>
                  </div>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-1 h-auto text-[#8b7355] hover:text-[#b85c5c]"
                  onClick={(e) => {
                    e.stopPropagation()
                    onReport(post.id)
                  }}
                >
                  <Flag className="h-4 w-4" />
                </Button>
              </div>

              {/* Categories and Subject */}
              <div className="flex items-center gap-2 mb-3">
                <Badge 
                  variant={post.category === 'ACADEMIC' ? 'default' : 'secondary'}
                  className={
                    post.category === 'ACADEMIC' 
                      ? 'bg-[#d4a574] text-[#1a1625] hover:bg-[#c09660]' 
                      : 'bg-[#8b7355] text-[#f5f1e8] hover:bg-[#7a6349]'
                  }
                >
                  {post.category === 'ACADEMIC' ? 'Academic' : 'Community'}
                </Badge>
                {post.subject && (
                  <Badge variant="outline" className="text-xs border-[#d4a574] text-[#d4a574]">
                    {post.subject}
                  </Badge>
                )}
              </div>

              {/* Title and Content */}
              <div onClick={() => onPostClick(post.id)}>
                <h3 className="font-semibold text-lg mb-2 line-clamp-2 text-foreground hover:text-[#d4a574] transition-colors">
                  {post.title}
                </h3>
                <p className="text-[#c4b599] line-clamp-3 mb-3">
                  {post.description}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-4 text-sm text-[#8b7355]">
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-0 h-auto text-[#8b7355] hover:text-[#d4a574]"
                  onClick={() => onPostClick(post.id)}
                >
                  <MessageCircle className="h-4 w-4 mr-1" />
                  {post.commentCount} comments
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-0 h-auto text-[#8b7355] hover:text-[#d4a574]"
                >
                  <Share2 className="h-4 w-4 mr-1" />
                  Share
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
