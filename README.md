# Shopify App using SvelteKit

Warning: Expermimental code ahead

## Steps to follow

```shell
git clone https://github.com/unlocomqx/shopify-app-sveltekit my-app
# OR if you want to remove the repo git history
npx degit https://github.com/unlocomqx/shopify-app-sveltekit my-app 
# Then
cd my-app
npm install
# Switch to another folder
shopify app create # You can also create an app on partners.shopify.com
# This will create an app and will clone the react app which we don't need
# Back to the clone folder 
shopify app connect
# By now your .env file should be generated
shopify app serve
# Shopify serve will update the urls of your app and will use ngrok to make your local server visible to the outside
``` 

## Troubleshooting

If you encounter a 500 error, clear the browser cache and retry (it's a redirect cache issue)  
If you encounter a 403 error, make sure to clear the cookies then retry shopify serve again.  
If you encounter another issue, you can report
it [here](https://github.com/unlocomqx/shopify-app-sveltekit/issues)

## A better DX approach

Using `ngrok` can be slow and can give you a bad developer experience. Follow these instructions to
improve your DX.  
https://dev.to/unlocomqx/a-much-better-dx-for-shopify-apps-38ln
