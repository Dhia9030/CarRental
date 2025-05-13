import type React from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { Inter } from "next/font/google"
import { Sidebar } from "@/components/sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { ApiProvider } from "@/providers/api-provider"
import { NotificationProvider } from "@/providers/notification-provider"
import { WebSocketProvider } from "@/providers/websocket-provider"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          {/* Providers for API, SSE notifications, and WebSocket */}
          <ApiProvider>
            <NotificationProvider>
              <WebSocketProvider>
                <div className="flex min-h-screen">
                  <Sidebar />
                  <div className="flex-1 flex flex-col">
                    <DashboardHeader />
                    <div className="flex-1 p-6 bg-slate-50">{children}</div>
                  </div>
                </div>
                <Toaster />
              </WebSocketProvider>
            </NotificationProvider>
          </ApiProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

export const metadata = {
      generator: 'v0.dev'
    };
