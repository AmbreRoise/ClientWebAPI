import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { type Author, type Book, type BookTagsProps, type BookUpdateData, type Rating, type Tag, type Comment, type CommentCreationData, type RatingCreationData } from "../types";
import { associate_tag_to_book, create_comment, create_rating, delete_comment, delete_rating, dissociate_tag_to_book, get_author, get_avarage_ratings_of_book, get_book, get_comments_of_book, get_ratings_of_books, get_tags, get_tags_of_book, update_book } from "../api";
import EditableText from "../utils/editableText";
import { useLocalStorage } from "../utils/useLocalStorage";

export default function Book() {
    const [book, setBook] = useState<Book>();
    const [loading, setLoading] = useState<boolean>(true);
    const [allTags, setAllTags] = useState<Tag[]>([]);
    let params = useParams();
    const [author, setAuthor] = useState<Author>();

    // Favorites
    const [favoriteBooks, setFavoriteBooks] = useLocalStorage<Book[]>("savedBooks", []);
    const isFavorite = book ? favoriteBooks.some(a => a.id === book.id) : false;

    async function loadBook(id: number) {
        setLoading(true);
        try {
            const data = await get_book(id);
            setBook(data);
            const aut = await get_author(data.authorId);
            setAuthor(aut);
        }
        catch (Error) {
            return <p>Book not found.</p>
        }

        setLoading(false);
    }

    useEffect(() => {
        loadBook(Number(params.book_id));
    }, [params.book_id]);

    async function loadTags() {
        const data = await get_tags();
        setAllTags(data);
    }

    useEffect(() => {
        loadTags();
    }, []);

    async function updateBook(data: BookUpdateData) {
        await update_book(book!.id, data);
        await loadBook(book!.id);
    }

    function addToFavorite() {
        if (book) {
            setFavoriteBooks([...favoriteBooks, book]);
        }
    }

    function removeFromFavorite() {
        if (book) {
            setFavoriteBooks(favoriteBooks.filter(a => a.id !== book.id));
        }
    }

    return (
        <>
            {book && (<>
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <>
                        <h2>{book &&
                            <EditableText
                                value={book.title}
                                onUpdate={(v) => updateBook({ title: v })}
                            />
                        }</h2>
                        {
                            isFavorite
                                ? <button onClick={removeFromFavorite}>Remove from favorites</button>
                                : <button onClick={addToFavorite}>Add to favorites</button>
                        }
                        <hr></hr>
                        <p>
                            Publication year : {book.publication_year ? (
                                <EditableText
                                    value={book.publication_year.toString()}
                                    onUpdate={(v) => updateBook({ publication_year: Number(v) })}
                                />
                            ) : "Unknown"}
                        </p>
                        <p>Author : <Link to={"/authors/" + book?.authorId}>{author?.firstname + " " + author?.lastname}</Link></p>
                    </>
                )}
                <BookTags allTags={allTags} />
                <hr></hr>
                <BookComments />
                <hr></hr>
                <BookRatings />
            </>)}
        </>
    );
}

function BookTags({ allTags }: BookTagsProps) {
    let params = useParams();
    const bookID = Number(params.book_id);

    const [tags, setTags] = useState<Tag[]>([]);

    const [loading, setLoading] = useState<boolean>(true);

    async function loadTags() {
        setLoading(true);
        const data = await get_tags_of_book(bookID);
        setTags(data);
        setLoading(false);
    }

    useEffect(() => {
        loadTags();
    }, [bookID]);

    async function handleRemove(id: number) {
        await dissociate_tag_to_book(bookID, id);
        await loadTags();
    }

    const handleAdd = async function (e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const form = e.currentTarget;

        let tagID = Number(form.tag.value);
        if (!tagID) {
            alert("Veuillez sélectionner un tag valide.");
            return;
        }

        await associate_tag_to_book(bookID, tagID);
        await loadTags();
        form.reset();
    }

    return (
        <>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <>
                    <div>
                        <p>Tags :
                            {tags.map(tag => (
                                <span className="badge" key={tag.id}>
                                    {tag.name}
                                    <button onClick={() => handleRemove(tag.id)}>x</button>
                                </span>
                            ))}
                        </p>
                    </div>

                    <form onSubmit={handleAdd}>
                        <select name="tag">
                            <option value="">-- Select tag --</option>
                            {allTags.map(tag => (
                                <option key={tag.id} value={tag.id}>{tag.name}</option>
                            ))}
                        </select>
                        <button type="submit">Add tag</button>
                    </form>
                </>
            )}
        </>
    );
}

