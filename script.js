document.addEventListener('DOMContentLoaded', () => {
    const reviewForm = document.getElementById('reviewForm');
    const reviewsContainer = document.getElementById('reviewsContainer');
    const searchInput = document.getElementById('searchInput');
    let selectedRating = 0;
  
    // Star rating functionality
    const stars = document.querySelectorAll('#starRating .star');
    stars.forEach((star, index) => {
      star.addEventListener('click', () => {
        selectedRating = index + 1;
        updateStarRating();
      });
    });
  
    function updateStarRating() {
      stars.forEach((star, i) => {
        star.classList.toggle('active', i < selectedRating);
      });
    }
  
    // Form submission
    reviewForm.addEventListener('submit', (event) => {
      event.preventDefault();
  
      const seriesName = document.getElementById('seriesName').value;
      const reviewText = document.getElementById('reviewText').value;
      const reviewDate = document.getElementById('reviewDate').value;
      const genre = document.getElementById('genre').value;
      const seriesImage = document.getElementById('seriesImage').files[0];
  
      if (seriesName && reviewText && selectedRating && reviewDate && genre) {
        const reviewContainer = document.createElement('div');
        reviewContainer.classList.add('review');
        reviewContainer.setAttribute('data-rating', selectedRating);
        reviewContainer.setAttribute('data-series', seriesName.toLowerCase());
        reviewContainer.setAttribute('data-date', reviewDate);
  
        const ratingStars = '★'.repeat(selectedRating) + '☆'.repeat(5 - selectedRating);
        const imgElement = document.createElement('img');
        imgElement.src = seriesImage ? URL.createObjectURL(seriesImage) : 'placeholder.jpg';
  
        reviewContainer.innerHTML = `
          <h3>${seriesName}</h3>
          <p>${reviewText}</p>
          <p><strong>Date:</strong> ${reviewDate}</p>
          <p><strong>Genre:</strong> ${genre}</p>
          <p class="rating-display">${ratingStars}</p>
        `;
  
        reviewContainer.prepend(imgElement);
        reviewsContainer.prepend(reviewContainer);
  
        reviewForm.reset();
        selectedRating = 0;
        updateStarRating();
  
        updateStats();
      } else {
        alert("Please fill out all fields and select a rating.");
      }
    });
  
    function updateStats() {
      const reviews = document.querySelectorAll('.review');
      const totalReviews = reviews.length;
      const averageRating = [...reviews].reduce((acc, review) => acc + parseInt(review.getAttribute('data-rating')), 0) / totalReviews || 0;
  
      document.getElementById('totalReviews').innerText = `Total Reviews: ${totalReviews}`;
      document.getElementById('averageRating').innerText = `Average Rating: ${averageRating.toFixed(1)} ★`;
    }
  
    searchInput.addEventListener('keyup', () => {
      const searchQuery = searchInput.value.toLowerCase();
      const reviews = document.querySelectorAll('.review');
      reviews.forEach(review => {
        const series = review.getAttribute('data-series');
        review.style.display = series.includes(searchQuery) ? '' : 'none';
      });
    });
  });
  
  function toggleTheme() {
    document.documentElement.dataset.theme =
      document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  }
  
  function filterReviews(type) {
    const reviews = Array.from(document.querySelectorAll('.review'));
  
    if (type === 'top') {
      reviews.forEach(review => {
        const rating = parseInt(review.getAttribute('data-rating'), 10);
        review.style.display = rating >= 4 ? '' : 'none';
      });
    } else if (type === 'recent') {
      reviews.sort((a, b) => new Date(b.getAttribute('data-date')) - new Date(a.getAttribute('data-date')));
      reviews.forEach(review => reviewsContainer.appendChild(review));
      reviews.forEach(review => (review.style.display = ''));
    } else {
      reviews.forEach(review => (review.style.display = ''));
    }
  
    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
    document.querySelector(`.tab[onclick="filterReviews('${type}')"]`).classList.add('active');
  }
  
  function scrollToForm() {
    document.querySelector('.review-form').scrollIntoView({ behavior: 'smooth' });
  }
  
  function filterByShow(showName) {
    const reviews = document.querySelectorAll('.review');
    reviews.forEach(review => {
      const series = review.getAttribute('data-series');
      review.style.display = series === showName.toLowerCase() ? '' : 'none';
    });
  }
  