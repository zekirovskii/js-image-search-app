import axios from 'axios';

const API_KEY = '50314234-ba813915cbcdccb3e2319b70f';
const BASE_URL = 'https://pixabay.com/api/';

export async function fetchImages(query, page = 1, perPage = 40) {
  const params = {
    key: API_KEY,
    q: query,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    page,
    per_page: perPage,
  };

  try {
    const response = await axios.get(BASE_URL, { params });
    return response.data; // Sadece data kısmını döndür
  } catch (error) {
    console.error('Fetch error:', error);
    throw error; // Hata yönetimini ana dosyaya bırak
  }
}
