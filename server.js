const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

mongoose.connect('mongodb://localhost:27017/inventory', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const productSchema = new mongoose.Schema({
    productId: String,
    quantity: Number
});

const cartSchema = new mongoose.Schema({
    customerId: String,
    items: [{ productId: String, quantity: Number }]
});

const discountCouponSchema = new mongoose.Schema({
    discountId: String,
    discountPercentage: Number,
    maxDiscount: Number
});

const Product = mongoose.model('Product', productSchema);
const Cart = mongoose.model('Cart', cartSchema);
const DiscountCoupon = mongoose.model('DiscountCoupon', discountCouponSchema);

product.insertMany([])
app.post('/addItemToInventory', async (req, res) => {
    const { productId, quantity } = req.body;
    let product = await Product.findOne({ productId });
    if (product) {
        product.quantity += quantity;
    } else {
        product = new Product({ productId, quantity });
    }
    await product.save();
    res.send('Item added to inventory');
});

app.post('/removeItemFromInventory', async (req, res) => {
    const { productId, quantity } = req.body;
    const product = await Product.findOne({ productId });
    if (product && product.quantity >= quantity) {
        product.quantity -= quantity;
        if (product.quantity === 0) {
            await Product.deleteOne({ productId });
        } else {
            await product.save();
        }
        res.send('Item removed from inventory');
    } else {
        res.status(400).send('Error: Insufficient inventory or product not found.');
    }
});

app.post('/addItemToCart', async (req, res) => {
    const { customerId, productId, quantity } = req.body;
    const product = await Product.findOne({ productId });
    if (product && product.quantity >= quantity) {
        let cart = await Cart.findOne({ customerId });
        if (!cart) {
            cart = new Cart({ customerId, items: [] });
        }
        const itemIndex = cart.items.findIndex(item => item.productId === productId);
        if (itemIndex > -1) {
            cart.items[itemIndex].quantity += quantity;
        } else {
            cart.items.push({ productId, quantity });
        }
        await cart.save();
        product.quantity -= quantity;
        await product.save();
        res.send('Item added to cart');
    } else {
        res.status(400).send('Error: Insufficient inventory or product not found.');
    }
});

app.post('/applyDiscountCoupon', async (req, res) => {
    const { cartValue, discountId } = req.body;
    const discountCoupon = await DiscountCoupon.findOne({ discountId });
    if (discountCoupon) {
        let discountAmount = (discountCoupon.discountPercentage / 100) * cartValue;
        if (discountAmount > discountCoupon.maxDiscount) {
            discountAmount = discountCoupon.maxDiscount;
        }
        const discountedPrice = cartValue - discountAmount;
        res.json({ discountedPrice });
    } else {
        res.status(400).send('Error: Invalid discount coupon.');
    }
});

app.post('/addDiscountCoupon', async (req, res) => {
    const { discountId, discountPercentage, maxDiscount } = req.body;
    const discountCoupon = new DiscountCoupon({ discountId, discountPercentage, maxDiscount });
    await discountCoupon.save();
    res.send('Discount coupon added');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
