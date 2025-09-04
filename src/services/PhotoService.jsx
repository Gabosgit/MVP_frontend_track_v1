// PhotoService.jsx

import { useState, useEffect, useRef } from "react";

export function usePhotosService() {
    const [filesToProcess, setFilesToProcess] = useState([]);
    const nextId = useRef(0);

    const handleFileChange = (event) => {
        // --- Add this line back in ---
        const newFileItems = [];
        // ---
        const newlySelectedFiles = Array.from(event.target.files);

        newlySelectedFiles.forEach(newFile => {
            const isDuplicate = filesToProcess.some(item =>
                item.file.name === newFile.name &&
                item.file.size === newFile.size &&
                item.file.lastModified === newFile.lastModified
            );

            if (!isDuplicate) {
                nextId.current += 1;
                newFileItems.push({
                    id: nextId.current,
                    file: newFile,
                    previewUrl: URL.createObjectURL(newFile)
                });
            }
        });
        
        const updatedFiles = [...filesToProcess, ...newFileItems];
        setFilesToProcess(updatedFiles);

        // This no longer calls onFilesReady, it just updates its own state.
        event.target.value = '';
    };

    const handleRemoveFile = (idToRemove) => {
        const updatedFiles = filesToProcess.filter(item => item.id !== idToRemove);
        setFilesToProcess(updatedFiles);
    };

    useEffect(() => {
        return () => {
            filesToProcess.forEach(item => URL.revokeObjectURL(item.previewUrl));
        };
    }, [filesToProcess]);

    return { filesToProcess, handleFileChange, handleRemoveFile };
}