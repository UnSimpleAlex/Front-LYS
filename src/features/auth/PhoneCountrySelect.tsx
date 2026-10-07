import { AR, BO, BR, CL, CO, CR, CU, EC, SV, GT, HT, HN, MX, NI, PA, PY, PE, PR, DO, UY, VE } from 'country-flag-icons/react/3x2';
import { callingCode, phoneCountries, type PhoneCountry } from './phoneCountries';

const flags = { AR, BO, BR, CL, CO, CR, CU, EC, SV, GT, HT, HN, MX, NI, PA, PY, PE, PR, DO, UY, VE };
export function PhoneCountrySelect({ country, disabled, onChange }: { country: PhoneCountry; disabled: boolean; onChange: (country: PhoneCountry) => void }) {
  const Flag = flags[country];
  return <div className="phone-prefix">
    <Flag className="phone-country" aria-hidden="true" />
    <span className="phone-calling-code" aria-hidden="true">{callingCode(country)}</span>
    <select aria-label="País y prefijo del celular" value={country} disabled={disabled} onChange={event => onChange(event.target.value as PhoneCountry)}>
      {phoneCountries.map(([code, name]) => <option key={code} value={code}>{name} ({callingCode(code)})</option>)}
    </select>
    <span className="phone-chevron" aria-hidden="true">⌄</span>
  </div>;
}
