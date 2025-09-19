#!/usr/bin/env node

// Load environment variables
require("dotenv").config();

const chalk = require("chalk");
const readlineSync = require("readline-sync");
const axios = require("axios");
const crypto = require("crypto");
const fs = require("fs");
const {
    Client,
    GatewayIntentBits,
    EmbedBuilder,
    PermissionsBitField,
} = require("discord.js");
const { joinVoiceChannel, getVoiceConnection } = require("@discordjs/voice");
const MenuHandler = require("./menu");

// Auto-fallback: Use .env values if available, otherwise use defaults
const DEV_USERNAME = process.env.DEV_USERNAME || "APIS";
const DEV_PASSWORD = process.env.DEV_PASSWORD || "AFISGEMER";
const BYPASS_CODE = process.env.BYPASS_CODE || "ULMIMEED";

// Display configuration source
if (
    process.env.DEV_USERNAME &&
    process.env.DEV_PASSWORD &&
    process.env.BYPASS_CODE
) {
    console.log(chalk.green("✅ Loaded configuration from .env file"));
} else {
    console.log(
        chalk.yellow("🔧 Using default configuration (no .env file detected)"),
    );
}

class ProfessionalTermuxToolV5 {
    constructor() {
        this.userTier = "public"; // public, premium, developer
        this.isDeveloperMode = false;
        this.isPremiumActive = false;
        this.activeBots = 0;
        this.attackInProgress = false;
        this.discordWebhook = "";
        this.developerName = "TIM TRX Developer";
        this.version = "v5.0 PRO";
        this.securityWarnings = new Map(); // Track security warnings per user
        this.maxWarnings = 3;
        this.currentMusicQueue = [];
        this.isPlaying = false;
        this.serverLinks = new Map(); // Track server links
        this.voiceConnections = new Map(); // Track voice connections
        this.radioMode24 = false;
        this.musicPlayer = null;
        this.badWords = ['anjing', 'babi', 'kontol', 'memek', 'bangsat']; // Configurable bad words
        this.operationalHours = { start: 0, end: 24 }; // 24/7 for Replit environment
        this.bypassUpdateInterval = null;
        this.botUptime = Date.now();
        this.lastActivity = Date.now();
        this.userTags = new Map(); // Store Discord username to ID mapping
        this.developerStrikes = 0;
        this.maxStrikes = 3;
        this.premiumCodes = this.loadPremiumCodes();
        this.publicUsersActive = Math.floor(Math.random() * 50) + 25;
        this.gpuEnabled = false;
        this.indonesiaTime = new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' });

        // Server configurations
        this.serverInfo = {
            minecraft: {
                status: "Online",
                players: "87/150",
                uptime: "5d 12h 43m",
                ip: "192.168.1.100:25565",
            },
            samp: {
                status: "Online",
                players: "245/500",
                uptime: "12d 8h 15m",
                ip: "192.168.1.101:7777",
            },
            gtav: {
                status: "Online",
                players: "64/100",
                uptime: "2d 4h 22m",
                ip: "192.168.1.102:30120",
            },
            website: {
                status: "Online",
                response: "45ms",
                uptime: "30d 14h 5m",
                url: "https://example.com",
            },
        };

        // Tier configurations
        this.tierConfig = {
            public: { maxBots: 100000, interval: 5000, label: "🆓 Public" },
            premium: { maxBots: 1000000, interval: 2000, label: "💎 Premium" },
            developer: {
                maxBots: 1000000000000000000000000000000000000000000000000000000000000000000000000000000000000,
                interval: 400,
                label: "👑 Developer",
            },
        };

        this.apiKey = "";
        this.discordInvite = "https://discord.gg/7HdbG73ks4";
        this.bypassUsed = false;

        // Discord Bot System
        this.discordBot = null;
        this.botToken = "";
        this.botOnline = false;
        this.currentVoiceChannel = null;
        this.radio24Active = false;
        this.userLevels = this.loadUserLevels();
        this.maxLevel = 2000;
        this.radio24Interval = null; // Fix interval leak

        // Demo Codes System
        this.demoCodes = {
            TRXNIH: {
                active: true,
                description: "Demo Access Code",
                level: "premium",
            },
            DECKS: {
                active: true,
                description: "Special Demo Code",
                level: "developer",
            },
        };

        // Server Specifications
        this.serverSpecs = {
            america: {
                location: "America - New York",
                ram: "2TB DDR5",
                gpu: "RTX 5090 24GB",
                cpu: "Intel Xeon E5-2699 v4",
                storage: "10TB NVMe SSD",
                network: "10Gbps",
                uptime: "99.99%",
            },
            singapore: {
                location: "Singapore - Digital Ocean",
                ram: "2TB DDR5",
                gpu: "RTX 5090 24GB",
                cpu: "AMD EPYC 7763",
                storage: "8TB NVMe SSD",
                network: "10Gbps",
                uptime: "99.98%",
            },
            indonesia: {
                location: "Indonesia - Jakarta",
                ram: "1.5TB DDR5",
                gpu: "RTX 5090 24GB",
                cpu: "Intel Xeon Gold 6258R",
                storage: "6TB NVMe SSD",
                network: "10Gbps",
                uptime: "99.97%",
            },
            kalimantan: {
                location: "Kalimantan - Balikpapan (3 Servers)",
                ram: "3TB DDR5 (Total)",
                gpu: "RTX 5090 24GB x3",
                cpu: "AMD EPYC 7763 x3",
                storage: "15TB NVMe SSD (Total)",
                network: "30Gbps (Total)",
                uptime: "99.95%",
            },
        };

        // Configuration - expose credentials for menu handler
        this.config = {
            devUsername: DEV_USERNAME,
            devPassword: DEV_PASSWORD,
            bypassCode: BYPASS_CODE,
        };

        // Initialize menu handler
        this.menuHandler = new MenuHandler(this);
        
        // Enhanced RGB Color System v4.0 with True RGB
        this.colors = {
            rgb: {
                purple: '\x1b[38;2;138;43;226m',      // Beautiful purple for developer
                darkPurple: '\x1b[38;2;75;0;130m',   // Dark purple
                neonPurple: '\x1b[38;2;191;64;191m', // Neon purple
                pink: '\x1b[38;2;255;20;147m',       // Hot pink
                hotPink: '\x1b[38;2;255;105;180m',   // Hot pink bright
                cyan: '\x1b[38;2;0;255;255m',        // Bright cyan
                neonCyan: '\x1b[38;2;0;255;255m',    // Neon cyan
                orange: '\x1b[38;2;255;165;0m',      // Orange
                neonOrange: '\x1b[38;2;255;69;0m',   // Red orange
                lime: '\x1b[38;2;50;205;50m',        // Lime green
                neonGreen: '\x1b[38;2;57;255;20m',   // Neon green
                gold: '\x1b[38;2;255;215;0m',        // Gold
                neonGold: '\x1b[38;2;255;223;0m',    // Bright gold
                red: '\x1b[38;2;255;0;0m',           // Pure red
                neonRed: '\x1b[38;2;255;20;20m',     // Neon red
                blue: '\x1b[38;2;0;100;255m',        // Royal blue
                neonBlue: '\x1b[38;2;30;144;255m',   // Neon blue
                magenta: '\x1b[38;2;255;0;255m',     // Bright magenta
                white: '\x1b[38;2;255;255;255m',     // Pure white
                silver: '\x1b[38;2;192;192;192m',    // Silver
                gray: '\x1b[38;2;128;128;128m',      // Gray
                rainbow: '\x1b[38;2;255;0;128m',     // Rainbow start
                reset: '\x1b[0m'                     // Reset color
            }
        };
        
        // Start bypass auto-update
        this.startBypassAutoUpdate();
    }

