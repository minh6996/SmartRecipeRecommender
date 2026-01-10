import { Link } from 'react-router-dom';

const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    className = '',
    isLoading = false,
    to,
    ...props
}) => {
    const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-[0.98]';

    const variants = {
        primary: 'bg-primary-600 text-white hover:bg-primary-700 hover:shadow-lg hover:shadow-primary-500/30 ring-primary-500',
        secondary: 'bg-secondary-500 text-white hover:bg-secondary-600 hover:shadow-lg hover:shadow-secondary-500/30 ring-secondary-500',
        outline: 'border-2 border-slate-200 text-slate-700 bg-white hover:border-primary-600 hover:text-primary-600 hover:bg-primary-50 ring-primary-500',
        ghost: 'text-slate-600 hover:text-primary-600 hover:bg-primary-50 ring-primary-500',
        danger: 'bg-red-50 text-red-600 hover:bg-red-100 ring-red-500',
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-xs',
        md: 'px-5 py-2.5 text-sm',
        lg: 'px-6 py-3 text-base',
    };

    const combinedClasses = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

    const content = (
        <>
            {isLoading && (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            )}
            {children}
        </>
    );

    if (to) {
        return (
            <Link to={to} className={combinedClasses} {...props}>
                {content}
            </Link>
        );
    }

    return (
        <button className={combinedClasses} disabled={isLoading} {...props}>
            {content}
        </button>
    );
};

export default Button;
