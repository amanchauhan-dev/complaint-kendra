import { Loader2 } from 'lucide-react'
import React from 'react'

const Loader: React.FC<{ className?: string }> = ({ className = '' }) => {
    return <Loader2 className={`animate-spin ${className} `} />
}

export default Loader