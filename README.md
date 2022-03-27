# Luogu-Scoreboard-Displayer

A software that displays contest scoreboards in Luogu, with auto-refresh, auto-scroll and auto-fetch 5-minute record count (Mod only). The software runs via NW.js.

## How to use

1. Download NW.js and the source code of this repo.
2. Run or pack the software on your computer.

After opening the software, you are required to input the contest ID. Then, a window will pop out, asking you to enter your account of Luogu (as anonymous user cannot fetch scoreboards of running contests). After loging in, you can close the window, and the auto-refresh will start.

## Features

![L1_D25ZF D$R4A B(94O{_J](https://user-images.githubusercontent.com/41613797/160285671-9cdfa303-ba61-42b2-9e02-08c47e1ba4c1.png)

The interface includes:

- 5-minute record count graph (Mod only)
- Contest name, time and status
- Current 5-minute record count information (Mod only)
- Scoreboards with auto-scroll
- First-blood records

5-minute record count will refresh every 15 seconds, and the scoreboard with contest information will refresh every 30 seconds.

The program uses [Font Awesome](https://fontawesome.com/) for icon designs.
