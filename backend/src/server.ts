import { createApp } from "./app";
import { env } from "./config/env";

const app = createApp();

app.listen(env.port, () => {
  // Log minimal startup info for local dev
  // eslint-disable-next-line no-console
  console.log(`API server listening on port ${env.port}`);
});
