$("document").ready(function () {
    $("#subscribe").click(function () {
        let sub = $("#subreddit-name").text();

        $.ajax({
            type: "put",
            url: `/subscribe/${sub}`,
            success: function (res) {
                alert(`You are now subscribed to ${sub}`)
            }
        })
        return false;
    });
});