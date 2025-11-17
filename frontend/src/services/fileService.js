/**
 * File Service for handling file operations with the backend
 * @author GSU Software Engineering Team 6
 */

const API_BASE_URL = 'http://localhost:5001/api/chat';

/**
 * Upload a file to Supabase User_Files bucket
 * @param {File} file - The file to upload
 * @param {function} onProgress - Callback for upload progress (optional)
 * @returns {Promise<Object>} Upload result
 */
export const uploadFile = async (file, onProgress = null) => {
    try {
        // Validate file
        if (!file) {
            throw new Error('No file provided');
        }

        // Check file size (50MB max)
        const maxSize = 50 * 1024 * 1024;
        if (file.size > maxSize) {
            throw new Error('File size too large. Maximum size is 50MB.');
        }

        // Check file type
        const allowedTypes = [
            'image/jpeg',
            'image/png',
            'image/gif',
            'image/webp',
            'application/pdf',
            'text/plain',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/vnd.ms-powerpoint',
            'application/vnd.openxmlformats-officedocument.presentationml.presentation'
        ];

        if (!allowedTypes.includes(file.type)) {
            throw new Error('File type not supported. Please upload images, PDFs, or Office documents.');
        }

        // Create FormData
        const formData = new FormData();
        formData.append('file', file);

        // Upload with progress tracking
        const xhr = new XMLHttpRequest();

        return new Promise((resolve, reject) => {
            // Track upload progress
            if (onProgress) {
                xhr.upload.addEventListener('progress', (event) => {
                    if (event.lengthComputable) {
                        const percentComplete = (event.loaded / event.total) * 100;
                        onProgress(percentComplete);
                    }
                });
            }

            xhr.addEventListener('load', () => {
                if (xhr.status === 200) {
                    try {
                        const response = JSON.parse(xhr.responseText);
                        resolve(response);
                    } catch (error) {
                        reject(new Error('Invalid server response'));
                    }
                } else {
                    try {
                        const errorResponse = JSON.parse(xhr.responseText);
                        reject(new Error(errorResponse.error || 'Upload failed'));
                    } catch (error) {
                        reject(new Error(`Upload failed with status ${xhr.status}`));
                    }
                }
            });

            xhr.addEventListener('error', () => {
                reject(new Error('Network error during upload'));
            });

            xhr.open('POST', `${API_BASE_URL}/upload`);
            xhr.send(formData);
        });

    } catch (error) {
        console.error('❌ File upload error:', error);
        throw error;
    }
};

/**
 * Get list of uploaded files
 * @returns {Promise<Object>} List of files
 */
export const getFiles = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/files`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to fetch files');
        }

        return data;
    } catch (error) {
        console.error('❌ Get files error:', error);
        throw error;
    }
};

/**
 * Get URL for a specific file
 * @param {string} fileName - Name of the file
 * @returns {Promise<Object>} File URL
 */
export const getFileUrl = async (fileName) => {
    try {
        const response = await fetch(`${API_BASE_URL}/files/${encodeURIComponent(fileName)}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to get file URL');
        }

        return data;
    } catch (error) {
        console.error('❌ Get file URL error:', error);
        throw error;
    }
};

/**
 * Delete a file
 * @param {string} fileName - Name of the file to delete
 * @returns {Promise<Object>} Delete result
 */
export const deleteFile = async (fileName) => {
    try {
        const response = await fetch(`${API_BASE_URL}/files/${encodeURIComponent(fileName)}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to delete file');
        }

        return data;
    } catch (error) {
        console.error('❌ Delete file error:', error);
        throw error;
    }
};

/**
 * Format file size for display
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted file size
 */
export const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Get file type icon/emoji
 * @param {string} mimeType - MIME type of the file
 * @returns {string} Icon/emoji for the file type
 */
export const getFileIcon = (mimeType) => {
    if (!mimeType) return '📄';

    if (mimeType.startsWith('image/')) return '🖼️';
    if (mimeType === 'application/pdf') return '📕';
    if (mimeType.includes('word') || mimeType.includes('document')) return '📝';
    if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return '📊';
    if (mimeType.includes('powerpoint') || mimeType.includes('presentation')) return '📈';
    if (mimeType === 'text/plain') return '📄';

    return '📁';
};

/**
 * Check if file type is supported
 * @param {string} mimeType - MIME type to check
 * @returns {boolean} Whether the file type is supported
 */
export const isFileTypeSupported = (mimeType) => {
    const allowedTypes = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
        'application/pdf',
        'text/plain',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    ];

    return allowedTypes.includes(mimeType);
};

export default {
    uploadFile,
    getFiles,
    getFileUrl,
    deleteFile,
    formatFileSize,
    getFileIcon,
    isFileTypeSupported
};