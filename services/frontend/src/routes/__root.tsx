/// <reference types="vite/client" />
import type { ReactNode } from 'react'
import {
  Outlet,
  createRootRoute,
  HeadContent,
  Scripts,
} from '@tanstack/react-router'
import { ClerkProvider } from '@clerk/tanstack-react-start'
import iconFavicon from '@/assets/background/icon.jpg'
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
    links: [
      {
        rel: 'icon',
        href: iconFavicon,
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
    shimmer: true,
    unsafe_disableDevelopmentModeWarnings: true,
  },
  variables: {
    colorPrimary: '#FFD700',
    colorText: '#FFFFFF',
    colorBackground: '#0B0D2B',
    colorInputBackground: '#6776fc',
    colorInputText: '#FFFFFF',
    colorInputPlaceholder: '#67E8F9',
    colorDanger: '#FF4D6B',
    colorSuccess: '#22c55e',
    colorWarning: '#f59e0b',
    fontFamily: 'VT323, monospace',
    fontSize: '16px',
    borderRadius: '0px',
  },
  elements: {
    card: {
      border: '2px solid rgba(192, 38, 211, 0.6)',
      boxShadow: '0 0 24px rgba(192, 38, 211, 0.25), 0 0 48px rgba(103, 232, 249, 0.08), inset 0 0 40px rgba(192, 38, 211, 0.03)',
      borderRadius: '0px',
    },
    headerTitle: {
      fontFamily: '"Press Start 2P", monospace',
      fontSize: '14px',
      color: '#FFD700',
      textShadow: '0 0 12px rgba(255, 215, 0, 0.5), 0 0 24px rgba(255, 215, 0, 0.2)',
      letterSpacing: '0.08em',
      paddingBottom: '8px',
    },
    headerSubtitle: {
      fontFamily: 'VT323, monospace',
      color: '#67E8F9',
      fontSize: '18px',
      textShadow: '0 0 6px rgba(103, 232, 249, 0.3)',
    },
    headerBackLink: {
      fontFamily: 'VT323, monospace',
      color: '#67E8F9',
      fontSize: '16px',
      textShadow: '0 0 4px rgba(103, 232, 249, 0.3)',
    },
    headerBackIcon: {
      color: '#67E8F9',
    },
    socialButtonsBlockButton: {
      border: '2px solid rgba(192, 38, 211, 0.5)',
      backgroundColor: '#161A3D',
      fontFamily: 'VT323, monospace',
      fontSize: '16px',
      color: '#FFFFFF',
      borderRadius: '0px',
      boxShadow: '0 0 6px rgba(192, 38, 211, 0.15)',
      transition: 'all 0.2s ease',
    },
    socialButtonsBlockButtonText: {
      fontFamily: 'VT323, monospace',
      fontSize: '16px',
      fontWeight: 'bold',
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
      boxShadow: '0 0 12px rgba(192, 38, 211, 0.5), 0 0 24px rgba(192, 38, 211, 0.2)',
      transition: 'all 0.2s ease',
      color: '#FFFFFF',
      fontWeight: 'bold',
    },
    formButtonSecondary: {
      backgroundColor: '#161A3D',
      border: '2px solid #C026D3',
      borderRadius: '0px',
      fontFamily: 'VT323, monospace',
      fontSize: '16px',
      color: '#67E8F9',
      boxShadow: '0 0 6px rgba(192, 38, 211, 0.15)',
    },
    formFieldInput: {
      backgroundColor: '#0F1235',
      border: '2px solid rgba(192, 38, 211, 0.4)',
      borderRadius: '0px',
      color: '#FFFFFF',
      fontFamily: 'VT323, monospace',
      fontSize: '18px',
      boxShadow: '0 0 6px rgba(192, 38, 211, 0.1), inset 0 0 8px rgba(0,0,0,0.3)',
      padding: '12px 14px',
      '&::placeholder': {
        color: '#67E8F9',
        opacity: 1,
      },
    },
    formFieldInputLabel: {
      fontFamily: 'VT323, monospace',
      color: '#FFD700',
      fontSize: '17px',
      fontWeight: 'bold',
      textShadow: '0 0 4px rgba(255, 215, 0, 0.2)',
      paddingBottom: '4px',
    },
    formFieldLabel: {
      fontFamily: 'VT323, monospace',
      color: '#FFD700',
      fontSize: '17px',
      fontWeight: 'bold',
      textShadow: '0 0 4px rgba(255, 215, 0, 0.2)',
    },
    formFieldAction: {
      fontFamily: 'VT323, monospace',
      color: '#67E8F9',
      fontSize: '16px',
      textShadow: '0 0 4px rgba(103, 232, 249, 0.3)',
    },
    footer: {
      fontFamily: 'VT323, monospace',
      fontSize: '14px',
      color: 'rgba(103, 232, 249, 0.6)',
    },
    footerActionText: {
      fontFamily: 'VT323, monospace',
      color: '#FFFFFF',
      fontSize: '16px',
      letterSpacing: '0.02em',
    },
    footerActionLink: {
      color: '#FFD700',
      fontFamily: 'VT323, monospace',
      fontSize: '16px',
      fontWeight: 'bold',
      textShadow: '0 0 6px rgba(255, 215, 0, 0.4)',
      letterSpacing: '0.03em',
    },
    dividerLine: {
      backgroundColor: 'rgba(192, 38, 211, 0.4)',
    },
    dividerText: {
      fontFamily: 'VT323, monospace',
      color: '#B0E0FF',
      fontSize: '14px',
    },
    identityPreviewText: {
      fontFamily: 'VT323, monospace',
      fontSize: '16px',
      color: '#FFFFFF',
    },
    identityPreviewEditButton: {
      fontFamily: 'VT323, monospace',
      color: '#67E8F9',
      fontSize: '15px',
    },
    formResendCodeLink: {
      fontFamily: 'VT323, monospace',
      color: '#67E8F9',
      fontSize: '16px',
    },
    alert: {
      borderRadius: '0px',
      fontFamily: 'VT323, monospace',
      fontSize: '16px',
    },
    otpCodeFieldInput: {
      borderRadius: '0px',
      border: '2px solid #C026D3',
      backgroundColor: '#0F1235',
      color: '#FFD700',
      fontFamily: '"Press Start 2P", monospace',
      fontSize: '22px',
      boxShadow: '0 0 8px rgba(192, 38, 211, 0.2)',
    },
    profileSectionTitle: {
      fontFamily: '"Press Start 2P", monospace',
      fontSize: '11px',
      color: '#FFD700',
      textShadow: '0 0 4px rgba(255, 215, 0, 0.2)',
    },
    profileSectionContent: {
      fontFamily: 'VT323, monospace',
      fontSize: '17px',
      color: '#FFFFFF',
    },
    navbarButton: {
      fontFamily: 'VT323, monospace',
      fontSize: '16px',
      color: '#67E8F9',
    },
    userButtonPopoverCard: {
      backgroundColor: '#0F1235',
      border: '2px solid #C026D3',
      boxShadow: '0 0 20px rgba(192, 38, 211, 0.3), 0 0 40px rgba(103, 232, 249, 0.05)',
      borderRadius: '0px',
    },
    userButtonPopoverActionButton: {
      color: '#FFFFFF',
      fontFamily: 'VT323, monospace',
      fontSize: '16px',
    },
    userButtonPopoverActionButtonText: {
      color: '#FFFFFF',
    },
    userPreviewMainIdentifier: {
      fontFamily: 'VT323, monospace',
      fontSize: '17px',
      color: '#FFD700',
      textShadow: '0 0 4px rgba(255, 215, 0, 0.2)',
    },
    userPreviewSecondaryIdentifier: {
      fontFamily: 'VT323, monospace',
      fontSize: '16px',
      color: '#67E8F9',
    },
    modalCloseButton: {
      color: '#67E8F9',
      transition: 'all 0.2s ease',
      '&:hover, &:focus': {
        color: '#FFD700',
        filter: 'drop-shadow(0 0 4px rgba(103, 232, 249, 0.5))',
      },
    },
    lastAuthenticationStrategyBadge: {
      color: '#67E8F9',
      backgroundColor: 'rgba(103, 232, 249, 0.12)',
      border: '1px solid rgba(103, 232, 249, 0.3)',
      fontFamily: 'VT323, monospace',
      fontSize: '12px',
      fontWeight: 'bold',
      letterSpacing: '0.04em',
      textShadow: '0 0 4px rgba(103, 232, 249, 0.3)',
      borderRadius: '0px',
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
