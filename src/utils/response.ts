export function ok(message: string, data?: any) {
  return {
    status: "success",
    message,
    data,
  };
}

export function created(message: string, data?: any) {
  return {
    status: "success",
    message,
    data,
  };
}

export function badRequest(message: string) {
  return {
    status: "error",
    message,
  };
}

export function unauthorized(message: string) {
  return {
    status: "error",
    message,
  };
}

export function forbidden(message: string) {
  return {
    status: "error",
    message,
  };
}

export function notFound(message: string) {
  return {
    status: "error",
    message,
  };
}

export function serverError(message = "Internal server error") {
  return {
    status: "error",
    message,
  };
}
