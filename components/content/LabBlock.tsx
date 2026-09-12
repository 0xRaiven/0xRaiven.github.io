import React from 'react';
import { FlaskConical } from 'lucide-react';

export interface LabBlockProps {
  target: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  objective?: string;
  environment?: string;
  children?: React.ReactNode;
  className?: string;
}

export function LabBlock({
  target,
  difficulty = 'medium',
  objective,
  environment,
  children,
  className = '',
}: LabBlockProps) {
  const difficultyStyles = {
    easy: 'text-emerald-400 bg-emerald-950/60 border-emerald-500/40',
    medium: 'text-amber-400 bg-amber-950/60 border-amber-500/40',
    hard: 'text-rose-400 bg-rose-950/60 border-rose-500/40',
  };

  const diffPill = difficultyStyles[difficulty] || difficultyStyles.medium;

  return (
    <div className={`my-4 p-4 rounded border border-accent/30 bg-accent/5 text-xs font-mono space-y-2.5 ${className}`}>
      <div className="flex items-center justify-between border-b border-accent/20 pb-2">
        <div className="flex items-center gap-2 text-accent font-semibold tracking-wide uppercase text-[11px]">
          <FlaskConical className="w-4 h-4 shrink-0 text-accent" />
          <span>Lab Environment</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] px-2 py-0.5 rounded bg-surface border border-border text-text-primary">
            Target: <span className="font-semibold text-accent">{target}</span>
          </span>
          <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded border font-semibold ${diffPill}`}>
            {difficulty}
          </span>
        </div>
      </div>

      {environment && (
        <div className="text-[11px] text-text-secondary">
          <span className="font-semibold text-text-primary">Environment:</span> {environment}
        </div>
      )}

      {objective && (
        <div className="space-y-1">
          <div className="text-[11px] font-semibold text-accent uppercase tracking-wider">
            Objective:
          </div>
          <p className="text-text-secondary leading-relaxed pl-2 border-l border-accent/30 whitespace-pre-wrap">
            {objective}
          </p>
        </div>
      )}

      {children && (
        <div className="pt-2 text-text-secondary leading-relaxed whitespace-pre-wrap">
          {children}
        </div>
      )}
    </div>
  );
}
