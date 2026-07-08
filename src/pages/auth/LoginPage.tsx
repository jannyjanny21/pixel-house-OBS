// src/pages/auth/LoginPage.tsx
import { useState, type SyntheticEvent } from 'react'
import { ArrowLeft, Lock, UserRound } from 'lucide-react'
import AuthLayout from '@/layout/auth/AuthLayout'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import pixelHouseLogo from '@/assets/pixelhouselogo.jpg'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault()
    console.log({ username, password })
  }

  return (
    <AuthLayout>
      <Card className="rounded-[28px] border-0 bg-white px-6 py-8 shadow-[0_24px_60px_rgba(0,0,0,0.28)]">
        <CardHeader className="space-y-5 p-0 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center text-white shadow-sm rounded-xl">
            <img
              src={pixelHouseLogo}
              alt="Pixel House Studio"
              className="h-17 w-17 object-fill"
            />
          </div>

          <div>
            <CardTitle className="text-3xl font-extrabold text-slate-900">
              Admin Login
            </CardTitle>
            <CardDescription className="mt-2 text-sm text-slate-500">
              Enter your credentials to access the dashboard
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="pt-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-semibold text-slate-700">
                Username
              </Label>
              <div className="relative">
                <UserRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter username"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  className="h-11 pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-semibold text-slate-700">
                Password
              </Label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="h-11 pl-10"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="h-12 w-full rounded-full bg-[#ff6b2d] text-base font-bold text-white shadow-[0_12px_24px_rgba(255,107,45,0.35)] hover:bg-[#ff5a17]"
            >
              Sign In
            </Button>

            <a
              href="/"
              className="inline-flex w-full items-center justify-center gap-1 text-sm text-slate-500 transition hover:text-slate-700"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </a>

            <p className="pt-1 text-center text-sm text-slate-500">
              Developed by: <span className="font-bold text-slate-700">JanjanGwapo</span>
            </p>
          </form>
        </CardContent>
      </Card>
    </AuthLayout>
  )
}