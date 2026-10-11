 /* Reducer */


    export const initialState = {
        selectedPage : 1,
        filterRequest : 0,
        pagesNumber : 0,
        isFiltered : false,
        isLoading : false,
        filterData: {
            "Account Type": null,
            "Status": null,
            "Transaction Type": [],
            "Date": null
        },
        transactions: null
    }

    export function TransactionsReducer(state, action) 
    {
        switch (action.type) {
            case 'SET_LOADING':
                return {
                    ...state,
                    isLoading: action.isLoading
                };
            case 'SET_FILTERED':
                return {
                    ...state,
                    isFiltered: action.isFiltered
                };
            case 'SET_PAGE':
                return {
                    ...state,
                    selectedPage: action.page
                };
            case 'FLITER_REQUEST':
                return {
                    ...state,
                    isFiltered: true,
                    selectedPage: 1,
                    filterRequest: state.filterRequest + 1
                };
            case 'SET_PAGES_NUMBER':
                return {
                    ...state,
                    pagesNumber: action.pagesNumber
                };
            case "SET_TRANSACTIONS":
                return {
                    ...state,
                    transactions: action.data,
                    pagesNumber: action.data?.pagesNumber ?? 0,
                    isLoading: false
                };
            case "UPDATE_FILTER":
                return {
                    ...state,
                    filterData: action.update(state.filterData)
                };
            default:
                return state;
        }
    }

    /* ======================== Reducer ======================  */
