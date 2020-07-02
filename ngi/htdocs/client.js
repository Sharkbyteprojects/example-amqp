(function(){
    $(document).ready(function(){
        function cl(string) {
            return string.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        };
        var source = new EventSource("/api/events");
        source.onerror = function() {
                console.warn("Disconnected");
                alert("Disconnected");
                $("pre").prepend(`<hr><strong style="color:red">Disconnected!</strong><hr>`);
        };
        source.onmessage = function (e) {
            const data = e.data;
            console.log(data);
            if(data!=""){
                $("pre").prepend(`<p><strong style="color:yellow">Incoming:</strong> ${cl(data)}</p>`);
            }
        };
        $.post("/api/upload",{msg: ""},function(d){
        },"text");
        $("button").click(function(){
            $.post("/api/upload",{msg: $("input[name=\"xt\"]").val()},function(d){
                $("pre").prepend(`<p style="color: green">${d}</p>`);
            },"text");
            $("input[name=\"xt\"]").val("");
        });
    });
})();