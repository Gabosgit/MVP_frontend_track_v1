// AudioService.jsx

import { useState, useEffect, useRef } from "react";

export function useAudioService() {
    const [audioFiles, setAudioFiles] = useState([]);
    const nextId = useRef(0);

    const handleAudioChange = (event) => {
        // --- Add this line back in ---
        const newFileItems = [];
        // ---
        const newlySelectedFiles = Array.from(event.target.files);

        newlySelectedFiles.forEach(newFile => {
            const isDuplicate = audioFiles.some(item =>
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
        
        const updatedFiles = [...audioFiles, ...newFileItems];
        setAudioFiles(updatedFiles);

        // This no longer calls onFilesReady, it just updates its own state.
        event.target.value = '';
    };

    const handleRemoveAudio = (idToRemove) => {
        const updatedFiles = audioFiles.filter(item => item.id !== idToRemove);
        setAudioFiles(updatedFiles);
    };

    useEffect(() => {
        return () => {
            audioFiles.forEach(item => URL.revokeObjectURL(item.previewUrl));
        };
    }, [audioFiles]);

    return { audioFiles, setAudioFiles, handleAudioChange, handleRemoveAudio };
}