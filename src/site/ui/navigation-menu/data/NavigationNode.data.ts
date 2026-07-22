import type { NavigationNode } from '../types/NavigationNode.types'

const ABOUT_NODES: NavigationNode[] = [
  {
    id: 'about',
    title: 'About',
    description: 'Learn about Quester\'s Run, the developer, and the game.',
    order: 1
  },
  {
    id: 'about-development',
    parentId: 'about',
    title: 'Development',
    description: 'Explore the development process behind Quester\'s Run.',
    navMode: 'development',
    order: 1
  },
  {
    id: 'about-game',
    parentId: 'about',
    title: 'Game',
    description: 'Learn about the gameplay, systems, and features.',
    navMode: 'about-game',
    order: 2
  }
]

const CONTACT_NODES: NavigationNode[] = [
  {
    id: 'contact',
    title: 'Contact',
    description: 'Connect with the Quester\'s Run team.',
    order: 2
  },
  {
    id: 'contact-support',
    parentId: 'contact',
    title: 'Support',
    description: 'Get help with questions or issues.',
    order: 1
  },
  {
    id: 'contact-marketing',
    parentId: 'contact',
    title: 'Marketing',
    description: 'Business and partnership inquiries.',
    order: 2
  }
]

const ENCYCLOPEDIA_NODES: NavigationNode[] = [
  {
    id: 'encyclopedia',
    title: 'Encyclopedia',
    description: 'Explore the creatures, items, systems, and world of Quester\'s Run.',
    order: 3
  },
  {
    id: 'encyclopedia-creatures',
    parentId: 'encyclopedia',
    title: 'Creatures',
    description: 'Wildlife, monsters, and legendary beings.',
    order: 1
  },
  {
    id: 'encyclopedia-characters',
    parentId: 'encyclopedia',
    title: 'Characters',
    description: 'Classes, skills, and professions.',
    order: 2
  },
  {
    id: 'encyclopedia-adventures',
    parentId: 'encyclopedia',
    title: 'Adventures',
    description: 'Quests and progression.',
    order: 3
  },
  {
    id: 'encyclopedia-items',
    parentId: 'encyclopedia',
    title: 'Items',
    description: 'Equipment, crafting, and loot.',
    order: 4
  },
  {
    id: 'encyclopedia-world',
    parentId: 'encyclopedia',
    title: 'World',
    description: 'Locations and geography.',
    order: 5
  },

  {
    id: 'encyclopedia-beastiary',
    parentId: 'encyclopedia-creatures',
    title: 'Beastiary',
    description: 'Discover creatures, monsters, and wildlife.',
    filterType: 'beastiary',
    order: 1
  },

  {
    id: 'encyclopedia-classes',
    parentId: 'encyclopedia-characters',
    title: 'Classes',
    description: 'Explore character classes and archetypes.',
    filterType: 'classes',
    order: 1
  },
  {
    id: 'encyclopedia-skills',
    parentId: 'encyclopedia-characters',
    title: 'Skills',
    description: 'Explore abilities and combat techniques.',
    filterType: 'skills',
    order: 2
  },
  {
    id: 'encyclopedia-professions',
    parentId: 'encyclopedia-characters',
    title: 'Professions',
    description: 'Discover gathering and crafting professions.',
    filterType: 'professions',
    order: 3
  },

  {
    id: 'encyclopedia-quests',
    parentId: 'encyclopedia-adventures',
    title: 'Quests',
    description: 'Explore quest types and adventures.',
    filterType: 'quests',
    order: 1
  },

  {
    id: 'encyclopedia-weapons',
    parentId: 'encyclopedia-items',
    title: 'Weapons',
    description: 'Explore weapons and combat equipment.',
    filterType: 'weapons',
    order: 1
  },
  {
    id: 'encyclopedia-armor',
    parentId: 'encyclopedia-items',
    title: 'Armor',
    description: 'Explore defensive equipment and protection.',
    filterType: 'armor',
    order: 2
  },
  {
    id: 'encyclopedia-jewelry',
    parentId: 'encyclopedia-items',
    title: 'Jewelry',
    description: 'Explore wearable accessories and bonuses.',
    filterType: 'jewelry',
    order: 3
  },
  {
    id: 'encyclopedia-recipes',
    parentId: 'encyclopedia-items',
    title: 'Recipes',
    description: 'Discover crafting and cooking recipes.',
    filterType: 'recipes',
    order: 4
  },

  {
    id: 'world-locations',
    parentId: 'encyclopedia-world',
    title: 'Locations',
    description: 'Cities, dungeons, and points of interest.',
    filterType: 'locations',
    order: 1
  },
  {
    id: 'world-worlds',
    parentId: 'encyclopedia-world',
    title: 'Worlds',
    description: 'Major worlds within Quester\'s Run.',
    filterType: 'worlds',
    order: 2
  },
  {
    id: 'world-regions',
    parentId: 'encyclopedia-world',
    title: 'Regions',
    description: 'Regional areas and territories.',
    filterType: 'regions',
    order: 3
  },
  {
    id: 'world-kingdoms',
    parentId: 'encyclopedia-world',
    title: 'Kingdoms',
    description: 'Kingdoms and governing powers.',
    filterType: 'kingdoms',
    order: 4
  }
]

export const NAVIGATION_NODES: NavigationNode[] = [
  ...ABOUT_NODES,
  ...CONTACT_NODES,
  ...ENCYCLOPEDIA_NODES
]