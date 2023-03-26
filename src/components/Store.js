import {createGlobalState } from "react-hooks-global-state"
const { setGlobalState, useGlobalState, getGlobalState} = createGlobalState ({
    contract: null,
    connectedAccount: '',
    data: [],
 
})

export {
    useGlobalState,
    setGlobalState,
    getGlobalState,

}
