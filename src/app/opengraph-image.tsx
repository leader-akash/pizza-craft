import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'PizzaCraft - Artisan Pizzeria';
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #7c2d12 50%, #9a3412 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        {/* Background pattern */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(251, 146, 60, 0.1) 0%, transparent 50%)',
          }}
        />
        
        {/* Pizza emoji */}
        <div style={{ fontSize: 200, marginBottom: 40 }}>🍕</div>
        
        {/* Title */}
        <div
          style={{
            fontSize: 80,
            fontWeight: 'bold',
            color: 'white',
            marginBottom: 20,
            textAlign: 'center',
          }}
        >
          PizzaCraft
        </div>
        
        {/* Subtitle */}
        <div
          style={{
            fontSize: 32,
            color: '#FED7AA',
            textAlign: 'center',
          }}
        >
          Artisan Pizzeria - Craft Your Perfect Pizza
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}

