import React from 'react';
import api from "../api/api.js";

function DownloadCSV() {

    const handleClick =  async () => {
        try {
          const response = await api.get('/csv/download-csv', { responseType: 'blob' });
    
          // Create a Blob from the response data
          const blob = new Blob([response.data], { type: 'text/csv' });
          
          // Create a URL for the Blob
          const url = window.URL.createObjectURL(blob);
    
          // Create a link element and click it to trigger download
          const link = document.createElement('a');
          link.href = url;
          link.download = 'interview_data.csv';
          document.body.appendChild(link);
          link.click();
    
          // Cleanup
          window.URL.revokeObjectURL(url);
          document.body.removeChild(link);
        } catch (error) {
          console.error('Error downloading CSV:', error);
        }
      };

  return (
    <div>
      <button className='bg-blue-600 p-4 rounded-xl text-white font-bold' onClick={handleClick}>Download CSV</button>
    </div>
  );
}

export default DownloadCSV;
