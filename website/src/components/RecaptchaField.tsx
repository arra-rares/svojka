import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';

type Grecaptcha = {
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
  }
}

export type RecaptchaFieldHandle = {
  reset: () => void;
};

type RecaptchaFieldProps = {
  siteKey: string;
  onTokenChange: (token: string | null) => void;
};

let scriptPromise: Promise<void> | null = null;

function loadRecaptchaScript(): Promise<void> {
  if (window.grecaptcha) {
    return Promise.resolve();
  }
  if (scriptPromise) {
    return scriptPromise;
  }

  scriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://www.google.com/recaptcha/api.js?render=explicit';
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load reCAPTCHA.'));
    document.head.appendChild(script);
  });

  return scriptPromise;
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
      if (!siteKey) {
        return;
      }

      let cancelled = false;

      void loadRecaptchaScript()
        .then(() => {
          if (cancelled || !containerRef.current || !window.grecaptcha) {
            return;
          }

          if (widgetIdRef.current !== null) {
            window.grecaptcha.reset(widgetIdRef.current);
            onTokenChangeRef.current(null);
            return;
          }

          widgetIdRef.current = window.grecaptcha.render(containerRef.current, {
            sitekey: siteKey,
            callback: (token) => onTokenChangeRef.current(token),
            'expired-callback': () => onTokenChangeRef.current(null),
            'error-callback': () => onTokenChangeRef.current(null),
          });
        })
        .catch(() => {
          if (!cancelled) {
            setLoadError('reCAPTCHA failed to load.');
            onTokenChangeRef.current(null);
          }
        });

      return () => {
        cancelled = true;
      };
    }, [siteKey]);

    if (!siteKey) {
      return <p className="text-[12px] text-red-500">reCAPTCHA is not configured.</p>;
    }

    if (loadError) {
      return <p className="text-[12px] text-red-500">{loadError}</p>;
    }

    return <div ref={containerRef} className="min-h-[78px]" />;
  },
);
