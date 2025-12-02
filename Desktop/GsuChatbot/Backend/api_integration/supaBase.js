const { createClient } = require('@supabase/supabase-js');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

let supabaseClient = null;

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('[supabase] ⚠️ Missing SUPABASE_URL or SUPABASE_ANON_KEY. Client not initialized.');
} else {
    // Only log once
    if (!global.supabaseClient) {
        console.log('[supabase] ✅ Supabase client initialized');
        global.supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
    }
    supabaseClient = global.supabaseClient;
}

/**
 * Upload a file to Supabase storage
 * @param {string} bucketName - The name of the storage bucket
 * @param {string} fileName - The name/path for the file
 * @param {Buffer} fileBuffer - The file buffer
 * @param {string} contentType - The MIME type of the file
 * @returns {Promise} Upload result
 */
async function uploadFile(bucketName, fileName, fileBuffer, contentType) {
    if (!supabaseClient) {
        throw new Error('Supabase client not initialized');
    }

    try {
        const { data, error } = await supabaseClient.storage
            .from(bucketName)
            .upload(fileName, fileBuffer, {
                contentType: contentType,
                upsert: false // Don't overwrite existing files
            });

        if (error) {
            console.error('[supabase] Upload error:', error);
            throw error;
        }

        console.log('[supabase] ✅ File uploaded successfully:', fileName);
        return data;
    } catch (error) {
        console.error('[supabase] ❌ Upload failed:', error);
        throw error;
    }
}

/**
 * Get a signed URL for a file
 * @param {string} bucketName - The name of the storage bucket
 * @param {string} fileName - The name/path of the file
 * @param {number} expiresIn - URL expiration time in seconds (default: 1 hour)
 * @returns {Promise} Signed URL
 */
async function getFileUrl(bucketName, fileName, expiresIn = 3600) {
    if (!supabaseClient) {
        throw new Error('Supabase client not initialized');
    }

    try {
        const { data, error } = await supabaseClient.storage
            .from(bucketName)
            .createSignedUrl(fileName, expiresIn);

        if (error) {
            console.error('[supabase] Get URL error:', error);
            throw error;
        }

        return data.signedUrl;
    } catch (error) {
        console.error('[supabase] ❌ Get URL failed:', error);
        throw error;
    }
}

/**
 * List files in a bucket
 * @param {string} bucketName - The name of the storage bucket
 * @param {string} folder - The folder path (optional)
 * @returns {Promise} List of files
 */
async function listFiles(bucketName, folder = '') {
    if (!supabaseClient) {
        throw new Error('Supabase client not initialized');
    }

    try {
        const { data, error } = await supabaseClient.storage
            .from(bucketName)
            .list(folder);

        if (error) {
            console.error('[supabase] List files error:', error);
            throw error;
        }

        return data;
    } catch (error) {
        console.error('[supabase] ❌ List files failed:', error);
        throw error;
    }
}

/**
 * Delete a file from storage
 * @param {string} bucketName - The name of the storage bucket
 * @param {string} fileName - The name/path of the file
 * @returns {Promise} Delete result
 */
async function deleteFile(bucketName, fileName) {
    if (!supabaseClient) {
        throw new Error('Supabase client not initialized');
    }

    try {
        const { data, error } = await supabaseClient.storage
            .from(bucketName)
            .remove([fileName]);

        if (error) {
            console.error('[supabase] Delete error:', error);
            throw error;
        }

        console.log('[supabase] ✅ File deleted successfully:', fileName);
        return data;
    } catch (error) {
        console.error('[supabase] ❌ Delete failed:', error);
        throw error;
    }
}

// Export the client and file operations
module.exports = supabaseClient;
module.exports.uploadFile = uploadFile;
module.exports.getFileUrl = getFileUrl;
module.exports.listFiles = listFiles;
module.exports.deleteFile = deleteFile;
