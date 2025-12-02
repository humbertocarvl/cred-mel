import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  
  // Mostrar apenas 7 páginas por vez
  let visiblePages = pages;
  if (totalPages > 7) {
    if (currentPage <= 4) {
      visiblePages = [...pages.slice(0, 5), -1, totalPages];
    } else if (currentPage >= totalPages - 3) {
      visiblePages = [1, -1, ...pages.slice(totalPages - 5)];
    } else {
      visiblePages = [1, -1, currentPage - 1, currentPage, currentPage + 1, -1, totalPages];
    }
  }

  return (
    <div style={{ 
      display: 'flex', 
      gap: '0.5rem', 
      alignItems: 'center', 
      justifyContent: 'center',
      marginTop: '1.5rem',
      flexWrap: 'wrap'
    }}>
      <button
        className="button"
        style={{ 
          padding: '0.5em 1em', 
          background: currentPage === 1 ? 'var(--mel-gray)' : 'var(--mel-gold)',
          cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
          opacity: currentPage === 1 ? 0.5 : 1
        }}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        ← Anterior
      </button>
      
      {visiblePages.map((page, idx) => 
        page === -1 ? (
          <span key={`ellipsis-${idx}`} style={{ padding: '0.5em' }}>...</span>
        ) : (
          <button
            key={page}
            className="button"
            style={{ 
              padding: '0.5em 1em',
              background: page === currentPage ? 'var(--mel-yellow)' : 'var(--mel-gold)',
              fontWeight: page === currentPage ? 'bold' : 'normal'
            }}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        )
      )}
      
      <button
        className="button"
        style={{ 
          padding: '0.5em 1em', 
          background: currentPage === totalPages ? 'var(--mel-gray)' : 'var(--mel-gold)',
          cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
          opacity: currentPage === totalPages ? 0.5 : 1
        }}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Próxima →
      </button>
    </div>
  );
};

export default Pagination;
