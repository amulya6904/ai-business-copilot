import pandas as pd
from sqlalchemy import text
from core.db import get_engine

CSV_PATH = "data/raw/Sample - Superstore.csv"

def main():
    engine = get_engine()

    # 1) Load CSV (encoding fix)
    df = pd.read_csv(CSV_PATH, encoding="latin1")

    # 2) Normalize column names (keep original too)
    # Convert dates
    df["Order Date"] = pd.to_datetime(df["Order Date"], format="%m/%d/%Y", errors="coerce")
    df["Ship Date"]  = pd.to_datetime(df["Ship Date"], format="%m/%d/%Y", errors="coerce")

    # 3) Build customers table
    customers = (
        df[["Customer ID", "City", "State", "Region"]]
        .drop_duplicates(subset=["Customer ID"])
        .rename(columns={
            "Customer ID": "customer_id",
            "City": "city",
            "State": "state",
            "Region": "region",
        })
    )
    customers["signup_date"] = pd.NaT  # not available in this dataset

    # 4) Build products table
    products = (
        df[["Product ID", "Product Name", "Category", "Sub-Category"]]
        .drop_duplicates(subset=["Product ID"])
        .rename(columns={
            "Product ID": "product_id",
            "Product Name": "product_name",
            "Category": "category",
            "Sub-Category": "sub_category",
        })
    )

    # 5) Build orders table (one row per Order ID)
    orders = (
        df[["Order ID", "Order Date", "Ship Date", "Customer ID", "City", "State", "Region"]]
        .drop_duplicates(subset=["Order ID"])
        .rename(columns={
            "Order ID": "order_id",
            "Order Date": "order_date",
            "Ship Date": "ship_date",
            "Customer ID": "customer_id",
            "City": "city",
            "State": "state",
            "Region": "region",
        })
    )

    # 6) Build order_items (one row per CSV row)
    # We will store Sales as total_amount (unit_price not available)
    order_items = (
        df[["Order ID", "Product ID", "Quantity", "Discount", "Sales", "Order Date"]]
        .rename(columns={
            "Order ID": "order_id",
            "Product ID": "product_id",
            "Quantity": "quantity",
            "Discount": "discount",
            "Sales": "total_amount",
            "Order Date": "order_date",
        })
    )
    order_items["unit_price"] = None  # not available

    # Ensure types
    order_items["quantity"] = pd.to_numeric(order_items["quantity"], errors="coerce").fillna(0).astype(int)
    order_items["discount"] = pd.to_numeric(order_items["discount"], errors="coerce").fillna(0.0)
    order_items["total_amount"] = pd.to_numeric(order_items["total_amount"], errors="coerce").fillna(0.0)

    # Convert datetime->date for order_date in order_items & orders
    orders["order_date"] = orders["order_date"].dt.date
    orders["ship_date"] = orders["ship_date"].dt.date
    order_items["order_date"] = pd.to_datetime(order_items["order_date"], errors="coerce").dt.date

    # 7) Load into Postgres (truncate first for repeatability)
    with engine.begin() as conn:
        conn.execute(text("TRUNCATE TABLE order_items RESTART IDENTITY CASCADE;"))
        conn.execute(text("TRUNCATE TABLE orders CASCADE;"))
        conn.execute(text("TRUNCATE TABLE products CASCADE;"))
        conn.execute(text("TRUNCATE TABLE customers CASCADE;"))

    customers.to_sql("customers", engine, if_exists="append", index=False, method="multi", chunksize=5000)
    products.to_sql("products", engine, if_exists="append", index=False, method="multi", chunksize=5000)
    orders.to_sql("orders", engine, if_exists="append", index=False, method="multi", chunksize=5000)
    order_items.to_sql("order_items", engine, if_exists="append", index=False, method="multi", chunksize=5000)

    # 8) Print counts
    with engine.connect() as conn:
        c1 = conn.execute(text("SELECT COUNT(*) FROM customers")).scalar()
        c2 = conn.execute(text("SELECT COUNT(*) FROM products")).scalar()
        c3 = conn.execute(text("SELECT COUNT(*) FROM orders")).scalar()
        c4 = conn.execute(text("SELECT COUNT(*) FROM order_items")).scalar()
    print("Loaded OK")
    print("customers:", c1)
    print("products:", c2)
    print("orders:", c3)
    print("order_items:", c4)

if __name__ == "__main__":
    main()