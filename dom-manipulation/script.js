document.addEventListener("DOMContentLoaded", () => {
    const quotes = [
      { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
      { text: "Life is 10% what happens to us and 90% how we react to it.", category: "Life" },
      { text: "To handle yourself, use your head; to handle others, use your heart.", category: "Wisdom" }
    ];
  
    const quoteDisplay = document.getElementById("quoteDisplay");
    const newQuoteButton = document.getElementById("newQuote");
  
    function showRandomQuote() {
      if (quotes.length > 0) {
        const randomIndex = Math.floor(Math.random() * quotes.length);
        const randomQuote = quotes[randomIndex];
        quoteDisplay.innerHTML = `"${randomQuote.text}" - ${randomQuote.category}`;
      } else {
        quoteDisplay.innerHTML = "No quotes available.";
      }
    }
  
    function addQuote() {
      const newQuoteText = document.getElementById("newQuoteText").value.trim();
      const newQuoteCategory = document.getElementById("newQuoteCategory").value.trim();
      if (newQuoteText && newQuoteCategory) {
        quotes.push({ text: newQuoteText, category: newQuoteCategory });
        document.getElementById("newQuoteText").value = "";
        document.getElementById("newQuoteCategory").value = "";
        alert("New quote added!");
      } else {
        alert("Please enter both quote text and category.");
      }
    }
  
    newQuoteButton.addEventListener("click", showRandomQuote);
    window.addQuote = addQuote;
  });
  