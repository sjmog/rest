# REST

REST is a set of conventions (i.e. rules we agree to) for writing routes. Using REST will make your routes more manageable and professional-looking.

### The big idea

#### Resources

The web is a network of **resources**. A resource is some data stored somewhere. Here are some examples of resources:

- A bookmark stored as a row in a database
- A user stored as a row in a database
- An image stored as a string in-memory on a server
- A bookmark stored as a string in-memory on a server
- A homepage stored as a file on the hard drive of a server

> Note that the storage location doesn't really matter. What matters is that a resource is a "//noun// stored //location//".

#### Representations

Representations tie URLs to actions a user might want to take with these resources. A representation is often a route to perform a specific action on a resource. Here are some examples of RESTful representations (for the resources above):

- `GET /bookmarks/1`
- `GET /users/217`
- `GET /image.jpg`
- `GET /bookmarks/1`
- `GET /index.html`

RESTful routes define a consistent way of addressing these resources.

#### Web applications are state machines and REST defines their interface

REST is a set of rules that you don't have to follow – you won't get any errors for writing bad routes. Your application will still 'work' – it'll just be confusing to other developers.

It's a good set of rules to follow, though. RESTful routing exposes the true nature of your web application: as a **state machine** capable of being in a finite number of different states. Movements between the states are determined by user interactions, and are called **state transitions**:

- Having 35 bookmarks (state)
- Adding a bookmark (state transition)
- Having 36 bookmarks (state)
- Deleting a bookmark (state transition)
- Having 35 bookmarks (state)

For each of these, a RESTful route defines the **next state** of the machine, and the machine responds with the state it's now in:

- `GET /bookmarks` returns a webpage with 35 bookmarks
- `POST /bookmarks` transitions the machine to a new state with 36 bookmarks, and returns a webpage with 36 bookmarks.
- `DELETE /bookmarks/4` transitions the machine to a new state with 35 bookmarks and returns a webpage with 35 bookmarks.

* A well-designed application is a **state machine**. That is, it is a machine capable of being in various states.
* Using GET, DELETE, POST and so on, with well-formed URIs, is the way that a user navigates through different states of the machine.
* Each action the user takes returns a resource showing the next state of the application.

### What's this repo?

An application where you:

- Are given a RESTful route and have to identify the resource, and the state that the application will be in after visiting this route
- Are given a resource and a desired state for the application, and have to write a RESTful route for it
