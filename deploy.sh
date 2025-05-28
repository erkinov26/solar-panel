echo "Switching to branch main"
git checkout main
echo "Building app..."
npm run build
echo "Deploying files to server..."
scp -r build/* erkinovabbos/172.233.139.193/var/www/flexenergy/
echo "Deployment complete!"