import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Leaf, Flame, Tag } from 'lucide-react';
import ChefMascot from './ChefMascot';

export default function WasteTrackerBanner({
  expiringItems = [],
  onPrioritizeExpiring,
}) {
  if (expiringItems.length === 0) {
    return (
      <div className="w-full bg-paper-card border border-paper-border rounded-card p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-basil/15 text-basil flex items-center justify-center flex-shrink-0">
            <Leaf className="w-4 h-4" />
          </div>
          <div>
            <span className="font-heading font-bold text-sm text-ink block">
              Pantry Freshness Status
            </span>
            <span className="text-xs text-ink-muted">
              All ingredients in your pantry are fresh. Zero items expiring today.
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs text-ink-muted bg-paper-muted px-3.5 py-1.5 rounded-full border border-paper-border">
          <span className="text-basil font-semibold flex items-center gap-1">
            🌱 2.8kg Rescued
          </span>
          <span>•</span>
          <span className="text-tomato font-semibold flex items-center gap-1">
            💵 $34.50 Saved
          </span>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full bg-butter/10 border border-butter/40 rounded-card p-4 sm:p-5 shadow-card-soft space-y-3"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          {/* Mascot holding "use me first" badge */}
          <div className="relative flex-shrink-0 flex items-center">
            <ChefMascot mood="idle" size={48} />
            <span className="absolute -bottom-1 -right-2 bg-tomato text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-sm flex items-center gap-0.5 whitespace-nowrap">
              <Tag className="w-2.5 h-2.5" />
              Use me first
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-heading font-bold text-sm sm:text-base text-ink">
                Expiring Soon Alert
              </h4>
              <span className="text-xs bg-tomato text-white px-2 py-0.5 rounded-full font-semibold">
                {expiringItems.length} {expiringItems.length === 1 ? 'item' : 'items'}
              </span>
            </div>
            <p className="text-xs text-ink-muted mt-0.5">
              Cook these within 24–48 hours to prevent waste:{' '}
              <strong className="text-ink">{expiringItems.join(', ')}</strong>
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onPrioritizeExpiring}
          className="self-start sm:self-auto px-4 py-2.5 bg-tomato hover:bg-tomato-hover text-white rounded-btn text-xs font-semibold transition-all shadow-sm flex items-center gap-2 flex-shrink-0 cursor-pointer"
        >
          <Flame className="w-4 h-4 text-butter" />
          <span>Cook Expiring First</span>
        </button>
      </div>
    </motion.div>
  );
}
