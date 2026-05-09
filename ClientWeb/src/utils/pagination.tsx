import type { PaginationProps } from "../types";

export default function Pagination({ page, pageSize, total, onPageChange }: PaginationProps) {
    const totalPages = Math.ceil(total / pageSize);
    return (
        <div className="pagination">
            <button onClick={() => onPageChange(page - 1)} disabled={page <= 1}>{'<-'}</button>
            <span>Page {page} / {totalPages}</span>
            <button onClick={() => onPageChange(page + 1)} disabled={page >= totalPages}>{'->'}</button>
        </div>
    );
}