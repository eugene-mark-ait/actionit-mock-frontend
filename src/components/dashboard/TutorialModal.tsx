import React, { useState, useEffect, useRef } from 'react';
import { X, Play, Clock, CheckCircle2 } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';

export interface Tutorial {
  id: string;
  platform: string;
  title: string;
  duration: string;
  thumbnail: string;
  videoUrl: string;
  steps: Array<{ title: string; description: string; timestamp?: number }>;
  connected: boolean;
}

interface TutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
  tutorial: Tutorial | null;
  suggestedTutorials: Tutorial[];
  onSuggestedClick: (tutorial: Tutorial) => void;
}

export const TutorialModal: React.FC<TutorialModalProps> = ({
  isOpen,
  onClose,
  tutorial,
  suggestedTutorials,
  onSuggestedClick,
}) => {
  const [isHelpful, setIsHelpful] = useState<boolean | null>(null);
  const [comment, setComment] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (isOpen && tutorial) {
      setIsHelpful(null);
      setComment('');
    }
  }, [isOpen, tutorial]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!tutorial) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl w-[calc(100vw-1rem)] sm:w-full h-[85vh] sm:h-[90vh] lg:h-[90vh] p-0 gap-0 bg-white border border-transparent shadow-lg overflow-hidden" style={{
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        backgroundImage: 'linear-gradient(white, white), linear-gradient(to right, #0099cb, #00c6f3)',
        backgroundOrigin: 'border-box',
        backgroundClip: 'padding-box, border-box'
      }}>
        <div className="flex flex-col lg:flex-row h-full">
          {/* LEFT: Main Video Section (~70%) */}
          <div className="flex-1 flex flex-col lg:border-r border-transparent min-h-0 overflow-hidden" style={{
        borderImage: 'linear-gradient(to bottom, #0099cb, #00c6f3) 1'
      }}>
            {/* Sticky Video Section - Mobile: Sticky, Desktop: Normal */}
            <div className="flex-shrink-0 sticky top-0 z-10 lg:static lg:z-0 flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-3 sm:p-4 border-b-2 border-blue-200 bg-gradient-to-r from-blue-50/50 to-purple-50/50 bg-white">
                <div className="flex-1 min-w-0 pr-2">
                  <h2 className="text-base sm:text-lg md:text-xl font-semibold bg-gradient-to-r from-[#0099cb] to-[#00c6f3] bg-clip-text text-transparent truncate">
                    {tutorial.title}
                  </h2>
                  <div className="flex items-center gap-1.5 sm:gap-2 mt-1 flex-wrap">
                    <Badge variant="secondary" className="text-[10px] sm:text-xs bg-gradient-to-r from-[#0099cb]/10 to-[#00c6f3]/10 bg-gradient-to-r from-[#0099cb] to-[#00c6f3] bg-clip-text text-transparent border border-transparent" style={{
                      backgroundImage: 'linear-gradient(white, white), linear-gradient(to right, #0099cb, #00c6f3)',
                      backgroundOrigin: 'border-box',
                      backgroundClip: 'padding-box, border-box'
                    }}>
                      {tutorial.platform}
                    </Badge>
                    <span className="text-[10px] sm:text-xs bg-gradient-to-r from-[#0099cb] to-[#00c6f3] bg-clip-text text-transparent font-medium flex items-center gap-1">
                      <Clock className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                      {tutorial.duration}
                    </span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="ml-2 sm:ml-4 hover:bg-blue-50 hover:text-blue-600 transition-colors flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10"
                  aria-label="Close modal"
                >
                  <X className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </div>

              {/* Video Player */}
              <div className="bg-gradient-to-br from-[#0099cb] to-[#00c6f3] relative h-[200px] sm:h-[250px] md:h-[300px] lg:flex-1 lg:min-h-[400px]">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="mb-4">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white backdrop-blur-sm flex items-center justify-center mx-auto shadow-lg ring-4 ring-[#0099cb]/30">
                        <Play className="h-8 w-8 sm:h-10 sm:w-10 ml-1 bg-gradient-to-r from-[#0099cb] to-[#00c6f3] bg-clip-text text-transparent" fill="currentColor" style={{ color: '#0099cb' }} />
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm text-white font-medium">Video Player Placeholder</p>
                    <p className="text-[10px] sm:text-xs text-white/80 mt-1">{tutorial.videoUrl}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Scrollable Content Section - Everything below video scrolls together on mobile */}
            <div className="flex-1 overflow-y-auto overscroll-contain lg:overflow-visible lg:flex lg:flex-col lg:min-h-0">
              {/* Feedback Section (Below Video) */}
              <div className="border-t border-transparent bg-white flex flex-col flex-shrink-0 lg:flex-shrink-0" style={{
        borderImage: 'linear-gradient(to right, #0099cb, #00c6f3) 1'
      }}>
                <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
                  {/* Helpful Question */}
                  <div className="space-y-2">
                    <p className="text-sm sm:text-base font-medium text-gray-900">
                      Was this video helpful?
                    </p>
                    <div className="flex items-center gap-3">
                      <Button
                        variant={isHelpful === true ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setIsHelpful(true)}
                        className={`h-9 px-4 transition-all ${
                          isHelpful === true
                            ? 'bg-gradient-to-r from-[#0099cb] to-[#00c6f3] text-white border-0 shadow-md'
                            : 'border border-transparent hover:bg-gradient-to-r hover:from-[#0099cb]/10 hover:to-[#00c6f3]/10'
                        }`}
                        style={isHelpful === true ? {
                        } : {
                          backgroundImage: 'linear-gradient(white, white), linear-gradient(to right, #0099cb, #00c6f3)',
                          backgroundOrigin: 'border-box',
                          backgroundClip: 'padding-box, border-box'
                        }}
                      >
                        <CheckCircle2 className="h-4 w-4 mr-1.5" />
                        Yes
                      </Button>
                      <Button
                        variant={isHelpful === false ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setIsHelpful(false)}
                        className={`h-9 px-4 transition-all ${
                          isHelpful === false
                            ? 'bg-gradient-to-r from-red-500 to-red-600 text-white border-0 shadow-md'
                            : 'border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                        }`}
                      >
                        <X className="h-4 w-4 mr-1.5" />
                        No
                      </Button>
                    </div>
                  </div>

                  {/* Comment Input */}
                  <div className="space-y-2">
                    <label htmlFor="tutorial-comment" className="text-xs sm:text-sm font-medium text-gray-700">
                      Share your thoughts (optional)
                    </label>
                    <Textarea
                      id="tutorial-comment"
                      placeholder="Tell us what you think..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="min-h-[60px] sm:min-h-[70px] max-h-[100px] text-sm resize-none border border-gray-200 focus:border-transparent"
                      onFocus={(e) => {
                        e.target.style.backgroundImage = 'linear-gradient(white, white), linear-gradient(to right, #0099cb, #00c6f3)';
                        e.target.style.backgroundOrigin = 'border-box';
                        e.target.style.backgroundClip = 'padding-box, border-box';
                      }}
                      onBlur={(e) => {
                        e.target.style.backgroundImage = '';
                        e.target.style.backgroundOrigin = '';
                        e.target.style.backgroundClip = '';
                        e.target.style.borderColor = '';
                      }}
                      rows={3}
                    />
                  </div>
                </div>
              </div>

              {/* Suggested Videos - Mobile: Below feedback (scrolls with feedback), Desktop: Sidebar */}
              <div className="w-full lg:hidden border-t border-transparent bg-white flex flex-col flex-shrink-0" style={{
        borderImage: 'linear-gradient(to right, #0099cb, #00c6f3) 1'
      }}>
                <div className="p-3 sm:p-4 border-b border-transparent bg-white flex-shrink-0" style={{
        borderImage: 'linear-gradient(to right, #0099cb, #00c6f3) 1'
      }}>
                  <h3 className="font-semibold text-sm sm:text-base bg-gradient-to-r from-[#0099cb] to-[#00c6f3] bg-clip-text text-transparent">
                    Suggested Tutorials
                  </h3>
                </div>
                {/* Removed nested scroll - now scrolls with parent container */}
                <div className="p-2 space-y-2">
                  {suggestedTutorials.map((suggested) => (
                    <div
                      key={suggested.id}
                      className="flex gap-2 sm:gap-3 p-2 rounded-lg hover:bg-gradient-to-r hover:from-[#0099cb]/10 hover:to-[#00c6f3]/10 cursor-pointer transition-all duration-300 group border border-transparent"
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundImage = 'linear-gradient(white, white), linear-gradient(to right, #0099cb, #00c6f3)';
                        e.currentTarget.style.backgroundOrigin = 'border-box';
                        e.currentTarget.style.backgroundClip = 'padding-box, border-box';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundImage = '';
                        e.currentTarget.style.backgroundOrigin = '';
                        e.currentTarget.style.backgroundClip = '';
                      }}
                      onClick={() => onSuggestedClick(suggested)}
                    >
                      <div className="relative w-24 h-16 sm:w-32 sm:h-20 flex-shrink-0 rounded bg-gradient-to-r from-[#0099cb]/10 to-[#00c6f3]/10 overflow-hidden ring-2 ring-[#0099cb]/50 group-hover:ring-[#00c6f3] transition-all">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Play className="h-5 w-5 sm:h-6 sm:w-6 bg-gradient-to-r from-[#0099cb] to-[#00c6f3] bg-clip-text text-transparent opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: '#0099cb' }} />
                        </div>
                        <div className="absolute bottom-1 right-1">
                          <div className="bg-gradient-to-r from-[#0099cb] to-[#00c6f3] text-white text-[10px] sm:text-xs px-1 rounded flex items-center gap-0.5 sm:gap-1">
                            <Clock className="h-2 w-2" />
                            {suggested.duration}
                          </div>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-xs sm:text-sm text-gray-900 line-clamp-2 group-hover:bg-gradient-to-r group-hover:from-[#0099cb] group-hover:to-[#00c6f3] group-hover:bg-clip-text group-hover:text-transparent transition-all">
                          {suggested.title}
                        </h4>
                        <p className="text-[10px] sm:text-xs bg-gradient-to-r from-[#0099cb] to-[#00c6f3] bg-clip-text text-transparent font-medium mt-0.5 sm:mt-1">{suggested.platform}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Suggested Videos Sidebar (~30%) - Desktop only */}
          <div className="hidden lg:flex lg:w-80 lg:border-l border-transparent bg-white flex-col" style={{
        borderImage: 'linear-gradient(to bottom, #0099cb, #00c6f3) 1'
      }}>
            <div className="p-3 sm:p-4 border-b border-transparent bg-white flex-shrink-0" style={{
        borderImage: 'linear-gradient(to right, #0099cb, #00c6f3) 1'
      }}>
              <h3 className="font-semibold text-sm sm:text-base bg-gradient-to-r from-[#0099cb] to-[#00c6f3] bg-clip-text text-transparent">
                Suggested Tutorials
              </h3>
            </div>
            <div className="flex-1 overflow-y-auto">
              <div className="p-2 space-y-2">
                {suggestedTutorials.map((suggested) => (
                  <div
                    key={suggested.id}
                    className="flex gap-2 sm:gap-3 p-2 rounded-lg hover:bg-gradient-to-r hover:from-[#0099cb]/10 hover:to-[#00c6f3]/10 cursor-pointer transition-all duration-300 group border border-transparent"
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundImage = 'linear-gradient(white, white), linear-gradient(to right, #0099cb, #00c6f3)';
                        e.currentTarget.style.backgroundOrigin = 'border-box';
                        e.currentTarget.style.backgroundClip = 'padding-box, border-box';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundImage = '';
                        e.currentTarget.style.backgroundOrigin = '';
                        e.currentTarget.style.backgroundClip = '';
                      }}
                    onClick={() => onSuggestedClick(suggested)}
                  >
                    <div className="relative w-24 h-16 sm:w-32 sm:h-20 flex-shrink-0 rounded bg-gradient-to-r from-[#0099cb]/10 to-[#00c6f3]/10 overflow-hidden ring-2 ring-[#0099cb]/50 group-hover:ring-[#00c6f3] transition-all" style={{
                      boxShadow: '0 0 4px rgba(0, 153, 203, 0.2)'
                    }}>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Play className="h-5 w-5 sm:h-6 sm:w-6 bg-gradient-to-r from-[#0099cb] to-[#00c6f3] bg-clip-text text-transparent opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: '#0099cb' }} />
                      </div>
                      <div className="absolute bottom-1 right-1">
                        <div className="bg-gradient-to-r from-[#0099cb] to-[#00c6f3] text-white text-[10px] sm:text-xs px-1 rounded flex items-center gap-0.5 sm:gap-1">
                          <Clock className="h-2 w-2" />
                          {suggested.duration}
                        </div>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-xs sm:text-sm text-gray-900 line-clamp-2 group-hover:bg-gradient-to-r group-hover:from-[#0099cb] group-hover:to-[#00c6f3] group-hover:bg-clip-text group-hover:text-transparent transition-all group-hover:drop-shadow-[0_0_6px_rgba(0,153,203,0.5)]">
                        {suggested.title}
                      </h4>
                      <p className="text-[10px] sm:text-xs bg-gradient-to-r from-[#0099cb] to-[#00c6f3] bg-clip-text text-transparent font-medium mt-0.5 sm:mt-1">{suggested.platform}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
