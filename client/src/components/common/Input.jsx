import { forwardRef } from 'react';
import { cn } from '../../utils/helpers';

const Input = forwardRef(({
    label,
    error,
    type = 'text',
    className = '',
    wrapperClassName = '',
    leftIcon,
    rightIcon,
    ...props
}, ref) => {
    return (
        <div className={cn('w-full', wrapperClassName)}>
            {label && (
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    {label}
                </label>
            )}
            <div className="relative">
                {leftIcon && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        {leftIcon}
                    </div>
                )}
                <input
                    ref={ref}
                    type={type}
                    className={cn(
                        'input',
                        leftIcon && 'pl-10',
                        rightIcon && 'pr-10',
                        error && 'input-error',
                        className
                    )}
                    {...props}
                />
                {rightIcon && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400">
                        {rightIcon}
                    </div>
                )}
            </div>
            {error && (
                <p className="mt-1.5 text-sm text-red-500">{error}</p>
            )}
        </div>
    );
});

Input.displayName = 'Input';

export default Input;
