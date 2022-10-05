$(document).ready(function() {
    let name = "";
    let email = "";
    let phone = "";
    let msg = "";

    var count = 0;
    var questions = [
        {
            name: "name",
            text: "Please enter your email address",
            val: "",
        },
        {
            name: "email",
            text: 'Please enter your phone number',
            val: ""
        },
        {
            name: 'phone',
            text: 'Please enter any specific notes you would like to add to the message',
            val: ""
        },
        {
            name: 'message',
            val: ""
        }
    ];

    $('body').terminal(function(command) {
        if (command){
            if (count === 3){
                let item = questions[count];
                item.val = command;
                for(var i=0; i<questions.length; i++){
                    let name = questions[i].name;
                    let val = questions[i].val;
                    this.echo("for your " + name + ", you have: " + val);
                }
                this.echo("Is this information correct? (Y)/(N)");
                count++;
            }
            else if (count === 4){
                if (command === "Y" || command === "y"){
                    this.echo("Thank you for sending your information!")
                }
            }
            else{
                let item = questions[count];
                item.val = command;
                count++;
                if (item.text){
                    this.echo(item.text);
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
});