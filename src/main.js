import { fetchImages } from './js/pixabay-api.js';
import { renderGallery, clearGallery, showLoader, hideLoader, showLoadMoreBtn, hideLoadMoreBtn } from './js/render-functions.js';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const form = document.querySelector('#searchForm');
const input = document.querySelector('#searchInput');
const loadMoreBtn = document.getElementById('loadMoreBtn');

let searchQuery = '';
let page = 1;
let perPage = 40; // ilk başta 40

form.addEventListener('submit', event => {
  event.preventDefault();

  searchQuery = input.value.trim();
  if (!searchQuery) return;

  page = 1;
  perPage = 40; // ilk aramada 40 tane
  clearGallery();
  hideLoadMoreBtn();
  showLoader();

  fetchImages(searchQuery, page, perPage)
    .then(response => {
      const images = response.data.hits;

      if (images.length === 0) {
        iziToast.info({
          title: 'No Results',
          message: 'Sorry, there are no images matching your search query. Please try again!',
        });
        hideLoader();
        return;
      }

      renderGallery(images);
      hideLoader();

      // Load more düğmesini göster
      showLoadMoreBtn();

      // Load more sonrası perPage'ı 20'ye düşür
      perPage = 20;
    })
    .catch(error => {
      console.error('Fetch error:', error);
      iziToast.error({
        title: 'Error',
        message: 'We are sorry, but you have reached the end of search results.',
        position: 'topRight'
      });
      hideLoader();
    });
});

loadMoreBtn.addEventListener('click', () => {
  page++;
  showLoader();
  hideLoadMoreBtn();

  fetchImages(searchQuery, page, perPage)
    .then(response => {
      const images = response.data.hits;

      if (images.length === 0) {
        iziToast.info({
          title: 'No More Results',
          message: 'No more images found.',
        });
        hideLoader();
        hideLoadMoreBtn();
        return;
      }

      renderGallery(images);
      hideLoader();
      showLoadMoreBtn();

      // --- Burada sayfa kaydırma işlemi ---
      const firstCard = document.querySelector('.gallery a');
      if (firstCard) {
        const cardHeight = firstCard.getBoundingClientRect().height;
        window.scrollBy({
          top: cardHeight * 2,
          behavior: 'smooth'
        });
      }
    })
    .catch(error => {
      console.error('Fetch error:', error);
      iziToast.error({
        title: 'Error',
        message: 'We are sorry, but you have reached the end of search results.',
        position: 'topRight'
      });
      hideLoader();
    });
});
