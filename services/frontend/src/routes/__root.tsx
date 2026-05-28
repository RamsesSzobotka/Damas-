/// <reference types="vite/client" />
import type { ReactNode } from 'react'
import {
  Outlet,
  createRootRoute,
  HeadContent,
  Scripts,
} from '@tanstack/react-router'
import { ClerkProvider } from '@clerk/tanstack-react-start'
import '../styles/globals.css'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Damas - Checkers Game',
      },
    ],
  }),
  component: RootComponent,
})

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  )
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <html>
        <head>
          <HeadContent />
        </head>
        <body className="min-h-screen" style={{ backgroundColor: '#0B0D2B', color: '#FFFFFF' }}>
          {children}
          <Scripts />
        </body>
      </html>
    </ClerkProvider>
  )
}
