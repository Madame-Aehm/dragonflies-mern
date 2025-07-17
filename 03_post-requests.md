# Project 4: Spike 3

## POST requests

So far we've been adding all our data manually, then using **get** requests to **read** that data. Let's look at a different type of request: **post**. A 'post' request can manipulate data in your database. In order to do this, you would usually need to send data to the server - in a post request, you can do this through the **body**. 

Let's **create** a new user. First, we'll write the back-end functions and test them with Postman. Once it works in Postman, we can use the sample code Postman provides to help us write a fetch function from our React front-end. Start by establishing a new endpoint, and a new function. This time, though, the method for our route will be 'post':

```js
router.post("/register", registerUser);
```

In the **registerUser** function, log `req.body` to the console. We can also have a look at the whole `req` object, though it is very big and complicated! The body property refers to data given into the function when the request is made. On Postman, there is a **body** subheading, this is where we add that data. The options we can choose from (for this project), will be **form-data**, **x-www-form-urlencoded**, or **raw**. Form-data will require a middleware, so avoid this one for now. If you want to use 'raw', make sure to select **JSON** format from the dropdown. 

Create an object that you would send through as a new user - make sure it follows the Schema defined for the collection. Build a new object in your function using those properties and save it as a new Model. Now you can use Mongoose's `.save()` method to save it to the collection linked to that Model. The save method returns the document:

```js
const createUser = async(req, res) => {
  const newUser = new UserModel({
    email: req.body.email,
    password: req.body.password,
    username: req.body.username
  });
  try {
    const result = await newUser.save();
    console.log(result);
    res.status(200).json(result);
  } catch(e) {
    console.log(e);
    res.status(500).send('Server error');
  }
}
```

It's also a good idea to do some validation. If `req.body` is missing any of the required fields, send back an error. `Error code 11000` is linked to attempting to duplicate a property set to be unique, so we can create a custom error message in this case:

```js
const registerUser = async(req, res) => {
  if (!req.body.email|| !req.body.password || !req.body.username) return res.status(406).json({ error: "Please fill out all fields" })
  const newUser = new User({ ...req.body });
  try {
    const result = await newUser.save();
    res.status(200).json(result)
  } catch(e) {
    console.log(e);
    e.code === 11000 ? res.status(406).json({ error: "That email is already registered" }) 
    : res.status(500).json({ error: "Unknown error occurred" });
  }
}
```

Once this is working we can create a form in React. A trick to keeping all your object changes to a single handleChange function, is to use [] around a property name to define it from a variable (in this case, the event.target.name), and the value from the event.target.value:

```js
  const handleChange = (e) => {
    setFormObject({
      ...formObject,
      [e.target.name]: e.target.value
    })
  }
```

Now that we've got an object to submit, let's look at Postman's sample code. On the very right-hand side, click on the **</>** button in the sidebar. We can copy and paste this code section by section and adapt it to our own project. We can use `response.ok` to check the status code coming from Express. If it's in the 200 range, it's a successful response. If it's not, we can expect one of our error messages:

```ts
response.ok ? alert("successfully registered!") : alert(result.error)
```

Put some signal after the fetch to communicate to your user if the registration was successful, then test it. We can then check our database to see if our new user is there. 

The same logic can be applied to update a user. I could set a route that receives an ID as params, then write a function that uses Mongoose's `findByIdAndUpdate()`:

```js
const updateUser = async(req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedUser);
  } catch(e) {
    console.log(e);
    res.status(500).send(e.message);
  }
}
```

## Password Encryption with Bcrypt

We're going to use a library called [**BCrypt**](https://www.npmjs.com/package/bcrypt) to help us encrypt passwords. This means that even though we can see the password property in our database, it will have been scrambled into an unrecognizable code, keeping our users' data safe and private, even from us! The first step is to install the package via npm.

Create a `.js` file for `bcrypt` in the folder for `utils`. We're going to write two main functions using the bcrypt library - one to **hash** the password into a code, and the other will be to **compare** the hashed password in our database to the un-hashed password entered by the user for authentication. 

The two steps to encrypt a password are to **1.** generate [**salt**](https://itecnote.com/tecnote/what-are-salt-rounds-and-how-are-salts-stored-in-bcrypt/) with `bcrypt.genSalt()`, which is then used to hash with `bcrypt.hash()`. BCrypt docs show how this can be done in one or two separate functions. We'll put it together in one function using async/await - make sure to export it so it can be used in your register function. You will then need to **2.** specify **salt rounds** - the more rounds, the higher the **cost factor**, and so the longer it will take to scramble and unscramble the data. The recommended default is 10:

```js
import bcrypt from "bcrypt";

export const encryptPassword = async(password) => {
  try {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword
  } catch(error) {
    console.log("Error: ", error);
  }
}
```

We now want to import and call this function on our password _before_ we send it to the database. Make sure to use **await**, since it is an asynchronous function!