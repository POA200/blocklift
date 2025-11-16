export const NETWORK = (import.meta.env.VITE_NETWORK as string | undefined) || 'mainnet'

export const CONTRACT_ADDRESS = (import.meta.env.VITE_CONTRACT_ADDRESS as string | undefined) || ''
export const CONTRACT_NAME = (import.meta.env.VITE_CONTRACT_NAME as string | undefined) || ''

// Optional: map metric keys to specific read-only function names
// If not provided, will default to `get-<key-with-dashes>`
export const IMPACT_METRIC_FN_MAP: Record<string, string> = {
	// children_equipped: 'get-children-equipped',
	// verified_donations: 'get-verified-donations',
	// nft_proofs: 'get-nft-proofs',
	// field_ambassadors: 'get-field-ambassadors',
}

