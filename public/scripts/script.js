// Array of language codes
const languageCodes = ['en', 'de', 'ar', 'es', 'fr', 'he', 'it', 'nl', 'no', 'pt', 'ru', 'sv', 'ud', 'zh'];

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

// API key
const apiKey = document.getElementById('apiKey').value;

// User can search your favarite news
let query;
const searchBtn = document.getElementById('search-btn');

searchBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    accordionExample.innerHTML = "Loading...";
    accordionExample.classList.add('d-flex');
    accordionExample.classList.add('justify-content-center');
    accordionExample.classList.add('align-items-center');

    query = document.getElementById('search').value.replace(/\s/g, "+").trim();
    const url = `https://newsapi.org/v2/everything?q=${query}&apiKey=${apiKey}`;
    await showNews(url);
    document.getElementById('search').value = '';
});


// Fetch news from API
// Approach 1 with async/await
const showNews = async (url) => {
    try {
        const response = await fetch(url);

        // Wait for the response to be parsed as JSON
        const data = await response.json();

        // console.log("data:", data);  // This will now log the actual news data object

        // Access the news articles from data.articles
        const articles = data.articles;
        displayNews(articles);
    }
    catch (err) {
        accordionExample.innerHTML = `Failed to load news. Please try again later.
                                    <br><br><button id="reload-btn" onclick="window.location.reload()">Reload</button>;`
        accordionExample.classList.add('d-flex');
        accordionExample.classList.add('justify-content-center');
        accordionExample.classList.add('align-items-center');
    }
}

// Approach 2 with .then .then
// const showNews = () => {
//     fetch(url)
//         .then(response => response.json())
//         .then(data => {

//             // Access the news articles from data.articles
//             const articles = data.articles;
//             displayNews(articles);
//         })
//         .catch(error => {
//             console.error("Error fetching news:", error);  // Optional error handling
//         });
// }

// Approach 3 with Ajax request
// const showNews = () => {
//     let xhr = new XMLHttpRequest();
//     xhr.open('GET', url, true);
//     xhr.onload = function () {
//         if (this.status === 200) {
//             let json = JSON.parse(this.responseText);
//             let articles = json.articles;
//             displayNews(articles);
//         }
//     }
//     xhr.send();
// }

showNews(`https://newsapi.org/v2/top-headlines?sources=techcrunch&apiKey=${apiKey}`);

const accordionExample = document.getElementById('accordionExample');

// Add fetched news articles in the HTML document
const displayNews = (articles) => {
    if (accordionExample.innerText == 'Loading...') {
        accordionExample.innerHTML = '';
        accordionExample.classList.remove('d-flex');
        accordionExample.classList.remove('justify-content-center');
        accordionExample.classList.remove('align-items-center');
    }

    articles.forEach((article, index) => {
        let filterContent = article.content.split("[+")[0];

        if (article.title !== '[Removed]') {
            accordionExample.innerHTML += `<div class="accordion-item" id="${index}" onclick="{() => openAccordion(this.id)}">
                                            <h2 class="accordion-header">
                                                <button class="accordion-button" type="button" data-bs-toggle="collapse"  data-bs-target="#collapse${index}" aria-expanded="true" aria-controls="collapse${index}">${article.title}</button>
                                            </h2>
                                            <div id="collapse${index}" class="accordion-collapse collapse" data-bs-parent="#accordionExample">
                                                <div class="accordion-body">
                                                    <strong>${article.description}</strong>
                                                    <p>${filterContent}<a href="${article.url}" target="_blank">Read more</a></p>
                                                </div>
                                            </div>
                                           </div>`;
        }
    });
}

function openAccordion(index) {
    const moreInfo = document.getElementById(`collapseOne${index}`);
    moreInfo.classList.toggle('show');
}

// Filter section
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

// Combined filtering function
const applyFilters = () => {
    const domainQuery = getDomainQuery();
    const fromDate = document.getElementById('date-from').value;
    const toDate = document.getElementById('date-to').value;

    // Build the URL with optional parameters based on user selections
    let url = `https://newsapi.org/v2/everything?q=${query}`;

    if (domainQuery) {
        url += `&domains=${domainQuery}`;
    }

    if (fromDate && toDate) {
        url += `&from=${fromDate}&to=${toDate}`;
    }

    if (languageSelect.value) {
        url += `&language=${languageSelect.value}`;
    }

    if (sortingSelect.value) {
        url += `&sortBy=${sortingSelect.value}`;
    }

    // Append the API key securely (see previous response for approaches)
    url += `&apiKey=${apiKey}`;

    showNews(url);
}

// Helper function to get domain query string
function getDomainQuery() {
    const domainArr = [];
    document.querySelectorAll('.domains').forEach(domain => {
        domainArr.push(domain.value);
    });

    return domainArr.join(',');
}

// Event listener for filter submit button
const filterSubmitBtn = document.getElementById('filter-submit-btn');

filterSubmitBtn.addEventListener('click', (e) => {
    e.preventDefault();
    accordionExample.innerHTML = "Loading...";
    accordionExample.classList.add('d-flex');
    accordionExample.classList.add('justify-content-center');
    accordionExample.classList.add('align-items-center');

    setTimeout(() => {
        if (accordionExample.innerText == 'Loading...') accordionExample.innerHTML = "No data found."
    }, 5000);

    applyFilters();
});

// Clear form button
const clearBtn = document.getElementById('clear-btn');
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

// sidebar filter section toggle button
const sidebarFilter = document.getElementById('sidebar-filter');
let isOpen = false; // Variable to track sidebar state

const toggleSidebar = () => {
    isOpen = !isOpen; // Toggle state on each click
    sidebarFilter.style.left = isOpen ? '0rem' : '-15rem';
};

const filterBtn = document.getElementById('filter-btn');
filterBtn.addEventListener('click', toggleSidebar);
