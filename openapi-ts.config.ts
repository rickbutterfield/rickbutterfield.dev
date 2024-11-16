import { defineConfig } from '@hey-api/openapi-ts';

export default defineConfig({
  client: 'fetch',
  debug: true,
  input: 'http://localhost:20625/umbraco/swagger/delivery/swagger.json',
  output: {
    path: 'src/api',
    format: 'prettier',
    lint: 'eslint',
  },
  schemas: false,
  services: {
    asClass: true,
  },
  types: {
    enums: 'typescript',
  }
});