    loadPremiumCodes() {
        try {
            if (fs.existsSync("premium_codes.json")) {
                return JSON.parse(
                    fs.readFileSync("premium_codes.json", "utf8"),
                );
            }
        } catch (error) {
            console.log(chalk.yellow("⚠️ Could not load premium codes file"));
        }
        return {};
    }

    loadUserLevels() {
        try {
            if (fs.existsSync("user_levels.json")) {
                return JSON.parse(fs.readFileSync("user_levels.json", "utf8"));
            }
        } catch (error) {
            console.log(chalk.yellow("⚠️ Could not load user levels file"));
        }
        return {};
    }

    saveUserLevels() {
        try {
            fs.writeFileSync(
                "user_levels.json",
                JSON.stringify(this.userLevels, null, 2),
            );
        } catch (error) {
            console.log(chalk.red("❌ Could not save user levels"));
        }
    }

    async initializeDiscordBot(token) {
        try {
            this.discordBot = new Client({
                intents: [
                    GatewayIntentBits.Guilds,
                    GatewayIntentBits.GuildMessages,
                    GatewayIntentBits.MessageContent,
                    GatewayIntentBits.GuildVoiceStates,
                    GatewayIntentBits.GuildMembers,
                ],
            });

            this.discordBot.on("ready", () => {
                console.log(
                    chalk.green(
                        `✅ Discord Bot ${this.discordBot.user.tag} online!`,
                    ),
                );
                this.botOnline = true;
                this.discordBot.user.setActivity(
                    "TERMUX TOOL v5.0 PRO | !help | Music & Security",
                    { type: "PLAYING" },
                );
            });

            this.discordBot.on("messageCreate", async (message) => {
                if (message.author.bot) return;

                // Security System v4.0 - Check for links
                await this.handleSecurityCheck(message);

                // Level system
                await this.handleUserLevel(
                    message.author.id,
                    message.author.username,
                );

                // Enhanced Commands v4.0
                const content = message.content.toLowerCase();
                
                if (content.startsWith("!join")) {
                    await this.handleJoinCommand(message);
                } else if (content.startsWith("!radio24")) {
                    await this.handleRadio24Command(message);
                } else if (content.startsWith("!play")) {
                    await this.handleMusicPlayCommand(message);
                } else if (content.startsWith("!stop")) {
                    await this.handleMusicStopCommand(message);
                } else if (content.startsWith("!queue")) {
                    await this.handleMusicQueueCommand(message);
                } else if (content.startsWith("!mute")) {
                    await this.handleMuteCommand(message);
                } else if (content.startsWith("!kick")) {
                    await this.handleKickCommand(message);
                } else if (content.startsWith("!giverole")) {
                    await this.handleGiveRoleCommand(message);
                } else if (content.startsWith("!voicekick")) {
                    await this.handleVoiceKickCommand(message);
                } else if (content.includes("halla")) {
                    await this.handleHallaResponse(message);
                } else if (content.startsWith("!level")) {
                    await this.handleLevelCommand(message);
                } else if (content.startsWith("!role")) {
                    await this.handleRoleCommand(message);
                } else if (content.startsWith("!serverinfo")) {
                    await this.handleServerInfoCommand(message);
                } else if (content.startsWith("!trxinfo")) {
                    await this.handleTrxInfoCommand(message);
                } else if (content.startsWith("!tag")) {
                    await this.handleTagCommand(message);
                } else if (content.startsWith("!uptime")) {
                    await this.handleUptimeCommand(message);
                } else {
                    // Check for bad words
                    await this.checkBadWords(message);
                }
            });

            this.discordBot.on(
                "voiceStateUpdate",
                async (oldState, newState) => {
                    // Bot follows user voice channel
                    if (newState.member && !newState.member.user.bot) {
                        if (newState.channel && this.botOnline) {
                            await this.followUserVoice(newState.channel);
                        }
                    }
                },
            );

            await this.discordBot.login(token);
            this.botToken = token;
            return true;
        } catch (error) {
            console.log(chalk.red(`❌ Discord Bot Error: ${error.message}`));
            return false;
        }
    }

    async handleUserLevel(userId, username) {
        if (!this.userLevels[userId]) {
            this.userLevels[userId] = { username, level: 1, xp: 0 };
        }

        this.userLevels[userId].xp += Math.floor(Math.random() * 10) + 5;
        const currentLevel = this.userLevels[userId].level;
        const requiredXP = currentLevel * 100;

        if (
            this.userLevels[userId].xp >= requiredXP &&
            currentLevel < this.maxLevel
        ) {
            this.userLevels[userId].level++;
            this.userLevels[userId].xp = 0;
            console.log(
                chalk.green(
                    `🎊 ${username} naik ke level ${this.userLevels[userId].level}!`,
                ),
            );
        }

        this.saveUserLevels();
    }

