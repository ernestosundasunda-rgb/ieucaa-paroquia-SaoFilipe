import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANTE: Não adicionar código entre createServerClient e getUser()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname

  // Rotas públicas que não precisam de autenticação
  const publicRoutes = ['/auth/login', '/auth/cadastro', '/auth/recuperar-senha']
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route))

  // Se NÃO está logado e tenta aceder área admin → redirecionar para login
  if (!user && pathname.startsWith('/admin')) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  // Se NÃO está logado e tenta aceder perfil → redirecionar para login
  if (!user && pathname.startsWith('/perfil')) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  // Se ESTÁ logado e tenta aceder login/cadastro → redirecionar para dashboard
  if (user && isPublicRoute) {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url))
  }

  return supabaseResponse
}