# clean
echo "Cleaning..";
rm -rf out
rm -rf out-arweave
mkdir out-arweave
rm -rf out-final
mkdir out-final

# build
echo "Building..";
npm run build

# export with next.js
echo "Exporting using next.js..";
npx next export

# package using arweave
echo "Packaging using arweave..";
arweave package ./out/index.html ./out-arweave/index.html
arweave package ./out/create.html ./out-arweave/create.html
arweave package ./out/view.html ./out-arweave/view.html

echo "Fixing package..";
node ./scripts/fix/index.js index
node ./scripts/fix/index.js create
node ./scripts/fix/index.js view