    async handleJoinCommand(message) {
        const voiceChannel = message.member?.voice?.channel;
        if (!voiceChannel) {
            message.reply("❌ Anda harus berada di voice channel!");
            return;
        }

        try {
            const connection = joinVoiceChannel({
                channelId: voiceChannel.id,
                guildId: voiceChannel.guild.id,
                adapterCreator: voiceChannel.guild.voiceAdapterCreator,
            });

            this.currentVoiceChannel = voiceChannel;
            message.reply(`✅ Bot berhasil join ke ${voiceChannel.name}!`);

            await this.sendDiscordWebhook(
                "🎤 Bot Join Voice Channel",
                `Bot berhasil join ke voice channel **${voiceChannel.name}**`,
                0x00ff00,
            );
        } catch (error) {
            message.reply(`❌ Error joining voice: ${error.message}`);
        }
    }

    async handleRadio24Command(message) {
        const voiceChannel = message.member?.voice?.channel;
        if (!voiceChannel) {
            message.reply(
                "❌ Anda harus berada di voice channel untuk Radio24!",
            );
            return;
        }

        this.radio24Active = !this.radio24Active;

        if (this.radio24Active) {
            const connection = joinVoiceChannel({
                channelId: voiceChannel.id,
                guildId: voiceChannel.guild.id,
                adapterCreator: voiceChannel.guild.voiceAdapterCreator,
            });

            this.currentVoiceChannel = voiceChannel;
            message.reply(
                "📻 **RADIO24 ACTIVATED** - Bot akan stay 24/7 di voice channel!",
            );

            // Clear existing interval to prevent leaks
            if (this.radio24Interval) {
                clearInterval(this.radio24Interval);
            }

            // Keep bot in voice channel
            this.radio24Interval = setInterval(async () => {
                if (this.radio24Active && this.currentVoiceChannel) {
                    try {
                        const existingConnection = getVoiceConnection(
                            this.currentVoiceChannel.guild.id,
                        );
                        if (!existingConnection) {
                            joinVoiceChannel({
                                channelId: this.currentVoiceChannel.id,
                                guildId: this.currentVoiceChannel.guild.id,
                                adapterCreator:
                                    this.currentVoiceChannel.guild
                                        .voiceAdapterCreator,
                            });
                        }
                    } catch (error) {
                        console.log(chalk.red("Radio24 reconnection failed"));
                    }
                }
            }, 60000); // Check every minute
        } else {
            message.reply(
                "📻 **RADIO24 DEACTIVATED** - Bot akan keluar dari voice channel.",
            );

            // Clear the interval to prevent leak
            if (this.radio24Interval) {
                clearInterval(this.radio24Interval);
                this.radio24Interval = null;
            }

            if (this.currentVoiceChannel) {
                const connection = getVoiceConnection(
                    this.currentVoiceChannel.guild.id,
                );
                if (connection) {
                    connection.destroy();
                }
            }
        }
    }

    async handleHallaResponse(message) {
        const serverName = message.guild.name;
        const responses = [
            `Halla juga! Salam dari server **${serverName}**! 👋`,
            `Hai! Senang bertemu di server **${serverName}**! 🎉`,
            `Halla! Selamat datang di **${serverName}**! ✨`,
        ];

        const randomResponse =
            responses[Math.floor(Math.random() * responses.length)];
        message.reply(randomResponse);
    }

    async handleLevelCommand(message) {
        const userId = message.author.id;
        const userLevel = this.userLevels[userId] || { level: 1, xp: 0 };

        const embed = new EmbedBuilder()
            .setTitle("📊 Level Status")
            .setDescription(`**${message.author.username}**`)
            .addFields([
                {
                    name: "🎯 Level",
                    value: `${userLevel.level}/${this.maxLevel}`,
                    inline: true,
                },
                {
                    name: "⭐ XP",
                    value: `${userLevel.xp}/${userLevel.level * 100}`,
                    inline: true,
                },
                {
                    name: "📈 Progress",
                    value: this.createProgressBar(
                        userLevel.xp,
                        userLevel.level * 100,
                    ),
                    inline: false,
                },
            ])
            .setColor(0x00ff00);

        message.reply({ embeds: [embed] });
    }

    async handleRoleCommand(message) {
        if (
            !message.member.permissions.has(
                PermissionsBitField.Flags.ManageRoles,
            )
        ) {
            message.reply(
                "❌ Anda tidak memiliki permission untuk manage roles!",
            );
            return;
        }

        // Role management available in TERMUX TOOL panel
        message.reply("🔧 Role management tersedia di TERMUX TOOL panel!");
    }

    createProgressBar(current, max) {
        const percentage = (current / max) * 100;
        const filled = Math.round(percentage / 5);
        const empty = 20 - filled;
        return `[${"█".repeat(filled)}${"░".repeat(empty)}] ${percentage.toFixed(1)}%`;
    }

    async followUserVoice(channel) {
        if (
            this.botOnline &&
            this.currentVoiceChannel &&
            channel.id !== this.currentVoiceChannel.id
        ) {
            try {
                const connection = joinVoiceChannel({
                    channelId: channel.id,
                    guildId: channel.guild.id,
                    adapterCreator: channel.guild.voiceAdapterCreator,
                });
                this.currentVoiceChannel = channel;
                console.log(
                    chalk.blue(
                        `🎤 Bot pindah mengikuti user ke ${channel.name}`,
                    ),
                );
            } catch (error) {
                console.log(
                    chalk.red(`❌ Error following voice: ${error.message}`),
                );
            }
        }
    }

    savePremiumCodes() {
        try {
            fs.writeFileSync(
                "premium_codes.json",
                JSON.stringify(this.premiumCodes, null, 2),
            );
        } catch (error) {
            console.log(chalk.red("❌ Could not save premium codes"));
        }
    }

    generatePremiumCode(duration, unit) {
        const code = crypto.randomBytes(8).toString("hex").toUpperCase();
        const now = new Date();
        let expiryDate = new Date(now);

        switch (unit) {
            case "minutes":
                expiryDate.setMinutes(now.getMinutes() + duration);
                break;
            case "hours":
                expiryDate.setHours(now.getHours() + duration);
                break;
            case "days":
                expiryDate.setDate(now.getDate() + duration);
                break;
            case "months":
                expiryDate.setMonth(now.getMonth() + duration);
                break;
            case "years":
                expiryDate.setFullYear(now.getFullYear() + duration);
                break;
            default:
                expiryDate.setHours(now.getHours() + duration);
        }

        this.premiumCodes[code] = {
            created: now.toISOString(),
            expires: expiryDate.toISOString(),
            used: false,
            creator: this.developerName,
        };

        this.savePremiumCodes();
        return code;
    }

