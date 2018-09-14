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

$("document").ready(function () {

    $("time").each(function (index) {
        console.log(index + ": " + $(this).text());
        $(this).text(moment($(this).text()).fromNow())
        console.log(index + ": " + $(this).text());
    });

    $(".auth-req").click(function () {
        if ($("#auth").text() == "false") {
            alert("You must be logged in to do that.")
            this.stopImmediatePropagation();
            return false;
        }
    });



    $(".delete").click(function () {

        let query = $(this).parent().parent().parent().parent()
        let ref = query.data('ref')

        if (confirm("Are you sure?")) {
            $.ajax({
                type: "delete",
                url: `/delete/${ref}`,
                success: function (res) {
                    query.remove();
                }
            });
        }
    })

    $(".save").click(function () {
        let query = $(this).parent().parent().parent().parent()
        let ref = query.data('ref')
        console.log($(this).text());

        if ($(this).text() == "save") {
            $.ajax({
                type: "put",
                url: `/save/${ref}`,
            });
            $(this).text('unsave');

        } else {
            $.ajax({
                type: "put",
                url: `/unsave/${ref}`,

            });
            $(this).text('save');

        }
    })

    $(".upvote").click(function () {

        let query = $(this).parent().find('span')
        let ref = $(this).parent().find('span').data('ref')
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
                url: `/vote/${ref}`,
                success: function (res) {
                    alert("vote submited")
                }
            });
        }
    });

    $(".downvote").click(function () {
        let query = $(this).parent().find('span')
        let ref = $(this).parent().find('span').data('ref')
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
                url: `/vote/${ref}`,
                success: function (res) {
                    alert("vote submited")
                }
            });
        }
    });
});