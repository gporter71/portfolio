$(document).ready(function() {
    let count = 0;
    let data = [
        {
            name: "name",
            val: "",
            text: "Please enter your name"
        },
        {
            name: "email",
            val: "",
            text: "Please enter your email address"
        },
        {
            name: "phone",
            val: "",
            text: "Please enter your phone number"
        },
        {
            name: "message",
            val: "",
            text: "Please enter any message if any you want to add"
        },
        {
            name: "summary"
        },
        {
            name: "confirm",
            val: ""
        }
    ];

    $("#div-terminal").terminal(function(command) {
        if (command === "test"){
            $("#fname").val("test");
            $("#btn-submit").click();
        }

        if (!command){
            this.echo(data[count].text);
        }
        else{
            if (data.length >= count){
                item = data[count];
                if (item.name === "summary"){
                    if (command === "Y" || command === "y"){
                        $("#name").val(data[0].val);
                        $("#email").val(data[1].val);
                        $("#phone").val(data[2].val);
                        $("#message").val(data[3].val);
                        $.ajax({
                            url: '/contact_send',
                            data: $('form').serialize(),
                            type: 'POST',
                            success: function(response){
                                console.log(response);
                            },
                            error: function(error){
                                console.log(error);
                            }
                        })
                        this.echo("Thank you for sending your information. I will be in touch with you soon.")
                    }
                }
                else if (item.name === "message"){
                    item.val = command;
                    $("#" + item.name).val(item.val);
                    console.log(item.val);
                    for(var i=0; i < data.length; i++){
                        let name = data[i].name;
                        let val = data[i].val;
                        if (data[i].text){
                            this.echo("for your " + name + ", you have: " + val);
                        }
                    }
                    this.echo("Is this information correct? (Y)/(N)");
                    count++;
                }
                else{
                    item.val = command;
                    $("#" + item.name).val(item.val);
                    count++;
                    let nextItem = data[count];
                    if (nextItem && nextItem.text){
                        this.echo(nextItem.text);
                    }
                }
            }
        }
    }, 
    { 
        greetings: "Please enter your name",
        prompt: '>', 
        name: 'gporter' 
    }
    );

    $("#btn-save").off("click").on("click", function(){
        $("#btn-save").prop("disabled", true);
        $.ajax({
            url: '/contact_send',
            data: $('form').serialize(),
            type: 'POST',
            success: function(response){
                $("#btn-save").prop("disabled", false);
                $("#span-submit-line").text("Thank you for sending your information. I will be in touch with you soon.");
            },
            error: function(error){
                console.log(error);
            }
        })
    });
});