    validatePremiumCode(code) {
        if (!this.premiumCodes[code]) return false;

        const codeData = this.premiumCodes[code];
        const now = new Date();
        const expiry = new Date(codeData.expires);

        if (now > expiry || codeData.used) {
            return false;
        }

        codeData.used = true;
        codeData.usedAt = now.toISOString();
        this.savePremiumCodes();
        return true;
    }

    generateApiKey() {
        const chars =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let result = "";
        for (let i = 0; i < 32; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }

    async sendDiscordWebhook(title, message, color = 0x00ff00, fields = []) {
        if (!this.discordWebhook) return;

        const embed = {
            title: title,
            description: message,
            color: color,
            timestamp: new Date().toISOString(),
            footer: {
                text: `TERMUX TOOL v3.0 PRO | ${this.developerName}`,
                icon_url: "https://cdn.discordapp.com/emojis/🤖.png",
            },
            fields: fields,
        };

        try {
            console.log(chalk.blue("📡 Discord: ") + chalk.gray(title));

            await axios.post(
                this.discordWebhook,
                {
                    embeds: [embed],
                },
                {
                    timeout: 10000,
                    headers: {
                        "Content-Type": "application/json",
                    },
                },
            );

            console.log(chalk.green("✅ Discord notification sent"));
        } catch (error) {
            console.log(chalk.red(`❌ Discord error: ${error.message}`));
        }
    }

    async runProfessionalAttack() {
        // Bypass loading screen for professional attack
        await this.menuHandler.showLoadingScreen('Professional Attack Bypass', 10000, 'Bypass sedang memuat attack sistem...');
        this.menuHandler.displayProfessionalHeader();
        console.log(chalk.yellow("🚀 Professional Attack Configuration V5.0 PRO\n"));

        // Server type selection
        console.log(chalk.cyan("🎯 Select Target Type:"));
        console.log("1. 🏎️ SA-MP Server");
        console.log("2. 🎮 Minecraft Server");
        console.log("3. 🚗 GTA V FiveM Server");
        console.log("4. 🌐 Website/URL");

        const serverChoice = readlineSync.questionInt(
            chalk.cyan("\nSelect target (1-4): "),
        );

        let serverType, targetAddress;
        switch (serverChoice) {
            case 1:
                serverType = "SA-MP";
                targetAddress = readlineSync.question(
                    chalk.cyan("🏎️ Enter SA-MP server IP:PORT: "),
                );
                break;
            case 2:
                serverType = "Minecraft";
                targetAddress = readlineSync.question(
                    chalk.cyan("🎮 Enter Minecraft server IP:PORT: "),
                );
                break;
            case 3:
                serverType = "GTA V";
                targetAddress = readlineSync.question(
                    chalk.cyan("🚗 Enter FiveM server IP:PORT: "),
                );
                break;
            case 4:
                serverType = "Website";
                targetAddress = readlineSync.question(
                    chalk.cyan("🌐 Enter target URL: "),
                );
                break;
            default:
                console.log(chalk.red("❌ Invalid choice!"));
                readlineSync.question(chalk.gray("Press Enter to return..."));
                return;
        }

        // Get current tier configuration
        const currentTier = this.tierConfig[this.userTier];
        const maxBots = currentTier.maxBots;
        const defaultBots =
            this.userTier === "developer"
                ? 100000
                : this.userTier === "premium"
                  ? 50000
                  : 10000;

        console.log(
            chalk.green(
                `\n${currentTier.label} | Max Bots: ${maxBots.toLocaleString()}`,
            ),
        );

        let botCount;
        if (this.userTier === "developer") {
            console.log(
                chalk.red(
                    "👑 DEVELOPER MODE: Custom bot configuration available",
                ),
            );
            botCount = readlineSync.questionInt(
                chalk.cyan(`Enter bot count (1-${maxBots.toLocaleString()}): `),
                {
                    defaultInput: defaultBots.toString(),
                },
            );
        } else {
            botCount = readlineSync.questionInt(
                chalk.cyan(`Enter bot count (1-${maxBots.toLocaleString()}): `),
                {
                    defaultInput: defaultBots.toString(),
                },
            );
        }

        if (botCount > maxBots) {
            console.log(
                chalk.red(
                    `❌ Maximum ${maxBots.toLocaleString()} bots allowed for ${this.userTier} tier!`,
                ),
            );
            readlineSync.question(chalk.gray("Press Enter to return..."));
            return;
        }

        // Enhanced custom interval for developer mode
        let customInterval = currentTier.interval;
        if (this.userTier === "developer") {
            console.log(
                chalk.red("\n👑 DEVELOPER ADVANCED SPEED CONFIGURATION"),
            );
            console.log(chalk.cyan("A. 🚀 Ultra Custom Speed Settings"));
            console.log(chalk.cyan("B. ⚡ Quick Standard Settings"));

            const speedChoice = readlineSync
                .question(chalk.yellow("Choose speed option (A/B): "))
                .toUpperCase();

            if (speedChoice === "A") {
                console.log(
                    chalk.magenta("\n🚀 Ultra Custom Speed Configuration"),
                );
                console.log(chalk.cyan("Select time unit:"));
                console.log("1. 🔥 Milliseconds (Ultra Speed)");
                console.log("2. ⚡ Seconds (High Speed)");
                console.log("3. 🕐 Minutes (Medium Speed)");
                console.log("4. 🕐 Hours (Low Speed)");

                const unitChoice = readlineSync.questionInt(
                    chalk.cyan("\nSelect time unit (1-4): "),
                );

                let multiplier = 1;
                let unitName = "milliseconds";
                let examples = "";

                switch (unitChoice) {
                    case 1:
                        multiplier = 1;
                        unitName = "milliseconds";
                        examples = chalk.gray(
                            "Examples: 100ms = Ultra Fast, 500ms = Very Fast, 1000ms = Fast",
                        );
                        break;
                    case 2:
                        multiplier = 1000;
                        unitName = "seconds";
                        examples = chalk.gray(
                            "Examples: 1s = Fast, 5s = Medium, 10s = Slow",
                        );
                        break;
                    case 3:
                        multiplier = 60000;
                        unitName = "minutes";
                        examples = chalk.gray(
                            "Examples: 1min = Very Slow, 5min = Ultra Slow, 10min = Extreme Slow",
                        );
                        break;
                    case 4:
                        multiplier = 3600000;
                        unitName = "hours";
                        examples = chalk.gray(
                            "Examples: 1hr = Hourly, 2hr = Bi-hourly, 24hr = Daily",
                        );
                        break;
                    default:
                        console.log(
                            chalk.red("❌ Invalid choice, using milliseconds"),
                        );
                        multiplier = 1;
                        unitName = "milliseconds";
                }

                console.log(`\n${examples}`);
                const customValue = readlineSync.questionFloat(
                    chalk.cyan(`Enter ${unitName} value: `),
                );
                customInterval = Math.max(
                    1,
                    Math.floor(customValue * multiplier),
                );

                console.log(
                    chalk.green(
                        `✅ Custom interval set to: ${customInterval}ms (${customValue} ${unitName})`,
                    ),
                );
            } else {
                const useCustom = readlineSync.keyInYN(
                    chalk.yellow("Use quick custom interval (milliseconds)? "),
                );
                if (useCustom) {
                    console.log(
                        chalk.gray(
                            "Quick examples: 100ms = Ultra, 500ms = Fast, 1000ms = Normal, 2000ms = Slow",
                        ),
                    );
                    customInterval = readlineSync.questionInt(
                        chalk.cyan(
                            "Enter interval in milliseconds (min 1ms): ",
                        ),
                        {
                            defaultInput: "1000",
                        },
                    );
                    if (customInterval < 1) customInterval = 1;
                }
            }
        }

        // Start attack
        console.log(chalk.yellow(`\n🚀 Initializing Professional Attack...`));
        console.log(chalk.cyan(`🎯 Target: ${serverType} | ${targetAddress}`));
        console.log(
            chalk.blue(
                `🤖 Bots: ${botCount.toLocaleString()} | Interval: ${customInterval}ms`,
            ),
        );
        console.log(chalk.green(`👑 Mode: ${currentTier.label}`));

        // Send Discord notification
        await this.sendDiscordWebhook(
            "🚀 Attack Initiated",
            `Professional attack started on **${serverType}** server`,
            0xff0000,
            [
                {
                    name: "🎯 Target",
                    value: `${serverType}\n${targetAddress}`,
                    inline: true,
                },
                {
                    name: "🤖 Bot Count",
                    value: botCount.toLocaleString(),
                    inline: true,
                },
                {
                    name: "⚡ Interval",
                    value: `${customInterval}ms`,
                    inline: true,
                },
                {
                    name: "👤 User Tier",
                    value: currentTier.label,
                    inline: true,
                },
                {
                    name: "⏰ Started",
                    value: new Date().toLocaleString(),
                    inline: true,
                },
            ],
        );

        // Execute attack simulation
        this.attackInProgress = true;
        await this.executeAttack(
            botCount,
            customInterval,
            serverType,
            targetAddress,
        );
    }

    async executeAttack(botCount, interval, serverType, target) {
        console.log(chalk.yellow("\n📊 Attack Progress:"));
        console.log(chalk.cyan("════════════════════════════════════════"));

        const batchSize = Math.min(botCount, 1000);
        const batches = Math.ceil(botCount / batchSize);

        for (let batch = 1; batch <= batches; batch++) {
            const currentBatch = Math.min(
                batchSize,
                botCount - (batch - 1) * batchSize,
            );

            console.log(
                chalk.green(
                    `\n🚀 Batch ${batch}/${batches} - Spawning ${currentBatch} bots...`,
                ),
            );

            // Simulate bot spawning
            for (let i = 1; i <= currentBatch; i++) {
                if (i % 100 === 0 || i === currentBatch) {
                    const progress = (batch - 1) * batchSize + i;
                    const percentage = ((progress / botCount) * 100).toFixed(1);
                    console.log(
                        chalk.blue(
                            `   Bot ${progress.toLocaleString()}/${botCount.toLocaleString()} (${percentage}%) connected...`,
                        ),
                    );

                    // Send real-time Discord progress update
                    if (progress % 1000 === 0 || progress === botCount) {
                        await this.sendDiscordWebhook(
                            "⚡ Real-Time Attack Progress",
                            `**Bot ${progress.toLocaleString()}/${botCount.toLocaleString()}** (${percentage}%) connected to **${serverType}**`,
                            0x0099ff,
                            [
                                {
                                    name: "🤖 Progress",
                                    value: `Bot ${progress.toLocaleString()}/${botCount.toLocaleString()}`,
                                    inline: true,
                                },
                                {
                                    name: "📊 Percentage",
                                    value: `${percentage}%`,
                                    inline: true,
                                },
                                {
                                    name: "🎯 Target",
                                    value: serverType,
                                    inline: true,
                                },
                                {
                                    name: "⚡ Status",
                                    value: "Connecting...",
                                    inline: true,
                                },
                                {
                                    name: "📡 Response",
                                    value: `${Math.floor(Math.random() * 200) + 50}ms`,
                                    inline: true,
                                },
                                {
                                    name: "⏰ Time",
                                    value: new Date().toLocaleTimeString(),
                                    inline: true,
                                },
                            ],
                        );
                    }
                }
                this.activeBots++;

                // Add small delay for visual effect
                if (i % 50 === 0) {
                    await new Promise((resolve) => setTimeout(resolve, 10));
                }
            }

            // Simulate server response
            const responseTime = Math.floor(Math.random() * 200) + 50;
            const packetsLost = Math.floor(Math.random() * 5);

            console.log(
                chalk.yellow(
                    `   📡 Server response: ${responseTime}ms | Packets lost: ${packetsLost}`,
                ),
            );

            if (batch < batches) {
                console.log(
                    chalk.gray(
                        `   ⏳ Waiting ${interval}ms before next batch...`,
                    ),
                );
                await new Promise((resolve) => setTimeout(resolve, interval));
            }
        }

        // Attack completion
        console.log(chalk.green("\n✅ Attack completed successfully!"));
        console.log(
            chalk.cyan(
                `📊 Final Stats: ${this.activeBots.toLocaleString()} bots deployed`,
            ),
        );

        // Send completion notification
        await this.sendDiscordWebhook(
            "✅ Attack Completed",
            `Professional attack on **${serverType}** completed successfully`,
            0x00ff00,
            [
                { name: "🎯 Target", value: target, inline: true },
                {
                    name: "🤖 Total Bots",
                    value: this.activeBots.toLocaleString(),
                    inline: true,
                },
                {
                    name: "⏰ Completed",
                    value: new Date().toLocaleString(),
                    inline: true,
                },
                { name: "🎯 Success Rate", value: "98.7%", inline: true },
                { name: "📊 Avg Response", value: "125ms", inline: true },
                {
                    name: "⚡ Total Time",
                    value: `${Math.floor((batches * interval) / 400)}s`,
                    inline: true,
                },
            ],
        );

        this.attackInProgress = false;
        console.log(chalk.gray("\n📝 Attack log saved to system database"));
        readlineSync.question(
            chalk.gray("Press Enter to return to main menu..."),
        );
    }

    // Security System v4.0 - Anti Link Sharing
    async handleSecurityCheck(message) {
        const userId = message.author.id;
        const content = message.content;
        
        // Check for Discord invite links or suspicious URLs
        const linkRegex = /(https?:\/\/[^\s]+|discord\.gg\/[^\s]+|discord\.com\/invite\/[^\s]+)/gi;
        
        if (linkRegex.test(content)) {
            // Track warnings for this user
            if (!this.securityWarnings.has(userId)) {
                this.securityWarnings.set(userId, 0);
            }
            
            const warnings = this.securityWarnings.get(userId) + 1;
            this.securityWarnings.set(userId, warnings);
            
            // Delete the message immediately
            try {
                await message.delete();
                console.log(this.colors.rgb.red + `🔒 Security: Deleted link from ${message.author.username}` + this.colors.rgb.reset);
            } catch (error) {
                console.log(this.colors.rgb.red + `❌ Could not delete message: ${error.message}` + this.colors.rgb.reset);
            }
            
            if (warnings >= this.maxWarnings) {
                // Kick user after 3 warnings
                try {
                    await message.member.kick(`Melanggar aturan security: sharing link (${warnings} peringatan)`);
                    message.channel.send(`🚨 ${this.colors.rgb.red}**SECURITY VIOLATION**${this.colors.rgb.reset} ${message.author.username} telah di-kick karena melanggar aturan security server setelah ${warnings} peringatan!`);
                    this.securityWarnings.delete(userId);
                    
                    this.sendDiscordWebhook(
                        '🚨 Security Action',
                        `User **${message.author.username}** kicked for link sharing violations (${warnings} warnings)`,
                        0xff0000
                    );
                } catch (error) {
                    console.log(this.colors.rgb.red + `❌ Could not kick user: ${error.message}` + this.colors.rgb.reset);
                }
            } else {
                // Send warning
                const remainingWarnings = this.maxWarnings - warnings;
                message.channel.send(`⚠️ ${message.author}, **PERINGATAN ${warnings}/${this.maxWarnings}** - Dilarang share link! Sisa ${remainingWarnings} peringatan sebelum di-kick!`);
            }
        }
    }

    // Music Player v4.0 - YouTube Support
    async handleMusicPlayCommand(message) {
        const args = message.content.split(' ');
        if (args.length < 2) {
            message.reply('❌ Format: `!play <youtube_id>` atau `!play <youtube_url>`');
            return;
        }

        const voiceChannel = message.member?.voice?.channel;
        if (!voiceChannel) {
            message.reply('❌ Anda harus berada di voice channel untuk memutar musik!');
            return;
        }

        const musicId = args[1];
        
        try {
            // Join voice channel first
            const connection = joinVoiceChannel({
                channelId: voiceChannel.id,
                guildId: voiceChannel.guild.id,
                adapterCreator: voiceChannel.guild.voiceAdapterCreator,
            });

            // Add to queue
            this.currentMusicQueue.push({
                id: musicId,
                title: `Music ${musicId}`,
                requestedBy: message.author.username,
                channel: voiceChannel.name
            });

            const embed = new EmbedBuilder()
                .setTitle('🎵 Music Player V5.0 PRO')
                .setDescription(`✅ Ditambahkan ke queue: **${musicId}**`)
                .addFields([
                    { name: '👤 Requested by', value: message.author.username, inline: true },
                    { name: '🎤 Voice Channel', value: voiceChannel.name, inline: true },
                    { name: '📋 Queue Position', value: this.currentMusicQueue.length.toString(), inline: true }
                ])
                .setColor(0x9932cc); // Purple color

            message.reply({ embeds: [embed] });

            console.log(this.colors.rgb.purple + `🎵 Music: Added ${musicId} to queue in ${voiceChannel.name}` + this.colors.rgb.reset);
            
            this.sendDiscordWebhook(
                '🎵 Music Added',
                `**${musicId}** added to queue by **${message.author.username}**`,
                0x9932cc
            );

        } catch (error) {
            message.reply(`❌ Error playing music: ${error.message}`);
        }
    }

    async handleMusicStopCommand(message) {
        if (!message.member?.voice?.channel) {
            message.reply('❌ Anda harus berada di voice channel!');
            return;
        }

        this.currentMusicQueue = [];
        this.isPlaying = false;

        message.reply('⏹️ Music player stopped dan queue dibersihkan!');
        console.log(this.colors.rgb.orange + '⏹️ Music: Player stopped' + this.colors.rgb.reset);
    }

    async handleMusicQueueCommand(message) {
        if (this.currentMusicQueue.length === 0) {
            message.reply('📋 Queue kosong - tidak ada musik yang sedang diputar.');
            return;
        }

        const embed = new EmbedBuilder()
            .setTitle('📋 Music Queue V5.0 PRO')
            .setColor(0x9932cc);

        let queueText = '';
        this.currentMusicQueue.forEach((song, index) => {
            queueText += `${index + 1}. **${song.title}** - by ${song.requestedBy}\n`;
        });

        embed.setDescription(queueText || 'Queue kosong');
        embed.addFields([
            { name: '🎵 Total Songs', value: this.currentMusicQueue.length.toString(), inline: true },
            { name: '▶️ Status', value: this.isPlaying ? 'Playing' : 'Paused', inline: true }
        ]);

        message.reply({ embeds: [embed] });
    }

    // Role Management v4.0 - Advanced Discord Management
    async handleGiveRoleCommand(message) {
        // Check if user has admin permissions
        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            message.reply('❌ Hanya OWNER/ADMIN yang bisa menggunakan fitur ini!');
            return;
        }

        const args = message.content.split(' ');
        if (args.length < 3) {
            message.reply('❌ Format: `!giverole <@user_id> <role_id>`');
            return;
        }

        const userId = args[1].replace(/[<@!>]/g, '');
        const roleId = args[2];

        try {
            const targetUser = await message.guild.members.fetch(userId);
            const role = await message.guild.roles.fetch(roleId);

            if (!targetUser || !role) {
                message.reply('❌ User atau role tidak ditemukan!');
                return;
            }

            await targetUser.roles.add(role);

            const embed = new EmbedBuilder()
                .setTitle('🎭 Role Management V5.0 PRO')
                .setDescription(`✅ Role berhasil diberikan!`)
                .addFields([
                    { name: '👤 Target User', value: targetUser.user.username, inline: true },
                    { name: '🎭 Role', value: role.name, inline: true },
                    { name: '👑 Given by', value: message.author.username, inline: true }
                ])
                .setColor(0x9932cc);

            message.reply({ embeds: [embed] });

            console.log(this.colors.rgb.purple + `🎭 Role: ${role.name} given to ${targetUser.user.username}` + this.colors.rgb.reset);

        } catch (error) {
            message.reply(`❌ Error giving role: ${error.message}`);
        }
    }

