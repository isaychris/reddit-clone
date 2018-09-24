$("document").ready(function () {
    $(".edit-comment").click(function () {
        let query = $(this).parent().parent().parent().parent()
        let ref = query.data('ref')

        let body = query.find(".comment-body").text()
        let options = $(this).parent().parent().parent()
        query.find(".comment-body").html(`<textarea id="comment-text" class="form-control">${body}</textarea>`)
        autosize($('#comment-text'))

        query.find(".comment-body").append("<br><button class='btn btn-primary mr-1 edit-comment-submit'>Save</button><button class='btn btn-primary edit-comment-cancel'>Cancel</button>");
        options.hide();

        $("button.edit-comment-cancel").click(function () {
            let text = body;

            $("#comment-text").remove();
            $(".edit_comment-cancel").remove();
            $(".edit_comment-save").remove();

            query.find(".comment-body").text(text)
            options.show();
        })

        $("button.edit-comment-submit").click(function () {
            let new_text = $('#comment-text').val();
            $.ajax({
                type: "put",
                url: `/edit/comment/${ref}`,
                data: {
                    text: new_text
                },
                success: function (res) {

                    $("textarea").remove();
                    query.find(".comment-body").text(new_text)
                    options.show();

                }
            })
        })

        return false;
    })

    $(".delete-comment").click(function () {
        let query = $(this).parent().parent().parent().parent()
        let ref = query.data('ref')

        if (confirm("Are you sure you want to delete?")) {
            $.ajax({
                type: "delete",
                url: `/delete/comment/${ref}`,
                success: function (res) {
                    query.remove();
                }
            });
        }
        return false;
    })

    $(".save-comment").click(function () {
        alert('clicked')
        let query = $(this).parent().parent().parent()
        let ref = query.data('ref')
        let that = $(this)

        if ($(this).text() == "save") {
            $.ajax({
                type: "put",
                url: `/save/comment/${ref}`,
                success: function (res) {
                    if (res == "success") {
                        that.text('unsave');
                        return false;
                    }
                }
            });
        } else if ($(this).text() == "unsave") {
            $.ajax({
                type: "put",
                url: `/unsave/comment/${ref}`,
                success: function (res) {
                    if (res == "success") {
                        that.text('save');
                        return false;
                    }
                }
            });
        }
        return false;
    })

    $(".upvote-comment").click(function () {
        let down_arrow = $(this).parent().find(".downvote-comment")
        let query = $(this).parent().parent().parent().find('#comment-votes')
        let ref = $(this).parent().parent().parent().data('ref')
        let counter;

        // if upvote is already toggled and user presses it again, 
        // toggle off the upvote button and decrement vote.
        if ($(this).hasClass("up-enabled")) {
            counter = query.text();
            query.text(--counter);
            $(this).removeClass("up-enabled");

            $.ajax({
                type: "put",
                data: {
                    vote: counter,
                    state: "neutral"
                },
                url: `/vote/pcomment/${ref}`,
                success: function (res) {}
            });
            return false;
        }

        // if downvote is already toggled while upvote is pressed
        // toggle off downvote and increment vote
        if (down_arrow.hasClass('down-enabled')) {
            down_arrow.removeClass("down-enabled");
            counter = query.text();
            query.text(++counter);

            $.ajax({
                type: "put",
                data: {
                    vote: counter,
                    state: "neutral"
                },
                url: `/vote/comment/${ref}`,
                success: function (res) {}
            });
        }

        // if upvote isnt toggled while upvote is pressed,
        // toggle upvote and increment vote.
        else if (!$(this).hasClass("up-enabled")) {
            counter = query.text();
            query.text(++counter);
            $(this).addClass("up-enabled");

            $.ajax({
                type: "put",
                data: {
                    vote: counter,
                    state: "up"
                },
                url: `/vote/comment/${ref}`,
                success: function (res) {}
            });
        }
        return false;
    })

    $(".downvote-comment").click(function () {
        let up_arrow = $(this).parent().find(".upvote-comment")
        let query = $(this).parent().parent().parent().find('#comment-votes')
        let ref = $(this).parent().parent().parent().data('ref')
        let counter;

        // if downvote is already toggled and user presses it again, 
        // toggle off the downvote button and increment vote.
        if ($(this).hasClass("down-enabled")) {
            counter = query.text();
            query.text(++counter);
            $(this).removeClass("down-enabled");

            $.ajax({
                type: "put",
                data: {
                    vote: counter,
                    state: "neutral"
                },
                url: `/vote/comment/${ref}`,
                success: function (res) {}
            });
            return false;
        }

        // if upvote is already toggled while downvote is pressed
        // toggle off upvote and decrement vote
        if (up_arrow.hasClass('up-enabled')) {
            up_arrow.removeClass("up-enabled");
            counter = query.text();
            query.text(--counter);

            $.ajax({
                type: "put",
                data: {
                    vote: counter,
                    state: "neutral"
                },
                url: `/vote/comment/${ref}`,
                success: function (res) {}
            });

            // if downvote isnt toggled while downvote is pressed,
            // toggle downvote and decrement vote.
        } else if (!$(this).hasClass("down-enabled")) {
            counter = query.text();
            query.text(--counter);
            $(this).addClass("down-enabled");

            $.ajax({
                type: "put",
                data: {
                    vote: counter,
                    state: "down"
                },
                url: `/vote/comment/${ref}`,
                success: function (res) {}
            });
        }
        return false;
    });
});