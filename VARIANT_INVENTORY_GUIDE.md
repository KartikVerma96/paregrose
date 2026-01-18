# Product Variant Inventory System - Setup Guide

## 🎯 Overview
This system allows you to manage **size and color-specific inventory** for your products. Each size/color combination gets its own stock quantity, making inventory management precise and flexible.

---

## 📋 Step 1: Run Database Migration

Run this command in your terminal to create the `product_variants` table:

```bash
npx prisma migrate deploy
```

Or if developing locally:

```bash
npx prisma migrate dev
```

Then generate the Prisma client:

```bash
npx prisma generate
```

---

## 🏗️ Database Structure

### `product_variants` Table

| Field            | Type          | Description                                    |
|------------------|---------------|------------------------------------------------|
| id               | INT           | Primary key                                    |
| product_id       | INT           | Foreign key to products                        |
| size             | VARCHAR(20)   | Size option (e.g., "M", "L", "XL")            |
| color            | VARCHAR(50)   | Color option (e.g., "Red", "Blue")            |
| sku              | VARCHAR(100)  | Unique SKU for this variant (optional)         |
| stock_quantity   | INT           | Stock available for this specific combination  |
| price_adjustment | DECIMAL(10,2) | Price difference from base price (optional)    |
| is_active        | BOOLEAN       | Whether this variant is available for sale     |
| created_at       | TIMESTAMP     | Creation timestamp                             |
| updated_at       | TIMESTAMP     | Last update timestamp                          |

**Unique Constraint:** `product_id` + `size` + `color` must be unique

---

## 🎨 How It Works

### Admin Flow

1. **Add Product Sizes**
   - Go to Admin → Products → Add/Edit Product
   - In "Available Sizes" section, enter sizes like: S, M, L, XL, XXL
   - Click "Add Size" or press Enter
   - Sizes appear as amber badges

2. **Add Product Colors**
   - In "Available Colors" section, enter colors like: Red, Blue, Black, White
   - Click "Add Color" or press Enter
   - Colors appear as blue badges

3. **Manage Variant Inventory**
   - **Automatically generated** - All size/color combinations appear in the inventory table
   - For each variant, set:
     - **Stock Quantity** - How many units available
     - **Price Adjustment** - Add/subtract from base price (optional)
     - **SKU** - Unique identifier (optional)
     - **Active Status** - Check/uncheck to enable/disable

4. **Example:**
   - Product: "Designer Saree"
   - Sizes: M, L, XL
   - Colors: Red, Blue
   - **6 variants created automatically:**
     - M + Red = 10 units in stock
     - M + Blue = 5 units in stock
     - L + Red = 15 units in stock
     - L + Blue = 8 units in stock
     - XL + Red = 12 units in stock
     - XL + Blue = 0 units (out of stock)

### Customer Flow

1. **Browse Products**
   - Product cards show available sizes and colors
   - Sizes displayed up to 4, then "+N more"
   - Colors displayed up to 5, then "+N more"

2. **Select Options**
   - Click on a size button (turns amber when selected)
   - Click on a color button (turns amber when selected)
   - Default: First size/color is auto-selected

3. **Check Availability**
   - Product card shows availability badge:
     - 🟢 **In Stock** - Available for purchase
     - 🟠 **Limited Stock** - Low inventory
     - 🔴 **Out of Stock** - Cannot purchase

4. **Add to Cart**
   - Selected size/color is included with the cart item
   - System checks variant stock before adding

---

## 🔍 Filter System

### Available Filters

1. **Category** - Filter by product category
2. **Availability** - In Stock / Limited Stock / Out of Stock
3. **Size** - Shows all sizes from all products
4. **Color** - Shows all colors from all products

### How Filtering Works

- **Size Filter:** Only shows products that have the selected size available
- **Color Filter:** Only shows products that have the selected color available
- **Combined Filters:** All filters work together (AND logic)

---

## 💡 Features

