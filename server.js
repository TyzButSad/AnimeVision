const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const axios = require('axios');
const apicache = require('apicache');
const ejs = require('ejs');

const DiscordRPC = require('discord-rpc');

const app = express();
app.use('', express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
// Définir le répertoire des vues
app.set('views', __dirname + '/public/views');

const cache = apicache.middleware('0 seconds');

DiscordRPC.register('1190598309899931678'); // Remplacez YOUR_APPLICATION_ID par l'ID de votre application Discord
const rpc = new DiscordRPC.Client({ transport: 'ipc' });
rpc.login({ clientId: '1190598309899931678' }).catch(console.error);

rpc.once('ready', () => {
    console.log('Discord RPC connected!');
    rpc.setActivity({
        details: 'Regarde l\'accueil',
        state: 'www.animevision.fr',
        largeImageKey: 'animevision',
        smallImageKey: 'small_image_key',
        buttons: [
            { label: 'Regarder Sur AnimeVision', url: 'https://www.animevision.fr/acceuil' },
        ],
        instance: false,
    });
});

rpc.on('error', console.error);

app.use(bodyParser.json());

const ANIME_VO_URL = 'https://animes-steel.vercel.app/animevo';
const ANIME_VF_URL = 'https://animes-steel.vercel.app/animevf';


//////////////////////////////////// ROUTE PAGE CHARGEMENT ////////////////////////////////////
app.get('/', (req, res) => {
    res.render('index');

    rpc.setActivity({
        details: 'Regarde l\'accueil',
        state: 'www.animevision.fr',
        largeImageKey: 'animevision',
        smallImageKey: 'small_image_key',
        buttons: [
            { label: 'Regarder Sur AnimeVision', url: 'https://www.animevision.fr/acceuil' },
        ],
        instance: false,
    });
});

//////////////////////////////////// ROUTE PAGE DE CONNEXION ////////////////////////////////////
app.get('/login', cache, (request, response) => {
    return response.sendFile('./public/html/login.html', { root: '.' });
    rpc.setActivity({
        details: 'Regarde l\'accueil',
        state: 'www.animevision.fr',
        largeImageKey: 'animevision',
        smallImageKey: 'small_image_key',
        buttons: [
            { label: 'Regarder Sur AnimeVision', url: 'https://www.animevision.fr/acceuil' },
        ],
        instance: false,
    });
});

//////////////////////////////////// ROUTE PAGE INFORMATIONS ////////////////////////////////////
app.get('/auth', cache, (request, response) => {
    return response.sendFile('./public/html/auth.html', { root: '.' });
    rpc.setActivity({
        details: 'Regarde l\'accueil',
        state: 'www.animevision.fr',
        largeImageKey: 'animevision',
        smallImageKey: 'small_image_key',
        buttons: [
            { label: 'Regarder Sur AnimeVision', url: 'https://www.animevision.fr/acceuil' },
        ],
        instance: false,
    });
});

//////////////////////////////////// ROUTE PAGE D'ACCEUIL ////////////////////////////////////
app.get('/acceuil', cache, (request, response) => {
    return response.sendFile('./public/html/acceuil.html', { root: '.' });
    rpc.setActivity({
        details: 'Regarde l\'accueil',
        state: 'www.animevision.fr',
        largeImageKey: 'animevision',
        smallImageKey: 'small_image_key',
        buttons: [
            { label: 'Regarder Sur AnimeVision', url: 'https://www.animevision.fr/acceuil' },
        ],
        instance: false,
    });
});

//////////////////////////////////// ROUTE PAGE DE RECHERCHE ////////////////////////////////////
app.get('/recherche', cache, async (request, response) => {
    try {
        const animeResponseVO = await axios.get(ANIME_VO_URL);
        const animeResponseVF = await axios.get(ANIME_VF_URL);
        const animeDataVO = animeResponseVO.data.map(anime => ({ ...anime, lang: 'VO' }));
        const animeDataVF = animeResponseVF.data.map(anime => ({ ...anime, lang: 'VF' }));

        const combinedAnimeData = [...animeDataVO, ...animeDataVF];

        response.render('recherche', { animes: combinedAnimeData });

    } catch (error) {
        console.error('Erreur lors de la récupération des animes:', error);
        response.status(500).send('Une Erreur est survenue');
    }

    rpc.setActivity({
        details: 'Regarde l\'accueil',
        state: 'www.animevision.fr',
        largeImageKey: 'animevision',
        smallImageKey: 'small_image_key',
        buttons: [
            { label: 'Regarder Sur AnimeVision', url: 'https://www.animevision.fr/acceuil' },
        ],
        instance: false,
    });
});



//////////////////////////////////// ROUTE PAGE D'ANIME ////////////////////////////////////
app.get('/animes', cache, async (request, response) => {
    try {
        const animeResponseVO = await axios.get(ANIME_VO_URL);
        const animeResponseVF = await axios.get(ANIME_VF_URL);
        const animeDataVO = animeResponseVO.data.map(anime => ({ ...anime, lang: 'VO' }));
        const animeDataVF = animeResponseVF.data.map(anime => ({ ...anime, lang: 'VF' }));

        const combinedAnimeData = [...animeDataVO, ...animeDataVF];

        response.render('animes', { animes: combinedAnimeData });

    } catch (error) {
        console.error('Erreur lors de la récupération des animes:', error);
        response.status(500).send('Une Erreur est survenu');
    }

    rpc.setActivity({
        details: 'Regarde l\'accueil',
        state: 'www.animevision.fr',
        largeImageKey: 'animevision',
        smallImageKey: 'small_image_key',
        buttons: [
            { label: 'Regarder Sur AnimeVision', url: 'https://www.animevision.fr/acceuil' },
        ],
        instance: false,
    });
});

//////////////////////////////////// ROUTE PAGE DES DETAILS DE L'ANIME ////////////////////////////////////
app.get('/animes/:langue/:titre', cache, async (request, response) => {
    const titre = request.params.titre;
    const langue = request.params.langue;

    try {
        let animeDetailsURL = '';
        if (langue === 'VO') {
            animeDetailsURL = `${ANIME_VO_URL}/${titre}`;
        } else if (langue === 'VF') {
            animeDetailsURL = `${ANIME_VF_URL}/${titre}`;
        }

        const animeDetailsResponse = await axios.get(animeDetailsURL);
        const animeDetails = animeDetailsResponse.data;

        // Render the template and pass the 'langue' parameter
        response.render('animes-details', { titre, langue, animeDetails, request: request });

    } catch (error) {
        console.error('Erreur lors de la récupération des détails de l\'anime:', error);
        response.status(500).send('Une Erreur est survenue');
    }

    rpc.setActivity({
        details: 'Regarde l\'accueil',
        state: 'www.animevision.fr',
        largeImageKey: 'animevision',
        smallImageKey: 'small_image_key',
        buttons: [
            { label: 'Regarder Sur AnimeVision', url: 'https://www.animevision.fr/acceuil' },
        ],
        instance: false,
    });
    
});

//////////////////////////////////// ROUTE PAGE DE L'EPISODE DE L'ANIME ////////////////////////////////////
app.get('/animes/:langue/:titre/:saison/:episode', cache, async (request, response) => {
    const titre = request.params.titre;
    const langue = request.params.langue;
    const saison = request.params.saison;
    const episode = request.params.episode;

    try {
        let animeDetailsURL = '';
        if (langue === 'VO') {
            animeDetailsURL = `${ANIME_VO_URL}/${titre}/${saison}/${episode}`;
        } else if (langue === 'VF') {
            animeDetailsURL = `${ANIME_VF_URL}/${titre}/${saison}/${episode}`;
        }

        const animeDetailsResponse = await axios.get(animeDetailsURL);
        const animeDetails = animeDetailsResponse.data;

        // Récupération de l'affiche de l'anime
        const affiche = animeDetails.affiche; // Assurez-vous d'ajuster la propriété en fonction de la structure de vos données

        // Intégration de la mise à jour de l'activité Discord RPC
        rpc.setActivity({
            details: `${titre} (${langue})`,
            state: `Saison ${saison} Episode ${episode}`,
            largeImageKey: affiche,
            smallImageKey: 'animevision',
            buttons: [
                { label: 'Regarder Sur AnimeVision', url: `https://www.animevision.fr/animes/${langue}/${encodeURIComponent(titre)}/${saison}/${episode}` },
            ],
            instance: false,
        });

        response.render('episodes', { titre, langue, saison, episode, animeDetailsURL, animeDetails });

    } catch (error) {
        console.error('Erreur lors de la récupération des détails de l\'épisode:', error);
        response.status(500).send('Une Erreur est survenue');
    }
});




app.post('/saveUserId', (req, res) => {
    const userId = req.body.userId;

    mongoose.connect('mongodb+srv://tyz:8UOyaFHyCQ8gEEk1@animesapi.u2cdjuh.mongodb.net/watchlist?retryWrites=true&w=majority&appName=AtlasApp', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log('Connecté à MongoDB');

        const WatchlistSchema = new mongoose.Schema({});

        const Watchlist = mongoose.model(userId, WatchlistSchema);

        Watchlist.findOne({ userId })
            .then(existingUser => {
                if (existingUser) {
                    console.log(`L'utilisateur avec l'ID ${userId} existe déjà dans la watchlist.`);
                    res.status(200).send('ID utilisateur existant dans la watchlist');
                } else {
                    const newWatchlistEntry = new Watchlist({ userId });

                    newWatchlistEntry.save()
                        .then(() => {
                            console.log(`Collection créée pour l'utilisateur avec l'ID: ${userId}`);
                            res.status(200).send('ID utilisateur enregistré avec succès');
                        })
                        .catch(error => {
                            console.error('Erreur lors de l\'enregistrement de la collection pour l\'utilisateur:', error);
                            res.status(500).send('Internal Server Error');
                        });
                }
            })
            .catch(error => {
                console.error('Erreur lors de la recherche de l\'utilisateur dans la watchlist:', error);
                res.status(500).send('Internal Server Error');
            });
    })
    .catch(error => {
        console.error('Erreur lors de la connexion à MongoDB:', error);
        res.status(500).send('Internal Server Error');
    });
});

