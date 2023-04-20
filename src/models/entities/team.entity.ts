import { Player } from '@prisma/client';

export type Team = {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date | null;
  players: Player[];
};
