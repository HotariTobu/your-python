import { serve } from "bun";
import { networkInterfaces } from "os";
import index from "./index.html";

function getLocalIPAddresses(): string[] {
  return Object.values(networkInterfaces())
    .flat()
    .filter((addr): addr is NonNullable<typeof addr> =>
      addr !== undefined && addr.family === "IPv4" && !addr.internal
    )
    .map((addr) => addr.address);
}

const server = serve({
  routes: {
    // Serve index.html for all unmatched routes.
    "/*": index,
  },

  development: process.env.NODE_ENV !== "production" && {
    // Enable browser hot reloading in development
    hmr: true,

    // Echo console logs from the browser to the server
    console: true,
  },
});

const { port } = server;
console.log(`🚀 Server running at`);
console.log(`   Local:   http://localhost:${port}`);
for (const ip of getLocalIPAddresses()) {
  console.log(`   Network: http://${ip}:${port}`);
}
