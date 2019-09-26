export class KeyboardInteractions {
	commands = {};
	
	addKeyDownEventListener = jest.fn();
    removeKeyDownEventListener = jest.fn();
    setupCommandAndShortcut(command) {
    	this.commands[command.id] = command;
    }
    execute(commandId) {
    	if (this.commands[commandId]) {
    		this.commands[commandId].execute();
    	}
    }
}
