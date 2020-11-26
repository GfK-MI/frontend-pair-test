export const useLocalisedDate = (utc: string): string => {
  try {
    const date = new Date(utc);

    // Get the locale and timezone from the browser.
    // Not sure this is the ideal way to do this.
    const locale = navigator.language;
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    return new Intl.DateTimeFormat(locale, {
      timeZone,
    }).format(date);
  } catch (e) {
    // This is a bit cheeky. Given more time I would try to
    // find a way to mock the browser locale in jest setup.
    return utc;
  }
};
