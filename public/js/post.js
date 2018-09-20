$("document").ready(function () {
    $(".edit-post").click(function () {
        let query = $(this).parent().parent().parent().parent()
        let ref = query.data('ref')
        let body = query.find('p').text()
        let options = $(this).parent().parent()
        console.log(query.find('p').text());
        query.find('p').html(`<textarea id="post-text" class="form-control">${body}</textarea>`)
        autosize($('#post-text'))

        query.find('p').append("<br><button class='btn btn-primary mr-1 edit_submit'>Save</button><button class='btn btn-primary edit_cancel'>Cancel</button>");
        options.hide();

        $("button.edit_cancel").click(function () {
            let text = body;

            console.log('canceled')
            $("#post-text").remove();
            $(".edit_cancel").remove();
            $(".edit_save").remove();

            query.find('p').text(text)
            options.show();
        })

        $("button.edit_submit").click(function () {
            console.log("attempting to save")
            let new_text = $('#post-text').val();
            $.ajax({
                type: "put",
                url: `/edit/post/${ref}`,
                data: {
                    text: new_text
                },
                success: function (res) {
                    $("textarea").remove();
                    query.find('p').text(new_text)
                    options.show();

                }
            })
        })

        return false;
    })

    $(".delete-post").click(function () {

        let query = $(this).parent().parent().parent().parent()
        let ref = query.data('ref')

        if (confirm("Are you sure you want to delete?")) {
            $.ajax({
                type: "delete",
                url: `/delete/post/${ref}`,
                success: function (res) {
                    query.remove();
                }
            });
        }
        return false;
    })

    $(".save-post").click(function () {
        let query = $(this).parent().parent().parent().parent()
        let ref = query.data('ref')
        console.log($(this).text());

        if ($(this).text() == "save") {
            $.ajax({
                type: "put",
                url: `/save/post/${ref}`,
            });
            $(this).text('unsave');

        } else {
            $.ajax({
                type: "put",
                url: `/unsave/post/${ref}`,

            });
            $(this).text('save');
        }
        return false;
    })

    $(".upvote-post").click(function () {
        alert('upvote clicked')
        let down_arrow = $(this).parent().find(".downvote-post")
        let query = $(this).parent().find('span')
        let ref = $(this).parent().find('span').data('ref')
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
                url: `/vote/post/${ref}`,
                success: function (res) {
                    alert("vote submited")
                }
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
                url: `/vote/post/${ref}`,
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
                url: `/vote/post/${ref}`,
                success: function (res) {
                    alert("vote submitted")
                }
            });
        }
        return false;
    });

    $(".downvote-post").click(function () {
        let up_arrow = $(this).parent().find(".upvote-post")
        let query = $(this).parent().find('span')
        let ref = $(this).parent().find('span').data('ref')
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
                url: `/vote/post/${ref}`,
                success: function (res) {
                    alert("vote submitted")
                }
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
                url: `/vote/post/${ref}`,
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
                url: `/vote/post/${ref}`,
                success: function (res) {
                    alert("vote submitted")
                }
            });
        }
        return false;
    });
});