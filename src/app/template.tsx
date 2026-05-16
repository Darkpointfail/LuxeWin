/**
 * Enveloppe légère : pas d’AnimatePresence / framer-motion ici, ça évite de
 * re-monter tout l’arbre à chaque changement de route et accélère nettement le dev (HMR).
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return children;
}
