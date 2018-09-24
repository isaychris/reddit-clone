$("document").ready(function () {

    // onsubmit validation handler for when user submits a subreddit
    // it checks if the subreddit is a valid one by making a query to the database via the server
    $("#form-subreddit").submit(function (e) {
        e.preventDefault()

        $.ajax({
            type: "get",
            url: `/submit/check/${$("#subreddit_form").val()}`
        }).done(function (isvalid) {
            if (isvalid == true) {
                $('#subreddit_form').addClass('is-invalid')
            } else {
                $('form').unbind('submit').submit()
            }
        });
    });

    // onsubmit validation handler for when user submits a post or link
    // it checks if the subreddit is a valid one by making a query to the database via the server
    $("#form-post-or-link").submit(function (e) {
        e.preventDefault()

        $.ajax({
            type: "get",
            url: `/submit/check/${$("#subreddit_form").val()}`
        }).done(function (isvalid) {
            if (isvalid == false) {
                $('#subreddit_form').addClass('is-invalid')
            } else {
                $('form').unbind('submit').submit()
            }
        });
    });
});