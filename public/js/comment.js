$("document").ready(function () {

    // event handler for editing a comment
    $(".edit-comment").click(function () {
        let query = $(this).closest('article')
        let ref = query.data('ref')
        let body = query.find(".comment-body").text()
        let options = query.find(".comment-options")

        // display a text area with the comment body and hide comment options
        query.find(".comment-body").html(`<textarea class="form-control comment-text">${body}</textarea>`)
        query.find(".comment-body").append(`<br><button class='btn btn-primary mr-1 edit-comment-submit' data-ref="${ref}">Save</button><button class='btn btn-primary edit-comment-cancel' data-ref="${ref}">Cancel</button>`);
        autosize(query.find('.comment-text'))

        options.hide();


        // when user clicks on cancel, remove textarea and show comment options
        $(`button.edit-comment-cancel[data-ref="${ref}"]`).click(function () {
            let text = body;

            query.find(".comment-text").remove();
            query.find(".comment-body").text(text)

            options.show();
        })


        // when user clicks on submit, upate comment in database, remove textarea and show comment options
        $(`button.edit-comment-submit[data-ref="${ref}"]`).click(function () {
            let new_text = query.find('.comment-text').val();

            $.ajax({
                type: "put",
                url: `/edit/comment/${ref}`,
                data: {
                    text: new_text
                }
            }).done(function (res) {
                query.find(".comment-text").remove();
                query.find(".comment-body").text(new_text)
                options.show();
            })
        })
        return false;
    })


    // event handler for deleting a comment
    $(".delete-comment").click(function () {
        let query = $(this).closest('article')
        let ref = query.data('ref')

        // only when user clicks on okay, remove comment from database,then remove from page
        if (confirm("Are you sure you want to delete?")) {
            $.ajax({
                type: "delete",
                url: `/delete/comment/${ref}`,
            }).done(function (res) {
                query.remove();
            })
        }
        return false;
    })


    // event handler for saving a comment
    $(".save-comment").click(function () {
        let query = $(this).closest('article')
        let ref = query.data('ref')
        let that = $(this)

        if ($(this).text() == "save") {
            alert('saved')
            $.ajax({
                type: "put",
                url: `/save/comment/${ref}`
            }).done(function (res) {
                if (res == "success") {
                    that.text('unsave');
                    return false;
                }
            })
        } else if ($(this).text() == "unsave") {
            alert('unsaved')
            $.ajax({
                type: "put",
                url: `/unsave/comment/${ref}`,
            }).done(function (res) {
                if (res == "success") {
                    that.text('save');
                    return false;
                }
            })
        }
        return false;
    })

    // event handler for upvoting a comment
    $(".upvote-comment").click(function () {
        let down_arrow = $(this).parent().find(".downvote-comment")
        let query = $(this).closest('article')

        let ref = query.data('ref')
        let votes = query.find('.comment-votes')
        let comment_user = query.find('.comment-user').text()
        let counter;

        // if upvote is already toggled and user presses it again, 
        // toggle off the upvote button and decrement vote.
        if ($(this).hasClass("up-enabled")) {
            counter = votes.text();
            votes.text(--counter);
            $(this).removeClass("up-enabled");

            $.ajax({
                type: "put",
                url: `/vote/comment/${ref}`,
                data: {
                    vote: counter,
                    state: "neutral",
                    action: "decrement",
                    user: comment_user
                }
            });
            return false;
        }

        // if downvote is already toggled while upvote is pressed
        // toggle off downvote and increment vote
        if (down_arrow.hasClass('down-enabled')) {
            down_arrow.removeClass("down-enabled");
            counter = votes.text();
            votes.text(++counter);

            $.ajax({
                type: "put",
                url: `/vote/comment/${ref}`,
                data: {
                    vote: counter,
                    state: "neutral",
                    action: "increment",
                    user: comment_user
                }
            });
        }

        // if upvote isnt toggled while upvote is pressed,
        // toggle upvote and increment vote.
        else if (!$(this).hasClass("up-enabled")) {
            counter = votes.text();
            votes.text(++counter);
            $(this).addClass("up-enabled");

            $.ajax({
                type: "put",
                url: `/vote/comment/${ref}`,
                data: {
                    vote: counter,
                    state: "up",
                    action: "increment",
                    user: comment_user
                }
            });
        }
        return false;
    })

    // event handler for downvoting a comment
    $(".downvote-comment").click(function () {
        let up_arrow = $(this).parent().find(".upvote-comment")
        let query = $(this).closest('article')

        let ref = query.data('ref')
        let votes = query.find('.comment-votes')
        let comment_user = query.find('.comment-user').text()
        let counter;

        // if downvote is already toggled and user presses it again, 
        // toggle off the downvote button and increment vote.
        if ($(this).hasClass("down-enabled")) {
            counter = votes.text();
            votes.text(++counter);
            $(this).removeClass("down-enabled");

            $.ajax({
                type: "put",
                url: `/vote/comment/${ref}`,
                data: {
                    vote: counter,
                    state: "neutral",
                    action: "increment",
                    user: comment_user
                }
            });
            return false;
        }

        // if upvote is already toggled while downvote is pressed
        // toggle off upvote and decrement vote
        if (up_arrow.hasClass('up-enabled')) {
            up_arrow.removeClass("up-enabled");
            counter = votes.text();
            votes.text(--counter);

            $.ajax({
                type: "put",
                url: `/vote/comment/${ref}`,
                data: {
                    vote: counter,
                    state: "neutral",
                    action: "decrement",
                    user: comment_user
                }
            });

            // if downvote isnt toggled while downvote is pressed,
            // toggle downvote and decrement vote.
        } else if (!$(this).hasClass("down-enabled")) {
            counter = votes.text();
            votes.text(--counter);
            $(this).addClass("down-enabled");

            $.ajax({
                type: "put",
                url: `/vote/comment/${ref}`,
                data: {
                    vote: counter,
                    state: "down",
                    action: "decrement",
                    user: comment_user
                }
            });
        }
        return false;
    });
});