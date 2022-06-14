function getBotResponse(input) {
    
    if (input == "stone") {
        return "paper";
    } else if (input == "paper") {
        return "scissors";
    } else if (input == "scissors") {
        return "stone";
    }

    
    if (input == "hello"|| input=="hii") {
        return "Hello there!";
    } else if (input == "bye") {
        return "Talk to you later!";
    } else {
        return "We have recorded your query admin will reply shortly";
    }
}