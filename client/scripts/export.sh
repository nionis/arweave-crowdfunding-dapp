# clean
echo "Cleaning..";
rm -rf out
rm -rf out-arweave
mkdir out-arweave
rm -rf out-final
mkdir out-final

# build
echo "Building..";
ANALYZE=true npm run build

# export with next.js
echo "Exporting using next.js..";
npx next export

# package using arweave
echo "Packaging using arweave..";
arweave package ./out/index.html ./out-arweave/index.html

echo "Fixing package..";
node ./scripts/fix.js index