import axios from 'axios';

const UNSPLASH_API_URL = 'https://api.unsplash.com/search/photos';
const UNSPLASH_ACCESS_KEY = 'FZsqnBiME_GA2wM7fpEyqrzAMmIGkoVWsh9nz9dumvs'; // Replace with your Unsplash access key

export const fetchImage = async (query) => {
  try {
    const response = await axios.get(UNSPLASH_API_URL, {
      params: {
        query,
        client_id: UNSPLASH_ACCESS_KEY,
        per_page: 1
      }
    });
    return response.data.results[0]?.urls?.small;
  } catch (error) {
    console.error('Error fetching image:', error);
    return null;
  }
};