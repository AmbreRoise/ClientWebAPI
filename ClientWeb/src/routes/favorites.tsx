import type { Author, Book } from "../types";
import { Link, NavLink } from "react-router";
import { useLocalStorage } from "../utils/useLocalStorage";

export default function Favorites() {
    // Récupération depuis le localStorage
    const [authors, setAuthors] = useLocalStorage<Author[]>("savedAuthors", []);

    const [books, setBooks] = useLocalStorage<Book[]>("savedBooks", []);

    return (
        <div id="info">
            <h1>Favorites</h1>
            <h2>Authors</h2>
            {authors.length === 0 ? (
                <p>No favorites authors.</p>
            ) : (
                <ul>
                    {authors.map(author => (
                        <li key={author.id}>
                            <NavLink to={"/authors/" + String(author.id)}>
                                {author.firstname + " " + author.lastname}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            )}

            <h2>Books</h2>
            {books.length === 0 ? (
                <p>No favorites books.</p>
            ) : (
                <ul>
                    {books.map(book => (
                        <li key={book.id}>
                            <Link to={"/books/" + String(book.id)}>
                                {book.title}
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}