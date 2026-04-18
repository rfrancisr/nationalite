import { motion } from 'framer-motion'

interface Props {
  question: string
  answers: string[]
  flipped: boolean
  onFlip: () => void
}

export default function Flashcard({ question, answers, flipped, onFlip }: Props) {
  return (
    <div className="perspective-1000 w-full max-w-lg mx-auto" style={{ perspective: 1000 }}>
      <motion.button
        className="relative w-full min-h-64 cursor-pointer"
        onClick={onFlip}
        style={{ transformStyle: 'preserve-3d' }}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
        aria-label={flipped ? 'Card answer' : 'Card question — click to flip'}
      >
        {/* Front */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center gap-4 rounded-2xl bg-white border border-gray-200 shadow-md p-8 backface-hidden"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <p className="text-lg font-semibold text-gray-800 text-center">{question}</p>
          <p className="text-sm text-gray-400">Tap to reveal</p>
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-2xl bg-indigo-50 border border-indigo-200 shadow-md p-8"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          {flipped && (
            <>
              <p className="text-xs font-medium text-indigo-400 uppercase tracking-wide mb-1">
                Accepted answer{answers.length > 1 ? 's' : ''}
              </p>
              <ul className="space-y-1 text-center">
                {answers.map((a) => (
                  <li key={a} className="text-base font-semibold text-indigo-800">{a}</li>
                ))}
              </ul>
            </>
          )}
        </div>
      </motion.button>
    </div>
  )
}
