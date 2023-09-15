export async function fetchWithRetry(
  url,
  maxRetryAttempts = 3,
  retryDelay = 1000
) {
  for (let retryCount = 0; retryCount <= maxRetryAttempts; retryCount++) {
    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Fetch failed with status ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error:", error);

      if (retryCount < maxRetryAttempts) {
        await new Promise((resolve) => setTimeout(resolve, retryDelay));
      } else {
        throw error;
      }
    }
  }
}
