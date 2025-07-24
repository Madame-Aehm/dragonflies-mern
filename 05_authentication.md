# Project 4: Spike 6

## Password Encryption

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

## Password Verification

We will need to use `bcrypt.compare()` to check whether a plain text and a hashed text are actually the same string:

```js
const verified = await bcrypt.compare(password, hashedPassword);
```

Now, we can write an endpoint and controller function to log in. The front-end will need to send an email and a password in the body of the request. In our controller function, we first need to find a user that matches the email - we can use Mongoose's `findOne()` method for this. If no user is found, then we can return an error. If a user _is_ found, we now want to **compare** the password from the user object in the database with the password sent by our front-end. Use the `verifyPassword()` function we created to do this. If the result is `false`, then we send back an error. If it's `true`, then the user identity has been verified and we can send back a positive response. Later, we'll be sending back an authorization token, but for now, this can be just an object that holds the user data:

```js
const login = async(req, res) => {
  try {
    const existingUser = await User.findOne({ email: req.body.email });
    if (!existingUser) {
      return res.status(404).json({ error: "no user found" })
    }
    if (existingUser) {
      const verified = await bcrypt.compare(req.body.password, existingUser.password);
      if (!verified) {
        return res.status(406).json({ error: "password doesn't match" })
      }
      user.set("password", undefined);
      res.status(200).json({
        verified: true,
        user
      })
      
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "something went wrong.." })
  }
}
```

In React, we can create a new component or page for our login interface. Since the functionality will be linked to a user, it's best to create a Context to hold the user state and functions linked to the user state.

## Authentication

When you log into a website, your credentials are being used to **authenticate** your identity. The log-in process is the authentication process. Once a user's identity is confirmed, they are granted **authorized** access to certain data. This authenticated status is saved as a [**token**](https://www.okta.com/identity-101/what-is-token-based-authentication/).

Think of a **token** like a wristband at a music festival - once your ticket validity is confirmed, you're given a wristband. Depending on your ticket price, your wristband gives you access to parts of the festival. A VIP wristband gets access to more places than a regular wristband, a staff or backstage wristband will be able to get through into other places restricted to the public. A wristband that's been damaged, tampered with, or expired will be rejected.

### JWT - JSON Web Token

The **auth token** that we're going to be using is an open standard: the [**JSON Web Token (JWT)**](https://auth0.com/learn/json-web-tokens).

The [**debugger**](https://jwt.io/) on JWT official docs can show us how it's built: a Header, a Payload, and a Signature. The JSON-formatted data fields are hashed into a code which makes up the token itself. If we make any changes to any of these fields, you'll notice the token change.

The **Header** will contain metadata to determine the **token type** (in our case `typ: "JWT"`) and the [**signing algorithm**](https://auth0.com/blog/json-web-token-signing-algorithms-overview/) (in our case `alg: "HS256"`, which is the default).

The **Payload** is the body of the token, this is where the actual data used to identify the user will be stored. The properties in this section are known as **claims**, and while you can put any data you like in here, there are some [claim conventions](https://www.iana.org/assignments/jwt/jwt.xhtml):
  - **iss** = issuer (ie. your App)
  - **sub** = subject (ie. user id)
  - **iat** = issued at (ie. the time the token was created, measured in Unix time, generated automatically unless otherwise specified)
  - **exp** = expiration (ie. the time the token will expire, measured in Unix time)

The **Signature** is both the Header and Payload [**Base64Url encoded**](https://bunny.net/academy/http/what-is-base64-encoding-and-decoding/), plus our **secret key** (which we will define later), hashed using the algorithm defined in our Header. 

To start working with JWT, we first have to install the package. In the [libraries](https://jwt.io/libraries) we want to find and install the package compatible with Node.js. Then create a `.js` file in `utils` for **jwt**. It's extremely important to keep the secret key private, so I'll put this into the `.env` file.

```
JWT_SECRET=this-is-my-secret-key
```

This [documentation](https://github.com/auth0/node-jsonwebtoken) will guide us through the rules for signing the token. Let's write a function that recieves the user object as parameters. We'll define the payload, and we also have the choice to include some **options**. Many of the options overlap with the information that can be saved as claims in the payload, such as the token expiration. Either is fine, **just make sure not to use both!!** (For expiration, for example, you might choose to add an option rather than a claim because the option will accept a string, while the claim needs unix time.) We will then pass all of this, plus our secret key from our `.env`, into the `jwt.sign()` method from the documentation, and return the result:

```js
import jwt from "jsonwebtoken";
import 'dotenv/config'

export const generateToken = (_id, email) => {
  const payload = {
    sub: _id,
    email: email
  }
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" })
  return token
}
```

This function can be exported and imported into our `usersController.js` to be used by our `logIn()` function. Once we've found a user and verified their password, we will generate a token:

```js
if (verified) {
  const token = generateToken(existingUser._id.toString(), existingUser.email);
  res.status(200).json({ 
    verified: true,
    token: token,
    user
  })
}
```

Once you're getting back through Postman exactly what you want, write a fetch request from your React app. **Make sure not to return the password (even hashed) to your front-end!!**

We will save the token in the Browser Window's **Local Storage**. [Local storage](https://www.w3schools.com/jsref/prop_win_localstorage.asp) refers to how a web application can store data locally. It's similar to a **web cookie**, except that it can only be read by the browser, making it more secure. The storage capacity for local storage is also much higher than for cookies.

Local storage accepts data as **key/value pairs**. Values saved to Local Storage must be **strings** - if you need to stringify a JavaScript variable, use the `JSON.stringify()` method. To **store** something in the Local Storage, use the method `localStorage.setItem()`. This will accept two arguments: the key, and the stringified value:

```js
localStorage.setItem("token", result.token);
```

To view the local storage in the browser, open the inspector tool and click on **Application**. You can then view all items saved in the local storage for your app. Write a function to check whether a token exists and call it in a useEffect from your AuthContext. We can access items in the local storage with the method `localStorage.getItem()`. Tomorrow we'll cover how to use the token to return the authenticated user object, but for now, if a token exists, set the user object state:

```js
const checkForToken = () => {
  const token = localStorage.getItem("token");
  if (token) {
    setUser(true) 
  }
}
```

A log out function would need to set the user state back to `false` or `null`, but we'll also need to remove the token from local storage:

```js
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  }
```

Tomorrow, we're going to use the token to create a function like the `onAuthStateChanged()` function from Firebase Authentication. Once an authorized status is confirmed, we will attach the token to the Header of all fetch requests being made to routes requiring authorization. If you want to read ahead, you can look up **Bearer Tokens** and [**Passport Strategies**](https://www.passportjs.org/), specifically [JWT Passport Strategy](https://www.passportjs.org/packages/passport-jwt/).