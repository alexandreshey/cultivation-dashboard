import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { ErrorBoundary } from '@/components/error-boundary'

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: 'ErvApp',
  description: 'Dashboard inteligente para monitoramento e análise de cultivos indoor',
  manifest: '/manifest.json',
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#10b981',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'ErvApp',
  },
  icons: {
    icon: '/placeholder-logo.png',
    apple: '/placeholder-logo.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#10b981" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="ErvApp" />
      </head>
      <body className={inter.className}>
        <ErrorBoundary>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem={false}
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </ErrorBoundary>
        
        {/* Service Worker Registration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('SW registered: ', registration);
                    })
                    .catch(function(registrationError) {
                      console.log('SW registration failed: ', registrationError);
                    });
                });
              }
            `,
          }}
        />

        {/* Performance Monitoring Initialization */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Inicializar monitoramento de performance
              if (typeof window !== 'undefined') {
                window.addEventListener('load', function() {
                  // Performance monitoring será inicializado pelo hook
                  console.log('Performance monitoring ready');
                });
              }
            `,
          }}
        />

        {/* Notification Permission Request */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Solicitar permissão para notificações
              if (typeof window !== 'undefined' && 'Notification' in window) {
                if (Notification.permission === 'default') {
                  // Solicitar permissão após um delay para não ser intrusivo
                  setTimeout(() => {
                    Notification.requestPermission().then(function(permission) {
                      if (permission === 'granted') {
                        console.log('Notification permission granted');
                      }
                    });
                  }, 5000);
                }
              }
            `,
          }}
        />
      </body>
    </html>
  )
}