### ✅ Automatic Variant Generation
- Add sizes/colors → Variants created automatically
- No manual variant creation needed
- Smart detection of existing variants when editing

### ✅ Visual Stock Management
- Color-coded rows: Red background for out-of-stock
- Summary card shows total stock and in-stock variants
- Real-time count updates

### ✅ Flexible Pricing
- **Base Price:** Product's main price
- **Price Adjustment:** +/- per variant
- Example: Base ₹1000, XL size +₹100 = ₹1100

### ✅ Smart Availability
- Product availability based on ANY variant in stock
- Individual variants can be deactivated
- Out-of-stock variants show as disabled on product cards

---

## 🧪 Testing Checklist

### Admin Panel
- [ ] Add a product with 3 sizes (S, M, L)
- [ ] Add 2 colors (Red, Blue)
- [ ] Verify 6 variants appear in inventory table
- [ ] Set different stock quantities for each variant
- [ ] Set stock to 0 for one variant
- [ ] Add price adjustment to one variant
- [ ] Save product successfully
- [ ] Edit product and verify variants load correctly

### Shop Page
- [ ] Product card shows all sizes
- [ ] Product card shows all colors
- [ ] Can select different size/color combinations
- [ ] Out-of-stock variants are disabled
- [ ] Filters work correctly (Size, Color, Availability)
- [ ] Selected size/color shows in amber
- [ ] Add to cart includes selected options

### Cart Page
- [ ] Cart item shows selected size
- [ ] Cart item shows selected color
- [ ] Can view variant details

---

## 🚀 API Integration

### Create Product with Variants

```javascript
POST /api/admin/products
{
  "name": "Designer Saree",
  "price": 1000,
  "sizeOptions": ["S", "M", "L"],
  "colorOptions": ["Red", "Blue"],
  "variants": [
    { "size": "S", "color": "Red", "stock_quantity": 10 },
    { "size": "S", "color": "Blue", "stock_quantity": 5 },
    { "size": "M", "color": "Red", "stock_quantity": 15 },
    // ... etc
  ]
}
```

### Response Includes Variants

```javascript
GET /api/products/:id
{
  "product": {
    "id": 1,
    "name": "Designer Saree",
    "price": 1000,
    "size_options": "[\"S\",\"M\",\"L\"]",
    "color_options": "[\"Red\",\"Blue\"]",
    "variants": [
      {
        "id": 1,
        "size": "S",
        "color": "Red",
        "stock_quantity": 10,
        "is_active": true
      }
      // ... etc
    ]
  }
}
```

---

## 🔧 Troubleshooting

### Variants Not Showing
- Make sure you've run the migration: `npx prisma migrate deploy`
- Check that sizes/colors are added before saving
- Verify variants array is not empty in form state

### Stock Not Updating
- Check variant `is_active` status
- Verify stock_quantity is a number, not string
- Check database constraints aren't being violated

### Filters Not Working
- Ensure size_options and color_options are valid JSON arrays
- Check that products have variants with stock > 0
- Verify filter state is updating correctly

---

## 📝 Best Practices

1. **Always Add Stock to Variants**
   - Don't rely on product-level stock_quantity alone
   - Each variant should have its own stock value

2. **Use Meaningful SKUs**
   - Format: `PRODUCT-SIZE-COLOR` (e.g., `SAR-001-M-RED`)
   - Makes inventory tracking easier

3. **Set Realistic Stock Quantities**
   - Update stock regularly
   - Mark variants inactive instead of deleting

4. **Price Adjustments**
   - Use for size differences (e.g., XL +₹100)
   - Keep adjustments reasonable

5. **Test Before Launch**
   - Add test products with variants
   - Try all size/color combinations
   - Verify cart workflow end-to-end

---

## 🎉 Summary

You now have a **complete variant-based inventory system**! 

- ✅ Size and color-specific stock tracking
- ✅ Automatic variant generation
- ✅ Visual inventory management
- ✅ Smart filtering and availability
- ✅ Flexible pricing per variant

Happy selling! 🛍️✨

