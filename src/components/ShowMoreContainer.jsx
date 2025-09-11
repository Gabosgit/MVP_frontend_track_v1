import { useState } from "react"

export default function ShowMoreContainer({text}) {
    const [showMore, setShowMore] = useState(true)

    function toggleShowMore() {
        setShowMore(prevShowMore => !prevShowMore)
    }

    return (
        <div>
            <p className="text-gray-600 text-justify text-md sm:text-lg 
            leading-relaxed overflow-hidden whitespace-pre-line">
                {!showMore ? text : text.slice(0, 300) + " ..."}
            </p>
            <div className="flex justify-end mt-1">
                <button 
                    onClick={toggleShowMore}
                    type="button"
                    className="p-2 font-bold text-blue-700"
                >
                    {!showMore ? "show less" : "show more"}
                </button>
            </div> 
        </div>
    )
}