export const environment = {
  production: true,
  apiUrl: "",
  authTimerAmount: 285000, //(4 minutes 45 seconds) -- time before fetching refresh
  tokenRefreshHoursAmount: 23,
  tokenRefreshMinsAmount: 46,
  tokenRefreshSecondsAmount: 0,
  tokenMinsAmount: 4, // exp time in local storage: 4 minutes & 50 seconds -- 5 mins on backend
  tokenSecondsAmount: 50,
};
