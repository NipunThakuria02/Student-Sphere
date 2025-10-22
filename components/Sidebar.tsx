'use client'

import { useState, useEffect } from 'react'
import { Home, BookOpen, Users, Trophy, Settings, Shield, Sparkles, Zap, TrendingUp, MessageCircle, ArrowUp } from 'lucide-react'
import { Button } from './ui/button'
import { Separator } from './ui/separator'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

interface SidebarProps {
  isOpen: boolean
  onClose?: () => void
  isAdmin?: boolean
}

interface TrendingPost {
  id: string
  title: string
  voteScore: number
  commentCount: number
}

export function Sidebar({ isOpen, onClose, isAdmin }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [trendingPosts, setTrendingPosts] = useState<TrendingPost[]>([])
  const [loadingTrending, setLoadingTrending] = useState(true)

  useEffect(() => {
    fetchTrendingPosts()
  }, [])

  const fetchTrendingPosts = async () => {
    try {
      setLoadingTrending(true)
      // Fetch top 5 posts by votes and comments
      const response = await fetch('/api/posts?sort=top&limit=5')
      if (response.ok) {
        const data = await response.json()
        const postsArray = Array.isArray(data) ? data : data.posts || []
        setTrendingPosts(postsArray.slice(0, 5))
      }
    } catch (error) {
      console.error('Error fetching trending posts:', error)
    } finally {
      setLoadingTrending(false)
    }
  }

  const navigation = [
    { id: 'home', label: 'Home Feed', icon: Home, href: '/' },
    { id: 'academic', label: 'Academic', icon: BookOpen, href: '/academic' },
    { id: 'community', label: 'Community', icon: Users, href: '/non-academic' },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy, href: '/leaderboard' },
  ]

  const userNavigation = [
    { id: 'profile', label: 'Profile', icon: Settings, href: '/profile' },
  ]

  const adminNavigation = [
    { id: 'admin', label: 'Admin Dashboard', icon: Shield, href: '/admin' },
  ]

  const isActive = (href: string) => pathname === href

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <motion.aside 
        className={`
          fixed left-0 top-16 h-[calc(100vh-4rem)] glass border-r border-white/10 z-40 transition-transform duration-300 ease-in-out backdrop-blur-lg w-64
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static
        `}
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="p-4 h-full flex flex-col overflow-y-auto">
          {/* Main Navigation */}
          <div className="space-y-2">
            {navigation.map((item, index) => {
              const Icon = item.icon
              const active = isActive(item.href)
              return (
                <motion.div
                  key={item.id}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 * index, duration: 0.4 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link href={item.href} onClick={onClose}>
                    <Button
                      variant="ghost"
                      className={`w-full justify-start gap-3 h-12 glass-hover transition-all duration-300 ${
                        active 
                          ? 'bg-gradient-to-r from-[#6366f1]/20 to-[#8b5cf6]/20 text-[#6366f1] border border-[#6366f1]/30' 
                          : 'hover:bg-white/10 text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      {item.label}
                      {active && (
                        <motion.div
                          className="ml-auto"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        >
                          <Sparkles className="h-3 w-3 text-[#ec4899]" />
                        </motion.div>
                      )}
                    </Button>
                  </Link>
                </motion.div>
              )
            })}
          </div>

          <Separator className="my-4 bg-white/10" />

          {/* Trending Section */}
          <div className="space-y-2">
            <motion.h3 
              className="px-3 py-2 text-sm font-medium text-muted-foreground flex items-center gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <TrendingUp className="h-4 w-4 text-[#d4a574]" />
              Trending Posts
            </motion.h3>
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.4 }}
            >
              <div className="px-3 py-2 text-sm space-y-2">
                {loadingTrending ? (
                  <div className="space-y-2">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="h-8 bg-[#c4b599]/10 rounded animate-pulse" />
                    ))}
                  </div>
                ) : trendingPosts.length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground">
                    <p className="text-xs">No posts generated</p>
                  </div>
                ) : (
                  trendingPosts.map((post, index) => (
                    <motion.div
                      key={post.id}
                      initial={{ x: -10, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.7 + index * 0.1 }}
                      className="group cursor-pointer"
                      onClick={() => {
                        router.push(`/posts/${post.id}`)
                        onClose?.()
                      }}
                    >
                      <div className="p-2 rounded-lg hover:bg-white/5 transition-all">
                        <p className="text-[#c4b599] group-hover:text-[#d4a574] transition-colors line-clamp-2 mb-1">
                          {post.title}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <ArrowUp className="h-3 w-3" />
                            {post.voteScore || 0}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageCircle className="h-3 w-3" />
                            {post.commentCount || 0}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          </div>

          <Separator className="my-4 bg-white/10" />

          {/* Admin Navigation */}
          {isAdmin && (
            <>
              <div className="space-y-2">
                <motion.h3 
                  className="px-3 py-2 text-sm font-medium text-muted-foreground flex items-center gap-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <Shield className="h-4 w-4 text-[#ec4899]" />
                  Admin
                </motion.h3>
                {adminNavigation.map((item, index) => {
                  const Icon = item.icon
                  const active = isActive(item.href)
                  return (
                    <motion.div
                      key={item.id}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.6 + 0.1 * index, duration: 0.4 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Link href={item.href} onClick={onClose}>
                        <Button
                          variant="ghost"
                          className={`w-full justify-start gap-3 h-12 glass-hover transition-all duration-300 ${
                            active 
                              ? 'bg-gradient-to-r from-[#ec4899]/20 to-[#f43f5e]/20 text-[#ec4899] border border-[#ec4899]/30' 
                              : 'hover:bg-white/10 text-muted-foreground hover:text-foreground'
                          }`}
                        >
                          <Icon className="h-5 w-5" />
                          {item.label}
                        </Button>
                      </Link>
                    </motion.div>
                  )
                })}
              </div>
              <Separator className="my-4 bg-white/10" />
            </>
          )}

          {/* User Navigation */}
          <div className="mt-auto space-y-2">
            {userNavigation.map((item, index) => {
              const Icon = item.icon
              const active = isActive(item.href)
              return (
                <motion.div
                  key={item.id}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.8 + 0.1 * index, duration: 0.4 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link href={item.href} onClick={onClose}>
                    <Button
                      variant="ghost"
                      className={`w-full justify-start gap-3 h-12 glass-hover transition-all duration-300 ${
                        active 
                          ? 'bg-gradient-to-r from-[#06b6d4]/20 to-[#0891b2]/20 text-[#06b6d4] border border-[#06b6d4]/30' 
                          : 'hover:bg-white/10 text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      {item.label}
                    </Button>
                  </Link>
                </motion.div>
              )
            })}
          </div>
        </div>
      </motion.aside>
    </>
  )
}
