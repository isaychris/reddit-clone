$("document").ready(function () {
    $(".delete-post").click(function () {

        let query = $(this).parent().parent().parent().parent()
        let ref = query.data('ref')

        if (confirm("Are you sure?")) {
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
                url: `/vote/post/${ref}`,
                success: function (res) {
                    alert("vote submited")
                }
            });
        }
        return false;
    });

    $(".downvote-post").click(function () {
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
                url: `/vote/post/${ref}`,
                success: function (res) {
                    alert("vote submited")
                }
            });
        }
        return false;
    });
});