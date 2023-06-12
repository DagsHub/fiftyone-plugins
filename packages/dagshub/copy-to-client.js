var fs = require("fs");
var path = require("path");

function getOutputFolder() {
  // Get from arguments
  if (process.argv.length > 2) {
    return process.argv[2];
  }

  // Get from env var
  const env_path = process.env.DAGSHUB_PLUGIN_PATH
  if (env_path !== undefined) {
    return env_path;
  }

  throw new Error("Path for plugin files not specified. Specify DAGSHUB_PLUGIN_PATH");
}

function copyBuiltFiles(outputDir) {
  const dist_path = path.join(outputDir, "dist");
  if (!fs.existsSync(dist_path)) {
    fs.mkdirSync(dist_path, {recursive: true});
  }

  fs.cpSync(path.join(__dirname, "dist", "index.umd.js"), path.join(dist_path, "index.umd.js"));
  fs.cpSync(path.join(__dirname, "_deploypackage.json"), path.join(outputDir, "package.json"));
  fs.cpSync(path.join(__dirname, "fiftyone.yaml"), path.join(outputDir, "fiftyone.yaml"));
}


copyBuiltFiles(getOutputFolder());
