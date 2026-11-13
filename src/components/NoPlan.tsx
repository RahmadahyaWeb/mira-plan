import { Link } from 'react-router-dom'
import Mascot from './Mascot'
import { Bubble } from './Bits'

export default function NoPlan() {
  return (
    <div className="wrap flex flex-col items-center py-16 text-center">
      <Bubble side="bottom" className="max-w-sm">No plan yet! Answer six quick questions and I&apos;ll make one.</Bubble>
      <Mascot size={260} bob className="mt-6" />
      <Link to="/plan" className="btn btn-ink mt-8 !min-h-14 !px-8 !text-xl">Make my plan</Link>
    </div>
  )
}
