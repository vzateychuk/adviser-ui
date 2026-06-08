import { defineConfig } from 'orval'

export default defineConfig({
  medAiAdviser: {
    input: './openapi/openapi.json',
    output: {
      mode: 'tags-split',
      target: './src/core/api/generated',
      schemas: './src/core/api/generated/models',
      client: 'react-query',
      clean: true,
      override: {
        mutator: {
          path: './src/core/api/client.ts',
          name: 'customFetch',
        },
        query: {
          useQuery: false,
          useMutation: false,
        },
      },
    },
  },
})
