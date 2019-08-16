const path = require("path");
const { promisify } = require("util");
const fs = require("fs");
const replace = require("replace-in-file");
const walk = require("./utils/walk");
const { nextjsDir, arweaveDir, finalDir } = require("./utils/dirs");

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

const [targetFile] = process.argv.slice(2);

const start = async () => {
  const files = await walk(nextjsDir).then(fullPaths => {
    return fullPaths.map(fullPath => {
      const format = path.extname(fullPath);
      const contentType = (() => {
        if (format.includes(".js")) {
          return "text/javascript";
        } else if (format.includes(".css")) {
          return "text/css";
        } else if (format.includes(".png")) {
          return "image/png";
        } else if (format.includes(".html")) {
          return "text/html";
        }
      })();

      return {
        fullPath,
        relativePath: fullPath.replace(nextjsDir, ""),
        format,
        contentType
      };
    });
  });

  const matches = await Promise.all(
    files.map(async file => {
      const results = await replace({
        files: path.join(arweaveDir, `${targetFile}.html`),
        from: file.relativePath,
        to: "",
        dry: true,
        countMatches: true
      });

      return {
        location: results[0].file,
        search: file.relativePath,
        numMatches: results[0].numMatches,
        file
      };
    })
  ).then(results => {
    return results.filter(
      result => result.numMatches > 0 && result.file.format === ".js"
    );
  });

  while (matches.length > 0) {
    const item = matches.pop();

    await replace({
      files: path.join(arweaveDir, `${targetFile}.html`),
      from: `<link rel="preload" href="${
        item.file.relativePath
      }" as="script"/>`,
      to: ""
    });

    const htmlFile = await readFile(
      path.join(arweaveDir, `${targetFile}.html`),
      {
        encoding: "utf8"
      }
    );
    const scriptFile = await readFile(item.file.fullPath, {
      encoding: "utf8"
    });

    await writeFile(
      path.join(finalDir, `${targetFile}.html`),
      `${htmlFile} <script>${scriptFile}</script>`,
      {
        encoding: "utf8"
      }
    );
  }
};

start();
