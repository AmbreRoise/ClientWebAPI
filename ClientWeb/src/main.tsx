import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router'
import './index.css'
import Root from './routes/root.tsx'
import Authors from './routes/authors.tsx'
import Books from './routes/books.tsx'
import Author from './routes/author.tsx'
import Book from './routes/book.tsx'
import Favorites from './routes/favorites.tsx'

const root = document.getElementById("root")!;

createRoot(root).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Root />}>
        <Route path="authors" element={<Authors />}>
          <Route index element={<p>Choose an author from the list</p>} />
          <Route path=':author_id' element={<Author />} />
        </Route>
        <Route path="books" element={<Books />}>
          <Route index element={<p>Choose a book from the list</p>} />
          <Route path=':book_id' element={<Book />} />
        </Route>
        <Route path='favorites' element={<Favorites />} />
      </Route>
    </Routes>
  </BrowserRouter>
);
