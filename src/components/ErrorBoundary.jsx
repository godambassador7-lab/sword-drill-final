import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, info: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // eslint-disable-next-line no-console
    console.error('App crash captured by ErrorBoundary:', error, info);
    this.setState({ info });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 24, color: '#fff', background: '#111', minHeight: '100vh' }}>
          <h1 style={{ color: '#fbbf24' }}>Something went wrong.</h1>
          <p>Check the browser console for details.</p>
          <pre style={{ whiteSpace: 'pre-wrap', background: '#1f2937', padding: 12, borderRadius: 8 }}>
            {String(this.state.error)}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}

