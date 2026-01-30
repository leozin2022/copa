
import type { AppProps } from 'next/app'
import Header from '../components/Header'
import Footer from '../components/Footer'
import ChatBot from '../components/ChatBot'
import '../styles/globals.css'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className="min-h-screen bg-white text-black flex flex-col font-display">
      <Header />
      <main className="flex-grow">
        <Component {...pageProps} />
      </main>
      <Footer />
      <ChatBot />
    </div>
  )
}
