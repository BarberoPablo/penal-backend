/**
 * Worlds Edge Link API (AoE2:DE)
 *
 * Base: https://aoe-api.worldsedgelink.com/community/leaderboard
 *
 * Rate limit: 50 requests/second (community endpoints, no auth required)
 *
 * ---
 *
 * Get player profile by Steam ID:
 *   GET /GetPersonalStat?title=age2&profile_names=["/steam/{steamId}"]
 *   Example: /GetPersonalStat?title=age2&profile_names=["/steam/76561198115456790"]
 *
 * Get player profiles by profile_id (array):
 *   GET /GetPersonalStat?title=age2&profile_ids=[id1,id2,...]
 *   Example: /GetPersonalStat?title=age2&profile_ids=[10208006,2778864]
 */

const BASE_URL = 'https://aoe-api.worldsedgelink.com/community/leaderboard';

export function getAoe2ProfileBySteamIdUrl(steamId: string): string {
  return `${BASE_URL}/GetPersonalStat?title=age2&profile_names=["/steam/${steamId}"]`;
}

export function getAoe2ProfileByProfileIdsUrl(profileIds: number[]): string {
  return `${BASE_URL}/GetPersonalStat?title=age2&profile_ids=[${profileIds.join(',')}]`;
}

export const AOE2_LB_1V1_RANDOM_MAP = 3;