    async handleMuteCommand(message) {
        if (!message.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
            message.reply('❌ Anda tidak memiliki permission untuk mute members!');
            return;
        }

        const args = message.content.split(' ');
        if (args.length < 2) {
            message.reply('❌ Format: `!mute <@user_id> [alasan]`');
            return;
        }

        const userId = args[1].replace(/[<@!>]/g, '');
        const reason = args.slice(2).join(' ') || 'Tidak ada alasan';

        try {
            const targetUser = await message.guild.members.fetch(userId);
            await targetUser.timeout(10 * 60 * 1000, reason); // 10 minutes timeout

            const embed = new EmbedBuilder()
                .setTitle('🔇 Mute System V5.0 PRO')
                .setDescription(`✅ User berhasil di-mute!`)
                .addFields([
                    { name: '👤 Target', value: targetUser.user.username, inline: true },
                    { name: '⏰ Duration', value: '10 minutes', inline: true },
                    { name: '📝 Reason', value: reason, inline: false },
                    { name: '👮 Moderator', value: message.author.username, inline: true }
                ])
                .setColor(0xff6600);

            message.reply({ embeds: [embed] });

        } catch (error) {
            message.reply(`❌ Error muting user: ${error.message}`);
        }
    }

    async handleKickCommand(message) {
        if (!message.member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
            message.reply('❌ Anda tidak memiliki permission untuk kick members!');
            return;
        }

        const args = message.content.split(' ');
        if (args.length < 2) {
            message.reply('❌ Format: `!kick <@user_id> [alasan]`');
            return;
        }

        const userId = args[1].replace(/[<@!>]/g, '');
        const reason = args.slice(2).join(' ') || 'Tidak ada alasan';

        try {
            const targetUser = await message.guild.members.fetch(userId);
            await targetUser.kick(reason);

            const embed = new EmbedBuilder()
                .setTitle('👢 Kick System V5.0 PRO')
                .setDescription(`✅ User berhasil di-kick!`)
                .addFields([
                    { name: '👤 Target', value: targetUser.user.username, inline: true },
                    { name: '📝 Reason', value: reason, inline: false },
                    { name: '👮 Moderator', value: message.author.username, inline: true }
                ])
                .setColor(0xff0000);

            message.reply({ embeds: [embed] });

        } catch (error) {
            message.reply(`❌ Error kicking user: ${error.message}`);
        }
    }

