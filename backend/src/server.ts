import { createApp } from "./app.js";
import { getConfig } from "./config.js";

const app = createApp();
const config = getConfig();

app.listen(config.port, () => {
  console.log(`Backend listening on http://localhost:${config.port}`);
});
