const PREFIXES: Array<[string, string]> = [
  ['+1809','DO'],['+1829','DO'],['+1849','DO'],['+1787','PR'],['+1939','PR'],
  ['+593','EC'],['+507','PA'],['+351','PT'],
  ['+53','CU'],['+34','ES'],['+52','MX'],['+86','CN'],['+55','BR'],['+54','AR'],
  ['+56','CL'],['+57','CO'],['+58','VE'],['+51','PE'],['+39','IT'],['+33','FR'],
  ['+44','GB'],['+49','DE'],['+90','TR'],['+20','EG'],['+27','ZA'],['+31','NL'],
  ['+32','BE'],['+36','HU'],['+40','RO'],['+43','AT'],['+45','DK'],['+46','SE'],
  ['+47','NO'],['+48','PL'],['+60','MY'],['+61','AU'],['+62','ID'],['+63','PH'],
  ['+64','NZ'],['+65','SG'],['+66','TH'],['+81','JP'],['+82','KR'],['+84','VN'],
  ['+91','IN'],['+92','PK'],['+98','IR'],['+30','GR'],['+41','CH'],['+94','LK'],['+95','MM'],
  ['+1','US'],['+7','RU'],
];
export function countryFromPhone(phone: string | null | undefined): string | null {
  if (!phone) return null;
  const clean = phone.replace(/[\s\-()]/g, '');
  if (!clean.startsWith('+')) return null;
  for (const [prefix, iso] of PREFIXES) if (clean.startsWith(prefix)) return iso;
  return null;
}
export function isCuba(phone: string | null | undefined): boolean {
  return countryFromPhone(phone) === 'CU';
}
