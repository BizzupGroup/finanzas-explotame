import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // El backend respondió con error
      return Promise.reject(error.response.data.detail || "Error del servidor");
    } else if (error.request) {
      // No hubo respuesta
      return Promise.reject("No se pudo conectar con el servidor");
    } else {
      return Promise.reject("Error inesperado");
    }
  }
);

export default api;
