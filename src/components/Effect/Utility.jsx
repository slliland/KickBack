export const getDaysLeft = () => {
    const today = new Date();
    const targetDate = new Date('2028-06-09');
    return Math.ceil((targetDate - today) / (1000 * 60 * 60 * 24));
  };
  