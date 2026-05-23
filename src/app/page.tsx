'use client'

export default function Home() {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? ''

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      margin: 0,
      padding: 0,
      overflow: 'hidden',
      position: 'fixed',
      top: 0,
      left: 0,
    }}>
      <iframe
        src={`${basePath}/game/`}
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          margin: 0,
          padding: 0,
          display: 'block',
        }}
        title="Snake de Sílabas - Juego Educativo Infantil"
        allow="autoplay"
      />
    </div>
  )
}
