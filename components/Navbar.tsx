'use client'

import { Search, Bell, Menu, Clock, AlertCircle, FileText } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { motion, AnimatePresence } from 'framer-motion'
import { StudentSphereLogo } from './student-sphere-logo'
import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'

interface NavbarProps {
  onMenuClick?: () => void
}

interface Notification {
  id: string
  type: string
  title: string
  message: string
  postTitle?: string
  author?: string
  read: boolean
  createdAt: string
  user: {
    name: string
    email: string
  }
}

export function Navbar({ onMenuClick }: NavbarProps) {
  const { data: session } = useSession()
  const [searchQuery, setSearchQuery] = useState('')
  const [showNotifications, setShowNotifications] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const notificationRef = useRef<HTMLDivElement>(null)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`
    }
  }

  const fetchNotifications = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/notifications')
      if (response.ok) {
        const data = await response.json()
        setNotifications(data.notifications || [])
        setUnreadCount(data.unreadCount || 0)
      }
    } catch (error) {
      console.error('Error fetching notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (notificationId: string) => {
    try {
      await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationId }),
      })
      // Refresh notifications
      fetchNotifications()
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  const markAllAsRead = async () => {
    try {
      await fetch('/api/notifications', {
        method: 'POST',
      })
      // Refresh notifications
      fetchNotifications()
    } catch (error) {
      console.error('Error marking all notifications as read:', error)
    }
  }

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications)
    if (!showNotifications) {
      fetchNotifications()
    }
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false)
      }
    }

    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showNotifications])

  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="h-16 glass border-b border-white/10 px-4 flex items-center justify-between sticky top-0 z-50 backdrop-blur-lg"
    >
      {/* Left section */}
      <div className="flex items-center gap-4">
        {onMenuClick && (
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={onMenuClick}
              className="lg:hidden glass-hover"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </motion.div>
        )}
        
        <Link href="/">
          <motion.div 
            className="flex items-center"
            whileHover={{ scale: 1.02 }}
          >
            <StudentSphereLogo 
              size="md" 
              showText={true} 
              animated={false}
              className="hidden sm:flex"
            />
            <StudentSphereLogo 
              size="sm" 
              showText={false} 
              animated={false}
              className="sm:hidden"
            />
          </motion.div>
        </Link>
      </div>

      {/* Center search */}
      <div className="flex-1 max-w-2xl mx-4">
        <motion.form
          onSubmit={handleSearch}
          className="relative"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search posts, topics, or users..."
            className="pl-10 glass border-white/20 focus:border-[#d4a574]/50 focus:ring-2 focus:ring-[#d4a574]/30 transition-all duration-300"
          />
        </motion.form>
      </div>

      {/* Right section */}
      <motion.div 
        className="flex items-center gap-3"
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        {session?.user ? (
          <>
            <div className="relative" ref={notificationRef}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="relative glass-hover"
                  onClick={handleNotificationClick}
                >
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <motion.span 
                      className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <span className="text-xs font-bold text-white">{unreadCount}</span>
                    </motion.span>
                  )}
                </Button>
              </motion.div>

              {/* Notification Dropdown */}
              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-80 glass rounded-lg border border-white/20 shadow-xl overflow-hidden z-50"
                  >
                    <div className="p-4 border-b border-white/10 flex items-center justify-between">
                      <h3 className="font-semibold text-foreground flex items-center gap-2">
                        <Bell className="h-4 w-4 text-[#d4a574]" />
                        Notifications
                      </h3>
                      {unreadCount > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={markAllAsRead}
                          className="text-xs text-[#d4a574] hover:text-[#e6c794]"
                        >
                          Mark all read
                        </Button>
                      )}
                    </div>
                    
                    <div className="max-h-96 overflow-y-auto">
                      {loading ? (
                        <div className="p-4 space-y-3">
                          {[...Array(3)].map((_, i) => (
                            <div key={i} className="animate-pulse">
                              <div className="h-4 bg-[#c4b599]/20 rounded w-3/4 mb-2"></div>
                              <div className="h-3 bg-[#c4b599]/20 rounded w-1/2"></div>
                            </div>
                          ))}
                        </div>
                      ) : notifications.length === 0 ? (
                        <div className="p-8 text-center">
                          <motion.div
                            animate={{ 
                              y: [0, -5, 0],
                            }}
                            transition={{ 
                              duration: 2,
                              repeat: Infinity,
                              ease: "easeInOut"
                            }}
                          >
                            <Bell className="h-12 w-12 text-[#d4a574] mx-auto mb-3 opacity-50" />
                          </motion.div>
                          <p className="text-muted-foreground font-medium">
                            No New Notifications!
                          </p>
                        </div>
                      ) : (
                        <div className="divide-y divide-white/10">
                          {notifications.map((notif, index) => (
                            <motion.div
                              key={notif.id}
                              initial={{ x: -20, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              transition={{ delay: index * 0.05, duration: 0.3 }}
                              className={`p-3 hover:bg-white/5 cursor-pointer transition-colors ${
                                !notif.read && notif.type === 'post_deleted' ? 'bg-red-500/10' : ''
                              }`}
                              onClick={() => {
                                if (notif.type === 'post_deleted') {
                                  markAsRead(notif.id)
                                } else if (notif.type === 'new_post') {
                                  window.location.href = `/posts/${notif.id}`
                                }
                                setShowNotifications(false)
                              }}
                            >
                              <div className="flex items-start gap-2">
                                {notif.type === 'post_deleted' ? (
                                  <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                                ) : (
                                  <FileText className="h-5 w-5 text-[#d4a574] flex-shrink-0 mt-0.5" />
                                )}
                                <div className="flex-1 min-w-0">
                                  <h4 className={`text-sm font-medium line-clamp-2 mb-1 ${
                                    notif.type === 'post_deleted' ? 'text-red-400' : 'text-foreground'
                                  }`}>
                                    {notif.title}
                                  </h4>
                                  {notif.type === 'post_deleted' && notif.postTitle && (
                                    <p className="text-xs text-red-300/80 mb-1 line-clamp-1">
                                      "{notif.postTitle}"
                                    </p>
                                  )}
                                  <p className="text-xs text-muted-foreground mb-1 line-clamp-2">
                                    {notif.message}
                                  </p>
                                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    {notif.author && (
                                      <>
                                        <span>by {notif.author}</span>
                                        <span>•</span>
                                      </>
                                    )}
                                    <span className="flex items-center gap-1">
                                      <Clock className="h-3 w-3" />
                                      {new Date(notif.createdAt).toLocaleDateString()}
                                    </span>
                                  </div>
                                </div>
                                {!notif.read && notif.type === 'post_deleted' && (
                                  <div className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0 mt-1.5"></div>
                                )}
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </div>

                    {notifications.length > 0 && (
                      <div className="p-3 border-t border-white/10 text-center">
                        <Link 
                          href="/"
                          onClick={() => setShowNotifications(false)}
                          className="text-xs text-[#d4a574] hover:text-[#e6c794] transition-colors"
                        >
                          View All Posts
                        </Link>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <Link href="/profile">
              <motion.div 
                className="flex items-center gap-2 cursor-pointer"
                whileHover={{ scale: 1.02 }}
              >
                <Avatar className="w-8 h-8 border-2 border-white/20">
                  <AvatarImage src={session.user.image || ''} />
                  <AvatarFallback className="bg-gradient-to-br from-[#d4a574] to-[#e6c794] text-[#1a1625]">
                    {session.user.name?.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden md:block font-medium text-foreground">{session.user.name}</span>
              </motion.div>
            </Link>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => signOut()}
                className="text-[#ef4444] hover:bg-[#ef4444]/10"
              >
                Logout
              </Button>
            </motion.div>
          </>
        ) : (
          <Link href="/auth/signin">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button size="sm" className="bg-gradient-to-r from-[#d4a574] to-[#e6c794] hover:from-[#c09660] hover:to-[#dab885] text-[#1a1625] border-0 shadow-lg">
                Sign In
              </Button>
            </motion.div>
          </Link>
        )}
      </motion.div>
    </motion.nav>
  )
}
