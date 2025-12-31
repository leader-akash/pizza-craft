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
          background: '#0a0a0a',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          padding: '60px',
        }}
      >
        {/* Left side - Large pizza emoji */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            flex: '0 0 400px',
            marginRight: '60px',
          }}
        >
          <div style={{ fontSize: 280, lineHeight: '1' }}>🍕</div>
        </div>

        {/* Right side - Text content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'center',
            flex: '1',
          }}
        >
          {/* Title */}
          <div
            style={{
              fontSize: 96,
              fontWeight: 'bold',
              color: 'white',
              marginBottom: '24px',
              lineHeight: '1.1',
            }}
          >
            PizzaCraft
          </div>
          
          {/* Subtitle */}
          <div
            style={{
              fontSize: 36,
              color: '#FED7AA',
              marginBottom: '32px',
              lineHeight: '1.4',
            }}
          >
            Artisan Pizzeria
          </div>

          {/* Description */}
          <div
            style={{
              fontSize: 24,
              color: '#CBD5E1',
              lineHeight: '1.6',
              maxWidth: '500px',
            }}
          >
            Craft your perfect pizza with premium ingredients. Browse our menu, customize your order, and enjoy delicious pizzas delivered fresh to your door.
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}

