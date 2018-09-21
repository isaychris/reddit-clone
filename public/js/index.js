$("document").ready(function () {

    $(".thumbnail").on('error', function () {
        $(this).attr('src', '../images/image.png');
    });

    $("time").each(function (index) {
        $(this).text(moment($(this).attr('title')).fromNow())
    });

    $(".auth-req").click(function (e) {
        if ($("#auth").text() == "false") {
            alert("You must be logged in to do that.")
            e.stopImmediatePropagation();
            return false;
        }
    });

    $(".save-post").click(function () {
        let query = $(this).parent().parent().parent().parent()
        let ref = query.data('ref')
        let that = $(this)

        if ($(this).text() == "save") {
            $.ajax({
                type: "put",
                url: `/save/post/${ref}`,
                success: function (result) {
                    that.text('unsave');
                }
            });
        } else {
            $.ajax({
                type: "put",
                url: `/unsave/post/${ref}`,
                success: function (result) {
                    that.text('save');
                }
            });
        }
        return false;

    })

    $("#subscribe").click(function () {
        let sub = $("#subreddit-name").text();
        let that = $(this)

        console.log($(this).text())
        if ($(this).text() == "Subscribe") {
            $.ajax({
                type: "put",
                url: `/subscribe/${sub}`,
                success: function (res) {
                    that.text('Unsubscribe')
                    alert(`You are now subscribed to ${sub}`)
                }
            })
        } else if ($(this).text() == "Unsubscribe") {
            alert('unsubscribe text')
            $.ajax({
                type: "put",
                url: `/unsubscribe/${sub}`,
                success: function (res) {
                    that.text('Subscribe')
                    alert(`You are now unsubscribed from ${sub}`)
                }
            })
        }
        return false;

    });

});