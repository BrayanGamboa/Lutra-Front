import type { AxiosError } from 'axios';

interface ApiErrorBody {
  detail?: string;
  title?: string;
  message?: string;
}

const asApiErrorBody = (data: unknown): ApiErrorBody => {
  if (data !== null && typeof data === 'object') {
    return data as ApiErrorBody;
  }
  return {};
};

export const getApiErrorMessage = (error: AxiosError): string => {
  const status = error.response?.status;

  if (!error.response) {
    return 'Error de conexión. Verifica tu conexión a internet.';
  }

  if (status === 401) {
    return 'Sesión expirada. Por favor inicia sesión.';
  }

  if (status === 403) {
    return 'No tienes permisos para realizar esta acción.';
  }

  if (status === 404) {
    return 'El recurso solicitado no existe.';
  }

  if (status === 400) {
    const body = asApiErrorBody(error.response.data);
    return body.detail ?? body.title ?? body.message ?? 'Datos inválidos.';
  }

  if (status !== undefined && status >= 500) {
    return 'Error interno del servidor. Intenta de nuevo más tarde.';
  }

  return error.message ?? 'Ocurrió un error inesperado.';
};
