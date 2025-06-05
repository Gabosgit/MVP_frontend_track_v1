export async function fetchContractAndUsers(contractId, apiBaseUrl) {
    try {
      const token = localStorage.getItem("token");
      
      // Fetch contract
      // const backend_url = import.meta.env.VITE_API_BASE_URL
      const contractResponse = await fetch(`${apiBaseUrl}/contract/${contractId}`, {
        headers: { "Authorization": `Bearer ${token}` },
      });
  
      if (!contractResponse.ok) {
        const errorData = await contractResponse.json(); // Extract JSON error response
        throw new Error(`${contractResponse.status}: ${errorData.message || "Unable to fetch contract."}`);
        }
  
      const contractData = await contractResponse.json();
  
      // Extract user IDs
      const { offeror_id, offeree_id } = contractData.contract_data;
      
      // Fetch User data of Offeror and Offeree
      // Promise.all([]) fetches offeror and offeree concurrently instead of sequentially.
      const [offerorResponse, offereeResponse] = await Promise.all([
        fetch(`${apiBaseUrl}/user/${offeror_id}`, {
          headers: { "Authorization": `Bearer ${token}` },
        }),
        fetch(`${apiBaseUrl}/user/${offeree_id}`, {
          headers: { "Authorization": `Bearer ${token}` },
        })
      ]);
  
      if (!offerorResponse.ok) throw new Error(`Error ${offerorResponse.status}: Unable to fetch offeror.`);
      if (!offereeResponse.ok) throw new Error(`Error ${offereeResponse.status}: Unable to fetch offeree.`);
  
      const offerorData = await offerorResponse.json();
      const offereeData = await offereeResponse.json();
  
      return { contract: contractData, offeror: offerorData, offeree: offereeData };
    } 
    catch (err) {
      throw new Error(err.message);
    }
  }
  