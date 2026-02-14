-- ============================================================
-- Seed Data for Development
-- ============================================================

-- Categories
insert into public.categories (name, slug, description) values
  ('Electronics', 'electronics', 'Cutting-edge tech and gadgets'),
  ('Audio', 'audio', 'Premium headphones, speakers, and earbuds'),
  ('Wearables', 'wearables', 'Smartwatches and fitness trackers'),
  ('Accessories', 'accessories', 'Cases, cables, and peripherals'),
  ('Home', 'home', 'Smart home devices and appliances');

-- Products
insert into public.products (name, slug, description, price, compare_at_price, category_id, images, stock, is_featured) values
  (
    'Nebula Pro Headphones',
    'nebula-pro-headphones',
    'Experience pure audio bliss with active noise cancellation, 40-hour battery life, and premium memory foam ear cushions. Engineered for the audiophile who demands perfection.',
    299.99,
    349.99,
    (select id from public.categories where slug = 'audio'),
    array['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800'],
    50,
    true
  ),
  (
    'Quantum Smartwatch X',
    'quantum-smartwatch-x',
    'Track your life with precision. Health monitoring, GPS, 5-day battery, and a stunning AMOLED display in a titanium case.',
    449.99,
    null,
    (select id from public.categories where slug = 'wearables'),
    array['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800'],
    30,
    true
  ),
  (
    'Eclipse Wireless Earbuds',
    'eclipse-wireless-earbuds',
    'True wireless freedom with spatial audio, adaptive EQ, and an ultra-compact charging case. IPX5 water resistant.',
    179.99,
    199.99,
    (select id from public.categories where slug = 'audio'),
    array['https://images.unsplash.com/photo-1590658268037-6bf12f032f55?w=800'],
    100,
    true
  ),
  (
    'Prism 4K Action Camera',
    'prism-4k-action-camera',
    'Capture every moment in stunning 4K at 120fps. Waterproof to 30m, electronic stabilization, and AI-powered scene detection.',
    399.99,
    449.99,
    (select id from public.categories where slug = 'electronics'),
    array['https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800'],
    25,
    true
  ),
  (
    'Aura Smart Speaker',
    'aura-smart-speaker',
    'Room-filling 360° sound with voice assistant built in. Multi-room audio support and a design that fits any decor.',
    199.99,
    null,
    (select id from public.categories where slug = 'home'),
    array['https://images.unsplash.com/photo-1543512214-318c7553f230?w=800'],
    40,
    false
  ),
  (
    'Vertex Laptop Stand',
    'vertex-laptop-stand',
    'Elevate your workspace with this precision-machined aluminum stand. Adjustable height, hidden cable management, and a minimalist aesthetic.',
    89.99,
    null,
    (select id from public.categories where slug = 'accessories'),
    array['https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800'],
    75,
    false
  ),
  (
    'Nova Mechanical Keyboard',
    'nova-mechanical-keyboard',
    'Hot-swappable switches, per-key RGB, aluminum frame. A premium typing experience for creators and coders.',
    159.99,
    179.99,
    (select id from public.categories where slug = 'accessories'),
    array['https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800'],
    60,
    true
  ),
  (
    'Orion Fitness Tracker',
    'orion-fitness-tracker',
    'Lightweight and sleek. Heart rate, SpO2, sleep tracking, and 14-day battery life in a slim, comfortable band.',
    129.99,
    149.99,
    (select id from public.categories where slug = 'wearables'),
    array['https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=800'],
    90,
    false
  ),
  (
    'Zenith USB-C Hub',
    'zenith-usb-c-hub',
    '7-in-1 USB-C hub: HDMI 4K, USB 3.0, SD/microSD, PD charging. Compact, travel-friendly design.',
    69.99,
    79.99,
    (select id from public.categories where slug = 'accessories'),
    array['https://images.unsplash.com/photo-1625842268584-8f3296236761?w=800'],
    120,
    false
  ),
  (
    'Cosmos Smart Display',
    'cosmos-smart-display',
    '10-inch smart display with voice control, video calling, smart home hub, and ambient mode photo frame.',
    249.99,
    null,
    (select id from public.categories where slug = 'home'),
    array['https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800'],
    35,
    true
  ),
  (
    'Flux Portable Charger',
    'flux-portable-charger',
    '20,000mAh power bank with 65W USB-C PD. Charge your laptop and phone simultaneously. Aircraft-grade aluminum body.',
    79.99,
    89.99,
    (select id from public.categories where slug = 'electronics'),
    array['https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=800'],
    200,
    false
  ),
  (
    'Helix Gaming Mouse',
    'helix-gaming-mouse',
    'Ultra-lightweight 58g design with a 25K DPI sensor, optical switches, and customizable RGB. Built for champions.',
    99.99,
    119.99,
    (select id from public.categories where slug = 'accessories'),
    array['https://images.unsplash.com/photo-1527814050087-3793815479db?w=800'],
    85,
    false
  );
