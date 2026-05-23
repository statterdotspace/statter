import axios from 'axios';

export const fileApi = {
  upload: async (uploadUrl: string, file: File) => {
    const response = await axios(uploadUrl, {
      method: 'PUT',
      data: file,
      headers: {
        'Content-Type': file.type || 'application/octet-stream',
      },
    });

    if (response.status < 200 || response.status >= 300) {
      throw new Error('Failed to upload file.');
    }
  },
};
