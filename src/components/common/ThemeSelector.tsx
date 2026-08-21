import React, { useState, useRef, useEffect } from 'react';
import { Palette, Sun, Moon, Monitor, Check } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { ThemePreset, ThemeMode } from '../../types';

export const ThemeSelector: React.FC = () => {
  const { preset, mode, setPreset, setMode } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const presets: { id: ThemePreset; name: string; desc: string; colors: string[] }[] = [
    {
      id: 'immersive-dark',
      name: 'Immersive Dark',
      desc: 'Slate-950 canvas with glowing electric blue & indigo',
      colors: ['#020617', '#3b82f6', '#6366f1'],
    },
    {
      id: 'professional-light',
      name: 'Professional Light',
      desc: 'Clean navy & slate enterprise look',
      colors: ['#1e40af', '#0d9488', '#f8fafc'],
    },
    {
      id: 'midnight',
      name: 'Midnight',
      desc: 'Dark navy slate with vibrant blue',
      colors: ['#0b0f19', '#3b82f6', '#14b8a6'],
    },
    {
      id: 'aurora',
      name: 'Aurora',
      desc: 'Deep indigo & purple gradient',
      colors: ['#0d0f1d', '#6366f1', '#a855f7'],
    },
    {
      id: 'campus-green',
      name: 'Campus Green',
      desc: 'Emerald & sage campus aesthetic',
      colors: ['#059669', '#0d9488', '#f4f8f6'],
    },
    {
      id: 'high-contrast',
      name: 'High Contrast',
      desc: 'Maximum accessibility & stark borders',
      colors: ['#000000', '#ffffff', '#0000ee'],
    },
  ];

  const modes: { id: ThemeMode; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'light', label: 'Light', icon: Sun },
    { id: 'dark', label: 'Dark', icon: Moon },
    { id: 'system', label: 'System', icon: Monitor },
  ];

  return (
    <div className="relative" ref={dropdownRef} id="theme-selector-container">
      <button
        id="theme-selector-button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg border border-theme-subtle bg-surface text-theme-secondary hover:text-theme-primary hover:bg-surface-hover transition-colors shadow-sm"
        title="Change Theme & Appearance"
      >
        <Palette className="w-4 h-4 text-theme-muted" />
        <span className="hidden sm:inline capitalize">{preset.replace('-', ' ')}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 rounded-xl border border-theme-subtle bg-surface shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95">
          {/* Mode Selector */}
          <div className="mb-3">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-theme-muted mb-2 px-1">
              Display Mode
            </p>
            <div className="grid grid-cols-3 gap-1 p-1 bg-surface-elevated rounded-lg border border-theme-subtle">
              {modes.map(m => {
                const Icon = m.icon;
                const active = mode === m.id;
                return (
                  <button
                    key={m.id}
                    id={`mode-btn-${m.id}`}
                    onClick={() => setMode(m.id)}
                    className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-md text-xs font-medium transition-colors ${
                      active
                        ? 'bg-surface text-theme-primary shadow-sm font-semibold'
                        : 'text-theme-muted hover:text-theme-primary'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{m.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Theme Presets */}
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-theme-muted mb-2 px-1">
              Theme Palette
            </p>
            <div className="space-y-1">
              {presets.map(p => {
                const isSelected = preset === p.id;
                return (
                  <button
                    key={p.id}
                    id={`preset-btn-${p.id}`}
                    onClick={() => {
                      setPreset(p.id);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-colors border ${
                      isSelected
                        ? 'bg-surface-elevated border-theme-strong text-theme-primary'
                        : 'border-transparent text-theme-secondary hover:bg-surface-hover hover:text-theme-primary'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="flex -space-x-1 shrink-0">
                        {p.colors.map((c, i) => (
                          <div
                            key={i}
                            className="w-3.5 h-3.5 rounded-full border border-black/10"
                            style={{ backgroundColor: c }}
                          />
                        ))}
                      </div>
                      <div className="truncate">
                        <p className="text-xs font-medium truncate leading-tight">{p.name}</p>
                        <p className="text-[10px] text-theme-muted truncate">{p.desc}</p>
                      </div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-brand-primary shrink-0 ml-2" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
