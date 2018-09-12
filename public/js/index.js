/*
actions:
    submit-link
    submit-post
    create-subreddit

user:
    user
    post-karma
    comment-karma
    user-settings

page:
    subreddit-name

new link:
    link-submit-button

new post:
    link-submit-button
*/

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById("submit-link").addEventListener("click", () => {
        document.location = '/submit_link';
        console.log(document.location);
    });
    document.getElementById("submit-post").addEventListener("click", () => {
        document.location = '/submit_post';

    });
    document.getElementById("create-subreddit").addEventListener("click", () => {
        document.location = '/create_subreddit';

    });
});