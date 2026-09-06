# <img src="frontend/public/favicon.svg" width="24" height="24" style="vertical-align: middle;" /> Crate

A minimal inventory management app and REST API built with FastAPI, PostgreSQL, and React.

---

## Preview

| Dashboard | Inventory |
| :---: | :---: |
| ![Dashboard](frontend/public/home_page.png) | ![Inventory](frontend/public/all_product_page.png) |
| **Product Details** | **Add / Edit Product** |
| ![Product Details](frontend/public/product_details_card.png) | ![Add Product](frontend/public/add_product_page.png) |

---

## Features

- **Dashboard Metrics**: Live overview of total products, low-stock alerts, and out-of-stock items.
- **Product Management**: Instant search, stock status filtering, and quick in-table restocking (+10 units).
- **Safe Session Lifecycle**: Centralized `get_db` generator with clean session teardown and startup database seeding.
- **Interactive API Docs**: Built-in Swagger UI at `/docs` for exploring and testing endpoints.

---

## Tech Stack

- **Backend**: Python, FastAPI, SQLAlchemy, PostgreSQL, Pydantic v2, Uvicorn
- **Frontend**: React 19, Vite, Lucide Icons
- **AI Pairing**: Antigravity, Cursor

---

## API Reference

Interactive documentation available at `http://localhost:8000/docs`.

| Method | Endpoint | Description | Payload |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | Health check | — |
| `GET` | `/products` | List all products | — |
| `GET` | `/products/{id}` | Get product by ID | — |
| `POST` | `/products` | Create product | `{ name, description, price, quantity }` |
| `PUT` | `/products/{id}` | Update product | `{ name, description, price, quantity }` |
| `DELETE` | `/products/{id}` | Delete product | — |
| `POST` | `/products/{id}/restock` | Restock quantity (`?amount=10`) | — |

---

## Project Structure

```text
crate/
├── backend/
│   ├── database.py        # PostgreSQL engine & get_db generator
│   ├── main.py            # API routes, CORS & seed data
│   ├── models.py          # SQLAlchemy models
│   └── schemas.py         # Pydantic schemas
├── frontend/
│   ├── src/
│   │   ├── components/    # Views and modals (Dashboard, Inventory, Detail, Form)
│   │   ├── services/      # API client functions
│   │   ├── App.jsx        # Layout, navigation, and state
│   │   └── index.css      # Design tokens & styles
│   └── index.html
└── README.md
```

---

## Getting Started

### 1. Database

Create a PostgreSQL database:
```sql
CREATE DATABASE inventory_db;
```

Copy `backend/.env.example` to `backend/.env` and update your connection string:
```env
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/inventory_db
```

### 2. Backend

```bash
cd backend
python -m venv .venv

# Activate virtual environment:
# Windows: .venv\Scripts\activate
# macOS/Linux: source .venv/bin/activate

pip install fastapi uvicorn sqlalchemy psycopg2-binary pydantic python-dotenv
uvicorn main:app --reload
```
API runs at `http://localhost:8000` (docs at `http://localhost:8000/docs`).

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```
App runs at `http://localhost:5173`.

---

## Author

**Shreyan Sardar**
- Portfolio: [shreyandev.vercel.app](https://shreyandev.vercel.app)
- GitHub: [@ShreyanDev5](https://github.com/ShreyanDev5)
- LinkedIn: [shreyansardar](https://www.linkedin.com/in/shreyansardar/)
