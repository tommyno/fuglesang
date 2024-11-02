// Output relative time, ex: 12 minutter siden / 16 timer siden / 2 dager siden
export const timeAgo = (date: string) => {
  if (!date) {
    return;
  }
  const dateObject = new Date(date);

  const now = new Date();
  const diff = now.getTime() - dateObject.getTime();

  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (minutes < 60) {
    return `${minutes} minutt${minutes !== 1 ? "er" : ""} siden`;
  } else if (hours < 24) {
    return `${hours} time${hours !== 1 ? "r" : ""} siden`;
  } else {
    return `${days} dag${days !== 1 ? "er" : ""} siden`;
  }
};
