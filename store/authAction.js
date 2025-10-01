import { authActions } from "./authSlice";

export function fetchStore(email) {
    return (
        async function fetchDataLevel_1(dispatch) {

            async function fetchData() {
                const response = await fetch('http://localhost:4000/reduxData', {
                    method: 'post',
                    body: JSON.stringify({ email }),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                const data = await response.json();
                return data;
            }
            try {
                if (email && email !== 'null') {
                    const data = await fetchData()
                    dispatch(authActions.changeAuthState(data))
                }
            }
            catch (err) {
                console.log('err in fetching data for redux store-', err)
            }
        }
    )
}

