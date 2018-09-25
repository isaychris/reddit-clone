$("document").ready(function () {
    autosize($('.comment-text'))

    $(".edit-post").click(function () {
        let query = $(this).closest('article')
        let ref = query.data('ref')

        let body = query.find('.post-body').text()
        let options = query.find('.post-options')
        query.find('.post-body').html(`<textarea class="form-control post-text">${body}</textarea>`)
        query.find('.post-body').append("<br><button class='btn btn-primary mr-1 edit_submit'>Save</button><button class='btn btn-primary edit_cancel'>Cancel</button>");
        autosize(query.find('.post-text'))

        options.hide();

        $("button.edit_cancel").click(function () {
            let text = body;

            query.find(".post-text").remove();
            query.find(".post-body").text(text)

            options.show();
        })

        $("button.edit_submit").click(function () {
            let new_text = query.find('.post-text').val();

            $.ajax({
                type: "put",
                url: `/edit/post/${ref}`,
                data: {
                    text: new_text
                }
            }).done(function (res) {
                query.find(".post-text").remove();
                query.find(".post-body").text(new_text)
                options.show();
            })
        })
        return false;
    })

    $(".delete-post").click(function () {
        let query = $(this).closest('article')
        let ref = query.data('ref')

        if (confirm("Are you sure you want to delete?")) {
            $.ajax({
                type: "delete",
                url: `/delete/post/${ref}`,
            }).done(function (res) {
                query.remove();
            })
        }
        return false;
    })

    $(".save-post").click(function () {
        let query = $(this).closest('article')
        let ref = query.data('ref')
        let that = $(this)

        if ($(this).text() == "save") {
            $.ajax({
                type: "put",
                url: `/save/post/${ref}`
            }).done(function (res) {
                if (res == "success") {
                    that.text('unsave');
                    return false;
                }
            })
        } else if ($(this).text() == "unsave") {
            $.ajax({
                type: "put",
                url: `/unsave/post/${ref}`,
            }).done(function (res) {
                if (res == "success") {
                    that.text('save');
                    return false;
                }
            })
        }
        return false;
    })

    $(".upvote-post").click(function () {
        let query = $(this).closest('article')
        let ref = query.data('ref')

        let votes = query.find('.post-votes')
        let down_arrow = query.find(".downvote-post")
        let post_user = query.find('.post-user').text()
        let counter;

        // if upvote is already toggled and user presses it again, 
        // toggle off the upvote button and decrement vote.
        if ($(this).hasClass("up-enabled")) {
            counter = votes.text();
            votes.text(--counter);
            $(this).removeClass("up-enabled");

            $.ajax({
                type: "put",
                url: `/vote/post/${ref}`,
                data: {
                    vote: counter,
                    state: "neutral",
                    action: "decrement",
                    user: post_user
                },
                success: function (res) {}
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
                data: {
                    vote: counter,
                    state: "neutral",
                    action: "increment",
                    user: post_user
                },
                url: `/vote/post/${ref}`,
                success: function (res) {}
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
                data: {
                    vote: counter,
                    state: "up",
                    action: "increment",
                    user: post_user
                },
                url: `/vote/post/${ref}`,
                success: function (res) {}
            });
        }
        return false;
    });

    $(".downvote-post").click(function () {
        let query = $(this).closest('article')
        let ref = query.data('ref')

        let votes = query.find('.post-votes')
        let up_arrow = query.find(".upvote-post")
        let post_user = query.find('.post-user').text()
        let counter;

        // if downvote is already toggled and user presses it again, 
        // toggle off the downvote button and increment vote.
        if ($(this).hasClass("down-enabled")) {
            counter = votes.text();
            votes.text(++counter);
            $(this).removeClass("down-enabled");

            $.ajax({
                type: "put",
                data: {
                    vote: counter,
                    state: "neutral",
                    action: "increment",
                    user: post_user
                },
                url: `/vote/post/${ref}`,
                success: function (res) {}
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
                data: {
                    vote: counter,
                    state: "neutral",
                    action: "decrement",
                    user: post_user
                },
                url: `/vote/post/${ref}`,
                success: function (res) {}
            });

            // if downvote isnt toggled while downvote is pressed,
            // toggle downvote and decrement vote.
        } else if (!$(this).hasClass("down-enabled")) {
            counter = votes.text();
            votes.text(--counter);
            $(this).addClass("down-enabled");

            $.ajax({
                type: "put",
                data: {
                    vote: counter,
                    state: "down",
                    action: "decrement",
                    user: post_user
                },
                url: `/vote/post/${ref}`,
                success: function (res) {}
            });
        }
        return false;
    });
});