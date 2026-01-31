
import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="pt-BR" suppressHydrationWarning>
      <Head>
        {/* 
          A meta tag abaixo define uma política de segurança que permite o carregamento de fontes e estilos 
          do Google, além de permitir conexões com o Supabase e a API do Gemini.
        */}
        <meta 
          http-equiv="Content-Security-Policy" 
          content="default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.tailwindcss.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://www.gstatic.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://kuarblmlafyidkwifpil.supabase.co https://generativelanguage.googleapis.com;" 
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Lexend:wght@100..900&family=Noto+Sans:wght@100..900&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
        <meta name="description" content="Copa Serra Dourada - O Maior Campeonato Rural" />
      </Head>
      <body className="bg-white font-display text-slate-900 min-h-screen" suppressHydrationWarning>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
