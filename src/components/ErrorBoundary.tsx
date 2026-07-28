import React, { Component, ErrorInfo, ReactNode } from 'react';
import { RotateCcw, AlertTriangle } from 'lucide-react';

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Hugo Award Uncaught Exception:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReset = () => {
    try {
      localStorage.removeItem('hugo_award_2024_user_state');
      localStorage.removeItem('hugo_award_2024_live_results');
      sessionStorage.clear();
    } catch {
      // Ignore storage errors during recovery
    }
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen w-full bg-[#101b13] flex items-center justify-center p-6 text-white text-center">
          <div className="max-w-lg w-full bg-[#16271c] border-2 border-amber-400/50 rounded-3xl p-8 shadow-2xl space-y-6">
            <div className="inline-flex p-4 rounded-full bg-amber-400/20 border border-amber-400/50">
              <AlertTriangle className="w-12 h-12 text-amber-300" />
            </div>

            <div className="space-y-2">
              <h1 className="font-cinzel text-2xl sm:text-3xl font-extrabold text-white">
                Hugo Award 2026
              </h1>
              <h2 className="font-sans-clean text-lg font-bold text-amber-200 uppercase tracking-wider">
                An Unexpected Exception Occurred
              </h2>
              <p className="font-serif-display text-sm text-gray-300 leading-relaxed">
                The application encountered an unexpected runtime error. Don't worry, your ballot data is protected.
              </p>
            </div>

            {this.state.error && (
              <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 text-left overflow-x-auto text-xs font-mono text-amber-300/90 max-h-32">
                {this.state.error.toString()}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => window.location.reload()}
                className="flex-1 py-3 px-6 rounded-xl bg-white/10 hover:bg-white/20 text-white font-sans-clean font-semibold text-sm transition-all"
              >
                Reload Application
              </button>

              <button
                onClick={this.handleReset}
                className="flex-1 py-3 px-6 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-cinzel font-bold text-sm shadow-lg transition-all flex items-center justify-center space-x-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset & Restart</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
