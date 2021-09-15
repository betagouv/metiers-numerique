const jobs = require('./sample.json')
const axios = require('axios')

const formatResult = () => {
    return [{
       "Ministère": "Ministère de l’éducation nationale de la jeunesse et des sports – Ministère de l’enseignement supérieur de la recherche et de l’innovation",
        "rémunération": "A définir en fonction de l'expérience",
        "Expérience": "3 ans minimum dans le développement d’applications de pilotage",
        "Poste à pourvoir": "Date limite de dépôt de candidature : 30 octobre 2021",
        "Localisation": "61-65 rue Dutot 75015 Paris",
        "Poste ouvert aux": ["Fonctionnaire", "Contractuel.le"],
        "Name":"Expert(e) en conception et développement d’applications de Business Intelligence",
        "duree": "6 mois",
        "contexte": 'Test',
        "thumbnail": 'https://s3.us-west-2.amazonaws.com/secure.notion-static.com/4b013cfd-51cc-4e97-8342-ab637886cc35/Logo-MENJ-TRICOLORE.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAT73L2G45O3KS52Y5%2F20210915%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20210915T112850Z&X-Amz-Expires=3600&X-Amz-Signature=9b6cd4872b251eda054793204fc425d99a8293d1ecc3a9d1e25481ef9819ecf2&X-Amz-SignedHeaders=host',
        "url":"https://www.notion.so/Expert-e-en-conception-et-d-veloppement-d-applications-de-Business-Intelligence-b0de6dbc3a0d4d13a8c32cc978012b35"
       }, {
       "Ministère": "Ministère de l’éducation nationale de la jeunesse et des sports – Ministère de l’enseignement supérieur de la recherche et de l’innovation",
        "rémunération": "A définir en fonction de l'expérience",
        "Expérience": "3 ans minimum dans le développement d’applications de pilotage",
        "Poste à pourvoir": "Date limite de dépôt de candidature : 30 octobre 2021",
        "Localisation": "61-65 rue Dutot 75015 Paris",
        "Poste ouvert aux": ["Fonctionnaire", "Contractuel.le"],
        "Name":"Expert(e) en conception et développement d’applications de Business Intelligence",
        "duree": "6 mois",
        "contexte": 'Test',
        "url":"https://www.notion.so/Expert-e-en-conception-et-d-veloppement-d-applications-de-Business-Intelligence-b0de6dbc3a0d4d13a8c32cc978012b35"
       },{
       "Ministère": "Ministère de l’éducation nationale de la jeunesse et des sports – Ministère de l’enseignement supérieur de la recherche et de l’innovation",
        "rémunération": "A définir en fonction de l'expérience",
        "Expérience": "3 ans minimum dans le développement d’applications de pilotage",
        "Poste à pourvoir": "Date limite de dépôt de candidature : 30 octobre 2021",
        "Localisation": "61-65 rue Dutot 75015 Paris",
        "Poste ouvert aux": ["Fonctionnaire", "Contractuel.le"],
        "Name":"Expert(e) en conception et développement d’applications de Business Intelligence",
        "duree": "6 mois",
        "contexte": 'Test',
        "url":"https://www.notion.so/Expert-e-en-conception-et-d-veloppement-d-applications-de-Business-Intelligence-b0de6dbc3a0d4d13a8c32cc978012b35"
       },
       {
       "Ministère": "Ministère de l’éducation nationale de la jeunesse et des sports – Ministère de l’enseignement supérieur de la recherche et de l’innovation",
        "rémunération": "A définir en fonction de l'expérience",
        "Expérience": "3 ans minimum dans le développement d’applications de pilotage",
        "Poste à pourvoir": "Date limite de dépôt de candidature : 30 octobre 2021",
        "Localisation": "61-65 rue Dutot 75015 Paris",
        "Poste ouvert aux": ["Fonctionnaire", "Contractuel.le"],
        "Name":"Expert(e) en conception et développement d’applications de Business Intelligence",
        "duree": "6 mois",
        "contexte": 'Test',
        "url":"https://www.notion.so/Expert-e-en-conception-et-d-veloppement-d-applications-de-Business-Intelligence-b0de6dbc3a0d4d13a8c32cc978012b35"
       },
       {
       "Ministère": "Ministère de l’éducation nationale de la jeunesse et des sports – Ministère de l’enseignement supérieur de la recherche et de l’innovation",
        "rémunération": "A définir en fonction de l'expérience",
        "Expérience": "3 ans minimum dans le développement d’applications de pilotage",
        "Poste à pourvoir": "Date limite de dépôt de candidature : 30 octobre 2021",
        "Localisation": "61-65 rue Dutot 75015 Paris",
        "Poste ouvert aux": ["Fonctionnaire", "Contractuel.le"],
        "Name":"Expert(e) en conception et développement d’applications de Business Intelligence",
        "duree": "6 mois",
        "contexte": 'Test',
        "url":"https://www.notion.so/Expert-e-en-conception-et-d-veloppement-d-applications-de-Business-Intelligence-b0de6dbc3a0d4d13a8c32cc978012b35"
       },
       {
       "Ministère": "Ministère de l’éducation nationale de la jeunesse et des sports – Ministère de l’enseignement supérieur de la recherche et de l’innovation",
        "rémunération": "A définir en fonction de l'expérience",
        "Expérience": "3 ans minimum dans le développement d’applications de pilotage",
        "Poste à pourvoir": "Date limite de dépôt de candidature : 30 octobre 2021",
        "Localisation": "61-65 rue Dutot 75015 Paris",
        "Poste ouvert aux": ["Fonctionnaire", "Contractuel.le"],
        "Name":"Expert(e) en conception et développement d’applications de Business Intelligence",
        "duree": "6 mois",
        "contexte": 'Test',
        "url":"https://www.notion.so/Expert-e-en-conception-et-d-veloppement-d-applications-de-Business-Intelligence-b0de6dbc3a0d4d13a8c32cc978012b35"
       },
    ]
}

module.exports.fetch = async (req, res) => {
    let result
    try {
        result = await axios.post(`https://api.notion.com/v1/databases/${process.env.DATABASE}/query`,null, {
            headers: {
                'Authorization': `Bearer ${process.env.TOKEN}`,
                'Notion-Version': '2021-08-16'
            }
        })
    } catch(e) {
        console.log(e)
    }
    res.render('jobs', {
        jobs: formatResult(result),
        contactEmail: 'contact@metiers.numerique.gouv.fr',
    });
}
