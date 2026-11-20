import type { ReactNode } from 'react';
import { RustEmblem } from './RustEmblem';

interface DesktopWindowProps {
  children: ReactNode;
}

export function DesktopWindow({ children }: DesktopWindowProps) {
  return (
      <div
        className="h-dvh w-full bg-[#1b1816] overflow-hidden"
        role="region"
      >


        <main className="p-6 sm:p-10">{children}</main>
      </div>
  );
}
