// ==================== REPORTS MODULE - HELPER FUNCTIONS ====================

/**
 * Calculate pagination data
 */
export function calculatePagination<T>(
  items: T[],
  currentPage: number,
  itemsPerPage: number
) {
  const totalPages = Math.ceil(items.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedItems = items.slice(startIndex, endIndex);
  
  return {
    totalPages,
    paginatedItems,
    startIndex,
    endIndex,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
  };
}

/**
 * Generate page numbers for pagination with ellipsis
 */
export function generatePageNumbers(currentPage: number, totalPages: number): (number | 'ellipsis')[] {
  const pages: (number | 'ellipsis')[] = [];
  
  if (totalPages <= 7) {
    // Show all pages if 7 or fewer
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    // Always show first page
    pages.push(1);
    
    if (currentPage > 3) {
      pages.push('ellipsis');
    }
    
    // Show pages around current
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    if (currentPage < totalPages - 2) {
      pages.push('ellipsis');
    }
    
    // Always show last page
    pages.push(totalPages);
  }
  
  return pages;
}

/**
 * Filter users by search query
 */
export function filterUsers<T extends { id: string; name: string; email: string }>(
  users: T[],
  searchQuery: string,
  excludeIds?: Set<string>
): T[] {
  const query = searchQuery.toLowerCase().trim();
  
  if (!query) {
    return excludeIds 
      ? users.filter(user => !excludeIds.has(user.id))
      : users;
  }
  
  return users.filter(user => {
    if (excludeIds && excludeIds.has(user.id)) return false;
    return (
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query)
    );
  });
}

