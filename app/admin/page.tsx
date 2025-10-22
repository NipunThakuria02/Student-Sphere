'use client'

import { useState, useEffect } from 'react'
import { Users, FileText, MessageCircle, AlertTriangle, Trash2, Shield, ArrowUpDown, Ban, AlertCircle, CheckCircle, Clock, Flag } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

type TabType = 'overview' | 'reports' | 'users' | 'content'

interface Stats {
  totalUsers: number
  totalPosts: number
  totalComments: number
  pendingReports: number
}

interface Post {
  id: string
  title: string
  description: string
  category: string
  user: {
    name: string
    email: string
  }
  createdAt: string
  _count: {
    comments: number
  }
  voteScore?: number
}

interface Report {
  id: string
  reason: string
  status: 'pending' | 'reviewed' | 'resolved'
  priority: 'low' | 'medium' | 'high'
  createdAt: string
  user: {
    name: string
    email: string
  }
  post?: {
    id: string
    title: string
  }
  comment?: {
    id: string
    content: string
  }
}

interface User {
  id: string
  name: string
  email: string
  status: 'active' | 'warned' | 'suspended'
  createdAt: string
  _count: {
    posts: number
    reports: number
  }
}

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<TabType>('overview')
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalPosts: 0,
    totalComments: 0,
    pendingReports: 0
  })
  const [posts, setPosts] = useState<Post[]>([])
  const [reports, setReports] = useState<Report[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [adminCheckComplete, setAdminCheckComplete] = useState(false)

  // Check if user is admin via API
  useEffect(() => {
    async function checkAdmin() {
      if (status === 'unauthenticated') {
        router.push('/auth/signin?callbackUrl=/admin')
        return
      }
      
      if (status === 'authenticated' && session?.user?.email) {
        try {
          const response = await fetch('/api/admin/stats')
          if (response.ok) {
            setIsAdmin(true)
          } else {
            router.push('/?error=Access denied. Admin privileges required.')
          }
        } catch {
          router.push('/?error=Access denied. Admin privileges required.')
        } finally {
          setAdminCheckComplete(true)
        }
      }
    }
    
    checkAdmin()
  }, [status, session, router])

  // Redirect non-admin users - keeping this for backward compatibility
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/admin')
    } else if (adminCheckComplete && !isAdmin) {
      router.push('/?error=Access denied. Admin privileges required.')
    }
  }, [status, isAdmin, adminCheckComplete, router])

  // Show loading while checking authentication
  if (status === 'loading' || !adminCheckComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Show access denied for non-admin users
  if (adminCheckComplete && !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="mb-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600 mb-4">
              You need admin privileges to access this dashboard.
            </p>
          </div>
          <Button onClick={() => router.push('/')}>
            Go to Home
          </Button>
        </div>
      </div>
    )
  }

  const [deletingPostId, setDeletingPostId] = useState<string | null>(null)

  useEffect(() => {
    fetchStats()
    if (activeTab === 'overview') {
      fetchAllPosts()
    } else if (activeTab === 'reports') {
      fetchReports()
    } else if (activeTab === 'users') {
      fetchUsers()
    }
  }, [activeTab])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const fetchAllPosts = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/posts')
      if (response.ok) {
        const data = await response.json()
        setPosts(data.posts || [])
      }
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchReports = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/reports')
      if (response.ok) {
        const data = await response.json()
        setReports(data.reports || [])
      }
    } catch (error) {
      console.error('Error fetching reports:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/users')
      if (response.ok) {
        const data = await response.json()
        setUsers(data.users || [])
      }
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeletePost = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      return
    }

    try {
      setDeletingPostId(postId)
      const response = await fetch(`/api/admin/posts/${postId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        // Refresh the posts list from server to ensure consistency
        fetchAllPosts()
        fetchStats()
        alert('Post deleted successfully')
      } else {
        alert('Failed to delete post')
      }
    } catch (error) {
      console.error('Error deleting post:', error)
      alert('Error deleting post')
    } finally {
      setDeletingPostId(null)
    }
  }

  const handleUserAction = async (userId: string, action: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: action })
      })

      if (response.ok) {
        fetchUsers()
      } else {
        alert('Failed to update user status')
      }
    } catch (error) {
      console.error('Error updating user:', error)
      alert('Error updating user')
    }
  }

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10'
    },
    {
      title: 'Total Posts',
      value: stats.totalPosts,
      icon: FileText,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10'
    },
    {
      title: 'Total Comments',
      value: stats.totalComments,
      icon: MessageCircle,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10'
    },
    {
      title: 'Pending Reports',
      value: stats.pendingReports,
      icon: AlertTriangle,
      color: 'text-red-500',
      bgColor: 'bg-red-500/10'
    }
  ]

  const tabs = [
    { id: 'overview' as TabType, label: 'Overview', icon: Shield },
    { id: 'reports' as TabType, label: 'Reports', icon: Flag },
    { id: 'users' as TabType, label: 'Users', icon: Users },
    { id: 'content' as TabType, label: 'Content', icon: FileText }
  ]

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-bold gradient-text flex items-center gap-2">
          <Shield className="h-8 w-8 text-[#ec4899]" />
          Admin Dashboard
        </h1>
        <p className="text-muted-foreground mt-1">Manage your Student Sphere community</p>
      </motion.div>

      {/* Tabs Navigation */}
      <motion.div
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="glass rounded-lg p-2 border border-white/10"
      >
        <div className="flex gap-2 flex-wrap">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-[#d4a574] to-[#e6c794] text-[#1a1625] font-semibold'
                    : 'text-muted-foreground hover:bg-white/10'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </motion.button>
            )
          })}
        </div>
      </motion.div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {statCards.map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <Card className="glass border-white/20 hover:border-white/30 transition-all duration-300">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </CardTitle>
                    <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                      <stat.icon className={`h-4 w-4 ${stat.color}`} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold gradient-text">{stat.value}</div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* All Posts Section */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <Card className="glass border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ArrowUpDown className="h-5 w-5 text-[#d4a574]" />
                  All Posts Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="glass rounded-lg p-4 animate-pulse">
                        <div className="h-4 bg-[#c4b599]/20 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-[#c4b599]/20 rounded w-1/2"></div>
                      </div>
                    ))}
                  </div>
                ) : posts.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No posts found</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[600px] overflow-y-auto">
                    {posts.map((post, index) => (
                      <motion.div
                        key={post.id}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: index * 0.05, duration: 0.3 }}
                        className="glass rounded-lg p-4 hover:border-white/30 border border-white/10 transition-all"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 
                                className="font-semibold text-foreground truncate cursor-pointer hover:text-[#d4a574] transition-colors"
                                onClick={() => router.push(`/posts/${post.id}`)}
                              >
                                {post.title}
                              </h3>
                              <Badge 
                                variant="secondary"
                                className={post.category === 'ACADEMIC' 
                                  ? 'bg-blue-500/20 text-blue-400' 
                                  : 'bg-green-500/20 text-green-400'
                                }
                              >
                                {post.category === 'ACADEMIC' ? 'Academic' : 'Community'}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                              {post.description}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span>By: {post.user.name || post.user.email}</span>
                              <span>•</span>
                              <span>{post._count.comments} comments</span>
                              <span>•</span>
                              <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeletePost(post.id)}
                            disabled={deletingPostId === post.id}
                            className="bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30"
                          >
                            {deletingPostId === post.id ? (
                              <span className="flex items-center gap-2">
                                <div className="w-3 h-3 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                                Deleting...
                              </span>
                            ) : (
                              <>
                                <Trash2 className="h-4 w-4 mr-1" />
                                Delete
                              </>
                            )}
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </>
      )}

      {/* Reports Tab */}
      {activeTab === 'reports' && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="glass border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Flag className="h-5 w-5 text-[#ec4899]" />
                Reported Content
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="glass rounded-lg p-4 animate-pulse">
                      <div className="h-4 bg-[#c4b599]/20 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-[#c4b599]/20 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : reports.length === 0 ? (
                <div className="text-center py-12">
                  <AlertCircle className="h-16 w-16 text-[#d4a574] mx-auto mb-4 opacity-50" />
                  <p className="text-muted-foreground">No reports found</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {reports.map((report, index) => (
                    <motion.div
                      key={report.id}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.05, duration: 0.3 }}
                      className="glass rounded-lg p-4 border border-white/10"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge 
                              variant="secondary"
                              className={
                                report.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                                report.status === 'reviewed' ? 'bg-blue-500/20 text-blue-400' :
                                'bg-green-500/20 text-green-400'
                              }
                            >
                              {report.status}
                            </Badge>
                            <Badge 
                              variant="secondary"
                              className={
                                report.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                                report.priority === 'medium' ? 'bg-orange-500/20 text-orange-400' :
                                'bg-gray-500/20 text-gray-400'
                              }
                            >
                              {report.priority} priority
                            </Badge>
                          </div>
                          <p className="text-sm font-medium text-foreground mb-1">
                            <span className="text-muted-foreground">Reason:</span> {report.reason}
                          </p>
                          <p className="text-sm text-muted-foreground mb-1">
                            <span className="font-medium">Reporter:</span> {report.user.name || report.user.email}
                          </p>
                          {report.post && (
                            <p className="text-sm text-muted-foreground mb-1">
                              <span className="font-medium">Post:</span> {report.post.title}
                            </p>
                          )}
                          {report.comment && (
                            <p className="text-sm text-muted-foreground mb-1">
                              <span className="font-medium">Comment:</span> {report.comment.content.substring(0, 50)}...
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground mt-2">
                            <Clock className="h-3 w-3 inline mr-1" />
                            {new Date(report.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="glass border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-[#06b6d4]" />
                User Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="glass rounded-lg p-4 animate-pulse">
                      <div className="h-4 bg-[#c4b599]/20 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-[#c4b599]/20 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : users.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="h-16 w-16 text-[#d4a574] mx-auto mb-4 opacity-50" />
                  <p className="text-muted-foreground">No users found</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {users.map((user, index) => (
                    <motion.div
                      key={user.id}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.05, duration: 0.3 }}
                      className="glass rounded-lg p-4 border border-white/10"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-foreground">
                              {user.name || 'Unnamed User'}
                            </h3>
                            <Badge 
                              variant="secondary"
                              className={
                                user.status === 'active' ? 'bg-green-500/20 text-green-400' :
                                user.status === 'warned' ? 'bg-yellow-500/20 text-yellow-400' :
                                'bg-red-500/20 text-red-400'
                              }
                            >
                              {user.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{user.email}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>📝 {user._count.posts} posts</span>
                            <span>•</span>
                            <span>🚩 {user._count.reports} reports</span>
                            <span>•</span>
                            <span>📅 Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="w-32">
                          <Select
                            value={user.status}
                            onValueChange={(value) => handleUserAction(user.id, value)}
                          >
                            <SelectTrigger className="glass border-white/20 h-9">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="glass border-white/20">
                              <SelectItem value="active">
                                <span className="flex items-center gap-2">
                                  <CheckCircle className="h-3 w-3 text-green-400" />
                                  Active
                                </span>
                              </SelectItem>
                              <SelectItem value="warned">
                                <span className="flex items-center gap-2">
                                  <AlertTriangle className="h-3 w-3 text-yellow-400" />
                                  Warn
                                </span>
                              </SelectItem>
                              <SelectItem value="suspended">
                                <span className="flex items-center gap-2">
                                  <Ban className="h-3 w-3 text-red-400" />
                                  Suspend
                                </span>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Content Tab */}
      {activeTab === 'content' && (
        <motion.div
          initial={{ y: 20, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-center min-h-[400px]"
        >
          <div className="glass rounded-lg p-12 border border-white/10 text-center max-w-md">
            <motion.div
              animate={{ 
                y: [0, -10, 0],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <MessageCircle className="h-20 w-20 text-[#d4a574] mx-auto mb-6" />
            </motion.div>
            <h2 className="text-2xl font-bold gradient-text mb-3">
              Content Management
            </h2>
            <p className="text-muted-foreground text-sm">
              Advanced content moderation tools coming soon
            </p>
          </div>
        </motion.div>
      )}
    </div>
  )
}
