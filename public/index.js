function init_app() {
    window.app = new Vue({
        el: '#app',
        data: {
            has_ink: true,
            has_paper: true,
            jobs: []
        },
        methods: {
            fetchData: function () {
                $.getJSON("/printer", function( data ) {
                    for (x in data) {
                        this[x] = data[x];
                    }
                }.bind(this));
            },
            updateData: function() {

                data = {
                    has_ink: this.has_ink,
                    has_paper: this.has_paper
                }

                $.ajax({
                    url : "/printer",
                    type: "post",
                    data: JSON.stringify(data),
                    dataType: "json",
                    contentType: "application/json"
                })
            }
        }
    })

    app.fetchData()

    setInterval(function() {
        app.fetchData()
    }, 1000)
}
