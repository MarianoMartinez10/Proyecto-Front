const fs = require('fs');

const fetchProducts = async () => {
    try {
        const response = await fetch('http://localhost:9003/api/products');
        const data = await response.json();
        fs.writeFileSync('products.json', JSON.stringify(data, null, 2));
        console.log("Wrote products.json");
    } catch (e) {
        console.error("Fetch error:", e);
    }
};

fetchProducts();
