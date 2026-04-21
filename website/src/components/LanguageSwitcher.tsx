import { LOCALES } from '@/content/locale';
import { useLocaleContext } from '@/context/LocaleContext';

export function LanguageSwitcher() {
  const { locale, setLocale } = useLocaleContext();

  return (
    <div className="flex items-center gap-1 text-sm text-[#6B6B6B]">
      {LOCALES.map((code, index) => (
        <span key={code} className="flex items-center gap-1">
          {index > 0 ? <span aria-hidden>|</span> : null}
          <button
            type="button"
            onClick={() => setLocale(code)}
            className={`hover:text-[#111111] transition-colors ${
              locale === code ? 'font-semibold text-[#111111]' : ''
            }`}
          >
            {code.toUpperCase()}
          </button>
        </span>
      ))}
    </div>
  );
}
