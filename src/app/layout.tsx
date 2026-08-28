import type { Metadata } from 'next'
import './globals.css'
export const metadata: Metadata = { title: 'Snake de Sílabas 3D', description: 'Juego educativo infantil — edición neón 3D' }
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es"><body>{children}</body></html>
}
