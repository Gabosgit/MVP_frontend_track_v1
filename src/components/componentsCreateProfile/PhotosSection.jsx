import { useState, useEffect, useRef } from "react";


// The 'onFilesReady' prop is the only one PhotoSection receives from its parent now.
export default function PhotoSection({ onFilesReady }) {
    // This state holds the File objects, their local preview URLs, and a unique ID
    const [filesToProcess, setFilesToProcess] = useState([]);

    // useRef to store a mutable value that doesn't trigger re-renders
    // Initialize it to 0 or 1, depending on your preference for starting IDs
    const nextId = useRef(0);

    const handleFileChange = (event) => {
        const newlySelectedFiles = Array.from(event.target.files);
        const newFileItems = [];

        newlySelectedFiles.forEach(newFile => {
            // Basic check for duplicates based on name/size/lastModified
            const isDuplicate = filesToProcess.some(item =>
                item.file.name === newFile.name &&
                item.file.size === newFile.size &&
                item.file.lastModified === newFile.lastModified
            );

            if (!isDuplicate) {
                // Increment the ref's current value and use it as the ID
                nextId.current += 1;
                newFileItems.push({
                    id: nextId.current, // Use the incremented ID here!
                    file: newFile,
                    previewUrl: URL.createObjectURL(newFile)
                });
            }
        });

        const updatedFiles = [...filesToProcess, ...newFileItems];
        setFilesToProcess(updatedFiles);

        // Call the parent's callback, passing ONLY the actual File objects
        if (onFilesReady && typeof onFilesReady === 'function') {
            const actualFilesToSubmit = updatedFiles.map(item => item.file);
            onFilesReady(actualFilesToSubmit);
        }

        // Clear the input's value to allow selecting the same files again
        event.target.value = '';
    };

    const handleRemoveFile = (idToRemove) => { // Still accepts the unique ID
        const updatedFiles = filesToProcess.filter(item => item.id !== idToRemove);
        setFilesToProcess(updatedFiles);

        // Inform the parent about the updated list of files
        if (onFilesReady && typeof onFilesReady === 'function') {
            const actualFilesToSubmit = updatedFiles.map(item => item.file);
            onFilesReady(actualFilesToSubmit);
        }
    };

    // --- Clean up object URLs ---
    useEffect(() => {
        return () => {
            filesToProcess.forEach(item => URL.revokeObjectURL(item.previewUrl));
        };
    }, [filesToProcess]); // Dependency array

    return (
        <div>
            <h2>Upload Photos</h2>
            <input type="file" multiple onChange={handleFileChange} />

            {filesToProcess.length > 0 && (
                <div style={{ marginTop: '10px', borderTop: '1px solid #eee', paddingTop: '10px' }}>
                    <h4>Selected Local Image Previews:</h4>
                    <ul>
                        {filesToProcess.map((item) => (
                            <li key={item.id} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}> {/* Use item.id as the key! */}
                                {item.previewUrl && (
                                    <img
                                        src={item.previewUrl}
                                        alt={`Preview of ${item.file.name}`}
                                        style={{ width: '100px', height: '100px', objectFit: 'cover', marginRight: '10px', borderRadius: '5px' }}
                                    />
                                )}
                                <span>{item.file.name}</span>
                                <button
                                    onClick={() => handleRemoveFile(item.id)} // Pass the unique ID to the remove handler
                                    style={{ marginLeft: '15px', padding: '5px 10px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                >
                                    Remove
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
