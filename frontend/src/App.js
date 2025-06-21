import React, { useState, useEffect } from 'react';
import { Upload, Download, List, AlertCircle, CheckCircle, FileText, Trash2 } from 'lucide-react';

const FileManagementTester = () => {
  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f0f8ff 0%, #e6f3ff 100%)',
      padding: '20px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    },
    card: {
      maxWidth: '1200px',
      margin: '0 auto',
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
      padding: '30px'
    },
    header: {
      fontSize: '32px',
      fontWeight: 'bold',
      color: '#1a365d',
      marginBottom: '8px',
      display: 'flex',
      alignItems: 'center',
      gap: '10px'
    },
    subtitle: {
      color: '#666',
      marginBottom: '30px',
      fontSize: '16px'
    },
    inputGroup: {
      marginBottom: '30px'
    },
    label: {
      display: 'block',
      fontSize: '14px',
      fontWeight: '500',
      color: '#374151',
      marginBottom: '8px'
    },
    input: {
      width: '100%',
      padding: '12px',
      border: '1px solid #d1d5db',
      borderRadius: '6px',
      fontSize: '16px',
      outline: 'none',
      transition: 'border-color 0.2s',
    },
    inputFocus: {
      borderColor: '#3b82f6',
      boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)'
    },
    helpText: {
      fontSize: '12px',
      color: '#6b7280',
      marginTop: '4px'
    },
    message: {
      padding: '12px',
      borderRadius: '6px',
      marginBottom: '20px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontSize: '14px'
    },
    messageSuccess: {
      backgroundColor: '#f0fdf4',
      color: '#166534',
      border: '1px solid #bbf7d0'
    },
    messageError: {
      backgroundColor: '#fef2f2',
      color: '#dc2626',
      border: '1px solid #fecaca'
    },
    messageInfo: {
      backgroundColor: '#eff6ff',
      color: '#1d4ed8',
      border: '1px solid #bfdbfe'
    },
    section: {
      marginBottom: '40px'
    },
    sectionTitle: {
      fontSize: '20px',
      fontWeight: '600',
      color: '#1a365d',
      marginBottom: '16px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    uploadBox: {
      border: '2px dashed #d1d5db',
      borderRadius: '8px',
      padding: '40px',
      textAlign: 'center',
      transition: 'border-color 0.2s',
      cursor: 'pointer'
    },
    uploadBoxHover: {
      borderColor: '#3b82f6'
    },
    button: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      padding: '12px 20px',
      borderRadius: '6px',
      fontSize: '14px',
      fontWeight: '500',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.2s',
      textDecoration: 'none'
    },
    buttonPrimary: {
      backgroundColor: '#3b82f6',
      color: 'white'
    },
    buttonPrimaryHover: {
      backgroundColor: '#2563eb'
    },
    buttonSecondary: {
      backgroundColor: '#8b5cf6',
      color: 'white'
    },
    buttonSecondaryHover: {
      backgroundColor: '#7c3aed'
    },
    buttonDisabled: {
      backgroundColor: '#e5e7eb',
      color: '#9ca3af',
      cursor: 'not-allowed'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      borderRadius: '8px',
      overflow: 'hidden',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    },
    tableHeader: {
      backgroundColor: '#f9fafb',
      fontWeight: '500',
      fontSize: '14px',
      color: '#374151'
    },
    tableHeaderCell: {
      padding: '12px 16px',
      textAlign: 'left',
      borderBottom: '1px solid #e5e7eb'
    },
    tableRow: {
      transition: 'background-color 0.2s'
    },
    tableRowHover: {
      backgroundColor: '#f9fafb'
    },
    tableCell: {
      padding: '12px 16px',
      fontSize: '14px',
      borderBottom: '1px solid #f3f4f6'
    },
    emptyState: {
      textAlign: 'center',
      padding: '60px 20px',
      color: '#6b7280'
    },
    flexBetween: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px'
    },
    hidden: {
      display: 'none'
    }
  };
  const [apiUrl, setApiUrl] = useState('');
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  // Load files on component mount and when API URL changes
  useEffect(() => {
    if (apiUrl) {
      loadFiles();
    }
  }, [apiUrl]);

  const showMessage = (text, type = 'info') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 5000);
  };

  const loadFiles = async () => {
    if (!apiUrl) {
      showMessage('Please enter your API URL first', 'error');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/files`);
      const data = await response.json();
      
      if (response.ok) {
        setFiles(data.files || []);
        showMessage(`Loaded ${data.files?.length || 0} files`, 'success');
      } else {
        throw new Error(data.error || 'Failed to load files');
      }
    } catch (error) {
      showMessage(`Error loading files: ${error.message}`, 'error');
      setFiles([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!apiUrl) {
      showMessage('Please enter your API URL first', 'error');
      return;
    }

    setLoading(true);
    try {
      // Convert file to base64
      const base64Content = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          // Remove the data URL prefix (e.g., "data:text/plain;base64,")
          const base64 = reader.result.split(',')[1];
          resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const response = await fetch(`${apiUrl}/upload`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filename: file.name,
          content: base64Content
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        showMessage(`File "${file.name}" uploaded successfully!`, 'success');
        loadFiles(); // Refresh file list
        event.target.value = ''; // Clear file input
      } else {
        throw new Error(data.error || 'Upload failed');
      }
    } catch (error) {
      showMessage(`Upload error: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleFileDownload = async (filename) => {
    if (!apiUrl) {
      showMessage('Please enter your API URL first', 'error');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/download/${encodeURIComponent(filename)}`);
      const data = await response.json();
      
      if (response.ok) {
        // Convert base64 back to blob and download
        const binaryString = atob(data.content);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        
        const blob = new Blob([bytes], { type: data.content_type });
        const url = URL.createObjectURL(blob);
        
        // Create download link
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showMessage(`File "${filename}" downloaded successfully!`, 'success');
      } else {
        throw new Error(data.error || 'Download failed');
      }
    } catch (error) {
      showMessage(`Download error: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (isoString) => {
    if (!isoString) return 'Unknown';
    try {
      return new Date(isoString).toLocaleString();
    } catch {
      return 'Invalid date';
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.header}>
          <FileText color="#3b82f6" />
          File Management API Tester
        </h1>
        <p style={styles.subtitle}>
          Test your DynamoDB + Lambda file management API
        </p>

        {/* API URL Configuration */}
        <div style={styles.inputGroup}>
          <label htmlFor="apiUrl" style={styles.label}>
            API Gateway URL
          </label>
          <input
            type="url"
            id="apiUrl"
            value={apiUrl}
            onChange={(e) => setApiUrl(e.target.value.replace(/\/$/, ''))}
            placeholder="https://your-api-id.execute-api.region.amazonaws.com/prod"
            style={styles.input}
            onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
            onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
          />
          <p style={styles.helpText}>
            Enter your API Gateway invoke URL (without trailing slash)
          </p>
        </div>

        {/* Message Display */}
        {message && (
          <div style={{
            ...styles.message,
            ...(message.type === 'success' ? styles.messageSuccess :
                message.type === 'error' ? styles.messageError :
                styles.messageInfo)
          }}>
            {message.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
            {message.text}
          </div>
        )}

        {/* File Upload Section */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>
            <Upload size={20} color="#10b981" />
            Upload File
          </h2>
          <div 
            style={styles.uploadBox}
            onMouseEnter={(e) => e.target.style.borderColor = '#3b82f6'}
            onMouseLeave={(e) => e.target.style.borderColor = '#d1d5db'}
          >
            <input
              type="file"
              onChange={handleFileUpload}
              disabled={loading || !apiUrl}
              style={styles.hidden}
              id="fileInput"
            />
            <label
              htmlFor="fileInput"
              style={{
                ...styles.button,
                ...(loading || !apiUrl ? styles.buttonDisabled : styles.buttonPrimary)
              }}
              onMouseEnter={(e) => {
                if (!loading && apiUrl) {
                  e.target.style.backgroundColor = '#2563eb';
                }
              }}
              onMouseLeave={(e) => {
                if (!loading && apiUrl) {
                  e.target.style.backgroundColor = '#3b82f6';
                }
              }}
            >
              <Upload size={16} />
              {loading ? 'Uploading...' : 'Choose File to Upload'}
            </label>
            <p style={{ ...styles.helpText, marginTop: '12px' }}>
              Select any file to upload to your DynamoDB table
            </p>
          </div>
        </div>

        {/* File List Section */}
        <div style={styles.section}>
          <div style={styles.flexBetween}>
            <h2 style={styles.sectionTitle}>
              <List size={20} color="#8b5cf6" />
              Stored Files ({files.length})
            </h2>
            <button
              onClick={loadFiles}
              disabled={loading || !apiUrl}
              style={{
                ...styles.button,
                ...(loading || !apiUrl ? styles.buttonDisabled : styles.buttonSecondary)
              }}
              onMouseEnter={(e) => {
                if (!loading && apiUrl) {
                  e.target.style.backgroundColor = '#7c3aed';
                }
              }}
              onMouseLeave={(e) => {
                if (!loading && apiUrl) {
                  e.target.style.backgroundColor = '#8b5cf6';
                }
              }}
            >
              <List size={16} />
              {loading ? 'Loading...' : 'Refresh List'}
            </button>
          </div>

          {files.length === 0 ? (
            <div style={styles.emptyState}>
              <FileText size={48} color="#d1d5db" style={{ marginBottom: '10px' }} />
              <p>No files found. Upload a file to get started!</p>
            </div>
          ) : (
            <div style={{ backgroundColor: '#f9fafb', borderRadius: '8px', overflow: 'hidden' }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={styles.table}>
                  <thead style={styles.tableHeader}>
                    <tr>
                      <th style={styles.tableHeaderCell}>Filename</th>
                      <th style={styles.tableHeaderCell}>Size</th>
                      <th style={styles.tableHeaderCell}>Uploaded</th>
                      <th style={styles.tableHeaderCell}>Type</th>
                      <th style={{ ...styles.tableHeaderCell, textAlign: 'center' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {files.map((file, index) => (
                      <tr 
                        key={index} 
                        style={styles.tableRow}
                        onMouseEnter={(e) => e.target.parentElement.style.backgroundColor = '#f9fafb'}
                        onMouseLeave={(e) => e.target.parentElement.style.backgroundColor = 'white'}
                      >
                        <td style={{ ...styles.tableCell, fontWeight: '500', color: '#111827' }}>
                          {file.filename}
                        </td>
                        <td style={{ ...styles.tableCell, color: '#6b7280' }}>
                          {formatFileSize(file.size)}
                        </td>
                        <td style={{ ...styles.tableCell, color: '#6b7280' }}>
                          {formatDate(file.uploaded_at)}
                        </td>
                        <td style={{ ...styles.tableCell, color: '#6b7280' }}>
                          {file.content_type}
                        </td>
                        <td style={{ ...styles.tableCell, textAlign: 'center' }}>
                          <button
                            onClick={() => handleFileDownload(file.filename)}
                            disabled={loading}
                            style={{
                              ...styles.button,
                              padding: '6px 12px',
                              fontSize: '12px',
                              backgroundColor: loading ? '#e5e7eb' : '#dbeafe',
                              color: loading ? '#9ca3af' : '#1d4ed8'
                            }}
                            onMouseEnter={(e) => {
                              if (!loading) {
                                e.target.style.backgroundColor = '#bfdbfe';
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (!loading) {
                                e.target.style.backgroundColor = '#dbeafe';
                              }
                            }}
                          >
                            <Download size={14} />
                            Download
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileManagementTester;