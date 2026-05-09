import { useEffect, useState } from "react";
import type { Book } from "../types";
import { get_books, remove_book } from "../api";
import Pagination from "../utils/pagination";
import { NavLink, Outlet } from "react-router";

export default function Books() {
    const [books, setBooks] = useState<Book[]>([]);

    const [error, setError] = useState<string>("");

    const [page, setPage] = useState<number>(1);
    const [totalElements, setTotal] = useState<number>(0);
    const pageSize = 15;

    const [searchTitle, setSearchTitle] = useState<string>("");
    const [searchAverage, setSearchAverage] = useState<number | undefined>(undefined);

    const [loading, setLoading] = useState<boolean>(true);

    async function loadBooks() {
        setLoading(true);

        const data = await get_books({ page, pageSize, title: searchTitle, average: searchAverage });
        setBooks(data.books);
        setTotal(data.total);

        const totalPages = Math.ceil(data.total / pageSize);
        if (page > totalPages) setPage(1);

        setLoading(false);
    }

    useEffect(() => {
        loadBooks();
    }, [page, searchTitle, searchAverage]);

    const handleFilter = async function (e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const form = e.currentTarget;

        setSearchTitle(form.title.value);

        if (form.average.value) {
            setSearchAverage(Number(form.average.value));
        }
        else {
            setSearchAverage(undefined);
        }
    }

    async function handleRemove(id: number) {
        try {
            await remove_book(id);
            setError('');
        } catch (err) {
            setError((err as Error).message);
        }
    }

    console.log('books.length', books.length);

    return (
        <>
            <div id="sidebar">
                <h3>Filters</h3>
                <form onSubmit={handleFilter}>
                    <label>Title </label><input type='text' name='title' placeholder="Searching by title..."></input><br></br>
                    <label>Average rating </label><input type='number' name='average' placeholder="Searching by average rating..."></input><br></br>
                    <button type='submit'>Filter</button>
                </form>

                <button onClick={() => setSearchAverage(undefined)}>Reset average rating</button>

                {error && <p>{error}</p>}
                <hr></hr>

                <Pagination page={page} pageSize={pageSize} total={totalElements} onPageChange={setPage} />

                {loading ? (
                    <p>Loading...</p>
                ) : (
                    books.length === 0 ? (
                        <p>No book is corresponding to your filter.</p>
                    ) : (
                        <ul>
                            {books.map(book => (
                                <li key={book.id}>
                                    <NavLink to={String(book.id)}>
                                        {book.title}
                                    </NavLink>
                                    <button className='small danger' onClick={() => handleRemove(book.id)}>Delete</button>
                                </li>
                            ))}
                        </ul>
                    )
                )}


            </div >
            <div id="info">
                <Outlet />
            </div>
        </>
    );
}