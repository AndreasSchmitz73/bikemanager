import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div style={{ 
          padding: '20px',
          margin: '20px',
          border: '1px solid #ffb8b8',
          borderRadius: '4px',
          backgroundColor: '#fff5f5'
        }}>
          <h2>Ein Fehler ist aufgetreten</h2>
          <details style={{ whiteSpace: 'pre-wrap' }}>
            {this.state.error?.message}
          </details>
          <button
            onClick={() => {
              this.setState({ hasError: false });
              window.location.reload();
            }}
            style={{ marginTop: '10px' }}
          >
            App neu laden
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}