import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    server: {
      // @gamepark/rules-api ships ESM with directory imports, which Node cannot resolve
      // natively: inline it so Vite performs the resolution instead.
      deps: {
        inline: [/@gamepark\//]
      }
    }
  }
})
