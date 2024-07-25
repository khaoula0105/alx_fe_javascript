document.addEventListener("DOMContentLoaded", () => {
    const quotes = JSON.parse(localStorage.getItem("quotes")) || [
      { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
      { text: "Life is 10% what happens to us and 90% how we react to it.", category: "Life" },
      { text: "To handle yourself, use your head; to handle others, use your heart.", category: "Wisdom" }
    ];
  
    const quoteDisplay = document.getElementById("quoteDisplay");
    const newQuoteButton = document.getElementById("newQuote");
    const exportQuotesButton = document.getElementById("exportQuotes");
  
    function showRandomQuote() {
      if (quotes.length > 0) {
        const randomIndex = Math.floor(Math.random() * quotes.length);
        const randomQuote = quotes[randomIndex];
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
        document.getElementById("newQuoteText").value = "";
        document.getElementById("newQuoteCategory").value = "";
        alert("New quote added!");
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
        alert('Quotes imported successfully!');
      };
      fileReader.readAsText(event.target.files[0]);
    }
  
    newQuoteButton.addEventListener("click", showRandomQuote);
    exportQuotesButton.addEventListener("click", exportQuotes);
    createAddQuoteForm();
  
    const lastQuote = JSON.parse(sessionStorage.getItem("lastQuote"));
    if (lastQuote) {
      quoteDisplay.innerHTML = `"${lastQuote.text}" - ${lastQuote.category}`;
    }
  });
  