import app from "./app";
import { ENV } from "./config";
import { logger } from "@/utils";
import "./config";
import { initOpaque } from "./config/opaque";

const PORT = ENV.PORT || 3000;

const startServer = async () => {
  await initOpaque();
  app.listen(PORT, () => {
    logger.info("Server", `Server is running on port ${PORT}`);
  });
};

startServer().catch((error) => {
  logger.error("Server", "Failed to start server", error as Error);
  process.exit(1);
});
