# Reddit
A reddit clone written using node.js / express.js / mongodb / passport.js

Work in Progress!
![Image](https://i.imgur.com/hcZuyx2.png)

### Website:
https://seiya-reddit.herokuapp.com/

### Features:
* Viewing subreddits
* Viewing posts
* Submitting posts/links/comments
* Creating subreddits
* Saving / deleting posts and comments
* Upvote / downvote posts and comments
* Subscribing / Unsubscribing
* Editing posts and comments
* Searching for posts
* Relative time
* Database
* Login
* Authentication
* Hashed & salted passwords
* Profile pages
* Karma
* API

### TODO:
* Refactoring

# API:
URL | Method | Details
---- | ---- | ----
/api/frontpage | GET | Retrieves all posts from frontpage
/api/r/```subreddit``` | GET | Retrieves all post from ```subreddit```
/api/post/```id``` | GET | Retrieves post specified by ```id```
/api/comments/```id``` | GET | Retrieves all comments for post specified by ```id```
/api/u/```user``` | GET | Retrieves profile information about ```user```
/api/u/```user```/posts | GET | Retrieves all posts by ```user```
/api/u/```user```/comments | GET | Retrieves all comments by ```user```

# Screenshots:
![Image](https://i.imgur.com/QWmcJG7.png)
![Image](https://i.imgur.com/Cf1kpy7.png)
![Image](https://i.imgur.com/ZsCjSVN.png)
![Image](https://i.imgur.com/uhOO63j.png)
![Image](https://i.imgur.com/DCPlzyN.png)
![Image](https://i.imgur.com/0nOk7TX.png)
![Image](https://i.imgur.com/0mqKZLl.png)
![Image](https://i.imgur.com/tgZYkFF.png)
![Image](https://i.imgur.com/1DdEGf9.png)
![Image](https://i.imgur.com/wSv3pII.png)
![Image](https://i.imgur.com/bN3WISK.png)
![Image](https://i.imgur.com/jbPGlu0.png)
