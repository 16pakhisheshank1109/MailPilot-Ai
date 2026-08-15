import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { emailService } from '../../services/emailService';
import type { Email } from '../../types/email';
import { PriorityBadge } from '../../components/ui/PriorityBadge';
import { CategoryBadge } from '../../components/ui/CategoryBadge';
import { Button } from '../../components/common/Button';
import { LoadingScreen } from '../../components/common/LoadingScreen';
import { ErrorState } from '../../components/common/ErrorState';
import { ArrowLeft, Sparkles, Send } from 'lucide-react';
import { formatRelativeTime } from '../../utils/formatters';

export const EmailDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [email, setEmail] = useState<Email | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [draftReply, setDraftReply] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;
    const fetchDetail = async () => {
      setIsLoading(true);
      try {
        const data = await emailService.getEmailById(id);
        setEmail(data);
        if (data) await emailService.markAsRead(data.id);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  const handleAutoDraft = async () => {
    if (!email) return;
    setIsGenerating(true);
    const draft = await emailService.generateDraftReply(email.id);
    setDraftReply(draft);
    setIsGenerating(false);
  };

  if (isLoading) return <LoadingScreen message="Loading thread details..." />;
  if (!email) return <ErrorState message="Email thread not found." onRetry={() => navigate('/inbox')} />;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Button
        variant="ghost"
        size="sm"
        leftIcon={<ArrowLeft className="w-4 h-4" />}
        onClick={() => navigate('/inbox')}
      >
        Back to Inbox
      </Button>

      {/* Main Email Header */}
      <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-surface-bright flex items-center justify-center font-bold text-lg text-primary border border-white/10">
              {email.sender.initials}
            </div>
            <div>
              <h3 className="font-bold text-base text-on-surface">{email.sender.name}</h3>
              <p className="text-xs text-on-surface-variant">{email.sender.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <PriorityBadge priority={email.priority} />
            <CategoryBadge category={email.category} />
            <span className="text-xs text-on-surface-variant ml-2">{formatRelativeTime(email.timestamp)}</span>
          </div>
        </div>

        <h1 className="text-2xl font-extrabold font-headline text-on-surface">{email.subject}</h1>

        {/* AI Summary Box */}
        {email.aiSummary && (
          <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20 space-y-2">
            <div className="flex items-center gap-2 text-primary font-bold text-xs">
              <Sparkles className="w-4 h-4" />
              <span>AI KEY TAKEAWAYS</span>
            </div>
            <ul className="list-disc list-inside text-xs text-on-surface space-y-1">
              {email.aiSummary.keyTakeaways.map((t, idx) => (
                <li key={idx}>{t}</li>
              ))}
            </ul>
            {email.aiSummary.recommendedAction && (
              <p className="text-xs font-semibold text-primary pt-1">
                Recommended Action: {email.aiSummary.recommendedAction}
              </p>
            )}
          </div>
        )}

        {/* Body Text */}
        <div className="text-sm text-on-surface leading-relaxed whitespace-pre-wrap pt-2">
          {email.body}
        </div>
      </div>

      {/* AI Reply Generator Box */}
      <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-on-surface">Contextual AI Composer</h3>
          <Button
            variant="outline"
            size="sm"
            isLoading={isGenerating}
            leftIcon={<Sparkles className="w-4 h-4 text-primary" />}
            onClick={handleAutoDraft}
          >
            Generate AI Draft Reply
          </Button>
        </div>

        <textarea
          rows={5}
          value={draftReply}
          onChange={(e) => setDraftReply(e.target.value)}
          placeholder="Click 'Generate AI Draft Reply' or write your response..."
          className="w-full bg-surface-container-lowest border border-white/10 rounded-2xl p-4 text-sm text-on-surface focus:ring-2 focus:ring-primary/40 focus:outline-none"
        />

        <div className="flex justify-end gap-3">
          <Button
            variant="primary"
            disabled={!draftReply.trim()}
            leftIcon={<Send className="w-4 h-4" />}
            onClick={() => {
              alert('Email response sent successfully!');
              setDraftReply('');
            }}
          >
            Send Reply
          </Button>
        </div>
      </div>
    </div>
  );
};
