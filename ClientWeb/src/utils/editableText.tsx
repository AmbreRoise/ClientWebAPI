import { useState } from "react";
import type { EditableTextProps } from "../types";
import { Pencil, Check, X } from 'lucide-react';

enum EditableTextState {
    Display,
    Editing,
    Saving
}

export default function EditableText({ value, onUpdate }: EditableTextProps) {
    const [state, setState] = useState<EditableTextState>(EditableTextState.Display);
    const [error, setError] = useState<string>('');

    const handleSubmit = async function (e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const newValue = e.currentTarget.value.value;
        setState(EditableTextState.Saving);

        try {
            await onUpdate(newValue);
            setState(EditableTextState.Display);
            setError('');
        } catch (err) {
            setError((err as Error).message);
            setState(EditableTextState.Editing);
        }
    }

    if (state === EditableTextState.Display) {
        return (
            <>
                {value}
                <button onClick={() => setState(EditableTextState.Editing)}><Pencil size={16} /></button>
            </>

        );
    }

    return (
        <>
            <form onSubmit={handleSubmit}>
                <input name="value" defaultValue={value} autoFocus />
                <button type="submit" disabled={state === EditableTextState.Saving}><Check size={16} /></button>
                <button type="button" onClick={() => setState(EditableTextState.Display)}><X size={16} /></button>
            </form>
            {error && <p className="error">{error}</p>}
        </>
    );
}