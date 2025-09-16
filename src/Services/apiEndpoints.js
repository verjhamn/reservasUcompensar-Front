/**
 * Centralized API endpoints configuration
 * This file contains all API endpoints used across the application
 * to ensure consistency and ease of maintenance.
 */

const API_URL = import.meta.env.VITE_API_URL;

export const API_ENDPOINTS = {
  // Authentication
  LOGIN: `${API_URL}/auth/login`,
  REGISTER: `${API_URL}/auth/register`,
  
  // Check-in/Check-out
  CHECK_IN: `${API_URL}/reservas/check-in`,
  CHECK_IN_ADMIN: `${API_URL}/reservas/check-in-admin`,
  CHECK_OUT: `${API_URL}/reservas/check-out`, 
  
  // Reservation Management
  CREATE_RESERVATION: `${API_URL}/reservas/crear`,
  DELETE_RESERVATION: `${API_URL}/reservas`, // Base URL for DELETE operations
  MY_RESERVATIONS: `${API_URL}/mis-reservas`,
  FILTER_RESERVATIONS: `${API_URL}/reservas/filtrar`,
  
  // Availability
  AVAILABILITY: `${API_URL}/reservas/disponibilidad`,
  
  // Spaces
  FILTER_SPACES: `${API_URL}/espacios/filtrar`,
  
  // Reports
  GENERAL_REPORTS: `${API_URL}/reportes/general`,
  GENERAL_REPORTS_EXCEL: `${API_URL}/reportes/general-excel`,
};

/**
 * Helper function to build DELETE endpoint for specific reservation
 * @param {string|number} reservationId - The reservation ID
 * @returns {string} Complete DELETE endpoint URL
 */
export const getDeleteReservationEndpoint = (reservationId) => {
  return `${API_ENDPOINTS.DELETE_RESERVATION}/${reservationId}`;
};

/**
 * Helper function to build availability endpoint with query params
 * @param {Object} params - Query parameters
 * @returns {string} Complete availability endpoint URL
 */
export const getAvailabilityEndpoint = (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return queryString 
    ? `${API_ENDPOINTS.AVAILABILITY}?${queryString}`
    : API_ENDPOINTS.AVAILABILITY;
};
