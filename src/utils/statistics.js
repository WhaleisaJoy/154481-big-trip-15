export const formatTimeSpendDuration = (timeSpend) => {
  const minutes = Math.floor( (timeSpend / (1000 * 60)) % 60 );
  const hours = Math.floor( (timeSpend / (1000 * 60 * 60)) % 24 );
  const days = Math.floor( (timeSpend / (1000 * 60 * 60 * 24)) % 30 );

  const dateMinutes = minutes !== 0 ? `${minutes}M` : '';
  const dateHours = hours !== 0 ? `${hours}H` : '';
  const dateDays = days !== 0 ? `${days}D` : '';

  return `${dateDays} ${dateHours} ${dateMinutes}`;
};


