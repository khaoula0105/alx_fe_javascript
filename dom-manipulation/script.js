document.addEventListener("DOMContentLoaded", () => {
  const quotes = JSON.parse(localStorage.getItem("quotes")) || [
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
    { text: "Life is 10% what happens to us and 90% how we react to it.", category: "Life" },
    { text: "To handle yourself, use your head; to handle others, use your heart.", category: "Wisdom" }
  ];

  const quoteDisplay = document.getElementById("quoteDisplay");
  const newQuoteButton = document.getElementById("newQuote");
  const exportQuotesButton = document.getElementById("exportQuotes");
  const categoryFilter = document.getElementById("categoryFilter");

  function showRandomQuote() {
    const filteredQuotes = getFilteredQuotes();
    if (filteredQuotes.length > 0) {
      const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
      const randomQuote = filteredQuotes[randomIndex];
      quoteDisplay.innerHTML = `"${randomQuote.text}" - ${randomQuote.category}`;
      sessionStorage.setItem("lastQuote", JSON.stringify(randomQuote));
    } else {
      quoteDisplay.innerHTML = "No quotes available.";
    }
  }

  function addQuote() {
    const newQuoteText = document.getElementById("newQuoteText").value.trim();
    const newQuoteCategory = document.getElementById("newQuoteCategory").value.trim();
    if (newQuoteText && newQuoteCategory) {
      quotes.push({ text: newQuoteText, category: newQuoteCategory });
      saveQuotes();
      populateCategories();
      document.getElementById("newQuoteText").value = "";
      document.getElementById("newQuoteCategory").value = "";
      alert("New quote added!");
      syncQuotes();
    } else {
      alert("Please enter both quote text and category.");
    }
  }

  function createAddQuoteForm() {
    const formContainer = document.createElement('div');
    formContainer.className = 'form-container';

    const quoteInput = document.createElement('input');
    quoteInput.id = 'newQuoteText';
    quoteInput.type = 'text';
    quoteInput.placeholder = 'Enter a new quote';

    const categoryInput = document.createElement('input');
    categoryInput.id = 'newQuoteCategory';
    categoryInput.type = 'text';
    categoryInput.placeholder = 'Enter quote category';

    const addButton = document.createElement('button');
    addButton.textContent = 'Add Quote';
    addButton.addEventListener('click', addQuote);

    formContainer.appendChild(quoteInput);
    formContainer.appendChild(categoryInput);
    formContainer.appendChild(addButton);

    document.getElementById('formPlaceholder').appendChild(formContainer);
  }

  function saveQuotes() {
    localStorage.setItem("quotes", JSON.stringify(quotes));
  }

  function exportQuotes() {
    const dataStr = JSON.stringify(quotes, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quotes.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(event) {
      const importedQuotes = JSON.parse(event.target.result);
      quotes.push(...importedQuotes);
      saveQuotes();
      populateCategories();
      alert('Quotes imported successfully!');
      syncQuotes();
    };
    fileReader.readAsText(event.target.files[0]);
  }

  function populateCategories() {
    const uniqueCategories = [...new Set(quotes.map(quote => quote.category))];
    const currentFilter = categoryFilter.value;
    categoryFilter.innerHTML = '<option value="all">All Categories</option>';
    uniqueCategories.forEach(category => {
      const option = document.createElement('option');
      option.value = category;
      option.textContent = category;
      categoryFilter.appendChild(option);
    });
    categoryFilter.value = currentFilter;
  }

  function getFilteredQuotes() {
    const selectedCategory = categoryFilter.value;
    return selectedCategory === 'all' ? quotes : quotes.filter(quote => quote.category === selectedCategory);
  }

  function filterQuotes() {
    showRandomQuote();
    localStorage.setItem("selectedCategory", categoryFilter.value);
  }

  async function fetchQuotesFromServer() {
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/posts');
      const serverQuotes = await response.json();
      return serverQuotes.map(serverQuote => ({
        text: serverQuote.title,
        category: serverQuote.body
      }));
    } catch (error) {
      console.error('Error fetching server quotes:', error);
      return [];
    }
  }

  async function postQuotesToServer() {
    try {
      await fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(quotes)
      });
      console.log('Server sync successful');
    } catch (error) {
      console.error('Error posting quotes to server:', error);
    }
  }

  async function syncQuotes() {
    const serverQuotes = await fetchQuotesFromServer();
    const mergedQuotes = mergeQuotes(serverQuotes, quotes);
    quotes.length = 0;
    quotes.push(...mergedQuotes);
    saveQuotes();
    populateCategories();
    showRandomQuote();
    alert("Quotes synced with server!");
  }

  function mergeQuotes(serverQuotes, localQuotes) {
    const merged = [...localQuotes];
    serverQuotes.forEach(serverQuote => {
      if (!localQuotes.some(localQuote => localQuote.text === serverQuote.text && localQuote.category === serverQuote.category)) {
        merged.push(serverQuote);
      }
    });
    return merged;
  }

  newQuoteButton.addEventListener("click", showRandomQuote);
  exportQuotesButton.addEventListener("click", exportQuotes);
  categoryFilter.addEventListener("change", filterQuotes);
  createAddQuoteForm();
  populateCategories();

  const lastSelectedCategory = localStorage.getItem("selectedCategory");
  if (lastSelectedCategory) {
    categoryFilter.value = lastSelectedCategory;
  }
  const lastQuote = JSON.parse(sessionStorage.getItem("lastQuote"));
  if (lastQuote) {
    quoteDisplay.innerHTML = `"${lastQuote.text}" - ${lastQuote.category}`;
  }

  setInterval(syncQuotes, 60000); // Sync with server every 60 seconds
  syncQuotes(); // Initial sync with server on page load
});
