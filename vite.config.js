import { defineConfig } from "vitest/config"

export default defineConfig({
  define: {
    __ENV_NAME__: '"test"',
  }
})
