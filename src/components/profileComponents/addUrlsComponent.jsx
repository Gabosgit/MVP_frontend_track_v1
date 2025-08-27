

export default function addUrls() {

    return (
        <div>
            <label className="block text-lg font-medium mb-1">Social Media URLs</label>
            {socialMedia.map((media, index) => {
                // Get the titles that have already been selected, excluding the current item
                const selectedTitles = socialMedia
                .filter((_, i) => i !== index)
                .map(item => item.title);
                
                // Create the full list of unique options
                const allUniqueOptions = ['website', 'instagram', 'facebook', 'youtube', 'spotify', 'soundcloud'];
                
                // Filter the unique options
                const availableUniqueOptions = allUniqueOptions.filter(option => 
                !selectedTitles.includes(option)
                );
                
                // Always include 'other' and the currently selected unique option
                const availableOptions = [...availableUniqueOptions];
                if (media.title && !availableUniqueOptions.includes(media.title) && media.title !== 'other') {
                availableOptions.unshift(media.title);
                }
                availableOptions.push('other');
                
                return (
                <div key={index} className="flex mb-2 space-x-2 items-center">
                    <select
                    value={media.title || ''}
                    onChange={(e) => {
                        const newSocialMedia = [...socialMedia];
                        newSocialMedia[index] = { ...newSocialMedia[index], title: e.target.value, customTitle: '' };
                        setSocialMedia(newSocialMedia);
                    }}
                    className="border rounded px-3 py-2 flex-shrink-0"
                    >
                    <option value="" disabled>Select a title</option>
                    {availableOptions.map(option => (
                        <option key={option} value={option}>
                        {option.charAt(0).toUpperCase() + option.slice(1)}
                        </option>
                    ))}
                    </select>
                    
                    {media.title === 'other' ? (
                    <>
                        <input
                        type="text"
                        placeholder="Enter a custom title"
                        value={media.customTitle || ''}
                        onChange={(e) => {
                            const newSocialMedia = [...socialMedia];
                            newSocialMedia[index] = { ...newSocialMedia[index], customTitle: e.target.value };
                            setSocialMedia(newSocialMedia);
                        }}
                        className="w-1/2 border rounded px-3 py-2"
                        />
                        <input
                        type="url"
                        placeholder="https://example.com"
                        value={media.url || ''}
                        onChange={(e) => {
                            const newSocialMedia = [...socialMedia];
                            newSocialMedia[index] = { ...newSocialMedia[index], url: e.target.value };
                            setSocialMedia(newSocialMedia);
                        }}
                        className="w-1/2 border rounded px-3 py-2"
                        />
                    </>
                    ) : (
                    <input
                        type="url"
                        placeholder="https://example.com"
                        value={media.url || ''}
                        onChange={(e) => {
                        const newSocialMedia = [...socialMedia];
                        newSocialMedia[index] = { ...newSocialMedia[index], url: e.target.value };
                        setSocialMedia(newSocialMedia);
                        }}
                        className="w-full border rounded px-3 py-2"
                    />
                    )}
                </div>
                );
            })}
            <button
                type="button"
                onClick={() => setSocialMedia([...socialMedia, { title: '', url: '', customTitle: '' }])}
                className="text-blue-500 hover:underline"
            >
                Add another social media link
            </button>
        </div>
    )
}