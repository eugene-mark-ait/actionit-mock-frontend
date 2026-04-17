/**
 * Delete Account API Service
 * Handles account deletion via dedicated API Gateway
 */

const DELETE_ACCOUNT_API_BASE = 'https://a0ctu75ua3.execute-api.us-east-1.amazonaws.com/prod';

export interface DeleteAccountResponse {
  success: boolean;
  message: string;
  deletionResults?: {
    users_deleted: number;
    oauth_tokens_deleted: number;
    calendars_deleted: number;
    bots_deleted: number;
    errors: string[];
  };
}

/**
 * Delete user account and all associated data
 */
export async function deleteUserAccount(userId: string): Promise<DeleteAccountResponse> {
  try {
    console.log('[Delete Account API] Deleting account for user:', userId);
    
    const response = await fetch(`${DELETE_ACCOUNT_API_BASE}/delete-account`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Delete Account API] API response not OK:', response.status, errorText);
      throw new Error(`API returned ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log('[Delete Account API] Account deletion successful:', data);
    
    return data;
  } catch (error) {
    console.error('[Delete Account API] Failed to delete account:', error);
    throw error;
  }
}
