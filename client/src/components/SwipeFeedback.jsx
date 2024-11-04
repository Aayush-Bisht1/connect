import React from 'react'
import { useMatchStore } from '../store/useMatchStore';

const SwipeFeedback = () => {
    const { SwipeFeedback } = useMatchStore();
    const getFeedbackStyle = (feedback) => {
        if (feedback === 'Liked') return 'text-green-500';
        if (feedback === 'Passed') return 'text-red-500';
        if (feedback === 'Matched') return 'text-pink-500';
    }
    const getFeedbackText = (feedback) => {
        if (feedback === 'Liked') return 'Liked!';
        if (feedback === 'Passed') return 'Passed';
        if (feedback === 'Matched') return 'It&apos;s a Match!';
    }
  return (
    <div className={`absolute top-10 left-0 right-0 text-2xl text-center font-bold ${getFeedbackStyle(SwipeFeedback)} `}>
        {
            getFeedbackText(SwipeFeedback)
        }
    </div>
  )
}

export default SwipeFeedback