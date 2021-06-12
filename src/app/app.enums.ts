export enum PROVINCE {
  PUNJAB = 'Punjab',
  KPK = 'KPK',
  SINDH = 'Sindh',
  BALOCHISTAN = 'Balochistan',
  AJK = 'AJK',
  FEDERAL = 'Federal'
}

export enum EXAM_TYPE {
  ANNUAL = 0,
  SUPPLY = 1,
  TEST = 2,
  RETOTAL = 3
}

export enum CLASS_TYPE {
  CLASS = '0',
  TEST = '1'
}

export enum USER_ROLE {
  ADMIN = 'ADMIN',
  USER = 'USER'
}

export const FILE_EXTENSION = Object.freeze({
  CSV: 'csv',
  IPA: 'ipa',
  APP: 'app',
  ZIP: 'zip',
  APK: 'apk',
  DOC: 'doc',
  TXT: 'txt',
  PDF: 'pdf'
});
