import type { ProfessionType } from '../../../../src/interfaces/professsions/Profession.types'

export interface Profession {
  id: string
  title: string
  description: string
  type: ProfessionType
}