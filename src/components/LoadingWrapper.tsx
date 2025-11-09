import { ReactNode } from 'react';

interface LoadingProps {
  children: ReactNode;
  isLoading: boolean;
  loadingText?: string;
}

export function LoadingWrapper({ children, isLoading, loadingText = 'Lade...' }: LoadingProps) {
  if (!isLoading) return <>{children}</>;

  return (
    <div style={{ position: 'relative', minHeight: '100px' }}>
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }}
      >
        <div
          style={{
            padding: '20px',
            borderRadius: '8px',
            backgroundColor: 'white',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          }}
        >
          {loadingText}
        </div>
      </div>
      <div style={{ filter: 'blur(2px)' }}>{children}</div>
    </div>
  );
}