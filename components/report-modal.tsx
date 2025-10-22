'use client'

import { useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import { Button } from './ui/button'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import { RadioGroup, RadioGroupItem } from './ui/radio-group'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog'

interface ReportModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (report: {
    reason: string
    details: string
  }) => void
  contentType: 'post' | 'comment'
}

const reportReasons = [
  { id: 'spam', label: 'Spam or repetitive content' },
  { id: 'harassment', label: 'Harassment or bullying' },
  { id: 'inappropriate', label: 'Inappropriate content' },
  { id: 'misinformation', label: 'Misinformation' },
  { id: 'academic-misconduct', label: 'Academic misconduct' },
  { id: 'off-topic', label: 'Off-topic or irrelevant' },
  { id: 'other', label: 'Other' }
]

export function ReportModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  contentType 
}: ReportModalProps) {
  const [selectedReason, setSelectedReason] = useState('')
  const [details, setDetails] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedReason) return

    onSubmit({
      reason: selectedReason,
      details: details.trim(),
    })

    // Reset form
    setSelectedReason('')
    setDetails('')
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md glass border-[#c4b599]/30">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-[#b85c5c]">
            <AlertTriangle className="h-5 w-5" />
            Report {contentType}
          </DialogTitle>
          <DialogDescription className="text-[#c4b599]">
            Help us keep Student Sphere safe and respectful. Your report will be reviewed by our moderation team.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Reason Selection */}
          <div className="space-y-3">
            <Label>Why are you reporting this {contentType}?</Label>
            <RadioGroup value={selectedReason} onValueChange={setSelectedReason}>
              {reportReasons.map((reason) => (
                <div key={reason.id} className="flex items-center space-x-2">
                  <RadioGroupItem value={reason.id} id={reason.id} />
                  <Label htmlFor={reason.id} className="cursor-pointer text-foreground">
                    {reason.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Additional Details */}
          <div className="space-y-2">
            <Label htmlFor="details">Additional details (optional)</Label>
            <Textarea
              id="details"
              placeholder="Provide any additional context that might help our review..."
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              className="min-h-20 resize-none glass border-[#c4b599]/20"
              maxLength={500}
            />
            <div className="text-xs text-[#8b7355] text-right">
              {details.length}/500
            </div>
          </div>

          {/* Warning */}
          <div className="glass border-[#d4a574]/30 rounded-lg p-3">
            <p className="text-sm text-[#d4a574]">
              <strong>Note:</strong> False reports may result in action against your account. 
              Please only report content that genuinely violates our community guidelines.
            </p>
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
              className="bg-gradient-to-r from-[#b85c5c] to-[#a04848] hover:from-[#a04848] hover:to-[#8b3d3d] text-[#f5f1e8]"
              disabled={!selectedReason}
            >
              Submit Report
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
