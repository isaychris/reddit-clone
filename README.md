# Beddit
A reddit clone written using node.js / express.js / mongodb / passport.js

### Website:
https://seiya-beddit.herokuapp.com/

![Image](https://i.imgur.com/HbpGIZP.png)


### Features:
* Frontpage
* Subreddits
* Submitting comments / posts / links
* Voting on posts / comments
* Saving posts / comments
* Editing posts / comments
* Deleting posts / comments
* Subscribing
* Searching
* Sorting
* Profile pages
* Karma system
* Relative time
* Validation
* Login / Register
* Hash / salted passwords
* Change password / delete account
* API

# API:
URL | Method | Details | Body
---- | ---- | ---- | ----
/api/frontpage | GET | Retrieves all posts from frontpage
/api/r/```subreddit``` | GET | Retrieves all posts from ```subreddit```
/api/post/```id``` | GET | Retrieves post by ```id```
/api/post/```id```/comments | GET | Retrieves all comments for post by ```id```
/api/u/```user``` | GET | Retrieves profile information about ```user```
/api/u/```user```/posts | GET | Retrieves all posts by ```user```
/api/u/```user```/comments | GET | Retrieves all comments by ```user```
/api/register | POST | Registers an account | ```username```, ```password```

# Screenshots:
![Image](https://i.imgur.com/QWmcJG7.png)
![Image](https://i.imgur.com/Cf1kpy7.png)
![Image](https://i.imgur.com/vwjY3hI.png)
![Image](https://i.imgur.com/f0cJpfS.png)
![Image](https://i.imgur.com/fOl9v5E.png)
![Image](https://i.imgur.com/RSZ1ruw.png)
![Image](https://i.imgur.com/4aHHz4W.png)
![Image](https://i.imgur.com/g1sjo8w.png)
![Image](https://i.imgur.com/BVlLpbB.png)
![Image](https://i.imgur.com/YfNOatP.png)
![Image](https://i.imgur.com/c9r0FlE.png)
![Image](https://i.imgur.com/Hny7gIj.png)
![Image](https://i.imgur.com/G5TlBe2.png)
![Image](https://i.imgur.com/EQNKpbN.png)
![Image](https://i.imgur.com/s8jfuap.png)
