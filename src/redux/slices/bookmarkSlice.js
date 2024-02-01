import { createSlice } from "@reduxjs/toolkit"


const initialState = {
    bookmarked: []
}

export const bookmarkSlice = createSlice({
    name: 'bookmarked',
    initialState,
    reducers: {
        bookmark (state, action) {
            const item = action.payload
            const exists = state.bookmarked.find(article => article.id === item.id)
            if (exists) {
                state.bookmarked = state.bookmarked.filter(article => article.id !== item.id)
            }else {
                state.bookmarked = [item, ...state.bookmarked]
            }
        }
    }
})

const bookmarkReducer = bookmarkSlice.reducer

export const { bookmark } = bookmarkSlice.actions

export default bookmarkReducer