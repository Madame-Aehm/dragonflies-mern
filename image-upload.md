# Project 5: Spike 7

# Image Upload

## Middleware

[Middleware](https://expressjs.com/en/guide/using-middleware.html) refers to functions that can be placed _between_ your routes and your controller functions. 

We're going to create a middleware function using [Multer](https://github.com/expressjs/multer#readme), a Node.js library for handling file uploads. Run `npm install multer`, if you are using TypeScript, also run `npm install -D @types/multer`.

The first step will be to set where the file is going to go. As an example, follow the basic middleware example from the [Express documentation](https://expressjs.com/en/resources/middleware/multer.html). You'll also need to create an empty folder called `uploads` to catch the files:

```ts
import multer from "multer";

const upload = multer({ dest: 'uploads/' })
```

Create an endpoint to test the file upload, and add the middleware:

```ts
userRouter.post("/image", upload.single("image"), (req, res) => {
  console.log(req.file);
  res.send("testing image upload");
})
```

Multer will look for files in the field specified. To upload multiple files at once, use `upload.array()` and then append all files to the same fieldname. Multer will add a single file to the request object as `file`, or multiple files as `files` Notice how it is uploading the file to the folder specified, but it is renaming the file to ensure it is unique, and omitting the file extension. 

### Customizing Multer

Eventually we will be sending this file to a cloud image bucket, so the next few steps are just to demonstrate some further functionality of Multer and Express. Specify a filename: it is important the filename be unique, or it would be overwritten when a file of the same name is uploaded. 

**Tip:** if this middleware comes _after_ an authentication middleware, the user _id will be accessible in the request. A common practice is to use the datetime constructor to get a unique date string. The `path` import is a [module](https://nodejs.org/api/path.html) directly from Node.js. It allows us to inspect the full pathname of a file, but it also lets us isolate the file extension:

```ts
import multer from "multer"
import path from "path"

export const upload = multer({
    storage: multer.diskStorage({
        destination: "uploads/",
        filename: function(req, file, cb) {
            const fileExt = path.extname(file.originalname);
            let filename = req.user._id + "-" + Date.now() + fileExt;
            return cb(null, filename)
        }
    })
})
```

In some cases, this would be enough. You could use Express to serve the static files directly from your server, and send that string to the database:

```ts
app.use("/images", express.static("uploads"));

// http://localhost:5000/images/filename.png
```

Unfortunately, the free deployment options for Express are limited, and we recommend using Vercel, which utilizes serverless functions. This means no memory is held, and the code can't actually modify the file system. So, our server will be send the file to a cloud image hosting service called Cloudinary.

This will also mean we can't store even the temporary files on the server, so we will still use `multer.diskStorage({})`, but leave the `destination` undefined. Multer will then default to the temporary storage on the user's device (for Windows, this will be `C:/Users/User/AppData/Local/Temp`). You'll be able to see it on the `path` field of `req.file`. 

We should also add some file validation, to make sure we are only uploading files of the correct file type. You could also consider limiting the file size:

```ts
import multer from "multer"
import path from "path"

export const upload = multer({
    storage: multer.diskStorage({
        filename: function(req, file, cb) {
            const fileExt = path.extname(file.originalname);
            let filename = req.user._id + "-" + Date.now() + fileExt;
            return cb(null, filename)
        }
    }),
    fileFilter: (req, file, cb) => {
      const fileExt = path.extname(file.originalname);
      if (fileExt !== ".jpg" && fileExt !== ".jpeg" && fileExt !== ".png") {
        cb(new Error("File extension not supported"), false);
        return;
      }
      cb(null, true);
    },
})
```

## Cloudinary

We're not going to be saving any actual images on MongoDB. Instead we will be saving them on the cloud-based image and video management service, [**Cloudinary**](https://cloudinary.com/documentation/how_to_integrate_cloudinary), then just saving a URL reference in MongoDB. To make the upload process easier and safer, we'll also use a middleware called [**Multer**](https://www.npmjs.com/package/multer). Install both packages via npm.

Start by creating a free account on Cloudinary. Under **Media Library**, you can create folders and manually add or delete files. Start by creating a folder for your user images: 'profile_pics' or 'user_avatars', whatever you like. Upload a sample image. 

Install Cloudinary via npm: `npm install cloudinary`.

On your Dashboard, you'll be able to see the **Cloud Name**, your **API Key**, and your **API Secret**. We'll save these variables in our `.env` file. Then create a folder in your server called `config`, to hold configuration files. This is just to save space on our `index.js`. In a file for `cloudinary`, copy and paste the config code snippet from the 'getting started' page in Cloudinary docs. Make sure to replace each of the variables for your `process.env` variables. Export this as a function, which we will call on the `index.js` together with the middlewares. 

```js
import { v2 as cloudinary } from 'cloudinary';
import "dotenv/config";

const configureCloudinary = () => {
  cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_APIKEY,
    api_secret: process.env.CLOUD_SECRET
  });
}

export default configureCloudinary
```

We'll also need to update our user Schema to include a property for our image. The value will be a `String` URL linking to the image that we will already have uploaded to Cloudinary. This is a good opportunity to demonstrate the [default property](https://mongoosejs.com/docs/defaults.html), which I'll set to the URL of the sample image I already uploaded. If this property isn't included on the user object, or the value is set to **undefined**, then the default will be applied. Any other value (including **null** or an empty string) will still be stored in the database - so be sure to pay attention if you choose to follow this logic.

## Custom Upload Function

Now we need to write a function to upload that file to Cloudinary! In a folder called `utils`, create a file for `image-management`. Follow the [Cloudinary documentation](https://cloudinary.com/documentation/upload_images#quick_examples) to upload a file:

```js
import { v2 as cloudinary } from "cloudinary";

export const imageUpload = async(file, folder) => {
  try {
    const result = await cloudinary.uploader.upload(file.path, { folder: folder });
    console.log(result);
    return result.secure_url;
  } catch(e) {
    console.log(e);
  }
}
```

Pass the file from Multer, and a string indicating the folder path, into the function. It will return quite a JSON object with many properties, log the result to the console to look at it. In Postman, for any POST request that includes files, we need to use **Form Data**. 

**Note:** if you are sending a file as well as other fields in the request body, make sure the image files are appended **last**. 

If you are asking your user to upload a file for their profile when they register, add the Multer middleware to the endpoint, and your controller function will then look something like:

```js
const createUser = async(req, res) => {
  // validation
  if (!req.body.email || !req.body.password || !req.body.username) {
    return res.status(406).json({ error: "Please fill out all fields" });
  }
  try {
    // create base user
    const newUser = new User({ 
      ...req.body
    });
    // upload and add url if file has been included
    if (req.file) {
      const uploadedImage = await imageUpload(req.file, "pandas_avatars");
      newUser.avatar = uploadedImage;
    }
    const result = await newUser.save();
    res.status(200).json(result)
  } catch(e) {
    console.log(e)
    e.code === 11000 ? res.status(406).json({ error: "That email is already registered" }) 
    : res.status(500).json({ error: "Unknown error occured", ...e })
  }
}
```

## Optional: Clean Temp Files

It's good practice to delete any files you create once you're finished with them. Depending on the device and device settings, the temp folder could be cleaned regularly, but there's also a chance it won't be and that file will stay there forever! If you look online, you'll see countless frustrated users wondering why their temp folders are getting so full and slowing down their computers. High chance, those files are coming from sloppy programmers that don't clean up after themselves. 

Node includes a [**File System** module](https://www.w3schools.com/nodejs/nodejs_filesystem.asp), with functions we can use to Create, Read, Update, Delete, and even Rename files from our code. Once we've uploaded our file to Cloudinary, we will never need the temp file again, so we're going to use `fs.unlink()` to delete it once we're done.

Since it is necessary to do this regardless of whatever else happens in my controller function, create a small utility function to make it easier to call:

```js
import fs from "fs";

export const removeTempFile = (file) => {
  if (file) { 
    fs.unlink(file.path, (error) => { 
      if (error) {
        console.log(error);
      } else {
        console.log("Temp file deleted");
      }
    });
  }
}
```

At any point that our function would exit (ie. return), I will call it. I can also then add it to a `finally` block at the end of my controller function, so that if I never exit early, it will run after the `try/catch` block has finished:

```js
removeTempFile(req.file);
```

## Front-End

Phew. Now that it's all working through Postman, we have to write a fetch to call it from our React front-end! Let's look at the code in Postman's sidebar to guide us - we can see they're appending their body as Form Data. This is necessary so our Multer middleware can check the field we're using to hold our file.

We'll need to add an `<input type='file' />` so our user can select their file for upload. You can [access](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#getting_information_on_selected_files) this file using `event.target.files`, which will be an array of all selected files. Since we're only selecting one, it will always be the item at the zero index.

**Warning:** When using FormData to submit POST requests using _XMLHttpRequest_ or the *Fetch_API* with the _multipart/form-data_ Content-Type (e.g. when uploading Files and Blobs to the server), **do not explicitly set the Content-Type header on the request**. Doing so will prevent the browser from being able to set the Content-Type header with the boundary expression it will use to delimit form fields in the request body. [Read more](https://developer.mozilla.org/en-US/docs/Web/API/FormData/Using_FormData_Objects).

## Optional: Image Preview

To transform our file into something an `<img>` element can display, we can use the [`createObjectURL(file)` static method](https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL_static). When passed a file as an argument, this method returns a string that can be given to the `src` attribute of an `<img>`. This string could be saved in a state. The string represents a temporary URL, but much like the temporary file, if we don't release it when we're finished, it will stay in the document memory until the document is unloaded. For React, since we only have one HTML document, this is the entire time the app is running. 

To release, we can use [URL.revokeObjectURL(objectURL)](https://developer.mozilla.org/en-US/docs/Web/API/URL/revokeObjectURL_static) static method. Pass the string that was created by the previous method as an argument, and the temporary URL will be forgotten. Consider using a useEffect. 