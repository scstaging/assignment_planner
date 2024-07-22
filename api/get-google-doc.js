// api/get-google-doc.js
import { google } from 'googleapis';
import { GoogleAuth } from 'google-auth-library';
import fetch from 'node-fetch';

export default async function handler(req, res) {
  try {
    console.log('Function execution started');

    // Fetch service account credentials from Supabase
    const response = await fetch('https://vvjogjaiiuqsklqkwlrj.supabase.co/storage/v1/object/public/Creds/assignment-planner-429218-ca35bee57e63%20(1).json');

    if (!response.ok) {
      console.error('Error fetching credentials:', response.statusText);
      return res.status(500).json({ error: 'Error fetching credentials' });
    }

    const credentials = await response.json();

    console.log('Service account credentials fetched successfully');

    // Authenticate using the service account credentials
    const auth = new GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/documents.readonly'],
    });

    const authClient = await auth.getClient();
    const docs = google.docs({ version: 'v1', auth: authClient });

    // Fetch the Google Doc content
    const docID = req.query.docID;
    const result = await docs.documents.get({ documentId: docID });

    console.log('Google Doc content fetched successfully');

    res.status(200).json(result.data);
  } catch (error) {
    console.error('Error in function execution:', error);
    res.status(500).json({ error: 'Error in function execution' });
  }
}

