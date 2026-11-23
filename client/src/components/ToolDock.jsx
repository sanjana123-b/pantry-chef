import React from 'react';
import { motion } from 'framer-motion';
import {
  Timer,
  Scale,
  Camera,
  ShieldCheck,
  MessageSquareText,
  ChefHat,
} from 'lucide-react';

/**
 * ToolDock: Floating utility station on desktop and bottom bar on mobile
 */
export default function ToolDock({
  onOpenTimer,
  onOpenConverter,
  onOpenScanner,
  onOpenAllergens,
  onToggleChat,
  isChatOpen,
}) {
  const tools = [
    {
      id: 'timer',
      label: 'Timer',
      icon: Timer,
      color: 'text-tomato',
      bgHover: 'hover:bg-tomato/10',
      action: onOpenTimer,
      ariaLabel: 'Open Kitchen Timer',
    },
    {
      id: 'converter',
      label: 'Convert',
      icon: Scale,
      color: 'text-basil',
      bgHover: 'hover:bg-basil/10',
      action: onOpenConverter,
      ariaLabel: 'Open Measurement Converter',
    },
    {
      id: 'scanner',
      label: 'Scan',
      icon: Camera,
      color: 'text-butter-hover',
      bgHover: 'hover:bg-butter/20',
      action: onOpenScanner,
      ariaLabel: 'Open Fridge Photo Scanner',
    },
    {
      id: 'allergens',
      label: 'Dietary',
      icon: ShieldCheck,
      color: 'text-plum-light',
      bgHover: 'hover:bg-plum/10',
      action: onOpenAllergens,
      ariaLabel: 'Dietary & Allergen Profile',
    },
    {
      id: 'chat',
      label: 'Sous-Chef',
      icon: ChefHat,
      color: isChatOpen ? 'text-white' : 'text-tomato',
      bgActive: 'bg-tomato text-white',
      bgHover: 'hover:bg-tomato/10',
      action: onToggleChat,
      ariaLabel: 'Ask Sous-Chef Chatbot',
      isPrimary: true,
    },
  ];

  return (
    <>
      {/* Desktop Floating Tool Dock (Right-Center Dock) */}
      <aside
        aria-label="Quick Kitchen Tools"
        className="hidden md:flex fixed right-5 top-1/2 -translate-y-1/2 z-40 flex-col items-center gap-2 p-2 bg-paper-card/95 backdrop-blur-md border border-paper-border rounded-2xl shadow-card-elevated"
      >
        <span className="text-[9px] font-bold uppercase tracking-wider text-ink-muted/80 px-1 py-0.5 border-b border-paper-border w-full text-center">
          Tools
        </span>
        {tools.map((tool) => {
          const Icon = tool.icon;
          const isActive = tool.id === 'chat' && isChatOpen;
          return (
            <motion.button
              key={tool.id}
              whileHover={{ scale: 1.12 }}
              whileTap={{ scale: 0.92 }}
              type="button"
              onClick={tool.action}
              aria-label={tool.ariaLabel}
              className={`relative group p-2.5 rounded-xl transition-all flex items-center justify-center cursor-pointer ${
                isActive
                  ? 'bg-tomato text-white shadow-sm'
                  : `text-ink-muted ${tool.bgHover} hover:text-ink`
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-white' : tool.color}`} />
              
              {/* Tooltip on Desktop hover */}
              <span
                role="tooltip"
                className="absolute right-full mr-3.5 px-2.5 py-1 bg-ink text-paper text-xs font-medium rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-md z-50"
              >
                {tool.label}
              </span>
            </motion.button>
          );
        })}
      </aside>

      {/* Mobile Bottom Tab Bar (Fixed bottom on small screens < 768px) */}
      <nav
        aria-label="Mobile Kitchen Utilities"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-paper-card/95 backdrop-blur-md border-t border-paper-border px-3 py-1.5 flex items-center justify-around shadow-card-elevated"
      >
        {tools.map((tool) => {
          const Icon = tool.icon;
          const isActive = tool.id === 'chat' && isChatOpen;
          return (
            <button
              key={tool.id}
              type="button"
              onClick={tool.action}
              aria-label={tool.ariaLabel}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
                isActive
                  ? 'text-tomato font-bold'
                  : 'text-ink-muted hover:text-ink'
              }`}
            >
              <div
                className={`p-1 rounded-lg ${
                  isActive ? 'bg-tomato/15 text-tomato' : ''
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-tomato' : tool.color}`} />
              </div>
              <span className="text-[10px] font-medium leading-tight mt-0.5">
                {tool.label}
              </span>
            </button>
          );
        })}
      </nav>
    </>
  );
}
