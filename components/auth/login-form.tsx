'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Shield, Eye, EyeOff } from 'lucide-react'
import { authManager } from '@/lib/auth'
import { logger } from '@/lib/logger'

interface LoginFormProps {
  onSuccess?: (user: any) => void
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mfaCode, setMfaCode] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showMfa, setShowMfa] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [currentSession, setCurrentSession] = useState<any>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const { user, session } = await authManager.login(email, password)
      
      setCurrentUser(user)
      setCurrentSession(session)

      if (user.mfaEnabled) {
        setShowMfa(true)
        logger.info('MFA required for login', { userId: user.id, email })
      } else {
        // Login completo sem MFA
        await completeLogin(user, session)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro no login'
      setError(errorMessage)
      logger.error('Login failed', err as Error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleMFASubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const isValid = await authManager.verifyMFACode(currentUser.id, mfaCode)
      
      if (isValid) {
        await completeLogin(currentUser, currentSession)
      } else {
        setError('Código MFA inválido')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro na verificação MFA'
      setError(errorMessage)
      logger.error('MFA verification failed', err as Error)
    } finally {
      setIsLoading(false)
    }
  }

  const completeLogin = async (user: any, session: any) => {
    // Salvar token no localStorage
    localStorage.setItem('auth_token', session.token)
    localStorage.setItem('user_id', user.id)

    logger.info('Login completed successfully', { userId: user.id, email: user.email })
    
    onSuccess?.(user)
    router.push('/')
  }

  const handleBackToLogin = () => {
    setShowMfa(false)
    setMfaCode('')
    setCurrentUser(null)
    setCurrentSession(null)
    setError(null)
  }

  if (showMfa) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
            <Shield className="h-6 w-6 text-blue-600" />
          </div>
          <CardTitle>Verificação em Duas Etapas</CardTitle>
          <CardDescription>
            Digite o código do seu aplicativo autenticador
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleMFASubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="mfa-code">Código MFA</Label>
              <Input
                id="mfa-code"
                type="text"
                placeholder="123456"
                value={mfaCode}
                onChange={(e) => setMfaCode(e.target.value)}
                maxLength={6}
                className="text-center text-lg tracking-widest"
                autoFocus
              />
            </div>

            <div className="flex space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleBackToLogin}
                className="flex-1"
              >
                Voltar
              </Button>
              <Button type="submit" disabled={isLoading} className="flex-1">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verificando...
                  </>
                ) : (
                  'Verificar'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle>Login</CardTitle>
        <CardDescription>
          Entre com suas credenciais para acessar o dashboard
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLogin} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Entrando...
              </>
            ) : (
              'Entrar'
            )}
          </Button>

          <div className="text-center text-sm text-muted-foreground">
            <p>Credenciais de teste:</p>
            <p>Email: admin@cultivation.com</p>
            <p>Senha: password123</p>
          </div>
        </form>
      </CardContent>
    </Card>
  )
} 