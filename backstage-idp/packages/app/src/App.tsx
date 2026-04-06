import React from 'react';
import { Route } from 'react-router-dom';
import { apiDocsPlugin, ApiExplorerPage } from '@backstage/plugin-api-docs';
import { CatalogEntityPage, CatalogIndexPage, catalogPlugin } from '@backstage/plugin-catalog';
import { CatalogImportPage, catalogImportPlugin } from '@backstage/plugin-catalog-import';
import { ScaffolderPage, scaffolderPlugin } from '@backstage/plugin-scaffolder';
import { TechDocsIndexPage, TechDocsReaderPage, techdocsPlugin } from '@backstage/plugin-techdocs';
import { UserSettingsPage } from '@backstage/plugin-user-settings';
import { apis } from './apis';
import { entityPage } from './components/catalog/EntityPage';
import { Root } from './components/Root';
import {
  AlertDisplay,
  OAuthRequestDialog,
  createApp,
} from '@backstage/core-app-api';

const app = createApp({
  apis,
  plugins: [
    catalogPlugin,
    catalogImportPlugin,
    scaffolderPlugin,
    apiDocsPlugin,
    techdocsPlugin,
  ],
});

const AppProvider = app.getProvider();
const AppRouter = app.getRouter();

const routes = (
  <AppRouter>
    <Root>
      {/* Software Catalog — browse all services, APIs, libraries */}
      <Route path="/" element={<CatalogIndexPage />} />
      <Route path="/catalog/:namespace/:kind/:name" element={<CatalogEntityPage />}>
        {entityPage}
      </Route>

      {/* Software Templates — self-service for developers */}
      <Route path="/create" element={<ScaffolderPage />} />

      {/* TechDocs — auto-generated documentation */}
      <Route path="/docs" element={<TechDocsIndexPage />} />
      <Route path="/docs/:namespace/:kind/:name/*" element={<TechDocsReaderPage />} />

      {/* API Explorer */}
      <Route path="/api-docs" element={<ApiExplorerPage />} />

      {/* Register existing components */}
      <Route path="/catalog-import" element={<CatalogImportPage />} />

      {/* User settings */}
      <Route path="/settings" element={<UserSettingsPage />} />
    </Root>
  </AppRouter>
);

const App = () => (
  <AppProvider>
    <AlertDisplay />
    <OAuthRequestDialog />
    {routes}
  </AppProvider>
);

export default App;
