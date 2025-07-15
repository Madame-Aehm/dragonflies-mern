# Project 4: Spike 1

## Project Kick Off

[Kick Off Presentation](https://lms.codeacademyberlin.com/content/web/Module-2/Project-1/Sprint-1)

## MERN stack: MongoDB - Express - React - Node

**Node.js** is an environment that can run JavaScript outside a browser. This means the developer can continue to write in JavaScript, even for back-end programming. [This](https://kinsta.com/knowledgebase/what-is-node-js/) page gives a good summary.

**Express.js** is a framework designed to build APIs. On it's own, Node.js does not know how to perform serving files, handling requests, and handling HTTP methods, so this is where Express.js comes in. Express is to Node, as React is to JavaScript! [This](https://kinsta.com/knowledgebase/what-is-express-js/) page gives a good summary.

**MongoDB** is a NoSQL document database, it stores data in JSON-like documents. We will use it to hold the data we previously saved in Firebase. 

## Project Structure

It's important to understand that our front-end and back-end are actually separate projects, and will eventually be deployed separately. They will communicate _only_ through HTTP requests. For development, however, it is common practice to create a **monorepo** which will hold both projects in a single Git repository. 

We're still going to use React for our front-end. From the root folder, boilerplate a react app and call it 'client', or 'front-end'. In the same root project folder, also create another folder called 'server', or 'back-end'. Initialize a new Git repository from the root folder.

Git is now tracking the project from the root level. Create a `.gitignore`, add `.env`, as well as the line `node_modules/`, which will ignore all sub-folders of `node_modules`, since we will have them in both our `client` and `server`. 

## MongoDB Setup

Create a MongoDB account. We'll then be following the steps from MongoDB's [getting started](https://www.mongodb.com/docs/atlas/getting-started/) documentation.

Build a database - make sure you select **FREE**. If you have a preferred provider, you can select them, and then select **Frankfurt (eu-central-1)** for the region, since this is the closest to our location. You can also rename your **cluster**. Read more about clusters [here](https://www.mongodb.com/basics/clusters).

Enter a username and password to gain access to your database. In the left-hand menu under Network Access (under Security), click on the button to **+ADD IP ADDRESS**, then click to 'allow access from anywhere'. If you now click on **Browse Collections**, this is where your data will be stored. Click on **Add My Own Data** to create a **Database**, and a **Collection**. Later, we're going to be using **Mongoose** which uses specific naming rules to find data, so make sure you give your collections **lower-case, plural** names.

If this becomes an issue for you, there are ways [around it](https://stackoverflow.com/questions/10547118/why-does-mongoose-always-add-an-s-to-the-end-of-my-collection-name)

## Node.js Server Setup

If you're using Typescript, you'll also want to start by initializing a `tsconfig.json`. From a terminal in the server folder, you can run the script `npx tsc --init` to create a template, and uncomment the lines you wish to use in the configuration. Or, for a simple pre-configuration, use this:

```json
{
  "compilerOptions": {
    "target": "es6",
    "module": "commonjs",
    "outDir": "./dist",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["**/*.ts", "index.ts"],
  "exclude": ["node_modules"]
}
```

Create a file called `index.ts`, and let's look at how we will be running this code. Put a simple console log, and start by running `node index.ts` to see your message. Instead of running the code in a browser, Node will run your JavaScript code through the terminal. 

Next, we want to initialize a `package.json` file. We do this by opening a terminal, make sure you're in your 'server' folder, and run:

```shell
npm init -y
```

Add a script to start the development server on the `package.json`:

```json
  "scripts": {
    "dev": "node index.ts"
  },
```

Now you can run `npm run dev` from the server terminal, and your code will run! 

However, if you make a change, you will need to **rerun** your script to see those changes apply. A very convenient development tool is [**Nodemon**](https://www.npmjs.com/package/nodemon), which will watch your files for changes and automatically rerun your code when changes are detected. For TypeScript, it might also be necessary to install [`ts-node`](https://nodejs.org/en/learn/typescript/run) if you're using a [Node version less than 23.6.0](https://nodejs.org/en/learn/typescript/run-natively). Install the packages as development dependencies only:

```shell
npm install -D nodemon ts-node
```

Now change your "dev" script to be `nodemon index.ts`, and run it from the terminal. When you make a change, Nodemon will rerun the code and you should see your updated message. To exit the active development server, use <kbd>Ctrl</kbd> + <kbd>c</kbd>

You will need to install more dependencies. Run the following to install [**Express**](https://expressjs.com/en/starter/installing.html), [**Cors**](https://expressjs.com/en/resources/middleware/cors.html), and [**Dotenv**](https://www.npmjs.com/package/dotenv):

```shell
npm install express cors dotenv
```

You'll notice you now have a `node_modules` folder, a `package-lock.json`, and your `package.json` will have a list of dependencies. These are packages necessary for our project to run, and will be read and installed by the deployment platform when we reach that stage.

## index.ts

Copy and paste the code from the LMS:

```js
import express from "express";
const app = express();
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log("Server is running on http://localhost:" + port);
});
```

If you are using TypeScript, you will probably notice there are already errors. This is due to the installed dependencies not having included Types, as these packages have existing in plain JavaScript since before TypeScript even existed. Thankfully, a community project called **DefinitelyTyped** have worked to create installable declaration files for many JavaScript-only packages. 

You'll need to install the separate Types packages for both Express and Cors as development dependencies:

```shell
npm install -D @types/express @types/cors
```

Next, use the middlewares **express.json** and **express.urlencoded** which help Express to read the requests, and enable CORS. Make sure the app knows to **use** them _before_ it starts **listening**:

```js
import cors from "cors";

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(cors());
```

A non-essential package you can install is [**concurrently**](https://www.npmjs.com/package/concurrently). This will let you launch both back-end server and React server with just one script. Otherwise, you'll need to have two terminals open - one for each. You can adapt the following script to whatever you find most convenient:

```js
"scripts": {
  "start": "concurrently \"nodemon index.ts\" \"cd ../client && npm run dev\""
}
```