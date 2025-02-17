import React from 'react';

const Loader = ({ variant = 'default' }) => {
  if (variant === 'pulse') {
    return (
      <div className="max-w-4xl mx-auto p-4 space-y-4">
        {/* Search Bar Skeleton */}
        <div className="h-12 bg-gray-200 rounded-lg animate-pulse mb-8"></div>
        
        {/* Job Cards Skeleton */}
        {[...Array(3)].map((_, index) => (
          <div key={index} className=" rounded-lg p-6 shadow-sm space-y-3">
            <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'shimmer') {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="relative overflow-hidden">
          {/* Search Bar Shimmer */}
          <div className="h-12 bg-gray-200 rounded-lg mb-8 relative overflow-hidden">
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200"></div>
          </div>
          
          {/* Job Listings Shimmer */}
          <div className="space-y-4">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-sm space-y-3 relative overflow-hidden">
                <div className="h-6 bg-gray-200 rounded w-3/4 relative overflow-hidden">
                  <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/4 relative overflow-hidden">
                    <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200"></div>
                  </div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 relative overflow-hidden">
                    <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'spinner') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-4">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
        <p className="text-gray-600 text-lg">Loading...</p>
      </div>
    );
  }

  // Default loading animation
  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="space-y-6 w-full">
          {/* Animated dots */}
          <div className="flex justify-center space-x-2">
            <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce [animation-delay:0.2s]"></div>
            <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce [animation-delay:0.4s]"></div>
          </div>
          <p className="text-center text-gray-600 text-lg">Loading job listings...</p>
        </div>
      </div>
    </div>
  );
};

export default Loader;