/**
 * User Metrics API
 * Fetches user statistics from the backend
 */

const METRICS_API_BASE = 'https://w6h7umfa5b.execute-api.us-east-1.amazonaws.com/prod';

export interface UserMetrics {
  total_meetings: number;
  meetings_this_month: number;
  total_transcripts: number;
  average_confidence_score: number;
  average_meeting_length_minutes: number;
  timestamp: string;
}

export async function getUserMetrics(userId: string): Promise<UserMetrics> {
  try {
    const response = await fetch(`${METRICS_API_BASE}/user-metrics?user_id=${encodeURIComponent(userId)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch metrics: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching user metrics:', error);
    // Return default values on error
    return {
      total_meetings: 0,
      meetings_this_month: 0,
      total_transcripts: 0,
      average_confidence_score: 0,
      average_meeting_length_minutes: 0,
      timestamp: new Date().toISOString(),
    };
  }
}











