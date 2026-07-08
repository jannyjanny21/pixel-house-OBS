// src/layout/auth/AuthLayout.tsx
import type { ReactNode } from 'react'

type AuthLayoutProps = {
  children: ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_top,#2f486f_0%,#233755_45%,#1b2940_100%)] px-4 py-10">
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.06),transparent_35%)]" />
      <div className="relative z-10 w-full max-w-[420px]">{children}</div>
    </main>
  )
}