import { useEffect } from 'react'

export default function useTitle(title) {
    useEffect(() => {
        document.title = `React Medium Clone ${title}`
    }, [title])

    return null
}