/**
 * CIDs for quick UI population:
 * - `metadataCID` points to the off‐chain JSON that contains title & synopsis.
 * - `textCID` points to the raw story text (e.g. up to 1,000 words).
 * - `imageCID` points to the cover image.
 * Optional: If you want to show title/synopsis client‐side without refetching metadata, you can include them here.
 */

export interface StoryEntry {
  ipId: string;
  ipMetadataCID: string;
  nftMetadataCID: string;
  contentCID: string;
  imageCID: string;
  title?: string;
  synopsis?: string;
}

export interface UserEntry {
  userName: string;
  walletAddress: string;
  stories: StoryEntry[];
}

//Hard‐coded user data for dashboard display.

export const users: UserEntry[] = [
  {
    userName: "Nat",
    walletAddress: "0x1BB1EB6b6676A6b0850547a70019112c41495BA2",
    stories: [
      {
        ipId: "0x2139d4C281A07fd0311c118b02D396A764894E34",
        ipMetadataCID:
          "bafkreihxoorp34rjyk3c654ephbjwmgbt3dxaetyoazqzdbu4mmyltigzq",
        nftMetadataCID:
          "bafkreiafjforjo4cy4ye4tgl7xyjlhfaxz5ntp4n3qgcdid573vfwtl5ku",
        contentCID:
          "bafkreiaond2f2xj5bhtgjptgnphwn45wqizbhy5ju7z4px7ncfhugp4shu",
        imageCID: "bafybeiammagvjzcc7qln4ni6bjryrxtea5voz326vufkgfspcremp2avbm",
        title: "The Missing Piece",
        synopsis:
          "On the run from her sister’s ruthless regime, Tamara discovers a bloody message in a remote cabin that hints at a deeper truth behind her bloodline and a soul-binding treaty.",
      },
      {
        ipId: "0xf85014aa8ECa28A5c8ceEfcC5dCeFB4416F51f08",
        ipMetadataCID:
          "bafkreihfngnzxlhvzjnp7qyqjvefjxmypg3ke5p4o4lrptlvzqq2rjcdzq",
        nftMetadataCID:
          "bafkreic46pmhqoni66axnbmb4ogkx46kfz6us6xfmohdjj5w53penj7aiq",
        contentCID:
          "bafkreid34mk4ojned6wlylkcvploxqxfcrolmc6dago4zg3gzpaafxzelq",
        imageCID: "bafybeigmqq35e2wly6qy6enenumudd5bbp67h3koascgyuagixrxq5njly",
        title: "The Weight of Truth",
        synopsis:
          "In a crumbling, post-apocalyptic city hunted by Purifier machines, Daniel searches for a genetic heir who can activate a long-lost device to restore humanity",
      },
      {
        ipId: "0x2eAad0B97A190E46F53116f142eD690C8322832A",
        ipMetadataCID:
          "bafkreiaix2m76edrrgzsirl4mjulyv5lyvkt3dfmufz3qz5rd43iej6m24",
        nftMetadataCID:
          "bafkreiae3hof4xymt2v5ezx4c3dukyl43pa5snviv7buba2dcb5ibgsjny",
        contentCID:
          "bafkreia4dsvq4f4uwlcyoaoijqr4yzu4q2ejxkf4vlesdicjzeq4rmcr7m",
        imageCID: "bafybeigmph3prqd4njxbbjetxinp7fyeupdch3d7pq6i3q3jy3b2nrubnq",
        title: "Whispers",
        synopsis:
          "Amid the flickering hope of distant stars and the golden glow of rebellion, a weary captain and a gifted child uncover a cosmic secret that could ignite a new future for humanity.",
      },
      {
        ipId: "0xb07834B2d74cf0F64302a08976c4B3f2F623A4fC",
        ipMetadataCID:
          "bafkreiebaccn373nssmwouffngi4cqogpxrrfkrjcd63py7lzlehu4v5ry",
        nftMetadataCID:
          "bafkreiacqrnew23d7jxhl3gyke3s6tp2uj2mwutxyvbgcnsq4kyubfcnuy",
        contentCID:
          "bafkreibbcy66r7cmzoolta46hh65dkyaiotedtcntpsytxu6rnz4xgim5q",
        imageCID: "bafybeigrawa3glvh6rephb2xfzt5lwed2eghjmfbpafgyyvzdpqf3x7gku",
        title: "First Humans: Temple of Origins",
        synopsis:
          "Ji-Won and Lee-Hyun, members of an advanced ancient civilization, must separate as she joins a secret colonization mission while he stays behind to guide humanity's development through hidden genetic codes.",
      },
      {
        ipId: "0xca5f2e51677519C47C465D5500Bd392efE576bF2",
        ipMetadataCID:
          "bafkreiaamoxi5loefxmvif3fam2y4gk23mohrx4arawbmhpb2krakuzwze",
        nftMetadataCID:
          "bafkreidgatpbpeaehclxhdbclo57nk4jksg66sdlmf3b2k3247jubmogha",
        contentCID:
          "bafkreibwk6c72lsqf4bwedw7ho7jpg4tw2xudfjipuxld6k5fqgv6r24zy",
        imageCID: "bafybeid57w42yhoagkkuesyc36nk5h4pln2pq7v363ipsn7zkce5jvlvpe",
        title: "The Architect's Burden",
        synopsis:
          "In a last-ditch effort to restore Earth's dying ecosystems, Dr. Elena Vasquez builds a machine that demands a human sacrifice to seed new life. But as the device awakens with a mind of its own, she realizes they may have engineered something far more dangerous than salvation.",
      },
      {
        ipId: "0x45A325F92e49061714D1e8426C6E6cF82980b4b3",
        ipMetadataCID:
          "bafkreidp4hwrnvimtqux6dlew4m2az6dreusnhifsve2gopuu4ptqoaho4",
        nftMetadataCID:
          "bafkreiehl2mytm52tuem6vt35mnejfcp7xphdi2oryn75vl44avrpqgpze",
        contentCID:
          "bafkreigmj4iitdyfqkceawmivmi4shjrx7smskefm3bwox6nvx3b3jllya",
        imageCID: "bafybeidwhlfvcyuttnfxrjf5olxa6qi6v6hfjhz6vy7arazvbssuhspefu",
        title: "The Observatory of Broken Hours",
        synopsis:
          "She’s shattered time forty-three times to save him—each attempt a new tragedy etched in broken light. Now, in the one timeline where he truly lives, she must decide if love means letting go.",
      },
      {
        ipId: "0x40Fa07054BA077DBc0Bd85B9A3A52872DCaB7F5A",
        ipMetadataCID:
          "bafkreibu5gafozhq2dwtbjis2pa57domgjisq4auc42twaxxhektvsmnue",
        nftMetadataCID:
          "bafkreibzlzfge6ctahqs7c4r5frsh4hrljogbwz2xmadzqftmzcyiyaqlq",
        contentCID:
          "bafkreib5q6rric2xvehhm4qew42gmhv2otjynxghd4myzar2rpku42zpou",
        imageCID: "bafybeiakuuj3acgyfgnjaf42anwsg7fseiua4zxvdaxkiljpnwawjmvc4q",
        title: "The Gardener",
        synopsis:
          "He hears only silence where others touch the stars. In a world awakening to ancient power, one man must find meaning in what was left behind.",
      },
      {
        ipId: "0x52bC44D1c469eED0aB68E2A8E53eF8502DF61eA3",
        ipMetadataCID:
          "bafkreigtxcbzdcqmfxsqkdxoqbs57b5lx3urxndckrjy4zzgwavhzfxjwy",
        nftMetadataCID:
          "bafkreidsfcxqx7i6zbad5sd65y7z2xxbjfdmcnuiqbpqo3dx2hgjhg5nda",
        contentCID:
          "bafkreibv4peqpku27h6vc6gydfquc6hx7pwvreyj2t6m6lb5yvtaznp2yy",
        imageCID: "bafybeiaysgmmqmjj4z4uxgi7culd46ilgquuhocrqo4o4ajthppespvcra",
        title: "Seeds of Tomorrow",
        synopsis:
          "Born as weapons, they were scattered like seeds across the stars. Now, one woman’s voice will awaken the future humanity never dared to imagine.",
      },
      {
        ipId: "0x4D7f400E116F2Fe83905CFC90008e12af23A9Df8",
        ipMetadataCID:
          "bafkreiayzugcq6xlkmv6xed2wbnluxibfftayt5kxb2coslpbdln6wvw54",
        nftMetadataCID:
          "bafkreigfqrat3wcksfkcilsqoq3d73lqbregctfxedt2nz3f52dflom42i",
        contentCID:
          "bafkreic23tdaf5ae2mfcx37755zzhfgcjxjuiwq6cvoia5qxploznxqmli",
        imageCID: "bafybeiezjgkynmipg5tfshv3twzzlrwt7srpurbve3tqvuj2svmizh3ekm",
        title: "La última peregrinación",
        synopsis:
          "Cuando el amor trasciende el tiempo, el sacrificio se convierte en semilla del despertar. En un mundo al borde del olvido, una promesa silenciosa conecta generaciones aún por nacer.",
      },
      {
        ipId: "0x416B7b95755970ADb54e4A34130d772E04a7e66d",
        ipMetadataCID:
          "bafkreidxzqllnsgxjdbmyle4qbln3rjcgdhgaub6w7lhek4fiu73otfh54",
        nftMetadataCID:
          "bafkreicyibgydlo6au6zfvkykjtn6tfa2qbpvpn6pszman3e27kq66coam",
        contentCID:
          "bafkreibabmfb6gvvl4hkthmymofijb3otc4i5hwcprvhwodtvvnfa3kfne",
        imageCID: "bafybeidlucgmkmholggafxugo5qvqeo76biliqadgwrklk5fyoevgggeua",
        title: "The Architect's Awakening",
        synopsis:
          "When Lee-Hyun awakens to a quantum symphony only he can hear, he discovers the power to weave consciousness into the fabric of reality itself. But building bridges between minds and worlds may cost him everything—even his own existence.",
      },
      {
        ipId: "", // The IP ID returned by Story Protocol
        ipMetadataCID: "",
        nftMetadataCID: "",
        contentCID: "",
        imageCID: "",
        title: "",
        synopsis: "",
      },
      {
        ipId: "", // The IP ID returned by Story Protocol
        ipMetadataCID: "",
        nftMetadataCID: "",
        contentCID: "",
        imageCID: "",
        title: "",
        synopsis: "",
      },
    ],
  },
];
