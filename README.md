# COB - Discord Bot
An experimental bot where you can contribute whatever you'd like - we'll see how things go 👀

**Links**:
> [Invite](https://discord.com/api/oauth2/authorize?client_id=1166951538086912101&permissions=1634734566647&scope=bot%20applications.commands)

> [Server](https://discord.gg/tw6m7hd4xV)

## Setup
If you would like to use this bot for yourself, follow these steps:

1. **Install** the latest version of [Node.js](https://nodejs.org/).

2. **Set up a bot** in the [Discord Developer Portal](https://discord.com/developers/applications).

3. Go to the bot page of your app and **get the bot's token** - also enable all Privileged Gateway Intents.

4. **Clone** this GitHub repo, **Change Directory**, and **Install** packages:
```bash
git clone https://github.com/JadenLabs/COB.git
cd COB
npm install
```

5. **Create** a token.js file:
```json
{
    "token": "<token>"
}
``` 

6. **Update** the config.yaml file with your information.

7. **Run** the bot:
```bash
node .
```

#### Inviting
To invite your bot, copy the following url into your browser after filling in the bot's id:
```
https://discord.com/api/oauth2/authorize?client_id=<BOT-ID>&permissions=1634734566647&scope=bot%20applications.commands
```

# Contributing to COB
Thank you for your interest in contributing to this project! We welcome all contributions to help make this project better :D

## Getting Started
#### Forking (fork you):
```bash
# Make sure you have a GitHub account.
# Fork the repository to your GitHub account.
# Clone the forked repository to your local machine.

git clone https://github.com/JadenLabs/COB.git

# Create a new branch for your changes.

git checkout -b feature/your-feature
```

#### Commiting
```bash
# Commit your changes with a clear and concise message.

git commit -m "Your message here"
```

#### Pushing
```bash
# Push your changes to your fork on GitHub.

git push origin feature/your-feature
```

#### Pull Requests
- Go to the original repository.
- Click on the "New Pull Request" button.
- Follow the prompts to create a pull request with a clear description of your changes.
