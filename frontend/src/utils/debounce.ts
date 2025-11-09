export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  // SỬA Ở ĐÂY: Thay 'NodeJS.Timeout' thành 'number'
  let timeout: number | null = null;

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);

    // setTimeout trong React Native/trình duyệt trả về 'number'
    timeout = setTimeout(() => func(...args), wait);
  };
}
