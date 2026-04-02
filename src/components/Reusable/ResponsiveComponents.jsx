import React from 'react';

/**
 * Responsive Card Component
 * - Mobile: Full width
 * - Tablet+: Flexible width based on container
 */
export function Card({ 
  children, 
  className = '', 
  hover = true,
  onClick = null 
}) {
  return (
    <div
      onClick={onClick}
      className={`
        w-full rounded-lg p-4 md:p-6 bg-white shadow-md
        border border-gray-100
        transition-all duration-200
        ${hover ? 'hover:shadow-lg hover:scale-105 cursor-pointer' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}

/**
 * Responsive Grid Component
 * - Mobile: 1 column
 * - Tablet: 2 columns
 * - Desktop: 3 columns
 * - Large: 4 columns
 */
export function ResponsiveGrid({ 
  children, 
  cols = { mobile: 1, tablet: 2, desktop: 3, large: 4 },
  gap = true
}) {
  return (
    <div
      className={`
        grid grid-cols-${cols.mobile} 
        sm:grid-cols-2 
        md:grid-cols-${cols.desktop} 
        lg:grid-cols-${cols.large}
        ${gap ? 'gap-4 md:gap-6' : ''}
        w-full
      `}
    >
      {children}
    </div>
  );
}

/**
 * Responsive Flex Container
 * - Mobile: Column (vertical stack)
 * - Desktop: Row (horizontal)
 */
export function ResponsiveFlex({
  children,
  className = '',
  gap = true,
  reverse = false
}) {
  return (
    <div
      className={`
        flex flex-col 
        md:flex-row 
        ${reverse ? 'md:flex-row-reverse' : ''}
        ${gap ? 'gap-4 md:gap-6 lg:gap-8' : ''}
        items-start md:items-center
        ${className}
      `}
    >
      {children}
    </div>
  );
}

/**
 * Responsive Button Component
 * - Mobile: Full width, larger touch target
 * - Desktop: Auto width
 */
export function Button({
  children,
  variant = 'primary',
  fullWidth = true,
  className = '',
  ...props
}) {
  const variants = {
    primary: 'bg-green-600 hover:bg-green-700 text-white',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-900',
    danger: 'bg-red-500 hover:bg-red-600 text-white',
    outline: 'border-2 border-green-600 text-green-600 hover:bg-green-50',
  };

  return (
    <button
      className={`
        px-4 md:px-6 py-3 md:py-4
        rounded-lg font-semibold text-sm md:text-base
        transition-all duration-200 transform
        hover:scale-105 active:scale-95
        focus:outline-none focus:ring-2 focus:ring-offset-2
        min-h-11 md:min-h-12
        ${fullWidth ? 'w-full md:w-auto' : ''}
        ${variants[variant]}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}

/**
 * Responsive Input Component
 * - Touch-friendly (min height 44px)
 * - Full width with proper padding
 */
export function Input({
  label,
  placeholder,
  type = 'text',
  fullWidth = true,
  error = null,
  className = '',
  ...props
}) {
  return (
    <div className="w-full space-y-2">
      {label && (
        <label className="block text-sm md:text-base font-semibold text-gray-700">
          {label}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        className={`
          w-full px-4 py-3 md:py-4
          text-base md:text-lg
          rounded-lg border-2 border-gray-200
          focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200
          transition-all duration-200
          min-h-11 md:min-h-12
          ${error ? 'border-red-500 focus:ring-red-200' : ''}
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}
    </div>
  );
}

/**
 * Responsive Form Group
 * - Mobile: Stacked vertically
 * - Desktop: Inline or flexible layout
 */
export function FormGroup({ children, className = '' }) {
  return (
    <div className={`space-y-4 md:space-y-6 ${className}`}>
      {children}
    </div>
  );
}

/**
 * Responsive Header/Section Title
 * - Mobile: Smaller text
 * - Desktop: Larger text
 */
export function SectionTitle({ 
  children, 
  className = '',
  subtitle = null
}) {
  return (
    <div className={`mb-6 md:mb-8 ${className}`}>
      <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-2">
        {children}
      </h1>
      {subtitle && (
        <p className="text-gray-600 text-sm md:text-base">
          {subtitle}
        </p>
      )}
    </div>
  );
}

/**
 * Responsive Container
 * - Max width with padding
 * - Centered content
 */
export function Container({ 
  children, 
  className = '',
  maxWidth = 'max-w-7xl'
}) {
  return (
    <div className={`w-full ${maxWidth} mx-auto px-4 sm:px-6 md:px-8 ${className}`}>
      {children}
    </div>
  );
}

/**
 * Responsive Stat Card
 * - Shows icon, label, and value
 * - Responsive sizing
 */
export function StatCard({
  icon,
  label,
  value,
  onClick = null
}) {
  return (
    <Card hover onClick={onClick}>
      <div className="flex flex-col items-center text-center space-y-2 md:space-y-3">
        <div className="text-4xl md:text-5xl">{icon}</div>
        <p className="text-gray-600 text-xs md:text-sm font-medium uppercase tracking-wide">
          {label}
        </p>
        <p className="text-2xl md:text-3xl font-bold text-green-600">
          {value}
        </p>
      </div>
    </Card>
  );
}

/**
 * Responsive Badge
 * - Status indicator
 */
export function Badge({ 
  children, 
  variant = 'primary',
  className = '' 
}) {
  const variants = {
    primary: 'bg-blue-100 text-blue-700',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-yellow-100 text-yellow-700',
    danger: 'bg-red-100 text-red-700',
    gray: 'bg-gray-100 text-gray-700',
  };

  return (
    <span
      className={`
        inline-block px-3 py-1 md:px-4 md:py-2
        rounded-full text-xs md:text-sm font-semibold
        ${variants[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}

/**
 * Responsive Modal/Dialog
 * - Full screen on mobile
 * - Centered modal on desktop
 */
export function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer = null
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="absolute inset-0 flex items-center justify-center p-4 md:p-8">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-4 md:space-y-6">
          
          {/* Header */}
          <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-200">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">{title}</h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Content */}
          <div className="px-4 md:px-6">{children}</div>

          {/* Footer */}
          {footer && (
            <div className="p-4 md:p-6 border-t border-gray-200 flex gap-3">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Responsive Image
 * - Prevents overflow
 * - Maintains aspect ratio
 */
export function ResponsiveImage({
  src,
  alt,
  className = ''
}) {
  return (
    <img
      src={src}
      alt={alt}
      className={`w-full h-auto rounded-lg object-cover ${className}`}
    />
  );
}

/**
 * Responsive Empty State
 * - Centered message for empty content
 */
export function EmptyState({
  icon,
  title,
  description,
  action = null
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 md:py-20 px-4 text-center space-y-4">
      <div className="text-5xl md:text-6xl mb-4">{icon}</div>
      <h2 className="text-xl md:text-2xl font-bold text-gray-900">{title}</h2>
      <p className="text-gray-600 text-sm md:text-base max-w-md">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
}
