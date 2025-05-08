import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"

/**
 * Quartz 4 Configuration
 *
 * See https://quartz.jzhao.xyz/configuration for more information.
 */
const config: QuartzConfig = {
  configuration: {
    pageTitle: "Quartz 4",
    pageTitleSuffix: "",
    enableSPA: true,
    enablePopovers: true,
    analytics: {
      provider: "plausible",
    },
    locale: "en-US",
    baseUrl: "ijb0708.github.io/ijb0708.github.io",
    ignorePatterns: ["private", "templates", ".obsidian", "**/*.excalidraw.md"],
    defaultDateType: "modified",
    theme: {
      fontOrigin: "googleFonts",
      cdnCaching: true,
      typography: {
        title: {
          name: "Orbitron",
          weights: [700],
        },
        header: {
          name: "Orbitron",
          weights: [500],
        },
        body: {
          name: "Source Code Pro",
          weights: [400],
        },
        code: {
          name: "Source Code Pro",
          weights: [400],
        },
      },
      colors: {
        lightMode: {
          light: "#fbeaff",
          lightgray: "#e0cdea",
          gray: "#bfaed6",
          darkgray: "#5a4870",
          dark: "#2f2f4f",
          secondary: "#a855f7",
          tertiary: "#fca5a5",
          highlight: "rgba(192, 132, 252, 0.15)",
          textHighlight: "#fff23688",
        },
        darkMode: {
          light: "#1a1a2e",
          lightgray: "#2b2b3f",
          gray: "#64648c",
          darkgray: "#d4d4f4",
          dark: "#eeeeff",
          secondary: "#c084fc",
          tertiary: "#fca5a5",
          highlight: "rgba(192, 132, 252, 0.15)",
          textHighlight: "#fde68a88",
        },
      },
    },
  },
  plugins: {
    transformers: [
      Plugin.FrontMatter(),
      Plugin.CreatedModifiedDate({
        priority: ["frontmatter", "git", "filesystem"],
      }),
      Plugin.SyntaxHighlighting({
        theme: {
          light: "github-light",
          dark: "github-dark",
        },
        keepBackground: false,
      }),
      Plugin.ObsidianFlavoredMarkdown({ enableInHtmlEmbed: false }),
      Plugin.GitHubFlavoredMarkdown(),
      Plugin.TableOfContents(),
      Plugin.CrawlLinks({ markdownLinkResolution: "shortest" }),
      Plugin.Description(),
      Plugin.Latex({ renderEngine: "katex" }),
    ],
    filters: [Plugin.RemoveDrafts()],
    emitters: [
      Plugin.AliasRedirects(),
      Plugin.ComponentResources(),
      Plugin.ContentPage(),
      Plugin.FolderPage(),
      Plugin.TagPage(),
      Plugin.ContentIndex({
        enableSiteMap: true,
        enableRSS: true,
      }),
      Plugin.Assets(),
      Plugin.Static(),
      Plugin.Favicon(),
      Plugin.NotFoundPage(),
      // Comment out CustomOgImages to speed up build time
      Plugin.CustomOgImages(),
    ],
  },
}

export default config
