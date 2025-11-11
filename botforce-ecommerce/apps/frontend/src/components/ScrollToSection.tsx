"use client";

type Props = {
    targetId: string;
    className?: string;
    children: React.ReactNode;
};

export function ScrollToSection({ targetId, className, children }: Props) {
    const onClick = () => {
        const el = document.getElementById(targetId);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    return (
        <button onClick={onClick} className={className}>
            {children}
        </button>
    );
}
