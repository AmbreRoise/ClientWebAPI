import { type Author, type AuthorCreationData, type AuthorUpdateData, type Book, type BookCreationData, type BookUpdateData, type CommentCreationData, type CommentUpdateData, type GetAuthorsParams, type GetBooksParams, type Rating, type RatingCreationData, type RatingUpdateData, type Tag } from './types'

const apiBasename = "http://localhost:3000";

export async function get_authors(params?: GetAuthorsParams) {
    // Construction de la query
    let query = "";

    // Pagination
    if (params?.page !== undefined && params?.pageSize !== undefined) {
        query = `?skip=${(params.page - 1) * params.pageSize}&take=${params.pageSize}`
    }

    // Recherche par nom de famille
    if (params?.lastname) {
        query += (query ? '&' : '?') + `lastname=${params.lastname}`;
    }

    const res = await fetch(`${apiBasename}/authors${query}`);
    if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg);
    }
    const authors: Author[] = await res.json();
    const total = parseInt(res.headers.get('X-Total-Count') ?? '0');
    return { authors, total };
}

export async function add_author(data: AuthorCreationData) {
    const res = await fetch(`${apiBasename}/authors`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg);
    }

    const author: Author = await res.json();
    return author;
}

export async function remove_author(id: number) {
    const res = await fetch(`${apiBasename}/authors/${id}`, {
        method: 'DELETE'
    });
    if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg);
    }
}

export async function get_author(id: number) {
    const res = await fetch(`${apiBasename}/authors/${id}`);
    if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg);
    }

    const author: Author = await res.json();
    return author;
}

export async function get_books_of_author(id: number) {
    const res = await fetch(`${apiBasename}/authors/${id}/books`);

    if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg);
    }

    const books: Book[] = await res.json();
    return books;
}

export async function remove_book(id: number) {
    const res = await fetch(`${apiBasename}/books/${id}`, {
        method: 'DELETE'
    });

    if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg);
    }
}

export async function add_book(data: BookCreationData, authorId: number) {
    const res = await fetch(`${apiBasename}/authors/${authorId}/books`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

    if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg);
    }

    const book: Book = await res.json();
    return book;
}

export async function get_books(params?: GetBooksParams) {
    // Construction de la query
    let query = "";

    // Pagination
    if (params?.page !== undefined && params?.pageSize !== undefined) {
        query = `?skip=${(params.page - 1) * params.pageSize}&take=${params.pageSize}`
    }

    // Recherche par titre
    if (params?.title) {
        query += (query ? '&' : '?') + `title=${params.title}`;
    }

    // Rechercher par note moyenne
    if (params?.average !== undefined && params.average >= 0 && params.average <= 5) {
        query += (query ? '&' : '?') + `average=${params.average}`;
    }

    const res = await fetch(`${apiBasename}/books${query}`);
    if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg);
    }
    const books: Book[] = await res.json();
    const total = parseInt(res.headers.get('X-Total-Count') ?? '0');
    return { books, total };
}

export async function get_book(id: number) {
    const res = await fetch(`${apiBasename}/books/${id}`);

    if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg);
    }

    const book: Book = await res.json();
    return book;
}

export async function get_tags_of_book(bookID: number) {
    const res = await fetch(`${apiBasename}/books/${bookID}/tags`);

    if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg);
    }

    const tags: Tag[] = await res.json();
    return tags;
}

export async function dissociate_tag_to_book(bookID: number, tagID: number) {
    const res = await fetch(`${apiBasename}/books/${bookID}/tags/${tagID}`, {
        method: 'DELETE'
    });

    if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg);
    }
}

export async function associate_tag_to_book(bookID: number, tagID: number) {
    const res = await fetch(`${apiBasename}/books/${bookID}/tags/${tagID}`, {
        method: 'POST'
    });

    if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg);
    }
}

export async function get_tags() {
    const res = await fetch(`${apiBasename}/tags`);

    if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg);
    }

    const tags: Tag[] = await res.json();
    return tags;
}

export async function update_author(authorId: number, data: AuthorUpdateData) {
    const res = await fetch(`${apiBasename}/authors/${authorId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

    if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg);
    }

    const author: Author = await res.json();
    return author;
}

export async function update_book(bookID: number, data: BookUpdateData) {
    const res = await fetch(`${apiBasename}/books/${bookID}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

    if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg);
    }

    const book: Book = await res.json();
    return book;
}

export async function get_comments_of_book(bookID: number) {
    const res = await fetch(`${apiBasename}/books/${bookID}/comments`);

    if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg);
    }

    const comments: Comment[] = await res.json();
    return comments;
}

export async function create_comment(bookID: number, data: CommentCreationData) {
    const res = await fetch(`${apiBasename}/books/${bookID}/comments`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

    if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg);
    }

    const comment: Comment = await res.json();
    return comment;
}

export async function update_comment(commentID: number, data: CommentUpdateData) {
    const res = await fetch(`${apiBasename}/comments/${commentID}`, {
        method: "PATCH",
        headers: { 'Content-Type': 'applicaion/json' },
        body: JSON.stringify(data)
    });

    if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg);
    }

    const comment: Comment = await res.json();
    return comment;
}

export async function delete_comment(commentID: number) {
    const res = await fetch(`${apiBasename}/comments/${commentID}`, {
        method: "DELETE"
    });

    if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg);
    }
}

export async function get_ratings_of_books(bookID: number) {
    const res = await fetch(`${apiBasename}/books/${bookID}/ratings`);

    if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg);
    }

    const ratings: Rating[] = await res.json();
    return ratings;
}

export async function create_rating(bookID: number, data: RatingCreationData) {
    const res = await fetch(`${apiBasename}/books/${bookID}/ratings`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

    if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg);
    }

    const rating: Rating = await res.json();
    return rating;
}

export async function update_rating(ratingID: number, data: RatingUpdateData) {
    const res = await fetch(`${apiBasename}/ratings/${ratingID}`, {
        method: "PATCH",
        headers: { 'Content-Type': 'applicaion/json' },
        body: JSON.stringify(data)
    });

    if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg);
    }

    const rating: Rating = await res.json();
    return rating;
}

export async function delete_rating(ratingID: number) {
    const res = await fetch(`${apiBasename}/ratings/${ratingID}`, {
        method: "DELETE"
    });

    if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg);
    }
}

export async function get_avarage_ratings_of_book(bookID: number) {
    const res = await fetch(`${apiBasename}/books/${bookID}/ratings/average`);

    if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg);
    }

    const { average } = await res.json();
    return average as number;
}