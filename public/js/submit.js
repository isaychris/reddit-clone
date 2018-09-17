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

function checkURL(url) {
    let result = "";
    $.ajax({
        type: "HEAD",
        url: url,
        success: function (message, text, response) {
            if (response.getResponseHeader('Content-Type').indexOf("image") != -1)
                result = "img"
            else
                result = "post"
        }
    }).then(function () {
        return result
    });
}