const { MongoClient } = require("mongodb");

// chaîne de connexion MongoDB Atlas
const uri = "mongodb+srv://gueyemadicke0751:Sanogo.iyam1726@cluster0.qatrn2d.mongodb.net/";

const client = new MongoClient(uri);

async function run() {
    try {
        await client.connect();
        const database = client.db('worldData'); 
        const collection = database.collection('countries'); 

        // Insérer un document
        const doc = { name: "serge", age: 30 };
        await collection.insertOne(doc);

        // Insérer un autre document sans spécifier l'ID
        const anotherDoc = { nom: "Mrabet", prenom: "Amine", pays: "France" };
        await collection.insertOne(anotherDoc);

        // Compter le nombre de documents
        const count = await collection.countDocuments();
        console.log(`Nombre de documents: ${count}`);

        // Mise à jour d'un document
        await collection.updateOne({ name: "serge" }, { $set: { age: 23 } });

        // Afficher le contenu d'une collection
        const items = await collection.find().toArray();
        console.log(items);

        // Supprimer un document
        await collection.deleteOne({ prenom: "Amine" });

        // Listez toutes les collections dans la base de données
        const collections = await database.listCollections().toArray();
        console.log("Collections:", collections);

        // Supprimer une collection
        // await database.collection('personnes').drop();

        // Afficher des documents triés
        const sortedDocs = await collection.find().sort({ name: 1 }).toArray();
        console.log("Documents triés:", sortedDocs);

        // Récupère les noms officiels des pays de la 10ème à la 22ème position
        const countries = await collection.find({}, { projection: { "name.official": 1 } }).skip(9).limit(13).toArray();
        console.log("Noms officiels des pays (10ème à 22ème):", countries);

        // Récupère les noms officiels des pays triés par superficie croissante, de la 10ème à la 22ème position
        const countriesByArea = await collection.find({}, { projection: { "name.official": 1, area: 1 } }).sort({ area: 1 }).skip(9).limit(13).toArray();
        console.log("Noms officiels triés par superficie (10ème à 22ème):", countriesByArea);

        // Récupère toutes les informations sur le Canada
        const canadaInfo = await collection.findOne({ "name.official": "Canada" });
        console.log("Informations sur le Canada:", canadaInfo);

        // Récupère les noms officiels des pays où l'une des langues est le néerlandais
        const dutchSpeakingCountries = await collection.find({ "languages.nld": { $exists: true } }, { projection: { "name.official": 1 } }).toArray();
        console.log("Pays parlant néerlandais:", dutchSpeakingCountries);

        // Récupère les noms officiels des pays commençant par 'C'
        const countriesStartingWithC = await collection.find({ "name.official": { $regex: /^C/ } }, { projection: { "name.official": 1 } }).toArray();
        console.log("Pays commençant par C:", countriesStartingWithC);

        // Récupère les noms officiels des pays dont la superficie est comprise entre 400000 et 500000 km²
        const countriesByAreaRange = await collection.find({ area: { $gte: 400000, $lte: 500000 } }, { projection: { "name.official": 1 } }).toArray();
        console.log("Pays avec superficie entre 400000 et 500000 km²:", countriesByAreaRange);
        // Requêtes pour l'exercice 2

// Afficher tous les titres
const allTitles = await documentsCollection.find({}, { projection: { titre: 1 } }).toArray();
console.log("Tous les titres:", allTitles);

// Afficher les titres des documents ayant les rangs 1 à 10
const titlesRanks1to10 = await documentsCollection.find({ rang: { $lte: 10 } }, { projection: { titre: 1 } }).toArray();
console.log("Titres des documents ayant les rangs 1 à 10:", titlesRanks1to10);

// Afficher les auteurs de tous les documents dont le titre commence par la lettre N
const authorsStartWithN = await documentsCollection.find({ titre: /^N/ }, { projection: { auteur: 1 } }).toArray();
console.log("Auteurs des documents dont le titre commence par N:", authorsStartWithN);

// Afficher toutes les informations vers les documents n'ayant pas de champ "type_de_document"
const noTypeDocs = await documentsCollection.find({ "fields.type_de_document": { $exists: false } }).toArray();
console.log("Documents sans type de document:", noTypeDocs);

// Afficher les différents types de documents
const docTypes = await documentsCollection.distinct("fields.type_de_document");
console.log("Types de documents:", docTypes);

// Afficher les titres des documents avec le plus grand nombre de réservations
const mostReservedTitles = await documentsCollection.find().sort({ "fields.nombre_de_reservations": -1 }).limit(10).toArray();
console.log("Documents avec le plus grand nombre de réservations:", mostReservedTitles);

// Afficher les documents avec un nombre de réservations supérieur à 200
const over200Reservations = await documentsCollection.find({ "fields.nombre_de_reservations": { $gt: 200 } }).toArray();
console.log("Documents avec plus de 200 réservations:", over200Reservations);

// Afficher le nombre total de réservations pour chaque type de document
const totalReservationsPerType = await documentsCollection.aggregate([
  { $group: { _id: "$fields.type_de_document", totalReservations: { $sum: "$fields.nombre_de_reservations" } } }
]).toArray();
console.log("Nombre total de réservations par type de document:", totalReservationsPerType);

// Afficher les auteurs qui ont le plus grand nombre de documents dans la base
const authorsWithMostDocs = await documentsCollection.aggregate([
  { $group: { _id: "$fields.auteur", numberOfDocuments: { $sum: 1 } } },
  { $sort: { numberOfDocuments: -1 } },
  { $limit: 10 }
]).toArray();
console.log("Auteurs avec le plus grand nombre de documents:", authorsWithMostDocs);

// Requêtes pour l'exercice 3

// Afficher le nombre de publications de type « Book »
const bookCount = await dblpDocumentsCollection.countDocuments({ type: "Book" });
console.log("Nombre de publications de type 'Book':", bookCount);

// Afficher toutes les publications dont vous êtes l'auteur
const myPublications = await dblpDocumentsCollection.find({ authors: "Madicke Gueye" }).toArray();
console.log("Mes publications:", myPublications);

// Afficher les titres de toutes les publications depuis 2012 inclus
const titlesSince2012 = await dblpDocumentsCollection.find({ year: { $gte: 2012 } }, { projection: { title: 1 } }).toArray();
console.log("Titres des publications depuis 2012:", titlesSince2012);

// Afficher le nombre de publications de type « Article » depuis 2012
const articleCountSince2012 = await dblpDocumentsCollection.countDocuments({ type: "Article", year: { $gte: 2012 } });
console.log("Nombre de publications de type 'Article' depuis 2012:", articleCountSince2012);

// Afficher les années des publications de l'auteur « Wolfgang Wahlster »
const wahlsterYears = await dblpDocumentsCollection.find({ authors: "Wolfgang Wahlster" }, { projection: { year: 1 } }).toArray();
console.log("Années des publications de Wolfgang Wahlster:", wahlsterYears);

// Afficher la liste de tous les éditeurs (champ « publisher ») distincts
const distinctPublishers = await dblpDocumentsCollection.distinct("publisher");
console.log("Liste des éditeurs distincts:", distinctPublishers);

// Afficher la liste des publications de « Wolfgang Wahlster » triée par année croissante
const wahlsterPublications = await dblpDocumentsCollection.find({ authors: "Wolfgang Wahlster" }).sort({ year: 1 }).toArray();
console.log("Publications de Wolfgang Wahlster par année croissante:", wahlsterPublications);

// Supprimer le champ « type » de toutes les publications
await dblpDocumentsCollection.updateMany({}, { $unset: { type: "" } });
console.log("Champ 'type' supprimé de toutes les publications");

    } finally {
        await client.close();
    }
}

run().catch(console.dir);