// Send product titles to Go backend for filtering
const response = await fetch("http://localhost:8080/filter", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(products)
  });
  
  const filteredProducts = await response.json();
  
  // ✅ Add this line to debug
  console.log("Filtered Products:", filteredProducts);
  
  // Update the DOM to show only filtered products
  document.querySelectorAll('.s-main-slot > div').forEach(item => {
    const titleElement = item.querySelector("h2 span");
    if (titleElement) {
      const titleText = titleElement.textContent.trim();
      const isEco = filteredProducts.some(p => titleText.includes(p.title));
      if (!isEco) {
        item.style.display = "none";
      }
    }
  });
// get the details from the about product part