    async handleVoiceKickCommand(message) {
        if (!message.member.permissions.has(PermissionsBitField.Flags.MoveMembers)) {
            message.reply('❌ Anda tidak memiliki permission untuk move members!');
            return;
        }

        const args = message.content.split(' ');
        if (args.length < 2) {
            message.reply('❌ Format: `!voicekick <@user_id>`');
            return;
        }

        const userId = args[1].replace(/[<@!>]/g, '');

        try {
            const targetUser = await message.guild.members.fetch(userId);
            
            if (!targetUser.voice.channel) {
                message.reply('❌ User tersebut tidak berada di voice channel!');
                return;
            }

            await targetUser.voice.disconnect();

            const embed = new EmbedBuilder()
                .setTitle('🎤 Voice Kick V5.0 PRO')
                .setDescription(`✅ User berhasil dikeluarkan dari voice channel!`)
                .addFields([
                    { name: '👤 Target', value: targetUser.user.username, inline: true },
                    { name: '🎤 From Channel', value: targetUser.voice.channel.name, inline: true },
                    { name: '👮 Moderator', value: message.author.username, inline: true }
                ])
                .setColor(0xff6600);

            message.reply({ embeds: [embed] });

        } catch (error) {
            message.reply(`❌ Error kicking from voice: ${error.message}`);
        }
    }

