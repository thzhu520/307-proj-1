/**
 * Filters reports based on a date range.
 * @param {Array} reports - The array of report documents.
 * @param {Date} startDate - The start date for the filter.
 * @param {Date} endDate - The end date for the filter.
 * @returns {Array} - Filtered array of reports.
 */
export const filterByDateRange = (reports, startDate, endDate) => {
    return reports.filter(report => {
      const reportDate = new Date(report.time);
      return reportDate >= startDate && reportDate <= endDate;
    });
  };
  
  /**
   * Filters reports by location.
   * @param {Array} reports - The array of report documents.
   * @param {String} location - The location to filter by.
   * @returns {Array} - Filtered array of reports.
   */
  export const filterByLocation = (reports, location) => {
    return reports.filter(report => report.location === location);
  };
  