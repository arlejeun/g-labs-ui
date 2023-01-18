import { URL, fileURLToPath } from "node:url";
import { defineConfig, loadEnv } from "vite";
import { resolve, dirname } from 'node:path';
import type { UserConfig} from "vite"
import type { ServerOptions as ServerOptions } from 'node:https';

import Vue from "@vitejs/plugin-vue";
import Pages from "vite-plugin-pages";
import Layouts from "vite-plugin-vue-layouts";
import Components from "unplugin-vue-components/vite";
import AutoImport from "unplugin-auto-import/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import VueI18n from '@intlify/unplugin-vue-i18n/vite'
import Markdown from "vite-plugin-vue-markdown";
import DefineOptions from "unplugin-vue-define-options/vite";
import fs from "fs";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }): UserConfig => {

  const env = {...loadEnv(mode, process.cwd())}; //loadEnv(mode, process.cwd(),'')
  let httpsConfig = false as boolean | ServerOptions
  const serverDevHost = env.SERVER_HOST || 'localhost' as string | boolean
  const serverDevPort = Number(env.SERVER_PORT) || 5173 as number
  const serverHost = env.SERVER_HOST || 'localhost' as string | boolean
  const serverPort = Number(env.SERVER_PORT) || 5173 as number

  if (env.SERVER_HTTPS == 'true') {
    httpsConfig = {
      key: fs.readFileSync('./.cert/localhost-key.pem'),
      cert: fs.readFileSync('./.cert/localhost.pem')
    }
  }

  return {
    server: {
      host: serverDevHost,
      port: serverDevPort,
      https: httpsConfig
    },
    preview: {
      host: serverDevHost,
      port: serverDevPort,
      https: httpsConfig
    },
    css: {
      preprocessorOptions: {
        scss: {
          //additionalData: `@use "@/assets/scss/element/index.scss" as *;`,
          // example : additionalData: `@import "./src/design/styles/variables";`
          // dont need include file extend .scss
          // additionalData: `@import "src/assets/scss/element/index.scss";`
        },
        dirs: ["src/assets/scss/element"],
      },
    },
    plugins: [
      Vue(),
      Pages({
        extendRoute(route, parent) {
          return route;
          // if (route.path === '/' || route.name == 'not-authorized') {
          //  return route
          // }
          // return {
          //   ...route,
          //   meta: { requiresAuth: true, title: route.name },
          // }
        },
        extensions: ["vue", "md"],
      }),
      Layouts(),
      AutoImport({
        imports: ["vue", "vue-router", "@vueuse/head", "@vueuse/core", "pinia", "vue-i18n"],
        resolvers: [ElementPlusResolver()],
        vueTemplate: true,
        dirs: ["src/composables", "src/store"],
        dts: "src/auto-imports.d.ts",
      }),
      Components({
        extensions: ["vue", "md"],
        dirs: ["src/components"],
        resolvers: [ElementPlusResolver()],
        include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
        dts: "src/components.d.ts",
      }),
      Markdown({
        wrapperClasses: "prose prose-sm m-auto text-left",
        headEnabled: true,
      }),
      DefineOptions(),
          // https://github.com/intlify/bundle-tools/tree/main/packages/unplugin-vue-i18n
      VueI18n({
        //runtimeOnly: true,
        compositionOnly: true,
        //fullInstall: true,
        include: path.resolve(__dirname, './src/i18n/locales/**')
        //include: [path.resolve(__dirname, './src/i18n/locales/**')],
      }),
    ],
    define: { "process.env": {} },
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    build: {
      chunkSizeWarningLimit: 5000,
    }
  };
});
function VueI18nPlugin(arg0: { include: string; /* options */ }): import("vite").PluginOption {
  throw new Error("Function not implemented.");
}

