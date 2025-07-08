export default function Button({
    onClick,
    children,
    disabled,
    className = '',
}) {
    return (
        <button
            onClick={onClick}
            className={`px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded hover:bg-blue-700 cursor-pointer disabled:opacity-50 disabled:cursor-default disabled:hover:bg-blue-600 ${className}`}
            disabled={disabled}
        >
            {children}
        </button>
    );
}
