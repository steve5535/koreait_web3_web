async function loadProducts() {
    const response = await fetch('product.json');
    const product = await response.json();

    console.log(product);
}

loadProducts();