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
  const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

  return (
    <RootDocument>
      <ClerkProvider
        publishableKey={PUBLISHABLE_KEY}
        appearance={clerkAppearance}
        localization={clerkLocalization}
      >
        <Outlet />
      </ClerkProvider>
    </RootDocument>
  )
}

const clerkAppearance = {
  baseTheme: undefined,
  layout: {
    logoPlacement: 'none' as const,
    socialButtonsPlacement: 'top' as const,
    showOptionalFields: false,
    shimmer: false,
  },
  variables: {
    colorPrimary: '#C026D3',
    colorText: '#FFFFFF',
    colorBackground: '#0B0D2B',
    colorInputBackground: '#1E2547',
    colorInputText: '#FFFFFF',
    colorDanger: '#ef4444',
    colorSuccess: '#22c55e',
    colorWarning: '#f59e0b',
    fontFamily: 'VT323, monospace',
    fontSize: '14px',
    borderRadius: '0px',
  },
  elements: {
    card: {
      border: '2px solid #C026D3',
      boxShadow: '0 0 16px rgba(192, 38, 211, 0.3), 0 0 32px rgba(103, 232, 249, 0.1)',
      borderRadius: '0px',
    },
    headerTitle: {
      fontFamily: '"Press Start 2P", monospace',
      fontSize: '14px',
      color: '#FFD700',
      textShadow: '0 0 8px rgba(255, 215, 0, 0.3)',
      letterSpacing: '0.05em',
    },
    headerSubtitle: {
      fontFamily: 'VT323, monospace',
      color: '#B0E0FF',
      fontSize: '16px',
    },
    headerBackLink: {
      fontFamily: 'VT323, monospace',
      color: '#C026D3',
      fontSize: '15px',
    },
    headerBackIcon: {
      color: '#C026D3',
    },
    socialButtonsBlockButton: {
      border: '2px solid #C026D3',
      backgroundColor: '#1E2547',
      fontFamily: 'VT323, monospace',
      fontSize: '15px',
      color: '#FFFFFF',
      borderRadius: '0px',
    },
    socialButtonsBlockButtonText: {
      fontFamily: 'VT323, monospace',
      fontSize: '15px',
    },
    socialButtonsProviderIcon: {
      borderRadius: '0px',
    },
    formButtonPrimary: {
      backgroundColor: '#C026D3',
      border: '2px solid #67E8F9',
      borderRadius: '0px',
      fontFamily: '"Press Start 2P", monospace',
      fontSize: '12px',
      letterSpacing: '0.08em',
      boxShadow: '0 0 12px rgba(192, 38, 211, 0.4)',
      transition: 'all 0.2s ease',
    },
    formButtonSecondary: {
      backgroundColor: '#1E2547',
      border: '2px solid #C026D3',
      borderRadius: '0px',
      fontFamily: 'VT323, monospace',
      fontSize: '15px',
      color: '#67E8F9',
    },
    formFieldInput: {
      backgroundColor: '#0B0D2B',
      border: '1px solid #C026D3',
      borderRadius: '0px',
      color: '#FFFFFF',
      fontFamily: 'VT323, monospace',
      fontSize: '16px',
      boxShadow: '0 0 4px rgba(192, 38, 211, 0.2)',
    },
    formFieldInputLabel: {
      fontFamily: 'VT323, monospace',
      color: '#67E8F9',
      fontSize: '16px',
    },
    formFieldLabel: {
      fontFamily: 'VT323, monospace',
      color: '#67E8F9',
      fontSize: '16px',
    },
    formFieldAction: {
      fontFamily: 'VT323, monospace',
      color: '#C026D3',
      fontSize: '15px',
    },
    footerActionText: {
      fontFamily: 'VT323, monospace',
      color: '#B0E0FF',
      fontSize: '15px',
    },
    footerActionLink: {
      color: '#C026D3',
      fontFamily: 'VT323, monospace',
      fontSize: '15px',
    },
    dividerLine: {
      backgroundColor: '#C026D3',
    },
    dividerText: {
      fontFamily: 'VT323, monospace',
      color: '#B0E0FF',
      fontSize: '14px',
    },
    identityPreviewText: {
      fontFamily: 'VT323, monospace',
      fontSize: '15px',
    },
    identityPreviewEditButton: {
      fontFamily: 'VT323, monospace',
      color: '#C026D3',
      fontSize: '14px',
    },
    formResendCodeLink: {
      fontFamily: 'VT323, monospace',
      color: '#C026D3',
      fontSize: '15px',
    },
    alert: {
      borderRadius: '0px',
      fontFamily: 'VT323, monospace',
      fontSize: '15px',
    },
    otpCodeFieldInput: {
      borderRadius: '0px',
      border: '2px solid #C026D3',
      backgroundColor: '#0B0D2B',
      color: '#FFD700',
      fontFamily: '"Press Start 2P", monospace',
      fontSize: '20px',
    },
    profileSectionTitle: {
      fontFamily: '"Press Start 2P", monospace',
      fontSize: '11px',
      color: '#FFD700',
    },
    profileSectionContent: {
      fontFamily: 'VT323, monospace',
      fontSize: '16px',
    },
    navbarButton: {
      fontFamily: 'VT323, monospace',
      fontSize: '15px',
    },
    userButtonPopoverCard: {
      backgroundColor: '#0B0D2B',
      border: '2px solid #C026D3',
      boxShadow: '0 0 16px rgba(192, 38, 211, 0.3)',
      borderRadius: '0px',
    },
    userButtonPopoverActionButton: {
      color: '#FFFFFF',
      fontFamily: 'VT323, monospace',
      fontSize: '15px',
    },
    userPreviewMainIdentifier: {
      fontFamily: 'VT323, monospace',
      fontSize: '16px',
      color: '#FFD700',
    },
    userPreviewSecondaryIdentifier: {
      fontFamily: 'VT323, monospace',
      fontSize: '15px',
      color: '#B0E0FF',
    },
  },
}

const clerkLocalization = {
  signIn: {
    start: {
      title: 'Iniciar sesión en Damas Universe',
      subtitle: 'Bienvenido a las damas cósmicas',
    },
    social: {
      providerDividerText: 'o continúa con',
    },
  },
  signUp: {
    start: {
      title: 'Crear cuenta en Damas Universe',
      subtitle: 'Únete a las damas cósmicas',
    },
    social: {
      providerDividerText: 'o continúa con',
    },
  },
  formFieldLabel__emailAddress: 'Correo electrónico',
  formFieldLabel__password: 'Contraseña',
  formButtonPrimary: 'Continuar',
  formFieldAction__useAnotherMethod: 'Usar otro método',
  dividerText: 'o',
  footerActionLink__signIn: '¿Ya tienes cuenta? Inicia sesión',
  footerActionLink__signUp: '¿No tienes cuenta? Regístrate',
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html>
      <head>
        <HeadContent />
      </head>
      <body className="min-h-screen" style={{ backgroundColor: '#0B0D2B', color: '#FFFFFF' }}>
        {children}
        <Scripts />
      </body>
    </html>
  )
}
