export const formatTime = (date: Date | string): string => {
  if (typeof window === 'undefined') {
    // Server-side: return a consistent format
    return new Date(date).toISOString().slice(11, 16); // HH:MM format
  }
  
  // Client-side: use locale formatting
  return new Date(date).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false // Use 24-hour format to avoid AM/PM differences
  });
};

export const formatTimeWithSeconds = (date: Date | string): string => {
  if (typeof window === 'undefined') {
    // Server-side: return a consistent format
    return new Date(date).toISOString().slice(11, 19); // HH:MM:SS format
  }
  
  // Client-side: use locale formatting
  return new Date(date).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
};

export const getCurrentTime = (): string => {
  if (typeof window === 'undefined') {
    return new Date().toISOString().slice(11, 16);
  }
  
  return new Date().toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false
  });
};