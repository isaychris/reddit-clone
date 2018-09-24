$("document").ready(function () {

    // function that converts all time dates on a page to relative time
    $("time").each(function (index) {
        $(this).text(moment($(this).attr('title')).fromNow())
    });

    // event handler that replaces broken thumbnails with a default one.
    $(".thumbnail").on('error', function () {
        $(this).attr('src', '../images/image.png');
    });

    // event handler that checks if the user is authenticated when they click an auth-only action.
    $(".auth-req").click(function (e) {
        if ($("#auth").text() == "false") {
            alert("You must be logged in to do that.")
            e.stopImmediatePropagation();
            return false;
        }
    });

    // event handler for when user subscribes to subreddit
    $("#subscribe").click(function () {
        let sub = $("#subreddit-name").text();
        let that = $(this)

        // if current text is subscribe, update subscription in database
        if ($(this).text() == "Subscribe") {
            $.ajax({
                type: "put",
                url: `/subscribe/${sub}`
            }).done(function (res) {
                that.text('Unsubscribe')
                alert(`You are now subscribed to ${sub}`)
            })

            // if current text is unsubscribe, update subscription in database
        } else if ($(this).text() == "Unsubscribe") {
            alert('unsubscribe text')
            $.ajax({
                type: "put",
                url: `/unsubscribe/${sub}`,
            }).done(function (res) {
                that.text('Subscribe')
                alert(`You are now unsbscribed from ${sub}`)
            })
        }
        return false;
    })

});