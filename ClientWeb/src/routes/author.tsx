import { useEffect, useState } from "react";
import { type Author, type AuthorUpdateData, type Book, type BookCreationData } from '../types';
import { Link, useParams } from "react-router";
import { add_book, get_author, get_books_of_author, remove_book, update_author } from "../api";
import EditableText from "../utils/editableText";
import { useLocalStorage } from "../utils/useLocalStorage";

export default function Author() {
    const [author, setAuthor] = useState<Author>();
    const [loading, setLoading] = useState<boolean>(true);
    let params = useParams();

    // Favorites
    const [favoriteAuthors, setFavoriteAuthors] = useLocalStorage<Author[]>("savedAuthors", []);
    const isFavorite = author ? favoriteAuthors.some(a => a.id === author.id) : false;

    async function loadAuthor(id: number) {
        setLoading(true);
        const data = await get_author(id);
        setAuthor(data);
        setLoading(false);
    }

    useEffect(() => {
        loadAuthor(Number(params.author_id));
    }, [params.author_id]);

    async function updateAuthor(data: AuthorUpdateData) {
        await update_author(author!.id, data);
        await loadAuthor(author!.id);
    }

    function addToFavorite() {
        if (author) {
            setFavoriteAuthors([...favoriteAuthors, author]);
        }
    }

    function removeFromFavorite() {
        if (author) {
            setFavoriteAuthors(favoriteAuthors.filter(a => a.id !== author.id));
        }
    }

    return (
        <>
            {(loading ? (
                <p>Loading...</p>
            ) : (
                <>
                    <h2>
                        {author && (
                            <>
                                <EditableText
                                    value={author.firstname}
                                    onUpdate={(v) => updateAuthor({ firstname: v })}
                                />
                                <br></br>
                                <EditableText
                                    value={author.lastname}
                                    onUpdate={(v) => updateAuthor({ lastname: v })}
                                />
                            </>
                        )}
                    </h2>
                    {author && (
                        isFavorite
                            ? <button onClick={removeFromFavorite}>Remove from favorites</button>
                            : <button onClick={addToFavorite}>Add to favorites</button>
                    )}
                </>
            ))}
            <hr />
            <AuthorBooks />
        </>
    );
}

function AuthorBooks() {
    let params = useParams();
    const authorID = Number(params.author_id);

    const [books, setBooks] = useState<Book[]>([]);

    const [loading, setLoading] = useState<boolean>(true);

    async function loadBooks() {
        setLoading(true);
        const data = await get_books_of_author(authorID);
        setBooks(data);
        setLoading(false);
    }

    useEffect(() => {
        loadBooks();
    }, [authorID]);

    async function handleRemove(id: number) {
        await remove_book(id);
        await loadBooks();
    }


    const handleAdd = async function (e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const form = e.currentTarget;

        const data: BookCreationData = {
            title: form.title.value,
            ...(Number(form.year.value) > 0 ? { publication_year: Number(form.year.value) } : {}),
        };

        await add_book(data, authorID);
        await loadBooks();

        form.reset();
    }

    return (
        <>
            <h3>Books</h3>
            <form onSubmit={handleAdd}>
                <label>Title </label><input type="text" name="title"></input>
                <label> Publication year </label><input type="number" name="year"></input>
                <button type="submit">Add book</button>
            </form>


            {loading ? (
                <p>Loading...</p>
            ) : (
                <ul>
                    {books.map(book => (
                        <li key={book.id}>
                            <Link to={"/books/" + book.id}>{book.title}</Link>
                            <button className='small danger' onClick={() => handleRemove(book.id)}>Delete</button>
                        </li>
                    ))}
                </ul>
            )}

        </>
    );
}