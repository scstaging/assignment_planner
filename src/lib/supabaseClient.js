// src/supabase.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vvjogjaiiuqsklqkwlrj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ2am9namFpaXVxc2tscWt3bHJqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjE1OTQwMDksImV4cCI6MjAzNzE3MDAwOX0.xUVfiRzJerwYP25B6q780lvfDKV4r2mOCg7iwe-I39M';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
