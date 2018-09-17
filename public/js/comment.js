$("document").ready(function () {
    $(".edit-comment").click(function () {
        let query = $(this).parent().parent().parent().parent()
        let ref = query.data('ref')
        console.log(ref);

        let body = query.find(".comment-body").text()
        let options = $(this).parent().parent().parent()
        query.find(".comment-body").html(`<textarea id="comment-text" class="form-control">${body}</textarea>`)
        autosize($('#comment-text'))

        query.find(".comment-body").append("<br><button class='btn btn-primary mr-1 edit-comment-submit'>Save</button><button class='btn btn-primary edit-comment-cancel'>Cancel</button>");
        options.hide();

        $("button.edit-comment-cancel").click(function () {
            let text = body;

            console.log('canceled')
            $("#comment-text").remove();
            $(".edit_comment-cancel").remove();
            $(".edit_comment-save").remove();

            query.find(".comment-body").text(text)
            options.show();
        })

        $("button.edit-comment-submit").click(function () {
            console.log("attempting to save")
            let new_text = $('#comment-text').val();
            console.log(new_text)
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
        let query = $(this).parent().parent().parent().parent()
        let ref = query.data('ref')

        if ($(this).text() == "save") {
            $.ajax({
                type: "put",
                url: `/save/comment/${ref}`,
            });
            $(this).text('unsave');

        } else {
            $.ajax({
                type: "put",
                url: `/unsave/comment/${ref}`,

            });
            $(this).text('save');
        }
        return false;
    })

    $(".upvote-comment").click(function () {
        let query = $(this).parent().parent().parent().find('#comment-votes')
        let ref = $(this).parent().parent().parent().data('ref')
        let counter;

        if (query.hasClass('down-enabled')) {
            query.removeClass("down-enabled");
            counter = query.text();
            query.text(++counter);
        } else if (!query.hasClass("up-enabled")) {
            counter = query.text();
            query.text(++counter);
            query.addClass("up-enabled");

            $.ajax({
                type: "put",
                data: {
                    vote: counter
                },
                url: `/vote/comment/${ref}`,
                success: function (res) {
                    alert("vote submited")
                }
            });
        }
        return false;
    });

    $(".downvote-comment").click(function () {
        let query = $(this).parent().parent().parent().find('#comment-votes')
        let ref = $(this).parent().parent().parent().data('ref')
        let counter;

        if (query.hasClass('up-enabled')) {
            query.removeClass("up-enabled");
            counter = query.text();
            query.text(--counter);
        } else if (!query.hasClass("down-enabled")) {
            counter = query.text();
            query.text(--counter);
            query.addClass("down-enabled");

            $.ajax({
                type: "put",
                data: {
                    vote: counter
                },
                url: `/vote/comment/${ref}`,
                success: function (res) {
                    alert("vote submited")
                }
            });
        }
        return false;
    });
});