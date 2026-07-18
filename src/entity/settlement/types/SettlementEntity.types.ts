export interface SettlementEntity {
    id: string

    kingdomId: string

    name: string

    type: 'town' | 'city' | 'village'

    population: number

    description: string

    locationIds: string[]
}