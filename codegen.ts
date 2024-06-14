import { CodegenConfig } from '@graphql-codegen/cli';
import projectConfig from './config.json'

//Taken from https://www.apollographql.com/docs/react/development-testing/static-typing#setting-up-your-project

const config: CodegenConfig = {
  schema: projectConfig.API.CcreAPI,
  documents: ['src/**/*.{ts,tsx}'],
  generates: {
    './src/types/': {
      preset: 'client',
      plugins: [],
      presetConfig: {
        gqlTagName: 'gql',
      }
    }
  },
  ignoreNoDocuments: true,
};

export default config;