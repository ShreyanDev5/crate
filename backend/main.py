from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from database import Base, engine, SessionLocal, get_db
import models
from schemas import Product
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Crate")

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

# Enable CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Allowed frontend origins
    allow_credentials=True,
    allow_methods=["*"],  # Allowed HTTP methods
    allow_headers=["*"],  # Allowed request headers
)

# Create database tables if they do not exist
Base.metadata.create_all(bind=engine)


# Seed database with initial data if empty
def seed_db():
    db = SessionLocal()
    try:
        # Check if table is empty
        if db.query(models.Product).count() == 0:
            dummy_products = [
                models.Product(
                    name="Mechanical Keyboard",
                    description="RGB backlit mechanical keyboard with hot-swappable switches",
                    price=89.99,
                    quantity=24,
                ),
                models.Product(
                    name="Wireless Mouse",
                    description="Ergonomic 2.4GHz wireless mouse with dual-mode bluetooth",
                    price=34.50,
                    quantity=15,
                ),
                models.Product(
                    name="4K Monitor",
                    description="27-inch IPS panel with 144Hz refresh rate and HDR400",
                    price=349.99,
                    quantity=6,
                ),
                models.Product(
                    name="USB-C Hub",
                    description="6-in-1 adapter with HDMI, USB 3.0, and 100W PD charging",
                    price=24.99,
                    quantity=42,
                ),
                models.Product(
                    name="Noise Cancelling Headphones",
                    description="Over-ear wireless headphones with premium ANC and 40h battery life",
                    price=199.99,
                    quantity=0,
                ),
            ]
            # Add dummy products to session
            db.add_all(dummy_products)
            # Save to database
            db.commit()
    finally:
        # Close session to release resources
        db.close()


# Seed database on startup
seed_db()


# Root endpoint
@app.get("/")
def greet():
    return {"message": "Welcome to Crate"}


# Get all products
@app.get("/products")
def all_products(db: Session = Depends(get_db)):
    return db.query(models.Product).all()


# Get product by ID
@app.get("/products/{id}")
def products_by_id(id: int, db: Session = Depends(get_db)):
    # Find product by ID
    product = db.query(models.Product).filter(models.Product.id == id).first()
    if product:
        return product
    raise HTTPException(status_code=404, detail=f"Product with id {id} not found!")


# Create a new product
@app.post("/products", status_code=201)
def add_products(product: Product, db: Session = Depends(get_db)):
    # Convert Pydantic schema to SQLAlchemy model
    new_product = models.Product(
        name=product.name,
        description=product.description,
        price=product.price,
        quantity=product.quantity
    )
    db.add(new_product)
    db.commit()
    db.refresh(new_product)
    return new_product


# Update a product
@app.put("/products/{id}")
def update_products(id: int, new_product: Product, db: Session = Depends(get_db)):
    # Find product by ID
    db_product = db.query(models.Product).filter(models.Product.id == id).first()
    if db_product:
        # Update product fields
        db_product.name = new_product.name
        db_product.description = new_product.description
        db_product.price = new_product.price
        db_product.quantity = new_product.quantity
        db.commit()
        db.refresh(db_product)
        return db_product
    raise HTTPException(status_code=404, detail=f"Product with id {id} not found!")


# Delete a product
@app.delete("/products/{id}")
def delete_products(id: int, db: Session = Depends(get_db)):
    # Find product by ID
    db_product = db.query(models.Product).filter(models.Product.id == id).first()
    if db_product:
        db.delete(db_product)
        db.commit()
        return {"message": "Product deleted successfully"}
    raise HTTPException(status_code=404, detail=f"Product with id {id} not found!")


# Restock a product
@app.post("/products/{id}/restock")
def restock_products(id: int, amount: int = 10, db: Session = Depends(get_db)):
    # Find product by ID
    db_product = db.query(models.Product).filter(models.Product.id == id).first()
    if db_product is None:
        raise HTTPException(status_code=404, detail=f"Product with id {id} not found!")
    if amount <= 0:
        raise HTTPException(status_code=400, detail="Amount must be greater than 0")
    db_product.quantity += amount
    db.commit()
    db.refresh(db_product)
    return db_product
