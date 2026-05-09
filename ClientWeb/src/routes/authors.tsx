import { useState, useEffect } from 'react';
import { type Author, type AuthorCreationData } from '../types';
import { add_author, get_authors, remove_author } from '../api';
import { NavLink, Outlet } from 'react-router';
import Pagination from '../utils/pagination';

export default function Authors() {
    const [authors, setAuthors] = useState<Author[]>([]);

    const [error, setError] = useState<string>("");

    const [page, setPage] = useState<number>(1);
    const [totalElements, setTotal] = useState<number>(0);
    const pageSize = 15;

    const [search, setSearch] = useState<string>("");

    const [loading, setLoading] = useState<boolean>(true);

    async function loadAuthors() {
        setLoading(true);

        const data = await get_authors({ page, pageSize, lastname: search });
        setAuthors(data.authors);
        setTotal(data.total);

        const totalPages = Math.ceil(data.total / pageSize);
        if (page > totalPages) setPage(1);

        setLoading(false);
    }

    useEffect(() => {
        loadAuthors();
    }, [page, search]);

    async function addAuthor(data: AuthorCreationData) {
        await add_author(data);
        await loadAuthors()
    }

    async function removeAuthor(id: number) {
        await remove_author(id);
        await loadAuthors();
    }

    const handleAdd = async function (e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const form = e.currentTarget;
        const data: AuthorCreationData = {
            firstname: form.firstname.value,
            lastname: form.lastname.value,
        };

        try {
            await addAuthor(data);
            setError('');
        } catch (err) {
            setError((err as Error).message);
        }
        form.reset();
    }

    async function handleRemove(id: number) {
        try {
            await removeAuthor(id);
            setError('');
        } catch (err) {
            setError((err as Error).message);
        }
    }

    const handleFilter = async function (e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const form = e.currentTarget;

        setSearch(form.searching.value);
        form.reset();
    }

    return (
        <>
            <div id="sidebar">
                <form onSubmit={handleAdd}>
                    <label>Firstname </label><input type='text' name='firstname'></input><br></br>
                    <label>Lastname </label><input type='text' name='lastname'></input><br></br>
                    <button type='submit'>Add author</button>
                </form>

                <hr></hr>

                <strong>Filters</strong>
                <form onSubmit={handleFilter}>
                    <label>Lastname </label><input type='text' name='searching' placeholder="Search by lastname..."></input><br></br>
                    <button type='submit'>Filter</button>
                </form>

                <hr></hr>

                <Pagination page={page} pageSize={pageSize} total={totalElements} onPageChange={setPage} />

                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <ul>
                        {authors.map(author => (
                            <li key={author.id}>
                                <NavLink to={String(author.id)}>
                                    {author.firstname} {author.lastname}
                                </NavLink>
                                <button className='small danger' onClick={() => handleRemove(author.id)}>Delete</button>
                            </li>
                        ))}
                    </ul>
                )}

                {error && <p>{error}</p>}

            </div>
            <div id="info">
                <Outlet />
            </div>
        </>
    );
}