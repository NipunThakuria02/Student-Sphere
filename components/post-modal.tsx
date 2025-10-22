'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Label } from './ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog'
import { Badge } from './ui/badge'

interface PostModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (post: {
    title: string
    description: string
    category: 'ACADEMIC' | 'NON_ACADEMIC'
    subject?: string
    tags: string[]
  }) => void
}

const subjects = [
  'Mathematics', 'Physics', 'Chemistry', 'Computer Science', 'Electronics',
  'Mechanical Engineering', 'Civil Engineering', 'Electrical Engineering',
  'Data Structures', 'Algorithms', 'Database Management', 'Networks',
  'Machine Learning', 'Web Development', 'Mobile Development'
]

export function PostModal({ isOpen, onClose, onSubmit }: PostModalProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState<'ACADEMIC' | 'NON_ACADEMIC'>('NON_ACADEMIC')
  const [subject, setSubject] = useState('')
  const [tagInput, setTagInput] = useState('')
  const [tags, setTags] = useState<string[]>([])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!title.trim() || !description.trim()) return

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      category,
      subject: category === 'ACADEMIC' ? subject : undefined,
      tags
    })

    // Reset form
    setTitle('')
    setDescription('')
    setCategory('NON_ACADEMIC')
    setSubject('')
    setTags([])
    setTagInput('')
    onClose()
  }

  const handleAddTag = () => {
    const tag = tagInput.trim().toLowerCase()
    if (tag && !tags.includes(tag) && tags.length < 5) {
      setTags([...tags, tag])
      setTagInput('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddTag()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto glass border-[#c4b599]/30">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold gradient-text">
            Create New Post
          </DialogTitle>
          <DialogDescription className="text-[#c4b599]">
            Share your academic questions, doubts, or general discussions with the SRMIST community.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Category Selection */}
          <div className="space-y-2">
            <Label>Category</Label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={category === 'ACADEMIC' ? 'default' : 'outline'}
                className={category === 'ACADEMIC' ? 'bg-[#d4a574] hover:bg-[#c09660] text-[#1a1625]' : ''}
                onClick={() => setCategory('ACADEMIC')}
              >
                Academic
              </Button>
              <Button
                type="button"
                variant={category === 'NON_ACADEMIC' ? 'default' : 'outline'}
                className={category === 'NON_ACADEMIC' ? 'bg-[#d4a574] hover:bg-[#c09660] text-[#1a1625]' : ''}
                onClick={() => setCategory('NON_ACADEMIC')}
              >
                Community
              </Button>
            </div>
          </div>

          {/* Subject Selection (Academic only) */}
          {category === 'ACADEMIC' && (
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Select value={subject} onValueChange={setSubject}>
                <SelectTrigger className="glass border-[#c4b599]/20">
                  <SelectValue placeholder="Select a subject" />
                </SelectTrigger>
                <SelectContent className="glass border-[#c4b599]/20">
                  {subjects.map((subj) => (
                    <SelectItem key={subj} value={subj}>
                      {subj}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              placeholder="What's your question or topic?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="glass border-[#c4b599]/20 focus:ring-2 focus:ring-[#d4a574]/50"
              maxLength={200}
            />
            <div className="text-xs text-[#8b7355] text-right">
              {title.length}/200
            </div>
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              placeholder="Provide more details about your question or topic..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-32 resize-none glass border-[#c4b599]/20 focus:ring-2 focus:ring-[#d4a574]/50"
              maxLength={2000}
            />
            <div className="text-xs text-[#8b7355] text-right">
              {description.length}/2000
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label htmlFor="tags">Tags (Optional)</Label>
            <div className="flex gap-2">
              <Input
                id="tags"
                placeholder="Add a tag and press Enter"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 glass border-[#c4b599]/20"
                disabled={tags.length >= 5}
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleAddTag}
                disabled={!tagInput.trim() || tags.length >= 5}
                className="border-[#c4b599]/30"
              >
                Add
              </Button>
            </div>
            
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="cursor-pointer bg-[#d4a574]/20 text-[#d4a574] hover:bg-[#b85c5c]/20 hover:text-[#b85c5c]"
                    onClick={() => handleRemoveTag(tag)}
                  >
                    {tag} ×
                  </Badge>
                ))}
              </div>
            )}
            <div className="text-xs text-[#8b7355]">
              {tags.length}/5 tags
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-[#c4b599]/30"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-[#d4a574] to-[#e6c794] hover:from-[#c09660] hover:to-[#dab885] text-[#1a1625]"
              disabled={!title.trim() || !description.trim()}
            >
              Post Question
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
