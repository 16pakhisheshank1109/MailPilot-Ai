import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEmail } from '../../hooks/useEmail';
import { SearchBar } from '../../components/common/SearchBar';
import { EmailCard } from '../../components/ui/EmailCard';
import { SkeletonLoader } from '../../components/common/SkeletonLoader';
import { EmptyState } from '../../components/common/EmptyState';
import type { EmailCategory } from '../../types/email';

export const InboxPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<EmailCategory | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const { emails, isLoading, toggleStar, archiveEmail } = useEmail({
    category: activeTab,
    searchQuery,
  });
  const navigate = useNavigate();

  const categories: (EmailCategory | 'All')[] = [
    'All',
    'Career',
    'System',
    'Design',
    'Newsletters',
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold font-headline text-on-surface">Inbox Workstation</h2>
          <p className="text-xs text-on-surface-variant mt-1">
            Real-time synchronized emails categorized by AI priority engine.
          </p>
        </div>
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-white/10">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveTab(cat)}
            className={`px-4 py-2 text-xs font-semibold rounded-2xl transition-all whitespace-nowrap ${
              activeTab === cat
                ? 'bg-primary text-on-primary shadow-md'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-white/5'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Email Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <SkeletonLoader count={6} className="h-56" />
        </div>
      ) : emails.length === 0 ? (
        <EmptyState
          title="No emails match your filter"
          description="Try selecting a different category or clearing your search term."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {emails.map((email) => (
            <EmailCard
              key={email.id}
              email={email}
              onSelect={(e) => navigate(`/inbox/${e.id}`)}
              onToggleStar={toggleStar}
              onArchive={archiveEmail}
            />
          ))}
        </div>
      )}
    </div>
  );
};