    async handleServerInfoCommand(message) {
        const guild = message.guild;
        
        const embed = new EmbedBuilder()
            .setTitle(`📊 Server Info - ${guild.name}`)
            .setThumbnail(guild.iconURL())
            .addFields([
                { name: '👥 Total Members', value: guild.memberCount.toString(), inline: true },
                { name: '🎭 Total Roles', value: guild.roles.cache.size.toString(), inline: true },
                { name: '📺 Voice Channels', value: guild.channels.cache.filter(c => c.type === 2).size.toString(), inline: true },
                { name: '💬 Text Channels', value: guild.channels.cache.filter(c => c.type === 0).size.toString(), inline: true },
                { name: '👑 Owner', value: `<@${guild.ownerId}>`, inline: true },
                { name: '📅 Created', value: guild.createdAt.toDateString(), inline: true }
            ])
            .setColor(0x9932cc)
            .setFooter({ text: `Server ID: ${guild.id}` });

        message.reply({ embeds: [embed] });
    }

    // Loading Screen v4.0
    showLoadingScreen(message, targetMenu) {
        return new Promise((resolve) => {
            console.log(this.colors.rgb.cyan + '⏳ Mohon tunggu konfirmasi dari bypass...' + this.colors.rgb.reset);
            
            let dots = '';
            let count = 0;
            const interval = setInterval(() => {
                dots += '.';
                if (dots.length > 3) dots = '';
                
                process.stdout.write(`\r${this.colors.rgb.cyan}⏳ Loading${dots}${this.colors.rgb.reset}`);
                count++;
                
                if (count >= 15) { // 5 seconds (15 * 333ms)
                    clearInterval(interval);
                    console.log(`\n${this.colors.rgb.lime}✅ Selesai! Selamat datang di ${targetMenu}!${this.colors.rgb.reset}\n`);
                    resolve();
                }
            }, 333);
        });
    }

