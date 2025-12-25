import React from 'react';
import { Book, BookOpen, Languages } from 'lucide-react';

/**
 * Citation Badge Component
 * Displays citation badges for Bible verses, dictionary entries, and lexicon references
 *
 * @param {Object} props
 * @param {Object} props.citation - Citation object with type, ref, etc.
 * @param {Function} props.onClick - Optional click handler for citation
 */
const CitationBadge = ({ citation, onClick }) => {
  /**
   * Get appropriate icon based on citation type
   */
  const getIcon = () => {
    switch (citation.type) {
      case 'verse':
        return <Book size={14} className="flex-shrink-0" />;
      case 'dictionary':
        return <BookOpen size={14} className="flex-shrink-0" />;
      case 'lexicon':
        return <Languages size={14} className="flex-shrink-0" />;
      default:
        return <Book size={14} className="flex-shrink-0" />;
    }
  };

  /**
   * Get display label based on citation type
   */
  const getLabel = () => {
    switch (citation.type) {
      case 'verse':
        return citation.ref;

      case 'dictionary':
        const sourceName = citation.source === 'SMITHS'
          ? "Smith's"
          : citation.source === 'WEBSTERS'
          ? "Webster's"
          : citation.source;
        return `${citation.entry} (${sourceName})`;

      case 'lexicon':
        return citation.strongsNumber;

      default:
        return citation.ref || 'Reference';
    }
  };

  /**
   * Get background color based on citation type
   */
  const getColorClass = () => {
    switch (citation.type) {
      case 'verse':
        return 'bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600/30';
      case 'dictionary':
        return 'bg-amber-600/20 text-amber-300 hover:bg-amber-600/30';
      case 'lexicon':
        return 'bg-emerald-600/20 text-emerald-300 hover:bg-emerald-600/30';
      default:
        return 'bg-gray-600/20 text-gray-300 hover:bg-gray-600/30';
    }
  };

  const handleClick = () => {
    if (onClick) {
      onClick(citation);
    }
  };

  const colorClass = getColorClass();
  const isClickable = !!onClick;

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md
        transition-colors duration-150
        ${colorClass}
        ${isClickable ? 'cursor-pointer' : ''}
      `}
      onClick={handleClick}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onKeyDown={isClickable ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      } : undefined}
    >
      {getIcon()}
      <span className="truncate max-w-[200px]" title={getLabel()}>
        {getLabel()}
      </span>
    </span>
  );
};

/**
 * Citations List Component
 * Displays a list of citation badges grouped by type
 *
 * @param {Object} props
 * @param {Array} props.citations - Array of citation objects
 * @param {Function} props.onCitationClick - Optional click handler
 */
export const CitationsList = ({ citations, onCitationClick }) => {
  if (!citations || citations.length === 0) {
    return null;
  }

  // Group citations by type
  const groupedCitations = citations.reduce((groups, citation) => {
    const type = citation.type || 'other';
    if (!groups[type]) {
      groups[type] = [];
    }
    groups[type].push(citation);
    return groups;
  }, {});

  // Define order and labels for citation types
  const typeOrder = [
    { key: 'verse', label: 'Scripture References' },
    { key: 'dictionary', label: 'Dictionary Entries' },
    { key: 'lexicon', label: 'Lexicon References' }
  ];

  return (
    <div className="mt-4 space-y-3">
      <div className="text-sm font-semibold text-gray-300 flex items-center gap-2">
        <BookOpen size={16} />
        Sources & Citations
      </div>

      {typeOrder.map(({ key, label }) => {
        const typeCitations = groupedCitations[key];

        if (!typeCitations || typeCitations.length === 0) {
          return null;
        }

        return (
          <div key={key} className="space-y-2">
            <div className="text-xs text-gray-400 font-medium">
              {label} ({typeCitations.length})
            </div>
            <div className="flex flex-wrap gap-2">
              {typeCitations.map((citation, idx) => (
                <CitationBadge
                  key={`${key}-${idx}`}
                  citation={citation}
                  onClick={onCitationClick}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CitationBadge;
