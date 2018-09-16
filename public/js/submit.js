$("document").ready(function () {
    $("#form-subreddit").submit(function (e) {
        e.preventDefault();

        $.ajax({
            type: "get",
            url: `/submit/check/${$("#subreddit_form").val()}`
        }).done(function (isvalid) {
            if (isvalid == true) {
                $('#subreddit_form').addClass('is-invalid');
            } else {
                $('form').unbind('submit').submit()
            }
        });
    });

    $("#form-post-or-link").submit(function (e) {
        e.preventDefault();

        $.ajax({
            type: "get",
            url: `/submit/check/${$("#subreddit_form").val()}`
        }).done(function (isvalid) {
            if (isvalid == false) {
                $('#subreddit_form').addClass('is-invalid');
            } else {
                $('form').unbind('submit').submit()
            }
        });
    });
});