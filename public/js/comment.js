$("document").ready(function () {
    $(".delete-comment").click(function () {
        let query = $(this).parent().parent().parent().parent()
        let ref = query.data('ref')

        if (confirm("Are you sure?")) {
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