import { defineConfig } from '@hey-api/openapi-ts';

const spec: { paths: Record<string, Record<string, { operationId?: string }>> } =
  await (await fetch('http://localhost:20625/umbraco/openapi/delivery.json')).json();

// Umbraco 18 operationIds look like "GetContent2.0"; hey-api treats "." as nesting
for (const path of Object.values(spec.paths)) {
  for (const operation of Object.values(path)) {
    operation.operationId = operation.operationId?.replace('.', '');
  }
}

export default defineConfig({
  debug: true,
  input: spec,
  output: {
    lint: 'eslint',
    path: 'src/api',
  },
  plugins: [
    {
      name: "@hey-api/client-fetch",
      bundle: false,
      exportFromIndex: true,
      throwOnError: true,
    },
    {
      name: "@hey-api/typescript",
      enums: true,
    },
    {
      name: "@hey-api/sdk",
      asClass: true,
      classNameBuilder: (name) => `${name}Service`,
      responseStyle: "fields",
    },
  ],
});