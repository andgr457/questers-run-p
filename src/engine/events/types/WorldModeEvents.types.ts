
export type WorldModeMain = 
  'none' 
  | 'start' //checks for existing main character and goes through initial setup with the player to create a character.
  | 'wiki'
  
  
  | 'character:detail' //character field values, statistics, and other things. A character sheet.
  | 'character:create' //where you can summon isekai'd heroes, name them and set their class, to become members in the guild.

  | 'town:detail' //town field values, statistics, routes characters can travel to, and other things. 
  | 'town:map' //where you can view and navigate around various establishments or immediate area routes linked to the town
  | 'town:hall' //where you establish your first guild, pay guild dues/fines, purchase properties, purchase/renew licenses, and request meetings with nobles.
  | 'town:hall:rentals' //where you can rent an establishment to house your first guild
  | 'town:hall:registrar' //where you can register a new guild, apply for licenses, and register new members for tax purposes of course

  | 'guild:create' //where you will create your first guild and other "may" follow if you wish and have the funds for upkeep of many guilds in your management.
  | 'guild:detail' //selected guild field values, statistics, and other things
  | 'guild:hall' //where you, as the guild master, can manage various members, their roles, queue up guild hall tasks, and other things.
  | 'guild:clerk' //where you view the current day's logs, make requests for adventuerers and other roles to complete, and change the guild status to stop/start accepting quests, among other things.
  | 'guild:quest:board' //where the clerk posts new, vetted, quests and takes down old quests to be moved to the priority quest board.
  | 'guild:quest:request' //where anyone can request a task to complete. Can request items for professions, hunt mobs and/or gather mob drops, hunt bounties, and set max gold payout etc...
  | 'guild:warehouse' //where the guilds resources are stored for quest rewards, mob drops, and other items to keep inventory management flowing efficiently.
  | 'guild:kitchen' //where the cooks prepare meals for guild members
  | 'guild:washroom' //everyone's gotta go and everyone SHOULD wash up regularly
  | 'guild:laundromat' //where cleaners wash adventurer's dirty, smelly, clothes overnight to keep hygeine up for the guild
  | 'guild:quarters' //where members who cannot afford to rent a room at the tavern or a dwelling nor afford their own property. Space is limited unless you build more quarters.
  | 'guild:office:scout' //where scout reports are available to manage for potential talent requirement
  | 'guild:office:guild-master' //where the guild master completes many of their daily duties.
  | 'guild:office:conference' //general conference room where meetings occur.
  | 'guild:office:labor' //where laborers base their operations
  | 'guild:basement' //where trainers can be found along with holding cells for temporary lockup of ill-will individuals.
  
  | 'tavern:detail' //tavern field values, statistics, and other things.
  | 'tavern:hall' //landing where you can navigate around to the bar, meet
  | 'tavern:room' //where you can sleep for the night, meditate on the day's events, or just get away for some me time
  | 'tavern:bar' //where you can rent a room, discounts for longer stays, purchase food to replenish stats, and purchase drinks for social events
  | 'tavern:table' //where you can order food and drink, meet with others, and participate in events and games
  | 'tavern:basement' //where most things are stored
  
  | 'class:detail'
  
  | 'skill:detail'
  
  | 'role:guild:detail' //details about the selected guild role
  | 'role:party:detail' //details about the selected party role

  | 'profession:detail' //details about the selected profession along with selected character progress details
  | 'profession:mining' //where you can mine resources for use in smithing
  | 'profession:smithing' //where you can refine ore into ingots, then into weapons, armor, and other recipe items like nails
  | 'profession:leatherworking' //where you can process hides/skins and craft leather armor and other recipe items like linings, waterskins, hilt wraps, etc...
  | 'profession:farming' //where you work the land to provide raw ingredients for meals and other professions
  | 'profession:cooking' //where you cook meal recipes
  | 'profession:hunting' //where you can track and hunt specific mobs/adventurers to grind or for quests outside of RNG area entry event, dungeons, and raids where mobs are encountered. Bounty hunting as well.
  | 'profession:forestry' //where you cut and plant trees in designated zones for wood and other profession materials
  | 'profession:botany' //where you research and develop stronger seeds for farmers and experiment with various plants, mushrooms, and other things
  | 'profession:carpentry' //where you work with wood to create items and parts for materials for other professions
  | 'profession:masonry' //where you mix various elements to create stronger and stronger brick to build with (or sell)
  
  | 'profession:architecture:design' //where you create plans for new towns, buildings, roads, etc.. all with user experience in mind
  | 'profession:architecture:engineering' //Blends creative design with rigorous mathematics and physics to master structural systems, acoustics, lighting, and other systems.
  | 'profession:architecture:technology' //Focuses on the practical execution of building designs using modern construction detailing, building information modeling magic, and building codes
  | 'profession:architecture:structural'//A joint subfield with civil engineering that specializes in calculating structural loads to ensure buildings safely withstand physical forces.
  | 'profession:architecture:construction' //: Covers the business, budgeting, scheduling, and physical coordination required to safely execute a project from blueprint to final build.

export type WorldModeOverlay = 'none' | 'intro' | 'mode-change'

export interface WorldModeMainChangeEventMeta {
  mode: WorldModeMain
}

export interface WorldModeMainChangedEventMeta {
  mode: WorldModeMain
}

export interface WorldModeOverlayChangeEventMeta {
  mode: WorldModeOverlay
  transitionText: string
  transitionOnCompleteMode: WorldModeMain
}

export interface WorldModeOverlayChangedEventMeta {
  mode: WorldModeOverlay
  transitionText: string
  transitionOnCompleteMode: WorldModeMain
}

export interface WorldModeEventMap {
  'world:mode:main:change': WorldModeMainChangeEventMeta
  'world:mode:main:changed': WorldModeMainChangedEventMeta
  'world:mode:overlay:change': WorldModeOverlayChangeEventMeta
  'world:mode:overlay:changed': WorldModeOverlayChangedEventMeta
}