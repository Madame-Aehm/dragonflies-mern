# Project 4: Spike 8

# Deploy to Vercel

We've chosen Vercel as our preferred deployment platform as it's one of the last places online where you can deploy a backend project for free. It's up to you if you want to deploy both parts on the same platform, or you could use a different service like Netlify for your front-end. 

First step: get rid of all errors and warnings. Even something as small as an unused variable can cause a problem with your build. No red!

We'll also need to add a `vercel.json` file to the root of each project. This where we set the [configuration settings](https://vercel.com/docs/concepts/projects/project-configuration). 

To use Vercel, you'll need an account. We'll actually be deploying **two** projects - your client and your server will be deployed separately. From your overview, click **Add New...** to add a new project.

## Deploy Back-End

Add the `vercel.json`:

<!-- ```json
// js
{
  "builds": [{
    "src": "./index.js",
    "use": "@vercel/node"
  }],
  "routes": [{
    "src": "/[^.]+",
    "dest": "/",
    "status": 200
  }]
}
``` -->

```json
{
    "builds": [
        {
            "src": "dist/index.js",
            "use": "@vercel/node",
            "config": { "includeFiles": ["dist/**"] }
        }
    ],
    "routes": [
        {
            "src": "/(.*)",
            "dest": "dist/index.js"
        }
    ]
}
```

We will need to compile the TypeScript into a JavaScript build folder for Vercel to accept it. Edit your `package.json` to include the following scripts:

```json
{
    "scripts": {
        "build": "tsc",
        "start": "node dist/index.js"
    }
}
```

Now run your build script from the terminal: `npm run build`.

It should generate a `dist` folder, with your code transpiled into JavaScript. You will need to remove "dist" from your `.gitignore` so that it can be pushed to GitHub.

We'll import from a GitHub repository, so add, commit and push all your changes to GitHub. From Vercel, create a new project and select your repo, then under **Configure Project**, our first step will be to change the **Root Directory** to your `server`.

Underneath, there will be a dropdown for us to enter our **Environmental Variables**. Copy and paste your entire `.env` file into these inputs (you can actually paste the entire file, and Vercel will separate the keys from the values).

**Deploy**!! The build can sometimes take a few minutes. 

If everything goes according to plan, you can now visit your API endpoints and interact with them the same as if you were running it locally on localhost. 

You can continue working on your project, and when you are ready to see new changes applied, rerun the build script and push the changes. Vercel is watching your repo - any new commits to the main branch will trigger an automatic redeploy.

## Deploy Front-End

Add the `vercel.json`, then add, commit, and push to GitHub:

```json
{
  "routes": [{
    "src": "/[^.]+",
    "dest": "/",
    "status": 200
  }]
}
```

Now let's look at the front-end. Go back to the main overview, and click **Add New...** again to add another project. Select your project, but this time set the **Root Directory** to your `client`.

We're going to have to add our `.env` file again, but here's where we'll need to edit variable defining the base URL of our back-end. It will no longer be `http://localhost:5000/`, but instead the root URL of your newly deployed server project! 

**Deploy**!! And hopefully, your app is now fully online! Since we have it linked to the remote GitHub repository, any changes pushed to the branch you've deployed will trigger a rebuild of the vercel deployment, and you new changes should be live within a few minutes.

