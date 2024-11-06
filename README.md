# 307-proj-1


## Contributing
### Coding Standards:
    1. Utilizing the Prettier Code Formatter on VS Code
    2. Camel case for functions and variables
    3. Pascal case for react components

## connecting to mongodb with .env
git pull to make sure you have the most recent updates, then in the backend branch in the backend folder create a .env file. everyone should have their own .env file. add the .env file to gitignore so it wont be committed. in the .env file you're gonna put in your MONGODB_URI, the format should look like this:

MONGODB_URI=mongodb+srv://<username>:<password>@sloutions.jsptt.mongodb.net/?retryWrites=true&w=majority&appName=SLOutions

you get this from the cloud.mongodb website. in the website in the overview page where it says 'clusters' click on connect then 'drivers' and follow the instructions on there. the first commmand is run in the root backend. the only thing in the .env file should be your mongodb_uri = 'link' without the ''. then navigate to the node.js file and in line 15 there are instructions on how to add your credentials. once you add your credentials to your .env and have done the node.js, in terminal cd to backend (folder) then run node node.js and it should say "Connected to mongoDB Atlas Pinged your deployment. You successfully connected to MongoDB!"

