# Shoes Luxury

A modern luxury shoes website built using React.js, TypeScript, Tailwind CSS, Node.js, Express.js, and MongoDB.

## Project Features

- Modern luxury shoes UI
- Responsive design
- Login system
- Fast performance
- Clean user interface
- Full-stack web application

## Technologies Used

Frontend:
- React.js
- TypeScript
- Tailwind CSS
- Vite

Backend:
- Node.js
- Express.js

Database:
- MongoDB

## Installation

Clone the repository:

```bash
git clone https://github.com/SakshamSojitra/Shoes-Luxury.git


## Backend (added)

A minimal Express backend was added to serve product data and a simple cart endpoint.

Run the backend locally:

```bash
npm run server
```

API endpoints:

- `GET /api/products` — list products
- `GET /api/products/:id` — product details
- `POST /api/cart` — accepts `{ items: [{ id, quantity }] }` and returns `{ ok: true, total }`

