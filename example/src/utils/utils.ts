export const getSecureToken = async (apiSecretKey: string) => {
  // Implement this logic from your backend for greater security, and do not share your API secret key.
  const response = await fetch(
    'http://192.168.100.117:8000/api/secure-token/',
    {
      method: 'POST',
      headers: {
        'Authorization': `Token ${apiSecretKey}`,
        'Content-Type': 'application/json',
      },
    }
  );

  const data = await response.json();
  return data.access || '';
};
