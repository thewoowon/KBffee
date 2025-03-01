export const fetchUserProfile = async (): Promise<void> => {
  try {
    const response = await fetch('https://api.example.com/user', {
      method: 'GET',
    });

    if (!response.ok) throw new Error('Failed to fetch user profile');

    const data = await response.json();
  } catch (error) {
    console.error('Failed to fetch user profile:', error);
  }
};
