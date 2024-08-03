import { defineDevConfig } from "@junobuild/config";

/** @type {import('@junobuild/config').JunoDevConfig} */
export default defineDevConfig(() => ({
  satellite: {
    collections: {
      db: [
        {
          collection: "notes",
          read: "public",
          write: "managed",
          memory: "stable",
          mutablePermissions: true,
        },
        {
          collection: "activity",
          read: "public",
          write: "managed",
          memory: "stable",
          mutablePermissions: true,
        },
        {
          collection: "requests",
          read: "public",
          write: "managed",
          memory: "stable",
          mutablePermissions: true,
        },
      ],
      storage: [
        {
          collection: "images",
          read: "public",
          write: "managed",
          memory: "stable",
          mutablePermissions: true,
        },
      ],
    },
  },
}));
