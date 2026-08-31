import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Sparkles, Leaf, DollarSign, ArrowRight, Flame } from 'lucide-react';

export default function WasteTrackerBanner({
  expiringItems = [],
  onPrioritizeExpiring,
}) {
  if (expiringItems.length === 0) {
    return (
      <div className="w-full bg-[#FAF5E8] border border-[#E3D7BE] rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-sage/20 text-sage-hover">
            <Leaf className="w-4 h-4" />
          </div>
          <div>
            <span className="font-serif font-bold text-xs sm:text-sm text-charcoal block">
              Pantry Freshness Ledger
            </span>
            <span className="text-[11px] font-sans text-charcoal-muted">
              All ingredients in your jars are fresh. Zero items expiring today.
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono text-charcoal-muted bg-[#F4ECDB] px-3 py-1.5 rounded-xl border border-[#DECFA4]">
          <span className="text-sage-hover font-bold flex items-center gap-1">
            🌱 2.8kg Rescued
          </span>
          <span>•</span>
          <span className="text-tomato font-bold flex items-center gap-1">
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
      className="w-full bg-[#FDF4E7] border-2 border-[#E9C378] rounded-2xl p-4 sm:p-5 shadow-card-soft space-y-3"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-mustard/30 text-charcoal border border-mustard/40 mt-0.5">
            <AlertTriangle className="w-5 h-5 text-tomato" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-serif font-bold text-sm sm:text-base text-charcoal">
                Use-First Freshness Alert!
              </h4>
              <span className="font-mono text-[10px] bg-tomato text-white px-2 py-0.5 rounded-full font-bold uppercase">
                {expiringItems.length} {expiringItems.length === 1 ? 'Item' : 'Items'} Expiring Soon
              </span>
            </div>
            <p className="text-xs text-charcoal-muted font-sans mt-0.5">
              These ingredients should be cooked within 24–48 hours to prevent food waste:{' '}
              <strong className="text-charcoal">{expiringItems.join(', ')}</strong>
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onPrioritizeExpiring}
          className="self-start sm:self-auto px-4 py-2 bg-tomato hover:bg-tomato-hover text-white rounded-xl text-xs font-mono font-bold transition-all shadow-sm flex items-center gap-1.5 flex-shrink-0"
        >
          <Flame className="w-3.5 h-3.5 text-mustard" />
          <span>Cook Expiring First</span>
        </button>
      </div>
    </motion.div>
  );
}
