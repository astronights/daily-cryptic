'use client';

import { useEffect, useRef } from 'react';
import { CloseIcon } from './Icons';

type Props = { open: boolean; title: string; onClose: () => void; children: React.ReactNode };

export default function Dialog({ open, title, onClose, children }: Props) {
    const ref = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        const dialog = ref.current;
        if (!dialog) return;
        if (open && !dialog.open) dialog.showModal();
        if (!open && dialog.open) dialog.close();
    }, [open]);

    return (
        <dialog
            ref={ref}
            className="dialog"
            onClose={onClose}
            onClick={(e) => e.target === ref.current && onClose()}
        >
            <div className="dialog-body">
                <header className="dialog-header">
                    <h2>{title}</h2>
                    <button className="icon-button" onClick={onClose} aria-label="Close"><CloseIcon /></button>
                </header>
                {children}
            </div>
        </dialog>
    );
}
