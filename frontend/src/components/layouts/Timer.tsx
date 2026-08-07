import { useEffect, useState } from 'react'

type Props = {
    duration:number,
    onExpiry:()=>void
}

const Timer = ({ duration, onExpiry }: Props) => {
    const [timer, setTimer] = useState(duration)

    useEffect(() => {
        if (timer <= 0) {
            onExpiry()
            return
        }

        const intervalId = window.setInterval(() => {
            setTimer((prev) => {
                const next = prev - 1000
                if (next <= 0) {
                    window.clearInterval(intervalId)
                    onExpiry()
                    return 0
                }
                return next
            })
        }, 1000)

        return () => window.clearInterval(intervalId)
    }, [timer, onExpiry])

    const sec = Math.floor(timer / 1000)
    const minutes = Math.floor(sec / 60)
    const seconds = sec % 60

    return <div>{minutes}:{seconds.toString().padStart(2, '0')}</div>
}

export default Timer