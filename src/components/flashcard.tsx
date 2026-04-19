import { motion } from 'framer-motion'

interface Props {
  question: string
  answers: string[]
  flipped: boolean
  onFlip: () => void
}

export default function Flashcard({ question, answers, flipped, onFlip }: Props) {
  return (
    <div className="w-full max-w-lg mx-auto" style={{ perspective: 1000 }}>
      <motion.button
        className="w-full cursor-pointer select-none"
        onClick={onFlip}
        style={{ transformStyle: 'preserve-3d', touchAction: 'manipulation', display: 'grid' }}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
        aria-label={flipped ? 'Card answer — tap to flip back' : 'Card question — tap to reveal answer'}
      >
        {/* Front — grid-area 1/1 stacks both faces in the same cell so the taller one sets height */}
        <div
          className="flex flex-col items-center justify-center gap-4 rounded-2xl bg-white border border-gray-200 shadow-md p-8 min-h-64"
          style={{ backfaceVisibility: 'hidden', gridArea: '1/1' }}
        >
          <p className="text-xl font-semibold text-gray-800 text-center">{question}</p>
          <p className="text-base text-gray-500">Tap to reveal answer</p>
        </div>

        {/* Back */}
        <div
          className="flex flex-col items-center justify-center gap-3 rounded-2xl bg-indigo-50 border border-indigo-200 shadow-md p-8 min-h-64"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', gridArea: '1/1' }}
        >
          {flipped && (
            <>
              <p className="text-sm font-semibold text-indigo-500 uppercase tracking-wide mb-1">
                Accepted answer{answers.length > 1 ? 's' : ''}
              </p>
              <ul className="space-y-2 text-center">
                {answers.map((a) => (
                  <li key={a} className="text-xl font-semibold text-indigo-800">{a}</li>
                ))}
              </ul>
            </>
          )}
        </div>
      </motion.button>
    </div>
  )
}
