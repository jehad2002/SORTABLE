document.addEventListener('DOMContentLoaded', () => {
  const pageSizeSelect = document.getElementById('pageSize');
  const searchInput = document.getElementById('searchInput');
  const tableBody = document.getElementById('heroesBody');
  const paginationDiv = document.getElementById('pagination');
  let heroesData = [];
  let currentPage = 1;
  let pageSize = parseInt(pageSizeSelect.value);

  // Fetch data from API
  fetch('https://rawcdn.githack.com/akabab/superhero-api/0.2.0/api/all.json')
      .then(response => response.json())
      .then(data => {
          heroesData = data;
          renderTable();
          renderPagination();
      })
      .catch(console.error);

  // Render table based on current page and page size
  function renderTable() {
      const filteredData = heroesData.filter(hero =>
          hero.name.toLowerCase().includes(searchInput.value.toLowerCase())
      );
      const sortedData = [...filteredData].sort((a, b) => {
          const key = document.querySelector('#heroesTable th.sort-asc')?.getAttribute('data-sort') ||
                      document.querySelector('#heroesTable th.sort-desc')?.getAttribute('data-sort');
          if (!key) return 0;

          const valA = deepValue(a, key);
          const valB = deepValue(b, key);

          if (valA == null) return 1;
          if (valB == null) return -1;

          return isNaN(valA) ? valA.toString().localeCompare(valB) : valA - valB;
      });

      const paginatedData = sortedData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

      tableBody.innerHTML = paginatedData.map(hero => `
          <tr>
              <td><img src="${hero.images.xs}" alt="${hero.name}" class="hero-icon"></td>
              <td><a href="hero-details.html?name=${encodeURIComponent(hero.name)}">${hero.name}</a></td>
              <td>${hero.biography.fullName}</td>
              <td>${hero.powerstats.intelligence}</td>
              <td>${hero.powerstats.strength}</td>
              <td>${hero.appearance.race}</td>
              <td>${hero.appearance.gender}</td>
              <td>${hero.appearance.height[0]}</td>
              <td>${hero.appearance.weight[0]}</td>
              <td>${hero.biography.placeOfBirth}</td>
              <td>${hero.biography.alignment}</td>
          </tr>
      `).join('');
  }

  // Helper function to access nested properties dynamically
  function deepValue(obj, path) {
      return path.split('.').reduce((acc, part) => acc?.[part], obj);
  }

  // Render pagination controls
  function renderPagination() {
      const totalItems = heroesData.filter(hero =>
          hero.name.toLowerCase().includes(searchInput.value.toLowerCase())
      ).length;
      const totalPages = Math.ceil(totalItems / pageSize);

      paginationDiv.innerHTML = Array.from({ length: totalPages }, (_, i) => `
          <button class="${i + 1 === currentPage ? 'active' : ''}">${i + 1}</button>
      `).join('');

      paginationDiv.querySelectorAll('button').forEach((button, i) => {
          button.addEventListener('click', () => {
              currentPage = i + 1;
              renderTable();
              updatePagination();
          });
      });
  }

  // Update pagination buttons state
  function updatePagination() {
      paginationDiv.querySelectorAll('button').forEach((button, i) => {
          button.classList.toggle('active', i + 1 === currentPage);
      });
  }

  // Event listeners
  pageSizeSelect.addEventListener('change', () => {
      pageSize = parseInt(pageSizeSelect.value);
      currentPage = 1;
      renderTable();
      renderPagination();
  });

  searchInput.addEventListener('input', () => {
      currentPage = 1;
      renderTable();
      renderPagination();
  });

  // Initial setup
  renderTable();
  renderPagination();
});
