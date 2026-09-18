// The discovery context and its hook live apart from the provider
// component: a module that exports both a component and a hook cannot
// hot-reload, which broke fast refresh across all four lead types.
import { createContext, useContext } from 'react'

export const DiscoveryContext = createContext(null)

export function useDiscoveryFeedback() {
  // Outside the provider a lead still has to render, so the trigger is a
  // no-op rather than a throw.
  return useContext(DiscoveryContext) ?? { triggerDiscovery: () => {} }
}
