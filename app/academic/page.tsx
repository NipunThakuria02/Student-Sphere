'use client'

import { useState, useEffect } from 'react'
import { Plus, Filter, BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { PostCard } from '@/components/PostCard'
import { PostModal } from '@/components/post-modal'
import { ReportModal } from '@/components/report-modal'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'

export default function AcademicPage() {
  const router = useRouter()
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState('recent')
  const [showPostModal, setShowPostModal] = useState(false)
  const [showReportModal, setShowReportModal] = useState(false)
  const [reportPostId, setReportPostId] = useState('')

  useEffect(() => {
    fetchPosts()
  }, [sortBy])

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/posts?category=ACADEMIC&sort=${sortBy}`)
      if (response.ok) {
        const data = await response.json()
        // Handle both array and object responses
        const postsArray = Array.isArray(data) ? data : data.posts || []
        const postsWithTags = postsArray.map((post: any) => ({
          ...post,
          author: post.user, // Map 'user' to 'author' for PostCard compatibility
          upvotes: post.voteScore || 0,
          commentCount: post.commentCount || post._count?.comments || 0
        }))
        setPosts(postsWithTags)
      }
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleVote = async (postId: string, type: 'up') => {
    try {
      const response = await fetch('/api/votes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId, value: 1 }),
      })
      if (response.ok) fetchPosts()
    } catch (error) {
      console.error('Error voting:', error)
    }
  }

  const handleReport = (postId: string) => {
    setReportPostId(postId)
    setShowReportModal(true)
  }

  const handleSubmitReport = async (report: any) => {
    console.log('Report submitted:', report)
  }

  const handleCreatePost = async (newPost: any) => {
    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPost),
      })
      if (response.ok) fetchPosts()
    } catch (error) {
      console.error('Error creating post:', error)
    }
  }

  const handlePostClick = (id: string) => {
    router.push(`/posts/${id}`)
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <motion.div 
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div>
          <h1 className="text-3xl font-bold gradient-text flex items-center gap-2">
            <BookOpen className="h-8 w-8 text-[#d4a574]" />
            Academic Discussions
          </h1>
          <p className="text-muted-foreground mt-1">Ask questions and share knowledge</p>
        </div>
        
        <Button
          onClick={() => setShowPostModal(true)}
          className="bg-gradient-to-r from-[#d4a574] to-[#e6c794] hover:from-[#c09660] hover:to-[#dab885] text-[#1a1625]"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Post
        </Button>
      </motion.div>

      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-40 glass border-white/20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="glass border-white/20">
              <SelectItem value="recent">Newest</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
              <SelectItem value="top">Most Upvoted</SelectItem>
              <SelectItem value="comments">Most Commented</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4">
        {loading ? (
          [...Array(3)].map((_, i) => (
            <div key={i} className="glass rounded-lg p-6 animate-pulse">
              <div className="h-4 bg-[#c4b599]/20 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-[#c4b599]/20 rounded w-1/2 mb-4"></div>
            </div>
          ))
        ) : posts.length === 0 ? (
          <div className="text-center py-12 glass rounded-lg">
            <h3 className="font-medium text-foreground mb-2">No academic posts yet</h3>
            <p className="text-muted-foreground">Be the first to ask a question!</p>
          </div>
        ) : (
          posts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <PostCard
                post={post}
                onPostClick={handlePostClick}
                onVote={handleVote}
                onReport={handleReport}
              />
            </motion.div>
          ))
        )}
      </div>

      <PostModal
        isOpen={showPostModal}
        onClose={() => setShowPostModal(false)}
        onSubmit={handleCreatePost}
      />

      <ReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        onSubmit={handleSubmitReport}
        contentType="post"
      />
    </div>
  )
}
