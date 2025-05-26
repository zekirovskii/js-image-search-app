import { fetchImages } from './js/pixabay-api.js';
import { renderGallery, clearGallery, showLoader, hideLoader, showLoadMoreBtn, hideLoadMoreBtn } from './js/render-functions.js';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const form = document.querySelector('#searchForm');
const input = document.querySelector('#searchInput');
const loadMoreBtn = document.getElementById('loadMoreBtn');

let searchQuery = '';
let page = 1;
const perPage = 40;

// Form gönderildiğinde
form.addEventListener('submit', event => {
  event.preventDefault();

  searchQuery = input.value.trim();
  if (!searchQuery) return;

  page = 1;
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

      // Galeri varsa load more düğmesini gösterir
      showLoadMoreBtn();
    })
    .catch(error => {
      console.error('Fetch error:', error);
      iziToast.error({
        title: 'Error',
        message: 'We are sorry, but you have reached the end of search results.',
        position:'topRight'
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
    })
    .catch(error => {
      console.error('Fetch error:', error);
      iziToast.error({
        title: 'Error',
        message: 'We are sorry, but you have reached the end of search results.',
        position:'topRight'
      });
      hideLoader();
    });
});
