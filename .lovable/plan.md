## Goal
Convert the current marketing site into a working ecommerce store on top of the existing Supabase (Lovable Cloud) backend, reusing the `site-images` storage bucket.

## 1. Database changes (new migration)
- `products` table: add `price numeric(10,2) not null default 0`, `images text[] not null default '{}'` (keep `image_url` as the primary/first image for back-compat), `stock int default null`.
- New `orders` table: `id`, `user_id` (nullable for guest), `email`, `full_name`, `phone`, `address1`, `address2`, `city`, `country`, `postal_code`, `subtotal`, `total`, `status` (enum: `pending | paid | shipped | delivered | cancelled`, default `pending`), `notes`, `created_at`.
- New `order_items` table: `id`, `order_id`, `product_id`, `name`, `unit_price`, `quantity`, `image_url`.
- GRANTs + RLS:
  - `orders`: anyone (anon + authenticated) can INSERT (guest checkout); users can SELECT their own; admins SELECT/UPDATE all.
  - `order_items`: INSERT allowed to all (validated by parent order in app); SELECT to owner or admin.
- No payment gateway yet — checkout creates a `pending` order and shows a confirmation page. (Payment provider can be wired in a later step.)

## 2. Shop (rename Products → Shop)
- Rename route `/products` → `/shop` (keep `/products` redirecting to `/shop`).
- Nav label "Products" → "Shop".
- Each card shows price (KES), first image, name, category, "Add to cart" button.
- Clicking a card opens a product detail dialog with image gallery, description, quantity selector, add-to-cart.

## 3. Cart
- Client-side cart in `localStorage` via a `CartContext` (`items: {productId, name, price, image, qty}[]`).
- Header cart icon with item count badge.
- `/cart` page: list with qty +/- controls, remove, subtotal, "Checkout" button.

## 4. Checkout
- `/checkout` page: shipping form (full name, email, phone, address1, address2, city, country, postal code, notes) validated with zod.
- On submit: insert `orders` row + `order_items` rows in a single RPC (`place_order`) for atomicity; clear cart; navigate to `/order-confirmation/:id`.
- Confirmation page reads the order + items and shows summary.

## 5. Admin
- Rename "Products" admin → "Shop" (keep file `AdminProducts.tsx`); add **price** field and **multi-image upload** (multiple file input → uploads each to `site-images/products/`, stores array in `images`, sets `image_url` to the first).
- New `/admin/orders` page: table of orders (date, customer, total, status), click row → drawer with items + status dropdown (`pending → paid → shipped → delivered / cancelled`).
- Add "Orders" link to admin sidebar.

## 6. Files touched
**New:**
- `src/contexts/CartContext.tsx`
- `src/pages/Cart.tsx`, `src/pages/Checkout.tsx`, `src/pages/OrderConfirmation.tsx`
- `src/pages/admin/AdminOrders.tsx`
- migration SQL appended to `supabase_setup.sql`

**Edited:**
- `src/App.tsx` (routes + CartProvider)
- `src/components/Layout.tsx` (cart icon, nav label)
- `src/pages/Products.tsx` → moved to `src/pages/Shop.tsx` (add price, add-to-cart)
- `src/pages/admin/Admin.tsx` (Orders link)
- `src/pages/admin/AdminProducts.tsx` (price + multi-image)

## Technical notes
- Currency: KES, formatted with `Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' })`.
- Guest checkout supported; logged-in users get `user_id` stamped so they can see their own orders later (a "My Orders" page is **not** in this scope).
- No payments integration in this pass — orders land as `pending` and the admin marks them paid manually. Happy to wire Stripe/Paddle in a follow-up.

## Out of scope (ask if you want them)
- Online payment provider (Stripe/Paddle)
- Customer-facing "My Orders" page
- Email notifications on order placement
- Inventory decrement on order
