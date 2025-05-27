// main.js
import { fetchImages } from './js/pixabay-api.js';
import { renderGallery, clearGallery, showLoader, hideLoader, showLoadMoreBtn, hideLoadMoreBtn } from './js/render-functions.js';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const form = document.querySelector('#searchForm');
const input = document.querySelector('#searchInput');
const loadMoreBtn = document.getElementById('loadMoreBtn');

let searchQuery = '';
let page = 1;
let perPage = 40; // İlk başta 40

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  searchQuery = input.value.trim();
  if (!searchQuery) return;

  page = 1;
  perPage = 40;
  clearGallery();
  hideLoadMoreBtn();
  showLoader();

  try {
    const response = await fetchImages(searchQuery, page, perPage);
    const images = response.data.hits;

    if (images.length === 0) {
      iziToast.info({
        title: 'No Results',
        message: 'Sorry, there are no images matching your search query. Please try again!',
        position: 'topRight',
      });
      hideLoader();
      return;
    }

    renderGallery(images);
    hideLoader();
    showLoadMoreBtn();
    perPage = 20; // Sonraki yüklemeler için 20'ye düşür

  } catch (error) {
    console.error('Fetch error:', error);
    iziToast.error({
      title: 'Error',
      message: 'An error occurred while fetching images.',
      position: 'topRight',
    });
    hideLoader();
  }
});

loadMoreBtn.addEventListener('click', async () => {
  page++;
  showLoader();
  hideLoadMoreBtn();

  try {
    const response = await fetchImages(searchQuery, page, perPage);
    const images = response.data.hits;

    if (images.length === 0) {
      iziToast.info({
        title: 'No More Results',
        message: 'No more images found.',
        position: 'topRight',
      });
      hideLoader();
      hideLoadMoreBtn();
      return;
    }

    renderGallery(images);
    hideLoader();
    showLoadMoreBtn();

    // Sayfa kaydırma (scroll)
    const firstCard = document.querySelector('.gallery a');
    if (firstCard) {
      const cardHeight = firstCard.getBoundingClientRect().height;
      window.scrollBy({
        top: cardHeight * 2,
        behavior: 'smooth'
      });
    }

  } catch (error) {
    console.error('Fetch error:', error);
    iziToast.error({
      title: 'Error',
      message: 'We are sorry, but you have reached the end of search results.',
      position: 'topRight',
    });
    hideLoader();
  }
});
