import typescript from "@rollup/plugin-typescript";
import dts from "rollup-plugin-dts";
import resolve from "@rollup/plugin-node-resolve"
import commonjs from "@rollup/plugin-commonjs"
import { builtinModules } from "module"
const input = "src/index.ts";
// const external = (id) => builtinModules.includes(id) || id.startWith("node:")
const external = (id) => typeof id === 'string' && (builtinModules.includes(id) || id.startsWith('node:'));

export default [
  // ESM Build (with declarations)
  {
    input,
    output: {
      dir: "dist/esm",
      format: "esm",
      entryFileNames: "[name].mjs",
      chunkFileNames: "chunks/[name]-[hash].mjs",
      sourcemap: true,
    },
    plugins: [
      resolve({ extensions: [".js", ".ts"] }),
      commonjs(),
      typescript({
        tsconfig: "./tsconfig.json",
        declaration: true,
        declarationDir: "dist/esm/types", // ✅ inside ESM dir
        rootDir: "src",
        exclude: ["**/*.test.ts"],
      }),
    ],
    // external: [...builtinModules],
    external,
  },

  // 🔸 CJS Build (no declarations)
  {
    input,
    output: {
      dir: "dist/cjs",
      format: "cjs",
      entryFileNames: "[name].cjs",
      chunkFileNames: "chunks/[name]-[hash].cjs",
      exports: "auto",
      sourcemap: true,
    },
    plugins: [
      resolve({ extensions: [".js", ".ts"] }),
      commonjs(),
      typescript({
        tsconfig: "./tsconfig.json",
        declaration: false,         // ❌ no declarations here
        emitDeclarationOnly: false,
        rootDir: "src",
        exclude: ["**/*.test.ts"],
      }),
    ],
    // external: [...builtinModules],
    external,
  },

  // 🧾 Type Declarations bundling
  {
    input: "dist/esm/types/index.d.ts",
    output: {
      file: "dist/index.d.ts",
      format: "es",
    },
    plugins: [dts()],
  },
];




// export default [
//   // Main JS bundle (ESM + CJS)
//   {
//     input,
//     output: [
//         {
//             dir: "dist/esm",              // 🟢 ESM build goes here
//             format: "esm",
//             entryFileNames: "[name].mjs",
//             chunkFileNames: "chunks/[name]-[hash].mjs",
//             sourcemap: true,
//         },
//         {
//             dir: "dist/cjs",              // 🔵 CJS build goes here
//             format: "cjs",
//             entryFileNames: "[name].cjs",
//             chunkFileNames: "chunks/[name]-[hash].cjs",
//             exports: "auto",              // 👈 tells Rollup how to handle exports
//             sourcemap: true,
//         }
//     //   {
//     //     file: "dist/index.mjs",
//     //     format: "esm",
//     //     sourcemap: true,
//     //   },
//     //   {
//     //     file: "dist/index.cjs",
//     //     format: "cjs",
//     //     sourcemap: true,
//     //   },
//     ],
//     onwarn(warning, warn) {
//         if (
//             warning.code === "CIRCULAR_DEPENDENCY" ||
//             warning.message.includes("preferring built-in module")
//         ) return;
//         warn(warning);
//     },
//     plugins: [
//         resolve({ extensions: [".js", ".ts"]}),
//         commonjs({
//             include: /node_modules/,
//         }),
//         typescript({
//         tsconfig: "./tsconfig.json",
//         declaration: true,
//         declarationDir: "dist/esm/types",
//         rootDir: "src",
//         exclude: ["**/*.test.ts"],
//       }),
//     ],
//     external: ["fs", "path"], // don't bundle node built-ins
//   },

//   // Type declarations
//   {
//     input: "dist/esm/types/index.d.ts",
//     output: {
//         file: "dist/index.d.ts",    
//         // dir: "dist/types-bundles",
//         format: "es",
//     },
//     plugins: [dts({respectExternal: true})],
//   },
// ];