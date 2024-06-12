document.getElementById('addItemForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const productId = document.getElementById('addProductId').value;
    const quantity = document.getElementById('addQuantity').value;

    await fetch('/addItemToInventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity })
    });
    alert('Item added to inventory');
});

document.getElementById('removeItemForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const productId = document.getElementById('removeProductId').value;
    const quantity = document.getElementById('removeQuantity').value;

    await fetch('/removeItemFromInventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity })
    });
    alert('Item removed from inventory');
});

document.getElementById('addItemToCartForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const customerId = document.getElementById('customerId').value;
    const productId = document.getElementById('cartProductId').value;
    const quantity = document.getElementById('cartQuantity').value;

    await fetch('/addItemToCart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerId, productId, quantity })
    });
    alert('Item added to cart');
});

document.getElementById('applyDiscountForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const cartValue = document.getElementById('cartValue').value;
    const discountId = document.getElementById('discountId').value;

    const response = await fetch('/applyDiscountCoupon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cartValue, discountId })
    });
    const data = await response.json();
    document.getElementById('discountedPrice').innerText = `Discounted Price: Rs ${data.discountedPrice}`;
});
