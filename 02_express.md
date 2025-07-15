# Project 4: Spike 2

## Express Server

Let's take the first steps to start building our API! We can follow the **Express** [documentation](https://expressjs.com/en/starter/basic-routing.html) to make our first test request from our index:

```js
app.get('/', (req, res) => {
  res.send('Hello World!')
})
```

This is when you're going to start using [Postman](https://www.postman.com/downloads/) a _lot_. If you haven't already, you should download it for this project - the desktop version runs much better. We'll use it now to test our first endpoint! If I change the **path**, then I must send the request to that new end-point to receive the response. If I change the **method**, my request method must also match.

Since this project is going to be quite large, we're going to separate it into different folders. Create a folder now to hold all our **routes**, and a `.js` file inside for 'user', or 'userRoutes'. This is where we're going to define all the end-points that will affect the documents held in our 'users' collection over on MongoDB.

In our `userRoutes` file we're going to use Express' [**express.Router**](https://expressjs.com/en/guide/routing.html). According to the documentation: this creates a modular, mountable route handler. A **Router Instance** is a complete middleware and routing system; for this reason, it is often referred to as a “mini-app”. 

Use this Router Instance to set up a test 'get' route. Make sure to also export the router instance: 

```js
import express from 'express'

const userRouter = express.Router();

userRouter.get("/test", (req, res) => {
  res.send('testing route....')
})

export default userRouter
```

Import the router instance into the index.js, and have the app **use** it. Here we will define the _base_ endpoint for this router. I recommend defining your base endpoints with '/api/', as this is necessary to deploy on Vercel:

```js
import userRouter from './routes/users.js'

app.use('/api/users', userRouter);
```

Now let's use Postman to test it! Our endpoint is going to be 'localhost:5000/api/users/test'. If we've set it all up correctly, we should get a response of 'testing route....'! Take note of where you're putting your **/** symbols. In a similar way to React Router, [a **catch-all** endpoint](https://expressjs.com/en/guide/migrating-5.html#path-syntax) will communicate that this route has no functionality:

```js
app.use('/*splat', (req, res) => res.status(404).json({ error: "Endpoint not found." }));
```

Since some of the callback functions for our routes will get quite long, a good practice is to collect them all in a **controller** file. I'm going to create a folder **controllers**, and inside I'll create a file for 'user', or 'userController'. Here I will write and export my express functions, then import them into my routes file. I'll demonstrate this with the test route function, even though it is only very small. **Note** the difference between a **regular export**, and a **default export**. 

## CRUD & Connecting MongoDB

**CRUD** = **Create**, **Read**, **Update**, and **Delete**. These are the four basic database functions.

It's time to actually connect our project to our MongoDB database. From MongoDB, on the Database Deployments page, click the button to **Connect**, then **Connect your application**. There's a string here that we're going to copy, but these details need to stay private. So let's set up an **.env** file to hold them.

Install the [**dotenv**](https://www.freecodecamp.org/news/how-to-use-node-environment-variables-with-a-dotenv-file-for-node-js-and-npm/) package from npm, then paste this into the index:

```js
import 'dotenv/config'
```

Create a new file at the root of the `server` called `.env`. This will hold all our environment variables. **Make sure to add it to the .gitignore!!**

`.env` files save data in the format: VARIABLE_NAME=value. Strings don't need quotation marks. To access this variable, use **process.env.VARIABLE_NAME**. We're going to save the URI string from MongoDB as a variable:

```js
MONGO_URI=mongodb+srv:...
```

If you've forgotten the password, you can reset it in **Database Access** under **Security**. If you reset it, be aware it might take a few minutes before it updates and access is given. We also need to add our database to the options, copy the database name and paste it after the '.net/', but before '?retry'.

We're going to be connecting to MongoDB _through_ an **Object Data Modelling (ODM)** library called [**Mongoose**](https://mongoosejs.com/docs/index.html). You'll have to install the mongoose npm package, then we'll set it up in our index using the credentials saved in our `.env` file. We only want our app to start listening when a connection to MongoDB has been established. Since it's an asynchronous process, we'll move **app.listen()** down into the **.then()** block of the mongoose connection.

```js
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(port, () => {
      console.log("Connection to MongoDB established, and server is running on port " + port);
    });
  })
  .catch((err) => console.log(err));
```

One of the reasons we're using Mongoose on top of MongoDB is because it offers us the opportunity to create **Models** of our data, essentially locking the form it can take with a **Schema**, like TypeScript for our database! You set the shape of your data object, and Mongoose makes sure any attempts to add or update data conform to the defined shape. In most cases, Mongoose will also [automatically infer the TypeScript Type](https://mongoosejs.com/docs/typescript.html) from this definition. Since we'll need a Model for every collection, we'll make another folder in our server for **models**, and a file for 'user', or 'userModel'.

On the `userModel.js` file, import mongoose from 'mongoose'. This variable has a property **Schema**, which we can use to create a **new** Schema, and define the shape of our user object:

```js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  username: String,
  password: { type: String, required: true }
}, { timestamps: true })
```

There is huge potential for creating incredibly complex and specific Schemas. For more info, have a read of the [docs](https://mongoosejs.com/docs/guide.html).

Let's create a collection for 'users' on MongoDB and then manually add some documents. Make sure each document conforms to the Schema, and be very careful not to make any typos. Remember that your collection should have a **lower-case**, **plural** name.

Back on our `userModel.js` file, using another property on the mongoose variable we will create a **Model**. Mongoose [best-practise](https://samwize.com/2014/03/07/what-mongoose-never-explain-to-you-on-case-sentivity/) is to name your Modal with the **capitalized**, **singular** version of your collection name. Then link it to the collection using the **lower-case**, **singular** version of your collection name. Make sure to export it:

```js
export const UserModel = mongoose.model("user", userSchema);
```

We can use this Model to access the collection. This is allowed because we've configured Mongoose on our index.js with the variables in our `.env` file. Back over on our `userControllers.js` file, we can write a new function to `.find()` all the documents (this is a Mongoose function!) and return a `.status(200)` response as a `.json()`. Export this, then use it in the callback for a new route on `userRoutes.js`:

```js
// routes
import { getUsers } from '../controllers/userController.js';

userRouter.get("/all", getUsers);
```

```js
// controller
export const getUsers = async (req, res) => {
  try {
    const allUsers = await UserModel.find();
    res.status(200).json(allUsers);
  } catch (e) {
    console.log(e);
  }
}
```

Once you're getting a positive response through Postman, you can try writing the fetch request in React. Typescript is going to want to know the shape of the object we'll be receiving from our fetch. We can create an `interface` for a User, and a `Type` for the array of Users we expect to receive. If we think we're going to be using them in more than just this file (likely), we can save these Types in a file in our `@types` folder:

```ts
interface User {
  _id: string,
  email: string,
  password: string,
  username: string
}

type Users = User[]
```

We will need to create a state to hold the result of our fetch. Since we know it will always be an array, we can initialize it as an empty array, but set the Type to be the `Users` type we created. We will then write a fetch request like usual, and call it in a `useEffect()`. Rather than hardcoding the localhost URL, it's a good idea to create an `.env` file to hold the **base URL** of our server. For development, this is going to be the local host port. Later though, it will change to the domain we deploy it to. If we don't set this environmental variable now, we'll have to manually change all our fetch requests went we deploy. 

But what if we want to make more specific [find](https://mongoosejs.com/docs/api/model.html#Model.find()) requests? Let's make an endpoint with parameters! Since for now our database only holds users, we'll try to find a specific user by their email. Since we've set this property to be unique in our database, we can use Mongoose's `findOne()` method. If we searched by a property that could return multiple results, this method will return the _first_ document matching our filter. Alternatively, you could use `findById()`, or simply `find({ detail: value })` which will return an array of all documents matching the filter. **note** that these matches will be subject to case-sensitivity unless you specify otherwise!

In our `userController.js`, write a function to getUserByEmail. First I'm just going to demonstrate how parameters can be accessed on the **req** object:

```js
// routes
userRouter.get("/email/:email", getUserByEmail);
```

```js
// controller
const getUserByEmail = async(req, res) => {
  console.log("params", req.params);
}
```

We can now use this variable to set a filter in the `findOne()` method:

```js
const getUserByEmail = async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.params.email });
    if (user) {
      res.status(200).json({
        _id: user._id,
        email: user.email,
        username: user.username
      })
    } else {
      res.status(404).json({ error: "No user found" })
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: e });
  }
}
```

Returning a [status code](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status) will help with error handling from your front-end. Here are some codes you can return in different scenarios:

![status_codes1](status_codes1.png)
![status_codes2](status_codes2.png)
![status_codes3](status_codes3.png)

Validating on the server-side _as well_ as validating on the client side is very important. Just in case any mistakes slip through, you want to avoid sending pointless requests any further. There are some simple validation checks you can perform, such as checking that all required fields exist, emails and passwords are correctly formatted. To assist you with this, have a look at [**Express Validator**](https://express-validator.github.io/docs/). Sending back custom error messages is fine, but make sure to keep them consistently formatted. 

**GET** method API requests are only ever to **read** data. If you want to read ahead about **adding**, **updating** or **deleting** data, have a look at [querying](https://mongoosejs.com/docs/models.html#querying) and [documents](https://mongoosejs.com/docs/documents.html) (Mongoose documentation), [request methods](https://en.wikipedia.org/wiki/HTTP#Request_methods), and [routing](https://expressjs.com/en/guide/routing.html) (Express documentation).