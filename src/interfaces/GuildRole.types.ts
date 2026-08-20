export type GuildRoleType = 
  | 'guild_master'
  | 'officer'
  | 'quest_master'
  | 'talent_scout'
  | 'clerk'
  | 'registrar'
  | 'scullion'
  | 'warden'
  | 'quarter_master'
  | 'dispatcher'
  | 'artisan'
  | 'chronicler'
  | 'steward'
  | 'provisioner'
  | 'laborer'
  | 'instructor'
  | 'adventurer'
  | 'initiate'
  | 'treasurer'
  | 'none'

export interface GuildMemberRoleDetail {
  title: string
  description: string
  sort: number
}

export const GUILD_MEMBER_ROLES: Record<GuildRoleType, GuildMemberRoleDetail> = {
  guild_master: {
    title: 'Guild Master',
    description: 'Manages high-level guild politics, handles external affairs, and oversees all department operations.',
    sort: 0,
  },
  officer: {
    title: 'Guild Officer',
    description: 'Assists the Guild Master by handling member evaluations, internal promotions, disciplinary demotions, and leadership duties.',
    sort: 1,
  },
  talent_scout: {
    title: 'Talent Scout',
    description: 'Travels across the realm to discover, evaluate, and recruit promising new talent for the guild.',
    sort: 2,
  },
  quest_master: {
    title: 'Quest Master',
    description: 'Vets and verifies newly submitted, unposted contracts to ensure the tasks, dangers, and rewards are clear and fair.',
    sort: 3,
  },
  clerk: {
    title: 'Guild Clerk',
    description: 'Mans the front desk of the guild hall to assist visitors, process completed contracts, distribute payouts, and log daily activities.',
    sort: 4,
  },
  registrar: {
    title: 'Guild Registrar',
    description: 'Processes new memberships, manages official quest board deployments, and balances contract difficulties to ensure efficient member leveling.',
    sort: 5,
  },
  scullion: {
    title: 'Hall Scullion',
    description: 'Maintains the cleanliness and presentation of the guild hall, reporting structural maintenance needs to the labor department.',
    sort: 6,
  },
  warden: {
    title: 'Guild Warden',
    description: 'Safeguards the guild hall against intruders, protects staff, and maintains internal order and peace.',
    sort: 7,
  },
  quarter_master: {
    title: 'Quartermaster',
    description: 'Manages logistics, oversees internal deployments, and rotates specialists into various professions based on immediate guild needs.',
    sort: 8,
  },
  dispatcher: {
    title: 'Guild Dispatcher',
    description: 'Coordinates active field assignments and ensures the correct tactical skillsets are deployed out to active missions.',
    sort: 9,
  },
  artisan: {
    title: 'Guild Artisan',
    description: 'Constructs new chambers, reinforces structural defenses, and refurbishes rooms throughout the guild halls.',
    sort: 10,
  },
  chronicler: {
    title: 'Guild Chronicler',
    description: 'Archives daily logs and records received from the clerks to preserve history, investigate complaints, and conduct audits.',
    sort: 11,
  },
  steward: {
    title: 'Guild Steward',
    description: 'Oversees vaults and inventories containing quest supplies, materials, hunting drops, and armaments for optimal efficiency.',
    sort: 12,
  },
  provisioner: {
    title: 'Guild Provisioner',
    description: 'Sustains the guild by preparing specialized, hearty meals tailored to keep members happy, strong, and healthy.',
    sort: 13,
  },
  laborer: {
    title: 'Guild Laborer',
    description: 'Handles everyday manual tasks including restocking essential water and fuel supplies, alongside managing guild transportation.',
    sort: 14,
  },
  instructor: {
    title: 'Guild Instructor',
    description: 'Trains unseasoned members to hone their martial or magical skills before they are permitted to accept dangerous contracts.',
    sort: 15,
  },
  adventurer: {
    title: 'Adventurer',
    description: 'The lifeblood of the guild. Undertakes perilous quests, forms parties for deep dungeon raids, and executes profession contracts.',
    sort: 16,
  },
  initiate: {
    title: 'Guild Initiate',
    description: 'The newest addition to the guild hierarchy. Forbidden from taking lethal contracts until basic training is complete.',
    sort: 17,
  },
  treasurer: {
    title: 'Guild Treasurer',
    description: 'Manages the guild vaults, processes substantial transactional payouts, handles kingdom taxes, and allocates department budgets.',
    sort: 18,
  },
  none: {
    title: 'No Guild Affiliation',
    description: 'Not affiliated with any guilds yet.',
    sort: 19
  }
}
