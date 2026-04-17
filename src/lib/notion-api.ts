/**
 * Notion API Integration via Lambda
 * Uses AWS Lambda to handle Notion operations with secrets from AWS Secrets Manager
 */

export interface NotionPage {
  id: string;
  title: string;
  url: string;
  created_time: string;
  last_edited_time: string;
  parent: {
    type: string;
    database_id?: string;
    page_id?: string;
  };
}

export interface NotionApiResponse {
  success: boolean;
  pages?: NotionPage[];
  selected_page?: {
    id: string;
    title: string;
  };
  notion_configured?: boolean;  // Added: backend returns this field
  error?: string;
}

// API Gateway endpoint for Notion handler
const NOTION_API_BASE = 'https://w6h7umfa5b.execute-api.us-east-1.amazonaws.com/prod';

/**
 * Search for Notion pages
 */
export async function searchNotionPages(userId: string, query?: string): Promise<NotionPage[]> {
  try {
    const params = new URLSearchParams();
    params.append('user_id', userId); // Required: backend needs user_id to get their Notion token
    if (query) {
      params.append('query', query);
    }
    
    const response = await fetch(`${NOTION_API_BASE}/notion/search?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Notion search API error: ${response.status} - ${errorText}`);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: NotionApiResponse = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to search pages');
    }

    return data.pages || [];
  } catch (error) {
    console.error('Error searching Notion pages:', error);
    throw error;
  }
}

/**
 * Select a Notion page for the user
 */
export async function selectNotionPage(userId: string, pageId: string, pageTitle: string): Promise<void> {
  try {
    const response = await fetch(`${NOTION_API_BASE}/notion/select-page`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: userId,
        page_id: pageId,
        page_title: pageTitle
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: NotionApiResponse = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to select page');
    }
  } catch (error) {
    console.error('Error selecting Notion page:', error);
    throw error;
  }
}

/**
 * Post meeting analysis to Notion
 */
export async function postAnalysisToNotion(userId: string, analysis: any): Promise<void> {
  try {
    const response = await fetch(`${NOTION_API_BASE}/notion/post-analysis`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: userId,
        analysis: analysis
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: NotionApiResponse = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to post analysis');
    }
  } catch (error) {
    console.error('Error posting analysis to Notion:', error);
    throw error;
  }
}

/**
 * Get user's Notion integration status
 */
export async function getNotionStatus(userId: string): Promise<{
  notion_configured: boolean;
  selected_page?: {
    id: string;
    title: string;
  };
  has_token?: boolean;
  has_page?: boolean;
  token_invalid?: boolean;
  marketplace_installed?: boolean;
}> {
  try {
    const response = await fetch(`${NOTION_API_BASE}/notion/status?user_id=${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Notion status API error: ${response.status} - ${errorText}`);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: any = await response.json();
    
    console.log('[Notion API] Status response:', JSON.stringify(data, null, 2));
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to get status');
    }

    // Use the backend's notion_configured value (it properly checks token, expiration, and page)
    const result = {
      notion_configured: data.notion_configured || false,
      selected_page: data.selected_page || undefined,
      has_token: data.has_token || false,
      has_page: data.has_page || false,
      token_invalid: data.token_invalid || false,
      marketplace_installed: data.marketplace_installed ?? false,
    };
    
    console.log('[Notion API] Parsed result:', JSON.stringify(result, null, 2));
    
    return result;
  } catch (error) {
    console.error('Error getting Notion status:', error);
    return {
      notion_configured: false,
      has_token: false,
      has_page: false,
      marketplace_installed: false,
    };
  }
}

/**
 * Store selected page in localStorage (for frontend state)
 */
export function storeSelectedPage(page: NotionPage): void {
  localStorage.setItem('notion_selected_page', JSON.stringify({
    id: page.id,
    title: page.title,
    url: page.url
  }));
}

/**
 * Get selected page from localStorage
 */
export function getSelectedPage(): {id: string, title: string, url: string} | null {
  const stored = localStorage.getItem('notion_selected_page');
  return stored ? JSON.parse(stored) : null;
}

/**
 * Clear selected page
 */
export function clearSelectedPage(): void {
  localStorage.removeItem('notion_selected_page');
}
