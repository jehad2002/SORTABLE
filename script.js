// "use strict";

// export function loadData() {
//     fetch("https://rawcdn.githack.com/akabab/superhero-api/0.2.0/api/all.json").then(response => response.json()).then(createPage)
// }

// function createPage(json) {
//     const table = document.createElement("table")
    
//     json.map(data => {
//         const row = document.createElement('tr')
//         const arrShow = [".images.xs", ".name", ".biography.fullName", ".powerstats", ".appearance.race", ".appearance.gender", ".appearance.height", ".appearance.weight", ".biography.placeOfBirth", ".biography.alignment"]
//         arrShow.map(show => {
//             const col = document.createElement('td')
//             const key = show.split('.')
//             if (show === ".images.xs") {
//                 const img = document.createElement('img')
//                 img.src = data[`${key[1]}`][`${key[2]}`]
//                 row.append(img)
//             } else if (show === ".powerstats") {
//                 for (const [stat, value] of Object.entries(data[`${key[1]}`])) {
//                     console.log(data.name, stat, value)
//                     col.textContent += `${stat}: ${value}\n`
//                 }
//                 row.append(col)
//             } else {
//                 col.textContent = key.length === 2? data[`${key[1]}`] : data[`${key[1]}`][`${key[2]}`]
//                 row.append(col)
//             }
//         })
//         table.append(row)
//     })
//     document.body.append(table)
// }

document.addEventListener('DOMContentLoaded', function() {
    const pageSizeSelect = document.getElementById('pageSize');
    const searchInput = document.getElementById('searchInput');
    const tableBody = document.getElementById('heroesBody');
    let heroesData = []; // To store fetched data
    let currentPage = 1;
    let pageSize = parseInt(pageSizeSelect.value);
  
    // Fetch data from API
    fetch('https://rawcdn.githack.com/akabab/superhero-api/0.2.0/api/all.json')
      .then(response => response.json())
      .then(data => {
        heroesData = data; // Store data in global variable
        renderTable(currentPage, pageSize); // Render initial table
        renderPagination(); // Render initial pagination controls
      })
      .catch(error => console.error('Error fetching data:', error));
  
    // Render table based on current page and page size
    function renderTable(page, size) {
      currentPage = page;
      pageSize = size;
  
      // Clear previous table rows
      tableBody.innerHTML = '';
  
      // Filtered and sorted data
      let filteredData = applyFilters(heroesData);
      let sortedData = applySorting(filteredData);
  
      // Pagination logic
      const startIndex = (currentPage - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedData = sortedData.slice(startIndex, endIndex);
  
      // Render rows
      paginatedData.forEach(hero => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td><img src="${hero.images.xs}" alt="${hero.name}" class="hero-icon"></td>
          <td>${hero.name}</td>
          <td>${hero.biography.fullName}</td>
          <td>${hero.powerstats.intelligence}</td>
          <td>${hero.powerstats.strength}</td>
          <td>${hero.appearance.race}</td>
          <td>${hero.appearance.gender}</td>
          <td>${hero.appearance.height[0]}</td>
          <td>${hero.appearance.weight[0]}</td>
          <td>${hero.biography.placeOfBirth}</td>
          <td>${hero.biography.alignment}</td>
        `;
        tableBody.appendChild(row);
      });
    }
  
    // Apply filters based on search input
    function applyFilters(data) {
      const searchTerm = searchInput.value.trim().toLowerCase();
      if (!searchTerm) return data;
      return data.filter(hero =>
        hero.name.toLowerCase().includes(searchTerm)
      );
    }
  
    // Apply sorting based on table header click
    function applySorting(data) {
      const headers = document.querySelectorAll('#heroesTable th');
      let sortedData = [...data];
  
      headers.forEach(header => {
        header.addEventListener('click', function() {
          const sortBy = this.getAttribute('data-sort');
          sortedData.sort((a, b) => compareValues(a, b, sortBy));
          renderTable(currentPage, pageSize);
        });
      });
  
      return sortedData;
    }
  
    // Helper function to compare values for sorting
    function compareValues(a, b, key) {
      const valueA = deepValue(a, key);
      const valueB = deepValue(b, key);
  
      // Handle missing values
      if (valueA === undefined) return 1;
      if (valueB === undefined) return -1;
  
      // Numeric or string comparison
      if (!isNaN(valueA) && !isNaN(valueB)) {
        return valueA - valueB;
      } else {
        return valueA.toString().localeCompare(valueB);
      }
    }
  
    // Helper function to access nested properties dynamically
    function deepValue(obj, path) {
      const parts = path.split('.');
      let value = obj;
      for (let part of parts) {
        if (!value || !value.hasOwnProperty(part)) {
          return undefined;
        }
        value = value[part];
      }
      return value;
    }
  
    // Render pagination controls
    function renderPagination() {
      const totalItems = applyFilters(heroesData).length;
      const totalPages = Math.ceil(totalItems / pageSize);
  
      const paginationDiv = document.getElementById('pagination');
      paginationDiv.innerHTML = '';
  
      for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement('button');
        button.textContent = i;
        if (i === currentPage) button.classList.add('active');
  
        button.addEventListener('click', function() {
          currentPage = i;
          renderTable(currentPage, pageSize);
          // Adjust active class for buttons
          const allButtons = paginationDiv.getElementsByTagName('button');
          for (let btn of allButtons) {
            btn.classList.remove('active');
          }
          this.classList.add('active');
        });
  
        paginationDiv.appendChild(button);
      }
    }
  
    // Event listeners
    pageSizeSelect.addEventListener('change', function() {
      currentPage = 1;
      pageSize = parseInt(this.value);
      renderTable(currentPage, pageSize);
      renderPagination();
    });
  
    searchInput.addEventListener('input', function() {
      currentPage = 1;
      renderTable(currentPage, pageSize);
      renderPagination();
    });
  });
  