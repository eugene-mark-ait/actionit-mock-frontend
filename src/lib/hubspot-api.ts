/* HubSpot API Integration via Lambda.*/
import { apiFetch } from '@/lib/api-client'
import { HUBSPOT_API_BASE, HUBSPOT_PATHS } from './hubspot-config';

export interface HubspotStatus {
  hubspot_configured: boolean;
  has_token?: boolean;
  token_invalid?: boolean;
}

/* Get user's HubSpot integration status and call this on dashboard load and when returning from OAuth callback.*/
export async function getHubspotStatus(userId: string): Promise<HubspotStatus> {
  try {
    const response = await apiFetch(
      `${HUBSPOT_API_BASE}${HUBSPOT_PATHS.status}?user_id=${encodeURIComponent(userId)}`,
      {
        method: 'GET',
      },
    );

    if (!response.ok) {
      const text = await response.text();
      console.error('[HubSpot API] status error:', response.status, text);
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();

    if (data && data.success === false && data.error) {
      throw new Error(data.error);
    }

    /* His API returns { "status": "success" }. Map to our shape. */
    const ok = data?.status === 'success' || data?.hubspot_configured === true;
    return {
      hubspot_configured: ok,
      has_token: data?.has_token ?? ok,
      token_invalid: data?.token_invalid ?? false,
    };
  } catch (err) {
    console.error('[HubSpot API] getHubspotStatus error:', err);
    return {
      hubspot_configured: false,
      has_token: false,
      token_invalid: false,
    };
  }
}
