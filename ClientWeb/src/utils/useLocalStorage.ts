import { useEffect, useState } from "react";

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
    const [state, setState] = useState<T>(() => {
        const saved = localStorage.getItem(key);
        return saved ? (JSON.parse(saved) as T) : initialValue;
    });

    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(state));
    }, [key, state]);

    return [state, setState];
}