import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';

type Grecaptcha = {
  ready: (callback: () => void) => void;
  render: (
    container: HTMLElement,
    parameters: {
      sitekey: string;
      callback: (token: string) => void;
      'expired-callback'?: () => void;
      'error-callback'?: () => void;
    },
  ) => number;
  reset: (widgetId?: number) => void;
};

declare global {
  interface Window {
    grecaptcha?: Grecaptcha;
    ___arraRecaptchaScriptLoading?: Promise<void>;
  }
}

export type RecaptchaFieldHandle = {
  reset: () => void;
};

type RecaptchaFieldProps = {
  siteKey: string;
  onTokenChange: (token: string | null) => void;
};

function loadRecaptchaScript(): Promise<void> {
  if (window.grecaptcha?.ready) {
    return Promise.resolve();
  }

  if (window.___arraRecaptchaScriptLoading) {
    return window.___arraRecaptchaScriptLoading;
  }

  const existing = document.querySelector<HTMLScriptElement>('script[src*="google.com/recaptcha/api.js"]');
  if (existing) {
    window.___arraRecaptchaScriptLoading = new Promise((resolve, reject) => {
      if (window.grecaptcha?.ready) {
        resolve();
        return;
      }
      existing.addEventListener('load', () => resolve(), { once: true });
      existing.addEventListener('error', () => reject(new Error('Failed to load reCAPTCHA.')), { once: true });
    });
    return window.___arraRecaptchaScriptLoading;
  }

  window.___arraRecaptchaScriptLoading = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://www.google.com/recaptcha/api.js?render=explicit';
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load reCAPTCHA script.'));
    document.head.appendChild(script);
  });

  return window.___arraRecaptchaScriptLoading;
}

export const RecaptchaField = forwardRef<RecaptchaFieldHandle, RecaptchaFieldProps>(
  function RecaptchaField({ siteKey, onTokenChange }, ref) {
    const containerRef = useRef<HTMLDivElement>(null);
    const widgetIdRef = useRef<number | null>(null);
    const onTokenChangeRef = useRef(onTokenChange);
    const [loadError, setLoadError] = useState('');

    useImperativeHandle(ref, () => ({
      reset() {
        if (widgetIdRef.current !== null && window.grecaptcha) {
          window.grecaptcha.reset(widgetIdRef.current);
        }
        onTokenChangeRef.current(null);
      },
    }));

    useEffect(() => {
      onTokenChangeRef.current = onTokenChange;
    }, [onTokenChange]);

    useEffect(() => {
      const trimmedSiteKey = siteKey.trim();
      if (!trimmedSiteKey) {
        return;
      }

      let cancelled = false;

      void loadRecaptchaScript()
        .then(
          () =>
            new Promise<void>((resolve, reject) => {
              if (!window.grecaptcha?.ready) {
                reject(new Error('reCAPTCHA is unavailable.'));
                return;
              }

              window.grecaptcha.ready(() => {
                if (cancelled || !containerRef.current) {
                  resolve();
                  return;
                }

                try {
                  if (widgetIdRef.current !== null) {
                    window.grecaptcha?.reset(widgetIdRef.current);
                    onTokenChangeRef.current(null);
                    resolve();
                    return;
                  }

                  widgetIdRef.current = window.grecaptcha!.render(containerRef.current, {
                    sitekey: trimmedSiteKey,
                    callback: (token) => onTokenChangeRef.current(token),
                    'expired-callback': () => onTokenChangeRef.current(null),
                    'error-callback': () => onTokenChangeRef.current(null),
                  });
                  resolve();
                } catch (error) {
                  reject(error instanceof Error ? error : new Error('reCAPTCHA render failed.'));
                }
              });
            }),
        )
        .catch((error) => {
          if (cancelled) {
            return;
          }

          const hostname = window.location.hostname;
          const hint =
            hostname === '127.0.0.1'
              ? ' Add 127.0.0.1 to reCAPTCHA domains, or open http://localhost:5173 instead.'
              : ' Check site key, domain list in Google admin, and disable ad blockers for this page.';

          const message = error instanceof Error ? error.message : 'reCAPTCHA failed to load.';
          setLoadError(`${message}${hint}`);
          onTokenChangeRef.current(null);
        });

      return () => {
        cancelled = true;
      };
    }, [siteKey]);

    const trimmedSiteKey = siteKey.trim();

    if (!trimmedSiteKey) {
      return (
        <p className="text-[12px] text-red-500">
          reCAPTCHA is not configured. Set VITE_RECAPTCHA_SITE_KEY in website/.env.local and restart.
        </p>
      );
    }

    if (loadError) {
      return <p className="text-[12px] text-red-500">{loadError}</p>;
    }

    return <div ref={containerRef} className="min-h-[78px]" />;
  },
);