Once your front-end is deployed, if you are interested, you can add configuration options to [cors](https://www.npmjs.com/package/cors?activeTab=readme) to limit your server to only accept requests from your own front-end.

<!-- # Deploy to Render

An alternative to Vercel is [**Render**](https://render.com/) - you'll need to create an account. Just like with Vercel, we'll be deploying our front-end and our back-end separately.

## Deploy Back-End

Click **New +** to create a new project, and select **Web Service**. From here, **Build and deploy from a Git repository**. Select your remote repo and **Connect**.

You'll have make some specifications:
  - **Name** for your project. You'll want to specify somewhere in the name that this is the server, eg. `my-project-server`. 
  - **Region** you should probably select (Frankfurt(EU Central)), unless you expect your app to receive more traffic from another region.
  - **Branch** will be the Git branch you wish to deploy, most likely main or master. 
  - **Root Directory** will need to be changed to the name of your back-end folder, ie `server`. We are deploying the sub-folders of our project separately.
  - **Runtime** should stay as Node.
  - **Build Command** for our back-end will be `npm install`. This is so Render can read our `package.json` and install all the dependencies.
  - **Start Command** will probably be `npm start`. This is the script used to run _just_ your server (not the concurrently script that runs both).

Scroll down, and under **Advanced** you can add your environment variables. You'll have to do this one at a time.

**Create Web Service**! If everything goes according to plan, this should deploy your API. You can now visit endpoints and interact with it the same as if you were running it locally on localhost, just using the new deployed URL. 

## Deploy Front-End

Click **New +** to create a new project, select **Static Site**, then select your remote repo and **Connect**. 

Again, you'll have make some specifications:
  - **Name** for your project. You'll want to specify somewhere in the name that this is the client, eg. `my-project-client`. 
  - **Branch** will be the Git branch you wish to deploy, most likely main or master.
  - **Root Directory** will need to be changed to the name of your front-end folder, ie `client`. We are deploying the sub-folders of our project separately.
  - **Build Command** for our front-end will be `npm run build`. This is the build command specified by the Vite boilerplate.
  - **Publish directory** will be `dist`. This is the name of the folder generated by the build command (you can check what it's called by running `npm run build` from your terminal).

Scroll down, and under **Advanced** you can add your environmental variables. If you used an environmental variable to track the baseURL of your back-end, you'll need to change it to the URL of your deployed API. 

When deploying a single page application that utilizes React Router, an extra step needs to be taken to insure the hosting service knows what to do when you refresh on a page other than the landing page. The usual behavior of a website when you refresh, is to check the URL and then make a request for the `.html` file that should be hosted at that path. However, for a single page application built with a framework like React, there is only **one** `.html` file, so we need to tell the hosting service to always go to the `index.html`, then JavaScript will do the rest!

On Render, you can do this under **Redirects/Rewrites**. We have to write a [rule](https://docs.render.com/deploy-create-react-app#using-client-side-routing) for Client-Side Routing. They have some good [documentation](https://render.com/docs/redirects-rewrites) on how to define these rules. We are just going to add one **Rewrite**, where the **Source** will be `/*` and the **Destination** will be `/index.html`. 

**Create Static Site**!  -->

# PWA configuration

Now that it's deployed, we can look at making the app installable as a **Progressive Web App (PWA)**. A PWA provides a user with an app-like experience, even though the app is really just a website running in a web browser. We do this by adding a `manifest.json` which gives the browser [instructions](https://web.dev/add-manifest/) on how the app should behave when installed on the device. 

There are still many limitations to this functionality, since browsers and operating systems are never in full agreement. Making your app installable across all browsers and devices will involve lots of options, so today I will only demonstrate how to configure a `manifest.json` that will install an app on an Android device running Chrome. This is mostly because this is my own set up and so testing is easy! Feel free to adapt the code to your own needs, and if you get it working across other operating systems and browsers, please share your process! 🙏

Since we used **Vite** to build our app, I've followed the [documentation](https://vite-pwa-org.netlify.app/) provided by Vite to make their apps installable, and they happen to have a handy package to make it simpler for us! Install with `-d`, since we want this package to run in development.

```
npm install -d vite-plugin-pwa
```

On our `vite.config.ts` (or `.js` if you haven't used Typescript), we will import `VitePWA` from this package, and call it in the `plugins` array. We'll also create a **manifest object** to pass as an argument to this function (the TS Type for this is also included in the pwa plugin package). This will include all the properties we want on our `manifest.json` that we are going to let the plugin generate for us on build. 

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA, VitePWAOptions } from 'vite-plugin-pwa'

const manifestForPlugIn: Partial<VitePWAOptions> = {
  registerType: "autoUpdate",
  manifest:{
    name:"Petrol Raccoons MERN Spikes App",
    short_name:"PR MERN",
    description:"This app was created during live demos of MERN stack technologies.",
    icons:[
    {
      src: 'assets/maskable_icon_x512.png',
      sizes:'512x512',
      type:'image/png',
      purpose:'any maskable'
    },
    {
      src:'assets/maskable_icon_x192.png',
      sizes:'192x192',
      type:'image/png',
      purpose:'any maskable'
    }
  ],
  theme_color:'#171717',
  background_color:'#000000',
  display:"standalone",
  scope:'/',
  start_url:"/",
  orientation:'portrait'
  }
}

export default defineConfig({
  plugins: [react(), VitePWA(manifestForPlugIn)],
})
```

A manifest **must** include at least a `name` and `short_name`, which be the titles shown under the icon on the home screen, and in the longer title shown at the top of the app window. It will also need an icons for at least `512px` and `192px`. Icons should be saved in the `public` folder of your app. You can use a service like [this](https://maskable.app/editor)

Feel free to look through all the additional [properties](https://web.dev/add-manifest/#manifest-properties) and customize them for your app! 

Once you're satisfied with the shape of this object, we can run `npm run build` from the `client` to create a local build folder to inspect what the plugin will generate for us. Make sure the `index.html` in the `build` folder has a link to the generated `manifest` file:

```html
<link rel="manifest" href="manifest.webmanifest">
```

Once we push these changes to GitHub, and give Vercel some time to build and redeploy, we can test it on a mobile device! 