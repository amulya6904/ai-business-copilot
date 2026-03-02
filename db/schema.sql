CREATE TABLE IF NOT EXISTS customers (
  customer_id TEXT PRIMARY KEY,
  city TEXT,
  state TEXT,
  region TEXT,
  signup_date DATE
);

CREATE TABLE IF NOT EXISTS products (
  product_id TEXT PRIMARY KEY,
  product_name TEXT,
  category TEXT,
  sub_category TEXT
);

CREATE TABLE IF NOT EXISTS orders (
  order_id TEXT PRIMARY KEY,
  order_date DATE,
  customer_id TEXT REFERENCES customers(customer_id),
  ship_date DATE,
  city TEXT,
  state TEXT,
  region TEXT
);

CREATE TABLE IF NOT EXISTS order_items (
  order_item_id BIGSERIAL PRIMARY KEY,
  order_id TEXT REFERENCES orders(order_id),
  product_id TEXT REFERENCES products(product_id),
  quantity INT,
  unit_price NUMERIC,
  discount NUMERIC,
  total_amount NUMERIC,
  order_date DATE
);

CREATE INDEX IF NOT EXISTS idx_order_items_order_date ON order_items(order_date);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);
CREATE INDEX IF NOT EXISTS idx_orders_order_date ON orders(order_date);