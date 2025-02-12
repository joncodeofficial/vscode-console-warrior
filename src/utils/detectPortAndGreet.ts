import * as portscanner from "portscanner";

export const detectPortAndGreet = (port: number) => {
  portscanner.checkPortStatus(port, "127.0.0.1", (error, status) => {
    if (status === "open") {
      console.log(`Puerto ${port} detectado. Que tenga buen día!`);
    } else {
      console.log(`Puerto ${port} no está en uso.`);
    }
  });
};
