export type Author = {
    id: number;
    firstname: string;
    lastname: string;
    books?: Book[]
};

export type Book = {
    id: number;
    title: string;
    publication_year?: number;
    author: Author;
    authorId: number;
    tags?: Tag[]
}

export type Tag = {
    id: number;
    name: string;
    books?: Book[]
}

export type Comment = {
    id: number;
    content: string;
    userName: string;
    book: Book
}

export type Rating = {
    id: number;
    value: number;
    userName: string;
    book: Book
}

export type AuthorCreationData = {
    firstname: string;
    lastname: string;
}

export type BookCreationData = {
    title: string;
    publication_year?: number;
}

export type GetAuthorsParams = {
    page?: number,
    pageSize?: number,
    lastname?: string
}

export type GetBooksParams = {
    page?: number,
    pageSize?: number,
    title?: string,
    average?: number
}

export type PaginationProps = {
    page: number,
    pageSize: number,
    total: number,
    onPageChange: (pageToDisplay: number) => void
}

export type BookTagsProps = {
    allTags: Tag[]
}

export type AuthorUpdateData = {
    firstname?: string;
    lastname?: string;
}

export type BookUpdateData = {
    title?: string;
    publication_year?: number;
}

export type EditableTextProps = {
    value: string,
    onUpdate: (newValue: string) => Promise<void>;
}

export type CommentCreationData = {
    content: string;
    userName: string;
}

export type CommentUpdateData = {
    content?: string;
    userName?: string;
}

export type RatingCreationData = {
    value: number;
    userName: string;
}

export type RatingUpdateData = {
    value?: number;
    userName?: string;
}