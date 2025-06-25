import { Link } from "react-router-dom";

export default function profilesDashboard({userData, profiles}) {
    console.log(profiles)
    const profileCards = profiles.slice(0, 3) // Map max. 3 profiles
        .map(profile =>
        <Link key={profile.id} to={`/profile/${profile.id}`} className="group btn-profile p-4 rounded-xl text-center">
            <div className="flex items-center justify-center font-bold w-16 h-16 mx-auto mb-2 rounded-full bg-gradient-to-r 
                text-slate-200 from-custom-purple-start to-custom-purple-end 
                group-hover:from-dark-purple-start group-hover:to-dark-purple-end group-hover:btn-animation-t
                dark:from-dark-purple-start dark:to-dark-purple-end
                dark:group-hover:from-custom-purple-start dark:group-hover:to-custom-purple-end ">
                    
                Profile
            </div>
            <h4 className="font-semibold">
                {profile.name}
            </h4>
            <p className="text-xs">
                {profile.performance_type}
            </p>
        </Link>
    )

    return (
        <div className="flex flex-col justify-between relative p-6 bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-2xl shadow-md interactive-card">       
            
            <div>
                <div className="absolute -mt-6 left-1/2 -translate-x-1/2 -translate-y-1/2"> {/* New positioning for myIcon */}
                    <div className="icon-gradient w-20 h-20 rounded-full flex items-center justify-center text-4xl">
                        👤
                    </div>
                </div>
                <div className="flex flex-col items-center my-6">
                    <h2 className="text-2xl title-gradient font-bold">
                        Profiles
                    </h2>
                    <p className="text-sm text-stone-800 dark:text-gray-400">
                        Set up professional profiles to showcase your services.
                    </p>
                </div>
                
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    {profileCards}
                    <Link to="/profile/create" 
                            className="border-2 border-dashed border-indigo-300 dark:border-gray-600 rounded-xl 
                            flex flex-col items-center justify-center text-center p-4 text-brand-indigo dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-gray-700/50 cursor-pointer">
                        <div className="text-3xl">➕</div> 
                        <p className="font-semibold">Add New</p>
                    </Link>
                </div>
            </div>
            
                        
        
            <div>
                <div className="flex w-full justify-center">
                    <Link to={`/user/${userData?.id}/profiles`} className="text-sm font-semibold text-brand-indigo hover:underline">
                        - View All -
                    </Link>
                </div>
                <div className="grid grid-cols-3 gap-4 text-center my-6">
                    <div>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white" id="profileViews">47</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Profile Views</p>
                    </div>
                    <div>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">12</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Inquiries</p>
                    </div>
                    <div>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">8</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Bookings</p>
                    </div>
                </div>
                <div className="order-4 bg-transparent rounded-2xl text-center flex flex-col items-center justify-center">
                    <ul className="flex flex-col text-left list-disc list-inside text-sm space-y-1
                                    text-gray-500 dark:text-gray-400">
                        <li>You can create many profiles to offer different services.</li>
                        <li>Add detailed information about your projects.</li>
                        <li>Select a profile to make contracts with other users.</li>
                    </ul>
                    <Link to="/profile/create" className="btn-primary btn-animation w-2/3 text-center font-semibold mt-4 py-2 px-4 rounded-lg hover:opacity-90 transition">
                        Get Started
                    </Link>
                </div>
            </div>
            
            
        </div>
    )
}