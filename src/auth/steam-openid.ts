import { authConfig } from './config.js';

const STEAM_OPENID_URL = 'https://steamcommunity.com/openid/login';
const STEAM_API_URL = 'https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/';

export function buildSteamLoginUrl(returnUrl: string, realm?: string): string {
  const params = new URLSearchParams({
    'openid.ns': 'http://specs.openid.net/auth/2.0',
    'openid.mode': 'checkid_setup',
    'openid.return_to': returnUrl,
    'openid.realm': realm ?? authConfig.backendUrl,
    'openid.identity': 'http://specs.openid.net/auth/2.0/identifier_select',
    'openid.claimed_id': 'http://specs.openid.net/auth/2.0/identifier_select',
  });

  return `${STEAM_OPENID_URL}?${params.toString()}`;
}

export interface SteamProfile {
  steamId: string;
  displayName: string;
  avatarUrl: string | null;
}

export function extractSteamId(claimedId: string): string | null {
  const match = claimedId.match(/\/id\/(\d+)$/);
  return match ? match[1] : null;
}

export async function verifySteamLogin(params: Record<string, string>): Promise<boolean> {
  const formData = new URLSearchParams({
    'openid.assoc_handle': params['openid.assoc_handle'] ?? '',
    'openid.signed': params['openid.signed'] ?? '',
    'openid.sig': params['openid.sig'] ?? '',
    'openid.ns': 'http://specs.openid.net/auth/2.0',
    'openid.mode': 'check_authentication',
  });

  for (const key of (params['openid.signed'] ?? '').split(',')) {
    const value = params[`openid.${key}`];
    if (value) formData.set(`openid.${key}`, value);
  }

  const res = await fetch(STEAM_OPENID_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: formData.toString(),
  });

  const text = await res.text();
  return text.includes('is_valid:true');
}

export async function fetchSteamProfile(steamId: string): Promise<SteamProfile> {
  const url = `${STEAM_API_URL}?key=${authConfig.steamApiKey}&steamids=${steamId}`;
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Steam API error: ${res.status}`);
  }

  const body = await res.json();
  const player = body?.response?.players?.[0];

  if (!player) {
    throw new Error('Steam profile not found');
  }

  return {
    steamId,
    displayName: player.personaname ?? 'Unknown',
    avatarUrl: player.avatarmedium ?? null,
  };
}
