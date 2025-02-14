import * as portscanner from "portscanner";

export const detectPort = (port: number) => {
  return new Promise((resolve) => {
    portscanner.checkPortStatus(port, "127.0.0.1", (error, status) => {
      if (error) {
        resolve(false);
      } else if (status === "open") {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  });
};
