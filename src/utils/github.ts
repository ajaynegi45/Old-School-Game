
/**
 * Fetch data from GitHub API without authentication token.
 * Automatically handles errors and logs them in development mode.
 * 
 * @param endpoint 
 * @returns 
 */
export async function fetchGitHub(endpoint: string) {
    const url = `https://api.github.com${endpoint}`;

    try {
        const res = await fetch(url, {
            // No Authorization header → public API
            headers: {
                'Accept': 'application/vnd.github.v3+json',
            },
            next: { revalidate: 3600 } // ISR cache for 1 hour
        });

        if (!res.ok) {
            // Log error for debugging in development
            if (process.env.NODE_ENV === 'development') {
                console.error(`GitHub API Error [${res.status}]: ${res.statusText} → ${url}`);
            }
            throw new Error(`GitHub API request failed for ${endpoint}`);
        }

        return res.json();
    } catch (error) {
        console.error('GitHub Fetch Failed:', error);
        return []; // return empty array to prevent crash in UI
    }
}
