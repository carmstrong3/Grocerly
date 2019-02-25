# Grocerly

Make grocery lists on the fly!

# For Users

Using Grocerly is super easy. To get started just go to https://grocerly-3.herokuapp.com/ and load it up.

- The "User" features are still in development, so you will not yet be able to make an account to customize your experience. 

- The "List" feature is implimented, so you can create a new list by simply filling out the form in the middle of the page and clicking the "Submit" button.
--  To move to your list, simply click on it where it is displayed on the left-hand-side of the window. 
--  Once you have clicked on the list, it is now your "Active" list. If you choose to delete it, you can with the "Delete Active List" button below the new list form.
---  Up next on the "List" feature's devlist is to make it more user-friendly by using css to clearly dilineate the "active" list from the others.

- The "Item" feature is implimented, so you can also create new items by filling out the form below the "Delete Active List" button and clicking the "Submit" button.
-- Once you create your item, it will auto-populate within the "Active List". It will be tied to that list. Items come as "not purchased" by default which is identified currently by the word "no".
-- To change the item to purchased, you can click on the item of choice and then click the "set to purchased" button. You currently must refresh the page to see that an item has been purchased.
--- This feature will be updated to use checkboxes or another, more user-friendly, option that automatically updates upon clicking. 

That's it! It's that simple.

# For Developers

This project was developed with the following "main" tools:
- Node.js as the backend
- React.js as the frontend
- PSQL as the database
- Jasmine for testing
- Express.js for the server functionality

After cloning the project to your workstation, please be aware that the server runs on localhost:5000 and the client on localhost:3000. They both need to be running for the development process to run smoothly.

# Current Structure

The app has been constructed on short-notice, and has suffered in terms of maintaining beautiful & well-maintained architecture. In fact, it is more like an inventor's garage where everything is stuffed into a few piles. 

- Pile 1
The `src/server.js` file currently contains all of the relevant routes and controllers for the backend. They are not yet neatly filed into their respective folders. By opening the `src.server.js` file and scrolling down through the comments, you will see that the code is organized in such a manner that there is a commented section that explains what you're going to be looking at, and then another commented line that lets you know when that section is over. That is the loose attempt at organization while I rapidly worked on the app.

- Pile 2
The `spec` folder contains all of the tests that were made while developing the app. If you're familiar with Jasmine.js, there's nothing special in there.

- Pile 3
The `db` folder contains all of the relevant information for the Sequelize.js ORM. There you'll find the queries, models, seeds, and migrations that are used in the `src.server.js` file and talk to the psql database. Speaking of....

- Pile 4
The psql database contains all of the data for the app. There are currently three tables and one "loose" table. The tables are "Items", "Users", and "Lists"...the only 3 objects in the app. The "loose" table is "Groups" which is the association between users and lists. The functionality for this group is not yet observable on the client side of the app.

- Pile 5
The client side is actually fairly-well organized. Mostly because it's a React app that comes with it's own structure that I've slightly edited.

# Closing

So that's all there is to the app currently. Hopefully this has made clear where you can find what you're looking for. If you have any questions, feel free to reach out to me at clifford.armstrong.3@gmail.com.
