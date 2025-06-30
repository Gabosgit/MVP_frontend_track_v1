import { Link } from "react-router-dom"

export default function ContractsDashboard({userData, contracts}) {
    const contractCards = contracts.slice(0, 3).map(contract => 
        <Link key={contract.id} to={`/contract/${contract.id}`} 
        className="flex items-center justify-between p-4 rounded-lg bg-indigo-50 hover:bg-indigo-100 dark:bg-gray-700/50
                    hover:btn-animation-r-t">
            <div>
                <h4 className="font-semibold text-gray-800 dark:text-white">{contract.name}</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">Tech Corp • $12,500</p>
            </div>
            <span className="text-xs font-bold py-1 px-3 rounded-full bg-green-200 text-green-800 dark:bg-green-800 dark:text-green-200">Active</span>
        </Link>
    )
    return (
        <div className="flex flex-col justify-between relative p-6 bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-2xl shadow-md interactive-card">       
            <div>
                <div className="absolute -mt-6 left-1/2 -translate-x-1/2 -translate-y-1/2"> {/* New positioning for myIcon */}
                    <div className="icon-gradient w-20 h-20 rounded-full flex items-center justify-center text-4xl">
                        📋
                    </div>
                </div>
                
                <div className="flex flex-col items-center my-6">
                    <h2 className="text-2xl font-bold title-gradient">
                        Contracts
                    </h2>
                    <p className="text-sm text-stone-800 dark:text-gray-400">
                        Generate professional contracts with our templates.
                    </p>
                </div>
                
                <div className="space-y-4">
                    {contractCards}
                    <div className="flex justify-end">
                        <Link to="/contract/create" className="flex text-center text-brand-indigo dark:text-indigo-300 items-center text-lg px-4 border-2 border-dashed border-indigo-300 dark:border-gray-600 rounded-xl
                        hover:bg-indigo-100 dark:hover:bg-gray-700/50 cursor-pointer"
                        >➕ <p className="text-sm font-semibold">Add New</p>
                    </Link>
                    </div>
                    
                </div>
            </div>

            <div>
                <div className="flex w-full justify-center">
                    <Link to={`/user/${userData?.id}/contracts`} className="text-sm font-semibold text-brand-indigo hover:underline">
                        - View All -
                    </Link>
                </div>
                <div className="grid grid-cols-3 gap-4 text-center my-6">
                    <div>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">$42K</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Total Revenue</p>
                    </div>
                    <div>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">15</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Contracts</p>
                    </div>
                    <div>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">92%</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Success Rate</p>
                    </div>
                </div>
                <div className="order-4 bg-transparent rounded-2xl text-center flex flex-col items-center justify-center">
                    <ul className="flex flex-col text-left list-disc list-inside text-sm space-y-1
                                    text-gray-500 dark:text-gray-400">
                        <li>Ensure you enter the mandatory fields.</li>
                        <li>Add events and milestones to the contract.</li>
                        <li>Once ready, send it to your client for approval.</li>
                    </ul>
                    <Link to="/contract/create" className="btn-primary btn-animation w-2/3 text-center font-semibold mt-4 py-2 px-4 rounded-lg hover:opacity-90 transition">
                        New Contract
                    </Link>
                </div>
            </div>
        </div>
    )
}