import React from 'react';

interface ThreeDCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
  glow?: boolean;
}

// 3D tilting and transform animations removed for a clean, stable UI experience
export function ThreeDCard({
  children,
  className = '',
  intensity,
  glow,
  ...props
}: ThreeDCardProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl ${className}`}
      {...props}
    >
      <div className="relative z-10 h-full w-full">{children}</div>
    </div>
  );
}

interface MagneticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

// Magnetic shifting removed so buttons remain stable and easy to click
export function MagneticButton({
  children,
  className = '',
  ...props
}: MagneticButtonProps) {
  return (
    <button
      className={className}
      {...props}
    >
      {children}
    </button>
  );
}

export function FloatingBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-0" aria-hidden="true">
      {/* Soft glowing ambient orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-teal-500/10 dark:bg-teal-500/10 blur-[130px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-cyan-500/10 dark:bg-cyan-500/10 blur-[150px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-emerald-500/5 dark:bg-emerald-500/5 blur-[160px]" />
      
      {/* High-tech grid dots */}
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.07]"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, #2CCFC5 1px, transparent 0)',
          backgroundSize: '32px 32px',
        }}
      />
    </div>
  );
}
