import antfu from "@antfu/eslint-config"

export default antfu(
  {
    stylistic: {
      indent: 4,
      quotes: "double",
      semi: true,
    },
  },
  {
    files: ["**/*.js", "**/*.ts"],
    rules: {
      "node/prefer-global/process": "off",
      "no-console": "off",
      "antfu/no-top-level-await": "off",
    },

  },
);
