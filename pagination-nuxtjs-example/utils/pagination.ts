/**
 * Generate page numbers for pagination with ellipsis
 * Example: [1, 2, 3, '...', 12, 13, 14] for currentPage=13, totalPages=14
 */
export function generatePageNumbers(
  currentPage: number,
  totalPages: number,
  maxVisible: number = 7
): (number | string)[] {
  if (totalPages <= maxVisible) {
    // Show all pages if total pages is less than max visible
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages: (number | string)[] = [];
  const halfVisible = Math.floor(maxVisible / 2);

  if (currentPage <= halfVisible + 1) {
    // Near the beginning: [1, 2, 3, 4, 5, '...', totalPages]
    for (let i = 1; i <= maxVisible - 1; i++) {
      pages.push(i);
    }
    pages.push('...');
    pages.push(totalPages);
  } else if (currentPage >= totalPages - halfVisible) {
    // Near the end: [1, '...', totalPages-4, totalPages-3, totalPages-2, totalPages-1, totalPages]
    pages.push(1);
    pages.push('...');
    for (let i = totalPages - (maxVisible - 2); i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    // In the middle: [1, '...', current-1, current, current+1, '...', totalPages]
    pages.push(1);
    pages.push('...');
    for (let i = currentPage - 1; i <= currentPage + 1; i++) {
      pages.push(i);
    }
    pages.push('...');
    pages.push(totalPages);
  }

  return pages;
}

