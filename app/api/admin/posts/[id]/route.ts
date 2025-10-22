import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { isAdminEmail } from '@/lib/admin'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin
    if (!isAdminEmail(session.user.email)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { id: postId } = await params

    // Get the post before deleting to notify the author
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: {
        title: true,
        userId: true,
      },
    })

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    // Create notification for the post author
    await prisma.notification.create({
      data: {
        type: 'post_deleted',
        title: 'Post Deleted',
        message: 'Your post has been deleted due to violating the privacy policy of the system.',
        postTitle: post.title,
        userId: post.userId,
        read: false,
      },
    })

    // Delete post (cascade will handle comments, votes, reports)
    const deletedPost = await prisma.post.delete({
      where: { id: postId }
    })

    console.log('Post deleted successfully:', deletedPost.id)
    return NextResponse.json({ message: 'Post deleted successfully' })
  } catch (error) {
    console.error('Error deleting post:', error)
    return NextResponse.json(
      { error: 'Failed to delete post' },
      { status: 500 }
    )
  }
}
