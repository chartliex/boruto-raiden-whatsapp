import fs from 'fs';

export default async () => {
    const commands = [];
    for (const file of fs.readdirSync('commands')) {
        if (file.endsWith('.js')) {
            const commandModule = await import(`../../commands/${file}`);
            const command = commandModule.default;
            commands.push(command);
        }
    }
    return commands;
};