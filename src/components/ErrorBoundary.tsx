import React, { Component, ErrorInfo, ReactNode } from "react";
import { Icon } from "@iconify/react";
import frontLogo from "../assets/front_logo.png";
import { LOGOS_BASE64 } from "../assets/logoBase64";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  showDetails: boolean;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
    };
  }

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("🔥 React ErrorBoundary Caught Runtime Error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleReturnHome = () => {
    window.location.href = "/";
  };

  private toggleDetails = () => {
    this.setState((prev) => ({ showDetails: !prev.showDetails }));
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const errorMessage = this.state.error?.message || "An unexpected rendering error occurred.";
      const errorStack = this.state.error?.stack || this.state.errorInfo?.componentStack;

      return (
        <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] flex items-center justify-center p-4 sm:p-6 font-sans">
          <div className="w-full max-w-lg nm-outset rounded-3xl p-6 sm:p-8 space-y-6 border border-accent/20 bg-[var(--bg-panel)] shadow-2xl animate-fade-in text-center">
            {/* Logo */}
            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-2xl nm-outset p-2 bg-[var(--bg-panel)] flex items-center justify-center">
                <img
                  src={LOGOS_BASE64.front || frontLogo || "/front_logo.png"}
                  alt="Srushti AI"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            {/* Error Message */}
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 text-red-500 border border-red-500/20 text-xs font-extrabold">
                <Icon icon="lucide:alert-triangle" className="w-3.5 h-3.5" />
                <span>Application Notice</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[var(--text-emphasis)]">
                Something Went Wrong
              </h1>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] opacity-80 leading-relaxed max-w-sm mx-auto">
                An unexpected interface issue occurred. Your data is safe. You can reload the page or return home to continue.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <button
                onClick={this.handleReload}
                className="w-full sm:w-auto px-6 py-3 rounded-xl nm-outset font-bold text-xs sm:text-sm text-accent hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer bg-[var(--bg-panel)]"
              >
                <Icon icon="lucide:refresh-cw" className="w-4 h-4" />
                <span>Reload Application</span>
              </button>

              <button
                onClick={this.handleReturnHome}
                className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-xs sm:text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/5 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer border border-white/10"
              >
                <Icon icon="lucide:home" className="w-4 h-4 opacity-70" />
                <span>Return to Home</span>
              </button>
            </div>

            {/* Diagnostic Error Details Accordion */}
            <div className="border-t border-black/5 dark:border-white/5 pt-4 text-left">
              <button
                onClick={this.toggleDetails}
                className="w-full flex items-center justify-between text-[11px] font-bold text-[var(--text-secondary)] hover:text-accent transition-colors cursor-pointer py-1"
              >
                <span>Diagnostic Information</span>
                <Icon
                  icon={this.state.showDetails ? "lucide:chevron-up" : "lucide:chevron-down"}
                  className="w-3.5 h-3.5"
                />
              </button>

              {this.state.showDetails && (
                <div className="mt-2.5 p-3 rounded-xl nm-inset-sm bg-[var(--bg-secondary)] space-y-2 text-[10px] font-mono text-[var(--text-secondary)] max-h-48 overflow-auto break-all">
                  <div className="text-red-400 font-bold">{errorMessage}</div>
                  {errorStack && (
                    <pre className="whitespace-pre-wrap opacity-75 text-[9px] leading-tight">
                      {errorStack}
                    </pre>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
