export const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  };
  
  export const formatDate = (date: string): string => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  
  export const formatMileage = (mileage: number): string => {
    return new Intl.NumberFormat('en-US').format(mileage);
  };
  
  export const getConditionColor = (condition: string): string => {
      const colors: { [key: string]: string } = {
        excellent: 'bg-green-100 text-green-800',
        good: 'bg-blue-100 text-blue-800',
        fair: 'bg-yellow-100 text-yellow-800',
        poor: 'bg-red-100 text-red-800',
      };
      return colors[condition.toLowerCase()] || 'bg-gray-100 text-gray-800';
    };
  
  export const validatePassword = (password: string): boolean => {
    return password.length >= 8;
  };
  
  export const delay = (ms: number): Promise<void> => 
    new Promise(resolve => setTimeout(resolve, ms));