app.post('/saveWatchlistEntry', (req, res) => {
    const userId = req.body.userId;
    const { titre, langue, saison, episode, banner, animeDetailsURL } = req.body;

    // Connexion à MongoDB
    mongoose.connect('mongodb+srv://tyz:8UOyaFHyCQ8gEEk1@animesapi.u2cdjuh.mongodb.net/watchlist?retryWrites=true&w=majority&appName=AtlasApp', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        // Définition du schéma de la watchlist
        const WatchlistSchema = new mongoose.Schema({
            titre: String,
            langue: String,
            saison: String,
            episode: String,
            banner: String,
            episodeLien: String,
            date: { type: Date, default: Date.now }
        });

        let Watchlist;

        try {
            // Tentative de récupération du modèle de watchlist pour l'utilisateur
            Watchlist = mongoose.model(userId);
        } catch (error) {
            // Si le modèle n'existe pas, créez-le
            Watchlist = mongoose.model(userId, WatchlistSchema);
        }

        // Recherche de l'utilisateur dans la watchlist
        Watchlist.findOne({ userId })
            .then(existingUser => {
                if (existingUser) {
                    // Filtrer les épisodes avec le même titre, langue et saison
                    existingUser.animes = existingUser.animes.filter(entry =>
                        !(entry.titre === titre && entry.langue === langue && entry.saison === saison)
                    );

                    // Ajoutez le nouvel épisode à la watchlist
                    existingUser.animes.push({
                        titre,
                        langue,
                        saison,
                        episode,
                        banner,
                        episodeLien: `/animes/${langue}/${encodeURIComponent(titre)}/${saison}/${episode}`,
                        date: new Date()
                    });

                    // Triez les épisodes par date décroissante
                    existingUser.animes.sort((a, b) => b.date - a.date);

                    // Mettez à jour la watchlist dans la base de données
                    existingUser.save()
                        .then(() => {
                            res.status(200).send('Watchlist mise à jour avec succès');
                        })
                        .catch(error => {
                            console.error('Erreur lors de la mise à jour de la watchlist:', error);
                            res.status(500).send('Internal Server Error - Erreur de mise à jour de la watchlist');
                        });
                } else {
                    // Si l'utilisateur n'existe pas, créez une nouvelle entrée dans la watchlist
                    const newWatchlistEntry = new Watchlist({
                        titre,
                        langue,
                        saison,
                        episode,
                        banner,
                        episodeLien: `/animes/${langue}/${encodeURIComponent(titre)}/${saison}/${episode}`,
                        date: new Date()
                    });

                    newWatchlistEntry.save()
                        .then(() => {
                            res.status(200).send('Données de l\'épisode ajoutées à une nouvelle watchlist');
                        })
                        .catch(error => {
                            console.error('Erreur lors de la création de la collection pour l\'utilisateur:', error);
                            res.status(500).send('Internal Server Error - Erreur de création de la nouvelle watchlist');
                        });
                }
            })
            .catch(error => {
                console.error('Erreur lors de la recherche de l\'utilisateur dans la watchlist:', error);
                res.status(500).send('Internal Server Error - Erreur de recherche de l\'utilisateur dans la watchlist');
            });
    })
    .catch(error => {
        console.error('Erreur lors de la connexion à MongoDB:', error);
        res.status(500).send('Internal Server Error - Erreur de connexion à MongoDB');
    });
});




// Connexion à MongoDB
mongoose.connect('mongodb+srv://tyz:8UOyaFHyCQ8gEEk1@animesapi.u2cdjuh.mongodb.net/watchlist?retryWrites=true&w=majority&appName=AtlasApp', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

// Vérifier la connexion à MongoDB
db.on('error', console.error.bind(console, 'Erreur de connexion à MongoDB :'));
db.once('open', () => {
  console.log('Connecté à MongoDB');
});

// Définir le schéma de la watchlist
const WatchlistSchema = new mongoose.Schema({
    titre: String,
    langue: String,
    saison: String,
    episode: String,
    banner: String,
    episodeLien: String,
});

// Modèle de la watchlist
const Watchlist = mongoose.model('Watchlist', WatchlistSchema);

app.get('/watchlist/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;

        // Recherche de la collection correspondant à userId
        const watchlistCollection = db.collection(userId);

        // Récupération du contenu de la collection
        const watchlistData = await watchlistCollection.find({}).toArray();

        // Renvoyer les données au format JSON
        res.json({ watchlist: watchlistData });
    } catch (error) {
        console.error("Erreur de récupération :", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});



const port = 53134;
app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});
