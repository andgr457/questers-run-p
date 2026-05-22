import { MOBS_SLIMES_ALL } from '../../data/mobs/Mobs.Slimes.data';
import type { Mob } from '../../interfaces/mobs/Mob.types';

export class MobRepository {
  private ALL_MOBS: Mob[] = [
    ...MOBS_SLIMES_ALL,
  ]

  async list(): Promise<Mob[]> {
    return this.ALL_MOBS
  }

  async byId(id: string): Promise<Mob | undefined> {
    return this.ALL_MOBS.find(m => m.id === id)
  }
}