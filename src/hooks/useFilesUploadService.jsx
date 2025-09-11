import { useState, useEffect, useRef } from "react";


// For handling file uploads
export function useFilesUploadService() {
    const [filesToUpload, setFilesToUpload] = useState([]); // Stores all selected audio files.

    // Processes files selected by the user
    const handleSelectedFileChange = (event) => {
        const newFileItems = [];

        // The event.target.files property is a special FileList object that
        // will contain all the files the user has selected.
        // Array => converts that object into a standard JavaScript array
        const newlySelectedFiles = Array.from(event.target.files);

        // DUPLICATE check
        // forEach(...) => This loop iterates through each file the user selected.
        newlySelectedFiles.forEach(newFile => {
            // some() => method to check if the filesToUpload array already contains 
            // an item with the same name, size, and last modified date as the newFile
            // If it finds a match, isDuplicate will be true
            const isDuplicate = filesToUpload.some(item =>
                item.file.name === newFile.name &&
                item.file.size === newFile.size &&
                item.file.lastModified === newFile.lastModified
            );
            // If file not duplicated, creates a new object for it.
            if (!isDuplicate) {
                // Generates a unique ID for the new file object
                // Check if crypto is available, otherwise use a fallback
                const uniqueId = typeof crypto !== 'undefined' ? crypto.randomUUID() : newFile.name + Date.now();
                
                // A new object is created and added to the newFileItems array. 
                newFileItems.push({
                    id: uniqueId,
                    file: newFile,
                    // URL.createObjectURL(newFile): Built-in browser function. 
                    // Creates a temporary, local URL for the file so it can be played in the <audio> tag.
                    previewUrl: URL.createObjectURL(newFile), // Temporary previewUrl for playback
                    title: newFile.name // Initializes the title
                });
            }
        });
        
        // Immutability: Creates a brand new array by combining the existing filesToUpload with the newFileItems.
        const updatedFilesToUpload = [...filesToUpload, ...newFileItems];
        setFilesToUpload(updatedFilesToUpload); // Updates the state with the new, non-mutated array.
        // It updates its own state. Clears the file input field
        event.target.value = '';
    };

    // Removes a file from the filesToUpload state by unique id
    const handleRemoveSelectedFile = (idToRemove) => {
        // The find() method locates the specific file to remove
        const fileToRemove = filesToUpload.find(file => file.id === idToRemove);
        if (fileToRemove) {
            // URL.revokeObjectURL() cleans up the URL only for fileToRemove 
            // before the file is filtered out of the state
            URL.revokeObjectURL(fileToRemove.previewUrl);
        }
        // Creates a new array that includes every item except the one with a matching id
        const updatedFilesToUpload = filesToUpload.filter(item => item.id !== idToRemove);
        // Updates the state with this new array, which causes the UI to re-render.
        setFilesToUpload(updatedFilesToUpload);
    };

    const clearFilesToUpload = () => {
        filesToUpload.forEach(item => URL.revokeObjectURL(item.previewUrl));
        setFilesToUpload([]);
    };

    // MEMORY MANAGEMENT for preventing memory leaks
    useEffect(() => {
        // The return statement in a useEffect is a cleanup function.
        // The cleanup function runs only once, right before the component is completely removed from the screen.
        return () => {
            // Releases the temporary, local URL previewUrl created earlier.
            // Avoids consume more and more memory over time.
            filesToUpload.forEach(item => URL.revokeObjectURL(item.previewUrl));
        };
    }, []);

    // HOOK OUTPUT: Allows you to simply import useAudioService into any component 
    // and get all this functionality instantly
    return { filesToUpload, setFilesToUpload, handleSelectedFileChange, handleRemoveSelectedFile, clearFilesToUpload };
}