/*
 * Backstage Backend Entry Point
 * This file starts the Node.js server on port 7007.
 * It loads all plugins (catalog, scaffolder, techdocs, etc.)
 */
import { createBackend } from '@backstage/backend-defaults';

const backend = createBackend();

// ── Core plugins ──────────────────────────────────────────────────────────────

// Software Catalog — tracks all services, APIs, libraries
backend.add(import('@backstage/plugin-catalog-backend'));
backend.add(import('@backstice/plugin-catalog-backend-module-unprocessed'));

// Software Templates — lets developers self-provision new services
backend.add(import('@backstage/plugin-scaffolder-backend'));

// TechDocs — pulls docs from the same GitHub repo as the code
backend.add(import('@backstage/plugin-techdocs-backend'));

// Search — makes catalog & docs searchable
backend.add(import('@backstage/plugin-search-backend'));
backend.add(import('@backstage/plugin-search-backend-module-catalog'));
backend.add(import('@backstage/plugin-search-backend-module-techdocs'));

// ── Integrations ──────────────────────────────────────────────────────────────

// GitHub — repo creation, PR tracking, org discovery
backend.add(import('@backstage/plugin-catalog-backend-module-github'));

// Kubernetes — show live pod/service health from your kubeadm cluster
backend.add(import('@backstage/plugin-kubernetes-backend'));

// ── Start ─────────────────────────────────────────────────────────────────────
backend.start();
