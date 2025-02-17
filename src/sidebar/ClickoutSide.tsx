import React, { useRef, useEffect } from 'react';

const ClickOutside = ({ children, exceptionRef, onClick, className = '' }: any) => {
  const wrapperRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickListener = (event: { target: any; }) => {
      const clickedInside = exceptionRef
        ? (wrapperRef.current?.contains(event.target) ||
           exceptionRef.current === event.target ||
           exceptionRef.current?.contains(event.target))
        : wrapperRef.current?.contains(event.target);

      if (!clickedInside) onClick();
    };

    document.addEventListener('mousedown', handleClickListener);

    return () => {
      document.removeEventListener('mousedown', handleClickListener);
    };
  }, [exceptionRef, onClick]);

  return (
    <div ref={wrapperRef} className={className}>
      {children}
    </div>
  );
};

export default ClickOutside;
