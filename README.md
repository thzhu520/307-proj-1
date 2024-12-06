# SLOutions

## How to use SLOutions
To report issues on SLOutions open this link: https://proud-river-0020a851e.5.azurestaticapps.net , and it will bring you to the main page. There are two buttons, an Admin button for administrators to view all the submitted issues and an Anonymous button for regular students, staff, faculty or anyone on campus to submit an issue for something that they have noticed. When submitting an issue it will prompt for a title, location, and issue description with the addition that you can upload an image in your report. Included on the side is an interactive map for those who dont know the building name or number. Once you have submitted an issue you will be given an incident ID which you can use on the existing issues page to check the status of your issue and whether it has been resolved or is still in progress or unresolved. In the FAQ section, you will be able to see some commonly asked questions and it may answer a question if you have one. To learn more about the developers who made this application check out the about us!

UI protoype: https://www.figma.com/design/QD5ybAL8HWadLIpu6pLQOr/SLOutions?node-id=0-1&t=yiEvxdnhUMstR2Or-1 

UML diagram: https://www.figma.com/board/14tvwcJOOrOt6pkTvUo0C5/TA-3%3A-Class-diagram---SLOutions?node-id=0-1&t=EIloMnTZh1VAJ52D-1

## Contributing
### Coding Standards:
    1. Utilizing the Prettier Code Formatter on VS Code
    2. Camel case for functions and variables
    3. Pascal case for react components

## connecting to mongodb with .env
git pull to make sure you have the most recent updates, then in the backend branch in the backend folder create a .env file. everyone should have their own .env file. in the .env file you're gonna put in your MONGODB_URI, which you get in step 3 as later described which you get this from the cloud.mongodb website. in the website in the overview page where it says 'clusters' click on connect then 'drivers' and follow the instructions on there, there are 3 instructions, the first one that is autogenerated is fine, so ignore it. the second step is "run npm install mongodb" in the root backend, so the SLOutions root folder. the third step will give you the MONGODB_URI link 

MONGODB_URI=mongodb+srv://<username>:<db_password>@sloutions.jsptt.mongodb.net/?retryWrites=true&w=majority&appName=SLOutions

the only thing in the .env file should be your mongodb_uri = 'link' without the '' as shown above. replace the <username> and <db_password> with your username and your password without the <>. then in terminal cd to backend (folder) then run "node node.js" and it should say "Connected to mongoDB Atlas Pinged your deployment. You successfully connected to MongoDB!"

