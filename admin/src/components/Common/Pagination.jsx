import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const maxVisiblePages = 5;
  let startPage, endPage;

  if (totalPages <= maxVisiblePages) {
    startPage = 1;
    endPage = totalPages;
  } else {
    const maxPagesBeforeCurrent = Math.floor(maxVisiblePages / 2);
    const maxPagesAfterCurrent = Math.ceil(maxVisiblePages / 2) - 1;
    
    if (currentPage <= maxPagesBeforeCurrent) {
      startPage = 1;
      endPage = maxVisiblePages;
    } else if (currentPage + maxPagesAfterCurrent >= totalPages) {
      startPage = totalPages - maxVisiblePages + 1;
      endPage = totalPages;
    } else {
      startPage = currentPage - maxPagesBeforeCurrent;
      endPage = currentPage + maxPagesAfterCurrent;
    }
  }

  const pages = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);

  return (
    <div className="flex space-x-1">
      <button
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
        className={`px-3 py-1 border rounded-md ${currentPage === 1 ? 'bg-gray-100 text-gray-400' : 'hover:bg-gray-100'}`}
      >
        <i className="fas fa-angle-double-left"></i>
      </button>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-3 py-1 border rounded-md ${currentPage === 1 ? 'bg-gray-100 text-gray-400' : 'hover:bg-gray-100'}`}
      >
        <i className="fas fa-angle-left"></i>
      </button>
      
      {startPage > 1 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className="px-3 py-1 border rounded-md hover:bg-gray-100"
          >
            1
          </button>
          {startPage > 2 && <span className="px-3 py-1">...</span>}
        </>
      )}
      
      {pages.map(page => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-1 border rounded-md ${currentPage === page ? 'bg-est-blue text-white' : 'hover:bg-gray-100'}`}
        >
          {page}
        </button>
      ))}
      
      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && <span className="px-3 py-1">...</span>}
          <button
            onClick={() => onPageChange(totalPages)}
            className="px-3 py-1 border rounded-md hover:bg-gray-100"
          >
            {totalPages}
          </button>
        </>
      )}
      
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-3 py-1 border rounded-md ${currentPage === totalPages ? 'bg-gray-100 text-gray-400' : 'hover:bg-gray-100'}`}
      >
        <i className="fas fa-angle-right"></i>
      </button>
      <button
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
        className={`px-3 py-1 border rounded-md ${currentPage === totalPages ? 'bg-gray-100 text-gray-400' : 'hover:bg-gray-100'}`}
      >
        <i className="fas fa-angle-double-right"></i>
      </button>
    </div>
  );
};

export default Pagination;