# Project 4: Spike 6 (option 2)

## Authorization with custom JWT verification middleware

Now that our user has been authenticated and a token has been issued, we can write a [custom **middleware** function](https://expressjs.com/en/guide/using-middleware.html) to verify the validity of the token. 

Middleware is code that runs between the request being received and the response being sent. We've already configured some middleware to parse the incoming request body from raw `json` or `urlencoded` formats. We can add another small one to demonstrate how this works:

```ts
app.use((req, res, next) => {
    console.log(req.method, req.path);
    next();
})
```

Adding this to the app through `.use()` means it runs _before_ every request reaches our controller. Here, we are simply logging the request method (GET, POST, etc.) and the request path. The `next()` function sends the request to the next function in the chain. If some condition existed where we don't want to proceed, we can send a response instead.

We will write a function to be added before any of our endpoints that require authorization (i.e. "private" endpoints). We will extract the token from the request authorization headers and verify it. If the token is valid (i.e. issued by our server, and still within the expiration time), we will allow the request to proceed to the controller. 

```ts
export const jwtAuth = async(req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) {
        return res.status(400).json({ error: "no token" });
    }
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        console.log("check env");
        return res.status(500).json({ error: "no secret" });
    }
    try {
        const valid = jwt.verify(token, secret);
        console.log(valid);
        next()
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "reauth required" });
    }
}
```

Notice the `jwt.verify()` function returns the decoded token payload, including the user's id that we saved on the `sub` field. We can use it now to find the rest of the user document, then append that to the request object to be accessed by later controller functions.

```ts
const valid = jwt.verify(token, secret);
const user = await UserModel.findById(valid.sub);
req.user = user;
next()
```

If you are using TypeScript, the Request Type definition will need to be extended to include the user:

```ts
declare global {
    namespace Express {
        interface Request {
            user?: any // or custom user type 
        }
    }
}
```

One important use for it will be to get the current logged in user object from your `AuthContext`. Let's create a function to check whether there is a user. We'll first check whether there is already a token in the local storage. We can create a simple utility function that will return the token. If a token is returned, then we will make a fetch to the `users/me` endpoint to get the user linked to the token.
