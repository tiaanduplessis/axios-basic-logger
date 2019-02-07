import uid from "pico-uid";

function pad(val = "0", padding = 2) {
  return val.toString().padStart(padding, "0");
}

function getTimeStamp(date) {
  return `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(
    date.getSeconds()
  )}:${date.getMilliseconds()}`;
}

function logRequest(request, timestamp) {
  const { method, url } = request;
  return `REQUEST  ${timestamp} ${method.toUpperCase()} ${url}`;
}

function logResponse(response, timestamp, msDiff) {
  const { status, config } = response;
  return `RESPONSE ${timestamp} ${status} (${config.method.toUpperCase()} ${
    config.url
  }) ${msDiff}ms`;
}

export default function patchAxios(
  axios,
  { requestLogger = logRequest, responseLogger = logResponse } = {}
) {
  const requests = {};

  axios.interceptors.request.use(request => {
    const date = new Date();
    const str = requestLogger(request, getTimeStamp(date));
    
    const logId = uid(30);
    request.logId = logId;
    requests[logId] = date;

    console.log(str);
    return request;
  });

  axios.interceptors.response.use(response => {
    const date = new Date();
    const startDate = requests[response.config.logId];

    delete requests[response.config.logId];

    const str = logResponse(
      response,
      getTimeStamp(date),
      date.getTime() - startDate.getTime()
    );

    console.log(str);
    return response;
  });
}
