import { getCountryCallingCode, parsePhoneNumberFromString, type CountryCode } from 'libphonenumber-js/max';
import examples from 'libphonenumber-js/examples.mobile.json';

export const phoneCountries = [
  ['PE', 'Perú'], ['AR', 'Argentina'], ['BO', 'Bolivia'], ['BR', 'Brasil'],
  ['CL', 'Chile'], ['CO', 'Colombia'], ['CR', 'Costa Rica'], ['CU', 'Cuba'],
  ['EC', 'Ecuador'], ['SV', 'El Salvador'], ['GT', 'Guatemala'], ['HT', 'Haití'],
  ['HN', 'Honduras'], ['MX', 'México'], ['NI', 'Nicaragua'], ['PA', 'Panamá'],
  ['PY', 'Paraguay'], ['PR', 'Puerto Rico'], ['DO', 'República Dominicana'],
  ['UY', 'Uruguay'], ['VE', 'Venezuela'],
] as const;
export type PhoneCountry = typeof phoneCountries[number][0];
export const callingCode = (country: PhoneCountry) => `+${getCountryCallingCode(country)}`;
export const phoneExample = (country: PhoneCountry) => examples[country];

export function validateCellphone(value: string, country: PhoneCountry): { error: string; number: string } {
  const raw = value.trim();
  if (!raw) return { error: 'Ingresa tu número de celular.', number: '' };
  const digits = raw.replace(/\D/g, '');
  const national = raw.startsWith('+') && digits.startsWith('51') ? digits.slice(2) : digits;
  if (country === 'PE' && !/^9\d{8}$/.test(national)) {
    return { error: 'El celular de Perú debe tener 9 dígitos y comenzar con 9.', number: '' };
  }
  const phone = /^\+?[\d\s().-]+$/.test(raw)
    ? parsePhoneNumberFromString(raw, { defaultCountry: country as CountryCode, extract: false }) : undefined;
  // Some numbering plans cannot distinguish mobile from fixed lines after portability.
  const mobile = phone?.getType() === 'MOBILE' || phone?.getType() === 'FIXED_LINE_OR_MOBILE';
  if (!phone?.isValid() || phone.country !== country || !mobile) {
    const name = phoneCountries.find(([code]) => code === country)![1];
    return { error: `Ingresa un celular válido de ${name}. Ejemplo: ${phoneExample(country)}.`, number: '' };
  }
  return { error: '', number: phone.number };
}