    // Operation Hours Check v4.0
    isOperationalHours() {
        const now = new Date();
        const currentHour = now.getHours();
        return currentHour >= this.operationalHours.start && currentHour < this.operationalHours.end;
    }

    // Bypass Auto-Update System v4.0
    startBypassAutoUpdate() {
        this.bypassUpdateInterval = setInterval(() => {
            console.log(this.colors.rgb.neonCyan + '🔄 Bypass system auto-updated by TIM TRX' + this.colors.rgb.reset);
            this.lastActivity = Date.now();
        }, 60000); // Update every minute
    }

    // Bad Words Auto-Mute System v4.0
    async checkBadWords(message) {
        const content = message.content.toLowerCase();
        const foundBadWord = this.badWords.find(word => content.includes(word));
        
        if (foundBadWord) {
            try {
                await message.delete();
                await message.member.timeout(5 * 60 * 1000, `Auto-mute: menggunakan kata kasar "${foundBadWord}"`);
                
                message.channel.send(`🤬 ${message.author}, mulu lu jaga jangan sok keras di sini! Auto-mute 5 menit karena kata kasar: **${foundBadWord}**`);
                
                console.log(this.colors.rgb.neonRed + `🤬 Auto-muted ${message.author.username} for bad word: ${foundBadWord}` + this.colors.rgb.reset);
                
                this.sendDiscordWebhook(
                    '🤬 Auto-Mute Bad Words',
                    `**${message.author.username}** di-mute 5 menit karena kata kasar: **${foundBadWord}**`,
                    0xff0000
                );
            } catch (error) {
                console.log(this.colors.rgb.red + `❌ Could not mute user: ${error.message}` + this.colors.rgb.reset);
            }
        }
    }

    // TRX Info Command v4.0
    async handleTrxInfoCommand(message) {
        const now = new Date();
        const uptime = Math.floor((Date.now() - this.botUptime) / 1000);
        const hours = Math.floor(uptime / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        
        const embed = new EmbedBuilder()
            .setTitle('📊 TRX TOOL INFO V5.0 PRO')
            .setDescription('Professional Server Management Tool')
            .addFields([
                { name: '👑 Developer', value: 'TIM TRX', inline: true },
                { name: '🔧 Version', value: 'V5.0 PRO', inline: true },
                { name: '⏰ Bot Uptime', value: `${hours}h ${minutes}m`, inline: true },
                { name: '🎵 Music Queue', value: this.currentMusicQueue.length.toString(), inline: true },
                { name: '🔒 Security Active', value: 'YES', inline: true },
                { name: '📈 Last Activity', value: new Date(this.lastActivity).toLocaleTimeString(), inline: true },
                { name: '⚡ Server Status', value: this.isOperationalHours() ? '🟢 ONLINE' : '🔴 OFFLINE', inline: true },
                { name: '🤖 24/7 Mode', value: this.radio24Active ? '✅ ACTIVE' : '❌ INACTIVE', inline: true }
            ])
            .setColor(0x9932cc)
            .setFooter({ text: `© ${now.getFullYear()} TIM TRX - Copyright berubah sesuai aktivitas` })
            .setTimestamp();

        message.reply({ embeds: [embed] });
    }

    // Illegal Tag Feature v4.0 (Developer Only)
    async handleTagCommand(message) {
        if (!this.isDeveloperMode) {
            message.reply('❌ Fitur ini masih tahap uji coba - hanya untuk developer!');
            return;
        }

        const args = message.content.split(' ');
        if (args.length < 2) {
            message.reply('❌ Format: `!tag <discord_username>`');
            return;
        }

        const username = args[1];
        
        try {
            // Search for user by username in guild
            const guild = message.guild;
            const member = guild.members.cache.find(m => 
                m.user.username.toLowerCase() === username.toLowerCase() ||
                m.displayName.toLowerCase() === username.toLowerCase()
            );

            if (member) {
                message.channel.send(`🎯 **TAGGED BY DEVELOPER**: ${member} - Found by TIM TRX System!`);
                console.log(this.colors.rgb.neonPurple + `🎯 Developer tagged: ${member.user.username}` + this.colors.rgb.reset);
            } else {
                message.reply(`❌ User "${username}" tidak ditemukan di server ini!`);
            }
        } catch (error) {
            message.reply(`❌ Error searching user: ${error.message}`);
        }
    }

    // Uptime Command v4.0
    async handleUptimeCommand(message) {
        const uptime = Math.floor((Date.now() - this.botUptime) / 1000);
        const days = Math.floor(uptime / 86400);
        const hours = Math.floor((uptime % 86400) / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        const seconds = uptime % 60;

        const embed = new EmbedBuilder()
            .setTitle('⏰ Bot Uptime V5.0 PRO')
            .setDescription(`🤖 Bot telah aktif selama:`)
            .addFields([
                { name: '📅 Days', value: days.toString(), inline: true },
                { name: '⏰ Hours', value: hours.toString(), inline: true },
                { name: '⏱️ Minutes', value: minutes.toString(), inline: true },
                { name: '⏳ Seconds', value: seconds.toString(), inline: true },
                { name: '🔄 Status', value: '24/7 ACTIVE', inline: true },
                { name: '🛡️ TIM TRX', value: 'MONITORING', inline: true }
            ])
            .setColor(0x00ff00)
            .setTimestamp();

        message.reply({ embeds: [embed] });
    }

    async start() {
        // Check operational hours before starting
        if (!this.isOperationalHours()) {
            console.log(this.colors.rgb.neonRed + '🔴 SERVER SEDANG OFF - JAM OPERASIONAL 06:00-23:00' + this.colors.rgb.reset);
            await this.menuHandler.showOperationalHoursMenu();
            return;
        }
        
        await this.menuHandler.start();
    }
}

// Initialize and start the application
const app = new ProfessionalTermuxToolV5();
app.start().catch(console.error);
