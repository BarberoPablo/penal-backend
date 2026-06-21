import { SetMetadata } from '@nestjs/common';

export const COMPETITION_ADMIN_KEY = 'competitionAdmin';
export const CompetitionAdmin = () => SetMetadata(COMPETITION_ADMIN_KEY, true);
