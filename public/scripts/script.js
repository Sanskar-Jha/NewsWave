// navbar
// toggle search function
const searchVal = document.getElementById('search');
const searchBtn = document.getElementById('search-btn');
let isSearch = false;

const toggleSearch = () => {
    isSearch = !isSearch;
    searchVal.style.left = isSearch ? '0rem' : '-16rem';
    searchBtn.style.border = isSearch ? '2px solid red' : 'none';
    searchBtn.style.width = isSearch ? '100%' : '40px';
};

const icon = document.querySelector('#search-btn i');
icon.addEventListener('click', toggleSearch);

// Triggers search button
searchVal.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        document.getElementById("search-form").click();
    }
});

// Filter section
//toggle filter button function
const Filter = document.getElementById('filter');
const openFilterBtn = document.getElementById('filter-btn');
const header = document.querySelector('header');
const newsContainer = document.getElementById('news-container');


openFilterBtn.addEventListener('click', () => {
    Filter.style.left = '0';
    header.style.marginLeft = '18rem';
    newsContainer.style.marginLeft = '19rem';
});

const closeFilterBtn = document.querySelector('#h-filter i');
closeFilterBtn.addEventListener('click', () => {
    Filter.style.left = '-18rem';
    header.style.marginLeft = '0';
    newsContainer.style.marginLeft = '0';
});

// Array of language codes
const languageCodes = ['en', 'de', 'ar', 'es', 'fr', 'he', 'it', 'nl', 'pt', 'ru', 'sv', 'ud', 'zh'];

const languageSelect = document.getElementById('language-select');
languageCodes.forEach(code => {
    languageSelect.innerHTML += `<option key="${code}" value="${code}"">${code}</option>`;
});

// Array of sort by the news
const sortBy = ['publishedAt', 'relevancy', 'popularity'];

const sortingSelect = document.getElementById('sorting');
sortBy.forEach(sort => {
    sortingSelect.innerHTML += `<option key="${sort}" value="${sort}">${sort}</option>`;
});

// Add domain button
const addDomainBtn = document.getElementById('add-domain-btn')
const addInput = document.getElementById('add-input');

addDomainBtn.addEventListener('click', () => {
    addInput.innerHTML = `<input type="text" id="domain1" class="domains" name="domain1">
    <i id="remove-domain-btn" class="fa-solid fa-minus bg-danger"></i>`;

    // Remove domain button
    const removeDomainBtn = document.getElementById('remove-domain-btn');
    removeDomainBtn.addEventListener('click', () => {
        addInput.innerHTML = '';
    });
});

// Clear form button
const clearBtn = document.getElementById('filter-clear-btn');
clearBtn.addEventListener('click', () => {
    const filterForm = document.getElementById('filter-form');

    // Clear input fields
    filterForm.querySelectorAll('input[type="text"], input[type="date"]').forEach(input => {
        input.value = '';
    });

    // Reset select elements
    filterForm.querySelectorAll('select').forEach(select => {
        select.selectedIndex = 0; // Set the first option as selected (index 0)
    });

    // You can also clear the content of the add-input div
    addInput.innerHTML = '';
});

// Loader
window.onload = function () {
    const loader = document.getElementById('loader-container');
    loader.style.display = "none";
};

// Fetch more news in DOM //Pending
// const moreNews = document.getElementById('more-news');
// const moreNewsHide = document.getElementById('more-news-hide');
// let pageNum = 1;
// moreNews.addEventListener('click', () =>{
//     pageNum++;
//     moreNewsHide.innerText = pageNum;
// });