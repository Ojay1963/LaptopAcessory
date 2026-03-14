export function sendError(res, status, message, details) {
  res.status(status).json({
    ok: false,
    message,
    ...(details ? { details } : {}),
  })
}

export function sendOk(res, payload = {}, status = 200) {
  res.status(status).json({
    ok: true,
    ...payload,
  })
}
