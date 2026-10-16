import type { Lang } from '../i18n/types';
import type { ParamSpec, ParamValues } from '../content/types';
import { tx } from '../content/types';

interface Props {
  specs: ParamSpec[];
  values: ParamValues;
  onChange: (key: string, v: string | number) => void;
  lang: Lang;
}

/** Demo 参数条:与 ECharts/D3 联动的可调控件,统一样式 */
export function ParamBar({ specs, values, onChange, lang }: Props) {
  if (specs.length === 0) return null;
  return (
    <div className="demo-bar">
      {specs.map((s) => (
        <label key={s.key}>
          {tx(s.label, lang)}
          {s.kind === 'select' ? (
            <select
              value={String(values[s.key] ?? s.default)}
              onChange={(e) => onChange(s.key, e.target.value)}
            >
              {(s.options ?? []).map((o) => (
                <option key={o.value} value={o.value}>
                  {tx(o.label, lang)}
                </option>
              ))}
            </select>
          ) : (
            <>
              <input
                type="range"
                min={s.min}
                max={s.max}
                step={s.step}
                value={Number(values[s.key] ?? s.default)}
                onChange={(e) => onChange(s.key, Number(e.target.value))}
              />
              <span>{String(values[s.key] ?? s.default)}</span>
            </>
          )}
        </label>
      ))}
    </div>
  );
}

export function defaultParams(specs: ParamSpec[]): ParamValues {
  const v: ParamValues = {};
  for (const s of specs) v[s.key] = s.default;
  return v;
}