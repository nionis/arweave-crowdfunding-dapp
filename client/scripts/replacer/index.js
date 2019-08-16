const path = require("path");
const { promisify } = require("util");
const fs = require("fs");
const replace = require("replace-in-file");
const walk = require("./walk");
const arweave = require("./arweave");

const rootDir = path.join(__dirname, "..", "..");
const nextjsDir = path.join(rootDir, "out");
const arweaveDir = path.join(rootDir, "out-arweave");

const readFile = promisify(fs.readFile);

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

        console.warn(`content type ${format} not found`);
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
        files: path.join(arweaveDir, "*.html"),
        from: file.relativePath,
        to: "any",
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
    return results.filter(result => result.numMatches > 0);
  });

  const transactions = await Promise.all(
    matches.map(async match => {
      const fileContent = await readFile(match.file.fullPath, "utf8");
      return arweave.create(fileContent, match.file.contentType);
    })
  );

  const toReplace = matches.map((match, index) => ({
    ...match,
    transaction: transactions[index],
    hash: transactions[index].id,
    replace: `https://arweave.net/${transactions[index].id}${match.file.format}`
  }));

  while (toReplace.length > 0) {
    const item = toReplace.pop();

    console.log(item.hash, item.file.contentType, "uploading");
    await arweave.upload(item.transaction).then(res => {
      console.log(item.hash, res.statusText, res.data);
    });

    // console.log("replacing", item.search);
    // await replace({
    //   files: path.join(arweaveDir, "*.html"),
    //   from: item.search,
    //   to: item.replace
    // });
  }
};

start();
