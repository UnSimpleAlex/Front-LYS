import { test, expect } from '@playwright/test';
import { callingCode, cellphoneStartError, phoneCountries, phoneExample, validateCellphone } from '../src/features/auth/phoneCountries';

for (const [country, name] of phoneCountries) {
  test(`celular de ${name}: longitud, prefijo y formato internacional`, () => {
    const example = phoneExample(country);
    const valid = validateCellphone(example, country);
    expect(valid.error).toBe('');
    expect(cellphoneStartError(example, country)).toBe('');
    expect(valid.number).toBe(`${callingCode(country)}${example}`);
    expect(validateCellphone(valid.number, country)).toEqual(valid);
    expect(validateCellphone(example.slice(0, -1), country).error).not.toBe('');
    expect(validateCellphone(`${example}0`, country).error).not.toBe('');
    expect(validateCellphone(`texto ${example}`, country).error).not.toBe('');
    expect(validateCellphone('+12025550123', country).error).not.toBe('');
  });
}

test('Perú exige exactamente nueve dígitos con inicio 9', () => {
  for (const invalid of ['899888777', '99988877', '9998887770', '0999888777', '+57 3211234567']) {
    expect(validateCellphone(invalid, 'PE').error).toContain('9 dígitos');
  }
  expect(validateCellphone('999 888 777', 'PE')).toEqual({ error: '', number: '+51999888777' });
  expect(validateCellphone('+51 999 888 777', 'PE')).toEqual({ error: '', number: '+51999888777' });
});
