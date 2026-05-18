# Four Frogs

![Game Preview](/public/img/game-preview.jpg)

Four player capture the flag game. Each player gets three bugs to start, if you lose all your bugs and you are eliminated. You can cross into other frogs zones to take their bugs but if they touch you while in their zone they send you back to your zone and stun you for a short period. Random powerups spawn at certain times that can change certain aspects of the game.

## Getting Started

First you will need to setup a .env file from the .env.sample provided.

Then development server can be run:

```bash
npm run dev
```

## Multiplayer

Multiplayer via websockets using socket.io and an express backend. 

Planning to open source backend code soon.

Also planning to do a peer-to-peer multiplayer method one day.

## Scripts

In the scripts folder is reset_public and sync_to_s3. This is only for Articles Media usage. Allows for putting public folder to CloudFront to lower Vercel charges for the public facing site.

## TODO 

Fix InviteModal logic  

## Attributions

[Background image - Vector Stock](https://www.vectorstock.com/royalty-free-vector/serene-forest-pond-scene-vector-8116691)  
[3D Bug Models - Google]()  
