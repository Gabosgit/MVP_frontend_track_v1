import { Link } from "react-router-dom"

export default function ContractsDashboard({userData, contracts}) {
    const contractCards = contracts.slice(0, 3).map(contract => 
        <Link key={contract.id} to={`/contract/${contract.id}`} 
        className="flex items-center justify-between p-4 rounded-lg bg-indigo-50 hover:bg-indigo-100 dark:bg-gray-700/50">
            <div>
                <h4 className="font-semibold text-gray-800 dark:text-white">{contract.name}</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">Tech Corp • $12,500</p>
            </div>
            <span className="text-xs font-bold py-1 px-3 rounded-full bg-green-200 text-green-800 dark:bg-green-800 dark:text-green-200">Active</span>
        </Link>
    )
    return (
        <div className="flex flex-col justify-between bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-2xl shadow-md p-6 interactive-card">       
            <div>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold title-gradient">Contracts</h2>
                    <Link to={`/user/${userData?.id}/contracts`} className="text-sm font-semibold text-brand-indigo hover:underline">
                        View All
                    </Link>
                </div>
                
                <div className="space-y-4 mb-6">

                    {contractCards}

                </div>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center">
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
        </div>
    )
}