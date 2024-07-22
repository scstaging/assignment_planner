// api/get-google-doc.js
const { google } = require('googleapis');
const { GoogleAuth } = require('google-auth-library');
const fetch = require('node-fetch');

const SCOPES = 'https://www.googleapis.com/auth/documents.readonly';

module.exports = async (req, res) => {
  try {
    // Fetch service account credentials from Supabase
    const response = await fetch('https://vvjogjaiiuqsklqkwlrj.supabase.co/storage/v1/object/public/Creds/assignment-planner-429218-ca35bee57e63%20(1).json');
    const credentials = await response.json();

    // Authenticate using the service account credentials
    const auth = new GoogleAuth({
      credentials,
      scopes: SCOPES,
    });

    const authClient = await auth.getClient();
    const docs = google.docs({ version: 'v1', auth: authClient });

    // Fetch the Google Doc content
    const docID = req.query.docID;
    const result = await docs.documents.get({ documentId: docID });

    res.status(200).json(result.data);
  } catch (error) {
    console.error('Error fetching Google Doc:', error);
    res.status(500).json({ error: 'Error fetching Google Doc' });
  }
};
