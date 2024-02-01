import { useEffect, useState } from 'react'
import { BASE_URL } from '../../helpers/config'
import axios from 'axios'

export default function useTag() {
    const [tags, setTags] = useState()

    useEffect(() => {
        const fetchTags = async () => {
          try {
            const response = await axios.get(`${BASE_URL}/tags`)
              setTags(response.data.data)
          } catch (error) {
            console.log(error)
          }
        }
        fetchTags()
      }, [])

    return tags
}