function BookComments() {
    const [comments, setComments] = useState<Comment[]>([]);
    let params = useParams();
    const bookID = Number(params.book_id);
    const [loading, setLoading] = useState<boolean>(true);

    async function loadComments() {
        setLoading(true);
        const com = await get_comments_of_book(bookID);
        setComments(com);
        setLoading(false);
    }

    useEffect(() => {
        loadComments();
    }, [bookID]);

    async function handleRemove(id: number) {
        await delete_comment(id);
        await loadComments();
    }

    const handleAdd = async function (e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const form = e.currentTarget;

        const content = String(form.content.value);
        const userName = String(form.username.value);
        const data: CommentCreationData = {
            content: content,
            userName: userName
        }

        await create_comment(bookID, data);
        await loadComments();
        form.reset();
    }

    return (
        <>
            <h3>Comments :</h3>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <>
                    {comments.length === 0 ? (
                        <p>No comments.</p>
                    ) : (
                        <ul>
                            {comments.map(comment => (
                                <li key={comment.id}>
                                    {comment.content} (by {comment.userName})
                                    <button className='small danger' onClick={() => handleRemove(comment.id)}>Delete</button>
                                </li>
                            ))}
                        </ul>
                    )}
                </>
            )}

            <form onSubmit={handleAdd}>
                <label>Content :</label><input type="text" name="content"></input>
                <label>Username :</label><input type="text" name="username"></input>
                <button type="submit">Add a comment</button>
            </form>
        </>
    );
}

function BookRatings() {
    const [ratings, setRatings] = useState<Rating[]>([]);
    const [average, setAverage] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);

    let params = useParams();
    const bookID = Number(params.book_id);

    async function loads() {
        setLoading(true);

        await loadRatings();
        await loadAverage();

        setLoading(false);
    }
    async function loadRatings() {
        const rat = await get_ratings_of_books(bookID);
        setRatings(rat);
    }

    async function loadAverage() {
        const av = await get_avarage_ratings_of_book(bookID);
        setAverage(av);
    }

    useEffect(() => {
        loads();
    }, [bookID]);

    async function handleRemove(id: number) {
        await delete_rating(id);
        await loadRatings();
        await loadAverage();
    }

    const handleAdd = async function (e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const form = e.currentTarget;

        const value = Number(form.value_number.value);
        const userName = form.username.value;

        const data: RatingCreationData = {
            value: value,
            userName: userName
        };

        try {
            await create_rating(bookID, data);
            await loadRatings();
            await loadAverage();
        }
        catch (Error) {
            alert("Vous ne pouvez pas noter deux fois un livre");
        }
        form.reset();
    }

    return (
        <>
            <h3>Ratings :</h3>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <>
                    {ratings.length === 0 ? (
                        <p>No ratings.</p>
                    ) : (
                        <>
                            <p>Average rating : {average}</p>
                            <ul>
                                {ratings.map(rating => (
                                    <li key={rating.id}>
                                        {rating.value} (by {rating.userName})
                                        <button className='small danger' onClick={() => handleRemove(rating.id)}>Delete</button>
                                    </li>
                                ))}
                            </ul>
                        </>
                    )}
                </>
            )}

            <form onSubmit={handleAdd}>
                <label>Value :</label><input type="number" name="value_number"></input>
                <label>Username :</label><input type="text" name="username"></input>
                <button type="submit">Rate the book</button>
            </form>
        </>
    );
}