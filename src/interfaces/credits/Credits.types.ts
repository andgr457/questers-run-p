import type { EntityBase } from '../EntityBase.types'

export type CreditLicenseType = 
  'free'
  | 'restricted'
  | 'creative commons'

export type CreditFileType = 
  'sfx'
  | 'music'
  | 'image'

export interface Credit extends EntityBase {
  assetName: string
  authorName: string
  platformName: string
  sourceUrl: string
  licenseType: CreditLicenseType
  fileType: CreditFileType
  localUrl: string
}
