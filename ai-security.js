// ai-security.js

// Function to validate input commands
function validateCommand(command) {
    const dangerousCommands = ['shutdown', 'reboot', 'rm -rf'];
    return !dangerousCommands.includes(command);
}

// Main function to process commands
function processCommand(command) {
    if (validateCommand(command)) {
        console.log(`Executing command: ${command}`);
        // Execute the command securely
        // For example, using a safer method or library to run the command
    } else {
        console.error(`Blocked dangerous command: ${command}`);
    }
}

// Example usage:
processCommand('ls -la'); // Allowed command
processCommand('shutdown'); // Blocked command